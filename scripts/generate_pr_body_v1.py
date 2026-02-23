#!/usr/bin/env python3
from __future__ import annotations

import argparse
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT = Path("/tmp/idle_pr_body_v1.md")
DEFAULT_VALIDATION_COMMANDS = [
    "npm run typecheck",
    "npm run combat:diff:py-ts:suite",
    "npm run save:auto:regression:check",
    "npm run save:offline:regression:check",
]


@dataclass
class ValidationResult:
    command: str
    passed: bool
    detail: str = ""
    executed: bool = False


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a filled PR body markdown from git diff and validation results."
    )
    parser.add_argument("--base-ref", default="origin/main", help="Base git ref for diff range.")
    parser.add_argument("--head-ref", default="HEAD", help="Head git ref for diff range.")
    parser.add_argument(
        "--output-file",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Output markdown file path.",
    )
    parser.add_argument(
        "--title",
        default="",
        help="Optional PR title hint for summary section.",
    )
    parser.add_argument(
        "--max-changes",
        type=int,
        default=12,
        help="Max changed file bullets to print in Changes section.",
    )
    parser.add_argument(
        "--include-commits",
        type=int,
        default=5,
        help="How many commit subjects to include in Notes.",
    )
    parser.add_argument(
        "--validated",
        action="append",
        default=[],
        help="Validation command to mark as already passed (repeatable).",
    )
    parser.add_argument(
        "--run-validation",
        action="store_true",
        help="Run default validation commands now and mark checkboxes from results.",
    )
    return parser.parse_args()


def run_git(args: list[str]) -> str:
    completed = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    if completed.returncode != 0:
        raise RuntimeError(
            f"git {' '.join(args)} failed\nstdout:\n{completed.stdout}\nstderr:\n{completed.stderr}"
        )
    return completed.stdout.strip()


def get_changed_files(base_ref: str, head_ref: str) -> list[str]:
    output = run_git(["diff", "--name-only", f"{base_ref}..{head_ref}"])
    if not output:
        return []
    return [line.strip() for line in output.splitlines() if line.strip()]


def get_commit_subjects(base_ref: str, head_ref: str) -> list[str]:
    output = run_git(["log", "--no-merges", "--pretty=format:%s", f"{base_ref}..{head_ref}"])
    if not output:
        return []
    return [line.strip() for line in output.splitlines() if line.strip()]


def infer_file_reason(path: str) -> str:
    if path.startswith(".github/workflows/"):
        return "CI 워크플로우/검증 파이프라인 변경"
    if path.startswith(".github/"):
        return "PR/레포 운영 템플릿 변경"
    if path.startswith("scripts/"):
        return "자동화/검증 스크립트 로직 변경"
    if path.startswith("src/"):
        return "런타임 코드 변경"
    if path.startswith("docs/"):
        return "설계/운영 문서 갱신"
    if path.startswith("data/sim/"):
        return "회귀 시나리오/시뮬레이션 데이터 갱신"
    if path == "package.json":
        return "npm 명령/실행 엔트리 갱신"
    if path == "README.md":
        return "리포지토리 사용 가이드 갱신"
    if path == ".gitignore":
        return "생성 산출물 추적 정책 조정"
    return "구현 세부 변경"


def category_counts(paths: list[str]) -> list[tuple[str, int]]:
    labels = {
        "src/": "런타임 코드",
        "scripts/": "자동화 스크립트",
        "docs/": "문서",
        ".github/": "GitHub 설정/CI",
        "data/": "데이터",
        "package.json": "npm 스크립트",
        "README.md": "README",
        ".gitignore": "gitignore",
    }
    counts: dict[str, int] = {}
    for path in paths:
        label = "기타"
        for key, name in labels.items():
            if key.endswith("/") and path.startswith(key):
                label = name
                break
            if path == key:
                label = name
                break
        counts[label] = counts.get(label, 0) + 1
    return sorted(counts.items(), key=lambda row: (-row[1], row[0]))


def run_validation_commands(commands: list[str]) -> list[ValidationResult]:
    results: list[ValidationResult] = []
    for command in commands:
        completed = subprocess.run(
            command,
            cwd=ROOT,
            shell=True,
            text=True,
            capture_output=True,
        )
        if completed.returncode == 0:
            results.append(ValidationResult(command=command, passed=True, executed=True))
            continue
        detail = (completed.stderr or completed.stdout).strip().splitlines()
        first_line = detail[0] if detail else "no output"
        results.append(
            ValidationResult(
                command=command,
                passed=False,
                detail=first_line,
                executed=True,
            )
        )
    return results


def build_markdown(
    title_hint: str,
    base_ref: str,
    head_ref: str,
    changed_files: list[str],
    commit_subjects: list[str],
    validation_results: list[ValidationResult],
    include_commits: int,
    max_changes: int,
) -> str:
    changed_count = len(changed_files)
    commit_count = len(commit_subjects)
    top_categories = category_counts(changed_files)[:3]
    category_text = ", ".join(f"{name} {count}건" for name, count in top_categories) or "변경 없음"
    lead_topic = title_hint.strip() or (commit_subjects[0] if commit_subjects else "작업 브랜치 변경")

    lines: list[str] = []
    lines.append("## Summary")
    lines.append(
        f"- 문제/배경: `{base_ref}..{head_ref}` 범위 변경({commit_count} commits, {changed_count} files)을 PR에서 빠르게 파악하기 어려운 상태."
    )
    lines.append(f"- 해결 내용: `{lead_topic}` 중심으로 `{category_text}`를 정리해 반영.")
    lines.append("- 기대 효과: 리뷰어가 핵심 변경/검증 상태를 PR 본문만으로 즉시 확인 가능.")
    lines.append("")

    lines.append("## Changes")
    if changed_files:
        for path in changed_files[: max(1, max_changes)]:
            abs_path = (ROOT / path).resolve()
            lines.append(f"- `{abs_path}`: {infer_file_reason(path)}")
        if len(changed_files) > max_changes:
            lines.append(f"- 추가 파일 {len(changed_files) - max_changes}건은 `git diff --name-only` 기준으로 포함됨.")
    else:
        lines.append("- 변경 파일 없음")
    lines.append("")

    lines.append("## Validation")
    validation_map = {row.command: row for row in validation_results}
    for command in DEFAULT_VALIDATION_COMMANDS:
        row = validation_map.get(command)
        checked = row.passed if row else False
        mark = "x" if checked else " "
        lines.append(f"- [{mark}] `{command}`")
    lines.append("")

    docs_changed = any(path.startswith("docs/") for path in changed_files)
    checklist_changed = "docs/idle_xianxia_design_v0.3_kr.md" in changed_files
    lines.append("## Docs")
    lines.append(
        f"- [{'x' if docs_changed else ' '}] Updated docs if behavior or workflow changed"
    )
    lines.append(
        f"- [{'x' if checklist_changed else ' '}] Updated `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md` checklist section"
    )
    lines.append("")

    lines.append("## Notes")
    lines.append(f"- Generated at: `{datetime.now(timezone.utc).isoformat()}`")
    lines.append(f"- Diff range: `{base_ref}..{head_ref}`")
    if commit_subjects:
        for subject in commit_subjects[: max(1, include_commits)]:
            lines.append(f"- commit: `{subject}`")
        if len(commit_subjects) > include_commits:
            lines.append(f"- ...and {len(commit_subjects) - include_commits} more commits")
    else:
        lines.append("- commit: (no new commit found in diff range)")

    failed_validations = [row for row in validation_results if row.executed and not row.passed]
    if failed_validations:
        lines.append("- validation failures:")
        for row in failed_validations:
            detail = row.detail if row.detail else "no detail"
            lines.append(f"- `{row.command}` -> `{detail}`")
    return "\n".join(lines) + "\n"


def main() -> None:
    args = parse_args()
    changed_files = get_changed_files(args.base_ref, args.head_ref)
    commit_subjects = get_commit_subjects(args.base_ref, args.head_ref)

    if args.run_validation:
        validation_results = run_validation_commands(DEFAULT_VALIDATION_COMMANDS)
    else:
        validated = set(args.validated)
        validation_results = [
            ValidationResult(command=cmd, passed=(cmd in validated), executed=False)
            for cmd in DEFAULT_VALIDATION_COMMANDS
        ]

    markdown = build_markdown(
        title_hint=args.title,
        base_ref=args.base_ref,
        head_ref=args.head_ref,
        changed_files=changed_files,
        commit_subjects=commit_subjects,
        validation_results=validation_results,
        include_commits=max(1, args.include_commits),
        max_changes=max(1, args.max_changes),
    )
    output_path = args.output_file.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    print(f"wrote PR body -> {output_path}")

    failed = [row for row in validation_results if not row.passed]
    if args.run_validation and failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
