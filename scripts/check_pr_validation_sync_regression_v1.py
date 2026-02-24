#!/usr/bin/env python3
from __future__ import annotations

import argparse
from dataclasses import dataclass
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
import tempfile
from typing import Any

from check_pr_validation_template_sync_v1 import extract_validation_commands
from pr_validation_commands_v1 import DEFAULT_VALIDATION_COMMANDS


ROOT = Path(__file__).resolve().parent.parent


@dataclass
class Case:
    case_id: str
    validation_commands: list[str]
    use_write: bool
    expect_pass: bool
    expect_synced_after_run: bool
    expected_output_contains: list[str]
    expected_summary_contains: list[str]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run regression checks for PR Validation checklist sync tool."
    )
    parser.add_argument(
        "--report-file",
        type=Path,
        help="Optional JSON report output path.",
    )
    return parser.parse_args()


def build_template(validation_commands: list[str]) -> str:
    lines = [
        "## Summary",
        "- 문제/배경: 회귀 체크",
        "- 해결 내용: Validation 동기화 점검",
        "- 기대 효과: PR 템플릿 품질 보장",
        "",
        "## Changes",
        "- `/Users/hirediversity/Idle/scripts/check_pr_validation_template_sync_v1.py`: regression fixture",
        "",
        "## Validation",
    ]
    lines.extend(f"- [ ] `{command}`" for command in validation_commands)
    lines.extend(
        [
            "",
            "## Docs",
            "- [ ] Updated docs if behavior or workflow changed",
            "- [ ] Updated `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md` checklist section",
            "",
            "## Notes",
            "- fixture",
            "",
        ]
    )
    return "\n".join(lines)


def make_cases() -> list[Case]:
    expected = list(DEFAULT_VALIDATION_COMMANDS)
    if len(expected) < 2:
        raise RuntimeError("DEFAULT_VALIDATION_COMMANDS requires at least 2 commands")

    missing = expected[:-1]
    unexpected = [*expected, "npm run custom:unexpected:command"]
    order_mismatch = [expected[1], expected[0], *expected[2:]]
    missing_command = expected[-1]
    unexpected_command = "npm run custom:unexpected:command"

    return [
        Case(
            case_id="valid_template_pass",
            validation_commands=expected,
            use_write=False,
            expect_pass=True,
            expect_synced_after_run=True,
            expected_output_contains=["[pr-validation-sync] PASS"],
            expected_summary_contains=[
                "- Result: `PASS`",
                "- Auto-fixed: `NO`",
            ],
        ),
        Case(
            case_id="missing_command_fail",
            validation_commands=missing,
            use_write=False,
            expect_pass=False,
            expect_synced_after_run=False,
            expected_output_contains=[
                "[pr-validation-sync] FAIL",
                "missing commands:",
                missing_command,
            ],
            expected_summary_contains=[
                "- Result: `FAIL`",
                "- Auto-fixed: `NO`",
                "#### Missing",
                f"- `{missing_command}`",
            ],
        ),
        Case(
            case_id="missing_command_write_autofix_pass",
            validation_commands=missing,
            use_write=True,
            expect_pass=True,
            expect_synced_after_run=True,
            expected_output_contains=[
                "[pr-validation-sync] PASS",
                "template rewritten to standard Validation checklist",
            ],
            expected_summary_contains=[
                "- Result: `PASS`",
                "- Auto-fixed: `YES`",
            ],
        ),
        Case(
            case_id="unexpected_command_fail",
            validation_commands=unexpected,
            use_write=False,
            expect_pass=False,
            expect_synced_after_run=False,
            expected_output_contains=[
                "[pr-validation-sync] FAIL",
                "unexpected commands:",
                unexpected_command,
            ],
            expected_summary_contains=[
                "- Result: `FAIL`",
                "#### Unexpected",
                f"- `{unexpected_command}`",
            ],
        ),
        Case(
            case_id="order_mismatch_fail",
            validation_commands=order_mismatch,
            use_write=False,
            expect_pass=False,
            expect_synced_after_run=False,
            expected_output_contains=[
                "[pr-validation-sync] FAIL",
                "order mismatch detected",
            ],
            expected_summary_contains=[
                "- Result: `FAIL`",
                "#### Order",
            ],
        ),
    ]


def run_case(case: Case, temp_root: Path) -> tuple[bool, dict[str, Any]]:
    template_path = temp_root / f"{case.case_id}.md"
    template_path.write_text(build_template(case.validation_commands), encoding="utf-8")
    summary_path = temp_root / f"{case.case_id}_summary.md"

    cmd = [
        "python3",
        "scripts/check_pr_validation_template_sync_v1.py",
        "--template-file",
        str(template_path),
        "--summary-file",
        str(summary_path),
    ]
    if case.use_write:
        cmd.append("--write")

    proc = subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)
    expected_rc = 0 if case.expect_pass else 1
    errors: list[str] = []
    if proc.returncode != expected_rc:
        errors.append(f"unexpected return code: expected={expected_rc} actual={proc.returncode}")

    combined = f"{proc.stdout}\n{proc.stderr}".strip()
    for needle in case.expected_output_contains:
        if needle not in combined:
            errors.append(f"expected output substring missing -> {needle!r}")

    if not summary_path.exists():
        errors.append(f"summary file missing -> {summary_path}")
        summary_text = ""
    else:
        summary_text = summary_path.read_text(encoding="utf-8")
    for needle in case.expected_summary_contains:
        if needle not in summary_text:
            errors.append(f"expected summary substring missing -> {needle!r}")

    final_template = template_path.read_text(encoding="utf-8")
    synced_after_run = (
        extract_validation_commands(final_template) == list(DEFAULT_VALIDATION_COMMANDS)
    )
    if synced_after_run != case.expect_synced_after_run:
        errors.append(
            "unexpected template sync state: "
            f"expected={case.expect_synced_after_run} actual={synced_after_run}"
        )

    passed = len(errors) == 0
    result = {
        "id": case.case_id,
        "use_write": case.use_write,
        "expect_pass": case.expect_pass,
        "expected_synced_after_run": case.expect_synced_after_run,
        "synced_after_run": synced_after_run,
        "passed": passed,
        "errors": errors,
        "stdout_head": (proc.stdout or "").strip().splitlines()[:5],
    }
    return passed, result


def write_report(report_file: Path, results: list[dict[str, Any]]) -> None:
    pass_count = sum(1 for row in results if row.get("passed") is True)
    payload = {
        "suite": "pr_validation_sync_regression",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "scenario_count": len(results),
        "pass_count": pass_count,
        "fail_count": len(results) - pass_count,
        "passed": pass_count == len(results),
        "results": results,
    }
    report_file.parent.mkdir(parents=True, exist_ok=True)
    report_file.write_text(f"{json.dumps(payload, ensure_ascii=False, indent=2)}\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    cases = make_cases()
    if not cases:
        raise SystemExit("no regression cases configured")

    failures: list[str] = []
    results: list[dict[str, Any]] = []
    with tempfile.TemporaryDirectory(prefix="pr_validation_sync_regression_") as temp_dir:
        temp_root = Path(temp_dir)
        for case in cases:
            passed, result = run_case(case, temp_root)
            results.append(result)
            if passed:
                print(f"[pass] {case.case_id}")
                continue
            print(f"[fail] {case.case_id}")
            for err in result.get("errors", []):
                failures.append(f"{case.case_id}: {err}")

    if args.report_file is not None:
        write_report(args.report_file.resolve(), results)

    if failures:
        print("pr validation sync regression check failed")
        for row in failures:
            print(f"- {row}")
        raise SystemExit(1)

    print("all pr validation sync regression cases passed")


if __name__ == "__main__":
    main()
