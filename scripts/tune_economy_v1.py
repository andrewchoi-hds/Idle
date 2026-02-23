#!/usr/bin/env python3
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUESTS_CSV = ROOT / "data/meta/quests_v1.csv"
MAP_NODES_CSV = ROOT / "data/map/map_nodes_v1.csv"
DROP_POOLS_CSV = ROOT / "data/map/drop_pools_v1.csv"
SHOP_CSV = ROOT / "data/economy/shop_catalog_v1.csv"
SINKS_CSV = ROOT / "data/economy/currency_sinks_v1.csv"
OUT_DIR = ROOT / "data/sim"
OUT_REPORT = OUT_DIR / "economy_tuning_report_v1.csv"
OUT_BREAKDOWN = OUT_DIR / "economy_flow_breakdown_v1.csv"

TARGET_RATIO = {
    "spirit_coin": 0.85,
    "rebirth_essence": 0.765,
}

WORLD_WEEKLY_RUNS = {
    "mortal": 420,
    "immortal": 260,
    "true": 110,
}

NODE_TYPE_FACTOR = {
    "hunt": 1.0,
    "elite": 0.8,
    "boss": 0.35,
    "event": 0.45,
    "tribulation": 0.15,
    "gather": 0.6,
}

TAB_PURCHASE_RATIO = {
    "consumable": 0.75,
    "material": 0.65,
    "currency": 0.50,
    "upgrade": 0.90,
    "service": 0.60,
}


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def load_csv(path: Path) -> list[dict]:
    with path.open("r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def parse_currency_key(raw: str) -> str | None:
    raw = raw.strip().lower()
    if raw in {
        "currency_spirit_coin",
        "coin_spirit",
        "spirit_coin",
        "currency:spirit_coin",
    }:
        return "spirit_coin"
    if raw in {
        "currency_rebirth_essence",
        "rebirth_essence",
        "currency:rebirth_essence",
    }:
        return "rebirth_essence"
    return None


def to_float(raw: str) -> float:
    try:
        return float(raw)
    except Exception:
        return 0.0


def estimate_quest_inflow(quests: list[dict]) -> dict[str, float]:
    inflow = {"spirit_coin": 0.0, "rebirth_essence": 0.0}
    for row in quests:
        repeatable = row["repeatable"] == "yes"
        qtype = row["quest_type"]
        if repeatable:
            if qtype == "daily":
                cycles = 7.0
            elif qtype == "weekly":
                cycles = 1.0
            else:
                cycles = 3.0
        else:
            # one-time 콘텐츠는 주간 기준으로 일부만 반영
            cycles = 0.2

        for reward_type_key, reward_value_key in (
            ("reward_primary_type", "reward_primary_value"),
            ("reward_secondary_type", "reward_secondary_value"),
        ):
            currency = parse_currency_key(row[reward_type_key])
            if currency is None:
                continue
            inflow[currency] += to_float(row[reward_value_key]) * cycles
    return inflow


def estimate_drop_inflow(map_nodes: list[dict], drop_rows: list[dict]) -> dict[str, float]:
    inflow = {"spirit_coin": 0.0, "rebirth_essence": 0.0}

    expected_currency_by_group: dict[str, dict[str, float]] = {}
    grouped: dict[str, list[dict]] = {}
    for row in drop_rows:
        grouped.setdefault(row["drop_group"], []).append(row)

    for group, rows in grouped.items():
        total_weight = sum(to_float(r["weight"]) for r in rows)
        if total_weight <= 0:
            continue

        bucket = {"spirit_coin": 0.0, "rebirth_essence": 0.0}
        for r in rows:
            if r["item_type"] != "currency":
                continue
            currency = parse_currency_key(r["item_ref"])
            if currency is None:
                continue
            avg_qty = (to_float(r["min_qty"]) + to_float(r["max_qty"])) / 2.0
            p = to_float(r["weight"]) / total_weight
            bucket[currency] += p * avg_qty

        expected_currency_by_group[group] = bucket

    world_weight_sum = {"mortal": 0.0, "immortal": 0.0, "true": 0.0}
    for node in map_nodes:
        world = node["world"]
        if world not in world_weight_sum:
            continue
        node_factor = NODE_TYPE_FACTOR.get(node["node_type"], 1.0)
        world_weight_sum[world] += to_float(node["encounter_weight"]) * node_factor

    for node in map_nodes:
        world = node["world"]
        if world not in WORLD_WEEKLY_RUNS:
            continue
        group = node["drop_group"]
        if group not in expected_currency_by_group:
            continue

        node_factor = NODE_TYPE_FACTOR.get(node["node_type"], 1.0)
        node_weight = to_float(node["encounter_weight"]) * node_factor
        total = world_weight_sum[world]
        if total <= 0:
            continue

        runs = WORLD_WEEKLY_RUNS[world] * (node_weight / total)
        group_income = expected_currency_by_group[group]
        for currency in inflow:
            inflow[currency] += runs * group_income[currency]

    return inflow


def estimate_shop_outflow(shop_rows: list[dict]) -> dict[str, float]:
    outflow = {"spirit_coin": 0.0, "rebirth_essence": 0.0}

    for row in shop_rows:
        currency = parse_currency_key(row["currency_type"])
        if currency is None:
            continue

        stock_type = row["stock_type"]
        stock_value = to_float(row["stock_value"])
        if stock_type == "daily":
            weekly_stock = stock_value * 7.0
        elif stock_type == "weekly":
            weekly_stock = stock_value
        else:
            # unlimited: 보수적으로 추정
            weekly_stock = 14.0 if currency == "spirit_coin" else 4.0

        purchase_ratio = TAB_PURCHASE_RATIO.get(row["tab"], 0.6)
        weekly_purchases = weekly_stock * purchase_ratio
        outflow[currency] += weekly_purchases * to_float(row["price"])

    return outflow


def estimate_sink_outflow(sink_rows: list[dict]) -> dict[str, float]:
    outflow = {"spirit_coin": 0.0, "rebirth_essence": 0.0}
    for row in sink_rows:
        currency = parse_currency_key(row["currency_type"])
        if currency is None:
            continue
        outflow[currency] += to_float(row["expected_weekly_spend"])
    return outflow


def recommend_multipliers(
    inflow: float,
    outflow: float,
    target_ratio: float,
    quest_in: float,
    drop_in: float,
    sink_out: float,
    shop_out: float,
) -> dict[str, float]:
    ratio = outflow / max(inflow, 1.0)
    imbalance = target_ratio - ratio

    global_outflow_mult = target_ratio / max(ratio, 1e-9)
    global_inflow_mult = ratio / max(target_ratio, 1e-9)

    sink_cost_mult = clamp(1.0 + imbalance * 0.90, 0.70, 1.60)
    shop_price_mult = clamp(1.0 + imbalance * 0.55, 0.75, 1.45)
    quest_reward_mult = clamp(1.0 - imbalance * 0.65, 0.65, 1.35)
    drop_currency_mult = clamp(1.0 - imbalance * 0.70, 0.65, 1.35)

    projected_inflow = quest_in * quest_reward_mult + drop_in * drop_currency_mult
    projected_outflow = sink_out * sink_cost_mult + shop_out * shop_price_mult
    projected_ratio = projected_outflow / max(projected_inflow, 1.0)

    return {
        "current_ratio": ratio,
        "sink_cost_mult": sink_cost_mult,
        "shop_price_mult": shop_price_mult,
        "quest_reward_mult": quest_reward_mult,
        "drop_currency_mult": drop_currency_mult,
        "projected_ratio": projected_ratio,
        "global_outflow_mult": global_outflow_mult,
        "global_inflow_mult": global_inflow_mult,
    }


def status_text(current_ratio: float, target_ratio: float) -> str:
    gap = current_ratio - target_ratio
    if gap > 1.2:
        return "severely_over_sinked"
    if gap < -0.45:
        return "severely_under_sinked"
    if abs(gap) <= 0.03:
        return "on_target"
    if gap > 0:
        return "over_sinked"
    return "under_sinked"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    quests = load_csv(QUESTS_CSV)
    map_nodes = load_csv(MAP_NODES_CSV)
    drops = load_csv(DROP_POOLS_CSV)
    shops = load_csv(SHOP_CSV)
    sinks = load_csv(SINKS_CSV)

    quest_inflow = estimate_quest_inflow(quests)
    drop_inflow = estimate_drop_inflow(map_nodes, drops)
    shop_outflow = estimate_shop_outflow(shops)
    sink_outflow = estimate_sink_outflow(sinks)

    report_rows = []
    breakdown_rows = []

    for currency in ("spirit_coin", "rebirth_essence"):
        inflow_total = quest_inflow[currency] + drop_inflow[currency]
        outflow_total = sink_outflow[currency] + shop_outflow[currency]

        rec = recommend_multipliers(
            inflow=inflow_total,
            outflow=outflow_total,
            target_ratio=TARGET_RATIO[currency],
            quest_in=quest_inflow[currency],
            drop_in=drop_inflow[currency],
            sink_out=sink_outflow[currency],
            shop_out=shop_outflow[currency],
        )

        report_rows.append(
            {
                "currency": currency,
                "target_sink_ratio": round(TARGET_RATIO[currency], 4),
                "current_sink_ratio": round(rec["current_ratio"], 4),
                "projected_sink_ratio": round(rec["projected_ratio"], 4),
                "quest_inflow_weekly": round(quest_inflow[currency], 2),
                "drop_inflow_weekly": round(drop_inflow[currency], 2),
                "shop_outflow_weekly": round(shop_outflow[currency], 2),
                "sink_outflow_weekly": round(sink_outflow[currency], 2),
                "total_inflow_weekly": round(inflow_total, 2),
                "total_outflow_weekly": round(outflow_total, 2),
                "recommend_sink_cost_mult": round(rec["sink_cost_mult"], 4),
                "recommend_shop_price_mult": round(rec["shop_price_mult"], 4),
                "recommend_quest_reward_mult": round(rec["quest_reward_mult"], 4),
                "recommend_drop_currency_mult": round(rec["drop_currency_mult"], 4),
                "recommend_global_outflow_mult": round(rec["global_outflow_mult"], 4),
                "recommend_global_inflow_mult": round(rec["global_inflow_mult"], 4),
                "residual_gap_after_clamped": round(rec["projected_ratio"] - TARGET_RATIO[currency], 4),
                "status": status_text(rec["current_ratio"], TARGET_RATIO[currency]),
            }
        )

        breakdown_rows.extend(
            [
                {
                    "currency": currency,
                    "flow_type": "inflow",
                    "source": "quest",
                    "value_weekly": round(quest_inflow[currency], 2),
                },
                {
                    "currency": currency,
                    "flow_type": "inflow",
                    "source": "drop",
                    "value_weekly": round(drop_inflow[currency], 2),
                },
                {
                    "currency": currency,
                    "flow_type": "outflow",
                    "source": "shop",
                    "value_weekly": round(shop_outflow[currency], 2),
                },
                {
                    "currency": currency,
                    "flow_type": "outflow",
                    "source": "sink",
                    "value_weekly": round(sink_outflow[currency], 2),
                },
            ]
        )

    with OUT_REPORT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(report_rows[0].keys()))
        writer.writeheader()
        writer.writerows(report_rows)

    with OUT_BREAKDOWN.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(breakdown_rows[0].keys()))
        writer.writeheader()
        writer.writerows(breakdown_rows)

    print(f"wrote economy report -> {OUT_REPORT} ({len(report_rows)} rows)")
    print(f"wrote economy breakdown -> {OUT_BREAKDOWN} ({len(breakdown_rows)} rows)")


if __name__ == "__main__":
    main()
