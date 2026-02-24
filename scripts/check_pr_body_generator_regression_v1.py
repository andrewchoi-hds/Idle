#!/usr/bin/env python3
from __future__ import annotations

import argparse
from dataclasses import dataclass
from datetime import datetime, timezone
import json
import re
from pathlib import Path
from typing import Any

from generate_pr_body_v1 import FileDiffStat, ValidationResult, build_markdown
from pr_validation_commands_v1 import DEFAULT_VALIDATION_COMMANDS


VALIDATION_LINE_RE = re.compile(r"^- \[([ xX])\] `([^`]+)`\s*$")


@dataclass
class Case:
    case_id: str
    title_hint: str
    base_ref: str
    head_ref: str
    changed_files: list[str]
    commit_entries: list[tuple[str, str]]
    file_stats: dict[str, FileDiffStat]
    validation_results: list[ValidationResult]
    include_commits: int
    max_changes: int
    expected_contains: list[str]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run regression checks for PR body generator markdown builder."
    )
    parser.add_argument(
        "--report-file",
        type=Path,
        help="Optional JSON report output path.",
    )
    return parser.parse_args()


def build_stats(rows: list[tuple[str, int, int, bool]]) -> dict[str, FileDiffStat]:
    return {
        path: FileDiffStat(path=path, added=added, deleted=deleted, is_binary=is_binary)
        for path, added, deleted, is_binary in rows
    }


def make_case(
    *,
    case_id: str,
    title_hint: str,
    changed_files: list[str],
    commit_entries: list[tuple[str, str]],
    stats_rows: list[tuple[str, int, int, bool]],
    validation_results: list[ValidationResult],
    include_commits: int,
    max_changes: int,
    expected_contains: list[str],
) -> Case:
    return Case(
        case_id=case_id,
        title_hint=title_hint,
        base_ref="origin/main",
        head_ref="HEAD",
        changed_files=changed_files,
        commit_entries=commit_entries,
        file_stats=build_stats(stats_rows),
        validation_results=validation_results,
        include_commits=include_commits,
        max_changes=max_changes,
        expected_contains=expected_contains,
    )


def make_cases() -> list[Case]:
    commands = list(DEFAULT_VALIDATION_COMMANDS)
    if len(commands) < 2:
        raise RuntimeError("DEFAULT_VALIDATION_COMMANDS requires at least 2 commands")

    partial_validation: list[ValidationResult] = []
    for idx, command in enumerate(commands):
        partial_validation.append(
            ValidationResult(command=command, passed=(idx < 2), executed=False)
        )

    failed_command = commands[-1]
    with_failure: list[ValidationResult] = []
    for command in commands:
        if command == failed_command:
            with_failure.append(
                ValidationResult(
                    command=command,
                    passed=False,
                    detail="simulated failure detail",
                    executed=True,
                )
            )
            continue
        with_failure.append(ValidationResult(command=command, passed=True, executed=True))

    all_unchecked = [ValidationResult(command=command, passed=False, executed=False) for command in commands]

    return [
        make_case(
            case_id="structure_with_diff_and_truncation",
            title_hint="feat(ci): sample body generator regression",
            changed_files=[
                "scripts/generate_pr_body_v1.py",
                "docs/system/pr_body_generator_v1_kr.md",
                "package.json",
                ".github/workflows/combat-diff-ci.yml",
                "data/sim/pr_body_generator_regression_report_v1.json",
            ],
            commit_entries=[
                ("abc1111", "feat(ci): add generator regression step"),
                ("abc2222", "docs: update generator guide"),
                ("abc3333", "chore: align script naming"),
            ],
            stats_rows=[
                ("scripts/generate_pr_body_v1.py", 20, 5, False),
                ("docs/system/pr_body_generator_v1_kr.md", 8, 0, False),
                ("package.json", 3, 1, False),
                (".github/workflows/combat-diff-ci.yml", 5, 2, False),
                ("data/sim/pr_body_generator_regression_report_v1.json", 0, 0, False),
            ],
            validation_results=partial_validation,
            include_commits=2,
            max_changes=3,
            expected_contains=[
                "## Summary",
                "- 변경 규모: `5 files, 3 commits, +36/-8 lines` (git numstat 기준).",
                "## Changes",
                "- 추가 파일 2건은 `git diff --name-only` 기준으로 포함됨.",
                "## Validation",
                "## Docs",
                "- [x] Updated docs if behavior or workflow changed",
                "- [ ] Updated `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md` checklist section",
                "## Notes",
                "- ...and 1 more commits",
            ],
        ),
        make_case(
            case_id="validation_failure_notes",
            title_hint="",
            changed_files=[
                "docs/idle_xianxia_design_v0.3_kr.md",
                "scripts/lint_pr_body_v1.py",
            ],
            commit_entries=[("def1111", "feat(devx): strengthen body lint validation order")],
            stats_rows=[
                ("docs/idle_xianxia_design_v0.3_kr.md", 9, 0, False),
                ("scripts/lint_pr_body_v1.py", 32, 6, False),
            ],
            validation_results=with_failure,
            include_commits=5,
            max_changes=12,
            expected_contains=[
                "- [x] Updated docs if behavior or workflow changed",
                "- [x] Updated `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md` checklist section",
                "- validation failures:",
                f"- `{failed_command}` -> `simulated failure detail`",
            ],
        ),
        make_case(
            case_id="empty_diff_shape",
            title_hint="",
            changed_files=[],
            commit_entries=[],
            stats_rows=[],
            validation_results=all_unchecked,
            include_commits=5,
            max_changes=12,
            expected_contains=[
                "- 해결 내용: `작업 브랜치 변경` 중심으로 `변경 없음`를 정리해 반영.",
                "- 변경 규모: `0 files, 0 commits, +0/-0 lines` (git numstat 기준).",
                "- 변경 파일 없음",
                "- commit: (no new commit found in diff range)",
            ],
        ),
    ]


def extract_validation_lines(markdown: str) -> list[tuple[bool, str]]:
    lines = markdown.splitlines()
    in_validation = False
    rows: list[tuple[bool, str]] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## "):
            if stripped == "## Validation":
                in_validation = True
                continue
            if in_validation:
                break
        if not in_validation:
            continue
        matched = VALIDATION_LINE_RE.match(stripped)
        if matched is None:
            continue
        checked = matched.group(1).lower() == "x"
        rows.append((checked, matched.group(2).strip()))
    return rows


def expected_validation_marks(results: list[ValidationResult]) -> dict[str, bool]:
    marks = {command: False for command in DEFAULT_VALIDATION_COMMANDS}
    for row in results:
        marks[row.command] = bool(row.passed)
    return marks


def run_case(case: Case) -> tuple[bool, dict[str, Any]]:
    markdown = build_markdown(
        title_hint=case.title_hint,
        base_ref=case.base_ref,
        head_ref=case.head_ref,
        changed_files=case.changed_files,
        commit_entries=case.commit_entries,
        file_stats=case.file_stats,
        validation_results=case.validation_results,
        include_commits=max(1, case.include_commits),
        max_changes=max(1, case.max_changes),
    )

    errors: list[str] = []
    required_sections = ["## Summary", "## Changes", "## Validation", "## Docs", "## Notes"]
    for section in required_sections:
        if section not in markdown:
            errors.append(f"missing section -> {section}")

    for needle in case.expected_contains:
        if needle not in markdown:
            errors.append(f"expected markdown substring missing -> {needle!r}")

    validation_rows = extract_validation_lines(markdown)
    if len(validation_rows) != len(DEFAULT_VALIDATION_COMMANDS):
        errors.append(
            "unexpected validation row count: "
            f"expected={len(DEFAULT_VALIDATION_COMMANDS)} actual={len(validation_rows)}"
        )
    actual_order = [command for _, command in validation_rows]
    expected_order = list(DEFAULT_VALIDATION_COMMANDS)
    if actual_order != expected_order:
        errors.append(
            "validation command order mismatch: "
            f"expected={expected_order} actual={actual_order}"
        )

    expected_marks = expected_validation_marks(case.validation_results)
    for checked, command in validation_rows:
        if command not in expected_marks:
            errors.append(f"unknown validation command rendered -> {command}")
            continue
        if checked != expected_marks[command]:
            errors.append(
                "validation mark mismatch: "
                f"command={command} expected={expected_marks[command]} actual={checked}"
            )

    passed = len(errors) == 0
    expected_failure_count = sum(1 for row in case.validation_results if row.executed and not row.passed)
    result = {
        "id": case.case_id,
        "passed": passed,
        "changed_file_count": len(case.changed_files),
        "commit_count": len(case.commit_entries),
        "expected_validation_failure_count": expected_failure_count,
        "errors": errors,
        "markdown_head": markdown.splitlines()[:8],
    }
    return passed, result


def write_report(report_file: Path, results: list[dict[str, Any]]) -> None:
    pass_count = sum(1 for row in results if row.get("passed") is True)
    payload = {
        "suite": "pr_body_generator_regression",
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
    for case in cases:
        passed, result = run_case(case)
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
        print("pr body generator regression check failed")
        for row in failures:
            print(f"- {row}")
        raise SystemExit(1)

    print("all pr body generator regression cases passed")


if __name__ == "__main__":
    main()
