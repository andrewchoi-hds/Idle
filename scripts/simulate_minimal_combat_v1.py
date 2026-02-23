#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any
from decimal import Decimal, ROUND_HALF_UP

ROOT = Path(__file__).resolve().parent.parent
PROGRESSION_CSV = ROOT / "data/progression/realm_progression_v1.csv"
STAT_GROWTH_CSV = ROOT / "data/system/stat_growth_coeffs_v1.csv"
COMBAT_CONSTANTS_CSV = ROOT / "data/balance/combat_constants_v1.csv"
SKILLS_CSV = ROOT / "data/combat/skills_v1.csv"
MONSTERS_CSV = ROOT / "data/combat/monsters_v1.csv"

OUT_DIR = ROOT / "data/sim"
OUT_REPORT_JSON = OUT_DIR / "minimal_combat_report_v1.json"
OUT_SUMMARY_CSV = OUT_DIR / "minimal_combat_summary_v1.csv"
OUT_ACTION_LOG_CSV = OUT_DIR / "minimal_combat_action_log_v1.csv"

DEFAULT_CONFIG = {
    "difficulty_index": 20,
    "player_level": 30,
    "rebirth_count": 2,
    "seed": 20260223,
    "max_turns": 180,
    "skill_ids": ["sk_atk_001", "sk_atk_002"],
    "monster_ids": ["mob_m_001", "mob_m_003", "mob_m_008"],
    "include_action_logs": True,
}

SUPPORTED_ELEMENTS = {"fire", "ice", "thunder", "wind", "earth"}
SUPPORTED_STATUSES = {"burn", "slow", "stun", "armor_break", "weaken"}


def clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def round_half_up(value: float, digits: int = 0) -> float:
    if digits < 0:
        raise ValueError("digits must be >= 0")
    quant = Decimal("1") if digits == 0 else Decimal(f"1e-{digits}")
    return float(Decimal(str(value)).quantize(quant, rounding=ROUND_HALF_UP))


def js_round_int(value: float) -> int:
    return int(round_half_up(value, 0))


def to_fixed(value: float, digits: int) -> float:
    return round_half_up(value, digits)


def to_float(raw: Any, fallback: float = 0.0) -> float:
    try:
        value = float(raw)
    except (TypeError, ValueError):
        return fallback
    if value != value or value in (float("inf"), float("-inf")):
        return fallback
    return value


def normalize_element(raw: str) -> str:
    v = raw.strip().lower()
    if v == "wood":
        return "earth"
    if v == "metal":
        return "thunder"
    if v in SUPPORTED_ELEMENTS:
        return v
    return "none"


def get_monster_mechanic_rule(tag: str) -> dict[str, Any] | None:
    if tag == "burn_claw":
        return {
            "on_hit_status": {
                "type": "burn",
                "chance": 0.42,
                "duration_sec": 4.0,
                "source_atk_scale": 0.9,
            }
        }
    if tag == "burn_field":
        return {
            "on_hit_status": {
                "type": "burn",
                "chance": 0.35,
                "duration_sec": 4.5,
                "source_atk_scale": 0.9,
            }
        }
    if tag == "burn_stack":
        return {
            "on_hit_status": {
                "type": "burn",
                "chance": 0.45,
                "duration_sec": 5.0,
                "source_atk_scale": 0.95,
            }
        }
    if tag == "root_bind":
        return {
            "on_hit_status": {
                "type": "stun",
                "chance": 0.26,
                "duration_sec": 1.4,
            }
        }
    if tag == "frozen_prison":
        return {
            "on_hit_status": {
                "type": "stun",
                "chance": 0.30,
                "duration_sec": 1.6,
            }
        }
    if tag == "time_stop":
        return {
            "on_hit_status": {
                "type": "stun",
                "chance": 0.34,
                "duration_sec": 1.6,
            }
        }
    if tag == "slow_aura":
        return {
            "on_hit_status": {
                "type": "slow",
                "chance": 0.70,
                "duration_sec": 4.5,
            }
        }
    if tag == "slow_field":
        return {
            "on_hit_status": {
                "type": "slow",
                "chance": 0.62,
                "duration_sec": 4.0,
            }
        }
    if tag == "charm_gaze":
        return {
            "on_hit_status": {
                "type": "slow",
                "chance": 0.58,
                "duration_sec": 3.8,
            }
        }
    if tag in ("armor_break", "time_cut"):
        return {
            "on_hit_status": {
                "type": "armor_break",
                "chance": 0.56,
                "duration_sec": 4.0,
            }
        }
    if tag in ("law_suppress", "fear_aura"):
        return {
            "on_hit_status": {
                "type": "weaken",
                "chance": 0.55,
                "duration_sec": 4.2,
            }
        }
    if tag == "poison_stack":
        return {
            "on_hit_status": {
                "type": "burn",
                "chance": 0.38,
                "duration_sec": 4.5,
                "source_atk_scale": 0.75,
            }
        }
    if tag in ("chain_lightning", "thunderstorm", "judgment_mark", "triple_tribulation"):
        return {
            "on_hit_status": {
                "type": "stun",
                "chance": 0.18,
                "duration_sec": 1.0,
            }
        }
    if tag == "high_crit":
        return {"passive_crit_rate_add": 0.08}
    if tag == "high_def":
        return {
            "passive_def_multiplier": 1.14,
            "passive_damage_reduction_add": 0.08,
        }
    if tag == "adaptive_armor":
        return {
            "passive_def_multiplier": 1.12,
            "passive_damage_reduction_add": 0.06,
        }
    if tag == "law_barrier":
        return {
            "passive_def_multiplier": 1.18,
            "passive_damage_reduction_add": 0.16,
        }
    if tag == "shield_cast":
        return {"passive_damage_reduction_add": 0.12}
    if tag == "invuln_phase":
        return {"passive_damage_reduction_add": 0.18}
    if tag in ("blink_strike", "multi_dash", "phase_shift"):
        return {"first_strike_damage_multiplier": 1.28}
    if tag == "execute_mark":
        return {
            "execute_bonus": {
                "target_hp_below_ratio": 0.35,
                "damage_multiplier": 1.30,
            }
        }
    if tag == "soul_harvest":
        return {
            "execute_bonus": {
                "target_hp_below_ratio": 0.30,
                "damage_multiplier": 1.35,
            }
        }
    if tag == "origin_tribulation":
        return {
            "execute_bonus": {
                "target_hp_below_ratio": 0.45,
                "damage_multiplier": 1.40,
            }
        }
    if tag == "heal_link":
        return {"on_hit_heal_ratio": 0.08}
    return None


class SeededRng:
    def __init__(self, seed: int):
        normalized = seed & 0xFFFFFFFF
        self.state = normalized if normalized != 0 else 0x12345678

    def next(self) -> float:
        x = self.state & 0xFFFFFFFF
        x ^= ((x << 13) & 0xFFFFFFFF)
        x ^= (x >> 17)
        x ^= ((x << 5) & 0xFFFFFFFF)
        self.state = x & 0xFFFFFFFF
        return self.state / 0x100000000


def is_element_advantage(attacker: str, defender: str) -> bool:
    table = {
        "fire": "wind",
        "wind": "earth",
        "earth": "thunder",
        "thunder": "ice",
        "ice": "fire",
    }
    return table.get(attacker) == defender


def calc_element_multiplier(attacker_element: str, defender_element: str, constants: dict[str, float]) -> float:
    bonus = constants.get("element_advantage_bonus", 0.25)
    penalty = constants.get("element_disadvantage_penalty", -0.20)

    if is_element_advantage(attacker_element, defender_element):
        return 1 + bonus
    if is_element_advantage(defender_element, attacker_element):
        return max(0.10, 1 + penalty)
    return 1.0


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Simulate minimal combat prototype loop.")
    parser.add_argument("--difficulty-index", type=int, default=DEFAULT_CONFIG["difficulty_index"])
    parser.add_argument("--player-level", type=int, default=DEFAULT_CONFIG["player_level"])
    parser.add_argument("--rebirth-count", type=int, default=DEFAULT_CONFIG["rebirth_count"])
    parser.add_argument("--seed", type=int, default=DEFAULT_CONFIG["seed"])
    parser.add_argument("--max-turns", type=int, default=DEFAULT_CONFIG["max_turns"])
    parser.add_argument(
        "--skill-id",
        action="append",
        dest="skill_ids",
        help="repeatable, up to 2 effective active skills",
    )
    parser.add_argument(
        "--monster-id",
        action="append",
        dest="monster_ids",
        help="repeatable, up to 3 effective monsters",
    )
    parser.add_argument("--no-action-log", action="store_true")
    return parser.parse_args()


def build_config(args: argparse.Namespace) -> dict[str, Any]:
    return {
        "difficulty_index": max(1, args.difficulty_index),
        "player_level": max(1, args.player_level),
        "rebirth_count": max(0, args.rebirth_count),
        "seed": args.seed,
        "max_turns": max(10, args.max_turns),
        "skill_ids": args.skill_ids if args.skill_ids else list(DEFAULT_CONFIG["skill_ids"]),
        "monster_ids": args.monster_ids if args.monster_ids else list(DEFAULT_CONFIG["monster_ids"]),
        "include_action_logs": not args.no_action_log,
    }


def get_progression_row(rows: list[dict[str, str]], difficulty_index: int) -> dict[str, str]:
    for row in rows:
        if int(row["difficulty_index"]) == difficulty_index:
            return row
    raise SystemExit(f"missing progression row for difficulty_index={difficulty_index}")


def stat_rows_by_id(rows: list[dict[str, str]]) -> dict[str, dict[str, str]]:
    return {row["stat_id"]: row for row in rows}


def combat_constants_by_key(rows: list[dict[str, str]]) -> dict[str, float]:
    out: dict[str, float] = {}
    for row in rows:
        value = to_float(row.get("value"), 0.0)
        out[row["key"]] = value
    return out


def apply_soft_hard_cap(raw: float, soft_cap_start: float, hard_cap: float, soft_slope: float) -> float:
    if hard_cap < 0:
        return raw

    value = raw
    if soft_cap_start >= 0 and soft_slope > 0 and value > soft_cap_start:
        value = soft_cap_start + (value - soft_cap_start) * soft_slope

    return min(value, hard_cap)


def calc_player_stat(
    stat_rows: dict[str, dict[str, str]],
    stat_id: str,
    player_level: int,
    major_stage_index: int,
    sub_stage_index: int,
    rebirth_count: int,
) -> float:
    row = stat_rows.get(stat_id)
    if row is None:
        raise SystemExit(f"missing stat row: {stat_id}")

    base_value = to_float(row["base_value"])
    per_level = to_float(row["per_player_level"])
    per_major = to_float(row["per_major_stage"])
    per_sub = to_float(row["per_sub_stage"])
    rebirth_scale_pct = to_float(row["rebirth_scale_pct"])

    hard_cap = to_float(row["hard_cap"], -1)
    soft_cap_start = to_float(row["soft_cap_start"], -1)
    soft_cap_slope = to_float(row["soft_cap_slope"], -1)

    raw = (
        base_value
        + per_level * max(0, player_level - 1)
        + per_major * max(0, major_stage_index - 1)
        + per_sub * max(0, sub_stage_index - 1)
    )

    rebirth_scaled = raw * (1 + max(0, rebirth_count) * rebirth_scale_pct * 0.01)
    return apply_soft_hard_cap(rebirth_scaled, soft_cap_start, hard_cap, soft_cap_slope)


def build_player_stats(
    stat_rows: dict[str, dict[str, str]],
    progression: dict[str, str],
    config: dict[str, Any],
    constants: dict[str, float],
) -> dict[str, float]:
    major_idx = int(progression["major_stage_index"])
    sub_idx = int(progression["sub_stage_index"])

    def s(stat_id: str) -> float:
        return calc_player_stat(
            stat_rows,
            stat_id,
            config["player_level"],
            major_idx,
            sub_idx,
            config["rebirth_count"],
        )

    accuracy_floor = constants.get("accuracy_floor", 0.55)
    accuracy_ceiling = constants.get("accuracy_ceiling", 0.98)
    crit_rate_cap = constants.get("crit_rate_cap", 0.75)
    evasion_cap = constants.get("evasion_cap", 0.60)
    damage_reduction_cap = constants.get("damage_reduction_cap", 0.70)

    return {
        "hp": s("hp"),
        "mp": s("mp"),
        "atk": s("atk"),
        "def": s("def"),
        "speed": max(0.2, s("speed")),
        "accuracy": clamp(s("accuracy"), accuracy_floor, accuracy_ceiling),
        "evasion": clamp(s("evasion"), 0.0, evasion_cap),
        "crit_rate": clamp(s("crit_rate"), 0.0, crit_rate_cap),
        "crit_damage": max(0.0, s("crit_damage")),
        "penetration": clamp(s("penetration"), 0.0, 0.65),
        "damage_reduction": clamp(s("damage_reduction"), 0.0, damage_reduction_cap),
    }


def pick_skills(skill_rows: list[dict[str, str]], config: dict[str, Any]) -> list[dict[str, Any]]:
    by_id = {row["skill_id"]: row for row in skill_rows}

    picked: list[dict[str, Any]] = []
    for skill_id in config["skill_ids"]:
        row = by_id.get(skill_id)
        if row is None:
            continue
        damage_coeff = to_float(row["damage_coeff"])
        if row["category"] != "active" or damage_coeff <= 0:
            continue
        picked.append(
            {
                "skill_id": row["skill_id"],
                "name_ko": row["name_ko"],
                "damage_coeff": damage_coeff,
                "cooldown_sec": max(0.0, to_float(row["cooldown_sec"])),
                "cost_mp": max(0.0, to_float(row["cost_mp"])),
                "element": normalize_element(row["element"]),
                "status_effect": row["status_effect"],
                "status_chance_pct": max(0.0, to_float(row["status_chance_pct"])),
                "status_duration_sec": max(0.0, to_float(row["status_duration_sec"])),
            }
        )

    if len(picked) >= 2:
        return picked[:2]

    fallback = [
        row
        for row in skill_rows
        if row["category"] == "active"
        and row["world_unlock"] == "mortal"
        and to_float(row["damage_coeff"]) > 0
        and to_float(row["unlock_difficulty_index"]) <= config["difficulty_index"]
    ]
    fallback.sort(key=lambda r: to_float(r["unlock_difficulty_index"]))

    for row in fallback:
        if len(picked) >= 2:
            break
        if any(item["skill_id"] == row["skill_id"] for item in picked):
            continue
        picked.append(
            {
                "skill_id": row["skill_id"],
                "name_ko": row["name_ko"],
                "damage_coeff": to_float(row["damage_coeff"]),
                "cooldown_sec": max(0.0, to_float(row["cooldown_sec"])),
                "cost_mp": max(0.0, to_float(row["cost_mp"])),
                "element": normalize_element(row["element"]),
                "status_effect": row["status_effect"],
                "status_chance_pct": max(0.0, to_float(row["status_chance_pct"])),
                "status_duration_sec": max(0.0, to_float(row["status_duration_sec"])),
            }
        )

    if len(picked) < 2:
        raise SystemExit("unable to select 2 active skills")

    return picked[:2]


def pick_monsters(monster_rows: list[dict[str, str]], config: dict[str, Any]) -> list[dict[str, str]]:
    by_id = {row["monster_id"]: row for row in monster_rows}
    picked = [by_id[mid] for mid in config["monster_ids"] if mid in by_id]
    if len(picked) >= 3:
        return picked[:3]

    fallback: list[dict[str, str]] = []
    for monster_type in ("normal", "elite", "boss"):
        for row in monster_rows:
            if row["world"] == "mortal" and row["type"] == monster_type:
                fallback.append(row)
                break

    if len(fallback) < 3:
        raise SystemExit("unable to select fallback monsters")

    return fallback[:3]


def build_monster_stats(
    player_stats: dict[str, float],
    monster_row: dict[str, str],
    constants: dict[str, float],
) -> dict[str, float]:
    mechanic_rule = get_monster_mechanic_rule(monster_row.get("special_mechanic", ""))
    hp_mult = max(0.5, to_float(monster_row["hp_mult"], 1.0))
    atk_mult = max(0.5, to_float(monster_row["atk_mult"], 1.0))
    def_mult = max(0.5, to_float(monster_row["def_mult"], 1.0))
    speed_mult = max(0.3, to_float(monster_row["speed_mult"], 1.0))

    crit_rate_cap = constants.get("crit_rate_cap", 0.75)
    evasion_cap = constants.get("evasion_cap", 0.60)
    damage_reduction_cap = constants.get("damage_reduction_cap", 0.70)
    accuracy_floor = constants.get("accuracy_floor", 0.55)
    accuracy_ceiling = constants.get("accuracy_ceiling", 0.98)
    passive_def_multiplier = (
        to_float(mechanic_rule.get("passive_def_multiplier"), 1.0)
        if mechanic_rule
        else 1.0
    )
    passive_crit_rate_add = (
        to_float(mechanic_rule.get("passive_crit_rate_add"), 0.0)
        if mechanic_rule
        else 0.0
    )
    passive_damage_reduction_add = (
        to_float(mechanic_rule.get("passive_damage_reduction_add"), 0.0)
        if mechanic_rule
        else 0.0
    )
    base_damage_reduction = max(0.0, (def_mult - 1) * 0.10)

    return {
        "hp": player_stats["hp"] * hp_mult * 1.05,
        "mp": 0.0,
        "atk": player_stats["atk"] * atk_mult * 0.88,
        "def": player_stats["def"] * def_mult * passive_def_multiplier * 0.92,
        "speed": max(0.2, player_stats["speed"] * speed_mult),
        "accuracy": clamp(0.72 + (atk_mult - 1) * 0.08, accuracy_floor, accuracy_ceiling),
        "evasion": clamp(to_float(monster_row["evasion"], 0.0), 0.0, evasion_cap),
        "crit_rate": clamp(
            to_float(monster_row["crit_rate"], 0.0) + passive_crit_rate_add,
            0.0,
            crit_rate_cap,
        ),
        "crit_damage": 0.45,
        "penetration": clamp(max(0.0, (atk_mult - 1) * 0.07), 0.0, 0.45),
        "damage_reduction": clamp(
            base_damage_reduction + passive_damage_reduction_add,
            0.0,
            damage_reduction_cap,
        ),
    }


def make_unit(kind: str, unit_id: str, name: str, stats: dict[str, float], element: str) -> dict[str, Any]:
    return {
        "kind": kind,
        "id": unit_id,
        "name": name,
        "element": element,
        "hp": stats["hp"],
        "max_hp": stats["hp"],
        "mp": stats["mp"],
        "max_mp": stats["mp"],
        "next_action_sec": 1.0 / max(0.2, stats["speed"]),
        "stats": stats,
        "cooldown_ready_sec": {},
        "status_effects": [],
    }


def prune_expired_statuses(unit: dict[str, Any], now_sec: float) -> None:
    unit["status_effects"] = [
        effect for effect in unit["status_effects"] if float(effect["until_sec"]) > now_sec
    ]


def get_status(unit: dict[str, Any], status_type: str, now_sec: float) -> dict[str, Any] | None:
    for effect in unit["status_effects"]:
        if effect["type"] == status_type and float(effect["until_sec"]) > now_sec:
            return effect
    return None


def has_status(unit: dict[str, Any], status_type: str, now_sec: float) -> bool:
    return get_status(unit, status_type, now_sec) is not None


def apply_status(target: dict[str, Any], status_type: str, duration_sec: float, source_atk: float, now_sec: float) -> bool:
    if duration_sec <= 0:
        return False

    until_sec = now_sec + duration_sec
    for effect in target["status_effects"]:
        if effect["type"] != status_type:
            continue
        effect["until_sec"] = max(float(effect["until_sec"]), until_sec)
        effect["source_atk"] = max(float(effect["source_atk"]), source_atk)
        return True

    target["status_effects"].append(
        {
            "type": status_type,
            "until_sec": until_sec,
            "source_atk": max(0.0, source_atk),
        }
    )
    return True


def current_speed_multiplier(unit: dict[str, Any], now_sec: float) -> float:
    return 0.75 if has_status(unit, "slow", now_sec) else 1.0


def current_atk_multiplier(unit: dict[str, Any], now_sec: float) -> float:
    return 0.85 if has_status(unit, "weaken", now_sec) else 1.0


def current_def_multiplier(unit: dict[str, Any], now_sec: float) -> float:
    return 0.80 if has_status(unit, "armor_break", now_sec) else 1.0


def process_start_of_turn_statuses(
    actor: dict[str, Any],
    turn: int,
    now_sec: float,
    include_action_logs: bool,
) -> tuple[bool, list[dict[str, Any]]]:
    logs: list[dict[str, Any]] = []
    prune_expired_statuses(actor, now_sec)

    burn = get_status(actor, "burn", now_sec)
    if burn is not None:
        burn_damage = max(1, js_round_int(float(burn["source_atk"]) * 0.12))
        actor["hp"] = max(0.0, actor["hp"] - burn_damage)
        if include_action_logs:
            logs.append(
                {
                    "turn": turn,
                    "timestamp_sec": to_fixed(now_sec, 3),
                    "actor": actor["kind"],
                    "actor_id": actor["id"],
                    "target_id": actor["id"],
                    "action_id": "status_burn_tick",
                    "action_name": "burn_tick",
                    "damage": int(burn_damage),
                    "is_crit": False,
                    "is_miss": False,
                    "element_multiplier": 1.0,
                    "applied_status": "",
                    "status_applied": False,
                    "self_heal": 0,
                    "target_hp_after": to_fixed(actor["hp"], 2),
                }
            )

    if actor["hp"] <= 0:
        return True, logs

    if has_status(actor, "stun", now_sec):
        if include_action_logs:
            logs.append(
                {
                    "turn": turn,
                    "timestamp_sec": to_fixed(now_sec, 3),
                    "actor": actor["kind"],
                    "actor_id": actor["id"],
                    "target_id": actor["id"],
                    "action_id": "status_stun_skip",
                    "action_name": "stun",
                    "damage": 0,
                    "is_crit": False,
                    "is_miss": False,
                    "element_multiplier": 1.0,
                    "applied_status": "",
                    "status_applied": False,
                    "self_heal": 0,
                    "target_hp_after": to_fixed(actor["hp"], 2),
                }
            )
        return True, logs

    return False, logs


def maybe_apply_skill_status(
    attacker: dict[str, Any],
    target: dict[str, Any],
    skill: dict[str, Any],
    now_sec: float,
    rng: SeededRng,
) -> tuple[str, bool]:
    effect = str(skill.get("status_effect", ""))
    if effect not in ("burn", "slow", "stun"):
        return "", False

    chance_pct = max(0.0, to_float(skill.get("status_chance_pct"), 0.0))
    duration_sec = max(0.0, to_float(skill.get("status_duration_sec"), 0.0))
    if chance_pct <= 0 or duration_sec <= 0:
        return effect, False

    status_applied = maybe_apply_status_with_chance(
        target,
        effect,
        clamp(chance_pct / 100.0, 0.0, 1.0),
        duration_sec,
        attacker["stats"]["atk"],
        now_sec,
        rng,
    )
    return effect, status_applied


def maybe_apply_status_with_chance(
    target: dict[str, Any],
    status_type: str,
    chance: float,
    duration_sec: float,
    source_atk: float,
    now_sec: float,
    rng: SeededRng,
) -> bool:
    if chance <= 0 or duration_sec <= 0:
        return False
    if rng.next() > chance:
        return False
    return apply_status(target, status_type, duration_sec, source_atk, now_sec)


def maybe_apply_monster_on_hit_status(
    attacker: dict[str, Any],
    target: dict[str, Any],
    monster_mechanic_rule: dict[str, Any] | None,
    now_sec: float,
    rng: SeededRng,
) -> tuple[str, bool]:
    if not monster_mechanic_rule:
        return "", False

    on_hit = monster_mechanic_rule.get("on_hit_status")
    if not isinstance(on_hit, dict):
        return "", False

    status_type = str(on_hit.get("type", ""))
    if status_type not in SUPPORTED_STATUSES:
        return "", False

    chance = clamp(to_float(on_hit.get("chance"), 0.0), 0.0, 1.0)
    duration_sec = max(0.0, to_float(on_hit.get("duration_sec"), 0.0))
    source_scale = max(0.0, to_float(on_hit.get("source_atk_scale"), 1.0))

    applied = maybe_apply_status_with_chance(
        target,
        status_type,
        chance,
        duration_sec,
        attacker["stats"]["atk"] * source_scale,
        now_sec,
        rng,
    )
    return status_type, applied


def calc_damage(
    attacker: dict[str, Any],
    defender: dict[str, Any],
    coeff: float,
    attacker_element: str,
    rng: SeededRng,
    constants: dict[str, float],
    attacker_atk_multiplier: float = 1.0,
    defender_def_multiplier: float = 1.0,
) -> tuple[int, bool, bool, float]:
    accuracy_floor = constants.get("accuracy_floor", 0.55)
    accuracy_ceiling = constants.get("accuracy_ceiling", 0.98)
    defense_constant_k = constants.get("defense_constant_k", 180)
    crit_rate_cap = constants.get("crit_rate_cap", 0.75)

    hit_chance = clamp(
        attacker["stats"]["accuracy"] - defender["stats"]["evasion"] + 0.75,
        accuracy_floor,
        accuracy_ceiling,
    )
    if rng.next() > hit_chance:
        return 0, False, True, 1.0

    crit_rate = clamp(attacker["stats"]["crit_rate"], 0.0, crit_rate_cap)
    is_crit = rng.next() < crit_rate

    defender_def = defender["stats"]["def"] * defender_def_multiplier
    pen = attacker["stats"]["penetration"]
    def_after_pen = max(0.0, defender_def * (1 - pen))
    def_ratio = def_after_pen / (def_after_pen + defense_constant_k)

    element_multiplier = calc_element_multiplier(attacker_element, defender["element"], constants)

    damage = attacker["stats"]["atk"] * attacker_atk_multiplier * coeff
    damage *= 1 - def_ratio
    damage *= 1 - defender["stats"]["damage_reduction"]
    damage *= element_multiplier
    if is_crit:
        damage *= 1 + attacker["stats"]["crit_damage"]

    variance = 0.95 + rng.next() * 0.10
    damage *= variance

    return max(1, js_round_int(damage)), is_crit, False, element_multiplier


def choose_player_skill(player: dict[str, Any], skills: list[dict[str, Any]], now_sec: float) -> dict[str, Any] | None:
    available = []
    for skill in skills:
        ready_at = player["cooldown_ready_sec"].get(skill["skill_id"], 0.0)
        if ready_at <= now_sec and player["mp"] >= skill["cost_mp"]:
            available.append(skill)

    if not available:
        return None

    available.sort(key=lambda s: (-s["damage_coeff"], s["cooldown_sec"]))
    return available[0]


def simulate_duel(
    player_stats: dict[str, float],
    monster_row: dict[str, str],
    monster_stats: dict[str, float],
    skills: list[dict[str, Any]],
    seed: int,
    max_turns: int,
    include_action_logs: bool,
    constants: dict[str, float],
) -> dict[str, Any]:
    rng = SeededRng(seed)
    monster_mechanic_rule = get_monster_mechanic_rule(
        monster_row.get("special_mechanic", "")
    )

    player = make_unit("player", "player_01", "cultivator", player_stats, "none")
    monster = make_unit(
        "monster",
        monster_row["monster_id"],
        monster_row["name_ko"],
        monster_stats,
        normalize_element(monster_row["element"]),
    )

    turn = 0
    now_sec = 0.0
    logs: list[dict[str, Any]] = []
    used_skills: dict[str, int] = {}
    status_applied_counts: dict[str, int] = {}
    monster_first_strike_pending = (
        to_float(monster_mechanic_rule.get("first_strike_damage_multiplier"), 1.0)
        if monster_mechanic_rule
        else 1.0
    ) > 1.0

    while turn < max_turns and player["hp"] > 0 and monster["hp"] > 0:
        actor = player if player["next_action_sec"] <= monster["next_action_sec"] else monster
        target = monster if actor["kind"] == "player" else player

        now_sec = float(actor["next_action_sec"])
        turn += 1

        consumed, status_logs = process_start_of_turn_statuses(actor, turn, now_sec, include_action_logs)
        if include_action_logs:
            logs.extend(status_logs)
        if actor["hp"] <= 0:
            break
        if consumed:
            actor["next_action_sec"] += 1.0 / max(
                0.2, actor["stats"]["speed"] * current_speed_multiplier(actor, now_sec)
            )
            continue

        action_id = "basic_attack"
        action_name = "basic_attack"
        coeff = 1.0
        attack_element = actor["element"]
        selected_skill: dict[str, Any] | None = None

        if actor["kind"] == "player":
            selected_skill = choose_player_skill(actor, skills, now_sec)
            if selected_skill is not None:
                action_id = selected_skill["skill_id"]
                action_name = selected_skill["name_ko"]
                coeff = selected_skill["damage_coeff"]
                attack_element = selected_skill["element"]
                actor["mp"] -= selected_skill["cost_mp"]
                actor["cooldown_ready_sec"][selected_skill["skill_id"]] = (
                    now_sec + selected_skill["cooldown_sec"]
                )
                used_skills[selected_skill["skill_id"]] = (
                    used_skills.get(selected_skill["skill_id"], 0) + 1
                )
            else:
                actor["mp"] = min(actor["max_mp"], actor["mp"] + 6)

        effective_coeff = coeff
        if actor["kind"] == "monster":
            first_strike_multiplier = (
                to_float(monster_mechanic_rule.get("first_strike_damage_multiplier"), 1.0)
                if monster_mechanic_rule
                else 1.0
            )
            if monster_first_strike_pending and first_strike_multiplier > 0:
                effective_coeff *= first_strike_multiplier
                monster_first_strike_pending = False

            execute_bonus = (
                monster_mechanic_rule.get("execute_bonus")
                if monster_mechanic_rule
                else None
            )
            if isinstance(execute_bonus, dict) and target["max_hp"] > 0:
                target_hp_ratio = target["hp"] / target["max_hp"]
                threshold = to_float(execute_bonus.get("target_hp_below_ratio"), 0.0)
                execute_multiplier = to_float(execute_bonus.get("damage_multiplier"), 1.0)
                if target_hp_ratio <= threshold:
                    effective_coeff *= execute_multiplier

        damage, is_crit, is_miss, element_multiplier = calc_damage(
            actor,
            target,
            effective_coeff,
            attack_element,
            rng,
            constants,
            current_atk_multiplier(actor, now_sec),
            current_def_multiplier(target, now_sec),
        )

        applied_status = ""
        status_applied = False
        self_heal = 0
        if not is_miss:
            target["hp"] = max(0.0, target["hp"] - damage)
            if actor["kind"] == "player" and selected_skill is not None:
                applied_status, status_applied = maybe_apply_skill_status(
                    actor,
                    target,
                    selected_skill,
                    now_sec,
                    rng,
                )
                if applied_status and status_applied:
                    status_applied_counts[applied_status] = (
                        status_applied_counts.get(applied_status, 0) + 1
                    )
            elif actor["kind"] == "monster":
                applied_status, status_applied = maybe_apply_monster_on_hit_status(
                    actor,
                    target,
                    monster_mechanic_rule,
                    now_sec,
                    rng,
                )
                if applied_status and status_applied:
                    status_applied_counts[applied_status] = (
                        status_applied_counts.get(applied_status, 0) + 1
                    )
            if actor["kind"] == "monster" and monster_mechanic_rule:
                heal_ratio = clamp(
                    to_float(monster_mechanic_rule.get("on_hit_heal_ratio"), 0.0),
                    0.0,
                    1.0,
                )
                if heal_ratio > 0 and damage > 0:
                    heal_amount = max(1, js_round_int(damage * heal_ratio))
                    hp_before_heal = actor["hp"]
                    actor["hp"] = min(actor["max_hp"], actor["hp"] + heal_amount)
                    self_heal = max(0, js_round_int(actor["hp"] - hp_before_heal))

        if include_action_logs:
            logs.append(
                {
                    "turn": turn,
                    "timestamp_sec": to_fixed(now_sec, 3),
                    "actor": actor["kind"],
                    "actor_id": actor["id"],
                    "target_id": target["id"],
                    "action_id": action_id,
                    "action_name": action_name,
                    "damage": int(damage),
                    "is_crit": bool(is_crit),
                    "is_miss": bool(is_miss),
                    "element_multiplier": to_fixed(element_multiplier, 4),
                    "applied_status": applied_status,
                    "status_applied": bool(status_applied),
                    "self_heal": int(self_heal),
                    "target_hp_after": to_fixed(target["hp"], 2),
                }
            )

        actor["next_action_sec"] += 1.0 / max(
            0.2, actor["stats"]["speed"] * current_speed_multiplier(actor, now_sec)
        )

    winner = "player" if player["hp"] > 0 and monster["hp"] <= 0 else "monster"

    return {
        "monster_id": monster_row["monster_id"],
        "monster_name_ko": monster_row["name_ko"],
        "monster_type": monster_row["type"],
        "winner": winner,
        "turns": turn,
        "elapsed_sec": to_fixed(now_sec, 3),
        "player_hp_left": to_fixed(player["hp"], 2),
        "monster_hp_left": to_fixed(monster["hp"], 2),
        "used_skills": used_skills,
        "status_applied_counts": status_applied_counts,
        "logs": logs,
    }


def write_summary_csv(duels: list[dict[str, Any]], out_path: Path) -> None:
    rows = []
    for duel in duels:
        used_skill_text = ";".join(
            f"{skill_id}:{count}" for skill_id, count in sorted(duel["used_skills"].items())
        )
        status_text = ";".join(
            f"{status}:{count}" for status, count in sorted(duel["status_applied_counts"].items())
        )
        rows.append(
            {
                "monster_id": duel["monster_id"],
                "monster_name_ko": duel["monster_name_ko"],
                "monster_type": duel["monster_type"],
                "winner": duel["winner"],
                "turns": duel["turns"],
                "elapsed_sec": duel["elapsed_sec"],
                "player_hp_left": duel["player_hp_left"],
                "monster_hp_left": duel["monster_hp_left"],
                "used_skills": used_skill_text,
                "status_applied": status_text,
                "action_count": len(duel["logs"]),
            }
        )

    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def write_action_log_csv(duels: list[dict[str, Any]], out_path: Path) -> int:
    rows: list[dict[str, Any]] = []
    for duel_index, duel in enumerate(duels, start=1):
        for log in duel["logs"]:
            rows.append(
                {
                    "duel_index": duel_index,
                    "monster_id": duel["monster_id"],
                    "monster_name_ko": duel["monster_name_ko"],
                    **log,
                }
            )

    if not rows:
        with out_path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(
                [
                    "duel_index",
                    "monster_id",
                    "monster_name_ko",
                    "turn",
                    "timestamp_sec",
                    "actor",
                    "actor_id",
                    "target_id",
                    "action_id",
                    "action_name",
                    "damage",
                    "is_crit",
                    "is_miss",
                    "element_multiplier",
                    "applied_status",
                    "status_applied",
                    "self_heal",
                    "target_hp_after",
                ]
            )
        return 0

    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    return len(rows)


def main() -> None:
    args = parse_args()
    config = build_config(args)

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    progression_rows = read_csv_rows(PROGRESSION_CSV)
    stat_growth_rows = read_csv_rows(STAT_GROWTH_CSV)
    combat_constant_rows = read_csv_rows(COMBAT_CONSTANTS_CSV)
    skill_rows = read_csv_rows(SKILLS_CSV)
    monster_rows = read_csv_rows(MONSTERS_CSV)

    progression = get_progression_row(progression_rows, config["difficulty_index"])
    stat_rows = stat_rows_by_id(stat_growth_rows)
    constants = combat_constants_by_key(combat_constant_rows)

    player_stats = build_player_stats(stat_rows, progression, config, constants)
    skills = pick_skills(skill_rows, config)
    monsters = pick_monsters(monster_rows, config)

    duels: list[dict[str, Any]] = []
    for idx, monster in enumerate(monsters):
        duel_seed = config["seed"] + idx * 1009
        monster_stats = build_monster_stats(player_stats, monster, constants)
        duels.append(
            simulate_duel(
                player_stats,
                monster,
                monster_stats,
                skills,
                duel_seed,
                config["max_turns"],
                config["include_action_logs"],
                constants,
            )
        )

    wins = sum(1 for d in duels if d["winner"] == "player")
    avg_turns = to_fixed(sum(float(d["turns"]) for d in duels) / len(duels), 2)
    avg_elapsed_sec = to_fixed(sum(float(d["elapsed_sec"]) for d in duels) / len(duels), 3)

    report = {
        "config": config,
        "context": {
            "world": progression["world"],
            "major_stage_name": progression["major_stage_name"],
            "sub_stage_name": progression["sub_stage_name"],
            "difficulty_index": int(progression["difficulty_index"]),
            "defense_constant_k": constants.get("defense_constant_k", 180),
        },
        "player": {
            "stats": {k: to_fixed(v, 4) for k, v in player_stats.items()},
            "skills": skills,
        },
        "duels": duels,
        "summary": {
            "total": len(duels),
            "wins": wins,
            "losses": len(duels) - wins,
            "win_rate": wins / len(duels),
            "avg_turns": avg_turns,
            "avg_elapsed_sec": avg_elapsed_sec,
        },
    }

    OUT_REPORT_JSON.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_summary_csv(duels, OUT_SUMMARY_CSV)
    action_count = write_action_log_csv(duels, OUT_ACTION_LOG_CSV)

    print(f"wrote combat report json -> {OUT_REPORT_JSON}")
    print(f"wrote combat summary csv -> {OUT_SUMMARY_CSV} ({len(duels)} rows)")
    print(f"wrote combat action log csv -> {OUT_ACTION_LOG_CSV} ({action_count} rows)")
    print(
        "summary: "
        f"win_rate={report['summary']['win_rate']}, "
        f"avg_turns={report['summary']['avg_turns']}, "
        f"avg_elapsed_sec={report['summary']['avg_elapsed_sec']}"
    )


if __name__ == "__main__":
    main()
