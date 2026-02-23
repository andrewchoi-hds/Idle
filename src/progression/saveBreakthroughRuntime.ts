import {
  type BalanceIndexes,
  type BalanceTables,
  getStageDisplayNameKo,
} from "../balance/balanceLoader";
import type { SaveV2 } from "../save/saveSchemaV2";
import { validateSaveV2 } from "../save/validateSaveV2";
import {
  evaluateBreakthroughAttempt,
  type BreakthroughAttemptResult,
  type RebirthBranch,
} from "./tribulationEngine";

export type SaveBreakthroughSkipReason =
  | "auto_breakthrough_disabled"
  | "auto_tribulation_disabled";

export interface SaveBreakthroughApplyOptions {
  rngSeed?: number;
  forceAttempt?: boolean;
  statusPenaltyPct?: number;
  defensiveSkillGuardPct?: number;
  consumableItemIds?: string[];
  rebirthLevels?: Partial<Record<RebirthBranch, number>>;
  inferRebirthLevelsFromRebirthCount?: boolean;
  consumeInventoryItems?: boolean;
  bumpSaveTimestamp?: boolean;
  nowEpochMs?: number;
  rebirthOnDeath?: RebirthOnDeathConfig;
}

export interface RebirthOnDeathConfig {
  enabled?: boolean;
  resetDifficultyIndex?: number;
  resetQi?: boolean;
  resetSpiritCoin?: boolean;
  clearUnlockedNodes?: boolean;
  rewardWeightScale?: number;
  rewardDifficultyScale?: number;
  rewardRebirthCountScalePct?: number;
  rewardMin?: number;
  rewardMax?: number;
}

export interface RebirthSettlementResult {
  triggered: boolean;
  preRebirthCount: number;
  postRebirthCount: number;
  reward: {
    baseEssence: number;
    rebirthScaleMultiplier: number;
    consumableMultiplier: number;
    finalEssence: number;
    appliedEffectSources: Array<{
      itemId: string;
      effectType: string;
      appliedValue: number;
    }>;
  };
  resets: {
    difficultyIndex: number;
    qiResetApplied: boolean;
    spiritCoinResetApplied: boolean;
    unlockedNodesCleared: boolean;
  };
}

export interface SaveBreakthroughApplyResult {
  save: SaveV2;
  attempted: boolean;
  skipReason: SaveBreakthroughSkipReason | null;
  attemptResult: BreakthroughAttemptResult | null;
  stageBefore: {
    difficultyIndex: number;
    stageNameKo: string;
    world: BalanceTables["progression"][number]["world"];
    isTribulation: boolean;
  };
  stageAfter: {
    difficultyIndex: number;
    stageNameKo: string;
    world: BalanceTables["progression"][number]["world"];
  };
  resolvedRebirthLevels: {
    breakthrough_bonus: number;
    tribulation_guard: number;
    potion_mastery: number;
  };
  rebirthSettlement: RebirthSettlementResult | null;
  consumedItemCounts: Record<string, number>;
  warnings: string[];
}

const DEFAULT_STREAK_CAP = 9999;
const DEFAULT_REBIRTH_ON_DEATH: Required<RebirthOnDeathConfig> = {
  enabled: true,
  resetDifficultyIndex: 1,
  resetQi: true,
  resetSpiritCoin: true,
  clearUnlockedNodes: false,
  rewardWeightScale: 12,
  rewardDifficultyScale: 0.85,
  rewardRebirthCountScalePct: 1.5,
  rewardMin: 5,
  rewardMax: 5000,
};

function clampCounter(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const normalized = Math.floor(value);
  return Math.max(0, Math.min(DEFAULT_STREAK_CAP, normalized));
}

function clampLevel(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(20, Math.floor(value)));
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function resolveRebirthOnDeathConfig(
  config: RebirthOnDeathConfig | undefined,
): Required<RebirthOnDeathConfig> {
  return {
    enabled: config?.enabled ?? DEFAULT_REBIRTH_ON_DEATH.enabled,
    resetDifficultyIndex:
      config?.resetDifficultyIndex ?? DEFAULT_REBIRTH_ON_DEATH.resetDifficultyIndex,
    resetQi: config?.resetQi ?? DEFAULT_REBIRTH_ON_DEATH.resetQi,
    resetSpiritCoin:
      config?.resetSpiritCoin ?? DEFAULT_REBIRTH_ON_DEATH.resetSpiritCoin,
    clearUnlockedNodes:
      config?.clearUnlockedNodes ?? DEFAULT_REBIRTH_ON_DEATH.clearUnlockedNodes,
    rewardWeightScale:
      config?.rewardWeightScale ?? DEFAULT_REBIRTH_ON_DEATH.rewardWeightScale,
    rewardDifficultyScale:
      config?.rewardDifficultyScale ?? DEFAULT_REBIRTH_ON_DEATH.rewardDifficultyScale,
    rewardRebirthCountScalePct:
      config?.rewardRebirthCountScalePct ??
      DEFAULT_REBIRTH_ON_DEATH.rewardRebirthCountScalePct,
    rewardMin: config?.rewardMin ?? DEFAULT_REBIRTH_ON_DEATH.rewardMin,
    rewardMax: config?.rewardMax ?? DEFAULT_REBIRTH_ON_DEATH.rewardMax,
  };
}

function inferRebirthLevelsFromRebirthCount(rebirthCount: number): {
  breakthrough_bonus: number;
  tribulation_guard: number;
  potion_mastery: number;
} {
  const rebirth = Math.max(0, Math.floor(rebirthCount));
  return {
    breakthrough_bonus: clampLevel(Math.floor(rebirth / 3)),
    tribulation_guard: clampLevel(Math.floor(rebirth / 4)),
    potion_mastery: clampLevel(Math.floor(rebirth / 5)),
  };
}

function resolveRebirthLevels(
  save: SaveV2,
  options: SaveBreakthroughApplyOptions,
): {
  levels: {
    breakthrough_bonus: number;
    tribulation_guard: number;
    potion_mastery: number;
  };
  warning: string | null;
} {
  const inferred = inferRebirthLevelsFromRebirthCount(save.progression.rebirth_count);
  const fromInput = options.rebirthLevels ?? {};

  const useInfer = options.inferRebirthLevelsFromRebirthCount ?? true;
  const levels = {
    breakthrough_bonus: clampLevel(
      fromInput.breakthrough_bonus ??
        (useInfer ? inferred.breakthrough_bonus : 0),
    ),
    tribulation_guard: clampLevel(
      fromInput.tribulation_guard ?? (useInfer ? inferred.tribulation_guard : 0),
    ),
    potion_mastery: clampLevel(
      fromInput.potion_mastery ?? (useInfer ? inferred.potion_mastery : 0),
    ),
  };

  if (!useInfer) {
    return { levels, warning: null };
  }
  return {
    levels,
    warning:
      "rebirth levels inferred from progression.rebirth_count (override via options.rebirthLevels)",
  };
}

function resolveConsumables(
  save: SaveV2,
  requestedItemIds: string[],
  consumeInventoryItems: boolean,
): { usableItemIds: string[]; warnings: string[] } {
  if (!consumeInventoryItems) {
    return { usableItemIds: requestedItemIds, warnings: [] };
  }

  const availableById = new Map<string, number>();
  for (const item of save.inventory.items) {
    availableById.set(item.item_id, clampCounter(item.quantity));
  }

  const usableItemIds: string[] = [];
  const warnings: string[] = [];

  for (const itemId of requestedItemIds) {
    const remaining = availableById.get(itemId) ?? 0;
    if (remaining <= 0) {
      warnings.push(`consumable not available in inventory: ${itemId}`);
      continue;
    }
    usableItemIds.push(itemId);
    availableById.set(itemId, remaining - 1);
  }

  return { usableItemIds, warnings };
}

function buildConsumedItemCounts(itemIds: string[]): Record<string, number> {
  const counts = new Map<string, number>();
  for (const itemId of itemIds) {
    counts.set(itemId, (counts.get(itemId) ?? 0) + 1);
  }
  return Object.fromEntries(counts.entries());
}

function calcRebirthEssenceReward(
  stage: BalanceTables["progression"][number],
  preRebirthCount: number,
  attemptResult: BreakthroughAttemptResult,
  config: Required<RebirthOnDeathConfig>,
): RebirthSettlementResult["reward"] {
  const appliedEffectSources = attemptResult.consumables.contributions
    .filter((row) => row.effectType === "rebirth_essence_mul_pct")
    .map((row) => ({
      itemId: row.itemId,
      effectType: row.effectType,
      appliedValue: Math.max(0, row.appliedValue),
    }));

  const consumableMul =
    1 +
    appliedEffectSources.reduce((acc, row) => acc + row.appliedValue, 0);
  const baseEssence =
    stage.rebirth_score_weight * config.rewardWeightScale +
    Math.sqrt(stage.difficulty_index) * config.rewardDifficultyScale;
  const rebirthScaleMultiplier =
    1 + Math.max(0, preRebirthCount) * (config.rewardRebirthCountScalePct / 100);

  const rawFinal = baseEssence * rebirthScaleMultiplier * consumableMul;
  const boundedFinal = clampNumber(
    Math.round(rawFinal),
    Math.max(0, Math.floor(config.rewardMin)),
    Math.max(Math.floor(config.rewardMin), Math.floor(config.rewardMax)),
  );

  return {
    baseEssence: Number(baseEssence.toFixed(4)),
    rebirthScaleMultiplier: Number(rebirthScaleMultiplier.toFixed(4)),
    consumableMultiplier: Number(consumableMul.toFixed(4)),
    finalEssence: boundedFinal,
    appliedEffectSources,
  };
}

function applyInventoryConsumption(save: SaveV2, consumedCounts: Record<string, number>): void {
  if (Object.keys(consumedCounts).length === 0) {
    return;
  }
  for (const item of save.inventory.items) {
    const consume = consumedCounts[item.item_id] ?? 0;
    if (consume <= 0) {
      continue;
    }
    item.quantity = clampCounter(item.quantity - consume);
  }
}

function updateProgressionFromDifficulty(
  save: SaveV2,
  indexes: BalanceIndexes,
  difficultyIndex: number,
): void {
  const next = indexes.progressionByDifficulty.get(difficultyIndex);
  if (!next) {
    throw new Error(`Missing progression row for difficulty_index=${difficultyIndex}`);
  }

  save.progression.difficulty_index = next.difficulty_index;
  save.progression.world = next.world;
  save.progression.major_stage_name = next.major_stage_name;
  save.progression.sub_stage_name = next.sub_stage_name;
}

function ensureValidSaveV2(save: SaveV2): void {
  const validation = validateSaveV2(save);
  if (!validation.ok || !validation.value) {
    const msg = validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Invalid save payload(v2) after progression step: ${msg}`);
  }
}

export function applyBreakthroughStepToSaveV2(
  tables: BalanceTables,
  indexes: BalanceIndexes,
  save: SaveV2,
  options: SaveBreakthroughApplyOptions = {},
): SaveBreakthroughApplyResult {
  const stageBefore = indexes.progressionByDifficulty.get(save.progression.difficulty_index);
  if (!stageBefore) {
    throw new Error(
      `Missing progression row for difficulty_index=${save.progression.difficulty_index}`,
    );
  }

  const isTribulation = stageBefore.is_tribulation === 1;
  if (!options.forceAttempt) {
    if (!isTribulation && !save.settings.auto_breakthrough) {
      return {
        save,
        attempted: false,
        skipReason: "auto_breakthrough_disabled",
        attemptResult: null,
        stageBefore: {
          difficultyIndex: stageBefore.difficulty_index,
          world: stageBefore.world,
          isTribulation,
          stageNameKo: getStageDisplayNameKo(
            indexes,
            stageBefore.world,
            stageBefore.major_stage_name,
            stageBefore.sub_stage_name,
          ),
        },
        stageAfter: {
          difficultyIndex: stageBefore.difficulty_index,
          world: stageBefore.world,
          stageNameKo: getStageDisplayNameKo(
            indexes,
            stageBefore.world,
            stageBefore.major_stage_name,
            stageBefore.sub_stage_name,
          ),
        },
        resolvedRebirthLevels: {
          breakthrough_bonus: 0,
          tribulation_guard: 0,
          potion_mastery: 0,
        },
        rebirthSettlement: null,
        consumedItemCounts: {},
        warnings: ["auto_breakthrough disabled; no progression step executed"],
      };
    }
    if (isTribulation && !save.settings.auto_tribulation) {
      return {
        save,
        attempted: false,
        skipReason: "auto_tribulation_disabled",
        attemptResult: null,
        stageBefore: {
          difficultyIndex: stageBefore.difficulty_index,
          world: stageBefore.world,
          isTribulation,
          stageNameKo: getStageDisplayNameKo(
            indexes,
            stageBefore.world,
            stageBefore.major_stage_name,
            stageBefore.sub_stage_name,
          ),
        },
        stageAfter: {
          difficultyIndex: stageBefore.difficulty_index,
          world: stageBefore.world,
          stageNameKo: getStageDisplayNameKo(
            indexes,
            stageBefore.world,
            stageBefore.major_stage_name,
            stageBefore.sub_stage_name,
          ),
        },
        resolvedRebirthLevels: {
          breakthrough_bonus: 0,
          tribulation_guard: 0,
          potion_mastery: 0,
        },
        rebirthSettlement: null,
        consumedItemCounts: {},
        warnings: ["auto_tribulation disabled; no progression step executed"],
      };
    }
  }

  const warnings: string[] = [];
  const rebirthResolved = resolveRebirthLevels(save, options);
  if (rebirthResolved.warning) {
    warnings.push(rebirthResolved.warning);
  }

  const consumeInventoryItems = options.consumeInventoryItems ?? true;
  const requestedItems = options.consumableItemIds ?? [];
  const consumableResolved = resolveConsumables(
    save,
    requestedItems,
    consumeInventoryItems,
  );
  warnings.push(...consumableResolved.warnings);

  const failStreak = isTribulation
    ? save.pity_counters.tribulation_fail_streak
    : save.pity_counters.breakthrough_fail_streak;

  const attempt = evaluateBreakthroughAttempt(tables, indexes, {
    difficultyIndex: save.progression.difficulty_index,
    currentQi: save.currencies.qi,
    failStreak,
    statusPenaltyPct: options.statusPenaltyPct ?? 0,
    defensiveSkillGuardPct: options.defensiveSkillGuardPct ?? 0,
    consumableItemIds: consumableResolved.usableItemIds,
    rebirthLevels: rebirthResolved.levels,
    rngSeed: options.rngSeed,
  });

  warnings.push(...attempt.warnings);

  const nextSave = structuredClone(save);
  let rebirthSettlement: RebirthSettlementResult | null = null;
  const consumedItemCounts =
    attempt.attempted && consumeInventoryItems
      ? buildConsumedItemCounts(attempt.consumables.usedItemIds)
      : {};

  if (attempt.attempted && consumeInventoryItems) {
    applyInventoryConsumption(nextSave, consumedItemCounts);
  }

  if (attempt.attempted) {
    nextSave.currencies.qi = Math.max(
      0,
      Math.round(nextSave.currencies.qi + attempt.qiDelta),
    );
    updateProgressionFromDifficulty(nextSave, indexes, attempt.nextDifficultyIndex);

    if (attempt.outcome === "death_fail") {
      const rebirthConfig = resolveRebirthOnDeathConfig(options.rebirthOnDeath);
      const preRebirthCount = clampCounter(nextSave.progression.rebirth_count);
      const postRebirthCount = clampCounter(preRebirthCount + 1);
      nextSave.progression.rebirth_count = postRebirthCount;
      nextSave.pity_counters.breakthrough_fail_streak = 0;
      nextSave.pity_counters.tribulation_fail_streak = 0;

      if (rebirthConfig.enabled) {
        const reward = calcRebirthEssenceReward(
          stageBefore,
          preRebirthCount,
          attempt,
          rebirthConfig,
        );
        nextSave.currencies.rebirth_essence = clampCounter(
          nextSave.currencies.rebirth_essence + reward.finalEssence,
        );

        const targetDifficulty = clampCounter(rebirthConfig.resetDifficultyIndex);
        const safeDifficulty = indexes.progressionByDifficulty.has(targetDifficulty)
          ? targetDifficulty
          : 1;
        if (safeDifficulty !== targetDifficulty) {
          warnings.push(
            `rebirth reset difficulty missing: ${targetDifficulty}; fallback to 1`,
          );
        }
        updateProgressionFromDifficulty(nextSave, indexes, safeDifficulty);

        if (rebirthConfig.resetQi) {
          nextSave.currencies.qi = 0;
        }
        if (rebirthConfig.resetSpiritCoin) {
          nextSave.currencies.spirit_coin = 0;
        }
        if (rebirthConfig.clearUnlockedNodes) {
          nextSave.progression.unlocked_nodes = [];
        }

        rebirthSettlement = {
          triggered: true,
          preRebirthCount,
          postRebirthCount,
          reward,
          resets: {
            difficultyIndex: safeDifficulty,
            qiResetApplied: rebirthConfig.resetQi,
            spiritCoinResetApplied: rebirthConfig.resetSpiritCoin,
            unlockedNodesCleared: rebirthConfig.clearUnlockedNodes,
          },
        };
      } else {
        rebirthSettlement = {
          triggered: true,
          preRebirthCount,
          postRebirthCount,
          reward: {
            baseEssence: 0,
            rebirthScaleMultiplier: 1,
            consumableMultiplier: 1,
            finalEssence: 0,
            appliedEffectSources: [],
          },
          resets: {
            difficultyIndex: nextSave.progression.difficulty_index,
            qiResetApplied: false,
            spiritCoinResetApplied: false,
            unlockedNodesCleared: false,
          },
        };
        warnings.push("rebirthOnDeath.enabled=false; death settlement reset/reward skipped");
      }
    }

    if (isTribulation) {
      if (attempt.outcome === "death_fail") {
        nextSave.pity_counters.tribulation_fail_streak = 0;
      } else {
      nextSave.pity_counters.tribulation_fail_streak =
        attempt.outcome === "success"
          ? 0
          : clampCounter(nextSave.pity_counters.tribulation_fail_streak + 1);
      }
    } else {
      if (attempt.outcome === "death_fail") {
        nextSave.pity_counters.breakthrough_fail_streak = 0;
      } else {
      nextSave.pity_counters.breakthrough_fail_streak =
        attempt.outcome === "success"
          ? 0
          : clampCounter(nextSave.pity_counters.breakthrough_fail_streak + 1);
      }
    }

    if (options.bumpSaveTimestamp ?? true) {
      nextSave.timestamps.save_epoch_ms = Math.max(
        0,
        Math.floor(options.nowEpochMs ?? Date.now()),
      );
    }
  }

  ensureValidSaveV2(nextSave);
  const stageAfter = indexes.progressionByDifficulty.get(
    nextSave.progression.difficulty_index,
  );
  if (!stageAfter) {
    throw new Error(
      `Missing progression row for difficulty_index=${nextSave.progression.difficulty_index}`,
    );
  }

  return {
    save: nextSave,
    attempted: attempt.attempted,
    skipReason: null,
    attemptResult: attempt,
    stageBefore: {
      difficultyIndex: stageBefore.difficulty_index,
      world: stageBefore.world,
      isTribulation,
      stageNameKo: getStageDisplayNameKo(
        indexes,
        stageBefore.world,
        stageBefore.major_stage_name,
        stageBefore.sub_stage_name,
      ),
    },
    stageAfter: {
      difficultyIndex: stageAfter.difficulty_index,
      world: stageAfter.world,
      stageNameKo: getStageDisplayNameKo(
        indexes,
        stageAfter.world,
        stageAfter.major_stage_name,
        stageAfter.sub_stage_name,
      ),
    },
    resolvedRebirthLevels: rebirthResolved.levels,
    rebirthSettlement,
    consumedItemCounts,
    warnings,
  };
}
