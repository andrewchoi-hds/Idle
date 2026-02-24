#!/usr/bin/env python3
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from pr_validation_commands_v1 import DEFAULT_VALIDATION_COMMANDS


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_WORKFLOW = ROOT / ".github/workflows/combat-diff-ci.yml"


@dataclass
class CoverageAnalysis:
    expected: list[str]
    covered: dict[str, str]
    missing: list[str]
    passed: bool


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check whether verify-combat-diff workflow covers all standard validation commands."
    )
    parser.add_argument(
        "--workflow-file",
        type=Path,
        default=DEFAULT_WORKFLOW,
        help="Workflow YAML file path to inspect.",
    )
    parser.add_argument(
        "--summary-file",
        type=Path,
        help="Optional markdown output path for coverage summary.",
    )
    return parser.parse_args()


def command_variants(command: str) -> list[str]:
    variants = [command]
    if command.endswith(":check"):
        variants.append(f"{command}:report")
    return variants


def analyze(workflow_text: str, expected: list[str]) -> CoverageAnalysis:
    covered: dict[str, str] = {}
    missing: list[str] = []
    for command in expected:
        matched_variant = ""
        for variant in command_variants(command):
            if variant in workflow_text:
                matched_variant = variant
                break
        if matched_variant:
            covered[command] = matched_variant
            continue
        missing.append(command)
    return CoverageAnalysis(
        expected=expected,
        covered=covered,
        missing=missing,
        passed=(len(missing) == 0),
    )


def build_summary_markdown(workflow_path: Path, analysis: CoverageAnalysis) -> str:
    lines: list[str] = []
    lines.append("### PR Required Check Coverage")
    lines.append(f"- Workflow: `{workflow_path}`")
    lines.append(f"- Result: `{'PASS' if analysis.passed else 'FAIL'}`")
    lines.append(f"- Expected commands: `{len(analysis.expected)}`")
    lines.append(f"- Covered commands: `{len(analysis.covered)}`")
    if analysis.missing:
        lines.append("")
        lines.append("#### Missing Commands")
        for command in analysis.missing:
            lines.append(f"- `{command}`")
    return "\n".join(lines) + "\n"


def print_analysis(workflow_path: Path, analysis: CoverageAnalysis) -> None:
    if analysis.passed:
        print(f"[required-check-coverage] PASS workflow={workflow_path}")
        print(f"[required-check-coverage] commands={len(analysis.expected)}")
        return
    print(f"[required-check-coverage] FAIL workflow={workflow_path}")
    print(f"- expected_count={len(analysis.expected)} covered_count={len(analysis.covered)}")
    print("- missing commands:")
    for command in analysis.missing:
        print(f"  - {command}")


def main() -> None:
    args = parse_args()
    workflow_path = args.workflow_file.resolve()
    if not workflow_path.exists():
        raise SystemExit(f"workflow file not found: {workflow_path}")

    workflow_text = workflow_path.read_text(encoding="utf-8")
    expected = list(DEFAULT_VALIDATION_COMMANDS)
    analysis = analyze(workflow_text, expected)
    print_analysis(workflow_path, analysis)

    if args.summary_file is not None:
        summary_path = args.summary_file.resolve()
        summary_path.parent.mkdir(parents=True, exist_ok=True)
        summary_path.write_text(
            build_summary_markdown(workflow_path, analysis),
            encoding="utf-8",
        )

    if not analysis.passed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
