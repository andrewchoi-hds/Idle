import {
  type BalanceIndexes,
  type BalanceTables,
  getCombatConstantNumber,
} from "../balance/balanceLoader";

export interface MinimalCombatConfig {
  difficultyIndex?: number;
  playerLevel?: number;
  rebirthCount?: number;
  rngSeed?: number;
  skillIds?: string[];
  monsterIds?: string[];
  maxTurnsPerBattle?: number;
  includeActionLogs?: boolean;
}

export interface CombatUnitStats {
  hp: number;
  mp: number;
  atk: number;
  def: number;
  speed: number;
  accuracy: number;
  evasion: number;
  critRate: number;
  critDamage: number;
  penetration: number;
  damageReduction: number;
}

export type CombatElement = "fire" | "ice" | "thunder" | "wind" | "earth" | "none";
export type CombatStatus = "burn" | "slow" | "stun" | "armor_break" | "weaken";

export interface CombatSkill {
  skillId: string;
  nameKo: string;
  damageCoeff: number;
  cooldownSec: number;
  costMp: number;
  element: CombatElement;
  statusEffect: string;
  statusChancePct: number;
  statusDurationSec: number;
}

export interface BattleActionLog {
  turn: number;
  timestampSec: number;
  actor: "player" | "monster";
  actorId: string;
  targetId: string;
  actionId: string;
  actionName: string;
  damage: number;
  isCrit: boolean;
  isMiss: boolean;
  elementMultiplier: number;
  appliedStatus: string | null;
  statusApplied: boolean;
  selfHeal: number;
  targetHpAfter: number;
}

export interface DuelResult {
  monsterId: string;
  monsterNameKo: string;
  monsterType: string;
  winner: "player" | "monster";
  turns: number;
  elapsedSec: number;
  playerHpLeft: number;
  monsterHpLeft: number;
  usedSkills: Record<string, number>;
  statusAppliedCounts: Record<string, number>;
  logs: BattleActionLog[];
}

export interface MinimalCombatReport {
  config: Required<MinimalCombatConfig>;
  context: {
    world: string;
    majorStageName: string;
    subStageName: string;
    defenseConstantK: number;
  };
  player: {
    stats: CombatUnitStats;
    skills: CombatSkill[];
  };
  duels: DuelResult[];
  summary: {
    total: number;
    wins: number;
    losses: number;
    winRate: number;
    avgTurns: number;
    avgElapsedSec: number;
  };
}

interface RuntimeUnit {
  kind: "player" | "monster";
  id: string;
  name: string;
  element: CombatElement;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  nextActionSec: number;
  stats: CombatUnitStats;
  cooldownReadySec: Map<string, number>;
  statusEffects: RuntimeStatusEffect[];
}

interface RuntimeStatusEffect {
  type: CombatStatus;
  untilSec: number;
  sourceAtk: number;
}

interface DamageResult {
  damage: number;
  isCrit: boolean;
  isMiss: boolean;
  elementMultiplier: number;
}

interface MonsterHitStatusRule {
  type: CombatStatus;
  chance: number;
  durationSec: number;
  sourceAtkScale?: number;
}

interface MonsterMechanicRule {
  passiveCritRateAdd?: number;
  passiveDamageReductionAdd?: number;
  passiveDefMultiplier?: number;
  onHitStatus?: MonsterHitStatusRule;
  onHitHealRatio?: number;
  firstStrikeDamageMultiplier?: number;
  executeBonus?: {
    targetHpBelowRatio: number;
    damageMultiplier: number;
  };
}

const DEFAULT_CONFIG: Required<MinimalCombatConfig> = {
  difficultyIndex: 20,
  playerLevel: 30,
  rebirthCount: 2,
  rngSeed: 20260223,
  skillIds: ["sk_atk_001", "sk_atk_002"],
  monsterIds: ["mob_m_001", "mob_m_003", "mob_m_008"],
  maxTurnsPerBattle: 180,
  includeActionLogs: true,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toNumber(raw: string, fallback = 0): number {
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function normalizeElement(raw: string): CombatElement {
  const v = raw.trim().toLowerCase();
  if (v === "wood") {
    return "earth";
  }
  if (v === "metal") {
    return "thunder";
  }
  if (
    v === "fire" ||
    v === "ice" ||
    v === "thunder" ||
    v === "wind" ||
    v === "earth"
  ) {
    return v;
  }
  return "none";
}

function getMonsterMechanicRule(tag: string): MonsterMechanicRule | null {
  switch (tag) {
    case "burn_claw":
      return {
        onHitStatus: {
          type: "burn",
          chance: 0.42,
          durationSec: 4.0,
          sourceAtkScale: 0.9,
        },
      };
    case "burn_field":
      return {
        onHitStatus: {
          type: "burn",
          chance: 0.35,
          durationSec: 4.5,
          sourceAtkScale: 0.9,
        },
      };
    case "burn_stack":
      return {
        onHitStatus: {
          type: "burn",
          chance: 0.45,
          durationSec: 5.0,
          sourceAtkScale: 0.95,
        },
      };
    case "root_bind":
      return {
        onHitStatus: {
          type: "stun",
          chance: 0.26,
          durationSec: 1.4,
        },
      };
    case "frozen_prison":
      return {
        onHitStatus: {
          type: "stun",
          chance: 0.30,
          durationSec: 1.6,
        },
      };
    case "time_stop":
      return {
        onHitStatus: {
          type: "stun",
          chance: 0.34,
          durationSec: 1.6,
        },
      };
    case "slow_aura":
      return {
        onHitStatus: {
          type: "slow",
          chance: 0.70,
          durationSec: 4.5,
        },
      };
    case "slow_field":
      return {
        onHitStatus: {
          type: "slow",
          chance: 0.62,
          durationSec: 4.0,
        },
      };
    case "charm_gaze":
      return {
        onHitStatus: {
          type: "slow",
          chance: 0.58,
          durationSec: 3.8,
        },
      };
    case "armor_break":
    case "time_cut":
      return {
        onHitStatus: {
          type: "armor_break",
          chance: 0.56,
          durationSec: 4.0,
        },
      };
    case "law_suppress":
    case "fear_aura":
      return {
        onHitStatus: {
          type: "weaken",
          chance: 0.55,
          durationSec: 4.2,
        },
      };
    case "poison_stack":
      return {
        onHitStatus: {
          type: "burn",
          chance: 0.38,
          durationSec: 4.5,
          sourceAtkScale: 0.75,
        },
      };
    case "chain_lightning":
    case "thunderstorm":
    case "judgment_mark":
    case "triple_tribulation":
      return {
        onHitStatus: {
          type: "stun",
          chance: 0.18,
          durationSec: 1.0,
        },
      };
    case "high_crit":
      return {
        passiveCritRateAdd: 0.08,
      };
    case "high_def":
      return {
        passiveDefMultiplier: 1.14,
        passiveDamageReductionAdd: 0.08,
      };
    case "adaptive_armor":
      return {
        passiveDefMultiplier: 1.12,
        passiveDamageReductionAdd: 0.06,
      };
    case "law_barrier":
      return {
        passiveDefMultiplier: 1.18,
        passiveDamageReductionAdd: 0.16,
      };
    case "shield_cast":
      return {
        passiveDamageReductionAdd: 0.12,
      };
    case "invuln_phase":
      return {
        passiveDamageReductionAdd: 0.18,
      };
    case "blink_strike":
    case "multi_dash":
    case "phase_shift":
      return {
        firstStrikeDamageMultiplier: 1.28,
      };
    case "execute_mark":
      return {
        executeBonus: {
          targetHpBelowRatio: 0.35,
          damageMultiplier: 1.30,
        },
      };
    case "soul_harvest":
      return {
        executeBonus: {
          targetHpBelowRatio: 0.30,
          damageMultiplier: 1.35,
        },
      };
    case "origin_tribulation":
      return {
        executeBonus: {
          targetHpBelowRatio: 0.45,
          damageMultiplier: 1.40,
        },
      };
    case "heal_link":
      return {
        onHitHealRatio: 0.08,
      };
    default:
      return null;
  }
}

function isElementAdvantage(
  attacker: CombatElement,
  defender: CombatElement,
): boolean {
  const advantageMap: Record<CombatElement, CombatElement | null> = {
    fire: "wind",
    wind: "earth",
    earth: "thunder",
    thunder: "ice",
    ice: "fire",
    none: null,
  };
  return advantageMap[attacker] === defender;
}

function calcElementMultiplier(
  attackerElement: CombatElement,
  defenderElement: CombatElement,
  indexes: BalanceIndexes,
): number {
  const bonus = getCombatConstantNumber(indexes, "element_advantage_bonus", 0.25);
  const penalty = getCombatConstantNumber(
    indexes,
    "element_disadvantage_penalty",
    -0.20,
  );

  if (isElementAdvantage(attackerElement, defenderElement)) {
    return 1 + bonus;
  }
  if (isElementAdvantage(defenderElement, attackerElement)) {
    return Math.max(0.10, 1 + penalty);
  }
  return 1;
}

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

function getStatCoeffValue(
  tables: BalanceTables,
  statId: string,
  field: keyof Pick<
    BalanceTables["statGrowthCoeffs"][number],
    | "base_value"
    | "per_player_level"
    | "per_major_stage"
    | "per_sub_stage"
    | "rebirth_scale_pct"
    | "hard_cap"
    | "soft_cap_start"
    | "soft_cap_slope"
  >,
): number {
  const row = tables.statGrowthCoeffs.find((r) => r.stat_id === statId);
  if (!row) {
    throw new Error(`Missing stat growth row: ${statId}`);
  }
  return toNumber(row[field]);
}

function applySoftHardCap(
  raw: number,
  softCapStart: number,
  hardCap: number,
  softSlope: number,
): number {
  if (hardCap < 0) {
    return raw;
  }

  let value = raw;
  if (softCapStart >= 0 && softSlope > 0 && value > softCapStart) {
    value = softCapStart + (value - softCapStart) * softSlope;
  }

  return Math.min(value, hardCap);
}

function calcPlayerStat(
  tables: BalanceTables,
  statId: string,
  playerLevel: number,
  majorStageIndex: number,
  subStageIndex: number,
  rebirthCount: number,
): number {
  const baseValue = getStatCoeffValue(tables, statId, "base_value");
  const perLevel = getStatCoeffValue(tables, statId, "per_player_level");
  const perMajor = getStatCoeffValue(tables, statId, "per_major_stage");
  const perSub = getStatCoeffValue(tables, statId, "per_sub_stage");
  const rebirthScalePct = getStatCoeffValue(tables, statId, "rebirth_scale_pct");

  const hardCap = getStatCoeffValue(tables, statId, "hard_cap");
  const softCapStart = getStatCoeffValue(tables, statId, "soft_cap_start");
  const softCapSlope = getStatCoeffValue(tables, statId, "soft_cap_slope");

  const raw =
    baseValue +
    perLevel * Math.max(0, playerLevel - 1) +
    perMajor * Math.max(0, majorStageIndex - 1) +
    perSub * Math.max(0, subStageIndex - 1);

  const rebirthScaled = raw * (1 + Math.max(0, rebirthCount) * rebirthScalePct * 0.01);
  return applySoftHardCap(rebirthScaled, softCapStart, hardCap, softCapSlope);
}

function buildPlayerStats(
  tables: BalanceTables,
  progressionRow: BalanceTables["progression"][number],
  config: Required<MinimalCombatConfig>,
  indexes: BalanceIndexes,
): CombatUnitStats {
  const accuracyFloor = getCombatConstantNumber(indexes, "accuracy_floor", 0.55);
  const accuracyCeiling = getCombatConstantNumber(indexes, "accuracy_ceiling", 0.98);
  const critRateCap = getCombatConstantNumber(indexes, "crit_rate_cap", 0.75);
  const evasionCap = getCombatConstantNumber(indexes, "evasion_cap", 0.60);
  const damageReductionCap = getCombatConstantNumber(
    indexes,
    "damage_reduction_cap",
    0.70,
  );

  const hp = calcPlayerStat(
    tables,
    "hp",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const mp = calcPlayerStat(
    tables,
    "mp",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const atk = calcPlayerStat(
    tables,
    "atk",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const def = calcPlayerStat(
    tables,
    "def",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );

  const speed = calcPlayerStat(
    tables,
    "speed",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const accuracy = calcPlayerStat(
    tables,
    "accuracy",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const evasion = calcPlayerStat(
    tables,
    "evasion",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const critRate = calcPlayerStat(
    tables,
    "crit_rate",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const critDamage = calcPlayerStat(
    tables,
    "crit_damage",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const penetration = calcPlayerStat(
    tables,
    "penetration",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );
  const damageReduction = calcPlayerStat(
    tables,
    "damage_reduction",
    config.playerLevel,
    progressionRow.major_stage_index,
    progressionRow.sub_stage_index,
    config.rebirthCount,
  );

  return {
    hp,
    mp,
    atk,
    def,
    speed: Math.max(0.2, speed),
    accuracy: clamp(accuracy, accuracyFloor, accuracyCeiling),
    evasion: clamp(evasion, 0, evasionCap),
    critRate: clamp(critRate, 0, critRateCap),
    critDamage: Math.max(0, critDamage),
    penetration: clamp(penetration, 0, 0.65),
    damageReduction: clamp(damageReduction, 0, damageReductionCap),
  };
}

function pickPrototypeSkills(
  tables: BalanceTables,
  config: Required<MinimalCombatConfig>,
): CombatSkill[] {
  const byId = new Map(tables.skills.map((row) => [row.skill_id, row]));

  const requested: CombatSkill[] = [];
  for (const skillId of config.skillIds) {
    const row = byId.get(skillId);
    if (!row) {
      continue;
    }
    const damageCoeff = toNumber(row.damage_coeff);
    if (row.category !== "active" || damageCoeff <= 0) {
      continue;
    }
    requested.push({
      skillId: row.skill_id,
      nameKo: row.name_ko,
      damageCoeff,
      cooldownSec: Math.max(0, toNumber(row.cooldown_sec)),
      costMp: Math.max(0, toNumber(row.cost_mp)),
      element: normalizeElement(row.element),
      statusEffect: row.status_effect,
      statusChancePct: Math.max(0, toNumber(row.status_chance_pct)),
      statusDurationSec: Math.max(0, toNumber(row.status_duration_sec)),
    });
  }

  if (requested.length >= 2) {
    return requested.slice(0, 2);
  }

  const fallback = tables.skills
    .filter(
      (row) =>
        row.category === "active" &&
        row.world_unlock === "mortal" &&
        toNumber(row.damage_coeff) > 0 &&
        toNumber(row.unlock_difficulty_index) <= config.difficultyIndex,
    )
    .sort((a, b) => toNumber(a.unlock_difficulty_index) - toNumber(b.unlock_difficulty_index))
    .slice(0, 2)
    .map((row) => ({
      skillId: row.skill_id,
      nameKo: row.name_ko,
      damageCoeff: toNumber(row.damage_coeff),
      cooldownSec: Math.max(0, toNumber(row.cooldown_sec)),
      costMp: Math.max(0, toNumber(row.cost_mp)),
      element: normalizeElement(row.element),
      statusEffect: row.status_effect,
      statusChancePct: Math.max(0, toNumber(row.status_chance_pct)),
      statusDurationSec: Math.max(0, toNumber(row.status_duration_sec)),
    }));

  if (fallback.length < 2) {
    throw new Error("Unable to select 2 prototype skills from skill table");
  }
  return fallback;
}

function pickPrototypeMonsters(
  tables: BalanceTables,
  config: Required<MinimalCombatConfig>,
): BalanceTables["monsters"] {
  const byId = new Map(tables.monsters.map((row) => [row.monster_id, row]));
  const picked = config.monsterIds
    .map((id) => byId.get(id))
    .filter((row): row is BalanceTables["monsters"][number] => Boolean(row));

  if (picked.length >= 3) {
    return picked.slice(0, 3);
  }

  const fallbackByType = ["normal", "elite", "boss"].map((monsterType) => {
    const row = tables.monsters.find(
      (m) => m.world === "mortal" && m.type === monsterType,
    );
    if (!row) {
      throw new Error(`Unable to find fallback monster for type=${monsterType}`);
    }
    return row;
  });
  return fallbackByType;
}

function buildMonsterStats(
  player: CombatUnitStats,
  monster: BalanceTables["monsters"][number],
  indexes: BalanceIndexes,
): CombatUnitStats {
  const mechanicRule = getMonsterMechanicRule(monster.special_mechanic);
  const hpMult = Math.max(0.5, toNumber(monster.hp_mult, 1));
  const atkMult = Math.max(0.5, toNumber(monster.atk_mult, 1));
  const defMult = Math.max(0.5, toNumber(monster.def_mult, 1));
  const speedMult = Math.max(0.3, toNumber(monster.speed_mult, 1));

  const critRateCap = getCombatConstantNumber(indexes, "crit_rate_cap", 0.75);
  const evasionCap = getCombatConstantNumber(indexes, "evasion_cap", 0.60);
  const damageReductionCap = getCombatConstantNumber(
    indexes,
    "damage_reduction_cap",
    0.70,
  );
  const accuracyFloor = getCombatConstantNumber(indexes, "accuracy_floor", 0.55);
  const accuracyCeiling = getCombatConstantNumber(indexes, "accuracy_ceiling", 0.98);
  const passiveDefMultiplier = mechanicRule?.passiveDefMultiplier ?? 1;
  const passiveCritRateAdd = mechanicRule?.passiveCritRateAdd ?? 0;
  const passiveDamageReductionAdd = mechanicRule?.passiveDamageReductionAdd ?? 0;
  const baseDamageReduction = Math.max(0, (defMult - 1) * 0.10);

  return {
    hp: player.hp * hpMult * 1.05,
    mp: 0,
    atk: player.atk * atkMult * 0.88,
    def: player.def * defMult * passiveDefMultiplier * 0.92,
    speed: Math.max(0.2, player.speed * speedMult),
    accuracy: clamp(0.72 + (atkMult - 1) * 0.08, accuracyFloor, accuracyCeiling),
    evasion: clamp(toNumber(monster.evasion, 0), 0, evasionCap),
    critRate: clamp(toNumber(monster.crit_rate, 0) + passiveCritRateAdd, 0, critRateCap),
    critDamage: 0.45,
    penetration: clamp(Math.max(0, (atkMult - 1) * 0.07), 0, 0.45),
    damageReduction: clamp(
      baseDamageReduction + passiveDamageReductionAdd,
      0,
      damageReductionCap,
    ),
  };
}

function makeUnit(
  kind: RuntimeUnit["kind"],
  id: string,
  name: string,
  stats: CombatUnitStats,
  element: CombatElement,
): RuntimeUnit {
  return {
    kind,
    id,
    name,
    element,
    hp: stats.hp,
    maxHp: stats.hp,
    mp: stats.mp,
    maxMp: stats.mp,
    nextActionSec: 1 / Math.max(0.2, stats.speed),
    stats,
    cooldownReadySec: new Map<string, number>(),
    statusEffects: [],
  };
}

function pruneExpiredStatuses(unit: RuntimeUnit, nowSec: number): void {
  unit.statusEffects = unit.statusEffects.filter((effect) => effect.untilSec > nowSec);
}

function hasStatus(
  unit: RuntimeUnit,
  statusType: CombatStatus,
  nowSec: number,
): boolean {
  return unit.statusEffects.some(
    (effect) => effect.type === statusType && effect.untilSec > nowSec,
  );
}

function getStatus(
  unit: RuntimeUnit,
  statusType: CombatStatus,
  nowSec: number,
): RuntimeStatusEffect | undefined {
  return unit.statusEffects.find(
    (effect) => effect.type === statusType && effect.untilSec > nowSec,
  );
}

function applyStatus(
  target: RuntimeUnit,
  statusType: CombatStatus,
  durationSec: number,
  sourceAtk: number,
  nowSec: number,
): boolean {
  if (durationSec <= 0) {
    return false;
  }
  const untilSec = nowSec + durationSec;
  const existing = target.statusEffects.find((effect) => effect.type === statusType);
  if (!existing) {
    target.statusEffects.push({
      type: statusType,
      untilSec,
      sourceAtk: Math.max(0, sourceAtk),
    });
    return true;
  }

  existing.untilSec = Math.max(existing.untilSec, untilSec);
  existing.sourceAtk = Math.max(existing.sourceAtk, sourceAtk);
  return true;
}

function currentSpeedMultiplier(unit: RuntimeUnit, nowSec: number): number {
  return hasStatus(unit, "slow", nowSec) ? 0.75 : 1;
}

function currentAtkMultiplier(unit: RuntimeUnit, nowSec: number): number {
  return hasStatus(unit, "weaken", nowSec) ? 0.85 : 1;
}

function currentDefMultiplier(unit: RuntimeUnit, nowSec: number): number {
  return hasStatus(unit, "armor_break", nowSec) ? 0.80 : 1;
}

function processStartOfTurnStatuses(
  actor: RuntimeUnit,
  turn: number,
  nowSec: number,
  includeLogs: boolean,
): { consumedTurn: boolean; logs: BattleActionLog[] } {
  const logs: BattleActionLog[] = [];
  pruneExpiredStatuses(actor, nowSec);

  const burn = getStatus(actor, "burn", nowSec);
  if (burn) {
    const burnDamage = Math.max(1, Math.round(burn.sourceAtk * 0.12));
    actor.hp = Math.max(0, actor.hp - burnDamage);
    if (includeLogs) {
      logs.push({
        turn,
        timestampSec: Number(nowSec.toFixed(3)),
        actor: actor.kind,
        actorId: actor.id,
        targetId: actor.id,
        actionId: "status_burn_tick",
        actionName: "화상 피해",
        damage: burnDamage,
        isCrit: false,
        isMiss: false,
        elementMultiplier: 1,
        appliedStatus: null,
        statusApplied: false,
        selfHeal: 0,
        targetHpAfter: Number(actor.hp.toFixed(2)),
      });
    }
  }

  if (actor.hp <= 0) {
    return { consumedTurn: true, logs };
  }

  if (hasStatus(actor, "stun", nowSec)) {
    if (includeLogs) {
      logs.push({
        turn,
        timestampSec: Number(nowSec.toFixed(3)),
        actor: actor.kind,
        actorId: actor.id,
        targetId: actor.id,
        actionId: "status_stun_skip",
        actionName: "기절",
        damage: 0,
        isCrit: false,
        isMiss: false,
        elementMultiplier: 1,
        appliedStatus: null,
        statusApplied: false,
        selfHeal: 0,
        targetHpAfter: Number(actor.hp.toFixed(2)),
      });
    }
    return { consumedTurn: true, logs };
  }

  return { consumedTurn: false, logs };
}

function maybeApplySkillStatus(
  attacker: RuntimeUnit,
  target: RuntimeUnit,
  skill: CombatSkill,
  nowSec: number,
  rng: SeededRng,
): { appliedStatus: string | null; statusApplied: boolean } {
  const effect = skill.statusEffect;
  if (effect !== "burn" && effect !== "slow" && effect !== "stun") {
    return { appliedStatus: null, statusApplied: false };
  }
  if (skill.statusChancePct <= 0 || skill.statusDurationSec <= 0) {
    return { appliedStatus: null, statusApplied: false };
  }

  const statusApplied = maybeApplyStatusWithChance(
    target,
    effect,
    clamp(skill.statusChancePct / 100, 0, 1),
    skill.statusDurationSec,
    attacker.stats.atk,
    nowSec,
    rng,
  );
  return { appliedStatus: effect, statusApplied };
}

function maybeApplyStatusWithChance(
  target: RuntimeUnit,
  statusType: CombatStatus,
  chance: number,
  durationSec: number,
  sourceAtk: number,
  nowSec: number,
  rng: SeededRng,
): boolean {
  if (chance <= 0 || durationSec <= 0) {
    return false;
  }
  if (rng.next() > chance) {
    return false;
  }
  return applyStatus(target, statusType, durationSec, sourceAtk, nowSec);
}

function calcDamage(
  attacker: RuntimeUnit,
  defender: RuntimeUnit,
  coeff: number,
  attackerElement: CombatElement,
  rng: SeededRng,
  indexes: BalanceIndexes,
  attackerAtkMultiplier = 1,
  defenderDefMultiplier = 1,
): DamageResult {
  const accuracyFloor = getCombatConstantNumber(indexes, "accuracy_floor", 0.55);
  const accuracyCeiling = getCombatConstantNumber(indexes, "accuracy_ceiling", 0.98);
  const defenseConstantK = getCombatConstantNumber(indexes, "defense_constant_k", 180);
  const critRateCap = getCombatConstantNumber(indexes, "crit_rate_cap", 0.75);

  const hitChance = clamp(
    attacker.stats.accuracy - defender.stats.evasion + 0.75,
    accuracyFloor,
    accuracyCeiling,
  );
  if (rng.next() > hitChance) {
    return {
      damage: 0,
      isCrit: false,
      isMiss: true,
      elementMultiplier: 1,
    };
  }

  const critRate = clamp(attacker.stats.critRate, 0, critRateCap);
  const isCrit = rng.next() < critRate;

  const defAfterPen = Math.max(
    0,
    defender.stats.def * defenderDefMultiplier * (1 - attacker.stats.penetration),
  );
  const defRatio = defAfterPen / (defAfterPen + defenseConstantK);

  let damage = attacker.stats.atk * attackerAtkMultiplier * coeff;
  damage *= 1 - defRatio;
  damage *= 1 - defender.stats.damageReduction;
  const elementMultiplier = calcElementMultiplier(
    attackerElement,
    defender.element,
    indexes,
  );
  damage *= elementMultiplier;
  if (isCrit) {
    damage *= 1 + attacker.stats.critDamage;
  }
  const variance = 0.95 + rng.next() * 0.10;
  damage *= variance;

  return {
    damage: Math.max(1, Math.round(damage)),
    isCrit,
    isMiss: false,
    elementMultiplier,
  };
}

function choosePlayerSkill(
  player: RuntimeUnit,
  skills: CombatSkill[],
  nowSec: number,
): CombatSkill | null {
  const available = skills.filter((skill) => {
    const readyAt = player.cooldownReadySec.get(skill.skillId) ?? 0;
    return readyAt <= nowSec && player.mp >= skill.costMp;
  });
  if (available.length === 0) {
    return null;
  }

  available.sort((a, b) => {
    if (b.damageCoeff !== a.damageCoeff) {
      return b.damageCoeff - a.damageCoeff;
    }
    return a.cooldownSec - b.cooldownSec;
  });
  return available[0] ?? null;
}

function simulateDuel(
  playerStats: CombatUnitStats,
  monsterRow: BalanceTables["monsters"][number],
  monsterStats: CombatUnitStats,
  skills: CombatSkill[],
  rngSeed: number,
  maxTurns: number,
  includeLogs: boolean,
  indexes: BalanceIndexes,
): DuelResult {
  const rng = new SeededRng(rngSeed);
  const monsterMechanicRule = getMonsterMechanicRule(monsterRow.special_mechanic);
  const player = makeUnit("player", "player_01", "수련자", playerStats, "none");
  const monster = makeUnit(
    "monster",
    monsterRow.monster_id,
    monsterRow.name_ko,
    monsterStats,
    normalizeElement(monsterRow.element),
  );

  const logs: BattleActionLog[] = [];
  const usedSkills = new Map<string, number>();
  const statusAppliedCounts = new Map<string, number>();
  let monsterFirstStrikePending =
    (monsterMechanicRule?.firstStrikeDamageMultiplier ?? 1) > 1;

  let turns = 0;
  let nowSec = 0;

  while (turns < maxTurns && player.hp > 0 && monster.hp > 0) {
    const actor = player.nextActionSec <= monster.nextActionSec ? player : monster;
    const target = actor.kind === "player" ? monster : player;

    nowSec = actor.nextActionSec;
    turns += 1;

    const startStatus = processStartOfTurnStatuses(actor, turns, nowSec, includeLogs);
    if (includeLogs) {
      logs.push(...startStatus.logs);
    }
    if (actor.hp <= 0) {
      break;
    }
    if (startStatus.consumedTurn) {
      actor.nextActionSec +=
        1 / Math.max(0.2, actor.stats.speed * currentSpeedMultiplier(actor, nowSec));
      continue;
    }

    let actionId = "basic_attack";
    let actionName = "기본공격";
    let coeff = 1.0;
    let attackElement: CombatElement = actor.element;
    let selectedSkill: CombatSkill | null = null;

    if (actor.kind === "player") {
      const skill = choosePlayerSkill(actor, skills, nowSec);
      if (skill) {
        selectedSkill = skill;
        actionId = skill.skillId;
        actionName = skill.nameKo;
        coeff = skill.damageCoeff;
        attackElement = skill.element;
        actor.mp -= skill.costMp;
        actor.cooldownReadySec.set(skill.skillId, nowSec + skill.cooldownSec);
        usedSkills.set(skill.skillId, (usedSkills.get(skill.skillId) ?? 0) + 1);
      } else {
        actor.mp = Math.min(actor.maxMp, actor.mp + 6);
      }
    }

    let effectiveCoeff = coeff;
    if (actor.kind === "monster") {
      const firstStrikeMultiplier =
        monsterMechanicRule?.firstStrikeDamageMultiplier ?? 1;
      if (monsterFirstStrikePending && firstStrikeMultiplier > 0) {
        effectiveCoeff *= firstStrikeMultiplier;
        monsterFirstStrikePending = false;
      }

      const executeBonus = monsterMechanicRule?.executeBonus;
      if (executeBonus && target.maxHp > 0) {
        const targetHpRatio = target.hp / target.maxHp;
        if (targetHpRatio <= executeBonus.targetHpBelowRatio) {
          effectiveCoeff *= executeBonus.damageMultiplier;
        }
      }
    }

    const result = calcDamage(
      actor,
      target,
      effectiveCoeff,
      attackElement,
      rng,
      indexes,
      currentAtkMultiplier(actor, nowSec),
      currentDefMultiplier(target, nowSec),
    );
    let appliedStatus: string | null = null;
    let statusApplied = false;
    let selfHeal = 0;
    if (!result.isMiss) {
      target.hp = Math.max(0, target.hp - result.damage);
      if (actor.kind === "player" && selectedSkill) {
        const statusResult = maybeApplySkillStatus(
          actor,
          target,
          selectedSkill,
          nowSec,
          rng,
        );
        appliedStatus = statusResult.appliedStatus;
        statusApplied = statusResult.statusApplied;
        if (statusResult.statusApplied && statusResult.appliedStatus) {
          statusAppliedCounts.set(
            statusResult.appliedStatus,
            (statusAppliedCounts.get(statusResult.appliedStatus) ?? 0) + 1,
          );
        }
      } else if (actor.kind === "monster" && monsterMechanicRule?.onHitStatus) {
        const onHit = monsterMechanicRule.onHitStatus;
        appliedStatus = onHit.type;
        statusApplied = maybeApplyStatusWithChance(
          target,
          onHit.type,
          clamp(onHit.chance, 0, 1),
          onHit.durationSec,
          actor.stats.atk * (onHit.sourceAtkScale ?? 1),
          nowSec,
          rng,
        );
        if (statusApplied) {
          statusAppliedCounts.set(
            onHit.type,
            (statusAppliedCounts.get(onHit.type) ?? 0) + 1,
          );
        }
      }

      if (actor.kind === "monster" && monsterMechanicRule?.onHitHealRatio) {
        const healRatio = clamp(monsterMechanicRule.onHitHealRatio, 0, 1);
        if (healRatio > 0 && result.damage > 0) {
          const healAmount = Math.max(1, Math.round(result.damage * healRatio));
          const hpBeforeHeal = actor.hp;
          actor.hp = Math.min(actor.maxHp, actor.hp + healAmount);
          selfHeal = Math.max(0, Math.round(actor.hp - hpBeforeHeal));
        }
      }
    }

    if (includeLogs) {
      logs.push({
        turn: turns,
        timestampSec: Number(nowSec.toFixed(3)),
        actor: actor.kind,
        actorId: actor.id,
        targetId: target.id,
        actionId,
        actionName,
        damage: result.damage,
        isCrit: result.isCrit,
        isMiss: result.isMiss,
        elementMultiplier: Number(result.elementMultiplier.toFixed(4)),
        appliedStatus,
        statusApplied,
        selfHeal,
        targetHpAfter: Number(target.hp.toFixed(2)),
      });
    }

    actor.nextActionSec +=
      1 / Math.max(0.2, actor.stats.speed * currentSpeedMultiplier(actor, nowSec));
  }

  const winner = player.hp > 0 && monster.hp <= 0 ? "player" : "monster";
  const usedSkillsObj: Record<string, number> = {};
  for (const [skillId, count] of usedSkills.entries()) {
    usedSkillsObj[skillId] = count;
  }
  const statusAppliedCountsObj: Record<string, number> = {};
  for (const [status, count] of statusAppliedCounts.entries()) {
    statusAppliedCountsObj[status] = count;
  }

  return {
    monsterId: monsterRow.monster_id,
    monsterNameKo: monsterRow.name_ko,
    monsterType: monsterRow.type,
    winner,
    turns,
    elapsedSec: Number(nowSec.toFixed(3)),
    playerHpLeft: Number(player.hp.toFixed(2)),
    monsterHpLeft: Number(monster.hp.toFixed(2)),
    usedSkills: usedSkillsObj,
    statusAppliedCounts: statusAppliedCountsObj,
    logs,
  };
}

export function runMinimalCombatLoop(
  tables: BalanceTables,
  indexes: BalanceIndexes,
  inputConfig: MinimalCombatConfig = {},
): MinimalCombatReport {
  const config: Required<MinimalCombatConfig> = {
    ...DEFAULT_CONFIG,
    ...inputConfig,
    skillIds: inputConfig.skillIds ?? DEFAULT_CONFIG.skillIds,
    monsterIds: inputConfig.monsterIds ?? DEFAULT_CONFIG.monsterIds,
  };

  const progressionRow = tables.progression.find(
    (row) => row.difficulty_index === config.difficultyIndex,
  );
  if (!progressionRow) {
    throw new Error(`Missing progression row: difficulty_index=${config.difficultyIndex}`);
  }

  const skills = pickPrototypeSkills(tables, config);
  const monsters = pickPrototypeMonsters(tables, config);

  const playerStats = buildPlayerStats(tables, progressionRow, config, indexes);
  const duels = monsters.map((monster, idx) => {
    const monsterStats = buildMonsterStats(playerStats, monster, indexes);
    return simulateDuel(
      playerStats,
      monster,
      monsterStats,
      skills,
      config.rngSeed + idx * 1009,
      config.maxTurnsPerBattle,
      config.includeActionLogs,
      indexes,
    );
  });

  const wins = duels.filter((duel) => duel.winner === "player").length;
  const avgTurns = duels.reduce((acc, duel) => acc + duel.turns, 0) / duels.length;
  const avgElapsedSec = duels.reduce((acc, duel) => acc + duel.elapsedSec, 0) / duels.length;

  return {
    config,
    context: {
      world: progressionRow.world,
      majorStageName: progressionRow.major_stage_name,
      subStageName: progressionRow.sub_stage_name,
      defenseConstantK: getCombatConstantNumber(indexes, "defense_constant_k", 180),
    },
    player: {
      stats: playerStats,
      skills,
    },
    duels,
    summary: {
      total: duels.length,
      wins,
      losses: duels.length - wins,
      winRate: wins / duels.length,
      avgTurns: Number(avgTurns.toFixed(2)),
      avgElapsedSec: Number(avgElapsedSec.toFixed(3)),
    },
  };
}

export function formatMinimalCombatReport(report: MinimalCombatReport): string {
  const lines: string[] = [];
  lines.push(
    [
      "[minimal-combat]",
      `difficulty=${report.config.difficultyIndex}`,
      `level=${report.config.playerLevel}`,
      `rebirth=${report.config.rebirthCount}`,
      `winRate=${(report.summary.winRate * 100).toFixed(1)}%`,
      `avgTurns=${report.summary.avgTurns}`,
      `avgSec=${report.summary.avgElapsedSec}`,
    ].join(" "),
  );

  for (const duel of report.duels) {
    const statusText = Object.keys(duel.statusAppliedCounts).length
      ? Object.entries(duel.statusAppliedCounts)
          .map(([status, count]) => `${status}:${count}`)
          .join(",")
      : "none";
    lines.push(
      [
        `- ${duel.monsterNameKo}(${duel.monsterType})`,
        `winner=${duel.winner}`,
        `turns=${duel.turns}`,
        `sec=${duel.elapsedSec}`,
        `playerHpLeft=${duel.playerHpLeft.toFixed(1)}`,
        `status=${statusText}`,
      ].join(" | "),
    );
  }

  return lines.join("\n");
}
