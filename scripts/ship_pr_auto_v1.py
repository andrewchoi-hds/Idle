#!/usr/bin/env python3
from __future__ import annotations

import argparse
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="One-command PR shipping: create/update PR body + wait checks + merge."
    )
    parser.add_argument("--base", default="main", help="Base branch.")
    parser.add_argument(
        "--head",
        default="",
        help="Head branch. Defaults to current branch.",
    )
    parser.add_argument("--title", default="", help="Optional PR title override.")
    parser.add_argument(
        "--method",
        choices=["squash", "merge", "rebase"],
        default="squash",
        help="Merge method.",
    )
    parser.add_argument(
        "--wait-seconds",
        type=int,
        default=900,
        help="Max wait seconds for checks before merge.",
    )
    parser.add_argument(
        "--poll-interval-seconds",
        type=int,
        default=6,
        help="Polling interval while waiting for checks.",
    )
    parser.add_argument(
        "--no-run-validation",
        action="store_true",
        help="Skip validation during PR body generation.",
    )
    parser.add_argument(
        "--allow-dirty",
        action="store_true",
        help="Allow dirty worktree (forwarded to PR create step).",
    )
    parser.add_argument(
        "--no-push",
        action="store_true",
        help="Skip push in PR create step.",
    )
    parser.add_argument(
        "--no-review",
        action="store_true",
        help="Skip PR auto-approve step.",
    )
    parser.add_argument(
        "--review-body",
        default="자동 승인: pr:ship:auto 워크플로우",
        help="Approval comment body for PR auto-review.",
    )
    parser.add_argument(
        "--require-review",
        action="store_true",
        help="Fail if PR approval cannot be posted.",
    )
    parser.add_argument(
        "--keep-branch",
        action="store_true",
        help="Do not delete head branch after merge.",
    )
    parser.add_argument(
        "--no-auto-on-blocked",
        action="store_true",
        help="Do not retry with gh --auto when direct merge is blocked.",
    )
    parser.add_argument(
        "--admin",
        action="store_true",
        help="Pass --admin on merge.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show plan only.",
    )
    return parser.parse_args()


def run(cmd: list[str], *, check: bool = True) -> None:
    completed = subprocess.run(cmd, cwd=ROOT, text=True, capture_output=False)
    if check and completed.returncode != 0:
        raise SystemExit(completed.returncode)


def current_branch() -> str:
    completed = subprocess.run(
        ["git", "branch", "--show-current"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=True,
    )
    return completed.stdout.strip()


def main() -> None:
    args = parse_args()
    head = args.head.strip() or current_branch()
    if not head:
        raise SystemExit("failed to resolve head branch")

    create_cmd = [
        "python3",
        "scripts/create_pr_with_body_v1.py",
        "--base",
        args.base,
        "--head",
        head,
    ]
    if args.title.strip():
        create_cmd += ["--title", args.title.strip()]
    if not args.no_run_validation:
        create_cmd.append("--run-validation")
    if args.allow_dirty:
        create_cmd.append("--allow-dirty")
    if args.no_push:
        create_cmd.append("--no-push")
    if args.dry_run:
        create_cmd.append("--dry-run")

    merge_cmd = [
        "python3",
        "scripts/merge_pr_when_ready_v1.py",
        "--base",
        args.base,
        "--head",
        head,
        "--method",
        args.method,
        "--wait-seconds",
        str(max(1, args.wait_seconds)),
        "--poll-interval-seconds",
        str(max(1, args.poll_interval_seconds)),
    ]
    if not args.keep_branch:
        merge_cmd.append("--delete-branch")
    if not args.no_auto_on_blocked:
        merge_cmd.append("--auto-on-blocked")
    if args.admin:
        merge_cmd.append("--admin")
    if args.dry_run:
        merge_cmd.append("--dry-run")

    review_cmd = [
        "python3",
        "scripts/review_pr_auto_v1.py",
        "--base",
        args.base,
        "--head",
        head,
        "--body",
        args.review_body,
    ]
    if args.require_review:
        review_cmd.append("--require-success")
    if args.dry_run:
        review_cmd.append("--dry-run")

    print("[ship] step1: create/update PR")
    run(create_cmd, check=True)
    if args.dry_run:
        print(f"[ship] dry-run next step (review): {'skip' if args.no_review else 'run'}")
        print("[ship] dry-run next step (merge): run")
        print("[ship] dry-run done")
        return

    if args.no_review:
        print("[ship] step2: skip PR auto-approve")
    else:
        print("[ship] step2: auto-approve PR")
        run(review_cmd, check=True)

    print("[ship] step3: wait checks and merge PR")
    run(merge_cmd, check=True)
    print("[ship] done")


if __name__ == "__main__":
    main()
