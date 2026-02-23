import {
  type BalanceIndexes,
  type BalanceTables,
  branchLevelKey,
  getStageDisplayNameKo,
} from "../balance/balanceLoader";
import {
  runMinimalCombatLoop,
  type MinimalCombatReport,
} from "../combat/minimalCombatLoop";
import type { SaveV2 } from "../save/saveSchemaV2";
import { validateSaveV2 } from "../save/validateSaveV2";
import { applyBreakthroughStepToSaveV2 } from "./saveBreakthroughRuntime";
import type { RebirthOnDeathConfig } from "./saveBreakthroughRuntime";

type SaveWorld = BalanceTables["progression"][number]["world"];
type CombatNodeType = BalanceTables["monsters"][number]["type"];
type BreakthroughOutcomeType = NonNullable<
  ReturnType<typeof applyBreakthroughStepToSaveV2>["attemptResult"]
>["outcome"];

export interface SaveAutoProgressLoopInput {
  durationSec?: number;
  tickSec?: number;
  rngSeed?: number;
  battleIntervalSec?: number;
  breakthroughCheckIntervalSec?: number;
  maxEventLogs?: number;
  statusPenaltyPct?: number;
  defensiveSkillGuardPct?: number;
  breakthroughConsumableItemIds?: string[];
  tribulationConsumableItemIds?: string[];
  rebirthOnDeath?: RebirthOnDeathConfig;
}

export interface AutoProgressSummary {
  durationSec: number;
  ticks: number;
  finalDifficultyIndex: number;
  finalStageNameKo: string;
  qiDelta: number;
  spiritCoinDelta: number;
  rebirthEssenceDelta: number;
  rebirthCountDelta: number;
  battles: {
    total: number;
    wins: number;
    losses: number;
    spiritCoinGain: number;
    rebirthEssenceGain: number;
    qiGain: number;
  };
  breakthroughs: {
    attempts: number;
    blockedByAutoSetting: number;
    success: number;
    minorFail: number;
    retreatFail: number;
    deathFail: number;
    rebirthTriggered: number;
  };
}

export interface AutoProgressEventLog {
  atSec: number;
  kind: "battle" | "breakthrough" | "rebirth";
  detail: Record<string, unknown>;
}

export interface SaveAutoProgressLoopResult {
  save: SaveV2;
  summary: AutoProgressSummary;
  eventLogs: AutoProgressEventLog[];
  warnings: string[];
}

const DEFAULT_INPUT: Required<
  Omit<
    SaveAutoProgressLoopInput,
    | "statusPenaltyPct"
    | "defensiveSkillGuardPct"
    | "breakthroughConsumableItemIds"
    | "tribulationConsumableItemIds"
    | "rebirthOnDeath"
  >
> = {
  durationSec: 60,
  tickSec: 1,
  rngSeed: 20260223,
  battleIntervalSec: 18,
  breakthroughCheckIntervalSec: 3,
  maxEventLogs: 400,
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

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeInt(value: number | undefined, fallback: number, min = 0): number {
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

function worldOrder(world: SaveWorld): number {
  if (world === "mortal") {
    return 1;
  }
  if (world === "immortal") {
    return 2;
  }
  return 3;
}

function inferRebirthLevel(rebirthCount: number, div: number): number {
  const lv = Math.floor(Math.max(0, rebirthCount) / div);
  return clampNumber(lv, 0, 20);
}

function getRebirthBranchEffectValue(
  indexes: BalanceIndexes,
  branch: BalanceTables["rebirthUpgrades"][number]["branch"],
  level: number,
): number {
  const lv = Math.max(0, Math.floor(level));
  if (lv <= 0) {
    return 0;
  }
  for (let current = lv; current >= 1; current -= 1) {
    const row = indexes.rebirthUpgradeByBranchLevel.get(branchLevelKey(branch, current));
    if (row) {
      const value = Number(row.effect_value);
      return Number.isFinite(value) ? value : 0;
    }
  }
  return 0;
}

function baseStageCultivationHours(stage: BalanceTables["progression"][number]): number {
  const worldStartQi: Record<SaveWorld, number> = {
    mortal: 100,
    immortal: 450000,
    true: 60000000,
  };
  const worldBaseHours: Record<SaveWorld, number> = {
    mortal: 0.20,
    immortal: 0.34,
    true: 0.62,
  };
  const phaseBonus: Record<BalanceTables["progression"][number]["phase"], number> = {
    early: 0,
    mid: 0.08,
    late: 0.18,
    perfect: 0.32,
    transcendent: 0.42,
  };

  const normalized = Math.max(stage.qi_required / worldStartQi[stage.world], 1);
  const growthFactor = normalized ** 0.09;
  const diffFactor = 1 + stage.difficulty_index * 0.0009;
  return (
    worldBaseHours[stage.world] *
    (1 + phaseBonus[stage.phase]) *
    growthFactor *
    diffFactor
  );
}

function calcQiGainPerSec(
  stage: BalanceTables["progression"][number],
  indexes: BalanceIndexes,
  rebirthCount: number,
): number {
  const baseHours = baseStageCultivationHours(stage);
  const baseQiPerSec = stage.qi_required / Math.max(1, baseHours * 3600);
  const cultivationLv = inferRebirthLevel(rebirthCount, 2);
  const offlineLv = inferRebirthLevel(rebirthCount, 4);
  const cultivationBonus = getRebirthBranchEffectValue(
    indexes,
    "cultivation_speed",
    cultivationLv,
  );
  const offlineBonus = getRebirthBranchEffectValue(
    indexes,
    "offline_efficiency",
    offlineLv,
  );

  const worldPassive = stage.offline_reward_multiplier * 0.05;
  const finalMul = 1 + Math.max(0, cultivationBonus) + Math.max(0, offlineBonus) + worldPassive;
  return baseQiPerSec * finalMul;
}

function pushEventLog(
  logs: AutoProgressEventLog[],
  maxEventLogs: number,
  atSec: number,
  kind: AutoProgressEventLog["kind"],
  detail: Record<string, unknown>,
): void {
  if (logs.length >= maxEventLogs) {
    return;
  }
  logs.push({
    atSec,
    kind,
    detail,
  });
}

function pickCombatSkills(
  tables: BalanceTables,
  difficultyIndex: number,
  world: SaveWorld,
): string[] {
  const filtered = tables.skills
    .filter((row) => {
      const unlockDifficulty = Number(row.unlock_difficulty_index);
      return (
        row.category === "active" &&
        worldOrder(row.world_unlock) <= worldOrder(world) &&
        Number.isFinite(unlockDifficulty) &&
        unlockDifficulty <= difficultyIndex
      );
    })
    .map((row) => ({
      skillId: row.skill_id,
      damageCoeff: Number(row.damage_coeff),
      cooldown: Number(row.cooldown_sec),
    }))
    .sort((a, b) => {
      if (b.damageCoeff !== a.damageCoeff) {
        return b.damageCoeff - a.damageCoeff;
      }
      return a.cooldown - b.cooldown;
    });

  const picked = filtered.slice(0, 2).map((row) => row.skillId);
  if (picked.length > 0) {
    return picked;
  }
  return ["sk_atk_001", "sk_atk_002"];
}

function pickMonsterForBattle(
  tables: BalanceTables,
  world: SaveWorld,
  rng: SeededRng,
): BalanceTables["monsters"][number] {
  const candidates = tables.monsters.filter((row) => row.world === world);
  if (candidates.length === 0) {
    throw new Error(`No monster rows for world=${world}`);
  }

  const bucket: Record<CombatNodeType, BalanceTables["monsters"][number][]> = {
    normal: [],
    elite: [],
    boss: [],
  };
  for (const row of candidates) {
    bucket[row.type].push(row);
  }

  const typeRoll = rng.next();
  let pickedType: CombatNodeType = "normal";
  if (typeRoll >= 0.90) {
    pickedType = "boss";
  } else if (typeRoll >= 0.70) {
    pickedType = "elite";
  }
  const pool = bucket[pickedType].length > 0 ? bucket[pickedType] : candidates;
  const idx = Math.floor(rng.next() * pool.length);
  return pool[idx] ?? pool[0];
}

function calcBattleReward(
  stage: BalanceTables["progression"][number],
  monster: BalanceTables["monsters"][number],
  won: boolean,
  rng: SeededRng,
): { spiritCoin: number; rebirthEssence: number; qi: number } {
  if (!won) {
    const lossPenaltyQi = Math.round(stage.qi_required * 0.0015);
    return { spiritCoin: 0, rebirthEssence: 0, qi: -lossPenaltyQi };
  }

  const typeMul: Record<CombatNodeType, number> = {
    normal: 1,
    elite: 2.2,
    boss: 4.8,
  };
  const variance = 0.90 + rng.next() * 0.2;
  const spiritBase = 120 + stage.difficulty_index * 7;
  const spiritCoin = Math.max(
    1,
    Math.round(spiritBase * stage.drop_rate_multiplier * typeMul[monster.type] * variance),
  );

  const essenceDrop = Number(monster.rebirth_essence_drop);
  const rebirthEssence = Number.isFinite(essenceDrop)
    ? Math.max(0, Math.round(essenceDrop * typeMul[monster.type]))
    : 0;
  const qiGain = Math.max(
    1,
    Math.round(stage.qi_required * 0.0045 * typeMul[monster.type] * (0.9 + rng.next() * 0.2)),
  );
  return { spiritCoin, rebirthEssence, qi: qiGain };
}

function assertValidSaveV2(save: SaveV2): void {
  const result = validateSaveV2(save);
  if (!result.ok || !result.value) {
    const msg = result.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Invalid save payload(v2) during auto loop: ${msg}`);
  }
}

function outcomeFieldName(
  outcome: BreakthroughOutcomeType,
): "success" | "minorFail" | "retreatFail" | "deathFail" {
  if (outcome === "success") {
    return "success";
  }
  if (outcome === "minor_fail") {
    return "minorFail";
  }
  if (outcome === "retreat_fail") {
    return "retreatFail";
  }
  return "deathFail";
}

function pickPlayerLevel(difficultyIndex: number): number {
  return clampNumber(Math.floor(8 + difficultyIndex * 0.55), 1, 120) as number;
}

function runSingleBattle(
  tables: BalanceTables,
  indexes: BalanceIndexes,
  save: SaveV2,
  rng: SeededRng,
  seed: number,
): {
  monster: BalanceTables["monsters"][number];
  report: MinimalCombatReport;
} {
  const stage = indexes.progressionByDifficulty.get(save.progression.difficulty_index);
  if (!stage) {
    throw new Error(
      `Missing progression row for difficulty_index=${save.progression.difficulty_index}`,
    );
  }
  const monster = pickMonsterForBattle(tables, stage.world, rng);
  const skillIds = pickCombatSkills(tables, stage.difficulty_index, stage.world);
  const report = runMinimalCombatLoop(tables, indexes, {
    difficultyIndex: stage.difficulty_index,
    playerLevel: pickPlayerLevel(stage.difficulty_index),
    rebirthCount: save.progression.rebirth_count,
    rngSeed: seed,
    skillIds,
    monsterIds: [monster.monster_id],
    maxTurnsPerBattle: 160,
    includeActionLogs: false,
  });
  return {
    monster,
    report,
  };
}

export function runSaveAutoProgressLoop(
  tables: BalanceTables,
  indexes: BalanceIndexes,
  inputSave: SaveV2,
  input: SaveAutoProgressLoopInput = {},
): SaveAutoProgressLoopResult {
  assertValidSaveV2(inputSave);
  let save = structuredClone(inputSave);

  const config = {
    durationSec: normalizeInt(input.durationSec, DEFAULT_INPUT.durationSec, 1),
    tickSec: normalizeInt(input.tickSec, DEFAULT_INPUT.tickSec, 1),
    rngSeed: normalizeInt(input.rngSeed, DEFAULT_INPUT.rngSeed, 1),
    battleIntervalSec: normalizeInt(
      input.battleIntervalSec,
      DEFAULT_INPUT.battleIntervalSec,
      1,
    ),
    breakthroughCheckIntervalSec: normalizeInt(
      input.breakthroughCheckIntervalSec,
      DEFAULT_INPUT.breakthroughCheckIntervalSec,
      1,
    ),
    maxEventLogs: normalizeInt(input.maxEventLogs, DEFAULT_INPUT.maxEventLogs, 0),
    statusPenaltyPct: normalizeNumber(input.statusPenaltyPct, 0, 0, 95),
    defensiveSkillGuardPct: normalizeNumber(input.defensiveSkillGuardPct, 0, 0, 95),
    breakthroughConsumableItemIds: input.breakthroughConsumableItemIds ?? [],
    tribulationConsumableItemIds: input.tribulationConsumableItemIds ?? [],
    rebirthOnDeath: input.rebirthOnDeath,
  };

  const rng = new SeededRng(config.rngSeed);
  const eventLogs: AutoProgressEventLog[] = [];
  const warnings: string[] = [];

  const startState = {
    difficultyIndex: save.progression.difficulty_index,
    stageNameKo: getStageDisplayNameKo(
      indexes,
      save.progression.world,
      save.progression.major_stage_name,
      save.progression.sub_stage_name,
    ),
    qi: save.currencies.qi,
    spiritCoin: save.currencies.spirit_coin,
    rebirthEssence: save.currencies.rebirth_essence,
    rebirthCount: save.progression.rebirth_count,
  };

  const summary: AutoProgressSummary = {
    durationSec: config.durationSec,
    ticks: 0,
    finalDifficultyIndex: save.progression.difficulty_index,
    finalStageNameKo: startState.stageNameKo,
    qiDelta: 0,
    spiritCoinDelta: 0,
    rebirthEssenceDelta: 0,
    rebirthCountDelta: 0,
    battles: {
      total: 0,
      wins: 0,
      losses: 0,
      spiritCoinGain: 0,
      rebirthEssenceGain: 0,
      qiGain: 0,
    },
    breakthroughs: {
      attempts: 0,
      blockedByAutoSetting: 0,
      success: 0,
      minorFail: 0,
      retreatFail: 0,
      deathFail: 0,
      rebirthTriggered: 0,
    },
  };

  let elapsedSec = 0;
  let nextBattleAt = config.battleIntervalSec;
  let nextBreakthroughCheckAt = config.breakthroughCheckIntervalSec;
  let battleCounter = 0;
  while (elapsedSec < config.durationSec) {
    elapsedSec += config.tickSec;
    summary.ticks += 1;

    const stage = indexes.progressionByDifficulty.get(save.progression.difficulty_index);
    if (!stage) {
      throw new Error(
        `Missing progression row for difficulty_index=${save.progression.difficulty_index}`,
      );
    }

    const qiGainPerSec = calcQiGainPerSec(stage, indexes, save.progression.rebirth_count);
    const cultivatedQi = Math.max(0, Math.round(qiGainPerSec * config.tickSec));
    save.currencies.qi = Math.max(0, save.currencies.qi + cultivatedQi);

    if (save.settings.auto_battle && elapsedSec >= nextBattleAt) {
      const battleSeed = (config.rngSeed + battleCounter * 1009 + elapsedSec) >>> 0;
      battleCounter += 1;
      summary.battles.total += 1;
      const battle = runSingleBattle(tables, indexes, save, rng, battleSeed);
      const duel = battle.report.duels[0];
      if (!duel) {
        throw new Error("battle duel result missing");
      }
      const won = duel.winner === "player";
      if (won) {
        summary.battles.wins += 1;
      } else {
        summary.battles.losses += 1;
      }

      const reward = calcBattleReward(stage, battle.monster, won, rng);
      save.currencies.spirit_coin = Math.max(0, save.currencies.spirit_coin + reward.spiritCoin);
      save.currencies.rebirth_essence = Math.max(
        0,
        save.currencies.rebirth_essence + reward.rebirthEssence,
      );
      save.currencies.qi = Math.max(0, save.currencies.qi + reward.qi);

      summary.battles.spiritCoinGain += reward.spiritCoin;
      summary.battles.rebirthEssenceGain += reward.rebirthEssence;
      summary.battles.qiGain += reward.qi;
      pushEventLog(eventLogs, config.maxEventLogs, elapsedSec, "battle", {
        monsterId: duel.monsterId,
        monsterType: battle.monster.type,
        winner: duel.winner,
        spiritCoin: reward.spiritCoin,
        rebirthEssence: reward.rebirthEssence,
        qi: reward.qi,
      });
      nextBattleAt += config.battleIntervalSec / Math.max(1, save.settings.battle_speed);
    }

    if (elapsedSec >= nextBreakthroughCheckAt) {
      const currentStage = indexes.progressionByDifficulty.get(save.progression.difficulty_index);
      if (!currentStage) {
        throw new Error(
          `Missing progression row for difficulty_index=${save.progression.difficulty_index}`,
        );
      }
      const isTribulation = currentStage.is_tribulation === 1;
      const autoEnabled = isTribulation
        ? save.settings.auto_tribulation
        : save.settings.auto_breakthrough;

      if (!autoEnabled && save.currencies.qi >= currentStage.qi_required) {
        summary.breakthroughs.blockedByAutoSetting += 1;
      } else if (autoEnabled && save.currencies.qi >= currentStage.qi_required) {
        const progress = applyBreakthroughStepToSaveV2(tables, indexes, save, {
          forceAttempt: false,
          rngSeed: (config.rngSeed + elapsedSec * 13 + battleCounter * 17) >>> 0,
          statusPenaltyPct: config.statusPenaltyPct,
          defensiveSkillGuardPct: config.defensiveSkillGuardPct,
          consumableItemIds: isTribulation
            ? config.tribulationConsumableItemIds
            : config.breakthroughConsumableItemIds,
          rebirthOnDeath: config.rebirthOnDeath,
          consumeInventoryItems: true,
          bumpSaveTimestamp: false,
        });
        warnings.push(...progress.warnings);
        if (progress.attemptResult && progress.attempted) {
          summary.breakthroughs.attempts += 1;
          const outcomeField = outcomeFieldName(progress.attemptResult.outcome);
          summary.breakthroughs[outcomeField] += 1;
          if (progress.rebirthSettlement?.triggered) {
            summary.breakthroughs.rebirthTriggered += 1;
            pushEventLog(eventLogs, config.maxEventLogs, elapsedSec, "rebirth", {
              reward: progress.rebirthSettlement.reward.finalEssence,
              difficultyAfter: progress.rebirthSettlement.resets.difficultyIndex,
              rebirthCountAfter: progress.rebirthSettlement.postRebirthCount,
            });
          }
          pushEventLog(eventLogs, config.maxEventLogs, elapsedSec, "breakthrough", {
            outcome: progress.attemptResult.outcome,
            difficultyBefore: progress.stageBefore.difficultyIndex,
            difficultyAfter: progress.stageAfter.difficultyIndex,
            stageBefore: progress.stageBefore.stageNameKo,
            stageAfter: progress.stageAfter.stageNameKo,
            qiAfter: progress.save.currencies.qi,
          });
        }
        // applyBreakthroughStepToSaveV2 returns a cloned save object.
        save = progress.save;
      }
      nextBreakthroughCheckAt += config.breakthroughCheckIntervalSec;
    }
  }

  save.timestamps.save_epoch_ms += config.durationSec * 1000;
  assertValidSaveV2(save);

  const finalStage = indexes.progressionByDifficulty.get(save.progression.difficulty_index);
  if (!finalStage) {
    throw new Error(`Missing progression row for difficulty_index=${save.progression.difficulty_index}`);
  }
  summary.finalDifficultyIndex = finalStage.difficulty_index;
  summary.finalStageNameKo = getStageDisplayNameKo(
    indexes,
    finalStage.world,
    finalStage.major_stage_name,
    finalStage.sub_stage_name,
  );
  summary.qiDelta = save.currencies.qi - startState.qi;
  summary.spiritCoinDelta = save.currencies.spirit_coin - startState.spiritCoin;
  summary.rebirthEssenceDelta = save.currencies.rebirth_essence - startState.rebirthEssence;
  summary.rebirthCountDelta = save.progression.rebirth_count - startState.rebirthCount;

  return {
    save,
    summary,
    eventLogs,
    warnings: Array.from(new Set(warnings)),
  };
}
