#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any

from save_validation_v2 import validate_save_v2_payload

ROOT = Path(__file__).resolve().parent.parent
SAMPLE_PATH = ROOT / "data/schema/save_v2.sample.json"
CASES_PATH = ROOT / "data/schema/save_v2_failure_cases_v1.json"


class CaseApplyError(RuntimeError):
    pass


def _resolve_parent(payload: dict[str, Any], path: str) -> tuple[dict[str, Any], str]:
    parts = path.split(".")
    current: Any = payload
    for key in parts[:-1]:
        if not isinstance(current, dict) or key not in current:
            raise CaseApplyError(f"invalid operation path: {path}")
        current = current[key]
    if not isinstance(current, dict):
        raise CaseApplyError(f"invalid operation target: {path}")
    return current, parts[-1]


def apply_operations(base_payload: dict[str, Any], operations: list[dict[str, Any]]) -> dict[str, Any]:
    target = copy.deepcopy(base_payload)
    for op in operations:
        op_name = op.get("op")
        path = op.get("path")

        if not isinstance(op_name, str) or not isinstance(path, str):
            raise CaseApplyError(f"invalid operation schema: {op}")

        parent, leaf = _resolve_parent(target, path)

        if op_name == "set":
            parent[leaf] = op.get("value")
            continue

        if op_name == "delete":
            if leaf in parent:
                del parent[leaf]
            continue

        raise CaseApplyError(f"unsupported operation: {op_name}")

    return target


def contains_error(errors: list[str], expected_substring: str) -> bool:
    return any(expected_substring in err for err in errors)


def main() -> None:
    base_payload = json.loads(SAMPLE_PATH.read_text(encoding="utf-8"))
    cases = json.loads(CASES_PATH.read_text(encoding="utf-8"))

    if not isinstance(cases, list):
        raise SystemExit("failure cases must be an array")

    failures: list[str] = []

    for idx, case in enumerate(cases):
        if not isinstance(case, dict):
            failures.append(f"case[{idx}] invalid object")
            continue

        case_id = case.get("case_id")
        ops = case.get("operations")
        expected = case.get("expected_error_contains")

        if not isinstance(case_id, str) or not case_id:
            failures.append(f"case[{idx}] missing case_id")
            continue
        if not isinstance(ops, list):
            failures.append(f"{case_id}: operations must be array")
            continue
        if not isinstance(expected, list) or not all(isinstance(v, str) and v for v in expected):
            failures.append(f"{case_id}: expected_error_contains must be non-empty string array")
            continue

        try:
            mutated = apply_operations(base_payload, ops)
        except CaseApplyError as exc:
            failures.append(f"{case_id}: apply failed: {exc}")
            continue

        errors = validate_save_v2_payload(mutated)
        if not errors:
            failures.append(f"{case_id}: expected failure but validation passed")
            continue

        missing_expected = [needle for needle in expected if not contains_error(errors, needle)]
        if missing_expected:
            failures.append(
                f"{case_id}: expected error not found -> {', '.join(missing_expected)} | got={errors}"
            )
            continue

        print(f"[pass] {case_id}: produced {len(errors)} error(s)")

    if failures:
        print("save v2 failure-case check failed")
        for msg in failures:
            print(f"- {msg}")
        raise SystemExit(1)

    print(f"all save v2 failure cases passed -> {CASES_PATH}")


if __name__ == "__main__":
    main()
