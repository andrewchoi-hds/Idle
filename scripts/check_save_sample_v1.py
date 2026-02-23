#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SAMPLE_PATH = ROOT / "data/schema/save_v1.sample.json"

REQUIRED_TOP_LEVEL = {
    "version",
    "player",
    "progression",
    "currencies",
    "inventory",
    "equipment",
    "settings",
    "meta",
    "timestamps",
}


def main() -> None:
    payload = json.loads(SAMPLE_PATH.read_text(encoding="utf-8"))
    missing = sorted(REQUIRED_TOP_LEVEL - set(payload.keys()))
    errors: list[str] = []

    if missing:
        errors.append(f"missing top-level keys: {', '.join(missing)}")

    if payload.get("version") != 1:
        errors.append("version must be 1")

    if payload.get("progression", {}).get("difficulty_index", 0) < 1:
        errors.append("progression.difficulty_index must be >= 1")

    for key in ("spirit_coin", "rebirth_essence", "qi"):
        value = payload.get("currencies", {}).get(key)
        if not isinstance(value, (int, float)) or value < 0:
            errors.append(f"currencies.{key} must be non-negative number")

    slots = payload.get("equipment", {}).get("slots", {})
    for slot in ("weapon", "armor", "accessory", "relic"):
        if slot not in slots:
            errors.append(f"equipment.slots.{slot} is required")

    if errors:
        print("invalid sample save")
        for err in errors:
            print(f"- {err}")
        raise SystemExit(1)

    print(f"sample save valid -> {SAMPLE_PATH}")


if __name__ == "__main__":
    main()
