#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_BODY_FILE = Path("/private/tmp/idle_pr_body_v1.md")
PR_URL_RE = re.compile(r"https://github\.com/[^/\s]+/[^/\s]+/pull/\d+")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate PR body and create/update GitHub PR in one command."
    )
    parser.add_argument("--base", default="main", help="Base branch name.")
    parser.add_argument("--head", default="", help="Head branch name. Defaults to current branch.")
    parser.add_argument("--title", default="", help="PR title. Defaults to latest commit subject in diff.")
    parser.add_argument(
        "--body-file",
        type=Path,
        default=DEFAULT_BODY_FILE,
        help="PR body markdown file path.",
    )
    parser.add_argument(
        "--run-validation",
        action="store_true",
        help="Run validation while generating PR body.",
    )
    parser.add_argument(
        "--allow-dirty",
        action="store_true",
        help="Allow creating/updating PR when working tree is dirty.",
    )
    parser.add_argument(
        "--draft",
        action="store_true",
        help="Create PR as draft (only for new PR).",
    )
    parser.add_argument(
        "--no-update-existing",
        action="store_true",
        help="Fail if an open PR for the same head/base already exists.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be executed without creating/updating PR.",
    )
    parser.add_argument(
        "--no-push",
        action="store_true",
        help="Skip git push before creating/updating PR.",
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


def ensure_clean_worktree(allow_dirty: bool) -> None:
    status = run(["git", "status", "--porcelain"]).stdout.strip()
    if status and not allow_dirty:
        raise RuntimeError(
            "working tree is dirty. Commit/stash changes first or pass --allow-dirty."
        )


def is_clean_worktree() -> bool:
    status = run(["git", "status", "--porcelain"]).stdout.strip()
    return not bool(status)


def fetch_base(base: str) -> None:
    run(["git", "fetch", "origin", base], check=True, capture=False)


def changed_files(base: str, head: str) -> list[str]:
    out = run(["git", "diff", "--name-only", f"origin/{base}..{head}"]).stdout.strip()
    if not out:
        return []
    return [line.strip() for line in out.splitlines() if line.strip()]


def infer_title(base: str, head: str, fallback: str) -> str:
    if fallback.strip():
        return fallback.strip()
    out = run(
        ["git", "log", "--no-merges", "--pretty=format:%s", f"origin/{base}..{head}"]
    ).stdout.strip()
    lines = [line.strip() for line in out.splitlines() if line.strip()]
    if lines:
        return lines[0]
    raise RuntimeError(
        "unable to infer PR title (no commits in diff). Provide --title explicitly."
    )


def generate_body(base: str, head: str, body_file: Path, run_validation: bool) -> None:
    cmd = [
        "python3",
        "scripts/generate_pr_body_v1.py",
        "--base-ref",
        f"origin/{base}",
        "--head-ref",
        head,
        "--output-file",
        str(body_file),
    ]
    if run_validation:
        cmd.append("--run-validation")
    run(cmd, check=True, capture=False)


def push_head_branch(head: str) -> None:
    run(["git", "push", "-u", "origin", head], check=True, capture=False)


def find_existing_open_pr(base: str, head: str) -> dict | None:
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
    raw = completed.stdout.strip()
    if not raw:
        return None
    parsed = json.loads(raw)
    if not isinstance(parsed, list) or not parsed:
        return None
    first = parsed[0]
    if not isinstance(first, dict):
        return None
    return first


def extract_pr_url(output: str) -> str | None:
    found = PR_URL_RE.search(output)
    return found.group(0) if found else None


def create_pr(base: str, head: str, title: str, body_file: Path, draft: bool) -> str:
    cmd = [
        "gh",
        "pr",
        "create",
        "--base",
        base,
        "--head",
        head,
        "--title",
        title,
        "--body-file",
        str(body_file),
    ]
    if draft:
        cmd.append("--draft")
    completed = run(cmd)
    url = extract_pr_url(completed.stdout)
    if url:
        return url
    raise RuntimeError(f"failed to parse PR URL from output:\n{completed.stdout}")


def update_pr(number: int, title: str, body_file: Path) -> str:
    run(
        [
            "gh",
            "pr",
            "edit",
            str(number),
            "--title",
            title,
            "--body-file",
            str(body_file),
        ],
        check=True,
        capture=False,
    )
    view = run(["gh", "pr", "view", str(number), "--json", "url"]).stdout.strip()
    parsed = json.loads(view)
    if isinstance(parsed, dict):
        url = parsed.get("url")
        if isinstance(url, str) and url:
            return url
    return f"(updated PR #{number})"


def main() -> None:
    args = parse_args()
    head = args.head.strip() or current_branch()
    base = args.base.strip()
    if not base:
        raise RuntimeError("--base must not be empty")
    if not head:
        raise RuntimeError("--head must not be empty")
    if head == base:
        raise RuntimeError(f"head and base are the same branch: {head}")
    if head == "main":
        raise RuntimeError("current head is main. Create/switch to a codex/* branch first.")

    if args.dry_run:
        clean = is_clean_worktree()
    else:
        ensure_clean_worktree(args.allow_dirty)
        clean = True

    fetch_base(base)
    files = changed_files(base, head)
    if not files:
        raise RuntimeError(f"no changed files in range origin/{base}..{head}")

    title = infer_title(base, head, args.title)
    body_file = args.body_file.resolve()

    if args.dry_run:
        print(f"[dry-run] base={base} head={head}")
        print(f"[dry-run] title={title}")
        print(f"[dry-run] changed_files={len(files)}")
        print(f"[dry-run] body_file={body_file}")
        print(f"[dry-run] worktree_clean={clean}")
        print(f"[dry-run] push_before_pr={not args.no_push}")
        print("[dry-run] would run generate_pr_body_v1.py")
        if not args.no_push:
            print("[dry-run] would push branch to origin")
        print("[dry-run] would create or update PR via gh cli")
        return

    generate_body(base, head, body_file, args.run_validation)
    if not args.no_push:
        push_head_branch(head)
    existing = find_existing_open_pr(base, head)
    if existing:
        if args.no_update_existing:
            number = existing.get("number")
            url = existing.get("url")
            raise RuntimeError(
                f"open PR already exists for {head}->{base}: #{number} {url}"
            )
        number = int(existing["number"])
        url = update_pr(number, title, body_file)
        print(f"updated PR -> {url}")
        return

    url = create_pr(base, head, title, body_file, args.draft)
    print(f"created PR -> {url}")


if __name__ == "__main__":
    main()
