#!/usr/bin/env python3
import argparse
import csv
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROGRESSION_OUT = ROOT / "data/progression/realm_progression_v1.csv"
LOCALE_OUT = ROOT / "data/progression/realm_locale_ko_v1.csv"
REBIRTH_OUT = ROOT / "data/balance/rebirth_upgrades_v1.csv"
COMBAT_OUT = ROOT / "data/balance/combat_constants_v1.csv"
TRIBULATION_FAIL_OUT = ROOT / "data/balance/tribulation_failure_weights_v1.csv"
POTION_TALISMAN_OUT = ROOT / "data/balance/potions_talismans_v1.csv"
SKILLS_OUT = ROOT / "data/combat/skills_v1.csv"
MONSTERS_OUT = ROOT / "data/combat/monsters_v1.csv"
MAP_NODES_OUT = ROOT / "data/map/map_nodes_v1.csv"
MAP_EVENTS_OUT = ROOT / "data/map/map_events_v1.csv"
DROP_POOLS_OUT = ROOT / "data/map/drop_pools_v1.csv"
STAT_GROWTH_OUT = ROOT / "data/system/stat_growth_coeffs_v1.csv"
OPTIONS_UNLOCKS_OUT = ROOT / "data/system/options_unlocks_v1.csv"
QUESTS_OUT = ROOT / "data/meta/quests_v1.csv"
ACHIEVEMENTS_OUT = ROOT / "data/meta/achievements_v1.csv"
MILESTONES_OUT = ROOT / "data/meta/milestones_v1.csv"
SHOP_CATALOG_BASE_OUT = ROOT / "data/economy/shop_catalog_v1.csv"
SHOP_CATALOG_TUNED_OUT = ROOT / "data/economy/shop_catalog_tuned_v1.csv"
CURRENCY_SINKS_BASE_OUT = ROOT / "data/economy/currency_sinks_v1.csv"
CURRENCY_SINKS_TUNED_OUT = ROOT / "data/economy/currency_sinks_tuned_v1.csv"
EQUIPMENT_BASES_OUT = ROOT / "data/equipment/equipment_bases_v1.csv"
EQUIPMENT_AFFIXES_OUT = ROOT / "data/equipment/equipment_affixes_v1.csv"
EQUIPMENT_ROLL_RULES_OUT = ROOT / "data/equipment/equipment_roll_rules_v1.csv"
EQUIPMENT_BASE_POOLS_OUT = ROOT / "data/equipment/equipment_base_pools_v1.csv"
EQUIPMENT_AFFIX_POOLS_OUT = ROOT / "data/equipment/equipment_affix_pools_v1.csv"
EQUIPMENT_DROP_LINKS_OUT = ROOT / "data/equipment/equipment_drop_links_v1.csv"
EXPORT_DIR = ROOT / "data/export"
EXPORT_MANIFEST_OUT = EXPORT_DIR / "balance_manifest_v1.json"


def clamp(val, lo, hi):
    return max(lo, min(hi, val))


def sub_penalty_mortal(sub_idx: int) -> int:
    if sub_idx <= 4:
        return (sub_idx - 1)
    if sub_idx <= 8:
        return 4 + (sub_idx - 5) * 2
    if sub_idx <= 12:
        return 12 + (sub_idx - 9) * 3
    return 26


def sub_penalty_immortal(sub_idx: int) -> int:
    if sub_idx <= 4:
        return (sub_idx - 1) * 2
    if sub_idx <= 8:
        return 6 + (sub_idx - 5) * 3
    if sub_idx <= 12:
        return 18 + (sub_idx - 9) * 4
    return 36


def phase_for_layer(sub_idx: int) -> str:
    if sub_idx <= 4:
        return "early"
    if sub_idx <= 8:
        return "mid"
    if sub_idx <= 12:
        return "late"
    return "perfect"


def write_csv(path: Path, rows: list[dict]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, rows: list[dict]) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)


def write_json_obj(path: Path, payload: dict) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build_locale_rows(progression_rows: list[dict]) -> list[dict]:
    world_ko = {
        "mortal": "인간계",
        "immortal": "신선계",
        "true": "진선계",
    }
    major_ko = {
        "qi_refining": "연기",
        "foundation_establishment": "축기",
        "core_formation": "결단",
        "nascent_soul": "원영",
        "spirit_severing": "화신",
        "void_refining": "연허",
        "body_integration": "합체",
        "great_ascension": "대승",
        "earthly_immortal": "지선",
        "spirit_immortal": "영선",
        "heavenly_immortal": "천선",
        "golden_immortal": "금선",
        "grand_unity": "태을",
        "dao_lord": "도군",
        "true_immortal": "진선",
        "mystic_immortal": "현선",
        "saint_immortal": "성선",
        "origin_ancestor": "원조",
    }
    phase_ko = {
        "early": "초기",
        "mid": "중기",
        "late": "후기",
        "perfect": "대원만",
        "transcendent": "초월",
    }
    sub_ko_fixed = {
        "great_perfection": "대원만",
        "entry": "초입",
        "stable": "안정",
        "completion": "완성",
        "consummation": "원만",
    }

    locale_rows = []
    for row in progression_rows:
        sub_name = row["sub_stage_name"]
        if sub_name.startswith("layer_"):
            layer_num = sub_name.split("_", 1)[1]
            sub_ko = f"{layer_num}층"
        else:
            sub_ko = sub_ko_fixed[sub_name]

        major_name = row["major_stage_name"]
        world_name = row["world"]
        display_name = f"{world_ko[world_name]} {major_ko[major_name]} {sub_ko}"

        locale_rows.append(
            {
                "world": world_name,
                "world_ko": world_ko[world_name],
                "major_stage_name": major_name,
                "major_stage_ko": major_ko[major_name],
                "sub_stage_name": sub_name,
                "sub_stage_ko": sub_ko,
                "phase": row["phase"],
                "phase_ko": phase_ko[row["phase"]],
                "display_name_ko": display_name,
            }
        )
    return locale_rows


def build_tribulation_failure_rows(progression_rows: list[dict]) -> list[dict]:
    phase_retreat_factor = {
        "early": 0.18,
        "mid": 0.28,
        "late": 0.36,
        "perfect": 0.44,
        "transcendent": 0.52,
    }
    rows = []
    for row in progression_rows:
        if row["is_tribulation"] != 1:
            continue

        death_weight = clamp(int(row["base_death_pct"]), 2, 90)
        remaining = 100 - death_weight
        world_idx = int(row["world_index"])
        retreat_ratio = phase_retreat_factor[row["phase"]] + (world_idx - 1) * 0.07
        retreat_ratio = clamp(retreat_ratio, 0.12, 0.75)

        retreat_weight = int(round(remaining * retreat_ratio))
        minor_weight = remaining - retreat_weight

        rows.append(
            {
                "difficulty_index": row["difficulty_index"],
                "world": row["world"],
                "major_stage_name": row["major_stage_name"],
                "sub_stage_name": row["sub_stage_name"],
                "phase": row["phase"],
                "weight_minor_fail": minor_weight,
                "weight_retreat_fail": retreat_weight,
                "weight_death_fail": death_weight,
                "sum_weight": minor_weight + retreat_weight + death_weight,
                "retreat_min_layers": row["fail_retreat_min"],
                "retreat_max_layers": row["fail_retreat_max"],
            }
        )
    return rows


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate progression/economy/export balance tables."
    )
    parser.add_argument(
        "--economy-profile",
        choices=("base", "tuned"),
        default="base",
        help="select which economy CSV source to export",
    )
    return parser.parse_args()


def resolve_economy_sources(economy_profile: str) -> tuple[Path, Path]:
    if economy_profile == "base":
        return SHOP_CATALOG_BASE_OUT, CURRENCY_SINKS_BASE_OUT

    missing: list[str] = []
    if not SHOP_CATALOG_TUNED_OUT.exists():
        missing.append(str(SHOP_CATALOG_TUNED_OUT))
    if not CURRENCY_SINKS_TUNED_OUT.exists():
        missing.append(str(CURRENCY_SINKS_TUNED_OUT))
    if missing:
        joined = ", ".join(missing)
        raise SystemExit(
            f"economy-profile=tuned requires tuned csv files. missing: {joined}"
        )
    return SHOP_CATALOG_TUNED_OUT, CURRENCY_SINKS_TUNED_OUT


def main(economy_profile: str) -> None:
    PROGRESSION_OUT.parent.mkdir(parents=True, exist_ok=True)
    LOCALE_OUT.parent.mkdir(parents=True, exist_ok=True)
    REBIRTH_OUT.parent.mkdir(parents=True, exist_ok=True)
    COMBAT_OUT.parent.mkdir(parents=True, exist_ok=True)
    TRIBULATION_FAIL_OUT.parent.mkdir(parents=True, exist_ok=True)
    MAP_NODES_OUT.parent.mkdir(parents=True, exist_ok=True)
    STAT_GROWTH_OUT.parent.mkdir(parents=True, exist_ok=True)
    QUESTS_OUT.parent.mkdir(parents=True, exist_ok=True)
    SHOP_CATALOG_BASE_OUT.parent.mkdir(parents=True, exist_ok=True)
    EQUIPMENT_BASES_OUT.parent.mkdir(parents=True, exist_ok=True)
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    shop_catalog_source, currency_sinks_source = resolve_economy_sources(
        economy_profile
    )

    mortal_stages = [
        "qi_refining",
        "foundation_establishment",
        "core_formation",
        "nascent_soul",
        "spirit_severing",
        "void_refining",
        "body_integration",
        "great_ascension",
    ]

    immortal_stages = [
        "earthly_immortal",
        "spirit_immortal",
        "heavenly_immortal",
        "golden_immortal",
        "grand_unity",
        "dao_lord",
    ]

    true_stages = [
        "true_immortal",
        "mystic_immortal",
        "saint_immortal",
        "origin_ancestor",
    ]

    rows = []
    difficulty = 1

    # Mortal world: 8 stages x (12 layers + great_perfection)
    for major_idx, major_name in enumerate(mortal_stages, start=1):
        for sub_idx in range(1, 14):
            sub_name = f"layer_{sub_idx}" if sub_idx <= 12 else "great_perfection"
            phase = phase_for_layer(sub_idx)
            local_idx = (major_idx - 1) * 13 + (sub_idx - 1)

            qi_required = round(100 * (1.22 ** local_idx))
            base_success = clamp(92 - (major_idx - 1) * 3 - sub_penalty_mortal(sub_idx), 22, 95)
            is_tribulation = 1 if sub_idx == 13 else 0

            if is_tribulation:
                base_death = clamp(3 + (major_idx - 1) * 4 + (5 if base_success < 30 else 0), 2, 60)
                retreat_min = 1
                retreat_max = 2
            else:
                base_death = 0
                retreat_min = 0
                retreat_max = 0

            rows.append(
                {
                    "difficulty_index": difficulty,
                    "world": "mortal",
                    "world_index": 1,
                    "major_stage_index": major_idx,
                    "major_stage_name": major_name,
                    "sub_stage_index": sub_idx,
                    "sub_stage_name": sub_name,
                    "phase": phase,
                    "is_tribulation": is_tribulation,
                    "qi_required": qi_required,
                    "base_breakthrough_success_pct": base_success,
                    "base_death_pct": base_death,
                    "fail_retreat_min": retreat_min,
                    "fail_retreat_max": retreat_max,
                    "rebirth_score_weight": round(1.0 + major_idx * 0.35 + sub_idx * 0.04, 2),
                    "drop_rate_multiplier": round(1 + difficulty * 0.012, 3),
                    "offline_reward_multiplier": round(1 + difficulty * 0.01, 3),
                }
            )
            difficulty += 1

    # Immortal world: 6 stages x (12 layers + great_perfection)
    for major_idx, major_name in enumerate(immortal_stages, start=1):
        for sub_idx in range(1, 14):
            sub_name = f"layer_{sub_idx}" if sub_idx <= 12 else "great_perfection"
            phase = phase_for_layer(sub_idx)
            local_idx = (major_idx - 1) * 13 + (sub_idx - 1)

            qi_required = round(450000 * (1.2 ** local_idx))
            base_success = clamp(78 - (major_idx - 1) * 4 - sub_penalty_immortal(sub_idx), 12, 90)
            is_tribulation = 1 if sub_idx in (8, 12, 13) else 0

            if is_tribulation:
                if sub_idx == 8:
                    base_death = clamp(12 + (major_idx - 1) * 5, 8, 72)
                    retreat_min, retreat_max = 2, 4
                elif sub_idx == 12:
                    base_death = clamp(18 + (major_idx - 1) * 5, 10, 78)
                    retreat_min, retreat_max = 2, 5
                else:
                    base_death = clamp(26 + (major_idx - 1) * 5, 12, 82)
                    retreat_min, retreat_max = 3, 6
            else:
                base_death = 0
                retreat_min = 0
                retreat_max = 0

            rows.append(
                {
                    "difficulty_index": difficulty,
                    "world": "immortal",
                    "world_index": 2,
                    "major_stage_index": major_idx,
                    "major_stage_name": major_name,
                    "sub_stage_index": sub_idx,
                    "sub_stage_name": sub_name,
                    "phase": phase,
                    "is_tribulation": is_tribulation,
                    "qi_required": qi_required,
                    "base_breakthrough_success_pct": base_success,
                    "base_death_pct": base_death,
                    "fail_retreat_min": retreat_min,
                    "fail_retreat_max": retreat_max,
                    "rebirth_score_weight": round(4.2 + major_idx * 0.5 + sub_idx * 0.06, 2),
                    "drop_rate_multiplier": round(1 + difficulty * 0.012, 3),
                    "offline_reward_multiplier": round(1 + difficulty * 0.01, 3),
                }
            )
            difficulty += 1

    # True world: 4 stages x 4 sub-stages
    true_sub_names = ["entry", "stable", "completion", "consummation"]
    for major_idx, major_name in enumerate(true_stages, start=1):
        for sub_idx, sub_name in enumerate(true_sub_names, start=1):
            local_idx = (major_idx - 1) * 4 + (sub_idx - 1)
            qi_required = round(60000000 * (1.3 ** local_idx))
            base_success = clamp(52 - (major_idx - 1) * 6 - (sub_idx - 1) * 6, 5, 75)
            base_death = clamp(35 + (major_idx - 1) * 8 + (sub_idx - 1) * 6, 30, 90)

            rows.append(
                {
                    "difficulty_index": difficulty,
                    "world": "true",
                    "world_index": 3,
                    "major_stage_index": major_idx,
                    "major_stage_name": major_name,
                    "sub_stage_index": sub_idx,
                    "sub_stage_name": sub_name,
                    "phase": "transcendent",
                    "is_tribulation": 1,
                    "qi_required": qi_required,
                    "base_breakthrough_success_pct": base_success,
                    "base_death_pct": base_death,
                    "fail_retreat_min": 3,
                    "fail_retreat_max": 7,
                    "rebirth_score_weight": round(9.5 + major_idx * 0.8 + sub_idx * 0.1, 2),
                    "drop_rate_multiplier": round(1 + difficulty * 0.012, 3),
                    "offline_reward_multiplier": round(1 + difficulty * 0.01, 3),
                }
            )
            difficulty += 1

    write_csv(PROGRESSION_OUT, rows)
    write_json(EXPORT_DIR / "realm_progression_v1.json", rows)

    locale_rows = build_locale_rows(rows)
    write_csv(LOCALE_OUT, locale_rows)
    write_json(EXPORT_DIR / "realm_locale_ko_v1.json", locale_rows)

    # Rebirth upgrades
    rebirth_rows = []
    branches = [
        ("cultivation_speed", "mul_pct", 0.04, 0.01, 1.17),
        ("breakthrough_bonus", "flat_pct", 0.8, 0.15, 1.19),
        ("tribulation_guard", "flat_pct", 0.9, 0.2, 1.21),
        ("potion_mastery", "mul_pct", 0.03, 0.007, 1.18),
        ("offline_efficiency", "mul_pct", 0.05, 0.01, 1.16),
    ]

    for branch, effect_type, base_effect, per_level_add, growth in branches:
        for level in range(1, 21):
            cost = round(20 * (growth ** (level - 1)))
            effect_value = round(base_effect + (level - 1) * per_level_add, 4)
            rebirth_rows.append(
                {
                    "branch": branch,
                    "level": level,
                    "cost_rebirth_essence": cost,
                    "effect_type": effect_type,
                    "effect_value": effect_value,
                }
            )

    write_csv(REBIRTH_OUT, rebirth_rows)
    write_json(EXPORT_DIR / "rebirth_upgrades_v1.json", rebirth_rows)

    # Combat constants (first pass)
    combat_rows = [
        {"key": "defense_constant_k", "value": "180", "note": "used in defense/(defense+K)"},
        {"key": "accuracy_floor", "value": "0.55", "note": "minimum hit chance"},
        {"key": "accuracy_ceiling", "value": "0.98", "note": "maximum hit chance"},
        {"key": "crit_rate_cap", "value": "0.75", "note": "hard cap"},
        {"key": "evasion_cap", "value": "0.60", "note": "hard cap"},
        {"key": "damage_reduction_cap", "value": "0.70", "note": "hard cap"},
        {"key": "element_advantage_bonus", "value": "0.25", "note": "max elemental damage bonus"},
        {"key": "element_disadvantage_penalty", "value": "-0.20", "note": "max elemental damage penalty"},
        {"key": "offline_reward_hours_cap", "value": "12", "note": "max offline accumulation"},
        {"key": "auto_rebirth_unlock_stage", "value": "mortal:4", "note": "unlock requirement"},
    ]

    write_csv(COMBAT_OUT, combat_rows)
    write_json(EXPORT_DIR / "combat_constants_v1.json", combat_rows)

    tribulation_rows = build_tribulation_failure_rows(rows)
    write_csv(TRIBULATION_FAIL_OUT, tribulation_rows)
    write_json(EXPORT_DIR / "tribulation_failure_weights_v1.json", tribulation_rows)

    potion_talisman_rows = read_csv_rows(POTION_TALISMAN_OUT)
    write_json(EXPORT_DIR / "potions_talismans_v1.json", potion_talisman_rows)

    skill_rows = read_csv_rows(SKILLS_OUT)
    write_json(EXPORT_DIR / "skills_v1.json", skill_rows)

    monster_rows = read_csv_rows(MONSTERS_OUT)
    write_json(EXPORT_DIR / "monsters_v1.json", monster_rows)

    map_node_rows = read_csv_rows(MAP_NODES_OUT)
    write_json(EXPORT_DIR / "map_nodes_v1.json", map_node_rows)

    map_event_rows = read_csv_rows(MAP_EVENTS_OUT)
    write_json(EXPORT_DIR / "map_events_v1.json", map_event_rows)

    drop_pool_rows = read_csv_rows(DROP_POOLS_OUT)
    write_json(EXPORT_DIR / "drop_pools_v1.json", drop_pool_rows)

    stat_growth_rows = read_csv_rows(STAT_GROWTH_OUT)
    write_json(EXPORT_DIR / "stat_growth_coeffs_v1.json", stat_growth_rows)

    options_unlock_rows = read_csv_rows(OPTIONS_UNLOCKS_OUT)
    write_json(EXPORT_DIR / "options_unlocks_v1.json", options_unlock_rows)

    quest_rows = read_csv_rows(QUESTS_OUT)
    write_json(EXPORT_DIR / "quests_v1.json", quest_rows)

    achievement_rows = read_csv_rows(ACHIEVEMENTS_OUT)
    write_json(EXPORT_DIR / "achievements_v1.json", achievement_rows)

    milestone_rows = read_csv_rows(MILESTONES_OUT)
    write_json(EXPORT_DIR / "milestones_v1.json", milestone_rows)

    shop_catalog_rows = read_csv_rows(shop_catalog_source)
    write_json(EXPORT_DIR / "shop_catalog_v1.json", shop_catalog_rows)

    currency_sink_rows = read_csv_rows(currency_sinks_source)
    write_json(EXPORT_DIR / "currency_sinks_v1.json", currency_sink_rows)

    equipment_base_rows = read_csv_rows(EQUIPMENT_BASES_OUT)
    write_json(EXPORT_DIR / "equipment_bases_v1.json", equipment_base_rows)

    equipment_affix_rows = read_csv_rows(EQUIPMENT_AFFIXES_OUT)
    write_json(EXPORT_DIR / "equipment_affixes_v1.json", equipment_affix_rows)

    equipment_roll_rule_rows = read_csv_rows(EQUIPMENT_ROLL_RULES_OUT)
    write_json(EXPORT_DIR / "equipment_roll_rules_v1.json", equipment_roll_rule_rows)

    equipment_base_pool_rows = read_csv_rows(EQUIPMENT_BASE_POOLS_OUT)
    write_json(EXPORT_DIR / "equipment_base_pools_v1.json", equipment_base_pool_rows)

    equipment_affix_pool_rows = read_csv_rows(EQUIPMENT_AFFIX_POOLS_OUT)
    write_json(EXPORT_DIR / "equipment_affix_pools_v1.json", equipment_affix_pool_rows)

    equipment_drop_link_rows = read_csv_rows(EQUIPMENT_DROP_LINKS_OUT)
    write_json(EXPORT_DIR / "equipment_drop_links_v1.json", equipment_drop_link_rows)

    manifest = {
        "generator": "scripts/generate_balance_tables.py",
        "version": "v1",
        "generated_at_utc": datetime.now(timezone.utc).isoformat().replace(
            "+00:00", "Z"
        ),
        "economy_profile": economy_profile,
        "economy_sources": {
            "shop_catalog_csv": str(shop_catalog_source.relative_to(ROOT)),
            "currency_sinks_csv": str(currency_sinks_source.relative_to(ROOT)),
        },
    }
    write_json_obj(EXPORT_MANIFEST_OUT, manifest)

    print(f"wrote {len(rows)} progression rows -> {PROGRESSION_OUT}")
    print(f"wrote {len(locale_rows)} locale rows -> {LOCALE_OUT}")
    print(f"wrote {len(rebirth_rows)} rebirth rows -> {REBIRTH_OUT}")
    print(f"wrote {len(combat_rows)} combat constants -> {COMBAT_OUT}")
    print(f"wrote {len(tribulation_rows)} tribulation-failure rows -> {TRIBULATION_FAIL_OUT}")
    print(f"wrote {len(potion_talisman_rows)} potion/talisman rows -> {POTION_TALISMAN_OUT}")
    print(f"wrote {len(skill_rows)} skill rows -> {SKILLS_OUT}")
    print(f"wrote {len(monster_rows)} monster rows -> {MONSTERS_OUT}")
    print(f"wrote {len(map_node_rows)} map node rows -> {MAP_NODES_OUT}")
    print(f"wrote {len(map_event_rows)} map event rows -> {MAP_EVENTS_OUT}")
    print(f"wrote {len(drop_pool_rows)} drop pool rows -> {DROP_POOLS_OUT}")
    print(f"wrote {len(stat_growth_rows)} stat growth rows -> {STAT_GROWTH_OUT}")
    print(f"wrote {len(options_unlock_rows)} option unlock rows -> {OPTIONS_UNLOCKS_OUT}")
    print(f"wrote {len(quest_rows)} quest rows -> {QUESTS_OUT}")
    print(f"wrote {len(achievement_rows)} achievement rows -> {ACHIEVEMENTS_OUT}")
    print(f"wrote {len(milestone_rows)} milestone rows -> {MILESTONES_OUT}")
    print(
        "wrote "
        f"{len(shop_catalog_rows)} shop rows from {shop_catalog_source.name} "
        f"-> {EXPORT_DIR / 'shop_catalog_v1.json'}"
    )
    print(
        "wrote "
        f"{len(currency_sink_rows)} currency sink rows from "
        f"{currency_sinks_source.name} -> {EXPORT_DIR / 'currency_sinks_v1.json'}"
    )
    print(f"wrote {len(equipment_base_rows)} equipment base rows -> {EQUIPMENT_BASES_OUT}")
    print(f"wrote {len(equipment_affix_rows)} equipment affix rows -> {EQUIPMENT_AFFIXES_OUT}")
    print(
        f"wrote {len(equipment_roll_rule_rows)} equipment roll-rule rows -> {EQUIPMENT_ROLL_RULES_OUT}"
    )
    print(f"wrote {len(equipment_base_pool_rows)} equipment base-pool rows -> {EQUIPMENT_BASE_POOLS_OUT}")
    print(f"wrote {len(equipment_affix_pool_rows)} equipment affix-pool rows -> {EQUIPMENT_AFFIX_POOLS_OUT}")
    print(f"wrote {len(equipment_drop_link_rows)} equipment drop-link rows -> {EQUIPMENT_DROP_LINKS_OUT}")
    print(f"wrote export manifest -> {EXPORT_MANIFEST_OUT}")
    print(f"wrote json exports -> {EXPORT_DIR}")


if __name__ == "__main__":
    args = parse_args()
    main(args.economy_profile)
