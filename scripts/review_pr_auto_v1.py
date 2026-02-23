#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


@dataclass
class PrRef:
    number: int
    url: str
    title: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Approve an open PR resolved by number or base/head branch."
    )
    parser.add_argument("--pr", type=int, help="PR number. If omitted, resolve by base/head.")
    parser.add_argument("--base", default="main", help="Base branch name for PR lookup.")
    parser.add_argument(
        "--head",
        default="",
        help="Head branch for PR lookup. Defaults to current git branch.",
    )
    parser.add_argument(
        "--body",
        default="자동 승인: pr:review:auto 워크플로우",
        help="Approval comment body.",
    )
    parser.add_argument(
        "--require-success",
        action="store_true",
        help="Fail when approval cannot be posted.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print target PR and exit without review.",
    )
    return parser.parse_args()


def run(
    cmd: list[str],
    *,
    check: bool = True,
    capture: bool = True,
) -> subprocess.CompletedProcess[str]:
    completed = subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        capture_output=capture,
    )
    if check and completed.returncode != 0:
        raise RuntimeError(
            f"command failed: {' '.join(cmd)}\nstdout:\n{completed.stdout}\nstderr:\n{completed.stderr}"
        )
    return completed


def current_branch() -> str:
    return run(["git", "branch", "--show-current"]).stdout.strip()


def resolve_pr_by_branch(base: str, head: str) -> PrRef:
    completed = run(
        [
            "gh",
            "pr",
            "list",
            "--state",
            "open",
            "--base",
            base,
            "--head",
            head,
            "--json",
            "number,url,title",
        ]
    )
    parsed = json.loads(completed.stdout.strip() or "[]")
    if not isinstance(parsed, list) or not parsed:
        raise RuntimeError(f"no open PR found for {head}->{base}")
    row = parsed[0]
    if not isinstance(row, dict):
        raise RuntimeError("invalid gh pr list response format")
    return PrRef(number=int(row["number"]), url=str(row["url"]), title=str(row["title"]))


def resolve_pr(pr_number: int | None, base: str, head: str) -> PrRef:
    if pr_number is None:
        return resolve_pr_by_branch(base, head)
    completed = run(
        [
            "gh",
            "pr",
            "view",
            str(pr_number),
            "--json",
            "number,url,title,state",
        ]
    )
    parsed = json.loads(completed.stdout.strip() or "{}")
    if not isinstance(parsed, dict):
        raise RuntimeError("invalid gh pr view response format")
    state = str(parsed.get("state", "")).upper()
    if state != "OPEN":
        raise RuntimeError(f"PR #{pr_number} is not open (state={state})")
    return PrRef(
        number=int(parsed["number"]),
        url=str(parsed["url"]),
        title=str(parsed["title"]),
    )


def approve(pr_number: int, body: str) -> subprocess.CompletedProcess[str]:
    return run(
        ["gh", "pr", "review", str(pr_number), "--approve", "--body", body],
        check=False,
        capture=True,
    )


def first_non_empty_line(text: str) -> str:
    for line in text.splitlines():
        stripped = line.strip()
        if stripped:
            return stripped
    return "no output"


def main() -> None:
    args = parse_args()
    head = args.head.strip() or current_branch()
    base = args.base.strip()
    if not head:
        raise RuntimeError("head branch is empty")
    if not base:
        raise RuntimeError("base branch is empty")

    pr = resolve_pr(args.pr, base, head)
    print(f"target PR -> #{pr.number} {pr.title}")
    print(f"url -> {pr.url}")

    if args.dry_run:
        print("[dry-run] would run: gh pr review --approve")
        return

    completed = approve(pr.number, args.body)
    if completed.returncode == 0:
        print(f"approved PR -> {pr.url}")
        return

    detail = first_non_empty_line((completed.stderr or completed.stdout or "").strip())
    if args.require_success:
        raise RuntimeError(f"failed to approve PR #{pr.number}: {detail}")
    print(f"approval skipped for PR #{pr.number}: {detail}")


if __name__ == "__main__":
    main()
