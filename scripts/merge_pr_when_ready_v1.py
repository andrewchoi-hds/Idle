#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import time
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
        description="Wait for PR checks to pass, then merge the PR with gh CLI."
    )
    parser.add_argument("--pr", type=int, help="PR number. If omitted, resolve by base/head.")
    parser.add_argument("--base", default="main", help="Base branch for PR lookup.")
    parser.add_argument(
        "--head",
        default="",
        help="Head branch for PR lookup. Defaults to current git branch.",
    )
    parser.add_argument(
        "--method",
        choices=["squash", "merge", "rebase"],
        default="squash",
        help="Merge strategy.",
    )
    parser.add_argument(
        "--wait-seconds",
        type=int,
        default=900,
        help="Max seconds to wait for checks before failing.",
    )
    parser.add_argument(
        "--poll-interval-seconds",
        type=int,
        default=6,
        help="Polling interval for PR checks while waiting.",
    )
    parser.add_argument(
        "--no-wait",
        action="store_true",
        help="Do not wait. Fail immediately if checks are not green.",
    )
    parser.add_argument(
        "--delete-branch",
        action="store_true",
        help="Delete head branch after merge.",
    )
    parser.add_argument(
        "--auto-on-blocked",
        action="store_true",
        help="If direct merge is blocked, retry with --auto.",
    )
    parser.add_argument(
        "--admin",
        action="store_true",
        help="Pass --admin to gh pr merge.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would happen without merging.",
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


def classify_checks(pr_number: int) -> tuple[str, str]:
    completed = run(
        ["gh", "pr", "checks", str(pr_number)],
        check=False,
        capture=True,
    )
    text = (completed.stdout or completed.stderr or "").strip()
    normalized = text.lower()
    if completed.returncode == 0:
        return "pass", text
    if "no checks reported" in normalized:
        return "pending", text
    if completed.returncode == 8:
        return "pending", text
    return "fail", text


def wait_for_checks(pr_number: int, wait_seconds: int, poll_interval_seconds: int) -> None:
    started = time.monotonic()
    while True:
        status, detail = classify_checks(pr_number)
        if status == "pass":
            return
        if status == "fail":
            raise RuntimeError(f"PR checks failed for #{pr_number}\n{detail}")

        elapsed = int(time.monotonic() - started)
        if elapsed >= wait_seconds:
            raise RuntimeError(
                f"timed out waiting for PR checks (waited {wait_seconds}s)\n{detail}"
            )
        sleep_for = max(1, poll_interval_seconds)
        print(
            f"checks pending for PR #{pr_number} (elapsed={elapsed}s/{wait_seconds}s), "
            f"next poll in {sleep_for}s"
        )
        time.sleep(sleep_for)


def merge_pr(
    pr_number: int,
    method: str,
    delete_branch: bool,
    admin: bool,
    auto: bool,
) -> None:
    cmd = ["gh", "pr", "merge", str(pr_number), f"--{method}"]
    if delete_branch:
        cmd.append("--delete-branch")
    if admin:
        cmd.append("--admin")
    if auto:
        cmd.append("--auto")
    run(cmd, check=True, capture=False)


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
        print(f"[dry-run] method={args.method}")
        print(f"[dry-run] delete_branch={args.delete_branch}")
        print(f"[dry-run] admin={args.admin}")
        print(f"[dry-run] auto_on_blocked={args.auto_on_blocked}")
        print(f"[dry-run] wait={not args.no_wait} wait_seconds={args.wait_seconds}")
        return

    if args.no_wait:
        status, detail = classify_checks(pr.number)
        if status != "pass":
            raise RuntimeError(f"checks are not green for PR #{pr.number}\n{detail}")
    else:
        wait_for_checks(pr.number, args.wait_seconds, args.poll_interval_seconds)

    try:
        merge_pr(
            pr_number=pr.number,
            method=args.method,
            delete_branch=args.delete_branch,
            admin=args.admin,
            auto=False,
        )
        print(f"merged PR -> {pr.url}")
    except RuntimeError as err:
        if not args.auto_on_blocked:
            raise
        print(f"direct merge blocked, retrying with --auto: {err}")
        merge_pr(
            pr_number=pr.number,
            method=args.method,
            delete_branch=args.delete_branch,
            admin=args.admin,
            auto=True,
        )
        print(f"auto-merge queued -> {pr.url}")


if __name__ == "__main__":
    main()
