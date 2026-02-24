#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_REPORT = ROOT / "data/sim/pr_validation_sync_regression_report_v1.json"
DEFAULT_OUTPUT_MD = ROOT / "data/sim/pr_validation_sync_regression_ci_summary_v1.md"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build markdown summary from PR validation sync regression report JSON."
    )
    parser.add_argument("--report-file", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--output-md", type=Path, default=DEFAULT_OUTPUT_MD)
    return parser.parse_args()


def load_report(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {
            "suite": "pr_validation_sync_regression",
            "passed": False,
            "scenario_count": 0,
            "pass_count": 0,
            "fail_count": 0,
            "results": [],
            "load_error": f"missing report file: {path}",
        }
    parsed = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(parsed, dict):
        return {
            "suite": "pr_validation_sync_regression",
            "passed": False,
            "scenario_count": 0,
            "pass_count": 0,
            "fail_count": 0,
            "results": [],
            "load_error": f"invalid report format: {path}",
        }
    return parsed


def fmt_status(passed: bool) -> str:
    return "PASS" if passed else "FAIL"


def safe_int(value: Any, fallback: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return fallback


def safe_text(value: Any, fallback: str = "-") -> str:
    if value is None:
        return fallback
    text = str(value).strip()
    return text if text else fallback


def build_markdown(report: dict[str, Any]) -> str:
    lines: list[str] = []
    suite_name = safe_text(report.get("suite"), "pr_validation_sync_regression")
    passed = bool(report.get("passed"))
    pass_count = safe_int(report.get("pass_count"), 0)
    scenario_count = safe_int(report.get("scenario_count"), 0)
    fail_count = safe_int(report.get("fail_count"), 0)

    lines.append("## PR Validation Sync Regression Summary")
    lines.append("")
    lines.append("| Suite | Result | Pass/Total | Failed |")
    lines.append("| --- | --- | --- | --- |")
    lines.append(
        f"| {suite_name} | {fmt_status(passed)} | {pass_count}/{scenario_count} | {fail_count} |"
    )

    load_error = report.get("load_error")
    if load_error:
        lines.append("")
        lines.append(f"- report error: `{safe_text(load_error)}`")

    lines.append("")
    lines.append("### Cases")
    lines.append("")
    lines.append(
        "| Case | Expected Check | Regression Check | Write Mode | Synced After Run | Error Count |"
    )
    lines.append("| --- | --- | --- | --- | --- | --- |")

    results = report.get("results", [])
    if not isinstance(results, list) or not results:
        lines.append("| - | - | - | - | - | - |")
        return "\n".join(lines) + "\n"

    failed_details: list[tuple[str, list[str]]] = []
    for row in results:
        if not isinstance(row, dict):
            continue
        case_id = safe_text(row.get("id"))
        expect_pass = bool(row.get("expect_pass"))
        actual_pass = bool(row.get("passed"))
        use_write = safe_text(row.get("use_write"))
        synced_after_run = safe_text(row.get("synced_after_run"))
        errors = row.get("errors", [])
        error_count = len(errors) if isinstance(errors, list) else 0
        lines.append(
            "| {case_id} | {expected} | {result} | {use_write} | {synced_after_run} | {error_count} |".format(
                case_id=case_id,
                expected=fmt_status(expect_pass),
                result=fmt_status(actual_pass),
                use_write=use_write,
                synced_after_run=synced_after_run,
                error_count=error_count,
            )
        )
        if not actual_pass and isinstance(errors, list):
            failed_details.append((case_id, [safe_text(err) for err in errors]))

    if failed_details:
        lines.append("")
        lines.append("### Failed Case Details")
        lines.append("")
        for case_id, errors in failed_details:
            lines.append(f"- `{case_id}`")
            for err in errors:
                lines.append(f"  - {err}")

    return "\n".join(lines) + "\n"


def main() -> None:
    args = parse_args()
    report = load_report(args.report_file.resolve())
    markdown = build_markdown(report)
    output_path = args.output_md.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    sys.stdout.write(markdown)


if __name__ == "__main__":
    main()
