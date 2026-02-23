#!/usr/bin/env python3
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import math
import subprocess
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
    parser.add_argument(
        "--report-file",
        type=Path,
        help="Optional JSON output path for scenario-by-scenario regression report.",
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
) -> tuple[list[str], dict[str, Any]]:
    errors: list[str] = []
    scenario_id = scenario.get("id")
    scenario_result: dict[str, Any] = {
        "id": scenario_id if isinstance(scenario_id, str) else None,
        "passed": False,
        "errors": [],
        "summary": {},
    }
    if not isinstance(scenario_id, str) or not scenario_id:
        errors.append("scenario.id must be a non-empty string")
        scenario_result["errors"] = list(errors)
        return errors, scenario_result

    args = scenario.get("args", [])
    if not isinstance(args, list) or not all(isinstance(v, str) for v in args):
        errors.append(f"{scenario_id}: args must be a string array")
        scenario_result["errors"] = list(errors)
        return errors, scenario_result

    output_path = output_root / f"{scenario_id}.json"

    expected = scenario.get("expected", {})
    if not isinstance(expected, dict) or not expected:
        errors.append(f"{scenario_id}: expected must be a non-empty object")
        scenario_result["errors"] = list(errors)
        return errors, scenario_result

    expected_warning_substrings = scenario.get("expected_warning_substrings", [])
    if not isinstance(expected_warning_substrings, list) or not all(
        isinstance(v, str) for v in expected_warning_substrings
    ):
        errors.append(f"{scenario_id}: expected_warning_substrings must be a string array")
        scenario_result["errors"] = list(errors)
        return errors, scenario_result

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
        command_errors = [
            f"{scenario_id}: command failed (code={proc.returncode})",
            f"stdout:\n{proc.stdout}",
            f"stderr:\n{proc.stderr}",
        ]
        scenario_result["errors"] = list(command_errors)
        return command_errors, scenario_result

    if not output_path.exists():
        output_errors = [f"{scenario_id}: output file not found -> {output_path}"]
        scenario_result["errors"] = list(output_errors)
        return output_errors, scenario_result

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

    summary_payload = payload.get("summary", {})
    breakthroughs = summary_payload.get("breakthroughs", {})
    scenario_result["summary"] = {
        "finalDifficultyIndex": summary_payload.get("finalDifficultyIndex"),
        "breakthroughAttempts": breakthroughs.get("attempts"),
        "rebirthCountDelta": summary_payload.get("rebirthCountDelta"),
        "warningCount": payload.get("warning_count"),
        "eventCount": payload.get("event_count"),
    }

    if not errors:
        scenario_result["passed"] = True
        print(
            f"[pass] {scenario_id} | stage={payload['summary']['finalDifficultyIndex']} | "
            f"break_attempts={payload['summary']['breakthroughs']['attempts']} | "
            f"rebirth_delta={payload['summary']['rebirthCountDelta']}"
        )
    scenario_result["errors"] = list(errors)
    return errors, scenario_result


def write_report(
    report_file: Path,
    scenario_file: Path,
    numeric_tol: float,
    scenario_results: list[dict[str, Any]],
) -> None:
    pass_count = sum(1 for row in scenario_results if row.get("passed") is True)
    scenario_count = len(scenario_results)
    payload = {
        "suite": "save_auto_progress_regression",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "scenario_file": str(scenario_file),
        "numeric_tol": numeric_tol,
        "passed": pass_count == scenario_count,
        "scenario_count": scenario_count,
        "pass_count": pass_count,
        "fail_count": scenario_count - pass_count,
        "results": scenario_results,
    }
    report_file.parent.mkdir(parents=True, exist_ok=True)
    report_file.write_text(f"{json.dumps(payload, ensure_ascii=False, indent=2)}\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    scenario_file = args.scenario_file.resolve()
    if not scenario_file.exists():
        raise SystemExit(f"scenario file not found: {scenario_file}")

    scenarios = json.loads(scenario_file.read_text(encoding="utf-8"))
    if not isinstance(scenarios, list) or not scenarios:
        raise SystemExit("scenario file must be a non-empty array")

    failures: list[str] = []
    scenario_results: list[dict[str, Any]] = []
    with tempfile.TemporaryDirectory(prefix="save_auto_progress_regression_") as temp_dir:
        output_root = Path(temp_dir)
        for idx, entry in enumerate(scenarios, start=1):
            if not isinstance(entry, dict):
                msg = "scenario entry must be an object"
                failures.append(msg)
                scenario_results.append(
                    {
                        "id": f"scenario_{idx}",
                        "passed": False,
                        "errors": [msg],
                        "summary": {},
                    }
                )
                continue
            scenario_failures, scenario_result = run_scenario(entry, args.numeric_tol, output_root)
            failures.extend(scenario_failures)
            scenario_results.append(scenario_result)

    if args.report_file:
        write_report(args.report_file.resolve(), scenario_file, args.numeric_tol, scenario_results)

    if failures:
        print("save auto progress regression check failed")
        for line in failures:
            print(f"- {line}")
        raise SystemExit(1)

    print(f"all save auto progress scenarios passed -> {scenario_file}")


if __name__ == "__main__":
    main()
