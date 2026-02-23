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

from pr_validation_commands_v1 import DEFAULT_VALIDATION_COMMANDS


ROOT = Path(__file__).resolve().parent.parent


@dataclass
class Case:
    case_id: str
    input_type: str  # body-file | event-json
    strict_change_path: bool
    expect_pass: bool
    markdown_body: str
    expected_contains: list[str]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run regression checks for PR body lint tool with fixed fixtures."
    )
    parser.add_argument(
        "--report-file",
        type=Path,
        help="Optional JSON report output path.",
    )
    return parser.parse_args()


def make_cases() -> list[Case]:
    validation_lines = [f"- [x] `{command}`" for command in DEFAULT_VALIDATION_COMMANDS]
    first_validation_command = (
        DEFAULT_VALIDATION_COMMANDS[0] if DEFAULT_VALIDATION_COMMANDS else "npm run typecheck"
    )
    valid_body = "\n".join(
        [
            "## Summary",
            "- 문제/배경: 회귀 테스트",
            "- 해결 내용: lint 규칙 검증",
            "- 기대 효과: 품질 보장",
            "",
            "## Changes",
            "- `/Users/hirediversity/Idle/scripts/lint_pr_body_v1.py`: lint logic update",
            "",
            "## Validation",
            *validation_lines,
            "",
            "## Docs",
            "- [x] Updated docs if behavior or workflow changed",
            "- [x] Updated `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md` checklist section",
            "",
            "## Notes",
            "- Generated at: `2026-02-23T00:00:00Z`",
            "- Diff range: `origin/main..HEAD`",
            "",
        ]
    )
    relative_change_body = valid_body.replace(
        "`/Users/hirediversity/Idle/scripts/lint_pr_body_v1.py`",
        "`scripts/lint_pr_body_v1.py`",
    )
    invalid_body = "\n".join(
        [
            "## Summary",
            "- -",
            "",
            "## Changes",
            "- -",
            "",
            "## Validation",
            f"- [x] `{first_validation_command}`",
            "",
            "## Docs",
            "- [x] Updated docs if behavior or workflow changed",
            "",
            "## Notes",
            "- -",
            "",
        ]
    )
    return [
        Case(
            case_id="body_file_valid_strict_pass",
            input_type="body-file",
            strict_change_path=True,
            expect_pass=True,
            markdown_body=valid_body,
            expected_contains=["[pr-body-lint] PASS"],
        ),
        Case(
            case_id="body_file_relative_change_strict_fail",
            input_type="body-file",
            strict_change_path=True,
            expect_pass=False,
            markdown_body=relative_change_body,
            expected_contains=[
                "Changes must include at least one absolute path under /Users/hirediversity/Idle/."
            ],
        ),
        Case(
            case_id="event_json_valid_pass",
            input_type="event-json",
            strict_change_path=False,
            expect_pass=True,
            markdown_body=valid_body,
            expected_contains=["[pr-body-lint] PASS"],
        ),
        Case(
            case_id="event_json_invalid_fail",
            input_type="event-json",
            strict_change_path=False,
            expect_pass=False,
            markdown_body=invalid_body,
            expected_contains=["Summary must contain at least 3 meaningful bullet lines."],
        ),
    ]


def run_case(case: Case, temp_root: Path) -> tuple[bool, dict[str, Any]]:
    fixture_path = temp_root / f"{case.case_id}.md"
    fixture_path.write_text(case.markdown_body, encoding="utf-8")
    summary_path = temp_root / f"{case.case_id}_summary.md"

    cmd = [
        "python3",
        "scripts/lint_pr_body_v1.py",
        "--summary-file",
        str(summary_path),
    ]
    if case.strict_change_path:
        cmd.append("--strict-change-path")

    if case.input_type == "body-file":
        cmd += ["--body-file", str(fixture_path)]
    elif case.input_type == "event-json":
        event_path = temp_root / f"{case.case_id}_event.json"
        event_payload = {"pull_request": {"body": case.markdown_body}}
        event_path.write_text(f"{json.dumps(event_payload, ensure_ascii=False, indent=2)}\n", encoding="utf-8")
        cmd += ["--event-json", str(event_path)]
    else:
        return False, {
            "id": case.case_id,
            "passed": False,
            "errors": [f"unknown input_type: {case.input_type}"],
        }

    proc = subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    expected_rc = 0 if case.expect_pass else 1
    errors: list[str] = []
    if proc.returncode != expected_rc:
        errors.append(
            f"unexpected return code: expected={expected_rc} actual={proc.returncode}"
        )

    combined = f"{proc.stdout}\n{proc.stderr}".strip()
    for needle in case.expected_contains:
        if needle not in combined:
            errors.append(f"expected output substring missing -> {needle!r}")

    if not summary_path.exists():
        errors.append(f"summary file missing -> {summary_path}")
        summary_text = ""
    else:
        summary_text = summary_path.read_text(encoding="utf-8")

    expected_summary_result = "PASS" if case.expect_pass else "FAIL"
    expected_summary_line = f"- Result: `{expected_summary_result}`"
    if expected_summary_line not in summary_text:
        errors.append(f"summary result marker missing -> {expected_summary_line!r}")

    passed = len(errors) == 0
    result = {
        "id": case.case_id,
        "input_type": case.input_type,
        "strict_change_path": case.strict_change_path,
        "expect_pass": case.expect_pass,
        "passed": passed,
        "errors": errors,
        "stdout_head": (proc.stdout or "").strip().splitlines()[:5],
    }
    return passed, result


def write_report(report_file: Path, results: list[dict[str, Any]]) -> None:
    pass_count = sum(1 for row in results if row.get("passed") is True)
    payload = {
        "suite": "pr_body_lint_regression",
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
    with tempfile.TemporaryDirectory(prefix="pr_body_lint_regression_") as temp_dir:
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
        print("pr body lint regression check failed")
        for row in failures:
            print(f"- {row}")
        raise SystemExit(1)

    print("all pr body lint regression cases passed")


if __name__ == "__main__":
    main()
