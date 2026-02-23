#!/usr/bin/env python3
import csv
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROGRESSION_CSV = ROOT / "data/progression/realm_progression_v1.csv"
TRIBULATION_CSV = ROOT / "data/balance/tribulation_failure_weights_v1.csv"
OUT_DIR = ROOT / "data/sim"
OUT_CSV = OUT_DIR / "progression_timing_sim_v1.csv"
OUT_SUMMARY_CSV = OUT_DIR / "progression_timing_summary_v1.csv"

SEED = 20260223
TRIALS_PER_STAGE = 800


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def load_csv(path: Path) -> list[dict]:
    with path.open("r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def base_stage_cultivation_hours(row: dict) -> float:
    world = row["world"]
    phase = row["phase"]
    difficulty = int(row["difficulty_index"])
    qi_required = float(row["qi_required"])

    world_start_qi = {
        "mortal": 100.0,
        "immortal": 450000.0,
        "true": 60000000.0,
    }[world]
    world_base_hours = {
        "mortal": 0.20,
        "immortal": 0.34,
        "true": 0.62,
    }[world]
    phase_bonus = {
        "early": 0.00,
        "mid": 0.08,
        "late": 0.18,
        "perfect": 0.32,
        "transcendent": 0.42,
    }[phase]

    normalized = max(qi_required / world_start_qi, 1.0)
    growth_factor = normalized ** 0.09
    diff_factor = 1.0 + difficulty * 0.0009
    return world_base_hours * (1.0 + phase_bonus) * growth_factor * diff_factor


def stage_attempt_time_minutes(row: dict) -> float:
    world = row["world"]
    sub_name = row["sub_stage_name"]
    world_base = {"mortal": 4.0, "immortal": 6.0, "true": 8.5}[world]
    if sub_name == "great_perfection":
        return world_base + 2.0
    if sub_name in ("entry", "stable", "completion", "consummation"):
        return world_base + 2.8
    return world_base


def stage_recovery_minutes(row: dict) -> float:
    world = row["world"]
    world_base = {"mortal": 2.0, "immortal": 3.2, "true": 4.5}[world]
    return world_base


def retreat_penalty_hours(retreat_layers: int, row: dict, stage_hours_baseline: float) -> float:
    world_penalty = {"mortal": 0.08, "immortal": 0.14, "true": 0.22}[row["world"]]
    return retreat_layers * (stage_hours_baseline * 0.12 + world_penalty)


def death_penalty_hours(row: dict) -> float:
    world = row["world"]
    return {"mortal": 0.9, "immortal": 1.8, "true": 3.0}[world]


def risk_band(p_death: float) -> str:
    if p_death < 0.05:
        return "low"
    if p_death < 0.12:
        return "mid"
    if p_death < 0.25:
        return "high"
    return "extreme"


def sample_fail_outcome(weights: dict, rng: random.Random) -> str:
    roll = rng.uniform(0, 100)
    minor = float(weights.get("weight_minor_fail", 100.0))
    retreat = float(weights.get("weight_retreat_fail", 0.0))
    if roll < minor:
        return "minor"
    if roll < minor + retreat:
        return "retreat"
    return "death"


def simulate_stage(row: dict, fail_weights: dict | None, rng: random.Random) -> dict:
    p_success = clamp(float(row["base_breakthrough_success_pct"]) / 100.0, 0.05, 0.95)
    p_death = clamp(float(row["base_death_pct"]) / 100.0, 0.0, 0.9)

    stage_qi_hours = base_stage_cultivation_hours(row)

    attempt_minutes = stage_attempt_time_minutes(row)
    recovery_minutes = stage_recovery_minutes(row)

    stage_hours_trials = []
    death_trials = 0

    retreat_min = int(row["fail_retreat_min"])
    retreat_max = int(row["fail_retreat_max"])

    for _ in range(TRIALS_PER_STAGE):
        hours = stage_qi_hours
        while True:
            hours += attempt_minutes / 60.0
            if rng.random() < p_success:
                break

            hours += recovery_minutes / 60.0

            if int(row["is_tribulation"]) == 1:
                if fail_weights is None:
                    if rng.random() < p_death:
                        death_trials += 1
                        hours += death_penalty_hours(row)
                    continue

                outcome = sample_fail_outcome(fail_weights, rng)
                if outcome == "minor":
                    hours += stage_qi_hours * 0.05
                elif outcome == "retreat":
                    layers = retreat_min if retreat_max <= retreat_min else rng.randint(retreat_min, retreat_max)
                    hours += retreat_penalty_hours(layers, row, stage_qi_hours)
                else:
                    death_trials += 1
                    hours += death_penalty_hours(row)

        stage_hours_trials.append(hours)

    expected_hours = sum(stage_hours_trials) / len(stage_hours_trials)
    death_rate_est = death_trials / TRIALS_PER_STAGE

    return {
        "expected_stage_hours": round(expected_hours, 4),
        "expected_death_rate": round(death_rate_est, 4),
        "p_success": round(p_success, 4),
        "p_death": round(p_death, 4),
    }


def main() -> None:
    rng = random.Random(SEED)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    progression_rows = load_csv(PROGRESSION_CSV)
    fail_rows = load_csv(TRIBULATION_CSV)
    fail_by_difficulty = {int(r["difficulty_index"]): r for r in fail_rows}

    out_rows = []
    cumulative_hours = 0.0
    cumulative_deaths = 0.0

    for row in progression_rows:
        difficulty = int(row["difficulty_index"])
        sim = simulate_stage(row, fail_by_difficulty.get(difficulty), rng)

        cumulative_hours += sim["expected_stage_hours"]
        cumulative_deaths += sim["expected_death_rate"]

        out_rows.append(
            {
                "difficulty_index": difficulty,
                "world": row["world"],
                "major_stage_name": row["major_stage_name"],
                "sub_stage_name": row["sub_stage_name"],
                "is_tribulation": row["is_tribulation"],
                "base_breakthrough_success_pct": row["base_breakthrough_success_pct"],
                "base_death_pct": row["base_death_pct"],
                "expected_stage_hours": sim["expected_stage_hours"],
                "expected_cumulative_hours": round(cumulative_hours, 4),
                "expected_death_rate": sim["expected_death_rate"],
                "expected_cumulative_deaths": round(cumulative_deaths, 4),
                "risk_band": risk_band(sim["expected_death_rate"]),
            }
        )

    with OUT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(out_rows[0].keys()))
        writer.writeheader()
        writer.writerows(out_rows)

    world_summary = {}
    for row in out_rows:
        world = row["world"]
        bucket = world_summary.setdefault(
            world,
            {
                "world": world,
                "stage_count": 0,
                "expected_world_hours": 0.0,
                "expected_world_deaths": 0.0,
                "avg_stage_hours": 0.0,
                "avg_stage_death_rate": 0.0,
            },
        )
        bucket["stage_count"] += 1
        bucket["expected_world_hours"] += float(row["expected_stage_hours"])
        bucket["expected_world_deaths"] += float(row["expected_death_rate"])

    for bucket in world_summary.values():
        count = bucket["stage_count"]
        bucket["expected_world_hours"] = round(bucket["expected_world_hours"], 4)
        bucket["expected_world_deaths"] = round(bucket["expected_world_deaths"], 4)
        bucket["avg_stage_hours"] = round(bucket["expected_world_hours"] / count, 4)
        bucket["avg_stage_death_rate"] = round(bucket["expected_world_deaths"] / count, 4)

    summary_rows = [world_summary[k] for k in ("mortal", "immortal", "true") if k in world_summary]
    with OUT_SUMMARY_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(summary_rows[0].keys()))
        writer.writeheader()
        writer.writerows(summary_rows)

    print(f"wrote stage simulation -> {OUT_CSV} ({len(out_rows)} rows)")
    print(f"wrote summary simulation -> {OUT_SUMMARY_CSV} ({len(summary_rows)} rows)")


if __name__ == "__main__":
    main()
