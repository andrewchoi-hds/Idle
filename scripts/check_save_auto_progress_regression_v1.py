#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SCENARIO_FILE = ROOT / "data/sim/save_auto_progress_regression_scenarios_v1.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check deterministic regression scenarios for save auto progress loop."
    )
    parser.add_argument(
        "--scenario-file",
        type=Path,
        default=DEFAULT_SCENARIO_FILE,
        help="Scenario JSON file path.",
    )
    parser.add_argument(
        "--numeric-tol",
        type=float,
        default=1e-9,
        help="Absolute tolerance for numeric comparisons.",
    )
    return parser.parse_args()


def get_by_path(payload: Any, path: str) -> Any:
    current = payload
    for token in path.split("."):
        if token == "":
            raise KeyError(f"invalid empty token in path: {path}")
        if isinstance(current, dict):
            if token not in current:
                raise KeyError(path)
            current = current[token]
            continue
        if isinstance(current, list):
            idx = int(token)
            current = current[idx]
            continue
        raise KeyError(path)
    return current


def compare_value(actual: Any, expected: Any, tol: float) -> bool:
    if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
        return math.isclose(float(actual), float(expected), abs_tol=tol, rel_tol=0.0)
    return actual == expected


def run_scenario(
    scenario: dict[str, Any],
    tol: float,
    output_root: Path,
) -> list[str]:
    errors: list[str] = []
    scenario_id = scenario.get("id")
    if not isinstance(scenario_id, str) or not scenario_id:
        return ["scenario.id must be a non-empty string"]

    args = scenario.get("args", [])
    if not isinstance(args, list) or not all(isinstance(v, str) for v in args):
        return [f"{scenario_id}: args must be a string array"]

    output_path = output_root / f"{scenario_id}.json"

    expected = scenario.get("expected", {})
    if not isinstance(expected, dict) or not expected:
        return [f"{scenario_id}: expected must be a non-empty object"]

    expected_warning_substrings = scenario.get("expected_warning_substrings", [])
    if not isinstance(expected_warning_substrings, list) or not all(
        isinstance(v, str) for v in expected_warning_substrings
    ):
        return [f"{scenario_id}: expected_warning_substrings must be a string array"]

    output_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "npm",
        "run",
        "-s",
        "save:auto:tick:ts",
        "--",
        *args,
        "--output",
        str(output_path),
    ]
    proc = subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    if proc.returncode != 0:
        return [
            f"{scenario_id}: command failed (code={proc.returncode})",
            f"stdout:\n{proc.stdout}",
            f"stderr:\n{proc.stderr}",
        ]

    if not output_path.exists():
        return [f"{scenario_id}: output file not found -> {output_path}"]

    payload = json.loads(output_path.read_text(encoding="utf-8"))

    for path, expected_value in expected.items():
        try:
            actual = get_by_path(payload, path)
        except (KeyError, IndexError, ValueError):
            errors.append(f"{scenario_id}: missing expected path -> {path}")
            continue
        if not compare_value(actual, expected_value, tol):
            errors.append(
                f"{scenario_id}: mismatch path={path} expected={expected_value!r} actual={actual!r}"
            )

    warnings = payload.get("warnings", [])
    if not isinstance(warnings, list):
        warnings = []
    warning_strings = [w for w in warnings if isinstance(w, str)]
    for needle in expected_warning_substrings:
        if not any(needle in warning for warning in warning_strings):
            errors.append(f"{scenario_id}: warning substring missing -> {needle!r}")

    if not errors:
        print(
            f"[pass] {scenario_id} | stage={payload['summary']['finalDifficultyIndex']} | "
            f"break_attempts={payload['summary']['breakthroughs']['attempts']} | "
            f"rebirth_delta={payload['summary']['rebirthCountDelta']}"
        )
    return errors


def main() -> None:
    args = parse_args()
    scenario_file = args.scenario_file.resolve()
    if not scenario_file.exists():
        raise SystemExit(f"scenario file not found: {scenario_file}")

    scenarios = json.loads(scenario_file.read_text(encoding="utf-8"))
    if not isinstance(scenarios, list) or not scenarios:
        raise SystemExit("scenario file must be a non-empty array")

    failures: list[str] = []
    with tempfile.TemporaryDirectory(prefix="save_auto_progress_regression_") as temp_dir:
        output_root = Path(temp_dir)
        for entry in scenarios:
            if not isinstance(entry, dict):
                failures.append("scenario entry must be an object")
                continue
            failures.extend(run_scenario(entry, args.numeric_tol, output_root))

    if failures:
        print("save auto progress regression check failed")
        for line in failures:
            print(f"- {line}")
        raise SystemExit(1)

    print(f"all save auto progress scenarios passed -> {scenario_file}")


if __name__ == "__main__":
    main()
