#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
from pathlib import Path

from pr_validation_commands_v1 import DEFAULT_VALIDATION_COMMANDS


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_TEMPLATE = ROOT / ".github/pull_request_template.md"
CHECKBOX_RE = re.compile(r"^- \[[ xX]\] `([^`]+)`\s*$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check whether PR template Validation checklist matches standard command list."
    )
    parser.add_argument(
        "--template-file",
        type=Path,
        default=DEFAULT_TEMPLATE,
        help="PR template markdown path.",
    )
    return parser.parse_args()


def extract_validation_commands(template_text: str) -> list[str]:
    lines = template_text.splitlines()
    in_validation = False
    commands: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## "):
            header = stripped[3:].strip().lower()
            if header == "validation":
                in_validation = True
                continue
            if in_validation:
                break
        if not in_validation:
            continue
        matched = CHECKBOX_RE.match(stripped)
        if matched is None:
            continue
        commands.append(matched.group(1).strip())
    return commands


def main() -> None:
    args = parse_args()
    template_path = args.template_file.resolve()
    if not template_path.exists():
        raise SystemExit(f"template file not found: {template_path}")

    template_text = template_path.read_text(encoding="utf-8")
    actual = extract_validation_commands(template_text)
    expected = list(DEFAULT_VALIDATION_COMMANDS)

    if actual == expected:
        print(f"[pr-validation-sync] PASS template={template_path}")
        print(f"[pr-validation-sync] commands={len(actual)}")
        return

    missing = [command for command in expected if command not in actual]
    unexpected = [command for command in actual if command not in expected]
    order_mismatch = sorted(set(actual).intersection(expected), key=expected.index) != [
        command for command in actual if command in expected
    ]

    print(f"[pr-validation-sync] FAIL template={template_path}")
    print(f"- expected_count={len(expected)} actual_count={len(actual)}")
    if missing:
        print("- missing commands:")
        for command in missing:
            print(f"  - {command}")
    if unexpected:
        print("- unexpected commands:")
        for command in unexpected:
            print(f"  - {command}")
    if order_mismatch:
        print("- order mismatch detected")
        print("  expected order:")
        for command in expected:
            print(f"  - {command}")
        print("  actual order:")
        for command in actual:
            print(f"  - {command}")
    raise SystemExit(1)


if __name__ == "__main__":
    main()
