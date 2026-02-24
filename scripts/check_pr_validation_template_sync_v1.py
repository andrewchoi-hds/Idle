#!/usr/bin/env python3
from __future__ import annotations

import argparse
from dataclasses import dataclass
import re
from pathlib import Path

from pr_validation_commands_v1 import DEFAULT_VALIDATION_COMMANDS


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_TEMPLATE = ROOT / ".github/pull_request_template.md"
CHECKBOX_RE = re.compile(r"^- \[[ xX]\] `([^`]+)`\s*$")


@dataclass
class SyncAnalysis:
    expected: list[str]
    actual: list[str]
    missing: list[str]
    unexpected: list[str]
    order_mismatch: bool
    passed: bool
    rewritten: bool = False


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
    parser.add_argument(
        "--write",
        action="store_true",
        help="Rewrite Validation checklist section to match standard command list.",
    )
    parser.add_argument(
        "--summary-file",
        type=Path,
        help="Optional markdown output path for check summary.",
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


def find_validation_section_bounds(lines: list[str]) -> tuple[int, int]:
    start = -1
    end = len(lines)
    for idx, line in enumerate(lines):
        stripped = line.strip().lower()
        if stripped == "## validation":
            start = idx
            break
    if start < 0:
        raise RuntimeError("`## Validation` section not found in template")

    for idx in range(start + 1, len(lines)):
        if lines[idx].strip().startswith("## "):
            end = idx
            break
    return start, end


def rewrite_validation_section(template_text: str, commands: list[str]) -> str:
    lines = template_text.splitlines()
    start, end = find_validation_section_bounds(lines)
    checklist_lines = [f"- [ ] `{command}`" for command in commands]
    replacement = [lines[start], *checklist_lines, ""]
    new_lines = [*lines[:start], *replacement, *lines[end:]]
    return "\n".join(new_lines).rstrip() + "\n"


def analyze(actual: list[str], expected: list[str]) -> SyncAnalysis:
    missing = [command for command in expected if command not in actual]
    unexpected = [command for command in actual if command not in expected]
    order_mismatch = sorted(set(actual).intersection(expected), key=expected.index) != [
        command for command in actual if command in expected
    ]
    passed = actual == expected
    return SyncAnalysis(
        expected=expected,
        actual=actual,
        missing=missing,
        unexpected=unexpected,
        order_mismatch=order_mismatch,
        passed=passed,
    )


def build_summary_markdown(template_path: Path, analysis: SyncAnalysis) -> str:
    lines: list[str] = []
    lines.append("### PR Validation Checklist Sync")
    lines.append(f"- Template: `{template_path}`")
    lines.append(f"- Result: `{'PASS' if analysis.passed else 'FAIL'}`")
    lines.append(f"- Expected commands: `{len(analysis.expected)}`")
    lines.append(f"- Actual commands: `{len(analysis.actual)}`")
    lines.append(f"- Auto-fixed: `{'YES' if analysis.rewritten else 'NO'}`")
    if analysis.missing:
        lines.append("")
        lines.append("#### Missing")
        for command in analysis.missing:
            lines.append(f"- `{command}`")
    if analysis.unexpected:
        lines.append("")
        lines.append("#### Unexpected")
        for command in analysis.unexpected:
            lines.append(f"- `{command}`")
    if analysis.order_mismatch:
        lines.append("")
        lines.append("#### Order")
        lines.append("- command order mismatch detected")
        lines.append("- expected order:")
        for command in analysis.expected:
            lines.append(f"  - `{command}`")
        lines.append("- actual order:")
        for command in analysis.actual:
            lines.append(f"  - `{command}`")
    return "\n".join(lines) + "\n"


def print_analysis(template_path: Path, analysis: SyncAnalysis) -> None:
    if analysis.passed:
        print(f"[pr-validation-sync] PASS template={template_path}")
        print(f"[pr-validation-sync] commands={len(analysis.actual)}")
        if analysis.rewritten:
            print("[pr-validation-sync] template rewritten to standard Validation checklist")
        return

    print(f"[pr-validation-sync] FAIL template={template_path}")
    print(f"- expected_count={len(analysis.expected)} actual_count={len(analysis.actual)}")
    if analysis.rewritten:
        print("- template rewrite attempted but mismatch remains")
    if analysis.missing:
        print("- missing commands:")
        for command in analysis.missing:
            print(f"  - {command}")
    if analysis.unexpected:
        print("- unexpected commands:")
        for command in analysis.unexpected:
            print(f"  - {command}")
    if analysis.order_mismatch:
        print("- order mismatch detected")
        print("  expected order:")
        for command in analysis.expected:
            print(f"  - {command}")
        print("  actual order:")
        for command in analysis.actual:
            print(f"  - {command}")


def main() -> None:
    args = parse_args()
    template_path = args.template_file.resolve()
    if not template_path.exists():
        raise SystemExit(f"template file not found: {template_path}")

    template_text = template_path.read_text(encoding="utf-8")
    expected = list(DEFAULT_VALIDATION_COMMANDS)
    analysis = analyze(extract_validation_commands(template_text), expected)

    if args.write and not analysis.passed:
        rewritten = rewrite_validation_section(template_text, expected)
        if rewritten != template_text:
            template_path.write_text(rewritten, encoding="utf-8")
        refreshed = template_path.read_text(encoding="utf-8")
        analysis = analyze(extract_validation_commands(refreshed), expected)
        analysis.rewritten = True

    print_analysis(template_path, analysis)
    if args.summary_file is not None:
        summary_path = args.summary_file.resolve()
        summary_path.parent.mkdir(parents=True, exist_ok=True)
        summary_path.write_text(build_summary_markdown(template_path, analysis), encoding="utf-8")
    if not analysis.passed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
