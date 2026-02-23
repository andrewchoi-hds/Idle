import type { SaveV2 } from "./saveSchemaV2";
import {
  type SaveValidationError,
  validateSaveV1,
} from "./validateSave";

export interface SaveV2ValidationResult {
  ok: boolean;
  errors: SaveValidationError[];
  value?: SaveV2;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function pushError(errors: SaveValidationError[], path: string, message: string): void {
  errors.push({ path, message });
}

function validateNonNegativeInteger(
  errors: SaveValidationError[],
  path: string,
  value: unknown,
): void {
  if (!Number.isInteger(value) || (value as number) < 0) {
    pushError(errors, path, "must be a non-negative integer");
  }
}

function validateNonNegativeNumber(
  errors: SaveValidationError[],
  path: string,
  value: unknown,
): void {
  if (!isFiniteNumber(value) || value < 0) {
    pushError(errors, path, "must be a non-negative number");
  }
}

function validateIsoDateTime(
  errors: SaveValidationError[],
  path: string,
  value: unknown,
): void {
  if (!isString(value) || Number.isNaN(Date.parse(value))) {
    pushError(errors, path, "must be an ISO date-time string");
  }
}

export function validateSaveV2(input: unknown): SaveV2ValidationResult {
  const errors: SaveValidationError[] = [];

  if (!isObject(input)) {
    pushError(errors, "$", "save payload must be an object");
    return { ok: false, errors };
  }

  const root = input;

  if (root.version !== 2) {
    pushError(errors, "version", "must be 2");
  }

  // Reuse v1 structural validation by temporarily downgrading only the version field.
  const v1CompatCandidate: Record<string, unknown> = {
    ...root,
    version: 1,
  };
  const baseValidation = validateSaveV1(v1CompatCandidate);
  if (!baseValidation.ok) {
    for (const err of baseValidation.errors) {
      if (err.path !== "version") {
        errors.push(err);
      }
    }
  }

  if (!isObject(root.pity_counters)) {
    pushError(errors, "pity_counters", "must be an object");
  } else {
    validateNonNegativeInteger(
      errors,
      "pity_counters.breakthrough_fail_streak",
      root.pity_counters.breakthrough_fail_streak,
    );
    validateNonNegativeInteger(
      errors,
      "pity_counters.tribulation_fail_streak",
      root.pity_counters.tribulation_fail_streak,
    );
    validateNonNegativeInteger(
      errors,
      "pity_counters.equipment_reroll_pity",
      root.pity_counters.equipment_reroll_pity,
    );
  }

  if (!isObject(root.economy_tracking)) {
    pushError(errors, "economy_tracking", "must be an object");
  } else {
    validateNonNegativeNumber(
      errors,
      "economy_tracking.weekly_spirit_coin_spent",
      root.economy_tracking.weekly_spirit_coin_spent,
    );
    validateNonNegativeNumber(
      errors,
      "economy_tracking.weekly_rebirth_essence_spent",
      root.economy_tracking.weekly_rebirth_essence_spent,
    );
    validateNonNegativeInteger(
      errors,
      "economy_tracking.last_week_reset_epoch_ms",
      root.economy_tracking.last_week_reset_epoch_ms,
    );
  }

  if (!isObject(root.migration)) {
    pushError(errors, "migration", "must be an object");
  } else {
    const fromVersion = root.migration.migrated_from_version;
    if (!Number.isInteger(fromVersion) || (fromVersion as number) < 1) {
      pushError(errors, "migration.migrated_from_version", "must be an integer >= 1");
    }
    validateIsoDateTime(errors, "migration.migrated_at", root.migration.migrated_at);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors,
    value: root as unknown as SaveV2,
  };
}

export function assertValidSaveV2(input: unknown): SaveV2 {
  const result = validateSaveV2(input);
  if (!result.ok || !result.value) {
    const msg = result.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Invalid save payload(v2): ${msg}`);
  }
  return result.value;
}
