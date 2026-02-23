import {
  type BalanceIndexes,
  type BalanceTables,
  branchLevelKey,
  getStageDisplayNameKo,
} from "../balance/balanceLoader";

export type RebirthBranch = BalanceTables["rebirthUpgrades"][number]["branch"];

export type BreakthroughOutcomeType =
  | "blocked_no_qi"
  | "success"
  | "minor_fail"
  | "retreat_fail"
  | "death_fail";

export interface BreakthroughModifiers {
  failStreakBonusPerStackPct?: number;
  failStreakBonusCapPct?: number;
  minorFailQiLossRatio?: number;
  minorFailMaterialLossPct?: number;
}

export interface BreakthroughAttemptInput {
  difficultyIndex: number;
  currentQi: number;
  failStreak?: number;
  statusPenaltyPct?: number;
  defensiveSkillGuardPct?: number;
  rebirthLevels?: Partial<Record<RebirthBranch, number>>;
  consumableItemIds?: string[];
  rngSeed?: number;
  modifiers?: BreakthroughModifiers;
}

export interface ConsumableContribution {
  itemId: string;
  nameKo: string;
  itemType: "potion" | "talisman";
  effectType: string;
  baseValue: number;
  appliedValue: number;
}

export interface BreakthroughSuccessBreakdown {
  basePct: number;
  rebirthBonusPct: number;
  consumableBonusPct: number;
  failStreakBonusPct: number;
  statusPenaltyPct: number;
  finalPct: number;
}

export interface TribulationDeathBreakdown {
  basePct: number;
  rebirthGuardPct: number;
  consumableGuardPct: number;
  defensiveSkillGuardPct: number;
  finalPct: number;
}

export interface FailureWeightProfile {
  source: "table" | "fallback";
  minorPct: number;
  retreatPct: number;
  deathPct: number;
  retreatMinLayers: number;
  retreatMaxLayers: number;
}

export interface BreakthroughAttemptResult {
  outcome: BreakthroughOutcomeType;
  attempted: boolean;
  isTribulation: boolean;
  difficultyIndex: number;
  nextDifficultyIndex: number;
  world: BalanceTables["progression"][number]["world"];
  stageNameKo: string;
  qiRequired: number;
  qiDelta: number;
  materialLossPct: number;
  retreatLayers: number;
  rates: {
    successPct: number;
    deathPct: number;
    failureWeights: FailureWeightProfile | null;
  };
  breakdown: {
    success: BreakthroughSuccessBreakdown;
    death: TribulationDeathBreakdown | null;
  };
  consumables: {
    usedItemIds: string[];
    contributions: ConsumableContribution[];
    ignoredItemIds: string[];
  };
  rolls: {
    successRollPct: number | null;
    failureRollPct: number | null;
  };
  warnings: string[];
}

export interface BreakthroughTrialInput
  extends Omit<BreakthroughAttemptInput, "rngSeed"> {
  trials: number;
  seed?: number;
}

export interface BreakthroughTrialReport {
  config: Required<Pick<BreakthroughTrialInput, "difficultyIndex" | "trials" | "seed">> &
    Omit<BreakthroughTrialInput, "difficultyIndex" | "trials" | "seed">;
  sample: BreakthroughAttemptResult;
  counts: Record<BreakthroughOutcomeType, number>;
  rates: Record<BreakthroughOutcomeType, number>;
  avgRetreatLayersWhenRetreat: number;
  avgQiDelta: number;
}

const DEFAULT_SEED = 20260223;

export const DEFAULT_BREAKTHROUGH_MODIFIERS: Required<BreakthroughModifiers> = {
  failStreakBonusPerStackPct: 1.25,
  failStreakBonusCapPct: 18,
  minorFailQiLossRatio: 0.12,
  minorFailMaterialLossPct: 10,
};

class SeededRng {
  private state: number;

  constructor(seed: number) {
    const normalized = seed >>> 0;
    this.state = normalized === 0 ? 0x12345678 : normalized;
  }

  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 0x100000000;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeInt(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(0, Math.floor(parsed));
}

function normalizeNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeSeed(seed: number | undefined): number {
  if (seed === undefined) {
    return DEFAULT_SEED;
  }
  const parsed = Number(seed);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_SEED;
  }
  return parsed >>> 0;
}

function getRebirthBranchEffectValue(
  indexes: BalanceIndexes,
  branch: RebirthBranch,
  level: number,
): number {
  const normalizedLevel = Math.max(0, Math.floor(level));
  if (normalizedLevel <= 0) {
    return 0;
  }

  for (let lv = normalizedLevel; lv >= 1; lv -= 1) {
    const row = indexes.rebirthUpgradeByBranchLevel.get(branchLevelKey(branch, lv));
    if (row) {
      return normalizeNumber(row.effect_value, 0);
    }
  }
  return 0;
}

function normalizeRetreatRange(
  minValue: number,
  maxValue: number,
): { min: number; max: number } {
  const min = Math.max(0, Math.floor(minValue));
  const max = Math.max(min, Math.floor(maxValue));
  return { min, max };
}

function collectConsumableEffects(
  indexes: BalanceIndexes,
  itemIds: string[],
  potionMasteryMul: number,
): {
  breakthroughBonusPct: number;
  tribulationGuardPct: number;
  contributions: ConsumableContribution[];
  ignoredItemIds: string[];
  warnings: string[];
} {
  let breakthroughBonusPct = 0;
  let tribulationGuardPct = 0;
  const contributions: ConsumableContribution[] = [];
  const ignoredItemIds: string[] = [];
  const warnings: string[] = [];

  for (const itemId of itemIds) {
    const row = indexes.potionTalismanById.get(itemId);
    if (!row) {
      ignoredItemIds.push(itemId);
      warnings.push(`unknown consumable item_id: ${itemId}`);
      continue;
    }

    const baseValue = normalizeNumber(row.effect_value, Number.NaN);
    if (!Number.isFinite(baseValue)) {
      ignoredItemIds.push(itemId);
      warnings.push(`invalid consumable effect_value: ${itemId}=${row.effect_value}`);
      continue;
    }

    const appliedValue =
      row.item_type === "potion" ? baseValue * (1 + potionMasteryMul) : baseValue;
    contributions.push({
      itemId,
      nameKo: row.name_ko,
      itemType: row.item_type,
      effectType: row.effect_type,
      baseValue,
      appliedValue,
    });

    if (row.effect_type === "breakthrough_bonus_flat_pct") {
      breakthroughBonusPct += appliedValue;
    } else if (row.effect_type === "tribulation_death_reduce_flat_pct") {
      tribulationGuardPct += appliedValue;
    }
  }

  return {
    breakthroughBonusPct,
    tribulationGuardPct,
    contributions,
    ignoredItemIds,
    warnings,
  };
}

function buildFailureWeightProfile(
  indexes: BalanceIndexes,
  difficultyIndex: number,
  deathPct: number,
  defaultRetreatMin: number,
  defaultRetreatMax: number,
): FailureWeightProfile {
  const weightRow = indexes.tribulationFailureByDifficulty.get(difficultyIndex);
  if (!weightRow) {
    return {
      source: "fallback",
      minorPct: 100 - deathPct,
      retreatPct: 0,
      deathPct,
      retreatMinLayers: defaultRetreatMin,
      retreatMaxLayers: defaultRetreatMax,
    };
  }

  const minorBase = normalizeNumber(weightRow.weight_minor_fail, 0);
  const retreatBase = normalizeNumber(weightRow.weight_retreat_fail, 0);
  const nonDeathBase = Math.max(0, minorBase + retreatBase);
  const nonDeathPct = Math.max(0, 100 - deathPct);

  const minorPct =
    nonDeathBase > 0 ? (nonDeathPct * minorBase) / nonDeathBase : nonDeathPct;
  const retreatPct = nonDeathPct - minorPct;
  const retreatRange = normalizeRetreatRange(
    normalizeNumber(weightRow.retreat_min_layers, defaultRetreatMin),
    normalizeNumber(weightRow.retreat_max_layers, defaultRetreatMax),
  );

  return {
    source: "table",
    minorPct: clamp(minorPct, 0, 100),
    retreatPct: clamp(retreatPct, 0, 100),
    deathPct: clamp(deathPct, 0, 100),
    retreatMinLayers: retreatRange.min,
    retreatMaxLayers: retreatRange.max,
  };
}

function sampleRetreatLayers(
  rng: SeededRng,
  minLayers: number,
  maxLayers: number,
): number {
  if (maxLayers <= minLayers) {
    return minLayers;
  }
  const roll = rng.next();
  const span = maxLayers - minLayers + 1;
  return minLayers + Math.floor(roll * span);
}

export function evaluateBreakthroughAttempt(
  tables: BalanceTables,
  indexes: BalanceIndexes,
  input: BreakthroughAttemptInput,
): BreakthroughAttemptResult {
  const stage = indexes.progressionByDifficulty.get(input.difficultyIndex);
  if (!stage) {
    throw new Error(`Missing progression row for difficulty_index=${input.difficultyIndex}`);
  }

  const modifiers: Required<BreakthroughModifiers> = {
    failStreakBonusPerStackPct:
      input.modifiers?.failStreakBonusPerStackPct ??
      DEFAULT_BREAKTHROUGH_MODIFIERS.failStreakBonusPerStackPct,
    failStreakBonusCapPct:
      input.modifiers?.failStreakBonusCapPct ??
      DEFAULT_BREAKTHROUGH_MODIFIERS.failStreakBonusCapPct,
    minorFailQiLossRatio:
      input.modifiers?.minorFailQiLossRatio ??
      DEFAULT_BREAKTHROUGH_MODIFIERS.minorFailQiLossRatio,
    minorFailMaterialLossPct:
      input.modifiers?.minorFailMaterialLossPct ??
      DEFAULT_BREAKTHROUGH_MODIFIERS.minorFailMaterialLossPct,
  };

  const currentQi = Math.max(0, normalizeInt(input.currentQi, 0));
  const failStreak = normalizeInt(input.failStreak, 0);
  const statusPenaltyPct = Math.max(0, normalizeNumber(input.statusPenaltyPct, 0));
  const defensiveSkillGuardPct = Math.max(
    0,
    normalizeNumber(input.defensiveSkillGuardPct, 0),
  );
  const rebirthLevels = input.rebirthLevels ?? {};
  const consumableItemIds = input.consumableItemIds ?? [];
  const rng = new SeededRng(normalizeSeed(input.rngSeed));

  const breakthroughRebirthBonusPct = getRebirthBranchEffectValue(
    indexes,
    "breakthrough_bonus",
    normalizeInt(rebirthLevels.breakthrough_bonus, 0),
  );
  const tribulationGuardRebirthPct = getRebirthBranchEffectValue(
    indexes,
    "tribulation_guard",
    normalizeInt(rebirthLevels.tribulation_guard, 0),
  );
  const potionMasteryMul = getRebirthBranchEffectValue(
    indexes,
    "potion_mastery",
    normalizeInt(rebirthLevels.potion_mastery, 0),
  );

  const consumableEffects = collectConsumableEffects(
    indexes,
    consumableItemIds,
    potionMasteryMul,
  );

  const failStreakBonusPct = clamp(
    failStreak * modifiers.failStreakBonusPerStackPct,
    0,
    Math.max(0, modifiers.failStreakBonusCapPct),
  );
  const successPct = clamp(
    stage.base_breakthrough_success_pct +
      breakthroughRebirthBonusPct +
      consumableEffects.breakthroughBonusPct +
      failStreakBonusPct -
      statusPenaltyPct,
    5,
    95,
  );

  const successBreakdown: BreakthroughSuccessBreakdown = {
    basePct: stage.base_breakthrough_success_pct,
    rebirthBonusPct: breakthroughRebirthBonusPct,
    consumableBonusPct: consumableEffects.breakthroughBonusPct,
    failStreakBonusPct,
    statusPenaltyPct,
    finalPct: successPct,
  };

  const retreatRangeFromStage = normalizeRetreatRange(
    stage.fail_retreat_min,
    stage.fail_retreat_max,
  );
  const isTribulation = stage.is_tribulation === 1;

  let deathBreakdown: TribulationDeathBreakdown | null = null;
  let deathPct = 0;
  let failureWeights: FailureWeightProfile | null = null;

  if (isTribulation) {
    deathPct = clamp(
      stage.base_death_pct -
        tribulationGuardRebirthPct -
        consumableEffects.tribulationGuardPct -
        defensiveSkillGuardPct,
      0,
      90,
    );
    deathBreakdown = {
      basePct: stage.base_death_pct,
      rebirthGuardPct: tribulationGuardRebirthPct,
      consumableGuardPct: consumableEffects.tribulationGuardPct,
      defensiveSkillGuardPct,
      finalPct: deathPct,
    };
    failureWeights = buildFailureWeightProfile(
      indexes,
      stage.difficulty_index,
      deathPct,
      retreatRangeFromStage.min,
      retreatRangeFromStage.max,
    );
  }

  const baseResult: Omit<
    BreakthroughAttemptResult,
    "outcome" | "nextDifficultyIndex" | "qiDelta" | "materialLossPct" | "retreatLayers"
  > = {
    attempted: false,
    isTribulation,
    difficultyIndex: stage.difficulty_index,
    world: stage.world,
    stageNameKo: getStageDisplayNameKo(
      indexes,
      stage.world,
      stage.major_stage_name,
      stage.sub_stage_name,
    ),
    qiRequired: stage.qi_required,
    rates: {
      successPct,
      deathPct,
      failureWeights,
    },
    breakdown: {
      success: successBreakdown,
      death: deathBreakdown,
    },
    consumables: {
      usedItemIds: consumableItemIds,
      contributions: consumableEffects.contributions,
      ignoredItemIds: consumableEffects.ignoredItemIds,
    },
    rolls: {
      successRollPct: null,
      failureRollPct: null,
    },
    warnings: [...consumableEffects.warnings],
  };

  if (currentQi < stage.qi_required) {
    return {
      ...baseResult,
      outcome: "blocked_no_qi",
      attempted: false,
      nextDifficultyIndex: stage.difficulty_index,
      qiDelta: 0,
      materialLossPct: 0,
      retreatLayers: 0,
      warnings: [
        ...baseResult.warnings,
        `insufficient qi: current=${currentQi}, required=${stage.qi_required}`,
      ],
    };
  }

  const successRollPct = rng.next() * 100;
  if (successRollPct < successPct) {
    return {
      ...baseResult,
      outcome: "success",
      attempted: true,
      nextDifficultyIndex: stage.difficulty_index + 1,
      qiDelta: -stage.qi_required,
      materialLossPct: 0,
      retreatLayers: 0,
      rolls: {
        ...baseResult.rolls,
        successRollPct,
      },
    };
  }

  if (!isTribulation || !failureWeights) {
    const minorLoss = Math.round(stage.qi_required * modifiers.minorFailQiLossRatio);
    return {
      ...baseResult,
      outcome: "minor_fail",
      attempted: true,
      nextDifficultyIndex: stage.difficulty_index,
      qiDelta: -(stage.qi_required + minorLoss),
      materialLossPct: modifiers.minorFailMaterialLossPct,
      retreatLayers: 0,
      rolls: {
        ...baseResult.rolls,
        successRollPct,
      },
    };
  }

  const failureRollPct = rng.next() * 100;
  if (failureRollPct < failureWeights.deathPct) {
    return {
      ...baseResult,
      outcome: "death_fail",
      attempted: true,
      nextDifficultyIndex: 1,
      qiDelta: -currentQi,
      materialLossPct: 0,
      retreatLayers: 0,
      rolls: {
        successRollPct,
        failureRollPct,
      },
    };
  }
  if (failureRollPct < failureWeights.deathPct + failureWeights.retreatPct) {
    const retreatLayers = sampleRetreatLayers(
      rng,
      failureWeights.retreatMinLayers,
      failureWeights.retreatMaxLayers,
    );
    const nextDifficultyIndex = Math.max(1, stage.difficulty_index - retreatLayers);
    return {
      ...baseResult,
      outcome: "retreat_fail",
      attempted: true,
      nextDifficultyIndex,
      qiDelta: -stage.qi_required,
      materialLossPct: 0,
      retreatLayers,
      rolls: {
        successRollPct,
        failureRollPct,
      },
    };
  }

  const minorLoss = Math.round(stage.qi_required * modifiers.minorFailQiLossRatio);
  return {
    ...baseResult,
    outcome: "minor_fail",
    attempted: true,
    nextDifficultyIndex: stage.difficulty_index,
    qiDelta: -(stage.qi_required + minorLoss),
    materialLossPct: modifiers.minorFailMaterialLossPct,
    retreatLayers: 0,
    rolls: {
      successRollPct,
      failureRollPct,
    },
  };
}

export function runBreakthroughTrials(
  tables: BalanceTables,
  indexes: BalanceIndexes,
  input: BreakthroughTrialInput,
): BreakthroughTrialReport {
  const trials = Math.max(1, Math.floor(input.trials));
  const seed = normalizeSeed(input.seed);

  const counts: Record<BreakthroughOutcomeType, number> = {
    blocked_no_qi: 0,
    success: 0,
    minor_fail: 0,
    retreat_fail: 0,
    death_fail: 0,
  };

  let qiDeltaSum = 0;
  let retreatCount = 0;
  let retreatLayersSum = 0;

  let firstResult: BreakthroughAttemptResult | null = null;

  for (let i = 0; i < trials; i += 1) {
    const result = evaluateBreakthroughAttempt(tables, indexes, {
      ...input,
      rngSeed: (seed + i * 1009) >>> 0,
    });
    if (!firstResult) {
      firstResult = result;
    }
    counts[result.outcome] += 1;
    qiDeltaSum += result.qiDelta;
    if (result.outcome === "retreat_fail") {
      retreatCount += 1;
      retreatLayersSum += result.retreatLayers;
    }
  }

  if (!firstResult) {
    throw new Error("runBreakthroughTrials internal error: no trial result");
  }

  const rates: Record<BreakthroughOutcomeType, number> = {
    blocked_no_qi: counts.blocked_no_qi / trials,
    success: counts.success / trials,
    minor_fail: counts.minor_fail / trials,
    retreat_fail: counts.retreat_fail / trials,
    death_fail: counts.death_fail / trials,
  };

  return {
    config: {
      difficultyIndex: input.difficultyIndex,
      trials,
      seed,
      currentQi: input.currentQi,
      failStreak: input.failStreak,
      statusPenaltyPct: input.statusPenaltyPct,
      defensiveSkillGuardPct: input.defensiveSkillGuardPct,
      rebirthLevels: input.rebirthLevels,
      consumableItemIds: input.consumableItemIds,
      modifiers: input.modifiers,
    },
    sample: firstResult,
    counts,
    rates,
    avgRetreatLayersWhenRetreat:
      retreatCount > 0 ? retreatLayersSum / retreatCount : 0,
    avgQiDelta: qiDeltaSum / trials,
  };
}
