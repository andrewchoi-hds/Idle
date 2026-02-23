#!/usr/bin/env python3
import argparse
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPORT_CSV = ROOT / "data/sim/economy_tuning_report_v1.csv"
SHOP_CSV = ROOT / "data/economy/shop_catalog_v1.csv"
SINKS_CSV = ROOT / "data/economy/currency_sinks_v1.csv"
OUT_SHOP_CSV = ROOT / "data/economy/shop_catalog_tuned_v1.csv"
OUT_SINKS_CSV = ROOT / "data/economy/currency_sinks_tuned_v1.csv"
OUT_CHANGES_CSV = ROOT / "data/sim/economy_tuning_changes_v1.csv"


def load_csv(path: Path) -> list[dict]:
    with path.open("r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict]) -> None:
    if not rows:
        return
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def to_float(raw: str) -> float:
    try:
        return float(raw)
    except Exception:
        return 0.0


def currency_key(raw: str) -> str | None:
    v = raw.strip().lower()
    if v in {"spirit_coin", "currency_spirit_coin", "coin_spirit", "currency:spirit_coin"}:
        return "spirit_coin"
    if v in {"rebirth_essence", "currency_rebirth_essence", "currency:rebirth_essence"}:
        return "rebirth_essence"
    return None


def build_multiplier_map(report_rows: list[dict], mode: str) -> dict[str, dict[str, float]]:
    out: dict[str, dict[str, float]] = {}
    for row in report_rows:
        c = row["currency"]
        if mode == "global":
            shop_mult = to_float(row["recommend_global_outflow_mult"])
            sink_mult = to_float(row["recommend_global_outflow_mult"])
        else:
            shop_mult = to_float(row["recommend_shop_price_mult"])
            sink_mult = to_float(row["recommend_sink_cost_mult"])

        out[c] = {
            "shop_mult": shop_mult,
            "sink_mult": sink_mult,
            "target_ratio": to_float(row["target_sink_ratio"]),
            "current_ratio": to_float(row["current_sink_ratio"]),
        }
    return out


def round_price(v: float) -> int:
    return max(1, int(round(v)))


def tune_shop_rows(
    rows: list[dict], multipliers: dict[str, dict[str, float]], mode: str
) -> tuple[list[dict], list[dict]]:
    out_rows: list[dict] = []
    changes: list[dict] = []

    for row in rows:
        row2 = dict(row)
        c = currency_key(row["currency_type"])
        if c is None or c not in multipliers:
            out_rows.append(row2)
            continue

        mult = multipliers[c]["shop_mult"]
        old_price = to_float(row["price"])
        new_price = round_price(old_price * mult)
        row2["price"] = str(new_price)
        out_rows.append(row2)

        if int(round(old_price)) != new_price:
            changes.append(
                {
                    "entity": "shop",
                    "id": row["shop_id"] + ":" + row["item_ref"],
                    "currency": c,
                    "field": "price",
                    "old_value": str(int(round(old_price))),
                    "new_value": str(new_price),
                    "multiplier": f"{mult:.4f}",
                    "mode": mode,
                }
            )

    return out_rows, changes


def tune_sink_rows(
    rows: list[dict], multipliers: dict[str, dict[str, float]], mode: str
) -> tuple[list[dict], list[dict]]:
    out_rows: list[dict] = []
    changes: list[dict] = []

    for row in rows:
        row2 = dict(row)
        c = currency_key(row["currency_type"])
        if c is None or c not in multipliers:
            out_rows.append(row2)
            continue

        mult = multipliers[c]["sink_mult"]

        old_base = to_float(row["base_cost"])
        new_base = round_price(old_base * mult)
        row2["base_cost"] = str(new_base)

        old_weekly = to_float(row["expected_weekly_spend"])
        new_weekly = round_price(old_weekly * mult)
        row2["expected_weekly_spend"] = str(new_weekly)
        out_rows.append(row2)

        if int(round(old_base)) != new_base:
            changes.append(
                {
                    "entity": "sink",
                    "id": row["sink_id"],
                    "currency": c,
                    "field": "base_cost",
                    "old_value": str(int(round(old_base))),
                    "new_value": str(new_base),
                    "multiplier": f"{mult:.4f}",
                    "mode": mode,
                }
            )
        if int(round(old_weekly)) != new_weekly:
            changes.append(
                {
                    "entity": "sink",
                    "id": row["sink_id"],
                    "currency": c,
                    "field": "expected_weekly_spend",
                    "old_value": str(int(round(old_weekly))),
                    "new_value": str(new_weekly),
                    "multiplier": f"{mult:.4f}",
                    "mode": mode,
                }
            )

    return out_rows, changes


def main() -> None:
    parser = argparse.ArgumentParser(description="Apply economy tuning recommendations")
    parser.add_argument("--mode", choices=["clamped", "global"], default="clamped")
    parser.add_argument("--report", type=Path, default=REPORT_CSV)
    parser.add_argument("--shop", type=Path, default=SHOP_CSV)
    parser.add_argument("--sinks", type=Path, default=SINKS_CSV)
    parser.add_argument("--out-shop", type=Path, default=OUT_SHOP_CSV)
    parser.add_argument("--out-sinks", type=Path, default=OUT_SINKS_CSV)
    parser.add_argument("--out-changes", type=Path, default=OUT_CHANGES_CSV)
    args = parser.parse_args()

    report_rows = load_csv(args.report)
    shop_rows = load_csv(args.shop)
    sink_rows = load_csv(args.sinks)

    multipliers = build_multiplier_map(report_rows, args.mode)

    tuned_shop, shop_changes = tune_shop_rows(shop_rows, multipliers, args.mode)
    tuned_sinks, sink_changes = tune_sink_rows(sink_rows, multipliers, args.mode)

    all_changes = shop_changes + sink_changes

    args.out_shop.parent.mkdir(parents=True, exist_ok=True)
    args.out_sinks.parent.mkdir(parents=True, exist_ok=True)
    args.out_changes.parent.mkdir(parents=True, exist_ok=True)

    write_csv(args.out_shop, tuned_shop)
    write_csv(args.out_sinks, tuned_sinks)
    write_csv(args.out_changes, all_changes)

    print(f"mode={args.mode}")
    print(f"wrote tuned shop -> {args.out_shop} ({len(tuned_shop)} rows)")
    print(f"wrote tuned sinks -> {args.out_sinks} ({len(tuned_sinks)} rows)")
    print(f"wrote tuning changes -> {args.out_changes} ({len(all_changes)} rows)")


if __name__ == "__main__":
    main()
