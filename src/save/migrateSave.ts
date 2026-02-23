import { SAVE_V1_VERSION, type SaveV1 } from "./saveSchema";
import { type SaveValidationError, validateSaveV1 } from "./validateSave";
import { SAVE_V2_VERSION, type SaveV2 } from "./saveSchemaV2";
import { validateSaveV2 } from "./validateSaveV2";

export interface SaveMigrationResult {
  ok: boolean;
  errors: SaveValidationError[];
  value?: SaveV2;
}

function nowIsoUtc(): string {
  return new Date().toISOString();
}

function estimateInitialPityCounters(saveV1: SaveV1): SaveV2["pity_counters"] {
  const d = saveV1.progression.difficulty_index;
  const rebirth = saveV1.progression.rebirth_count;

  return {
    breakthrough_fail_streak: d >= 70 ? 1 : 0,
    tribulation_fail_streak: d >= 84 ? 1 : 0,
    equipment_reroll_pity: Math.min(5, Math.floor(rebirth / 3)),
  };
}

function estimateInitialEconomyTracking(saveV1: SaveV1): SaveV2["economy_tracking"] {
  return {
    weekly_spirit_coin_spent: 0,
    weekly_rebirth_essence_spent: 0,
    last_week_reset_epoch_ms: saveV1.timestamps.save_epoch_ms,
  };
}

export function migrateSaveV1ToV2(
  saveV1: SaveV1,
  migratedAtIso: string = nowIsoUtc(),
): SaveV2 {
  return {
    ...saveV1,
    version: SAVE_V2_VERSION,
    pity_counters: estimateInitialPityCounters(saveV1),
    economy_tracking: estimateInitialEconomyTracking(saveV1),
    migration: {
      migrated_from_version: SAVE_V1_VERSION,
      migrated_at: migratedAtIso,
    },
  };
}

export function migrateUnknownSaveToV2(input: unknown): SaveMigrationResult {
  if (typeof input === "object" && input !== null) {
    const maybeVersion = (input as Record<string, unknown>).version;
    if (maybeVersion === SAVE_V2_VERSION) {
      const v2 = validateSaveV2(input);
      if (!v2.ok || !v2.value) {
        return { ok: false, errors: v2.errors };
      }
      return { ok: true, errors: [], value: v2.value };
    }
  }

  const v1 = validateSaveV1(input);
  if (!v1.ok || !v1.value) {
    return { ok: false, errors: v1.errors };
  }

  const migrated = migrateSaveV1ToV2(v1.value);
  const v2 = validateSaveV2(migrated);
  if (!v2.ok || !v2.value) {
    return { ok: false, errors: v2.errors };
  }

  return { ok: true, errors: [], value: v2.value };
}
