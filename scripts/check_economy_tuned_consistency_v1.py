#!/usr/bin/env python3
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHOP_BASE = ROOT / "data/economy/shop_catalog_v1.csv"
SHOP_TUNED = ROOT / "data/economy/shop_catalog_tuned_v1.csv"
SINK_BASE = ROOT / "data/economy/currency_sinks_v1.csv"
SINK_TUNED = ROOT / "data/economy/currency_sinks_tuned_v1.csv"


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def to_float(raw: str, path: str, errors: list[str]) -> float:
    try:
        return float(raw)
    except ValueError:
        errors.append(f"{path} must be numeric, got={raw!r}")
        return 0.0


def summarize(ratios: list[float]) -> tuple[float, float, float]:
    return (min(ratios), max(ratios), (sum(ratios) / len(ratios)))


def main() -> None:
    missing = [
        str(p)
        for p in (SHOP_BASE, SHOP_TUNED, SINK_BASE, SINK_TUNED)
        if not p.exists()
    ]
    if missing:
        print("missing files")
        for p in missing:
            print(f"- {p}")
        raise SystemExit(1)

    errors: list[str] = []

    shop_base = read_rows(SHOP_BASE)
    shop_tuned = read_rows(SHOP_TUNED)
    sink_base = read_rows(SINK_BASE)
    sink_tuned = read_rows(SINK_TUNED)

    shop_key_fields = ("shop_id", "tab", "item_ref", "item_type", "currency_type")
    sink_key_fields = ("sink_id",)

    shop_base_map = {
        tuple(row[field] for field in shop_key_fields): row for row in shop_base
    }
    shop_tuned_map = {
        tuple(row[field] for field in shop_key_fields): row for row in shop_tuned
    }

    sink_base_map = {
        tuple(row[field] for field in sink_key_fields): row for row in sink_base
    }
    sink_tuned_map = {
        tuple(row[field] for field in sink_key_fields): row for row in sink_tuned
    }

    if len(shop_base_map) != len(shop_base):
        errors.append("shop base contains duplicate key rows")
    if len(shop_tuned_map) != len(shop_tuned):
        errors.append("shop tuned contains duplicate key rows")
    if len(sink_base_map) != len(sink_base):
        errors.append("sink base contains duplicate key rows")
    if len(sink_tuned_map) != len(sink_tuned):
        errors.append("sink tuned contains duplicate key rows")

    if set(shop_base_map) != set(shop_tuned_map):
        missing_in_tuned = sorted(set(shop_base_map) - set(shop_tuned_map))
        extra_in_tuned = sorted(set(shop_tuned_map) - set(shop_base_map))
        if missing_in_tuned:
            errors.append(f"shop keys missing in tuned: {len(missing_in_tuned)}")
        if extra_in_tuned:
            errors.append(f"shop keys only in tuned: {len(extra_in_tuned)}")

    if set(sink_base_map) != set(sink_tuned_map):
        missing_in_tuned = sorted(set(sink_base_map) - set(sink_tuned_map))
        extra_in_tuned = sorted(set(sink_tuned_map) - set(sink_base_map))
        if missing_in_tuned:
            errors.append(f"sink keys missing in tuned: {len(missing_in_tuned)}")
        if extra_in_tuned:
            errors.append(f"sink keys only in tuned: {len(extra_in_tuned)}")

    shop_ratios: list[float] = []
    for key, base_row in shop_base_map.items():
        tuned_row = shop_tuned_map.get(key)
        if tuned_row is None:
            continue

        base_price = to_float(base_row["price"], f"shop[{key}].base.price", errors)
        tuned_price = to_float(tuned_row["price"], f"shop[{key}].tuned.price", errors)

        if tuned_price <= 0:
            errors.append(f"shop[{key}].tuned.price must be > 0")
        if base_price > 0:
            shop_ratios.append(tuned_price / base_price)

    sink_ratios: list[float] = []
    for key, base_row in sink_base_map.items():
        tuned_row = sink_tuned_map.get(key)
        if tuned_row is None:
            continue

        base_cost = to_float(base_row["base_cost"], f"sink[{key}].base.base_cost", errors)
        tuned_cost = to_float(tuned_row["base_cost"], f"sink[{key}].tuned.base_cost", errors)

        if tuned_cost <= 0:
            errors.append(f"sink[{key}].tuned.base_cost must be > 0")
        if base_cost > 0:
            sink_ratios.append(tuned_cost / base_cost)

    if errors:
        print("economy tuned consistency check failed")
        for err in errors:
            print(f"- {err}")
        raise SystemExit(1)

    shop_min, shop_max, shop_avg = summarize(shop_ratios)
    sink_min, sink_max, sink_avg = summarize(sink_ratios)

    print("economy tuned consistency check passed")
    print(f"- shop rows: base={len(shop_base)} tuned={len(shop_tuned)}")
    print(f"- sink rows: base={len(sink_base)} tuned={len(sink_tuned)}")
    print(f"- shop price ratio tuned/base: min={shop_min:.4f} max={shop_max:.4f} avg={shop_avg:.4f}")
    print(f"- sink cost ratio tuned/base: min={sink_min:.4f} max={sink_max:.4f} avg={sink_avg:.4f}")


if __name__ == "__main__":
    main()
