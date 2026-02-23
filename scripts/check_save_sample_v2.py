#!/usr/bin/env python3
import json
from pathlib import Path
from save_validation_v2 import validate_save_v2_payload

ROOT = Path(__file__).resolve().parent.parent
SAMPLE_PATH = ROOT / "data/schema/save_v2.sample.json"

def main() -> None:
    payload = json.loads(SAMPLE_PATH.read_text(encoding="utf-8"))
    errors = validate_save_v2_payload(payload)

    if errors:
        print("invalid sample save v2")
        for e in errors:
            print(f"- {e}")
        raise SystemExit(1)

    print(f"sample save v2 valid -> {SAMPLE_PATH}")


if __name__ == "__main__":
    main()
