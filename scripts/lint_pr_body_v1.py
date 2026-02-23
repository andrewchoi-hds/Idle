#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


DEFAULT_BODY_FILE = Path("/private/tmp/idle_pr_body_v1.md")
SECTION_HEADERS = ["Summary", "Changes", "Validation", "Docs", "Notes"]
DEFAULT_VALIDATION_COMMANDS = [
    "npm run typecheck",
    "npm run combat:diff:py-ts:suite",
    "npm run save:auto:regression:check",
    "npm run save:offline:regression:check",
]
CHANGE_PATH_RE = re.compile(r"`/Users/hirediversity/Idle/[^`]+`")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Lint generated PR body markdown for minimum content quality."
    )
    parser.add_argument(
        "--body-file",
        type=Path,
        default=DEFAULT_BODY_FILE,
        help="PR body markdown file path.",
    )
    parser.add_argument(
        "--strict-change-path",
        action="store_true",
        help="Require at least one absolute repository path in Changes.",
    )
    parser.add_argument(
        "--event-json",
        type=Path,
        help="GitHub event JSON path. Lints pull_request.body from this payload.",
    )
    parser.add_argument(
        "--body-text",
        default="",
        help="Inline markdown body text to lint.",
    )
    return parser.parse_args()


def split_sections(text: str) -> dict[str, list[str]]:
    sections: dict[str, list[str]] = {}
    current: str | None = None
    for line in text.splitlines():
        if line.startswith("## "):
            current = line[3:].strip()
            sections[current] = []
            continue
        if current is not None:
            sections[current].append(line)
    return sections


def bullet_content(line: str) -> str:
    stripped = line.strip()
    if not stripped.startswith("- "):
        return ""
    return stripped[2:].strip()


def is_placeholder(content: str) -> bool:
    normalized = content.strip()
    if not normalized:
        return True
    if normalized in {"-", "TODO", "TBD"}:
        return True
    if "<path>" in normalized:
        return True
    if normalized.endswith(":"):
        return True
    return False


def ensure_required_sections(sections: dict[str, list[str]]) -> list[str]:
    errors: list[str] = []
    for header in SECTION_HEADERS:
        if header not in sections:
            errors.append(f"missing section: ## {header}")
    return errors


def lint_summary(lines: list[str]) -> list[str]:
    bullets = [bullet_content(line) for line in lines if bullet_content(line)]
    meaningful = [item for item in bullets if not is_placeholder(item)]
    errors: list[str] = []
    if len(meaningful) < 3:
        errors.append("Summary must contain at least 3 meaningful bullet lines.")
    return errors


def lint_changes(lines: list[str], strict_change_path: bool) -> list[str]:
    bullets = [bullet_content(line) for line in lines if bullet_content(line)]
    meaningful = [item for item in bullets if not is_placeholder(item)]
    errors: list[str] = []
    if not meaningful:
        errors.append("Changes must contain at least 1 meaningful bullet line.")
        return errors
    if strict_change_path:
        joined = "\n".join(lines)
        if CHANGE_PATH_RE.search(joined) is None:
            errors.append(
                "Changes must include at least one absolute path under /Users/hirediversity/Idle/."
            )
    return errors


def lint_validation(lines: list[str]) -> list[str]:
    text = "\n".join(lines)
    errors: list[str] = []
    for command in DEFAULT_VALIDATION_COMMANDS:
        pattern = f"`{command}`"
        if pattern not in text:
            errors.append(f"Validation is missing checkbox entry for `{command}`.")
    return errors


def lint_docs(lines: list[str]) -> list[str]:
    bullets = [bullet_content(line) for line in lines if bullet_content(line)]
    errors: list[str] = []
    if len(bullets) < 2:
        errors.append("Docs section must contain at least 2 checklist bullets.")
    return errors


def lint_notes(lines: list[str]) -> list[str]:
    text = "\n".join(lines)
    errors: list[str] = []
    if "Generated at:" not in text:
        errors.append("Notes section is missing `Generated at:` line.")
    if "Diff range:" not in text:
        errors.append("Notes section is missing `Diff range:` line.")
    return errors


def lint_text(text: str, strict_change_path: bool) -> list[str]:
    sections = split_sections(text)
    errors = ensure_required_sections(sections)
    if errors:
        return errors
    errors.extend(lint_summary(sections["Summary"]))
    errors.extend(lint_changes(sections["Changes"], strict_change_path))
    errors.extend(lint_validation(sections["Validation"]))
    errors.extend(lint_docs(sections["Docs"]))
    errors.extend(lint_notes(sections["Notes"]))
    return errors


def load_event_body(event_json: Path) -> str:
    path = event_json.resolve()
    if not path.exists():
        raise RuntimeError(f"event json not found: {path}")
    parsed = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(parsed, dict):
        raise RuntimeError(f"invalid event json format: {path}")
    pr = parsed.get("pull_request")
    if not isinstance(pr, dict):
        raise RuntimeError(f"pull_request key not found in event json: {path}")
    body = pr.get("body")
    if body is None:
        return ""
    if not isinstance(body, str):
        raise RuntimeError(f"pull_request.body is not a string: {path}")
    return body


def main() -> None:
    args = parse_args()
    source = ""
    text = ""
    if args.body_text.strip():
        source = "inline-body-text"
        text = args.body_text
    elif args.event_json is not None:
        source = f"event-json:{args.event_json.resolve()}"
        text = load_event_body(args.event_json)
    else:
        body_file = args.body_file.resolve()
        if not body_file.exists():
            raise RuntimeError(f"body file not found: {body_file}")
        source = str(body_file)
        text = body_file.read_text(encoding="utf-8")

    errors = lint_text(text, args.strict_change_path)

    if errors:
        print(f"[pr-body-lint] FAIL source={source}")
        for idx, err in enumerate(errors, start=1):
            print(f"{idx}. {err}")
        raise SystemExit(1)

    print(f"[pr-body-lint] PASS source={source}")


if __name__ == "__main__":
    main()
