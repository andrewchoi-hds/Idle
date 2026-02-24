#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from pr_validation_commands_v1 import DEFAULT_VALIDATION_COMMANDS


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PACKAGE_JSON = ROOT / "package.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check whether PR validation commands are all registered in package.json scripts."
    )
    parser.add_argument(
        "--package-json",
        type=Path,
        default=DEFAULT_PACKAGE_JSON,
        help="Path to package.json file.",
    )
    parser.add_argument(
        "--summary-file",
        type=Path,
        help="Optional markdown output path for check summary.",
    )
    return parser.parse_args()


def extract_script_name(command: str) -> str | None:
    prefix = "npm run "
    normalized = command.strip()
    if not normalized.startswith(prefix):
        return None
    remainder = normalized[len(prefix) :].strip()
    if not remainder:
        return None
    return remainder.split()[0].strip()


def build_summary_markdown(
    package_path: Path,
    expected_commands: list[str],
    missing: list[tuple[str, str]],
    unsupported: list[str],
) -> str:
    passed = (not missing) and (not unsupported)
    lines: list[str] = []
    lines.append("### PR Validation Command Registry")
    lines.append(f"- Package: `{package_path}`")
    lines.append(f"- Result: `{'PASS' if passed else 'FAIL'}`")
    lines.append(f"- Expected commands: `{len(expected_commands)}`")
    lines.append(f"- Missing scripts: `{len(missing)}`")
    lines.append(f"- Unsupported command format: `{len(unsupported)}`")
    if missing:
        lines.append("")
        lines.append("#### Missing Scripts")
        for command, script_name in missing:
            lines.append(f"- `{command}` -> missing `{script_name}`")
    if unsupported:
        lines.append("")
        lines.append("#### Unsupported Commands")
        for command in unsupported:
            lines.append(f"- `{command}`")
    return "\n".join(lines) + "\n"


def main() -> None:
    args = parse_args()
    package_path = args.package_json.resolve()
    if not package_path.exists():
        raise SystemExit(f"package json not found: {package_path}")

    parsed = json.loads(package_path.read_text(encoding="utf-8"))
    if not isinstance(parsed, dict):
        raise SystemExit(f"invalid package json format: {package_path}")
    scripts = parsed.get("scripts", {})
    if not isinstance(scripts, dict):
        raise SystemExit(f"`scripts` is not an object in package json: {package_path}")

    expected_commands = list(DEFAULT_VALIDATION_COMMANDS)
    missing: list[tuple[str, str]] = []
    unsupported: list[str] = []
    for command in expected_commands:
        script_name = extract_script_name(command)
        if script_name is None:
            unsupported.append(command)
            continue
        if script_name not in scripts:
            missing.append((command, script_name))

    if missing or unsupported:
        print(f"[pr-validation-registry] FAIL package={package_path}")
        print(
            f"- expected_count={len(expected_commands)} "
            f"missing_count={len(missing)} unsupported_count={len(unsupported)}"
        )
        if missing:
            print("- missing scripts:")
            for command, script_name in missing:
                print(f"  - {command} -> {script_name}")
        if unsupported:
            print("- unsupported command formats:")
            for command in unsupported:
                print(f"  - {command}")
    else:
        print(f"[pr-validation-registry] PASS package={package_path}")
        print(f"[pr-validation-registry] commands={len(expected_commands)}")

    if args.summary_file is not None:
        summary_path = args.summary_file.resolve()
        summary_path.parent.mkdir(parents=True, exist_ok=True)
        summary_path.write_text(
            build_summary_markdown(
                package_path=package_path,
                expected_commands=expected_commands,
                missing=missing,
                unsupported=unsupported,
            ),
            encoding="utf-8",
        )

    if missing or unsupported:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
