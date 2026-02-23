import type { SaveV1 } from "./saveSchema";

export interface SavePityCounters {
  breakthrough_fail_streak: number;
  tribulation_fail_streak: number;
  equipment_reroll_pity: number;
}

export interface SaveEconomyTracking {
  weekly_spirit_coin_spent: number;
  weekly_rebirth_essence_spent: number;
  last_week_reset_epoch_ms: number;
}

export interface SaveMigrationMeta {
  migrated_from_version: number;
  migrated_at: string;
}

export interface SaveV2 extends Omit<SaveV1, "version"> {
  version: 2;
  pity_counters: SavePityCounters;
  economy_tracking: SaveEconomyTracking;
  migration: SaveMigrationMeta;
}

export const SAVE_V2_VERSION = 2 as const;
