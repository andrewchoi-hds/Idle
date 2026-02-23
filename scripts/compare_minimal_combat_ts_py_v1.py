#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
TS_DUMP_SCRIPT = ROOT / "scripts/dump_minimal_combat_ts_v1.ts"
PY_DUMP_SCRIPT = ROOT / "scripts/simulate_minimal_combat_v1.py"
DEFAULT_TS_REPORT = ROOT / "data/sim/minimal_combat_report_ts_v1.json"
DEFAULT_PY_REPORT = ROOT / "data/sim/minimal_combat_report_v1.json"


@dataclass
class DuelNorm:
    monster_id: str
    winner: str
    turns: float
    elapsed_sec: float
    player_hp_left: float
    monster_hp_left: float


@dataclass
class ReportNorm:
    config: dict[str, Any]
    summary: dict[str, float]
    duels: list[DuelNorm]


@dataclass
class CompareScenario:
    name: str
    difficulty_index: int
    player_level: int
    rebirth_count: int
    seed: int
    max_turns: int
    skill_ids: list[str]
    monster_ids: list[str]
    include_action_log: bool


def to_float(raw: Any, fallback: float = 0.0) -> float:
    try:
        value = float(raw)
    except (TypeError, ValueError):
        return fallback
    if value != value or value in (float("inf"), float("-inf")):
        return fallback
    return value


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compare minimal combat reports from TS and Python implementations."
    )
    parser.add_argument("--difficulty-index", type=int, default=20)
    parser.add_argument("--player-level", type=int, default=30)
    parser.add_argument("--rebirth-count", type=int, default=2)
    parser.add_argument("--seed", type=int, default=20260223)
    parser.add_argument("--max-turns", type=int, default=180)
    parser.add_argument("--skill-id", action="append", dest="skill_ids")
    parser.add_argument("--monster-id", action="append", dest="monster_ids")
    parser.add_argument("--include-action-log", action="store_true")
    parser.add_argument("--scenario-file", type=Path)
    parser.add_argument("--ts-report", type=Path, default=DEFAULT_TS_REPORT)
    parser.add_argument("--py-report", type=Path, default=DEFAULT_PY_REPORT)
    parser.add_argument("--max-win-rate-delta", type=float, default=0.000001)
    parser.add_argument("--max-turn-delta", type=float, default=0.0)
    parser.add_argument("--max-elapsed-delta", type=float, default=0.0005)
    parser.add_argument("--max-player-hp-delta", type=float, default=0.01)
    parser.add_argument("--max-monster-hp-delta", type=float, default=0.01)
    return parser.parse_args()


def parse_string_list(raw: Any, fallback: list[str], field_name: str) -> list[str]:
    if raw is None:
        return list(fallback)
    if not isinstance(raw, list):
        raise SystemExit(f"{field_name} must be a list of strings")

    cleaned: list[str] = []
    for idx, item in enumerate(raw):
        if not isinstance(item, str):
            raise SystemExit(f"{field_name}[{idx}] must be a string")
        value = item.strip()
        if not value:
            raise SystemExit(f"{field_name}[{idx}] must not be empty")
        cleaned.append(value)

    if not cleaned:
        raise SystemExit(f"{field_name} must have at least one item")
    return cleaned


def parse_cli_list(raw_ids: list[str] | None, fallback: list[str]) -> list[str]:
    if raw_ids is None:
        return list(fallback)
    return parse_string_list(raw_ids, fallback, "cli_ids")


def parse_bool(raw: Any, default: bool, field_name: str) -> bool:
    if raw is None:
        return default
    if isinstance(raw, bool):
        return raw
    if isinstance(raw, int):
        return raw != 0
    if isinstance(raw, str):
        normalized = raw.strip().lower()
        if normalized in ("1", "true", "yes", "y", "on"):
            return True
        if normalized in ("0", "false", "no", "n", "off"):
            return False
    raise SystemExit(f"{field_name} must be a boolean value")


def default_scenario_from_args(args: argparse.Namespace) -> CompareScenario:
    return CompareScenario(
        name="single",
        difficulty_index=max(1, args.difficulty_index),
        player_level=max(1, args.player_level),
        rebirth_count=max(0, args.rebirth_count),
        seed=args.seed,
        max_turns=max(10, args.max_turns),
        skill_ids=parse_cli_list(args.skill_ids, ["sk_atk_001", "sk_atk_002"]),
        monster_ids=parse_cli_list(
            args.monster_ids,
            ["mob_m_001", "mob_m_003", "mob_m_008"],
        ),
        include_action_log=bool(args.include_action_log),
    )


def to_int(raw: Any, fallback: int) -> int:
    try:
        parsed = int(raw)
    except (TypeError, ValueError):
        return fallback
    return parsed


def load_scenarios(path: Path, defaults: CompareScenario) -> list[CompareScenario]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    entries: list[Any]
    if isinstance(raw, dict):
        maybe_entries = raw.get("scenarios", [])
        if not isinstance(maybe_entries, list):
            raise SystemExit("scenario file has invalid 'scenarios' format")
        entries = maybe_entries
    elif isinstance(raw, list):
        entries = raw
    else:
        raise SystemExit("scenario file must be a list or an object with 'scenarios'")

    scenarios: list[CompareScenario] = []
    for idx, entry in enumerate(entries, start=1):
        if not isinstance(entry, dict):
            raise SystemExit(f"scenario[{idx}] is not an object")
        name = str(entry.get("name") or f"scenario_{idx}")
        scenarios.append(
            CompareScenario(
                name=name,
                difficulty_index=max(
                    1,
                    to_int(entry.get("difficulty_index"), defaults.difficulty_index),
                ),
                player_level=max(
                    1,
                    to_int(entry.get("player_level"), defaults.player_level),
                ),
                rebirth_count=max(
                    0,
                    to_int(entry.get("rebirth_count"), defaults.rebirth_count),
                ),
                seed=to_int(entry.get("seed"), defaults.seed),
                max_turns=max(10, to_int(entry.get("max_turns"), defaults.max_turns)),
                skill_ids=parse_string_list(
                    entry.get("skill_ids"),
                    defaults.skill_ids,
                    f"scenario[{idx}].skill_ids",
                ),
                monster_ids=parse_string_list(
                    entry.get("monster_ids"),
                    defaults.monster_ids,
                    f"scenario[{idx}].monster_ids",
                ),
                include_action_log=parse_bool(
                    entry.get("include_action_log"),
                    defaults.include_action_log,
                    f"scenario[{idx}].include_action_log",
                ),
            )
        )

    if not scenarios:
        raise SystemExit("scenario file has no scenarios")
    return scenarios


def build_common_args(scenario: CompareScenario) -> list[str]:
    cmd: list[str] = [
        "--difficulty-index",
        str(scenario.difficulty_index),
        "--player-level",
        str(scenario.player_level),
        "--rebirth-count",
        str(scenario.rebirth_count),
        "--seed",
        str(scenario.seed),
        "--max-turns",
        str(scenario.max_turns),
    ]

    for skill_id in scenario.skill_ids:
        cmd += ["--skill-id", skill_id]
    for monster_id in scenario.monster_ids:
        cmd += ["--monster-id", monster_id]

    if not scenario.include_action_log:
        cmd += ["--no-action-log"]
    return cmd


def run_or_raise(cmd: list[str]) -> None:
    completed = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if completed.returncode == 0:
        return
    if completed.stdout:
        sys.stdout.write(completed.stdout)
    if completed.stderr:
        sys.stderr.write(completed.stderr)
    raise SystemExit(f"command failed: {' '.join(cmd)}")


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def slugify(raw: str) -> str:
    out = []
    for ch in raw.lower():
        if ch.isalnum():
            out.append(ch)
        else:
            out.append("_")
    slug = "".join(out).strip("_")
    while "__" in slug:
        slug = slug.replace("__", "_")
    return slug or "scenario"


def norm_report(raw: dict[str, Any]) -> ReportNorm:
    config_raw = raw.get("config", {})
    summary_raw = raw.get("summary", {})

    config = {
        "difficulty_index": int(
            config_raw.get("difficulty_index", config_raw.get("difficultyIndex", 0))
        ),
        "player_level": int(config_raw.get("player_level", config_raw.get("playerLevel", 0))),
        "rebirth_count": int(
            config_raw.get("rebirth_count", config_raw.get("rebirthCount", 0))
        ),
        "seed": int(config_raw.get("seed", config_raw.get("rngSeed", 0))),
        "max_turns": int(
            config_raw.get("max_turns", config_raw.get("maxTurnsPerBattle", 0))
        ),
        "skill_ids": list(config_raw.get("skill_ids", config_raw.get("skillIds", []))),
        "monster_ids": list(config_raw.get("monster_ids", config_raw.get("monsterIds", []))),
    }

    summary = {
        "total": float(summary_raw.get("total", 0)),
        "wins": float(summary_raw.get("wins", 0)),
        "losses": float(summary_raw.get("losses", 0)),
        "win_rate": to_float(summary_raw.get("win_rate", summary_raw.get("winRate", 0))),
        "avg_turns": to_float(summary_raw.get("avg_turns", summary_raw.get("avgTurns", 0))),
        "avg_elapsed_sec": to_float(
            summary_raw.get("avg_elapsed_sec", summary_raw.get("avgElapsedSec", 0))
        ),
    }

    duels: list[DuelNorm] = []
    for duel in raw.get("duels", []):
        duels.append(
            DuelNorm(
                monster_id=str(duel.get("monster_id", duel.get("monsterId", ""))),
                winner=str(duel.get("winner", "")),
                turns=to_float(duel.get("turns", 0)),
                elapsed_sec=to_float(duel.get("elapsed_sec", duel.get("elapsedSec", 0))),
                player_hp_left=to_float(
                    duel.get("player_hp_left", duel.get("playerHpLeft", 0))
                ),
                monster_hp_left=to_float(
                    duel.get("monster_hp_left", duel.get("monsterHpLeft", 0))
                ),
            )
        )

    return ReportNorm(config=config, summary=summary, duels=duels)


def diff_reports(
    py_report: ReportNorm,
    ts_report: ReportNorm,
    args: argparse.Namespace,
) -> list[str]:
    errors: list[str] = []

    for key in (
        "difficulty_index",
        "player_level",
        "rebirth_count",
        "seed",
        "max_turns",
        "skill_ids",
        "monster_ids",
    ):
        if py_report.config.get(key) != ts_report.config.get(key):
            errors.append(
                f"config mismatch: {key} py={py_report.config.get(key)} ts={ts_report.config.get(key)}"
            )

    summary_deltas = {
        "win_rate": abs(py_report.summary["win_rate"] - ts_report.summary["win_rate"]),
        "avg_turns": abs(py_report.summary["avg_turns"] - ts_report.summary["avg_turns"]),
        "avg_elapsed_sec": abs(
            py_report.summary["avg_elapsed_sec"] - ts_report.summary["avg_elapsed_sec"]
        ),
    }
    if summary_deltas["win_rate"] > max(0.0, args.max_win_rate_delta):
        errors.append(
            f"summary delta exceeded: win_rate delta={summary_deltas['win_rate']:.4f}"
        )

    if len(py_report.duels) != len(ts_report.duels):
        errors.append(
            f"duel length mismatch: py={len(py_report.duels)} ts={len(ts_report.duels)}"
        )
        return errors

    for idx, (py_duel, ts_duel) in enumerate(zip(py_report.duels, ts_report.duels), start=1):
        label = f"duel#{idx}:{py_duel.monster_id}"
        if py_duel.monster_id != ts_duel.monster_id:
            errors.append(f"{label} monster_id mismatch ts={ts_duel.monster_id}")
            continue
        if py_duel.winner != ts_duel.winner:
            errors.append(f"{label} winner mismatch py={py_duel.winner} ts={ts_duel.winner}")

        turn_delta = abs(py_duel.turns - ts_duel.turns)
        elapsed_delta = abs(py_duel.elapsed_sec - ts_duel.elapsed_sec)
        player_hp_delta = abs(py_duel.player_hp_left - ts_duel.player_hp_left)
        monster_hp_delta = abs(py_duel.monster_hp_left - ts_duel.monster_hp_left)

        if turn_delta > max(0.0, args.max_turn_delta):
            errors.append(f"{label} turns delta exceeded: {turn_delta:.3f}")
        if elapsed_delta > max(0.0, args.max_elapsed_delta):
            errors.append(f"{label} elapsed_sec delta exceeded: {elapsed_delta:.3f}")
        if player_hp_delta > max(0.0, args.max_player_hp_delta):
            errors.append(f"{label} player_hp_left delta exceeded: {player_hp_delta:.3f}")
        if monster_hp_delta > max(0.0, args.max_monster_hp_delta):
            errors.append(f"{label} monster_hp_left delta exceeded: {monster_hp_delta:.3f}")

    return errors


def print_delta_summary(
    py_report: ReportNorm,
    ts_report: ReportNorm,
    scenario_name: str,
) -> None:
    print(f"[combat-diff] summary scenario={scenario_name}")
    print(
        "  win_rate:"
        f" py={py_report.summary['win_rate']:.4f}"
        f" ts={ts_report.summary['win_rate']:.4f}"
        f" delta={abs(py_report.summary['win_rate'] - ts_report.summary['win_rate']):.4f}"
    )
    print(
        "  avg_turns:"
        f" py={py_report.summary['avg_turns']:.3f}"
        f" ts={ts_report.summary['avg_turns']:.3f}"
        f" delta={abs(py_report.summary['avg_turns'] - ts_report.summary['avg_turns']):.3f}"
    )
    print(
        "  avg_elapsed_sec:"
        f" py={py_report.summary['avg_elapsed_sec']:.3f}"
        f" ts={ts_report.summary['avg_elapsed_sec']:.3f}"
        f" delta={abs(py_report.summary['avg_elapsed_sec'] - ts_report.summary['avg_elapsed_sec']):.3f}"
    )

    for idx, (py_duel, ts_duel) in enumerate(zip(py_report.duels, ts_report.duels), start=1):
        print(
            "  duel#"
            f"{idx} {py_duel.monster_id}:"
            f" winner(py/ts)={py_duel.winner}/{ts_duel.winner},"
            f" turns_delta={abs(py_duel.turns - ts_duel.turns):.3f},"
            f" elapsed_delta={abs(py_duel.elapsed_sec - ts_duel.elapsed_sec):.3f},"
            f" player_hp_delta={abs(py_duel.player_hp_left - ts_duel.player_hp_left):.3f},"
            f" monster_hp_delta={abs(py_duel.monster_hp_left - ts_duel.monster_hp_left):.3f}"
        )


def run_single_scenario(
    args: argparse.Namespace,
    scenario: CompareScenario,
    ts_report_path: Path,
) -> tuple[ReportNorm, ReportNorm]:
    common_args = build_common_args(scenario)
    ts_report_path.parent.mkdir(parents=True, exist_ok=True)

    ts_cmd = [
        "npx",
        "tsx",
        str(TS_DUMP_SCRIPT),
        "--output",
        str(ts_report_path),
        *common_args,
    ]
    py_cmd = [str(PY_DUMP_SCRIPT), *common_args]

    run_or_raise(ts_cmd)
    run_or_raise(py_cmd)

    py_raw = read_json(args.py_report)
    ts_raw = read_json(ts_report_path)
    py_report = norm_report(py_raw)
    ts_report = norm_report(ts_raw)
    return py_report, ts_report


def main() -> None:
    args = parse_args()
    default_scenario = default_scenario_from_args(args)
    scenario_file = args.scenario_file

    scenarios = (
        load_scenarios(scenario_file, default_scenario)
        if scenario_file is not None
        else [default_scenario]
    )

    all_errors: list[str] = []
    suite_mode = len(scenarios) > 1

    for idx, scenario in enumerate(scenarios, start=1):
        if suite_mode:
            print(f"[combat-diff] running scenario {idx}/{len(scenarios)}: {scenario.name}")
            slug = slugify(scenario.name)
            ts_report_path = args.ts_report.with_name(
                f"{args.ts_report.stem}_{slug}{args.ts_report.suffix}"
            )
        else:
            print(f"[combat-diff] running scenario: {scenario.name}")
            ts_report_path = args.ts_report

        py_report, ts_report = run_single_scenario(args, scenario, ts_report_path)
        print_delta_summary(py_report, ts_report, scenario.name)

        errors = diff_reports(py_report, ts_report, args)
        if errors:
            print(f"[combat-diff] FAILED scenario={scenario.name}")
            for error in errors:
                tagged = f"{scenario.name}: {error}"
                all_errors.append(tagged)
                print(f"  - {tagged}")
        else:
            print(f"[combat-diff] PASS scenario={scenario.name}")

    if all_errors:
        print("[combat-diff] SUITE FAILED")
        raise SystemExit(1)

    print("[combat-diff] SUITE PASS")


if __name__ == "__main__":
    main()
