#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_AUTO_REPORT = ROOT / "data/sim/save_auto_progress_regression_report_v1.json"
DEFAULT_OFFLINE_REPORT = ROOT / "data/sim/save_offline_catchup_regression_report_v1.json"
DEFAULT_OUTPUT_MD = ROOT / "data/sim/save_regression_ci_summary_v1.md"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build markdown summary from save regression report JSON files."
    )
    parser.add_argument("--auto-report", type=Path, default=DEFAULT_AUTO_REPORT)
    parser.add_argument("--offline-report", type=Path, default=DEFAULT_OFFLINE_REPORT)
    parser.add_argument("--output-md", type=Path, default=DEFAULT_OUTPUT_MD)
    return parser.parse_args()


def load_report(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {
            "suite": path.stem,
            "passed": False,
            "scenario_count": 0,
            "pass_count": 0,
            "fail_count": 0,
            "results": [],
            "load_error": f"missing report file: {path}",
        }

    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        return {
            "suite": path.stem,
            "passed": False,
            "scenario_count": 0,
            "pass_count": 0,
            "fail_count": 0,
            "results": [],
            "load_error": f"invalid report format: {path}",
        }
    return raw


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


def build_suite_table_row(name: str, report: dict[str, Any]) -> str:
    passed = bool(report.get("passed"))
    pass_count = safe_int(report.get("pass_count"), 0)
    scenario_count = safe_int(report.get("scenario_count"), 0)
    fail_count = safe_int(report.get("fail_count"), 0)
    return f"| {name} | {fmt_status(passed)} | {pass_count}/{scenario_count} | {fail_count} |"


def build_auto_rows(report: dict[str, Any]) -> list[str]:
    rows: list[str] = []
    for result in report.get("results", []):
        if not isinstance(result, dict):
            continue
        summary = result.get("summary", {})
        if not isinstance(summary, dict):
            summary = {}
        rows.append(
            "| {id} | {status} | {stage} | {breaks} | {rebirth} | {warnings} | {events} |".format(
                id=safe_text(result.get("id")),
                status=fmt_status(bool(result.get("passed"))),
                stage=safe_text(summary.get("finalDifficultyIndex")),
                breaks=safe_text(summary.get("breakthroughAttempts")),
                rebirth=safe_text(summary.get("rebirthCountDelta")),
                warnings=safe_text(summary.get("warningCount")),
                events=safe_text(summary.get("eventCount")),
            )
        )
    return rows


def build_offline_rows(report: dict[str, Any]) -> list[str]:
    rows: list[str] = []
    for result in report.get("results", []):
        if not isinstance(result, dict):
            continue
        summary = result.get("summary", {})
        if not isinstance(summary, dict):
            summary = {}
        rows.append(
            "| {id} | {status} | {applied} | {capped} | {stage} | {skip} | {warnings} | {events} |".format(
                id=safe_text(result.get("id")),
                status=fmt_status(bool(result.get("passed"))),
                applied=safe_text(summary.get("appliedOfflineSec")),
                capped=safe_text(summary.get("cappedByMaxOffline")),
                stage=safe_text(summary.get("finalDifficultyIndex")),
                skip=safe_text(summary.get("skipReason")),
                warnings=safe_text(summary.get("warningCount")),
                events=safe_text(summary.get("eventCount")),
            )
        )
    return rows


def build_markdown(auto_report: dict[str, Any], offline_report: dict[str, Any]) -> str:
    lines: list[str] = []
    lines.append("## Save Regression Summary")
    lines.append("")
    lines.append("| Suite | Result | Pass/Total | Failed |")
    lines.append("| --- | --- | --- | --- |")
    lines.append(build_suite_table_row("Auto Progress", auto_report))
    lines.append(build_suite_table_row("Offline Catchup", offline_report))

    auto_error = auto_report.get("load_error")
    offline_error = offline_report.get("load_error")
    if auto_error:
        lines.append("")
        lines.append(f"- auto report error: `{auto_error}`")
    if offline_error:
        lines.append("")
        lines.append(f"- offline report error: `{offline_error}`")

    lines.append("")
    lines.append("### Auto Progress Scenarios")
    lines.append("")
    lines.append("| Scenario | Result | Final Stage | Break Attempts | Rebirth Delta | Warnings | Events |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- |")
    auto_rows = build_auto_rows(auto_report)
    if auto_rows:
        lines.extend(auto_rows)
    else:
        lines.append("| - | - | - | - | - | - | - |")

    lines.append("")
    lines.append("### Offline Catchup Scenarios")
    lines.append("")
    lines.append("| Scenario | Result | Applied Sec | Capped | Final Stage | Skip Reason | Warnings | Events |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- | --- |")
    offline_rows = build_offline_rows(offline_report)
    if offline_rows:
        lines.extend(offline_rows)
    else:
        lines.append("| - | - | - | - | - | - | - | - |")

    return "\n".join(lines) + "\n"


def main() -> None:
    args = parse_args()
    auto_report = load_report(args.auto_report.resolve())
    offline_report = load_report(args.offline_report.resolve())
    markdown = build_markdown(auto_report, offline_report)

    output_path = args.output_md.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    sys.stdout.write(markdown)


if __name__ == "__main__":
    main()
