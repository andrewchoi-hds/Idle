const MAX_LOG_ENTRIES = 120;
export const MOBILE_MVP_STORAGE_KEY = "idle_xianxia_mobile_mvp_v1_save";
export const MOBILE_MVP_STORAGE_KEY_PREFIX = "idle_xianxia_mobile_mvp_v1_save_slot_";
export const MOBILE_MVP_SLOT_PREFS_KEY = "idle_xianxia_mobile_mvp_v1_slot_pref";
const SLOT_SUMMARY_STATES = new Set(["ok", "empty", "corrupt"]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toNonNegativeInt(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(0, Math.floor(parsed));
}

function pickBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeSaveSlot(slot, fallback = 1) {
  const normalizedFallback = clamp(toNonNegativeInt(fallback, 1), 1, 3);
  const parsed = Number(slot);
  if (!Number.isFinite(parsed)) {
    return normalizedFallback;
  }
  return clamp(Math.floor(parsed), 1, 3);
}

export function buildStorageKeyForSlot(slot) {
  const normalized = normalizeSaveSlot(slot, 1);
  return `${MOBILE_MVP_STORAGE_KEY_PREFIX}${normalized}`;
}

export function normalizeSlotSummaryState(state, fallback = "empty") {
  const normalizedFallback = SLOT_SUMMARY_STATES.has(fallback) ? fallback : "empty";
  if (typeof state !== "string") {
    return normalizedFallback;
  }
  return SLOT_SUMMARY_STATES.has(state) ? state : normalizedFallback;
}

export function resolveSlotSummaryQuickAction(activeSlot, selectedSlot, selectedState) {
  const normalizedActiveSlot = normalizeSaveSlot(activeSlot, 1);
  const normalizedSelectedSlot = normalizeSaveSlot(selectedSlot, normalizedActiveSlot);
  const normalizedState = normalizeSlotSummaryState(selectedState, "empty");
  const changedSlot = normalizedSelectedSlot !== normalizedActiveSlot;
  if (normalizedState === "ok") {
    return {
      nextActiveSlot: normalizedSelectedSlot,
      selectedState: normalizedState,
      changedSlot,
      shouldLoad: true,
      actionKind: "switch_and_load",
    };
  }
  if (normalizedState === "corrupt") {
    return {
      nextActiveSlot: normalizedSelectedSlot,
      selectedState: normalizedState,
      changedSlot,
      shouldLoad: false,
      actionKind: "switch_corrupt",
    };
  }
  return {
    nextActiveSlot: normalizedSelectedSlot,
    selectedState: normalizedState,
    changedSlot,
    shouldLoad: false,
    actionKind: changedSlot ? "switch_empty" : "empty",
  };
}

export function resolveDebouncedAction(lastAcceptedEpochMs, nowEpochMs, debounceMs = 700) {
  const normalizedLastAccepted = toNonNegativeInt(lastAcceptedEpochMs, 0);
  const normalizedNowEpochMs = toNonNegativeInt(nowEpochMs, normalizedLastAccepted);
  const normalizedDebounceMs = clamp(toNonNegativeInt(debounceMs, 700), 0, 5000);
  const nextAllowedEpochMs = normalizedLastAccepted + normalizedDebounceMs;
  const accepted = normalizedNowEpochMs >= nextAllowedEpochMs;
  if (accepted) {
    return {
      accepted: true,
      lastAcceptedEpochMs: normalizedNowEpochMs,
      nextAllowedEpochMs: normalizedNowEpochMs + normalizedDebounceMs,
      remainingMs: 0,
      debounceMs: normalizedDebounceMs,
    };
  }
  return {
    accepted: false,
    lastAcceptedEpochMs: normalizedLastAccepted,
    nextAllowedEpochMs,
    remainingMs: nextAllowedEpochMs - normalizedNowEpochMs,
    debounceMs: normalizedDebounceMs,
  };
}

export function resolveSlotCopyPolicy(sourceSlot, targetSlot, targetState) {
  const normalizedSourceSlot = normalizeSaveSlot(sourceSlot, 1);
  const normalizedTargetSlot = normalizeSaveSlot(targetSlot, normalizedSourceSlot);
  const normalizedTargetState = normalizeSlotSummaryState(targetState, "empty");
  const sameSlot = normalizedSourceSlot === normalizedTargetSlot;
  if (sameSlot) {
    return {
      sourceSlot: normalizedSourceSlot,
      targetSlot: normalizedTargetSlot,
      targetState: normalizedTargetState,
      allowed: false,
      requiresConfirm: false,
      reason: "same_slot",
    };
  }
  if (normalizedTargetState === "empty") {
    return {
      sourceSlot: normalizedSourceSlot,
      targetSlot: normalizedTargetSlot,
      targetState: normalizedTargetState,
      allowed: true,
      requiresConfirm: false,
      reason: "target_empty",
    };
  }
  return {
    sourceSlot: normalizedSourceSlot,
    targetSlot: normalizedTargetSlot,
    targetState: normalizedTargetState,
    allowed: true,
    requiresConfirm: true,
    reason: normalizedTargetState === "corrupt" ? "target_corrupt" : "target_has_data",
  };
}

export function resolveSlotDeletePolicy(slot, slotState) {
  const normalizedSlot = normalizeSaveSlot(slot, 1);
  const normalizedState = normalizeSlotSummaryState(slotState, "empty");
  if (normalizedState === "empty") {
    return {
      slot: normalizedSlot,
      slotState: normalizedState,
      allowed: false,
      requiresConfirm: false,
      reason: "empty_slot",
    };
  }
  return {
    slot: normalizedSlot,
    slotState: normalizedState,
    allowed: true,
    requiresConfirm: true,
    reason: normalizedState === "corrupt" ? "corrupt_slot" : "has_data",
  };
}

function parseIsoEpochMs(value) {
  const parsed = Date.parse(typeof value === "string" ? value : "");
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, Math.floor(parsed));
}

function localeKey(stage) {
  return `${stage.world}|${stage.major_stage_name}|${stage.sub_stage_name}|${stage.phase}`;
}

function worldKo(world) {
  if (world === "mortal") return "인간계";
  if (world === "immortal") return "신선계";
  return "진선계";
}

function stageFallbackLabel(stage) {
  return `${worldKo(stage.world)} ${stage.major_stage_name} ${stage.sub_stage_name}`;
}

function nextFloatPct(rng) {
  return rng.next() * 100;
}

function addLog(state, kind, message) {
  state.logs.unshift({
    at: new Date().toISOString(),
    kind,
    message,
  });
  if (state.logs.length > MAX_LOG_ENTRIES) {
    state.logs.length = MAX_LOG_ENTRIES;
  }
}

function pushLimited(list, item, maxItems) {
  list.push(item);
  if (list.length > maxItems) {
    list.splice(0, list.length - maxItems);
  }
}

function calcRebirthReward(stage, rebirthCount) {
  const base = stage.rebirth_score_weight * 12;
  const difficultyScale = Math.sqrt(Math.max(1, stage.difficulty_index)) * 0.85;
  const rebirthScale = 1 + Math.max(0, rebirthCount) * 0.025;
  return Math.max(5, Math.round((base + difficultyScale) * rebirthScale));
}

function applyRebirthByDeath(context, state, stage, options = {}) {
  const suppressLogs = pickBoolean(options.suppressLogs, false);
  const reward = calcRebirthReward(stage, state.progression.rebirthCount);
  state.progression.rebirthCount += 1;
  state.currencies.rebirthEssence += reward;
  state.progression.difficultyIndex = 1;
  state.currencies.qi = 0;
  state.currencies.spiritCoin = Math.floor(state.currencies.spiritCoin * 0.2);
  if (!suppressLogs) {
    addLog(
      state,
      "rebirth",
      `도겁 중 사망 → 환생 발동, 환생정수 +${reward}, 경지 1로 초기화`,
    );
  }
  const resetStage = getStage(context, state.progression.difficultyIndex);
  return {
    reward,
    resetStageNameKo: getStageDisplayNameKo(context, resetStage),
  };
}

function evaluateBreakthroughOutcome(stage, successPct, deathPct, rng, debugForcedOutcome) {
  if (debugForcedOutcome) {
    return debugForcedOutcome;
  }
  const successRoll = nextFloatPct(rng);
  if (successRoll < successPct) {
    return "success";
  }
  if (stage.is_tribulation !== 1) {
    return "minor_fail";
  }

  const failRoll = nextFloatPct(rng);
  if (failRoll < deathPct) {
    return "death_fail";
  }
  const retreatWeight = clamp(28 + stage.fail_retreat_max * 11, 20, 78);
  if (failRoll < deathPct + retreatWeight) {
    return "retreat_fail";
  }
  return "minor_fail";
}

function pickRetreatLayers(stage, rng) {
  const min = Math.max(0, toNonNegativeInt(stage.fail_retreat_min, 0));
  const max = Math.max(min, toNonNegativeInt(stage.fail_retreat_max, min));
  if (max <= min) {
    return min;
  }
  const span = max - min + 1;
  return min + Math.floor(rng.next() * span);
}

export function createSeededRng(seed = 20260224) {
  let state = (Number(seed) >>> 0) || 0x12345678;
  return {
    next() {
      let x = state;
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      state = x >>> 0;
      return state / 0x100000000;
    },
  };
}

export function buildSliceContext(progressionRows, localeRows) {
  if (!Array.isArray(progressionRows) || progressionRows.length === 0) {
    throw new Error("progressionRows must be a non-empty array");
  }
  const sorted = [...progressionRows]
    .map((row) => ({
      ...row,
      difficulty_index: toNonNegativeInt(row.difficulty_index, 0),
      qi_required: Math.max(1, Number(row.qi_required) || 1),
      base_breakthrough_success_pct: Number(row.base_breakthrough_success_pct) || 0,
      base_death_pct: Number(row.base_death_pct) || 0,
      fail_retreat_min: toNonNegativeInt(row.fail_retreat_min, 0),
      fail_retreat_max: toNonNegativeInt(row.fail_retreat_max, 0),
      rebirth_score_weight: Number(row.rebirth_score_weight) || 1,
      is_tribulation: Number(row.is_tribulation) === 1 ? 1 : 0,
    }))
    .sort((a, b) => a.difficulty_index - b.difficulty_index);

  const stageByDifficulty = new Map(
    sorted.map((row) => [row.difficulty_index, row]),
  );

  const localeMap = new Map();
  if (Array.isArray(localeRows)) {
    for (const row of localeRows) {
      if (!row || typeof row !== "object") continue;
      const key = `${row.world}|${row.major_stage_name}|${row.sub_stage_name}|${row.phase}`;
      localeMap.set(key, String(row.display_name_ko || ""));
    }
  }

  return {
    progressionRows: sorted,
    stageByDifficulty,
    localeMap,
    maxDifficultyIndex: sorted[sorted.length - 1].difficulty_index,
  };
}

export function getStage(context, difficultyIndex) {
  const normalized = clamp(
    toNonNegativeInt(difficultyIndex, 1),
    1,
    context.maxDifficultyIndex,
  );
  const stage = context.stageByDifficulty.get(normalized);
  if (!stage) {
    throw new Error(`missing stage row for difficulty_index=${normalized}`);
  }
  return stage;
}

export function getStageDisplayNameKo(context, stage) {
  const mapped = context.localeMap.get(localeKey(stage));
  if (mapped && mapped.trim()) {
    return mapped.trim();
  }
  return stageFallbackLabel(stage);
}

export function resolveLoopTuningFromBattleSpeed(battleSpeed) {
  const speed = clamp(toNonNegativeInt(battleSpeed, 2), 1, 3);
  if (speed === 1) {
    return {
      battleSpeed: speed,
      labelKo: "저속",
      battleEverySec: 3,
      breakthroughEverySec: 4,
      passiveQiRatio: 0.01,
    };
  }
  if (speed === 3) {
    return {
      battleSpeed: speed,
      labelKo: "고속",
      battleEverySec: 1,
      breakthroughEverySec: 2,
      passiveQiRatio: 0.014,
    };
  }
  return {
    battleSpeed: speed,
    labelKo: "표준",
    battleEverySec: 2,
    breakthroughEverySec: 3,
    passiveQiRatio: 0.012,
  };
}

export function createInitialSliceState(context, options = {}) {
  const firstStage = getStage(context, options.startDifficultyIndex ?? 1);
  const speedTuning = resolveLoopTuningFromBattleSpeed(options.battleSpeed);
  const initialQi = Math.floor(firstStage.qi_required * 0.92);
  const initialSpiritCoin = 120;
  const initialRebirthEssence = 0;
  return {
    version: 1,
    playerName: options.playerName || "도심",
    progression: {
      difficultyIndex: firstStage.difficulty_index,
      rebirthCount: 0,
    },
    currencies: {
      qi: initialQi,
      spiritCoin: initialSpiritCoin,
      rebirthEssence: initialRebirthEssence,
    },
    inventory: {
      breakthroughElixir: 3,
      tribulationTalisman: 2,
    },
    settings: {
      autoBattle: true,
      autoBreakthrough: false,
      autoTribulation: false,
      autoResumeRealtime: pickBoolean(options.autoResumeRealtime, false),
      battleSpeed: speedTuning.battleSpeed,
      offlineCapHours: clamp(toNonNegativeInt(options.offlineCapHours, 12), 1, 168),
      offlineEventLimit: clamp(toNonNegativeInt(options.offlineEventLimit, 24), 5, 120),
    },
    logs: [],
    lastSavedAtIso: "",
    lastActiveEpochMs: toNonNegativeInt(options.nowEpochMs, Date.now()),
    realtimeStats: {
      sessionStartedAtIso: "",
      timelineSec: 0,
      elapsedSec: 0,
      battles: 0,
      breakthroughs: 0,
      rebirths: 0,
      anchorQi: initialQi,
      anchorSpiritCoin: initialSpiritCoin,
      anchorRebirthEssence: initialRebirthEssence,
    },
  };
}

export function previewBreakthroughChance(context, state, options = {}) {
  const stage = getStage(context, state.progression.difficultyIndex);
  const useBreakthroughElixir =
    pickBoolean(options.useBreakthroughElixir, false) &&
    state.inventory.breakthroughElixir > 0;
  const useTribulationTalisman =
    pickBoolean(options.useTribulationTalisman, false) &&
    state.inventory.tribulationTalisman > 0;

  const rebirthBonus = clamp(state.progression.rebirthCount * 0.9, 0, 20);
  const potionBonus = useBreakthroughElixir ? 12 : 0;
  const successPct = clamp(
    stage.base_breakthrough_success_pct + rebirthBonus + potionBonus,
    5,
    97,
  );

  const baseDeath = stage.is_tribulation === 1 ? stage.base_death_pct : 0;
  const rebirthGuard = clamp(state.progression.rebirthCount * 0.7, 0, 35);
  const talismanGuard = useTribulationTalisman ? 9 : 0;
  const deathPct = clamp(baseDeath - rebirthGuard - talismanGuard, 0, 95);

  return {
    stage,
    successPct,
    deathPct,
    rebirthBonus,
    potionBonus,
    rebirthGuard,
    talismanGuard,
    useBreakthroughElixir,
    useTribulationTalisman,
  };
}

export function runBattleOnce(context, state, rng, options = {}) {
  const suppressLogs = pickBoolean(options.suppressLogs, false);
  const eventCollector =
    typeof options.eventCollector === "function" ? options.eventCollector : null;
  const stage = getStage(context, state.progression.difficultyIndex);
  const worldPenalty = stage.world === "mortal" ? 0 : stage.world === "immortal" ? 0.08 : 0.16;
  const rebirthBonus = state.progression.rebirthCount * 0.008;
  const winChance = clamp(0.78 - stage.difficulty_index * 0.0018 - worldPenalty + rebirthBonus, 0.1, 0.95);
  const win = rng.next() < winChance;

  if (win) {
    const qiGain = Math.max(
      1,
      Math.round(stage.qi_required * (0.14 + rng.next() * 0.06)),
    );
    const spiritGain = Math.max(1, Math.round(10 + stage.difficulty_index * 1.35));
    const essenceGain =
      stage.is_tribulation === 1 && rng.next() < 0.32
        ? Math.max(1, Math.round(1 + stage.difficulty_index * 0.015))
        : 0;
    state.currencies.qi += qiGain;
    state.currencies.spiritCoin += spiritGain;
    state.currencies.rebirthEssence += essenceGain;
    if (!suppressLogs) {
      addLog(
        state,
        "battle",
        `전투 승리: 기 +${qiGain}, 영석 +${spiritGain}${
          essenceGain > 0 ? `, 환생정수 +${essenceGain}` : ""
        }`,
      );
    }
    if (eventCollector) {
      eventCollector({
        kind: "battle_win",
        difficultyIndex: stage.difficulty_index,
        qiDelta: qiGain,
        spiritCoinDelta: spiritGain,
        rebirthEssenceDelta: essenceGain,
      });
    }
    return { won: true, qiDelta: qiGain, spiritCoinDelta: spiritGain, rebirthEssenceDelta: essenceGain };
  }

  const qiLoss = Math.max(1, Math.round(stage.qi_required * 0.035));
  state.currencies.qi = Math.max(0, state.currencies.qi - qiLoss);
  if (!suppressLogs) {
    addLog(state, "battle", `전투 패배: 기 -${qiLoss}`);
  }
  if (eventCollector) {
    eventCollector({
      kind: "battle_loss",
      difficultyIndex: stage.difficulty_index,
      qiDelta: -qiLoss,
      spiritCoinDelta: 0,
      rebirthEssenceDelta: 0,
    });
  }
  return { won: false, qiDelta: -qiLoss, spiritCoinDelta: 0, rebirthEssenceDelta: 0 };
}

export function runBreakthroughAttempt(context, state, rng, options = {}) {
  const suppressLogs = pickBoolean(options.suppressLogs, false);
  const eventCollector =
    typeof options.eventCollector === "function" ? options.eventCollector : null;
  const stage = getStage(context, state.progression.difficultyIndex);
  const respectAutoTribulation = pickBoolean(options.respectAutoTribulation, false);
  if (respectAutoTribulation && stage.is_tribulation === 1 && !state.settings.autoTribulation) {
    return {
      attempted: false,
      outcome: "blocked_tribulation_setting",
      stage,
      message: "도겁 자동 설정이 꺼져 있어 자동 돌파를 건너뜀",
    };
  }
  if (state.currencies.qi < stage.qi_required) {
    return {
      attempted: false,
      outcome: "blocked_no_qi",
      stage,
      message: `돌파 실패: 필요 기(${stage.qi_required})가 부족`,
    };
  }

  const preview = previewBreakthroughChance(context, state, options);
  if (preview.useBreakthroughElixir) {
    state.inventory.breakthroughElixir = Math.max(0, state.inventory.breakthroughElixir - 1);
  }
  if (preview.useTribulationTalisman && stage.is_tribulation === 1) {
    state.inventory.tribulationTalisman = Math.max(0, state.inventory.tribulationTalisman - 1);
  }

  const outcome = evaluateBreakthroughOutcome(
    stage,
    preview.successPct,
    preview.deathPct,
    rng,
    options.debugForcedOutcome,
  );

  if (outcome === "success") {
    const prev = state.progression.difficultyIndex;
    state.progression.difficultyIndex = clamp(
      prev + 1,
      1,
      context.maxDifficultyIndex,
    );
    const qiConsume = Math.round(stage.qi_required * 0.85);
    state.currencies.qi = Math.max(0, state.currencies.qi - qiConsume);
    const nextStage = getStage(context, state.progression.difficultyIndex);
    const label = getStageDisplayNameKo(context, nextStage);
    if (!suppressLogs) {
      addLog(
        state,
        "breakthrough",
        `돌파 성공: ${label} 진입 (성공률 ${preview.successPct.toFixed(1)}%)`,
      );
    }
    if (eventCollector) {
      eventCollector({
        kind: "breakthrough_success",
        fromDifficultyIndex: stage.difficulty_index,
        toDifficultyIndex: nextStage.difficulty_index,
        successPct: preview.successPct,
      });
    }
    return {
      attempted: true,
      outcome,
      stage,
      nextStage,
      successPct: preview.successPct,
      deathPct: preview.deathPct,
      message: `돌파 성공 → ${label}`,
    };
  }

  if (outcome === "minor_fail") {
    const qiLoss = Math.max(1, Math.round(stage.qi_required * 0.22));
    state.currencies.qi = Math.max(0, state.currencies.qi - qiLoss);
    if (!suppressLogs) {
      addLog(
        state,
        "breakthrough",
        `돌파 실패(경상): 기 -${qiLoss} (성공률 ${preview.successPct.toFixed(1)}%)`,
      );
    }
    if (eventCollector) {
      eventCollector({
        kind: "breakthrough_minor_fail",
        difficultyIndex: stage.difficulty_index,
        qiDelta: -qiLoss,
        successPct: preview.successPct,
      });
    }
    return {
      attempted: true,
      outcome,
      stage,
      successPct: preview.successPct,
      deathPct: preview.deathPct,
      message: `경상 실패: 기 -${qiLoss}`,
    };
  }

  if (outcome === "retreat_fail") {
    const retreat = pickRetreatLayers(stage, rng);
    const prev = state.progression.difficultyIndex;
    state.progression.difficultyIndex = clamp(prev - retreat, 1, context.maxDifficultyIndex);
    const qiLoss = Math.max(1, Math.round(stage.qi_required * 0.28));
    state.currencies.qi = Math.max(0, state.currencies.qi - qiLoss);
    const nextStage = getStage(context, state.progression.difficultyIndex);
    const label = getStageDisplayNameKo(context, nextStage);
    if (!suppressLogs) {
      addLog(
        state,
        "breakthrough",
        `돌파 실패(경지 후퇴): ${retreat}단계 하락 → ${label}`,
      );
    }
    if (eventCollector) {
      eventCollector({
        kind: "breakthrough_retreat_fail",
        fromDifficultyIndex: stage.difficulty_index,
        toDifficultyIndex: nextStage.difficulty_index,
        retreatLayers: retreat,
      });
    }
    return {
      attempted: true,
      outcome,
      stage,
      nextStage,
      retreatLayers: retreat,
      successPct: preview.successPct,
      deathPct: preview.deathPct,
      message: `후퇴 실패: ${retreat}단계 하락`,
    };
  }

  const rebirth = applyRebirthByDeath(context, state, stage, {
    suppressLogs,
  });
  if (eventCollector) {
    eventCollector({
      kind: "breakthrough_death_fail",
      difficultyIndex: stage.difficulty_index,
      rebirthReward: rebirth.reward,
    });
  }
  return {
    attempted: true,
    outcome: "death_fail",
    stage,
    successPct: preview.successPct,
    deathPct: preview.deathPct,
    rebirthReward: rebirth.reward,
    message: `사망 실패: 환생 발동, 환생정수 +${rebirth.reward}`,
  };
}

export function runAutoSliceSeconds(context, state, rng, options = {}) {
  const seconds = Math.max(1, toNonNegativeInt(options.seconds, 10));
  const battleEverySec = Math.max(1, toNonNegativeInt(options.battleEverySec, 2));
  const breakthroughEverySec = Math.max(1, toNonNegativeInt(options.breakthroughEverySec, 3));
  const passiveQiRatio = clamp(Number(options.passiveQiRatio) || 0.012, 0.001, 0.2);
  const timelineOffsetSec = Math.max(0, toNonNegativeInt(options.timelineOffsetSec, 0));
  const suppressLogs = pickBoolean(options.suppressLogs, false);
  const collectEvents = pickBoolean(options.collectEvents, false);
  const maxCollectedEvents = clamp(
    toNonNegativeInt(options.maxCollectedEvents, 20),
    0,
    120,
  );

  const summary = {
    seconds,
    passiveQiGain: 0,
    battles: 0,
    battleWins: 0,
    breakthroughs: 0,
    rebirths: 0,
  };
  const collectedEvents = [];

  for (let sec = 1; sec <= seconds; sec += 1) {
    const timelineSec = timelineOffsetSec + sec;
    const stage = getStage(context, state.progression.difficultyIndex);
    const passive = Math.max(1, Math.round(stage.qi_required * passiveQiRatio));
    state.currencies.qi += passive;
    summary.passiveQiGain += passive;

    if (state.settings.autoBattle && timelineSec % battleEverySec === 0) {
      const battle = runBattleOnce(context, state, rng, {
        suppressLogs,
        eventCollector: collectEvents
          ? (event) => {
              pushLimited(
                collectedEvents,
                {
                  sec: timelineSec,
                  ...event,
                },
                maxCollectedEvents,
              );
            }
          : undefined,
      });
      summary.battles += 1;
      if (battle.won) summary.battleWins += 1;
    }

    if (state.settings.autoBreakthrough && timelineSec % breakthroughEverySec === 0) {
      const breakthrough = runBreakthroughAttempt(context, state, rng, {
        respectAutoTribulation: true,
        useBreakthroughElixir: true,
        useTribulationTalisman: true,
        suppressLogs,
        eventCollector: collectEvents
          ? (event) => {
              pushLimited(
                collectedEvents,
                {
                  sec: timelineSec,
                  ...event,
                },
                maxCollectedEvents,
              );
            }
          : undefined,
      });
      if (breakthrough.attempted) {
        summary.breakthroughs += 1;
        if (breakthrough.outcome === "death_fail") {
          summary.rebirths += 1;
        }
      }
    }
  }

  if (!suppressLogs) {
    addLog(
      state,
      "auto",
      `자동 ${seconds}초 진행 완료 (전투 ${summary.battles}회, 돌파 ${summary.breakthroughs}회, 환생 ${summary.rebirths}회)`,
    );
  }
  return {
    ...summary,
    collectedEvents,
  };
}

export function runOfflineCatchup(context, state, rng, options = {}) {
  const nowEpochMs = toNonNegativeInt(options.nowEpochMs, Date.now());
  const savedAtEpochMs = parseIsoEpochMs(state.lastSavedAtIso);
  const defaultAnchorEpochMs = Math.max(
    toNonNegativeInt(state.lastActiveEpochMs, 0),
    savedAtEpochMs,
  );
  const anchorEpochMs = toNonNegativeInt(options.anchorEpochMs, defaultAnchorEpochMs);
  const rawOfflineSec = Math.max(0, Math.floor((nowEpochMs - anchorEpochMs) / 1000));
  const maxOfflineHours = clamp(Number(options.maxOfflineHours) || 12, 0, 168);
  const maxOfflineSec = Math.floor(maxOfflineHours * 3600);
  const appliedOfflineSec = Math.min(rawOfflineSec, maxOfflineSec);
  const cappedByMaxOffline = rawOfflineSec > appliedOfflineSec;
  const syncAnchorToNow = pickBoolean(options.syncAnchorToNow, true);

  let autoSummary = null;
  let skipReason = "none";
  if (rawOfflineSec <= 0) {
    skipReason = "time_not_elapsed";
  } else if (appliedOfflineSec <= 0) {
    skipReason = "applied_duration_zero";
  } else {
    autoSummary = runAutoSliceSeconds(context, state, rng, {
      seconds: appliedOfflineSec,
      battleEverySec: Math.max(1, toNonNegativeInt(options.battleEverySec, 2)),
      breakthroughEverySec: Math.max(
        1,
        toNonNegativeInt(options.breakthroughEverySec, 3),
      ),
      passiveQiRatio: clamp(Number(options.passiveQiRatio) || 0.012, 0.001, 0.2),
      suppressLogs: true,
      collectEvents: true,
      maxCollectedEvents: clamp(
        toNonNegativeInt(options.maxCollectedEvents, 24),
        0,
        120,
      ),
    });
    addLog(
      state,
      "offline",
      `오프라인 복귀 정산: ${appliedOfflineSec}초 적용 (raw ${rawOfflineSec}초${cappedByMaxOffline ? `, cap ${maxOfflineSec}초` : ""})`,
    );
  }

  if (syncAnchorToNow) {
    state.lastActiveEpochMs = nowEpochMs;
  }

  return {
    summary: {
      nowEpochMs,
      anchorEpochMs,
      rawOfflineSec,
      maxOfflineSec,
      appliedOfflineSec,
      cappedByMaxOffline,
      skipReason,
      autoSummary,
    },
  };
}

export function serializeSliceState(state) {
  return `${JSON.stringify(state, null, 2)}\n`;
}

export function parseSliceState(raw, context) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error("저장 데이터 JSON 파싱 실패");
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("저장 데이터 형식이 올바르지 않음");
  }

  const parsedLastSavedAtIso =
    typeof parsed.lastSavedAtIso === "string" ? parsed.lastSavedAtIso : "";
  const parsedLastSavedAtEpochMs = parseIsoEpochMs(parsedLastSavedAtIso);
  const fallbackLastActiveEpochMs =
    parsedLastSavedAtEpochMs > 0 ? parsedLastSavedAtEpochMs : Date.now();

  const stage = getStage(context, toNonNegativeInt(parsed.progression?.difficultyIndex, 1));
  const parsedQi = toNonNegativeInt(
    parsed.currencies?.qi,
    Math.floor(stage.qi_required * 0.92),
  );
  const parsedSpiritCoin = toNonNegativeInt(parsed.currencies?.spiritCoin, 0);
  const parsedRebirthEssence = toNonNegativeInt(parsed.currencies?.rebirthEssence, 0);
  const state = {
    version: 1,
    playerName:
      typeof parsed.playerName === "string" && parsed.playerName.trim()
        ? parsed.playerName.trim()
        : "도심",
    progression: {
      difficultyIndex: stage.difficulty_index,
      rebirthCount: toNonNegativeInt(parsed.progression?.rebirthCount, 0),
    },
    currencies: {
      qi: parsedQi,
      spiritCoin: parsedSpiritCoin,
      rebirthEssence: parsedRebirthEssence,
    },
    inventory: {
      breakthroughElixir: toNonNegativeInt(parsed.inventory?.breakthroughElixir, 0),
      tribulationTalisman: toNonNegativeInt(parsed.inventory?.tribulationTalisman, 0),
    },
    settings: {
      autoBattle: pickBoolean(parsed.settings?.autoBattle, true),
      autoBreakthrough: pickBoolean(parsed.settings?.autoBreakthrough, false),
      autoTribulation: pickBoolean(parsed.settings?.autoTribulation, false),
      autoResumeRealtime: pickBoolean(parsed.settings?.autoResumeRealtime, false),
      battleSpeed: clamp(toNonNegativeInt(parsed.settings?.battleSpeed, 2), 1, 3),
      offlineCapHours: clamp(
        toNonNegativeInt(parsed.settings?.offlineCapHours, 12),
        1,
        168,
      ),
      offlineEventLimit: clamp(
        toNonNegativeInt(parsed.settings?.offlineEventLimit, 24),
        5,
        120,
      ),
    },
    logs: Array.isArray(parsed.logs)
      ? parsed.logs
          .slice(0, MAX_LOG_ENTRIES)
          .map((row) => ({
            at:
              typeof row?.at === "string" && row.at
                ? row.at
                : new Date().toISOString(),
            kind:
              typeof row?.kind === "string" && row.kind ? row.kind : "info",
            message:
              typeof row?.message === "string" && row.message
                ? row.message
                : "",
          }))
          .filter((row) => row.message)
      : [],
    lastSavedAtIso: parsedLastSavedAtIso,
    lastActiveEpochMs: toNonNegativeInt(
      parsed.lastActiveEpochMs,
      fallbackLastActiveEpochMs,
    ),
    realtimeStats: {
      sessionStartedAtIso:
        typeof parsed.realtimeStats?.sessionStartedAtIso === "string"
          ? parsed.realtimeStats.sessionStartedAtIso
          : "",
      timelineSec: toNonNegativeInt(parsed.realtimeStats?.timelineSec, 0),
      elapsedSec: toNonNegativeInt(parsed.realtimeStats?.elapsedSec, 0),
      battles: toNonNegativeInt(parsed.realtimeStats?.battles, 0),
      breakthroughs: toNonNegativeInt(parsed.realtimeStats?.breakthroughs, 0),
      rebirths: toNonNegativeInt(parsed.realtimeStats?.rebirths, 0),
      anchorQi: toNonNegativeInt(parsed.realtimeStats?.anchorQi, parsedQi),
      anchorSpiritCoin: toNonNegativeInt(
        parsed.realtimeStats?.anchorSpiritCoin,
        parsedSpiritCoin,
      ),
      anchorRebirthEssence: toNonNegativeInt(
        parsed.realtimeStats?.anchorRebirthEssence,
        parsedRebirthEssence,
      ),
    },
  };
  return state;
}

export function cloneSliceState(state) {
  return JSON.parse(JSON.stringify(state));
}
