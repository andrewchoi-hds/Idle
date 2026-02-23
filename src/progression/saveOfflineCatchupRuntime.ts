import { getCombatConstantNumber, type BalanceIndexes, type BalanceTables } from "../balance/balanceLoader";
import type {
  AutoProgressEventLog,
  AutoProgressSummary,
  SaveAutoProgressLoopInput,
} from "./saveAutoProgressLoop";
import { runSaveAutoProgressLoop } from "./saveAutoProgressLoop";
import type { SaveV2 } from "../save/saveSchemaV2";
import { validateSaveV2 } from "../save/validateSaveV2";

export interface SaveOfflineCatchupInput
  extends Omit<SaveAutoProgressLoopInput, "durationSec"> {
  nowEpochMs?: number;
  anchorEpochMs?: number;
  maxOfflineHoursOverride?: number;
  syncTimestampsToNow?: boolean;
}

export type OfflineCatchupSkipReason =
  | "none"
  | "time_not_elapsed"
  | "applied_duration_zero";

export interface SaveOfflineCatchupSummary {
  nowEpochMs: number;
  anchorEpochMs: number;
  rawOfflineSec: number;
  maxOfflineSec: number;
  appliedOfflineSec: number;
  cappedByMaxOffline: boolean;
  skipReason: OfflineCatchupSkipReason;
  autoProgressSummary: AutoProgressSummary | null;
}

export interface SaveOfflineCatchupResult {
  save: SaveV2;
  summary: SaveOfflineCatchupSummary;
  eventLogs: AutoProgressEventLog[];
  warnings: string[];
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeInt(
  value: number | undefined,
  fallback: number,
  min = 0,
): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(min, Math.floor(value));
}

function normalizeNumber(
  value: number | undefined,
  fallback: number,
  min = 0,
  max = Number.POSITIVE_INFINITY,
): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return clampNumber(value, min, max);
}

function assertValidSaveV2(save: SaveV2): void {
  const validation = validateSaveV2(save);
  if (!validation.ok || !validation.value) {
    const msg = validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Invalid save payload(v2) during offline catchup: ${msg}`);
  }
}

function pickDefaultAnchorEpochMs(save: SaveV2): number {
  const lastLogin = normalizeInt(save.timestamps.last_login_epoch_ms, 0, 0);
  const saveEpoch = normalizeInt(save.timestamps.save_epoch_ms, 0, 0);
  return Math.max(lastLogin, saveEpoch);
}

function getMaxOfflineSec(
  indexes: BalanceIndexes,
  maxOfflineHoursOverride: number | undefined,
): number {
  const capHours = normalizeNumber(
    maxOfflineHoursOverride,
    getCombatConstantNumber(indexes, "offline_reward_hours_cap", 12),
    0,
    168,
  );
  return Math.floor(capHours * 3600);
}

export function runSaveOfflineCatchupRuntime(
  tables: BalanceTables,
  indexes: BalanceIndexes,
  inputSave: SaveV2,
  input: SaveOfflineCatchupInput = {},
): SaveOfflineCatchupResult {
  assertValidSaveV2(inputSave);

  const nowEpochMs = normalizeInt(input.nowEpochMs, Date.now(), 0);
  const defaultAnchorEpochMs = pickDefaultAnchorEpochMs(inputSave);
  const anchorEpochMs = normalizeInt(input.anchorEpochMs, defaultAnchorEpochMs, 0);
  const rawOfflineSec = Math.max(0, Math.floor((nowEpochMs - anchorEpochMs) / 1000));
  const maxOfflineSec = getMaxOfflineSec(indexes, input.maxOfflineHoursOverride);
  const appliedOfflineSec = Math.min(rawOfflineSec, maxOfflineSec);
  const cappedByMaxOffline = rawOfflineSec > appliedOfflineSec;
  const syncTimestampsToNow = input.syncTimestampsToNow ?? true;

  let save = structuredClone(inputSave);
  let autoProgressSummary: AutoProgressSummary | null = null;
  let eventLogs: AutoProgressEventLog[] = [];
  const warnings: string[] = [];
  let skipReason: OfflineCatchupSkipReason = "none";

  if (rawOfflineSec <= 0) {
    skipReason = "time_not_elapsed";
  } else if (appliedOfflineSec <= 0) {
    skipReason = "applied_duration_zero";
  } else {
    const loopInput: SaveAutoProgressLoopInput = {
      durationSec: appliedOfflineSec,
      tickSec: input.tickSec,
      rngSeed: input.rngSeed,
      battleIntervalSec: input.battleIntervalSec,
      breakthroughCheckIntervalSec: input.breakthroughCheckIntervalSec,
      maxEventLogs: input.maxEventLogs,
      statusPenaltyPct: input.statusPenaltyPct,
      defensiveSkillGuardPct: input.defensiveSkillGuardPct,
      breakthroughConsumableItemIds: input.breakthroughConsumableItemIds,
      tribulationConsumableItemIds: input.tribulationConsumableItemIds,
      rebirthOnDeath: input.rebirthOnDeath,
    };
    const autoProgress = runSaveAutoProgressLoop(tables, indexes, save, loopInput);
    save = autoProgress.save;
    autoProgressSummary = autoProgress.summary;
    eventLogs = autoProgress.eventLogs;
    warnings.push(...autoProgress.warnings);
  }

  if (cappedByMaxOffline) {
    warnings.push(
      `offline catchup capped: raw=${rawOfflineSec}s applied=${appliedOfflineSec}s max=${maxOfflineSec}s`,
    );
  }

  if (syncTimestampsToNow) {
    const syncedEpochMs = Math.max(
      nowEpochMs,
      save.timestamps.last_login_epoch_ms,
      save.timestamps.save_epoch_ms,
    );
    if (syncedEpochMs > nowEpochMs) {
      warnings.push(
        `device clock skew detected: now=${nowEpochMs}ms, synced=${syncedEpochMs}ms`,
      );
    }
    save.timestamps.last_login_epoch_ms = syncedEpochMs;
    save.timestamps.save_epoch_ms = syncedEpochMs;
  }

  assertValidSaveV2(save);
  return {
    save,
    summary: {
      nowEpochMs,
      anchorEpochMs,
      rawOfflineSec,
      maxOfflineSec,
      appliedOfflineSec,
      cappedByMaxOffline,
      skipReason,
      autoProgressSummary,
    },
    eventLogs,
    warnings: Array.from(new Set(warnings)),
  };
}
