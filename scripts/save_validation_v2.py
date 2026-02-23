#!/usr/bin/env python3
from __future__ import annotations

from datetime import datetime

REQUIRED_TOP_LEVEL = {
    "version",
    "player",
    "progression",
    "currencies",
    "inventory",
    "equipment",
    "settings",
    "meta",
    "timestamps",
    "pity_counters",
    "economy_tracking",
    "migration",
}


def _is_iso_datetime(raw: object) -> bool:
    if not isinstance(raw, str):
        return False
    try:
        datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        return False
    return True


def _is_non_negative_number(raw: object) -> bool:
    return isinstance(raw, (int, float)) and raw >= 0


def _is_non_negative_int(raw: object) -> bool:
    return isinstance(raw, int) and raw >= 0


def validate_save_v2_payload(payload: object) -> list[str]:
    errors: list[str] = []

    if not isinstance(payload, dict):
        return ["payload must be object"]

    missing = sorted(REQUIRED_TOP_LEVEL - set(payload.keys()))
    if missing:
        errors.append(f"missing keys: {', '.join(missing)}")

    if payload.get("version") != 2:
        errors.append("version must be 2")

    pity = payload.get("pity_counters", {})
    if not isinstance(pity, dict):
        errors.append("pity_counters must be object")
    else:
        for key in (
            "breakthrough_fail_streak",
            "tribulation_fail_streak",
            "equipment_reroll_pity",
        ):
            if not _is_non_negative_int(pity.get(key)):
                errors.append(f"pity_counters.{key} must be non-negative int")

    eco = payload.get("economy_tracking", {})
    if not isinstance(eco, dict):
        errors.append("economy_tracking must be object")
    else:
        for key in ("weekly_spirit_coin_spent", "weekly_rebirth_essence_spent"):
            if not _is_non_negative_number(eco.get(key)):
                errors.append(f"economy_tracking.{key} must be non-negative number")

        if not _is_non_negative_int(eco.get("last_week_reset_epoch_ms")):
            errors.append("economy_tracking.last_week_reset_epoch_ms must be non-negative int")

    migration = payload.get("migration", {})
    if not isinstance(migration, dict):
        errors.append("migration must be object")
    else:
        if not isinstance(migration.get("migrated_from_version"), int) or migration.get(
            "migrated_from_version"
        ) < 1:
            errors.append("migration.migrated_from_version must be int >= 1")

        if not _is_iso_datetime(migration.get("migrated_at")):
            errors.append("migration.migrated_at must be valid ISO date-time")

    return errors
