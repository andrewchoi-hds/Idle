import {
  MOBILE_MVP_STORAGE_KEY,
  MOBILE_MVP_SLOT_LOCKS_KEY,
  MOBILE_MVP_SLOT_PREFS_KEY,
  buildSliceContext,
  buildStorageKeyForSlot,
  cloneSliceState,
  createInitialSliceState,
  createSeededRng,
  buildOfflineDetailCompareCode,
  buildOfflineDetailCompareCodeMatchSummaryLabelKo,
  buildOfflineDetailCompareCodeMatchSummaryTone,
  buildOfflineDetailCompareCodeDeltaSummaryLabelKo,
  buildOfflineDetailCompareCodeDeltaSummaryTone,
  buildOfflineDetailCompareCodeCurrentSummaryLabelKo,
  buildOfflineDetailCompareCodeCurrentSummaryTone,
  buildOfflineDetailCompareResultLabelKo,
  buildOfflineDetailCompareInvalidTargetLabelKo,
  isOfflineDetailCompareResultError,
  buildOfflineDetailCompareResultStateLabelKo,
  buildOfflineDetailCompareResultStateTone,
  buildOfflineDetailCompareActionHintLabelKo,
  buildOfflineDetailCompareActionHintTone,
  resolveOfflineDetailCompareViewModeAlignmentTarget,
  buildOfflineDetailCompareCodeSourceLabelKo,
  buildOfflineDetailCompareCodeSourceTone,
  buildOfflineDetailCompareStatusLabelKo,
  resolveOfflineDetailCompareClipboardFailureInfo,
  resolveOfflineDetailComparePayloadFailureInfo,
  resolveOfflineDetailComparePayloadLoadSource,
  resolveOfflineDetailCompareInputSource,
  resolveOfflineDetailCompareTargetInputState,
  resolveOfflineDetailCompareTargetInputStateStatusMessageKo,
  resolveOfflineDetailCompareCheckSource,
  buildOfflineDetailCompareCodeTargetSummaryLabelKo,
  buildOfflineDetailCompareCodeTargetSummaryTone,
  buildOfflineDetailCriticalSummaryLabelKo,
  buildOfflineDetailReportSnapshot,
  buildOfflineDetailHiddenKindsSummaryLabelKo,
  buildOfflineDetailHiddenSummaryLabelKo,
  buildOfflineDetailFilterSummaryLabelKo,
  extractOfflineDetailCompareCode,
  extractOfflineDetailCompareCodeFromPayloadTextWithSource,
  getStage,
  getStageDisplayNameKo,
  isCopyTargetSlotDisabled,
  isOfflineDetailCompareCode,
  normalizeAutoBreakthroughResumeWarmupSec,
  normalizeSaveSlot,
  normalizeSlotSummaryState,
  parseSliceState,
  buildOfflineWarmupTelemetryLabelKo,
  filterOfflineDetailEventsByMode,
  prioritizeOfflineDetailEvents,
  resolveAutoBreakthroughWarmupRemainingSec,
  resolveAutoBreakthroughResumeConfirmPolicy,
  resolveAutoBreakthroughResumeRecommendationPlan,
  resolveOfflineWarmupTelemetry,
  previewBreakthroughChance,
  resolveAutoBreakthroughResumePolicy,
  resolveBreakthroughManualAttemptPolicy,
  resolveBreakthroughExpectedDelta,
  resolveBreakthroughMitigationSummary,
  resolveBreakthroughRecommendation,
  resolveBreakthroughRecommendationToggles,
  resolveBreakthroughRiskTier,
  resolveDebouncedAction,
  resolveSlotCopyHint,
  resolveSlotCopyHintTone,
  resolveSlotDeleteHint,
  resolveSlotDeleteHintTone,
  resolveSlotCopyPolicy,
  resolveSlotDeletePolicy,
  resolveSlotSummaryStateLabelKo,
  resolveSlotSummaryStateShortKo,
  resolveSlotSummaryStateTone,
  resolveSlotSummaryQuickAction,
  resolveLoopTuningFromBattleSpeed,
  runAutoSliceSeconds,
  runBattleOnce,
  runBreakthroughAttempt,
  runOfflineCatchup,
  serializeSliceState,
} from "./engine.mjs";

const dom = {
  appRoot: document.querySelector("main.app"),
  appStatus: document.getElementById("appStatus"),
  btnToggleBattleFocus: document.getElementById("btnToggleBattleFocus"),
  btnToggleBattleSfx: document.getElementById("btnToggleBattleSfx"),
  btnToggleBattleHaptic: document.getElementById("btnToggleBattleHaptic"),
  focusControlsPanel: document.getElementById("focusControlsPanel"),
  battleFocusHint: document.getElementById("battleFocusHint"),
  battleSfxHint: document.getElementById("battleSfxHint"),
  battleHapticHint: document.getElementById("battleHapticHint"),
  settingsPanel: document.getElementById("settingsPanel"),
  stagePanel: document.getElementById("stagePanel"),
  stageDisplay: document.getElementById("stageDisplay"),
  worldTag: document.getElementById("worldTag"),
  difficultyIndex: document.getElementById("difficultyIndex"),
  qiRequired: document.getElementById("qiRequired"),
  qiProgressBar: document.getElementById("qiProgressBar"),
  battleScenePanel: document.getElementById("battleScenePanel"),
  battleSceneStatus: document.getElementById("battleSceneStatus"),
  battleSceneArena: document.getElementById("battleSceneArena"),
  battleScenePlayer: document.getElementById("battleScenePlayer"),
  battleSceneEnemy: document.getElementById("battleSceneEnemy"),
  battleScenePlayerStage: document.getElementById("battleScenePlayerStage"),
  battleSceneEnemyStage: document.getElementById("battleSceneEnemyStage"),
  battleScenePlayerHpBar: document.getElementById("battleScenePlayerHpBar"),
  battleScenePlayerCastBar: document.getElementById("battleScenePlayerCastBar"),
  battleScenePlayerVitals: document.getElementById("battleScenePlayerVitals"),
  battleSceneEnemyHpBar: document.getElementById("battleSceneEnemyHpBar"),
  battleSceneEnemyCastBar: document.getElementById("battleSceneEnemyCastBar"),
  battleSceneEnemyVitals: document.getElementById("battleSceneEnemyVitals"),
  battleSceneClashCore: document.getElementById("battleSceneClashCore"),
  battleSceneRoundBadge: document.getElementById("battleSceneRoundBadge"),
  battleSceneComboBadge: document.getElementById("battleSceneComboBadge"),
  battleSceneDpsBadge: document.getElementById("battleSceneDpsBadge"),
  battleSceneSkillBanner: document.getElementById("battleSceneSkillBanner"),
  battleSceneComboBanner: document.getElementById("battleSceneComboBanner"),
  battleSceneFlash: document.getElementById("battleSceneFlash"),
  battleSceneFloatLayer: document.getElementById("battleSceneFloatLayer"),
  battleSceneShockwaveLayer: document.getElementById("battleSceneShockwaveLayer"),
  battleSceneSparkLayer: document.getElementById("battleSceneSparkLayer"),
  battleSceneTrailLayer: document.getElementById("battleSceneTrailLayer"),
  battleSceneResult: document.getElementById("battleSceneResult"),
  battleSceneTicker: document.getElementById("battleSceneTicker"),
  statsPanel: document.getElementById("statsPanel"),
  savePanel: document.getElementById("savePanel"),
  statQi: document.getElementById("statQi"),
  statSpiritCoin: document.getElementById("statSpiritCoin"),
  statRebirthEssence: document.getElementById("statRebirthEssence"),
  statRebirthCount: document.getElementById("statRebirthCount"),
  invBreakthroughElixir: document.getElementById("invBreakthroughElixir"),
  invTribulationTalisman: document.getElementById("invTribulationTalisman"),
  previewSuccessPct: document.getElementById("previewSuccessPct"),
  previewDeathPct: document.getElementById("previewDeathPct"),
  previewMinorFailPct: document.getElementById("previewMinorFailPct"),
  previewRetreatFailPct: document.getElementById("previewRetreatFailPct"),
  previewRiskLabel: document.getElementById("previewRiskLabel"),
  previewDeathInFailPct: document.getElementById("previewDeathInFailPct"),
  previewExpectedLabel: document.getElementById("previewExpectedLabel"),
  previewExpectedQiDelta: document.getElementById("previewExpectedQiDelta"),
  previewExpectedEssenceDelta: document.getElementById("previewExpectedEssenceDelta"),
  previewExpectedDifficultyDelta: document.getElementById("previewExpectedDifficultyDelta"),
  previewMitigationLabel: document.getElementById("previewMitigationLabel"),
  previewMitigationHint: document.getElementById("previewMitigationHint"),
  previewRecommendationLabel: document.getElementById("previewRecommendationLabel"),
  previewRecommendationHint: document.getElementById("previewRecommendationHint"),
  btnApplyRecommendation: document.getElementById("btnApplyRecommendation"),
  autoBreakthroughResumeLabel: document.getElementById("autoBreakthroughResumeLabel"),
  autoBreakthroughResumeHint: document.getElementById("autoBreakthroughResumeHint"),
  btnResumeAutoBreakthrough: document.getElementById("btnResumeAutoBreakthrough"),
  optAutoBattle: document.getElementById("optAutoBattle"),
  optAutoBreakthrough: document.getElementById("optAutoBreakthrough"),
  optAutoTribulation: document.getElementById("optAutoTribulation"),
  optAutoResumeRealtime: document.getElementById("optAutoResumeRealtime"),
  optLowPerformanceBattleScene: document.getElementById("optLowPerformanceBattleScene"),
  optAutoBreakthroughResumeWarmupSec: document.getElementById("optAutoBreakthroughResumeWarmupSec"),
  optBattleSpeed: document.getElementById("optBattleSpeed"),
  optOfflineCapHours: document.getElementById("optOfflineCapHours"),
  optOfflineEventLimit: document.getElementById("optOfflineEventLimit"),
  breakthroughPreviewPanel: document.getElementById("breakthroughPreviewPanel"),
  useBreakthroughElixir: document.getElementById("useBreakthroughElixir"),
  useTribulationTalisman: document.getElementById("useTribulationTalisman"),
  playerNameInput: document.getElementById("playerNameInput"),
  optSaveSlot: document.getElementById("optSaveSlot"),
  optCopySlotTarget: document.getElementById("optCopySlotTarget"),
  slotActionHintBox: document.getElementById("slotActionHintBox"),
  slotLockHint: document.getElementById("slotLockHint"),
  slotTargetHint: document.getElementById("slotTargetHint"),
  slotCopyHint: document.getElementById("slotCopyHint"),
  slotDeleteHint: document.getElementById("slotDeleteHint"),
  lastSavedAt: document.getElementById("lastSavedAt"),
  lastActiveAt: document.getElementById("lastActiveAt"),
  savePayload: document.getElementById("savePayload"),
  offlineModal: document.getElementById("offlineModal"),
  offlineAppliedDuration: document.getElementById("offlineAppliedDuration"),
  offlineRawDuration: document.getElementById("offlineRawDuration"),
  offlineWarmupSummary: document.getElementById("offlineWarmupSummary"),
  offlineCriticalSummary: document.getElementById("offlineCriticalSummary"),
  offlineDetailCompareCode: document.getElementById("offlineDetailCompareCode"),
  offlineCompareCodeInput: document.getElementById("offlineCompareCodeInput"),
  offlineCompareCodeResult: document.getElementById("offlineCompareCodeResult"),
  offlineCompareCodeActionHint: document.getElementById("offlineCompareCodeActionHint"),
  offlineCompareCodeSource: document.getElementById("offlineCompareCodeSource"),
  offlineCompareCodeCurrentSummary: document.getElementById("offlineCompareCodeCurrentSummary"),
  offlineCompareCodeTargetSummary: document.getElementById("offlineCompareCodeTargetSummary"),
  offlineCompareCodeDeltaSummary: document.getElementById("offlineCompareCodeDeltaSummary"),
  offlineCompareCodeMatchSummary: document.getElementById("offlineCompareCodeMatchSummary"),
  offlineDetailFilterSummary: document.getElementById("offlineDetailFilterSummary"),
  offlineDetailHiddenSummary: document.getElementById("offlineDetailHiddenSummary"),
  offlineDetailHiddenKindsSummary: document.getElementById("offlineDetailHiddenKindsSummary"),
  offlineCapState: document.getElementById("offlineCapState"),
  offlineCompareRow: document.getElementById("offlineCompareRow"),
  offlineBattleCount: document.getElementById("offlineBattleCount"),
  offlineBreakthroughCount: document.getElementById("offlineBreakthroughCount"),
  offlineRebirthCount: document.getElementById("offlineRebirthCount"),
  offlineQiDelta: document.getElementById("offlineQiDelta"),
  offlineSpiritDelta: document.getElementById("offlineSpiritDelta"),
  offlineEssenceDelta: document.getElementById("offlineEssenceDelta"),
  btnToggleOfflineDetail: document.getElementById("btnToggleOfflineDetail"),
  btnToggleOfflineCriticalOnly: document.getElementById("btnToggleOfflineCriticalOnly"),
  btnCompareOfflineCode: document.getElementById("btnCompareOfflineCode"),
  btnApplyOfflineCompareViewMode: document.getElementById("btnApplyOfflineCompareViewMode"),
  btnPasteOfflineCompareCode: document.getElementById("btnPasteOfflineCompareCode"),
  btnLoadOfflineCompareCodeFromPayload: document.getElementById("btnLoadOfflineCompareCodeFromPayload"),
  btnCopyOfflineCompareCode: document.getElementById("btnCopyOfflineCompareCode"),
  btnExportOfflineReport: document.getElementById("btnExportOfflineReport"),
  offlineDetailList: document.getElementById("offlineDetailList"),
  btnCloseOfflineModal: document.getElementById("btnCloseOfflineModal"),
  btnBattle: document.getElementById("btnBattle"),
  btnBreakthrough: document.getElementById("btnBreakthrough"),
  btnAuto10s: document.getElementById("btnAuto10s"),
  btnRealtimeAuto: document.getElementById("btnRealtimeAuto"),
  btnResetRun: document.getElementById("btnResetRun"),
  actionsPanel: document.getElementById("actionsPanel"),
  realtimeAutoStatus: document.getElementById("realtimeAutoStatus"),
  realtimeElapsed: document.getElementById("realtimeElapsed"),
  realtimeBattles: document.getElementById("realtimeBattles"),
  realtimeBreakthroughs: document.getElementById("realtimeBreakthroughs"),
  realtimeRebirths: document.getElementById("realtimeRebirths"),
  btnExportRealtimeReport: document.getElementById("btnExportRealtimeReport"),
  btnResetRealtimeStats: document.getElementById("btnResetRealtimeStats"),
  btnSaveLocal: document.getElementById("btnSaveLocal"),
  btnLoadLocal: document.getElementById("btnLoadLocal"),
  btnExportState: document.getElementById("btnExportState"),
  btnImportState: document.getElementById("btnImportState"),
  btnCopySlot: document.getElementById("btnCopySlot"),
  btnToggleSlotLock: document.getElementById("btnToggleSlotLock"),
  btnDeleteSlot: document.getElementById("btnDeleteSlot"),
  saveSlotSummaryList: document.getElementById("saveSlotSummaryList"),
  logsPanel: document.getElementById("logsPanel"),
  eventLogList: document.getElementById("eventLogList"),
};

function createDefaultSlotLockMap() {
  return {
    1: false,
    2: false,
    3: false,
  };
}

function createEmptyPolicyBlockReasonSummary() {
  return {
    extremeRisk: 0,
    highRisk: 0,
    highQiCost: 0,
  };
}

function accumulatePolicyBlockReasonSummary(target, source) {
  if (!target || typeof target !== "object") return;
  if (!source || typeof source !== "object") return;
  target.extremeRisk += Math.max(0, Number(source.extremeRisk) || 0);
  target.highRisk += Math.max(0, Number(source.highRisk) || 0);
  target.highQiCost += Math.max(0, Number(source.highQiCost) || 0);
}

function formatPolicyBlockReasonSummary(summary) {
  if (!summary || typeof summary !== "object") {
    return "";
  }
  const parts = [];
  if ((Number(summary.extremeRisk) || 0) > 0) {
    parts.push(`치명 ${Math.floor(summary.extremeRisk)}회`);
  }
  if ((Number(summary.highRisk) || 0) > 0) {
    parts.push(`고위험 ${Math.floor(summary.highRisk)}회`);
  }
  if ((Number(summary.highQiCost) || 0) > 0) {
    parts.push(`고기소모 ${Math.floor(summary.highQiCost)}회`);
  }
  return parts.join(", ");
}

function resolveAutoBreakthroughBlockCounts(summaryInput) {
  const summary =
    summaryInput && typeof summaryInput === "object"
      ? summaryInput
      : {};
  const policyBlocks = Math.max(0, Number(summary.breakthroughPolicyBlocks) || 0);
  const noQiBlocks = Math.max(0, Number(summary.breakthroughNoQiBlocks) || 0);
  const tribulationSettingBlocks = Math.max(
    0,
    Number(summary.breakthroughTribulationSettingBlocks) || 0,
  );
  return {
    policyBlocks,
    noQiBlocks,
    tribulationSettingBlocks,
    totalBlocks: policyBlocks + noQiBlocks + tribulationSettingBlocks,
  };
}

function buildAutoBreakthroughBlockSummaryLabelKo(summaryInput) {
  const counts = resolveAutoBreakthroughBlockCounts(summaryInput);
  const summary =
    summaryInput && typeof summaryInput === "object"
      ? summaryInput
      : {};
  const policyReasonText = formatPolicyBlockReasonSummary(
    summary.breakthroughPolicyBlockReasons,
  );
  const parts = [];
  if (counts.policyBlocks > 0) {
    parts.push(
      `위험 차단 ${counts.policyBlocks}회${
        policyReasonText ? `(${policyReasonText})` : ""
      }`,
    );
  }
  if (counts.noQiBlocks > 0) {
    parts.push(`기 부족 차단 ${counts.noQiBlocks}회`);
  }
  if (counts.tribulationSettingBlocks > 0) {
    parts.push(`도겁 설정 차단 ${counts.tribulationSettingBlocks}회`);
  }
  return parts.join(" · ");
}

let context = null;
let state = null;
let rng = createSeededRng(Date.now());
let activeSaveSlot = 1;
let slotLocks = createDefaultSlotLockMap();
let lastOfflineReport = null;
let offlineDetailExpanded = false;
let offlineDetailCriticalOnly = false;
let offlineCompareSource = "none";
let realtimeAutoTimer = null;
let realtimePersistTicks = 0;
let realtimePolicyBlockAccum = 0;
let realtimeNoQiBlockAccum = 0;
let realtimeTribulationSettingBlockAccum = 0;
let realtimePolicyReasonAccum = createEmptyPolicyBlockReasonSummary();
let slotSummaryDirty = true;
let slotSummaryLastRenderedAtMs = 0;
let slotQuickLoadLastAcceptedAtMs = 0;
let savePayloadSource = "empty";
let battleFocusMode = true;
let battleSfxEnabled = false;
let battleSfxContext = null;
let battleSfxMasterGain = null;
let battleSfxLastPlayAtMs = 0;
let battleSfxAmbientLastPlayAtMs = 0;
let battleHapticEnabled = false;
let battleHapticLastPlayAtMs = 0;
const MOBILE_MVP_BATTLE_SFX_PREF_KEY = "idle_xianxia_mobile_mvp_v1_battle_sfx";
const MOBILE_MVP_BATTLE_HAPTIC_PREF_KEY = "idle_xianxia_mobile_mvp_v1_battle_haptic";
const BATTLE_SFX_MIN_INTERVAL_MS = 90;
const BATTLE_SFX_AMBIENT_MIN_INTERVAL_IDLE_MS = 2100;
const BATTLE_SFX_AMBIENT_MIN_INTERVAL_AUTO_MS = 1450;
const BATTLE_SFX_AMBIENT_MIN_INTERVAL_REALTIME_MS = 980;
const BATTLE_HAPTIC_MIN_INTERVAL_MS = 105;
const SLOT_QUICK_LOAD_DEBOUNCE_MS = 700;
const DEFAULT_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC = 6;
const BATTLE_SCENE_TONES = new Set(["info", "success", "warn", "error"]);
const BATTLE_SCENE_TONE_CLASSES = ["tone-info", "tone-success", "tone-warn", "tone-error"];
const BATTLE_SCENE_IMPACT_CLASSES = [
  "scene-impact-win",
  "scene-impact-loss",
  "scene-impact-breakthrough-success",
  "scene-impact-breakthrough-fail",
];
const BATTLE_SCENE_SHAKE_CLASSES = [
  "scene-shake-light",
  "scene-shake-medium",
  "scene-shake-heavy",
  "scene-shake-lateral",
];
const BATTLE_SCENE_SHAKE_DURATIONS_MS = {
  light: 240,
  medium: 320,
  heavy: 400,
  lateral: 280,
};
const BATTLE_SCENE_ZOOM_CLASSES = [
  "scene-zoom-soft",
  "scene-zoom-burst",
];
const BATTLE_SCENE_ZOOM_DURATIONS_MS = {
  soft: 300,
  burst: 380,
};
const BATTLE_SCENE_HIT_STOP_CLASSES = [
  "scene-hit-stop-light",
  "scene-hit-stop-medium",
  "scene-hit-stop-heavy",
];
const BATTLE_SCENE_HIT_STOP_DURATIONS_MS = {
  light: 72,
  medium: 96,
  heavy: 124,
};
const BATTLE_SCENE_LEAD_SWING_CLASSES = [
  "scene-lead-swing-player",
  "scene-lead-swing-enemy",
  "scene-lead-swing-even",
];
const BATTLE_SCENE_LEAD_SWING_DURATIONS_MS = {
  player: 420,
  enemy: 420,
  even: 340,
};
const BATTLE_SCENE_LEAD_SWING_MIN_INTERVAL_MS = 680;
const BATTLE_SCENE_LEAD_SWING_TICKER_MIN_INTERVAL_MS = 1700;
const BATTLE_SCENE_LEAD_RESONANCE_CLASSES = [
  "scene-lead-resonance-player",
  "scene-lead-resonance-enemy",
  "scene-lead-resonance-even",
];
const BATTLE_SCENE_LEAD_RESONANCE_DURATIONS_MS = {
  player: 420,
  enemy: 420,
  even: 360,
};
const BATTLE_SCENE_LEAD_RESONANCE_MIN_INTERVAL_MS = {
  player: 980,
  enemy: 980,
  even: 1240,
};
const BATTLE_SCENE_LEAD_RESONANCE_TICKER_MIN_INTERVAL_MS = 2400;
const BATTLE_SCENE_PRESSURE_SPIKE_CLASSES = [
  "scene-pressure-spike-medium",
  "scene-pressure-spike-high",
];
const BATTLE_SCENE_PRESSURE_SPIKE_DURATIONS_MS = {
  medium: 360,
  high: 460,
};
const BATTLE_SCENE_PRESSURE_SPIKE_MIN_INTERVAL_MS = {
  medium: 740,
  high: 560,
};
const BATTLE_SCENE_PRESSURE_TICKER_MIN_INTERVAL_MS = 2100;
const BATTLE_SCENE_PRESSURE_RESONANCE_CLASSES = [
  "scene-pressure-resonance-medium",
  "scene-pressure-resonance-high",
];
const BATTLE_SCENE_PRESSURE_RESONANCE_DURATIONS_MS = {
  medium: 430,
  high: 540,
};
const BATTLE_SCENE_PRESSURE_RESONANCE_MIN_INTERVAL_MS = {
  medium: 1180,
  high: 940,
};
const BATTLE_SCENE_PRESSURE_RESONANCE_TICKER_MIN_INTERVAL_MS = 2600;
const BATTLE_SCENE_DANGER_PULSE_CLASSES = [
  "scene-danger-pulse-player",
  "scene-danger-pulse-enemy",
  "scene-danger-pulse-both",
];
const BATTLE_SCENE_DANGER_PULSE_DURATIONS_MS = {
  player: 420,
  enemy: 420,
  both: 520,
};
const BATTLE_SCENE_DANGER_PULSE_MIN_INTERVAL_MS = {
  player: 860,
  enemy: 860,
  both: 700,
};
const BATTLE_SCENE_DANGER_TICKER_MIN_INTERVAL_MS = 2300;
const BATTLE_SCENE_DANGER_RESONANCE_CLASSES = [
  "scene-danger-resonance-player",
  "scene-danger-resonance-enemy",
  "scene-danger-resonance-both",
];
const BATTLE_SCENE_DANGER_RESONANCE_DURATIONS_MS = {
  player: 460,
  enemy: 460,
  both: 560,
};
const BATTLE_SCENE_DANGER_RESONANCE_MIN_INTERVAL_MS = {
  player: 1240,
  enemy: 1240,
  both: 980,
};
const BATTLE_SCENE_DANGER_RESONANCE_TICKER_MIN_INTERVAL_MS = 2800;
const BATTLE_SCENE_COMBO_SURGE_CLASSES = [
  "scene-combo-surge-flow",
  "scene-combo-surge-frenzy",
];
const BATTLE_SCENE_COMBO_SURGE_DURATIONS_MS = {
  flow: 440,
  frenzy: 540,
};
const BATTLE_SCENE_COMBO_SURGE_MIN_INTERVAL_MS = {
  flow: 760,
  frenzy: 620,
};
const BATTLE_SCENE_COMBO_SURGE_TICKER_MIN_INTERVAL_MS = 2100;
const BATTLE_SCENE_COMBO_COOLDOWN_CLASSES = [
  "scene-combo-cooldown-flow",
  "scene-combo-cooldown-calm",
];
const BATTLE_SCENE_COMBO_COOLDOWN_DURATIONS_MS = {
  flow: 430,
  calm: 500,
};
const BATTLE_SCENE_COMBO_COOLDOWN_MIN_INTERVAL_MS = {
  flow: 820,
  calm: 980,
};
const BATTLE_SCENE_COMBO_COOLDOWN_TICKER_MIN_INTERVAL_MS = 2300;
const BATTLE_SCENE_COMBO_RESONANCE_CLASSES = [
  "scene-combo-resonance-flow",
  "scene-combo-resonance-frenzy",
];
const BATTLE_SCENE_COMBO_RESONANCE_DURATIONS_MS = {
  flow: 420,
  frenzy: 500,
};
const BATTLE_SCENE_COMBO_RESONANCE_MIN_INTERVAL_MS = {
  flow: 1120,
  frenzy: 860,
};
const BATTLE_SCENE_COMBO_RESONANCE_TICKER_MIN_INTERVAL_MS = 2500;
const BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_IDLE_MS = 1500;
const BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_AUTO_MS = 1080;
const BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_REALTIME_MS = 760;
const BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_IDLE_MS = 1240;
const BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_AUTO_MS = 920;
const BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_REALTIME_MS = 700;
const BATTLE_SCENE_COMBO_BANNER_TIER_CLASSES = [
  "tier-flow",
  "tier-surge",
  "tier-overdrive",
];
const BATTLE_SCENE_ACTOR_FRAME_HOLD_MS = {
  attack: 360,
  hit: 420,
  skill: 620,
};
const BATTLE_SCENE_ACTOR_FRAME_HOLD_REDUCED_MS = {
  attack: 180,
  hit: 220,
  skill: 280,
};
const BATTLE_SCENE_AMBIENT_TICK_MS = 820;
const BATTLE_SCENE_RESULT_PRIORITY_WINDOW_MS = 2600;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_SUPPRESSION_WINDOW_MS = 6200;
const BATTLE_SCENE_RESULT_DRIVEN_DECORATION_SUPPRESSION_WINDOW_MS = 3800;
const BATTLE_SCENE_SHORT_SUMMARY_DIRECT_SIGNAL_MAX_SECONDS = 12;
const BATTLE_SCENE_RESULT_PRIORITY_DUEL_TICK_DIVISOR = 2;
const BATTLE_SCENE_RESULT_PRIORITY_STRIKE_CHANCE_SCALE = 0.42;
const BATTLE_SCENE_RESULT_PRIORITY_DUEL_HOLD_WINDOW_MS = 1800;
const BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_NARRATIVE_SUPPRESSION_WINDOW_MS = 5200;
const BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_SFX_SUPPRESSION_WINDOW_MS = 5600;
const BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_SFX_DIVISOR = 3;
const BATTLE_SCENE_RESULT_PRIORITY_TRANSITION_DIVISOR = 4;
const BATTLE_SCENE_RESULT_PRIORITY_COMBO_BANNER_MIN_COMBO = 9;
const BATTLE_SCENE_RESULT_PRIORITY_ACTOR_FRAME_SUPPRESSION_WINDOW_MS = 5400;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS = 6800;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE = 6200;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH =
  7600;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_WIN = 6800;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_LOSS = 6200;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_LOSS_HEAVY = 5400;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_SUCCESS =
  8200;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_FAIL_MINOR =
  7600;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_FAIL_HEAVY =
  7000;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_BLOCKED =
  6400;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR = 2;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE = 3;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH = 4;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_WIN = 4;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_LOSS = 5;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_LOSS_HEAVY = 6;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_SUCCESS = 5;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_FAIL_MINOR = 6;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_FAIL_HEAVY = 7;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_BLOCKED = 6;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE = 1;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE = 0.82;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH = 0.64;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_WIN = 0.76;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_LOSS = 0.58;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_LOSS_HEAVY = 0.36;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_SUCCESS =
  0.52;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_FAIL_MINOR =
  0.34;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_FAIL_HEAVY =
  0.18;
const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_BLOCKED =
  0.24;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS = 2200;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE = 2600;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH = 3200;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_WIN = 2800;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_LOSS = 3400;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_LOSS_HEAVY = 4000;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_SUCCESS = 3600;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_FAIL_MINOR =
  4300;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_FAIL_HEAVY =
  5200;
const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_BLOCKED =
  4600;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS = 1400;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE = 1200;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH = 1800;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_WIN = 1000;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_LOSS = 1600;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_LOSS_HEAVY = 2200;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_SUCCESS = 1500;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_FAIL_MINOR = 2400;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_FAIL_HEAVY = 3200;
const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_BLOCKED = 2600;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS = 3;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE = 2;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH = 4;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_WIN = 3;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_LOSS = 2;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_LOSS_HEAVY = 1;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_SUCCESS = 5;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_FAIL_MINOR = 4;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_FAIL_HEAVY = 2;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_BLOCKED = 1;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS = 960;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE = 1080;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH = 840;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_WIN = 900;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_LOSS = 1200;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_LOSS_HEAVY = 1500;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_SUCCESS = 720;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_FAIL_MINOR = 960;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_FAIL_HEAVY = 1260;
const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_BLOCKED = 1320;
const BATTLE_SCENE_DUEL_MAX_HP = 100;
const BATTLE_SCENE_DUEL_MAX_CAST = 100;
const BATTLE_SCENE_TICKER_MAX = 5;
const BATTLE_SCENE_DEFAULT_STATUS = "대기 중";
const BATTLE_SCENE_DEFAULT_RESULT =
  "전장 파동 감지 중 · 자동/실시간 루프에서 연출이 계속 갱신됩니다.";
const BATTLE_SCENE_DEFAULT_TICKER =
  "전투 신호 대기 · 상시 교전 로그를 수집 중입니다.";
const BATTLE_SCENE_PLAYER_SKILLS = ["청운연격", "현무참", "비천격"];
const BATTLE_SCENE_ENEMY_SKILLS = ["혈영쇄", "황혼식", "혼멸파"];
const battleSceneUiState = {
  statusText: BATTLE_SCENE_DEFAULT_STATUS,
  statusTone: "info",
  statusSource: "idle",
  statusKey: "idle",
  resultText: BATTLE_SCENE_DEFAULT_RESULT,
  resultTone: "info",
  resultSource: "idle",
  resultKey: "idle",
};
let battleSceneImpactTimer = null;
let battleSceneFlashTimer = null;
let battleSceneAmbientTimer = null;
let battleSceneAmbientStep = 0;
let battleSceneLastExplicitEventAtMs = 0;
let battleSceneLastExplicitEventSeq = 0;
let battleSceneLastExplicitEventSource = "";
let battleSceneLastExplicitEventKind = "none";
let battleSceneLastExplicitEventTone = "none";
let battleSceneLastExplicitEventOutcomeCode = "none";
let battleSceneLastExplicitEventOutcomeProfile = "neutral";
let battleSceneLastExplicitEventSyncDuel = "off";
let battleSceneLastResultDrivenImpactAtMs = 0;
let battleSceneLastResultDrivenImpactSignal = null;
let battleSceneLastResultDrivenImpactSignalExplicitAtMs = 0;
let battleSceneLastResultDrivenImpactSignalExplicitSeq = 0;
let battleSceneLastResultDrivenImpactReplayCount = 0;
let battleSceneLastResultDrivenImpactReplayAtMs = 0;
let battleSceneShakeTimer = null;
let battleSceneLastShakeAtMs = 0;
let battleSceneZoomTimer = null;
let battleSceneLastZoomAtMs = 0;
let battleSceneHitStopTimer = null;
let battleSceneLastHitStopAtMs = 0;
let battleSceneLeadSwingTimer = null;
let battleSceneLastLeadSwingAtMs = 0;
let battleSceneLastLeadSwingTickerAtMs = 0;
let battleSceneLastLeadState = null;
let battleSceneLeadResonanceTimer = null;
let battleSceneLastLeadResonanceAtMs = 0;
let battleSceneLastLeadResonanceTickerAtMs = 0;
let battleScenePressureSpikeTimer = null;
let battleSceneLastPressureSpikeAtMs = 0;
let battleSceneLastPressureTickerAtMs = 0;
let battleSceneLastPressureState = null;
let battleScenePressureResonanceTimer = null;
let battleSceneLastPressureResonanceAtMs = 0;
let battleSceneLastPressureResonanceTickerAtMs = 0;
let battleSceneDangerPulseTimer = null;
let battleSceneLastDangerPulseAtMs = 0;
let battleSceneLastDangerTickerAtMs = 0;
let battleSceneLastDangerState = null;
let battleSceneDangerResonanceTimer = null;
let battleSceneLastDangerResonanceAtMs = 0;
let battleSceneLastDangerResonanceTickerAtMs = 0;
let battleSceneComboSurgeTimer = null;
let battleSceneLastComboSurgeAtMs = 0;
let battleSceneLastComboSurgeTickerAtMs = 0;
let battleSceneLastComboTierState = null;
let battleSceneComboCooldownTimer = null;
let battleSceneLastComboCooldownAtMs = 0;
let battleSceneLastComboCooldownTickerAtMs = 0;
let battleSceneComboResonanceTimer = null;
let battleSceneLastComboResonanceAtMs = 0;
let battleSceneLastComboResonanceTickerAtMs = 0;
const battleSceneLastCastTelegraphAtMs = {
  player: 0,
  enemy: 0,
};
const battleSceneLastChargeMoteAtMs = {
  player: 0,
  enemy: 0,
};
let battleSceneSkillBannerTimer = null;
let battleSceneComboBannerTimer = null;
const battleSceneActorFrameTimers = {
  player: null,
  enemy: null,
};
const battleSceneTickerState = {
  items: [],
};
const battleSceneDuelState = {
  round: 1,
  playerHp: BATTLE_SCENE_DUEL_MAX_HP,
  enemyHp: BATTLE_SCENE_DUEL_MAX_HP,
  playerCast: 16,
  enemyCast: 12,
  pressure: "low",
  combo: 0,
  maxCombo: 0,
  dpsMomentum: 0,
};

function setStatus(message, isError = false) {
  dom.appStatus.textContent = message;
  dom.appStatus.style.color = isError ? "#f27167" : "#f3bd4d";
}

function syncSavePayloadContract(sourceInput = savePayloadSource) {
  if (!dom.savePayload) {
    return;
  }
  const value = String(dom.savePayload.value || "");
  const trimmed = value.trim();
  const payloadState = trimmed ? "filled" : "empty";
  const payloadSource = payloadState === "empty"
    ? "empty"
    : String(sourceInput || "manual").trim() || "manual";
  const payloadLength = String(value.length);
  const payloadLines = String(trimmed ? value.trimEnd().split(/\r?\n/).length : 0);
  savePayloadSource = payloadSource;
  dom.savePayload.dataset.payloadState = payloadState;
  dom.savePayload.dataset.payloadSource = payloadSource;
  dom.savePayload.dataset.payloadLength = payloadLength;
  dom.savePayload.dataset.payloadLines = payloadLines;
  if (dom.savePanel) {
    dom.savePanel.dataset.payloadState = payloadState;
    dom.savePanel.dataset.payloadSource = payloadSource;
    dom.savePanel.dataset.payloadLength = payloadLength;
    dom.savePanel.dataset.payloadLines = payloadLines;
  }
}

function setSavePayloadValue(valueInput, source = "manual") {
  if (!dom.savePayload) {
    return;
  }
  dom.savePayload.value = String(valueInput ?? "");
  syncSavePayloadContract(source);
}

function applyBattleFocusMode(enabled, options = {}) {
  battleFocusMode = enabled !== false;
  const focusHint = battleFocusMode
    ? "전투/액션 중심 화면입니다. 운영 패널은 접혀 있습니다."
    : "전체 패널 화면입니다. 운영/저장/로그 패널이 표시됩니다.";
  dom.appRoot?.classList.toggle("battle-focus-mode", battleFocusMode);
  if (dom.btnToggleBattleFocus) {
    dom.btnToggleBattleFocus.setAttribute("aria-pressed", String(battleFocusMode));
    dom.btnToggleBattleFocus.textContent = battleFocusMode
      ? "전투 집중 ON"
      : "전투 집중 OFF";
  }
  if (dom.battleFocusHint) {
    dom.battleFocusHint.textContent = focusHint;
  }
  if (dom.focusControlsPanel) {
    dom.focusControlsPanel.dataset.battleFocus = String(battleFocusMode);
    dom.focusControlsPanel.dataset.battleFocusHint = focusHint;
    dom.focusControlsPanel.dataset.focusToggleLabel =
      dom.btnToggleBattleFocus?.textContent?.trim() || "전투 집중 OFF";
    dom.focusControlsPanel.dataset.focusTogglePressed = String(battleFocusMode);
  }
  if (options.announce === true) {
    setStatus(
      battleFocusMode
        ? "전투 집중 모드 활성화"
        : "전투 집중 모드 해제",
    );
  }
}

function isBattleSfxSupported() {
  return (
    typeof window.AudioContext === "function" ||
    typeof window.webkitAudioContext === "function"
  );
}

function restoreBattleSfxPreference() {
  const raw = String(safeLocalGetItem(MOBILE_MVP_BATTLE_SFX_PREF_KEY) || "");
  battleSfxEnabled = raw === "1" || raw.toLowerCase() === "true";
}

function persistBattleSfxPreference() {
  return safeLocalSetItem(
    MOBILE_MVP_BATTLE_SFX_PREF_KEY,
    battleSfxEnabled ? "1" : "0",
  );
}

function renderBattleSfxControl() {
  const supported = isBattleSfxSupported();
  const sfxHint = !supported
    ? "전투 효과음: 브라우저 미지원"
    : battleSfxEnabled
      ? "전투 효과음: 켜짐 (타격/비기/임팩트)"
      : "전투 효과음: 꺼짐";
  if (dom.btnToggleBattleSfx) {
    dom.btnToggleBattleSfx.disabled = !supported;
    dom.btnToggleBattleSfx.setAttribute(
      "aria-pressed",
      String(supported && battleSfxEnabled),
    );
    dom.btnToggleBattleSfx.textContent = !supported
      ? "전투 효과음 미지원"
      : battleSfxEnabled
        ? "전투 효과음 ON"
        : "전투 효과음 OFF";
  }
  if (dom.battleSfxHint) {
    dom.battleSfxHint.textContent = sfxHint;
  }
  if (dom.focusControlsPanel) {
    dom.focusControlsPanel.dataset.battleSfxSupported = String(supported);
    dom.focusControlsPanel.dataset.battleSfxEnabled = String(
      supported && battleSfxEnabled,
    );
    dom.focusControlsPanel.dataset.battleSfxHint = sfxHint;
    dom.focusControlsPanel.dataset.sfxToggleLabel =
      dom.btnToggleBattleSfx?.textContent?.trim() || "전투 효과음 OFF";
    dom.focusControlsPanel.dataset.sfxTogglePressed = String(
      supported && battleSfxEnabled,
    );
    dom.focusControlsPanel.dataset.sfxToggleDisabled = String(
      dom.btnToggleBattleSfx?.disabled === true,
    );
  }
}

function ensureBattleSfxContext() {
  if (!battleSfxEnabled || !isBattleSfxSupported()) {
    return null;
  }
  if (battleSfxContext) {
    return battleSfxContext;
  }
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (typeof AudioContextCtor !== "function") {
    return null;
  }
  try {
    battleSfxContext = new AudioContextCtor();
    battleSfxMasterGain = battleSfxContext.createGain();
    battleSfxMasterGain.gain.value = 0.04;
    battleSfxMasterGain.connect(battleSfxContext.destination);
    return battleSfxContext;
  } catch {
    battleSfxContext = null;
    battleSfxMasterGain = null;
    return null;
  }
}

function requestResumeBattleSfxContext() {
  const contextRef = ensureBattleSfxContext();
  if (!contextRef || contextRef.state !== "suspended") {
    return;
  }
  void contextRef.resume().catch(() => {});
}

function resolveBattleSfxAmbientCue(mode = "idle", pressure = "low", lead = "even") {
  const normalizedMode =
    mode === "realtime" ? "realtime" : mode === "auto" ? "auto" : "idle";
  const normalizedPressure =
    pressure === "high" ? "high" : pressure === "medium" ? "medium" : "low";
  const normalizedLead =
    lead === "player" || lead === "enemy" ? lead : "even";
  const baseByMode =
    normalizedMode === "realtime" ? 166 : normalizedMode === "auto" ? 156 : 146;
  const pressureOffset =
    normalizedPressure === "high" ? 22 : normalizedPressure === "medium" ? 12 : 0;
  const leadOffset =
    normalizedLead === "player" ? 10 : normalizedLead === "enemy" ? -8 : 0;
  const startFreq = Math.max(90, baseByMode + pressureOffset + leadOffset);
  const endRatio =
    normalizedPressure === "high" ? 0.88 : normalizedPressure === "medium" ? 0.84 : 0.8;
  const durationSec =
    normalizedMode === "realtime"
      ? 0.16
      : normalizedMode === "auto"
        ? 0.145
        : 0.132;
  const volume =
    normalizedPressure === "high"
      ? 0.19
      : normalizedPressure === "medium"
        ? 0.15
        : 0.11;
  return {
    wave: normalizedPressure === "high" ? "sawtooth" : "triangle",
    frequency: startFreq,
    endFrequency: startFreq * endRatio,
    durationSec,
    volume,
    detuneCents:
      normalizedLead === "player" ? 4 : normalizedLead === "enemy" ? -4 : 0,
  };
}

function suspendBattleSfxContext() {
  if (!battleSfxContext || battleSfxContext.state !== "running") {
    return;
  }
  void battleSfxContext.suspend().catch(() => {});
}

function emitBattleSfxPulse({
  wave = "triangle",
  frequency = 220,
  endFrequency = 180,
  durationSec = 0.08,
  volume = 0.42,
  detuneCents = 0,
} = {}) {
  const contextRef = ensureBattleSfxContext();
  if (
    !contextRef ||
    contextRef.state !== "running" ||
    !battleSfxMasterGain
  ) {
    return false;
  }
  const startAt = contextRef.currentTime + 0.001;
  const endAt = startAt + Math.max(0.03, Number(durationSec) || 0.08);
  const oscillator = contextRef.createOscillator();
  const gainNode = contextRef.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(Math.max(40, Number(frequency) || 220), startAt);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(40, Number(endFrequency) || 160),
    endAt,
  );
  oscillator.detune.setValueAtTime(Number(detuneCents) || 0, startAt);
  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(
    Math.max(0.0002, Math.min(1, Number(volume) || 0.42)),
    startAt + 0.01,
  );
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);
  oscillator.connect(gainNode);
  gainNode.connect(battleSfxMasterGain);
  oscillator.start(startAt);
  oscillator.stop(endAt + 0.02);
  return true;
}

function playBattleSfx(kind, options = {}) {
  if (!battleSfxEnabled) {
    return;
  }
  requestResumeBattleSfxContext();
  const now = Date.now();
  if (kind === "strike" && now - battleSfxLastPlayAtMs < BATTLE_SFX_MIN_INTERVAL_MS) {
    return;
  }
  let played = false;
  if (kind === "strike") {
    const attacker = options.attacker === "enemy" ? "enemy" : "player";
    const isCrit = options.isCrit === true;
    const baseFreq = attacker === "player" ? 268 : 212;
    played =
      emitBattleSfxPulse({
        wave: isCrit ? "square" : "triangle",
        frequency: baseFreq,
        endFrequency: baseFreq * (isCrit ? 0.72 : 0.82),
        durationSec: isCrit ? 0.1 : 0.072,
        volume: isCrit ? 0.52 : 0.38,
      }) || played;
    if (isCrit) {
      played =
        emitBattleSfxPulse({
          wave: "sawtooth",
          frequency: baseFreq * 1.55,
          endFrequency: baseFreq,
          durationSec: 0.06,
          volume: 0.24,
          detuneCents: attacker === "player" ? 8 : -8,
        }) || played;
    }
  } else if (kind === "burst") {
    const attacker = options.attacker === "enemy" ? "enemy" : "player";
    const startFreq = attacker === "player" ? 236 : 184;
    played =
      emitBattleSfxPulse({
        wave: "sawtooth",
        frequency: startFreq,
        endFrequency: startFreq * 1.26,
        durationSec: 0.14,
        volume: 0.48,
      }) || played;
    played =
      emitBattleSfxPulse({
        wave: "triangle",
        frequency: startFreq * 0.62,
        endFrequency: startFreq * 0.52,
        durationSec: 0.18,
        volume: 0.3,
      }) || played;
  } else if (kind === "impact") {
    const tone = normalizeBattleSceneTone(options.tone || "info");
    const baseFreq =
      tone === "success"
        ? 252
        : tone === "warn"
          ? 202
          : tone === "error"
            ? 176
            : 224;
    played =
      emitBattleSfxPulse({
        wave: tone === "error" ? "square" : "triangle",
        frequency: baseFreq,
        endFrequency: baseFreq * 0.78,
        durationSec: 0.11,
        volume: 0.44,
      }) || played;
    if (options.kind === "breakthrough_success") {
      played =
        emitBattleSfxPulse({
          wave: "sine",
          frequency: baseFreq * 1.08,
          endFrequency: baseFreq * 1.82,
          durationSec: 0.16,
          volume: 0.22,
        }) || played;
    }
  } else if (kind === "toggle_on") {
    played =
      emitBattleSfxPulse({
        wave: "sine",
        frequency: 280,
        endFrequency: 360,
        durationSec: 0.09,
        volume: 0.22,
      }) || played;
  } else if (kind === "ambient") {
    const mode = options.mode === "realtime" ? "realtime" : options.mode === "auto" ? "auto" : "idle";
    const pressure =
      options.pressure === "high" ? "high" : options.pressure === "medium" ? "medium" : "low";
    const lead = options.lead === "player" || options.lead === "enemy" ? options.lead : "even";
    const minIntervalMs =
      mode === "realtime"
        ? BATTLE_SFX_AMBIENT_MIN_INTERVAL_REALTIME_MS
        : mode === "auto"
          ? BATTLE_SFX_AMBIENT_MIN_INTERVAL_AUTO_MS
          : BATTLE_SFX_AMBIENT_MIN_INTERVAL_IDLE_MS;
    if (now - battleSfxAmbientLastPlayAtMs < minIntervalMs || now - battleSfxLastPlayAtMs < 220) {
      return;
    }
    played = emitBattleSfxPulse(resolveBattleSfxAmbientCue(mode, pressure, lead)) || played;
    if (played && (pressure === "high" || mode === "realtime")) {
      const harmonicMultiplier = pressure === "high" ? 1.33 : 1.25;
      played =
        emitBattleSfxPulse({
          wave: "sine",
          frequency: (mode === "realtime" ? 182 : 168) * harmonicMultiplier,
          endFrequency: (mode === "realtime" ? 168 : 154) * harmonicMultiplier,
          durationSec: 0.11,
          volume: pressure === "high" ? 0.11 : 0.08,
          detuneCents: lead === "player" ? 2 : lead === "enemy" ? -2 : 0,
        }) || played;
    }
  }
  if (played) {
    if (kind === "ambient") {
      battleSfxAmbientLastPlayAtMs = now;
    } else {
      battleSfxLastPlayAtMs = now;
    }
  }
}

function setBattleSfxEnabled(enabled, options = {}) {
  const supported = isBattleSfxSupported();
  const nextEnabled = supported && enabled === true;
  battleSfxEnabled = nextEnabled;
  const persisted = persistBattleSfxPreference();
  renderBattleSfxControl();
  if (nextEnabled) {
    requestResumeBattleSfxContext();
    playBattleSfx("toggle_on");
  } else {
    suspendBattleSfxContext();
    battleSfxAmbientLastPlayAtMs = 0;
    battleSfxLastPlayAtMs = 0;
  }
  if (options.announce === true) {
    const statusLabel = !supported
      ? "전투 효과음 미지원"
      : nextEnabled
        ? "전투 효과음 활성화"
        : "전투 효과음 비활성화";
    setStatus(
      `${statusLabel}${persisted ? "" : " (브라우저 저장소 제한 가능)"}`,
      false,
    );
  }
}

function isBattleHapticSupported() {
  return (
    typeof navigator === "object" &&
    navigator !== null &&
    typeof navigator.vibrate === "function"
  );
}

function restoreBattleHapticPreference() {
  const raw = String(safeLocalGetItem(MOBILE_MVP_BATTLE_HAPTIC_PREF_KEY) || "");
  battleHapticEnabled = raw === "1" || raw.toLowerCase() === "true";
}

function persistBattleHapticPreference() {
  return safeLocalSetItem(
    MOBILE_MVP_BATTLE_HAPTIC_PREF_KEY,
    battleHapticEnabled ? "1" : "0",
  );
}

function renderBattleHapticControl() {
  const supported = isBattleHapticSupported();
  const hapticHint = !supported
    ? "전투 진동: 브라우저 미지원"
    : battleHapticEnabled
      ? "전투 진동: 켜짐 (타격/비기/임팩트)"
      : "전투 진동: 꺼짐";
  if (dom.btnToggleBattleHaptic) {
    dom.btnToggleBattleHaptic.disabled = !supported;
    dom.btnToggleBattleHaptic.setAttribute(
      "aria-pressed",
      String(supported && battleHapticEnabled),
    );
    dom.btnToggleBattleHaptic.textContent = !supported
      ? "전투 진동 미지원"
      : battleHapticEnabled
        ? "전투 진동 ON"
        : "전투 진동 OFF";
  }
  if (dom.battleHapticHint) {
    dom.battleHapticHint.textContent = hapticHint;
  }
  if (dom.focusControlsPanel) {
    dom.focusControlsPanel.dataset.battleHapticSupported = String(supported);
    dom.focusControlsPanel.dataset.battleHapticEnabled = String(
      supported && battleHapticEnabled,
    );
    dom.focusControlsPanel.dataset.battleHapticHint = hapticHint;
    dom.focusControlsPanel.dataset.hapticToggleLabel =
      dom.btnToggleBattleHaptic?.textContent?.trim() || "전투 진동 OFF";
    dom.focusControlsPanel.dataset.hapticTogglePressed = String(
      supported && battleHapticEnabled,
    );
    dom.focusControlsPanel.dataset.hapticToggleDisabled = String(
      dom.btnToggleBattleHaptic?.disabled === true,
    );
  }
}

function emitBattleHaptic(pattern) {
  if (!isBattleHapticSupported()) {
    return false;
  }
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}

function cancelBattleHaptic() {
  emitBattleHaptic(0);
}

function playBattleHaptic(kind, options = {}) {
  if (!battleHapticEnabled || !isBattleHapticSupported()) {
    return;
  }
  const now = Date.now();
  if (kind === "strike" && now - battleHapticLastPlayAtMs < BATTLE_HAPTIC_MIN_INTERVAL_MS) {
    return;
  }
  let played = false;
  if (kind === "strike") {
    const isCrit = options.isCrit === true;
    const damage = Math.max(1, Number(options.damage) || 1);
    if (isCrit || damage >= 11) {
      played = emitBattleHaptic([12, 16, 12]);
    } else if (damage >= 6) {
      played = emitBattleHaptic([10]);
    } else {
      played = emitBattleHaptic([8]);
    }
  } else if (kind === "burst") {
    played = emitBattleHaptic([14, 22, 18]);
  } else if (kind === "impact") {
    if (options.kind === "battle_win") {
      played = emitBattleHaptic([16, 20, 14]);
    } else if (options.kind === "battle_loss") {
      played = emitBattleHaptic([28, 18, 28]);
    } else if (options.kind === "breakthrough_success") {
      played = emitBattleHaptic([12, 14, 12, 14]);
    } else {
      played = emitBattleHaptic([22, 14, 20]);
    }
  } else if (kind === "toggle_on") {
    played = emitBattleHaptic([10]);
  }
  if (played) {
    battleHapticLastPlayAtMs = now;
  }
}

function setBattleHapticEnabled(enabled, options = {}) {
  const supported = isBattleHapticSupported();
  const nextEnabled = supported && enabled === true;
  battleHapticEnabled = nextEnabled;
  const persisted = persistBattleHapticPreference();
  renderBattleHapticControl();
  if (nextEnabled) {
    playBattleHaptic("toggle_on");
  } else {
    cancelBattleHaptic();
    battleHapticLastPlayAtMs = 0;
  }
  if (options.announce === true) {
    const statusLabel = !supported
      ? "전투 진동 미지원"
      : nextEnabled
        ? "전투 진동 활성화"
        : "전투 진동 비활성화";
    setStatus(
      `${statusLabel}${persisted ? "" : " (브라우저 저장소 제한 가능)"}`,
      false,
    );
  }
}

function fmtNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function worldKo(world) {
  if (world === "mortal") return "인간계";
  if (world === "immortal") return "신선계";
  return "진선계";
}

function fmtDateTimeFromEpochMs(epochMs) {
  if (!Number.isFinite(epochMs) || epochMs <= 0) {
    return "없음";
  }
  return new Date(epochMs).toLocaleString("ko-KR", {
    hour12: false,
  });
}

function fmtDateTimeFromIso(iso) {
  const parsed = Date.parse(typeof iso === "string" ? iso : "");
  if (!Number.isFinite(parsed)) {
    return "없음";
  }
  return fmtDateTimeFromEpochMs(parsed);
}

function fmtDurationSec(totalSec) {
  const sec = Math.max(0, Math.floor(totalSec));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  if (minutes > 0) {
    return `${minutes}분 ${seconds}초`;
  }
  return `${seconds}초`;
}

function fmtSignedInteger(value) {
  const amount = Number.isFinite(value) ? Math.floor(value) : 0;
  if (amount > 0) {
    return `+${fmtNumber(amount)}`;
  }
  if (amount < 0) {
    return `-${fmtNumber(Math.abs(amount))}`;
  }
  return "+0";
}

function fmtSignedFixed(value, digits = 1) {
  const amount = Number.isFinite(value) ? value : 0;
  if (amount > 0) {
    return `+${amount.toFixed(digits)}`;
  }
  if (amount < 0) {
    return `-${Math.abs(amount).toFixed(digits)}`;
  }
  return `+${(0).toFixed(digits)}`;
}

function normalizeBattleSceneTone(tone) {
  return BATTLE_SCENE_TONES.has(tone) ? tone : "info";
}

function shouldReduceBattleSceneMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isBattleSceneLowPerformanceModeEnabled() {
  return state?.settings?.lowPerformanceBattleScene === true;
}

function resolveBattleSceneAmbientPulseDivisor(mode, options = {}) {
  const lowPerformanceMode = options.lowPerformanceMode === true;
  const baseDivisor = mode === "realtime" ? 2 : mode === "auto" ? 3 : 5;
  return lowPerformanceMode ? baseDivisor + 1 : baseDivisor;
}

function resolveBattleSceneAmbientProbabilityScale(mode, options = {}) {
  const lowPerformanceMode = options.lowPerformanceMode === true;
  if (!lowPerformanceMode) {
    return 1;
  }
  if (mode === "realtime") {
    return 0.58;
  }
  if (mode === "auto") {
    return 0.64;
  }
  return 0.72;
}

function resolveBattleSceneLayerCap(layerKind, options = {}) {
  const lowPerformanceMode =
    options.lowPerformanceMode === true || isBattleSceneLowPerformanceModeEnabled();
  if (layerKind === "spark") {
    return lowPerformanceMode ? 20 : 36;
  }
  if (layerKind === "charge") {
    return lowPerformanceMode ? 24 : 44;
  }
  if (layerKind === "trail") {
    return lowPerformanceMode ? 16 : 28;
  }
  if (layerKind === "shockwave") {
    return lowPerformanceMode ? 12 : 20;
  }
  return lowPerformanceMode ? 14 : 24;
}

function normalizeBattleSceneActor(actorInput) {
  return actorInput === "enemy" ? "enemy" : "player";
}

function normalizeBattleSceneActorFrame(frameInput) {
  if (frameInput === "attack" || frameInput === "hit" || frameInput === "skill") {
    return frameInput;
  }
  return "idle";
}

function resolveBattleSceneActorNode(actorInput) {
  const actor = normalizeBattleSceneActor(actorInput);
  return actor === "enemy" ? dom.battleSceneEnemy : dom.battleScenePlayer;
}

function resolveBattleSceneActorFrameHoldMs(frameInput, holdMsInput) {
  const frame = normalizeBattleSceneActorFrame(frameInput);
  const requested = Number(holdMsInput);
  if (Number.isFinite(requested) && requested >= 0) {
    return Math.floor(requested);
  }
  if (frame === "idle") {
    return 0;
  }
  if (shouldReduceBattleSceneMotion()) {
    return BATTLE_SCENE_ACTOR_FRAME_HOLD_REDUCED_MS[frame] || 200;
  }
  return BATTLE_SCENE_ACTOR_FRAME_HOLD_MS[frame] || 360;
}

function clearBattleSceneActorFrameTimer(actorInput) {
  const actor = normalizeBattleSceneActor(actorInput);
  if (battleSceneActorFrameTimers[actor] !== null) {
    window.clearTimeout(battleSceneActorFrameTimers[actor]);
    battleSceneActorFrameTimers[actor] = null;
  }
}

function setBattleSceneActorFrame(actorInput, frameInput, options = {}) {
  const actor = normalizeBattleSceneActor(actorInput);
  const frame = normalizeBattleSceneActorFrame(frameInput);
  const actorNode = resolveBattleSceneActorNode(actor);
  if (!actorNode) {
    clearBattleSceneActorFrameTimer(actor);
    return;
  }
  clearBattleSceneActorFrameTimer(actor);
  actorNode.dataset.actorFrame = frame;
  if (dom.battleSceneArena) {
    if (actor === "player") {
      dom.battleSceneArena.dataset.scenePlayerFrame = frame;
    } else {
      dom.battleSceneArena.dataset.sceneEnemyFrame = frame;
    }
  }
  if (frame === "idle") {
    return;
  }
  const holdMs = resolveBattleSceneActorFrameHoldMs(frame, options.holdMs);
  if (holdMs <= 0) {
    return;
  }
  battleSceneActorFrameTimers[actor] = window.setTimeout(() => {
    const node = resolveBattleSceneActorNode(actor);
    if (node) {
      node.dataset.actorFrame = "idle";
    }
    if (dom.battleSceneArena) {
      if (actor === "player") {
        dom.battleSceneArena.dataset.scenePlayerFrame = "idle";
      } else {
        dom.battleSceneArena.dataset.sceneEnemyFrame = "idle";
      }
    }
    battleSceneActorFrameTimers[actor] = null;
  }, holdMs);
}

function resetBattleSceneActorFrames() {
  clearBattleSceneActorFrameTimer("player");
  clearBattleSceneActorFrameTimer("enemy");
  const playerNode = resolveBattleSceneActorNode("player");
  if (playerNode) {
    playerNode.dataset.actorFrame = "idle";
  }
  const enemyNode = resolveBattleSceneActorNode("enemy");
  if (enemyNode) {
    enemyNode.dataset.actorFrame = "idle";
  }
  if (dom.battleSceneArena) {
    dom.battleSceneArena.dataset.scenePlayerFrame = "idle";
    dom.battleSceneArena.dataset.sceneEnemyFrame = "idle";
  }
}

function resolveBattleSceneImpactActorFrameCue(kind, options = {}) {
  const source =
    options?.source === "battle" || options?.source === "breakthrough"
      ? options.source
      : "";
  const outcome = options?.outcome && typeof options.outcome === "object" ? options.outcome : null;
  if (source === "battle" && outcome) {
    if (outcome.won === true) {
      const qiGain = Math.max(0, Math.round(Number(outcome.qiDelta) || 0));
      const essenceGain = Math.max(0, Math.round(Number(outcome.rebirthEssenceDelta) || 0));
      const playerFrame = qiGain >= 14 || essenceGain > 0 ? "skill" : "attack";
      const playerHoldMs = playerFrame === "skill" ? 720 : 420;
      const enemyHoldMs = playerFrame === "skill" ? 540 : 460;
      return {
        cue: playerFrame === "skill" ? "battle_win_skill_finisher" : "battle_win_attack_finisher",
        playerFrame,
        playerHoldMs,
        enemyFrame: "hit",
        enemyHoldMs,
      };
    }
    const qiLoss = Math.max(0, Math.abs(Math.round(Number(outcome.qiDelta) || 0)));
    const enemyFrame = qiLoss >= 10 ? "skill" : "attack";
    return {
      cue: enemyFrame === "skill" ? "battle_loss_heavy_counter" : "battle_loss_counter",
      playerFrame: "hit",
      playerHoldMs: enemyFrame === "skill" ? 620 : 500,
      enemyFrame,
      enemyHoldMs: enemyFrame === "skill" ? 640 : 420,
    };
  }
  if (source === "breakthrough" && outcome) {
    const outcomeCode = String(outcome.outcome || "");
    const pausedByPolicy =
      outcome.pausedByPolicy === true || outcome.autoBreakthroughPaused === true;
    if (outcome.attempted === true) {
      if (outcomeCode === "success") {
        return {
          cue: "breakthrough_success",
          playerFrame: "skill",
          playerHoldMs: 680,
          enemyFrame: "hit",
          enemyHoldMs: 420,
        };
      }
      if (outcomeCode === "minor_fail") {
        return {
          cue: "breakthrough_minor_fail",
          playerFrame: "hit",
          playerHoldMs: 560,
          enemyFrame: "attack",
          enemyHoldMs: 420,
        };
      }
      if (outcomeCode === "retreat_fail") {
        return {
          cue: "breakthrough_retreat_fail",
          playerFrame: "hit",
          playerHoldMs: 640,
          enemyFrame: "skill",
          enemyHoldMs: 620,
        };
      }
      if (outcomeCode === "death_fail") {
        return {
          cue: "breakthrough_death_fail",
          playerFrame: "hit",
          playerHoldMs: 760,
          enemyFrame: "skill",
          enemyHoldMs: 760,
        };
      }
      return {
        cue: "breakthrough_fail_generic",
        playerFrame: "hit",
        playerHoldMs: 520,
        enemyFrame: "idle",
        enemyHoldMs: 0,
      };
    }
    if (outcomeCode === "blocked_no_qi") {
      return {
        cue: "breakthrough_blocked_no_qi",
        playerFrame: "idle",
        playerHoldMs: 0,
        enemyFrame: "idle",
        enemyHoldMs: 0,
      };
    }
    if (outcomeCode === "blocked_tribulation_setting") {
      return {
        cue: "breakthrough_blocked_tribulation_setting",
        playerFrame: "idle",
        playerHoldMs: 0,
        enemyFrame: "idle",
        enemyHoldMs: 0,
      };
    }
    if (outcomeCode === "blocked_auto_risk_policy" && pausedByPolicy) {
      return {
        cue: "breakthrough_blocked_auto_risk_pause",
        playerFrame: "hit",
        playerHoldMs: 660,
        enemyFrame: "skill",
        enemyHoldMs: 640,
      };
    }
    if (outcomeCode === "blocked_auto_risk_policy") {
      const policyReason = String(outcome.autoPolicy?.reason || outcome.reason || "");
      const enemyFrame = policyReason === "blocked_extreme_risk" ? "skill" : "attack";
      return {
        cue:
          enemyFrame === "skill"
            ? "breakthrough_blocked_auto_risk_heavy"
            : "breakthrough_blocked_auto_risk",
        playerFrame: "hit",
        playerHoldMs: enemyFrame === "skill" ? 620 : 500,
        enemyFrame,
        enemyHoldMs: enemyFrame === "skill" ? 600 : 420,
      };
    }
    return {
      cue: "breakthrough_blocked_generic",
      playerFrame: "hit",
      playerHoldMs: 520,
      enemyFrame: "idle",
      enemyHoldMs: 0,
    };
  }
  if (kind === "battle_win") {
    return {
      cue: "battle_win_default",
      playerFrame: "attack",
      playerHoldMs: 380,
      enemyFrame: "hit",
      enemyHoldMs: 460,
    };
  }
  if (kind === "battle_loss") {
    return {
      cue: "battle_loss_default",
      playerFrame: "hit",
      playerHoldMs: 460,
      enemyFrame: "attack",
      enemyHoldMs: 380,
    };
  }
  if (kind === "breakthrough_success") {
    return {
      cue: "breakthrough_success_default",
      playerFrame: "skill",
      playerHoldMs: 680,
      enemyFrame: "hit",
      enemyHoldMs: 420,
    };
  }
  return {
    cue: "breakthrough_fail_default",
    playerFrame: "hit",
    playerHoldMs: 520,
    enemyFrame: "idle",
    enemyHoldMs: 0,
  };
}

function applyBattleSceneImpactActorFrames(kind, options = {}) {
  const cue = resolveBattleSceneImpactActorFrameCue(kind, options);
  setBattleSceneActorFrame("player", cue.playerFrame, {
    holdMs: cue.playerHoldMs,
  });
  setBattleSceneActorFrame("enemy", cue.enemyFrame, {
    holdMs: cue.enemyHoldMs,
  });
  return cue.cue;
}

function resolveBattleSceneImpactKineticCue(kind, options = {}) {
  const source =
    options?.source === "battle" || options?.source === "breakthrough"
      ? options.source
      : "";
  const outcome = options?.outcome && typeof options.outcome === "object" ? options.outcome : null;
  if (source === "battle" && outcome) {
    if (outcome.won === true) {
      const qiGain = Math.max(0, Math.round(Number(outcome.qiDelta) || 0));
      const spiritGain = Math.max(0, Math.round(Number(outcome.spiritCoinDelta) || 0));
      const essenceGain = Math.max(0, Math.round(Number(outcome.rebirthEssenceDelta) || 0));
      if (qiGain >= 20 || essenceGain > 0) {
        return {
          cue: "battle_win_dominant",
          shakePreset: "medium",
          zoomPreset: "burst",
          hitStopPreset: "medium",
        };
      }
      if (qiGain >= 10 || spiritGain >= 5) {
        return {
          cue: "battle_win_surge",
          shakePreset: "lateral",
          zoomPreset: "soft",
          hitStopPreset: "medium",
        };
      }
      return {
        cue: "battle_win_clean",
        shakePreset: "lateral",
        zoomPreset: "soft",
        hitStopPreset: "light",
      };
    }
    const qiLoss = Math.max(0, Math.abs(Math.round(Number(outcome.qiDelta) || 0)));
    if (qiLoss >= 22) {
      return {
        cue: "battle_loss_crushing",
        shakePreset: "heavy",
        zoomPreset: "burst",
        hitStopPreset: "heavy",
      };
    }
    if (qiLoss >= 10) {
      return {
        cue: "battle_loss_heavy",
        shakePreset: "medium",
        zoomPreset: "burst",
        hitStopPreset: "medium",
      };
    }
    return {
      cue: "battle_loss_brief",
      shakePreset: "lateral",
      zoomPreset: "soft",
      hitStopPreset: "light",
    };
  }
  if (source === "breakthrough" && outcome) {
    const outcomeCode = String(outcome.outcome || "");
    const pausedByPolicy =
      outcome.pausedByPolicy === true || outcome.autoBreakthroughPaused === true;
    if (outcome.attempted === true) {
      if (outcomeCode === "success") {
        const successPct = Math.max(0, Math.min(100, Number(outcome.successPct) || 0));
        if (successPct >= 78) {
          return {
            cue: "breakthrough_success_peak",
            shakePreset: "medium",
            zoomPreset: "burst",
            hitStopPreset: "medium",
          };
        }
        return {
          cue: "breakthrough_success_stable",
          shakePreset: "lateral",
          zoomPreset: "soft",
          hitStopPreset: "medium",
        };
      }
      if (outcomeCode === "minor_fail") {
        const deathPct = Math.max(0, Math.min(100, Number(outcome.deathPct) || 0));
        return {
          cue: deathPct >= 45 ? "breakthrough_minor_fail_heavy" : "breakthrough_minor_fail",
          shakePreset: deathPct >= 45 ? "heavy" : "medium",
          zoomPreset: "burst",
          hitStopPreset: deathPct >= 45 ? "heavy" : "medium",
        };
      }
      if (outcomeCode === "retreat_fail") {
        return {
          cue: "breakthrough_retreat_fail",
          shakePreset: "heavy",
          zoomPreset: "burst",
          hitStopPreset: "heavy",
        };
      }
      if (outcomeCode === "death_fail") {
        return {
          cue: "breakthrough_death_fail",
          shakePreset: "heavy",
          zoomPreset: "burst",
          hitStopPreset: "heavy",
        };
      }
      return {
        cue: "breakthrough_fail_generic",
        shakePreset: "medium",
        zoomPreset: "burst",
        hitStopPreset: "medium",
      };
    }
    if (outcomeCode === "blocked_no_qi") {
      return {
        cue: "breakthrough_blocked_no_qi",
        shakePreset: "light",
        zoomPreset: "soft",
        hitStopPreset: "light",
      };
    }
    if (outcomeCode === "blocked_tribulation_setting") {
      return {
        cue: "breakthrough_blocked_tribulation_setting",
        shakePreset: "light",
        zoomPreset: "soft",
        hitStopPreset: "light",
      };
    }
    if (outcomeCode === "blocked_auto_risk_policy" && pausedByPolicy) {
      return {
        cue: "breakthrough_blocked_auto_risk_pause",
        shakePreset: "heavy",
        zoomPreset: "burst",
        hitStopPreset: "heavy",
      };
    }
    if (outcomeCode === "blocked_auto_risk_policy") {
      const policyReason = String(outcome.autoPolicy?.reason || outcome.reason || "");
      if (policyReason === "blocked_extreme_risk") {
        return {
          cue: "breakthrough_blocked_auto_risk_heavy",
          shakePreset: "heavy",
          zoomPreset: "burst",
          hitStopPreset: "heavy",
        };
      }
      if (policyReason === "blocked_high_risk") {
        return {
          cue: "breakthrough_blocked_auto_risk_warn",
          shakePreset: "medium",
          zoomPreset: "soft",
          hitStopPreset: "medium",
        };
      }
      if (policyReason === "blocked_high_qi_cost") {
        return {
          cue: "breakthrough_blocked_auto_qi_cost",
          shakePreset: "light",
          zoomPreset: "soft",
          hitStopPreset: "light",
        };
      }
    }
    return {
      cue: "breakthrough_blocked_generic",
      shakePreset: "medium",
      zoomPreset: "soft",
      hitStopPreset: "medium",
    };
  }
  if (kind === "battle_win") {
    return {
      cue: "battle_win_default",
      shakePreset: "lateral",
      zoomPreset: "soft",
      hitStopPreset: "light",
    };
  }
  if (kind === "battle_loss") {
    return {
      cue: "battle_loss_default",
      shakePreset: "heavy",
      zoomPreset: "burst",
      hitStopPreset: "heavy",
    };
  }
  if (kind === "breakthrough_success") {
    return {
      cue: "breakthrough_success_default",
      shakePreset: "medium",
      zoomPreset: "soft",
      hitStopPreset: "medium",
    };
  }
  return {
    cue: "breakthrough_fail_default",
    shakePreset: "heavy",
    zoomPreset: "burst",
    hitStopPreset: "heavy",
  };
}

function resolveBattleSceneImpactVfxCue(kind, options = {}) {
  const source =
    options?.source === "battle" || options?.source === "breakthrough"
      ? options.source
      : "";
  const outcome = options?.outcome && typeof options.outcome === "object" ? options.outcome : null;
  if (source === "battle" && outcome) {
    if (outcome.won === true) {
      const qiGain = Math.max(0, Math.round(Number(outcome.qiDelta) || 0));
      const essenceGain = Math.max(0, Math.round(Number(outcome.rebirthEssenceDelta) || 0));
      if (qiGain >= 20 || essenceGain > 0) {
        return {
          cue: "battle_win_dominant",
          spark: { anchor: "center", shape: "ring", angleDeg: 12, scale: 1.26 },
          trails: [
            { anchor: "center", shape: "wave", angleDeg: 16, length: 104 },
            { anchor: "center", shape: "wave", angleDeg: -12, length: 94 },
          ],
          shockwave: {
            anchor: "center",
            radiusPx: 118,
            thicknessPx: 3.2,
            lingerSec: 0.82,
            ambientRadiusReduce: 16,
            ambientLingerReduce: 0.12,
          },
        };
      }
      if (qiGain >= 10) {
        return {
          cue: "battle_win_surge",
          spark: { anchor: "center", shape: "shard", angleDeg: 18, scale: 1.1 },
          trails: [
            { anchor: "center", shape: "slash", angleDeg: 14, length: 90 },
            { anchor: "center", shape: "slash", angleDeg: -10, length: 82 },
          ],
          shockwave: {
            anchor: "center",
            radiusPx: 104,
            thicknessPx: 2.9,
            lingerSec: 0.76,
            ambientRadiusReduce: 14,
            ambientLingerReduce: 0.1,
          },
        };
      }
      return {
        cue: "battle_win_clean",
        spark: { anchor: "center", shape: "shard", angleDeg: 16, scale: 1.05 },
        trails: [
          { anchor: "center", shape: "slash", angleDeg: 12, length: 84 },
          { anchor: "center", shape: "slash", angleDeg: -10, length: 76 },
        ],
        shockwave: {
          anchor: "center",
          radiusPx: 98,
          thicknessPx: 2.8,
          lingerSec: 0.72,
          ambientRadiusReduce: 10,
          ambientLingerReduce: 0.1,
        },
      };
    }
    const qiLoss = Math.max(0, Math.abs(Math.round(Number(outcome.qiDelta) || 0)));
    if (qiLoss >= 22) {
      return {
        cue: "battle_loss_crushing",
        spark: { anchor: "center", shape: "shard", angleDeg: -22, scale: 1.24 },
        trails: [
          { anchor: "center", shape: "slash", angleDeg: 170, length: 94 },
          { anchor: "center", shape: "slash", angleDeg: -166, length: 86 },
        ],
        shockwave: {
          anchor: "center",
          radiusPx: 122,
          thicknessPx: 3.4,
          lingerSec: 0.84,
          ambientRadiusReduce: 18,
          ambientLingerReduce: 0.12,
        },
      };
    }
    if (qiLoss >= 10) {
      return {
        cue: "battle_loss_heavy",
        spark: { anchor: "center", shape: "shard", angleDeg: -18, scale: 1.12 },
        trails: [
          { anchor: "center", shape: "slash", angleDeg: 166, length: 84 },
          { anchor: "center", shape: "slash", angleDeg: -164, length: 74 },
        ],
        shockwave: {
          anchor: "center",
          radiusPx: 108,
          thicknessPx: 3.2,
          lingerSec: 0.78,
          ambientRadiusReduce: 14,
          ambientLingerReduce: 0.12,
        },
      };
    }
    return {
      cue: "battle_loss_brief",
      spark: { anchor: "center", shape: "dot", angleDeg: -12, scale: 0.98 },
      trails: [
        { anchor: "center", shape: "slash", angleDeg: 162, length: 72 },
      ],
      shockwave: {
        anchor: "center",
        radiusPx: 94,
        thicknessPx: 2.8,
        lingerSec: 0.7,
        ambientRadiusReduce: 12,
        ambientLingerReduce: 0.1,
      },
    };
  }
  if (source === "breakthrough" && outcome) {
    const outcomeCode = String(outcome.outcome || "");
    const pausedByPolicy =
      outcome.pausedByPolicy === true || outcome.autoBreakthroughPaused === true;
    if (outcome.attempted === true) {
      if (outcomeCode === "success") {
        const successPct = Math.max(0, Math.min(100, Number(outcome.successPct) || 0));
        if (successPct >= 78) {
          return {
            cue: "breakthrough_success_peak",
            spark: { anchor: "center", shape: "ring", angleDeg: 0, scale: 1.34 },
            trails: [
              { anchor: "center", shape: "wave", angleDeg: 0, length: 108 },
              { anchor: "center", shape: "wave", angleDeg: 180, length: 86 },
            ],
            shockwave: {
              anchor: "center",
              radiusPx: 122,
              thicknessPx: 3.2,
              lingerSec: 0.84,
              ambientRadiusReduce: 16,
              ambientLingerReduce: 0.14,
            },
          };
        }
        return {
          cue: "breakthrough_success_stable",
          spark: { anchor: "center", shape: "ring", angleDeg: 0, scale: 1.25 },
          trails: [
            { anchor: "center", shape: "wave", angleDeg: 0, length: 96 },
          ],
          shockwave: {
            anchor: "center",
            radiusPx: 108,
            thicknessPx: 2.9,
            lingerSec: 0.78,
            ambientRadiusReduce: 14,
            ambientLingerReduce: 0.12,
          },
        };
      }
      if (outcomeCode === "minor_fail") {
        const deathPct = Math.max(0, Math.min(100, Number(outcome.deathPct) || 0));
        if (deathPct >= 45) {
          return {
            cue: "breakthrough_minor_fail_heavy",
            spark: { anchor: "player", shape: "ring", angleDeg: -24, scale: 1.24 },
            trails: [
              { anchor: "player", shape: "wave", angleDeg: -28, length: 98 },
              { anchor: "player", shape: "slash", angleDeg: -162, length: 80 },
            ],
            shockwave: {
              anchor: "player",
              radiusPx: 98,
              thicknessPx: 3.0,
              lingerSec: 0.78,
              ambientRadiusReduce: 12,
              ambientLingerReduce: 0.12,
            },
          };
        }
        return {
          cue: "breakthrough_minor_fail",
          spark: { anchor: "player", shape: "ring", angleDeg: -24, scale: 1.15 },
          trails: [
            { anchor: "player", shape: "wave", angleDeg: -24, length: 88 },
          ],
          shockwave: {
            anchor: "player",
            radiusPx: 86,
            thicknessPx: 2.7,
            lingerSec: 0.7,
            ambientRadiusReduce: 10,
            ambientLingerReduce: 0.1,
          },
        };
      }
      if (outcomeCode === "retreat_fail") {
        return {
          cue: "breakthrough_retreat_fail",
          spark: { anchor: "player", shape: "shard", angleDeg: -32, scale: 1.22 },
          trails: [
            { anchor: "player", shape: "wave", angleDeg: -34, length: 102 },
            { anchor: "player", shape: "slash", angleDeg: -156, length: 88 },
          ],
          shockwave: {
            anchor: "player",
            radiusPx: 104,
            thicknessPx: 3.2,
            lingerSec: 0.82,
            ambientRadiusReduce: 14,
            ambientLingerReduce: 0.14,
          },
        };
      }
      if (outcomeCode === "death_fail") {
        return {
          cue: "breakthrough_death_fail",
          spark: { anchor: "player", shape: "ring", angleDeg: -20, scale: 1.32 },
          trails: [
            { anchor: "player", shape: "wave", angleDeg: -36, length: 108 },
            { anchor: "center", shape: "slash", angleDeg: 162, length: 86 },
          ],
          shockwave: {
            anchor: "center",
            radiusPx: 116,
            thicknessPx: 3.4,
            lingerSec: 0.86,
            ambientRadiusReduce: 16,
            ambientLingerReduce: 0.16,
          },
        };
      }
      return {
        cue: "breakthrough_fail_generic",
        spark: { anchor: "player", shape: "ring", angleDeg: -24, scale: 1.15 },
        trails: [
          { anchor: "player", shape: "wave", angleDeg: -24, length: 88 },
        ],
        shockwave: {
          anchor: "player",
          radiusPx: 86,
          thicknessPx: 2.6,
          lingerSec: 0.7,
          ambientRadiusReduce: 10,
          ambientLingerReduce: 0.12,
        },
      };
    }
    if (outcomeCode === "blocked_no_qi") {
      return {
        cue: "breakthrough_blocked_no_qi",
        spark: { anchor: "player", shape: "dot", angleDeg: -12, scale: 0.92 },
        trails: [
          { anchor: "player", shape: "slash", angleDeg: -20, length: 64 },
        ],
        shockwave: {
          anchor: "player",
          radiusPx: 72,
          thicknessPx: 2.2,
          lingerSec: 0.62,
          ambientRadiusReduce: 8,
          ambientLingerReduce: 0.08,
        },
      };
    }
    if (outcomeCode === "blocked_tribulation_setting") {
      return {
        cue: "breakthrough_blocked_tribulation_setting",
        spark: { anchor: "center", shape: "dot", angleDeg: 0, scale: 0.9 },
        trails: [
          { anchor: "center", shape: "wave", angleDeg: 0, length: 58 },
        ],
        shockwave: {
          anchor: "center",
          radiusPx: 68,
          thicknessPx: 2.1,
          lingerSec: 0.58,
          ambientRadiusReduce: 8,
          ambientLingerReduce: 0.08,
        },
      };
    }
    if (outcomeCode === "blocked_auto_risk_policy" && pausedByPolicy) {
      return {
        cue: "breakthrough_blocked_auto_risk_pause",
        spark: { anchor: "player", shape: "ring", angleDeg: -24, scale: 1.26 },
        trails: [
          { anchor: "player", shape: "wave", angleDeg: -30, length: 102 },
          { anchor: "player", shape: "slash", angleDeg: -160, length: 86 },
        ],
        shockwave: {
          anchor: "player",
          radiusPx: 108,
          thicknessPx: 3.2,
          lingerSec: 0.82,
          ambientRadiusReduce: 14,
          ambientLingerReduce: 0.14,
        },
      };
    }
    if (outcomeCode === "blocked_auto_risk_policy") {
      const policyReason = String(outcome.autoPolicy?.reason || outcome.reason || "");
      if (policyReason === "blocked_extreme_risk") {
        return {
          cue: "breakthrough_blocked_auto_risk_heavy",
          spark: { anchor: "player", shape: "ring", angleDeg: -24, scale: 1.22 },
          trails: [
            { anchor: "player", shape: "wave", angleDeg: -28, length: 98 },
            { anchor: "player", shape: "slash", angleDeg: -160, length: 82 },
          ],
          shockwave: {
            anchor: "player",
            radiusPx: 102,
            thicknessPx: 3.0,
            lingerSec: 0.78,
            ambientRadiusReduce: 14,
            ambientLingerReduce: 0.12,
          },
        };
      }
      if (policyReason === "blocked_high_risk") {
        return {
          cue: "breakthrough_blocked_auto_risk_warn",
          spark: { anchor: "player", shape: "ring", angleDeg: -20, scale: 1.08 },
          trails: [
            { anchor: "player", shape: "wave", angleDeg: -24, length: 84 },
          ],
          shockwave: {
            anchor: "player",
            radiusPx: 84,
            thicknessPx: 2.6,
            lingerSec: 0.7,
            ambientRadiusReduce: 10,
            ambientLingerReduce: 0.1,
          },
        };
      }
      if (policyReason === "blocked_high_qi_cost") {
        return {
          cue: "breakthrough_blocked_auto_qi_cost",
          spark: { anchor: "player", shape: "dot", angleDeg: -12, scale: 0.94 },
          trails: [
            { anchor: "player", shape: "slash", angleDeg: -18, length: 68 },
          ],
          shockwave: {
            anchor: "player",
            radiusPx: 74,
            thicknessPx: 2.2,
            lingerSec: 0.62,
            ambientRadiusReduce: 8,
            ambientLingerReduce: 0.08,
          },
        };
      }
    }
    return {
      cue: "breakthrough_blocked_generic",
      spark: { anchor: "player", shape: "ring", angleDeg: -20, scale: 1.04 },
      trails: [
        { anchor: "player", shape: "wave", angleDeg: -22, length: 80 },
      ],
      shockwave: {
        anchor: "player",
        radiusPx: 80,
        thicknessPx: 2.4,
        lingerSec: 0.66,
        ambientRadiusReduce: 10,
        ambientLingerReduce: 0.08,
      },
    };
  }
  if (kind === "battle_win") {
    return {
      cue: "battle_win_default",
      spark: { anchor: "center", shape: "shard", angleDeg: 16, scale: 1.05 },
      trails: [
        { anchor: "center", shape: "slash", angleDeg: 12, length: 84 },
        { anchor: "center", shape: "slash", angleDeg: -10, length: 76 },
      ],
      shockwave: {
        anchor: "center",
        radiusPx: 98,
        thicknessPx: 2.8,
        lingerSec: 0.72,
        ambientRadiusReduce: 10,
        ambientLingerReduce: 0.1,
      },
    };
  }
  if (kind === "battle_loss") {
    return {
      cue: "battle_loss_default",
      spark: { anchor: "center", shape: "shard", angleDeg: -18, scale: 1.08 },
      trails: [
        { anchor: "center", shape: "slash", angleDeg: 166, length: 82 },
        { anchor: "center", shape: "slash", angleDeg: -164, length: 70 },
      ],
      shockwave: {
        anchor: "center",
        radiusPx: 106,
        thicknessPx: 3.1,
        lingerSec: 0.76,
        ambientRadiusReduce: 14,
        ambientLingerReduce: 0.12,
      },
    };
  }
  if (kind === "breakthrough_success") {
    return {
      cue: "breakthrough_success_default",
      spark: { anchor: "center", shape: "ring", angleDeg: 0, scale: 1.25 },
      trails: [
        { anchor: "center", shape: "wave", angleDeg: 0, length: 96 },
      ],
      shockwave: {
        anchor: "center",
        radiusPx: 108,
        thicknessPx: 2.9,
        lingerSec: 0.78,
        ambientRadiusReduce: 14,
        ambientLingerReduce: 0.12,
      },
    };
  }
  return {
    cue: "breakthrough_fail_default",
    spark: { anchor: "player", shape: "ring", angleDeg: -24, scale: 1.15 },
    trails: [
      { anchor: "player", shape: "wave", angleDeg: -24, length: 88 },
    ],
    shockwave: {
      anchor: "player",
      radiusPx: 86,
      thicknessPx: 2.6,
      lingerSec: 0.7,
      ambientRadiusReduce: 14,
      ambientLingerReduce: 0.12,
    },
  };
}

function triggerBattleSceneImpactVfxFromCue(cueInput, tone = "info", options = {}) {
  const cue = cueInput && typeof cueInput === "object" ? cueInput : null;
  if (!cue) {
    return;
  }
  const fromAmbient = options.fromAmbient === true;
  const spark = cue.spark && typeof cue.spark === "object" ? cue.spark : null;
  if (spark) {
    spawnBattleSceneSpark({
      anchor: spark.anchor,
      tone,
      shape: spark.shape,
      angleDeg: spark.angleDeg,
      scale: spark.scale,
    });
  }
  const trails = Array.isArray(cue.trails) ? cue.trails : [];
  for (const trail of trails) {
    if (!trail || typeof trail !== "object") {
      continue;
    }
    spawnBattleSceneTrail({
      anchor: trail.anchor,
      tone,
      shape: trail.shape,
      angleDeg: trail.angleDeg,
      length: trail.length,
    });
  }
  const shockwave =
    cue.shockwave && typeof cue.shockwave === "object" ? cue.shockwave : null;
  if (!shockwave) {
    return;
  }
  const radiusBase = Math.max(22, Number(shockwave.radiusPx) || 86);
  const thicknessBase = Math.max(1, Number(shockwave.thicknessPx) || 2.6);
  const lingerBase = Math.max(0.24, Number(shockwave.lingerSec) || 0.7);
  const radiusPx = fromAmbient
    ? Math.max(22, radiusBase - Math.max(0, Number(shockwave.ambientRadiusReduce) || 12))
    : radiusBase;
  const lingerSec = fromAmbient
    ? Math.max(0.24, lingerBase - Math.max(0, Number(shockwave.ambientLingerReduce) || 0.1))
    : lingerBase;
  spawnBattleSceneShockwave({
    anchor: shockwave.anchor,
    tone,
    radiusPx,
    thicknessPx: thicknessBase,
    lingerSec,
  });
}

function setBattleSceneLoopMode(loopMode = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  dom.battleSceneArena.dataset.sceneLoop = String(loopMode || "idle");
  syncBattleScenePanelContract();
}

function applyBattleSceneTone(node, tone) {
  if (!node) {
    return;
  }
  const normalizedTone = normalizeBattleSceneTone(tone);
  node.dataset.tone = normalizedTone;
  node.classList.remove(...BATTLE_SCENE_TONE_CLASSES);
  node.classList.add(`tone-${normalizedTone}`);
}

function normalizeBattleSceneMessageSource(source) {
  if (
    source === "ambient" ||
    source === "battle" ||
    source === "breakthrough" ||
    source === "auto" ||
    source === "offline"
  ) {
    return source;
  }
  return "idle";
}

function normalizeBattleSceneBannerActor(actor) {
  if (actor === "player" || actor === "enemy" || actor === "center") {
    return actor;
  }
  return "none";
}

function normalizeBattleSceneBannerKey(key) {
  const normalized = String(key || "").trim();
  return normalized || "idle";
}

function normalizeBattleSceneMessageKey(key) {
  const normalized = String(key || "").trim();
  return normalized || "idle";
}

function syncBattleScenePanelContract() {
  if (!dom.battleScenePanel) {
    return;
  }
  dom.battleScenePanel.dataset.sceneState =
    dom.battleSceneArena?.dataset.sceneState || "idle";
  dom.battleScenePanel.dataset.sceneLoop =
    dom.battleSceneArena?.dataset.sceneLoop || "idle";
  dom.battleScenePanel.dataset.sceneWorld =
    dom.battleSceneArena?.dataset.sceneWorld || "true";
  dom.battleScenePanel.dataset.sceneTier =
    dom.battleSceneArena?.dataset.sceneTier || "novice";
  dom.battleScenePanel.dataset.scenePerformance =
    dom.battleSceneArena?.dataset.scenePerformance || "normal";
  dom.battleScenePanel.dataset.sceneOutcomePriority =
    dom.battleSceneArena?.dataset.sceneOutcomePriority || "normal";
  dom.battleScenePanel.dataset.impactCue =
    dom.battleSceneArena?.dataset.sceneImpactCue || "idle";
  dom.battleScenePanel.dataset.impactKinetic =
    dom.battleSceneArena?.dataset.sceneImpactKinetic || "normal";
  dom.battleScenePanel.dataset.impactVfx =
    dom.battleSceneArena?.dataset.sceneImpactVfx || "normal";
  dom.battleScenePanel.dataset.playerFrame =
    dom.battleSceneArena?.dataset.scenePlayerFrame || "idle";
  dom.battleScenePanel.dataset.enemyFrame =
    dom.battleSceneArena?.dataset.sceneEnemyFrame || "idle";
  dom.battleScenePanel.dataset.playerStageLabel =
    dom.battleScenePlayerStage?.dataset.stageLabel || "-";
  dom.battleScenePanel.dataset.playerStageKey =
    dom.battleScenePlayerStage?.dataset.stageKey || "player_idle";
  dom.battleScenePanel.dataset.playerName =
    dom.battleScenePlayerStage?.dataset.playerName || "-";
  dom.battleScenePanel.dataset.playerStageName =
    dom.battleScenePlayerStage?.dataset.stageName || "-";
  dom.battleScenePanel.dataset.enemyStageLabel =
    dom.battleSceneEnemyStage?.dataset.stageLabel || "-";
  dom.battleScenePanel.dataset.enemyStageKey =
    dom.battleSceneEnemyStage?.dataset.stageKey || "enemy_idle";
  dom.battleScenePanel.dataset.enemyWorldLabel =
    dom.battleSceneEnemyStage?.dataset.worldLabel || "-";
  dom.battleScenePanel.dataset.enemyQiRequired =
    dom.battleSceneEnemyStage?.dataset.qiRequired || "0";
  dom.battleScenePanel.dataset.playerHpTier =
    dom.battleSceneArena?.dataset.scenePlayerHpTier || "safe";
  dom.battleScenePanel.dataset.playerCastTier =
    dom.battleSceneArena?.dataset.scenePlayerCastTier || "low";
  dom.battleScenePanel.dataset.enemyHpTier =
    dom.battleSceneArena?.dataset.sceneEnemyHpTier || "safe";
  dom.battleScenePanel.dataset.enemyCastTier =
    dom.battleSceneArena?.dataset.sceneEnemyCastTier || "low";
  dom.battleScenePanel.dataset.playerHpPct =
    dom.battleSceneArena?.dataset.scenePlayerHpPct || "100";
  dom.battleScenePanel.dataset.playerCastPct =
    dom.battleSceneArena?.dataset.scenePlayerCastPct || "0";
  dom.battleScenePanel.dataset.enemyHpPct =
    dom.battleSceneArena?.dataset.sceneEnemyHpPct || "100";
  dom.battleScenePanel.dataset.enemyCastPct =
    dom.battleSceneArena?.dataset.sceneEnemyCastPct || "0";
  dom.battleScenePanel.dataset.playerVitalsText =
    String(dom.battleScenePlayerVitals?.textContent || "HP 100% · 기세 0%").trim() ||
    "HP 100% · 기세 0%";
  dom.battleScenePanel.dataset.playerVitalsKey =
    dom.battleScenePlayerVitals?.dataset.vitalsKey || "safe_low";
  dom.battleScenePanel.dataset.playerHpGaugeKey =
    dom.battleScenePlayerHpBar?.dataset.gaugeKey || "hp_safe";
  dom.battleScenePanel.dataset.playerCastGaugeKey =
    dom.battleScenePlayerCastBar?.dataset.gaugeKey || "cast_low";
  dom.battleScenePanel.dataset.enemyVitalsText =
    String(dom.battleSceneEnemyVitals?.textContent || "HP 100% · 기세 0%").trim() ||
    "HP 100% · 기세 0%";
  dom.battleScenePanel.dataset.enemyVitalsKey =
    dom.battleSceneEnemyVitals?.dataset.vitalsKey || "safe_low";
  dom.battleScenePanel.dataset.enemyHpGaugeKey =
    dom.battleSceneEnemyHpBar?.dataset.gaugeKey || "hp_safe";
  dom.battleScenePanel.dataset.enemyCastGaugeKey =
    dom.battleSceneEnemyCastBar?.dataset.gaugeKey || "cast_low";
  dom.battleScenePanel.dataset.lead =
    dom.battleSceneArena?.dataset.sceneLead || "even";
  dom.battleScenePanel.dataset.danger =
    dom.battleSceneArena?.dataset.sceneDanger || "none";
  dom.battleScenePanel.dataset.leadEffect =
    dom.battleSceneArena?.dataset.sceneLeadEffect || "idle";
  dom.battleScenePanel.dataset.pressureEffect =
    dom.battleSceneArena?.dataset.scenePressureEffect || "idle";
  dom.battleScenePanel.dataset.dangerEffect =
    dom.battleSceneArena?.dataset.sceneDangerEffect || "idle";
  dom.battleScenePanel.dataset.comboEffect =
    dom.battleSceneArena?.dataset.sceneComboEffect || "idle";
  dom.battleScenePanel.dataset.ambientImpact =
    dom.battleSceneArena?.dataset.sceneAmbientImpact || "idle";
  dom.battleScenePanel.dataset.ambientImpactLock =
    dom.battleSceneArena?.dataset.sceneAmbientImpactLock || "free";
  dom.battleScenePanel.dataset.ambientImpactGate =
    dom.battleSceneArena?.dataset.sceneAmbientImpactGate || "no_signal";
  dom.battleScenePanel.dataset.ambientImpactFresh =
    dom.battleSceneArena?.dataset.sceneAmbientImpactFresh || "none";
  dom.battleScenePanel.dataset.ambientImpactActive =
    dom.battleSceneArena?.dataset.sceneAmbientImpactActive || "none";
  dom.battleScenePanel.dataset.ambientImpactSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactSource || "idle";
  dom.battleScenePanel.dataset.ambientImpactKind =
    dom.battleSceneArena?.dataset.sceneAmbientImpactKind || "none";
  dom.battleScenePanel.dataset.ambientImpactTone =
    dom.battleSceneArena?.dataset.sceneAmbientImpactTone || "none";
  dom.battleScenePanel.dataset.ambientImpactOutcomeCode =
    dom.battleSceneArena?.dataset.sceneAmbientImpactOutcomeCode || "none";
  dom.battleScenePanel.dataset.ambientImpactOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactSyncDuel =
    dom.battleSceneArena?.dataset.sceneAmbientImpactSyncDuel || "off";
  dom.battleScenePanel.dataset.ambientImpactOriginSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactOriginSource || "none";
  dom.battleScenePanel.dataset.ambientImpactOriginKind =
    dom.battleSceneArena?.dataset.sceneAmbientImpactOriginKind || "none";
  dom.battleScenePanel.dataset.ambientImpactOriginTone =
    dom.battleSceneArena?.dataset.sceneAmbientImpactOriginTone || "none";
  dom.battleScenePanel.dataset.ambientImpactOriginOutcomeCode =
    dom.battleSceneArena?.dataset.sceneAmbientImpactOriginOutcomeCode || "none";
  dom.battleScenePanel.dataset.ambientImpactOriginOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactOriginOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactOriginSyncDuel =
    dom.battleSceneArena?.dataset.sceneAmbientImpactOriginSyncDuel || "off";
  dom.battleScenePanel.dataset.ambientImpactRandomState =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomState || "idle";
  dom.battleScenePanel.dataset.ambientImpactRandomRecoverySource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomRecoverySource || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomRecoveryOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomRecoveryOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactRandomRecoveryMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomRecoveryMs || "0";
  dom.battleScenePanel.dataset.ambientImpactRandomRecoveryMaxMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomRecoveryMaxMs || "1400";
  dom.battleScenePanel.dataset.ambientImpactRandomCadenceSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomCadenceSource || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomCadenceOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomCadenceOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactRandomCadenceDivisor =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomCadenceDivisor || "2";
  dom.battleScenePanel.dataset.ambientImpactRandomProbabilitySource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomProbabilitySource || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomProbabilityOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomProbabilityOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactRandomProbabilityScalePct =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomProbabilityScalePct || "100";
  dom.battleScenePanel.dataset.ambientImpactRandomKindSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomKindSource || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomKindProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomKindProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactRandomKind =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomKind || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomTone =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomTone || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomOutcomeSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomOutcomeSource || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactRandomOutcomeCode =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomOutcomeCode || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomSyncSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomSyncSource || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomSyncOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomSyncOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactRandomSyncDuel =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomSyncDuel || "on";
  dom.battleScenePanel.dataset.ambientImpactRandomQuietSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomQuietSource || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomQuietOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomQuietOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactRandomQuietThresholdMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomQuietThresholdMs || "2200";
  dom.battleScenePanel.dataset.ambientImpactRandomResidueSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomResidueSource || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomResidueKind =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomResidueKind || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomResidueTone =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomResidueTone || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomResidueOutcomeCode =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomResidueOutcomeCode || "none";
  dom.battleScenePanel.dataset.ambientImpactRandomResidueSyncDuel =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomResidueSyncDuel || "on";
  dom.battleScenePanel.dataset.ambientImpactRandomResidueOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactRandomResidueOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactReplay =
    dom.battleSceneArena?.dataset.sceneAmbientImpactReplay || "0";
  dom.battleScenePanel.dataset.ambientImpactReplaySource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactReplaySource || "none";
  dom.battleScenePanel.dataset.ambientImpactReplayOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactReplayOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactReplayMax =
    dom.battleSceneArena?.dataset.sceneAmbientImpactReplayMax || "3";
  dom.battleScenePanel.dataset.ambientImpactReplayRemaining =
    dom.battleSceneArena?.dataset.sceneAmbientImpactReplayRemaining || "3";
  dom.battleScenePanel.dataset.ambientImpactCooldownMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactCooldownMs || "0";
  dom.battleScenePanel.dataset.ambientImpactCooldownSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactCooldownSource || "none";
  dom.battleScenePanel.dataset.ambientImpactCooldownOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactCooldownOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactCooldownMaxMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactCooldownMaxMs || "960";
  dom.battleScenePanel.dataset.ambientImpactPriorityRemainingMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactPriorityRemainingMs || "0";
  dom.battleScenePanel.dataset.ambientImpactPrioritySource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactPrioritySource || "none";
  dom.battleScenePanel.dataset.ambientImpactPriorityOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactPriorityOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactPriorityMaxMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactPriorityMaxMs || "6800";
  dom.battleScenePanel.dataset.ambientImpactSignalAgeSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactSignalAgeSource || "none";
  dom.battleScenePanel.dataset.ambientImpactSignalAgeOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactSignalAgeOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactSignalAgeMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactSignalAgeMs || "0";
  dom.battleScenePanel.dataset.ambientImpactSignalAgeMaxMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactSignalAgeMaxMs || "6800";
  dom.battleScenePanel.dataset.ambientImpactExplicitSeq =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitSeq || "0";
  dom.battleScenePanel.dataset.ambientImpactExplicitSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitSource || "none";
  dom.battleScenePanel.dataset.ambientImpactExplicitKind =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitKind || "none";
  dom.battleScenePanel.dataset.ambientImpactExplicitTone =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitTone || "none";
  dom.battleScenePanel.dataset.ambientImpactExplicitOutcomeCode =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitOutcomeCode || "none";
  dom.battleScenePanel.dataset.ambientImpactExplicitOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactExplicitSyncDuel =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitSyncDuel || "off";
  dom.battleScenePanel.dataset.ambientImpactExplicitAgeMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitAgeMs || "0";
  dom.battleScenePanel.dataset.ambientImpactExplicitRecoveryMaxMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitRecoveryMaxMs || "1400";
  dom.battleScenePanel.dataset.ambientImpactExplicitQuietThresholdMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitQuietThresholdMs || "2200";
  dom.battleScenePanel.dataset.ambientImpactExplicitRecoveryRemainingMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitRecoveryRemainingMs || "0";
  dom.battleScenePanel.dataset.ambientImpactExplicitQuietRemainingMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitQuietRemainingMs || "0";
  dom.battleScenePanel.dataset.ambientImpactExplicitGate =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitGate || "no_signal";
  dom.battleScenePanel.dataset.ambientImpactExplicitFresh =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitFresh || "none";
  dom.battleScenePanel.dataset.ambientImpactExplicitActive =
    dom.battleSceneArena?.dataset.sceneAmbientImpactExplicitActive || "none";
  dom.battleScenePanel.dataset.ambientImpactResultSource =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultSource || "none";
  dom.battleScenePanel.dataset.ambientImpactResultKind =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultKind || "none";
  dom.battleScenePanel.dataset.ambientImpactResultTone =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultTone || "none";
  dom.battleScenePanel.dataset.ambientImpactResultOutcomeCode =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultOutcomeCode || "none";
  dom.battleScenePanel.dataset.ambientImpactResultOutcomeProfile =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultOutcomeProfile || "neutral";
  dom.battleScenePanel.dataset.ambientImpactResultSyncDuel =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultSyncDuel || "off";
  dom.battleScenePanel.dataset.ambientImpactResultExplicitSeq =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultExplicitSeq || "0";
  dom.battleScenePanel.dataset.ambientImpactResultSignalAgeMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultSignalAgeMs || "0";
  dom.battleScenePanel.dataset.ambientImpactResultSignalAgeMaxMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultSignalAgeMaxMs || "6800";
  dom.battleScenePanel.dataset.ambientImpactResultReplayCount =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultReplayCount || "0";
  dom.battleScenePanel.dataset.ambientImpactResultReplayMax =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultReplayMax || "0";
  dom.battleScenePanel.dataset.ambientImpactResultReplayRemaining =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultReplayRemaining || "0";
  dom.battleScenePanel.dataset.ambientImpactResultCooldownMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultCooldownMs || "0";
  dom.battleScenePanel.dataset.ambientImpactResultCooldownMaxMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultCooldownMaxMs || "960";
  dom.battleScenePanel.dataset.ambientImpactResultPriorityRemainingMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultPriorityRemainingMs || "0";
  dom.battleScenePanel.dataset.ambientImpactResultPriorityMaxMs =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultPriorityMaxMs || "6800";
  dom.battleScenePanel.dataset.ambientImpactResultGate =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultGate || "no_signal";
  dom.battleScenePanel.dataset.ambientImpactResultFresh =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultFresh || "none";
  dom.battleScenePanel.dataset.ambientImpactResultActive =
    dom.battleSceneArena?.dataset.sceneAmbientImpactResultActive || "none";
  dom.battleScenePanel.dataset.ambientImpactSignalSeq =
    dom.battleSceneArena?.dataset.sceneAmbientImpactSignalSeq || "0";
  dom.battleScenePanel.dataset.statusTone =
    dom.battleSceneStatus?.dataset.tone || "info";
  dom.battleScenePanel.dataset.statusText =
    String(dom.battleSceneStatus?.textContent || BATTLE_SCENE_DEFAULT_STATUS).trim() ||
    BATTLE_SCENE_DEFAULT_STATUS;
  dom.battleScenePanel.dataset.statusState =
    dom.battleSceneStatus?.dataset.messageState || "idle";
  dom.battleScenePanel.dataset.statusSource =
    dom.battleSceneStatus?.dataset.messageSource || "idle";
  dom.battleScenePanel.dataset.statusKey =
    dom.battleSceneStatus?.dataset.messageKey || "idle";
  dom.battleScenePanel.dataset.resultTone =
    dom.battleSceneResult?.dataset.tone || "info";
  dom.battleScenePanel.dataset.resultText =
    String(dom.battleSceneResult?.textContent || BATTLE_SCENE_DEFAULT_RESULT).trim() ||
    BATTLE_SCENE_DEFAULT_RESULT;
  dom.battleScenePanel.dataset.resultState =
    dom.battleSceneResult?.dataset.messageState || "idle";
  dom.battleScenePanel.dataset.resultSource =
    dom.battleSceneResult?.dataset.messageSource || "idle";
  dom.battleScenePanel.dataset.resultKey =
    dom.battleSceneResult?.dataset.messageKey || "idle";
  dom.battleScenePanel.dataset.tickerTone =
    dom.battleSceneTicker?.dataset.tone || "info";
  dom.battleScenePanel.dataset.tickerText =
    String(dom.battleSceneTicker?.textContent || BATTLE_SCENE_DEFAULT_TICKER).trim() ||
    BATTLE_SCENE_DEFAULT_TICKER;
  dom.battleScenePanel.dataset.tickerState =
    dom.battleSceneTicker?.dataset.messageState || "idle";
  dom.battleScenePanel.dataset.tickerSource =
    dom.battleSceneTicker?.dataset.messageSource || "idle";
  dom.battleScenePanel.dataset.tickerKey =
    dom.battleSceneTicker?.dataset.messageKey || "idle";
  dom.battleScenePanel.dataset.tickerQueueCount =
    dom.battleSceneTicker?.dataset.queueCount || "0";
  dom.battleScenePanel.dataset.round =
    dom.battleSceneRoundBadge?.dataset.round || "1";
  dom.battleScenePanel.dataset.roundBadgeKey =
    dom.battleSceneRoundBadge?.dataset.badgeKey || "round_idle";
  dom.battleScenePanel.dataset.roundBadgeTone =
    dom.battleSceneRoundBadge?.dataset.tone || "info";
  dom.battleScenePanel.dataset.comboCount =
    dom.battleSceneComboBadge?.dataset.comboCount || "0";
  dom.battleScenePanel.dataset.comboTier =
    dom.battleSceneComboBadge?.dataset.comboTier || "calm";
  dom.battleScenePanel.dataset.comboBadgeKey =
    dom.battleSceneComboBadge?.dataset.badgeKey || "combo_calm";
  dom.battleScenePanel.dataset.comboBadgeTone =
    dom.battleSceneComboBadge?.dataset.tone || "info";
  dom.battleScenePanel.dataset.dpsScore =
    dom.battleSceneDpsBadge?.dataset.dpsScore || "0";
  dom.battleScenePanel.dataset.pressure =
    dom.battleSceneDpsBadge?.dataset.pressure || "low";
  dom.battleScenePanel.dataset.dpsBadgeKey =
    dom.battleSceneDpsBadge?.dataset.badgeKey || "pressure_low";
  dom.battleScenePanel.dataset.dpsBadgeTone =
    dom.battleSceneDpsBadge?.dataset.tone || "info";
  dom.battleScenePanel.dataset.flashTone =
    dom.battleSceneFlash?.dataset.tone || "info";
  dom.battleScenePanel.dataset.flashActive =
    dom.battleSceneFlash?.dataset.flashActive || "false";
  dom.battleScenePanel.dataset.floatCount =
    dom.battleSceneFloatLayer?.dataset.floatCount || "0";
  dom.battleScenePanel.dataset.sparkCount =
    dom.battleSceneSparkLayer?.dataset.sparkCount || "0";
  dom.battleScenePanel.dataset.trailCount =
    dom.battleSceneTrailLayer?.dataset.trailCount || "0";
  dom.battleScenePanel.dataset.shockwaveCount =
    dom.battleSceneShockwaveLayer?.dataset.shockwaveCount || "0";
  dom.battleScenePanel.dataset.skillBannerState =
    dom.battleSceneSkillBanner?.dataset.bannerState || "idle";
  dom.battleScenePanel.dataset.skillBannerText =
    String(dom.battleSceneSkillBanner?.textContent || "기세 수렴").trim() ||
    "기세 수렴";
  dom.battleScenePanel.dataset.skillBannerSource =
    dom.battleSceneSkillBanner?.dataset.bannerSource || "idle";
  dom.battleScenePanel.dataset.skillBannerKey =
    dom.battleSceneSkillBanner?.dataset.bannerKey || "idle";
  dom.battleScenePanel.dataset.skillBannerTone =
    dom.battleSceneSkillBanner?.dataset.tone || "info";
  dom.battleScenePanel.dataset.skillBannerActor =
    dom.battleSceneSkillBanner?.dataset.bannerActor || "none";
  dom.battleScenePanel.dataset.skillLabel =
    dom.battleSceneSkillBanner?.dataset.skillLabel || "none";
  dom.battleScenePanel.dataset.comboBannerState =
    dom.battleSceneComboBanner?.dataset.bannerState || "idle";
  dom.battleScenePanel.dataset.comboBannerText =
    String(dom.battleSceneComboBanner?.textContent || "연격 x3").trim() ||
    "연격 x3";
  dom.battleScenePanel.dataset.comboBannerSource =
    dom.battleSceneComboBanner?.dataset.bannerSource || "idle";
  dom.battleScenePanel.dataset.comboBannerKey =
    dom.battleSceneComboBanner?.dataset.bannerKey || "idle";
  dom.battleScenePanel.dataset.comboBannerTone =
    dom.battleSceneComboBanner?.dataset.tone || "info";
  dom.battleScenePanel.dataset.comboBannerTier =
    dom.battleSceneComboBanner?.dataset.tier || "flow";
  dom.battleScenePanel.dataset.comboBannerCount =
    dom.battleSceneComboBanner?.dataset.comboCount || "0";
}

function syncBattleSceneMotionLayerContracts() {
  if (dom.battleSceneFlash) {
    dom.battleSceneFlash.dataset.tone = normalizeBattleSceneTone(
      dom.battleSceneFlash.dataset.tone || "info",
    );
    dom.battleSceneFlash.dataset.flashActive = String(
      dom.battleSceneFlash.classList.contains("is-active"),
    );
  }
  if (dom.battleSceneFloatLayer) {
    dom.battleSceneFloatLayer.dataset.floatCount = String(
      dom.battleSceneFloatLayer.childElementCount,
    );
  }
  if (dom.battleSceneSparkLayer) {
    dom.battleSceneSparkLayer.dataset.sparkCount = String(
      dom.battleSceneSparkLayer.childElementCount,
    );
  }
  if (dom.battleSceneTrailLayer) {
    dom.battleSceneTrailLayer.dataset.trailCount = String(
      dom.battleSceneTrailLayer.childElementCount,
    );
  }
  if (dom.battleSceneShockwaveLayer) {
    dom.battleSceneShockwaveLayer.dataset.shockwaveCount = String(
      dom.battleSceneShockwaveLayer.childElementCount,
    );
  }
  syncBattleScenePanelContract();
}

function applyBattleSceneUiState() {
  if (dom.battleSceneStatus) {
    dom.battleSceneStatus.textContent = battleSceneUiState.statusText;
    applyBattleSceneTone(dom.battleSceneStatus, battleSceneUiState.statusTone);
    dom.battleSceneStatus.dataset.messageState =
      battleSceneUiState.statusText === BATTLE_SCENE_DEFAULT_STATUS ? "idle" : "active";
    dom.battleSceneStatus.dataset.messageSource = normalizeBattleSceneMessageSource(
      battleSceneUiState.statusSource,
    );
    dom.battleSceneStatus.dataset.messageKey = normalizeBattleSceneMessageKey(
      battleSceneUiState.statusKey,
    );
  }
  if (dom.battleSceneResult) {
    dom.battleSceneResult.textContent = battleSceneUiState.resultText;
    applyBattleSceneTone(dom.battleSceneResult, battleSceneUiState.resultTone);
    dom.battleSceneResult.dataset.messageState =
      battleSceneUiState.resultText === BATTLE_SCENE_DEFAULT_RESULT ? "idle" : "active";
    dom.battleSceneResult.dataset.messageSource = normalizeBattleSceneMessageSource(
      battleSceneUiState.resultSource,
    );
    dom.battleSceneResult.dataset.messageKey = normalizeBattleSceneMessageKey(
      battleSceneUiState.resultKey,
    );
  }
  syncBattleScenePanelContract();
}

function setBattleSceneStatus(text, tone = "info", source = "ambient", key = "idle") {
  battleSceneUiState.statusText = String(text || BATTLE_SCENE_DEFAULT_STATUS);
  battleSceneUiState.statusTone = normalizeBattleSceneTone(tone);
  battleSceneUiState.statusSource =
    battleSceneUiState.statusText === BATTLE_SCENE_DEFAULT_STATUS
      ? "idle"
      : normalizeBattleSceneMessageSource(source);
  battleSceneUiState.statusKey =
    battleSceneUiState.statusText === BATTLE_SCENE_DEFAULT_STATUS
      ? "idle"
      : normalizeBattleSceneMessageKey(key);
  applyBattleSceneUiState();
}

function setBattleSceneResult(text, tone = "info", source = "ambient", key = "idle") {
  battleSceneUiState.resultText = String(text || BATTLE_SCENE_DEFAULT_RESULT);
  battleSceneUiState.resultTone = normalizeBattleSceneTone(tone);
  battleSceneUiState.resultSource =
    battleSceneUiState.resultText === BATTLE_SCENE_DEFAULT_RESULT
      ? "idle"
      : normalizeBattleSceneMessageSource(source);
  battleSceneUiState.resultKey =
    battleSceneUiState.resultText === BATTLE_SCENE_DEFAULT_RESULT
      ? "idle"
      : normalizeBattleSceneMessageKey(key);
  applyBattleSceneUiState();
}

function applyBattleSceneTickerTone(tone = "info") {
  if (!dom.battleSceneTicker) {
    return;
  }
  applyBattleSceneTone(dom.battleSceneTicker, tone);
}

function renderBattleSceneTicker() {
  if (!dom.battleSceneTicker) {
    return;
  }
  const latest = battleSceneTickerState.items[0];
  dom.battleSceneTicker.dataset.queueCount = String(battleSceneTickerState.items.length);
  if (!latest) {
    dom.battleSceneTicker.textContent = BATTLE_SCENE_DEFAULT_TICKER;
    applyBattleSceneTickerTone("info");
    dom.battleSceneTicker.dataset.messageState = "idle";
    dom.battleSceneTicker.dataset.messageSource = "idle";
    dom.battleSceneTicker.dataset.messageKey = "idle";
    syncBattleScenePanelContract();
    return;
  }
  dom.battleSceneTicker.textContent = latest.message;
  applyBattleSceneTickerTone(latest.tone);
  dom.battleSceneTicker.dataset.messageState = "active";
  dom.battleSceneTicker.dataset.messageSource = normalizeBattleSceneMessageSource(latest.source);
  dom.battleSceneTicker.dataset.messageKey = normalizeBattleSceneMessageKey(latest.key);
  syncBattleScenePanelContract();
}

function pushBattleSceneTicker(message, tone = "info", source = "ambient", key = "") {
  const normalizedMessage = String(message || "").trim();
  if (!normalizedMessage) {
    return;
  }
  const normalizedSource = normalizeBattleSceneMessageSource(source);
  battleSceneTickerState.items.unshift({
    message: normalizedMessage,
    tone: normalizeBattleSceneTone(tone),
    source: normalizedSource,
    key: normalizeBattleSceneMessageKey(key || `${normalizedSource}_ticker`),
    atMs: Date.now(),
  });
  if (battleSceneTickerState.items.length > BATTLE_SCENE_TICKER_MAX) {
    battleSceneTickerState.items.length = BATTLE_SCENE_TICKER_MAX;
  }
  renderBattleSceneTicker();
}

function clearBattleSceneTicker() {
  battleSceneTickerState.items.length = 0;
  renderBattleSceneTicker();
}

function applyBattleSceneChipTone(node, tone = "info") {
  if (!node) {
    return;
  }
  node.dataset.tone = normalizeBattleSceneTone(tone);
}

function setBattleSceneSkillBanner(label, tone = "info", source = "ambient", options = {}) {
  if (!dom.battleSceneSkillBanner) {
    return;
  }
  const normalizedTone = normalizeBattleSceneTone(tone);
  const bannerKey = normalizeBattleSceneBannerKey(
    options.key || `${normalizeBattleSceneMessageSource(source)}_banner`,
  );
  const bannerActor = normalizeBattleSceneBannerActor(options.actor);
  const skillLabel = String(options.skillLabel || "").trim() || "none";
  dom.battleSceneSkillBanner.textContent = String(label || "기세 수렴");
  dom.battleSceneSkillBanner.dataset.tone = normalizedTone;
  dom.battleSceneSkillBanner.dataset.bannerState = "active";
  dom.battleSceneSkillBanner.dataset.bannerSource = normalizeBattleSceneMessageSource(source);
  dom.battleSceneSkillBanner.dataset.bannerKey = bannerKey;
  dom.battleSceneSkillBanner.dataset.bannerActor = bannerActor;
  dom.battleSceneSkillBanner.dataset.skillLabel = skillLabel;
  dom.battleSceneSkillBanner.classList.remove("is-active", ...BATTLE_SCENE_TONE_CLASSES);
  dom.battleSceneSkillBanner.classList.add(`tone-${normalizedTone}`);
  dom.battleSceneSkillBanner.setAttribute("aria-hidden", "false");
  void dom.battleSceneSkillBanner.offsetWidth;
  dom.battleSceneSkillBanner.classList.add("is-active");
  syncBattleScenePanelContract();
  if (battleSceneSkillBannerTimer !== null) {
    window.clearTimeout(battleSceneSkillBannerTimer);
  }
  battleSceneSkillBannerTimer = window.setTimeout(() => {
    if (dom.battleSceneSkillBanner) {
      dom.battleSceneSkillBanner.classList.remove("is-active");
      dom.battleSceneSkillBanner.setAttribute("aria-hidden", "true");
      dom.battleSceneSkillBanner.dataset.bannerState = "idle";
      dom.battleSceneSkillBanner.dataset.bannerSource = "idle";
      dom.battleSceneSkillBanner.dataset.bannerKey = "idle";
      dom.battleSceneSkillBanner.dataset.bannerActor = "none";
      dom.battleSceneSkillBanner.dataset.skillLabel = "none";
      syncBattleScenePanelContract();
    }
    battleSceneSkillBannerTimer = null;
  }, 860);
}

function resolveBattleSceneComboBannerTier(comboInput) {
  const combo = Math.max(0, Math.floor(Number(comboInput) || 0));
  if (combo >= 11) {
    return "overdrive";
  }
  if (combo >= 7) {
    return "surge";
  }
  if (combo >= 3) {
    return "flow";
  }
  return "flow";
}

function clearBattleSceneComboBanner() {
  if (battleSceneComboBannerTimer !== null) {
    window.clearTimeout(battleSceneComboBannerTimer);
    battleSceneComboBannerTimer = null;
  }
  if (!dom.battleSceneComboBanner) {
    return;
  }
  dom.battleSceneComboBanner.classList.remove(
    "is-active",
    ...BATTLE_SCENE_TONE_CLASSES,
    ...BATTLE_SCENE_COMBO_BANNER_TIER_CLASSES,
  );
  dom.battleSceneComboBanner.classList.add("tier-flow", "tone-info");
  dom.battleSceneComboBanner.dataset.tone = "info";
  dom.battleSceneComboBanner.dataset.tier = "flow";
  dom.battleSceneComboBanner.dataset.comboCount = "0";
  dom.battleSceneComboBanner.dataset.bannerState = "idle";
  dom.battleSceneComboBanner.dataset.bannerSource = "idle";
  dom.battleSceneComboBanner.dataset.bannerKey = "idle";
  dom.battleSceneComboBanner.setAttribute("aria-hidden", "true");
  syncBattleScenePanelContract();
}

function setBattleSceneComboBanner(comboInput, tone = "info", source = "ambient") {
  if (!dom.battleSceneComboBanner) {
    return;
  }
  const combo = Math.max(0, Math.floor(Number(comboInput) || 0));
  if (combo < 3) {
    clearBattleSceneComboBanner();
    return;
  }
  const tier = resolveBattleSceneComboBannerTier(combo);
  const normalizedTone = normalizeBattleSceneTone(tone);
  const label =
    tier === "overdrive"
      ? `난무 연격 x${combo}`
      : tier === "surge"
        ? `폭주 연격 x${combo}`
        : `연격 x${combo}`;
  dom.battleSceneComboBanner.textContent = label;
  dom.battleSceneComboBanner.dataset.tone = normalizedTone;
  dom.battleSceneComboBanner.dataset.tier = tier;
  dom.battleSceneComboBanner.dataset.comboCount = String(combo);
  dom.battleSceneComboBanner.dataset.bannerState = "active";
  dom.battleSceneComboBanner.dataset.bannerSource = normalizeBattleSceneMessageSource(source);
  dom.battleSceneComboBanner.dataset.bannerKey =
    tier === "overdrive" ? "combo_overdrive" : tier === "surge" ? "combo_surge" : "combo_flow";
  dom.battleSceneComboBanner.classList.remove(
    "is-active",
    ...BATTLE_SCENE_TONE_CLASSES,
    ...BATTLE_SCENE_COMBO_BANNER_TIER_CLASSES,
  );
  dom.battleSceneComboBanner.classList.add(`tone-${normalizedTone}`, `tier-${tier}`);
  dom.battleSceneComboBanner.setAttribute("aria-hidden", "false");
  void dom.battleSceneComboBanner.offsetWidth;
  dom.battleSceneComboBanner.classList.add("is-active");
  syncBattleScenePanelContract();
  if (battleSceneComboBannerTimer !== null) {
    window.clearTimeout(battleSceneComboBannerTimer);
  }
  const holdMs = tier === "overdrive" ? 1040 : tier === "surge" ? 920 : 780;
  battleSceneComboBannerTimer = window.setTimeout(() => {
    if (dom.battleSceneComboBanner) {
      dom.battleSceneComboBanner.classList.remove("is-active");
      dom.battleSceneComboBanner.setAttribute("aria-hidden", "true");
      dom.battleSceneComboBanner.dataset.bannerState = "idle";
      dom.battleSceneComboBanner.dataset.bannerSource = "idle";
      dom.battleSceneComboBanner.dataset.bannerKey = "idle";
      dom.battleSceneComboBanner.dataset.comboCount = "0";
      syncBattleScenePanelContract();
    }
    battleSceneComboBannerTimer = null;
  }, holdMs);
}

function resolveBattleSceneDpsTone(momentum) {
  if (momentum >= 22) {
    return "success";
  }
  if (momentum >= 11) {
    return "warn";
  }
  return "info";
}

function renderBattleSceneCombatMetrics() {
  const loopMode = resolveBattleSceneAmbientMode();
  const comboTier = resolveBattleSceneComboTier(battleSceneDuelState.combo);
  if (dom.battleSceneRoundBadge) {
    dom.battleSceneRoundBadge.textContent = `${battleSceneDuelState.round}R`;
    applyBattleSceneChipTone(dom.battleSceneRoundBadge, "info");
    dom.battleSceneRoundBadge.dataset.round = String(battleSceneDuelState.round);
    dom.battleSceneRoundBadge.dataset.loop = loopMode;
    dom.battleSceneRoundBadge.dataset.badgeKey = `round_${loopMode}`;
  }
  if (dom.battleSceneArena) {
    dom.battleSceneArena.dataset.sceneRound = String(battleSceneDuelState.round);
  }
  if (dom.battleSceneComboBadge) {
    dom.battleSceneComboBadge.textContent = `연격 x${battleSceneDuelState.combo}`;
    const comboTone =
      battleSceneDuelState.combo >= 9
        ? "error"
        : battleSceneDuelState.combo >= 5
          ? "warn"
          : battleSceneDuelState.combo >= 2
            ? "success"
          : "info";
    applyBattleSceneChipTone(dom.battleSceneComboBadge, comboTone);
    dom.battleSceneComboBadge.dataset.comboCount = String(battleSceneDuelState.combo);
    dom.battleSceneComboBadge.dataset.comboTier = comboTier;
    dom.battleSceneComboBadge.dataset.badgeKey = `combo_${comboTier}`;
  }
  if (dom.battleSceneArena) {
    dom.battleSceneArena.dataset.sceneComboCount = String(battleSceneDuelState.combo);
  }
  if (dom.battleSceneDpsBadge) {
    const pressureScore = Math.max(
      0,
      Math.round(
        (battleSceneDuelState.dpsMomentum * 1000) /
          BATTLE_SCENE_AMBIENT_TICK_MS,
      ),
    );
    dom.battleSceneDpsBadge.textContent = `압력 ${pressureScore}`;
    applyBattleSceneChipTone(
      dom.battleSceneDpsBadge,
      resolveBattleSceneDpsTone(pressureScore),
    );
    dom.battleSceneDpsBadge.dataset.dpsScore = String(pressureScore);
    dom.battleSceneDpsBadge.dataset.pressure = battleSceneDuelState.pressure;
    dom.battleSceneDpsBadge.dataset.badgeKey = `pressure_${battleSceneDuelState.pressure}`;
    if (dom.battleSceneArena) {
      dom.battleSceneArena.dataset.sceneDpsScore = String(pressureScore);
    }
  }
  syncBattleScenePanelContract();
}

function setBattleSceneState(sceneState = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  dom.battleSceneArena.dataset.sceneState = String(sceneState || "idle");
  syncBattleScenePanelContract();
}

function setBattleSceneImpactCue(cue = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  dom.battleSceneArena.dataset.sceneImpactCue = String(cue || "idle");
}

function setBattleSceneImpactKinetic(cue = "normal") {
  if (!dom.battleSceneArena) {
    return;
  }
  dom.battleSceneArena.dataset.sceneImpactKinetic = String(cue || "normal");
}

function setBattleSceneImpactVfx(cue = "normal") {
  if (!dom.battleSceneArena) {
    return;
  }
  dom.battleSceneArena.dataset.sceneImpactVfx = String(cue || "normal");
}

function setBattleSceneAmbientImpactSource(source = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  dom.battleSceneArena.dataset.sceneAmbientImpact = String(source || "idle");
}

function setBattleSceneAmbientImpactLock(lockInput = "free") {
  if (!dom.battleSceneArena) {
    return;
  }
  const lock = lockInput === "result" ? "result" : "free";
  dom.battleSceneArena.dataset.sceneAmbientImpactLock = lock;
}

function setBattleSceneAmbientImpactGate(gateInput = "no_signal") {
  if (!dom.battleSceneArena) {
    return;
  }
  const gate =
    gateInput === "fresh"
      ? "fresh"
      : gateInput === "stale_sequence"
        ? "stale_sequence"
        : gateInput === "stale_window"
          ? "stale_window"
          : gateInput === "replay_exhausted"
            ? "replay_exhausted"
            : gateInput === "replay_cooldown"
              ? "replay_cooldown"
              : "no_signal";
  dom.battleSceneArena.dataset.sceneAmbientImpactGate = gate;
}

function setBattleSceneAmbientImpactFresh(statusInput = "none") {
  if (!dom.battleSceneArena) {
    return;
  }
  const status =
    statusInput === "fresh"
      ? "fresh"
      : statusInput === "stale"
        ? "stale"
        : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactFresh = status;
}

function setBattleSceneAmbientImpactActive(activeInput = "none") {
  if (!dom.battleSceneArena) {
    return;
  }
  const active = activeInput === "signal" ? "signal" : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactActive = active;
}

function setBattleSceneAmbientImpactRandomState(stateInput = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  const state =
    stateInput === "suppressed_result_signal"
      ? "suppressed_result_signal"
      : stateInput === "suppressed_replay_cooldown"
        ? "suppressed_replay_cooldown"
        : stateInput === "suppressed_replay_exhausted"
          ? "suppressed_replay_exhausted"
          : stateInput === "suppressed_recovery_window"
            ? "suppressed_recovery_window"
          : stateInput === "ready"
            ? "ready"
            : stateInput === "triggered"
              ? "triggered"
              : "idle";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomState = state;
}

function setBattleSceneAmbientImpactRandomRecoverySource(sourceInput = "none") {
  if (!dom.battleSceneArena) {
    return;
  }
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomRecoverySource = source;
}

function setBattleSceneAmbientImpactRandomCadence(
  divisorInput = BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR,
  sourceInput = "none",
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const divisor = Math.max(
    1,
    Math.round(
      Number(divisorInput) || BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR,
    ),
  );
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomCadenceDivisor =
    String(divisor);
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomCadenceOutcomeProfile =
    outcomeProfile;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomCadenceSource = source;
}

function resolveBattleSceneAmbientRandomImpactDivisor(
  sourceInput,
  outcomeProfileInput = "neutral",
) {
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  if (sourceInput === "battle") {
    if (outcomeProfile === "battle_win") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_WIN;
    }
    if (outcomeProfile === "battle_loss") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_LOSS;
    }
    if (outcomeProfile === "battle_loss_heavy") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_LOSS_HEAVY;
    }
    return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE;
  }
  if (sourceInput === "breakthrough") {
    if (outcomeProfile === "breakthrough_success") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_SUCCESS;
    }
    if (outcomeProfile === "breakthrough_fail_minor") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_FAIL_MINOR;
    }
    if (outcomeProfile === "breakthrough_fail_heavy") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_FAIL_HEAVY;
    }
    if (outcomeProfile === "breakthrough_blocked") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_BLOCKED;
    }
    return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH;
  }
  return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR;
}

function setBattleSceneAmbientImpactRandomProbability(
  scaleInput = BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE,
  sourceInput = "none",
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const scale = Math.max(0, Number(scaleInput) || 0);
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  const scalePct = Math.max(0, Math.round(scale * 100));
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomProbabilitySource =
    source;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomProbabilityOutcomeProfile =
    outcomeProfile;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomProbabilityScalePct =
    String(scalePct);
}

function setBattleSceneAmbientImpactRandomQuietThreshold(
  thresholdMsInput = BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS,
  sourceInput = "none",
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const thresholdMs = Math.max(
    0,
    Math.round(
      Number(thresholdMsInput) || BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS,
    ),
  );
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomQuietSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomQuietOutcomeProfile =
    outcomeProfile;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomQuietThresholdMs =
    String(thresholdMs);
}

function resolveBattleSceneAmbientRandomImpactProbabilityScale(
  sourceInput,
  outcomeProfileInput = "neutral",
) {
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  if (sourceInput === "battle") {
    if (outcomeProfile === "battle_win") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_WIN;
    }
    if (outcomeProfile === "battle_loss") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_LOSS;
    }
    if (outcomeProfile === "battle_loss_heavy") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_LOSS_HEAVY;
    }
    return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE;
  }
  if (sourceInput === "breakthrough") {
    if (outcomeProfile === "breakthrough_success") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_SUCCESS;
    }
    if (outcomeProfile === "breakthrough_fail_minor") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_FAIL_MINOR;
    }
    if (outcomeProfile === "breakthrough_fail_heavy") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_FAIL_HEAVY;
    }
    if (outcomeProfile === "breakthrough_blocked") {
      return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_BLOCKED;
    }
    return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH;
  }
  return BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE;
}

function resolveBattleSceneAmbientRandomQuietThresholdMs(
  sourceInput,
  outcomeProfileInput = "neutral",
) {
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  if (sourceInput === "battle") {
    if (outcomeProfile === "battle_win") {
      return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_WIN;
    }
    if (outcomeProfile === "battle_loss") {
      return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_LOSS;
    }
    if (outcomeProfile === "battle_loss_heavy") {
      return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_LOSS_HEAVY;
    }
    return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE;
  }
  if (sourceInput === "breakthrough") {
    if (outcomeProfile === "breakthrough_success") {
      return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_SUCCESS;
    }
    if (outcomeProfile === "breakthrough_fail_minor") {
      return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_FAIL_MINOR;
    }
    if (outcomeProfile === "breakthrough_fail_heavy") {
      return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_FAIL_HEAVY;
    }
    if (outcomeProfile === "breakthrough_blocked") {
      return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_BLOCKED;
    }
    return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH;
  }
  return BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS;
}

function setBattleSceneAmbientImpactRandomKindProfile(
  profileInput = "neutral",
  sourceInput = "none",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const profile =
    profileInput === "battle_bias" ||
    profileInput === "battle_win_bias" ||
    profileInput === "battle_loss_bias" ||
    profileInput === "battle_loss_heavy_bias" ||
    profileInput === "breakthrough_bias" ||
    profileInput === "breakthrough_success_bias" ||
    profileInput === "breakthrough_fail_minor_bias" ||
    profileInput === "breakthrough_fail_heavy_bias" ||
    profileInput === "breakthrough_blocked_bias"
      ? profileInput
      : "neutral";
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomKindProfile = profile;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomKindSource = source;
}

function setBattleSceneAmbientImpactRandomSignal(
  kindInput = "none",
  toneInput = "none",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const kind =
    typeof kindInput === "string" && kindInput
      ? kindInput
      : "none";
  const tone =
    typeof toneInput === "string" && toneInput
      ? normalizeBattleSceneTone(toneInput)
      : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomKind = kind;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomTone = tone;
}

function resolveBattleSceneAmbientRandomImpactKindProfile(
  sourceInput,
  outcomeProfileInput = "neutral",
) {
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  if (sourceInput === "battle") {
    if (outcomeProfile === "battle_win") {
      return "battle_win_bias";
    }
    if (outcomeProfile === "battle_loss") {
      return "battle_loss_bias";
    }
    if (outcomeProfile === "battle_loss_heavy") {
      return "battle_loss_heavy_bias";
    }
    return "battle_bias";
  }
  if (sourceInput === "breakthrough") {
    if (outcomeProfile === "breakthrough_success") {
      return "breakthrough_success_bias";
    }
    if (outcomeProfile === "breakthrough_fail_minor") {
      return "breakthrough_fail_minor_bias";
    }
    if (outcomeProfile === "breakthrough_fail_heavy") {
      return "breakthrough_fail_heavy_bias";
    }
    if (outcomeProfile === "breakthrough_blocked") {
      return "breakthrough_blocked_bias";
    }
    return "breakthrough_bias";
  }
  return "neutral";
}

function setBattleSceneAmbientImpactRandomOutcomeProfile(
  profileInput = "neutral",
  sourceInput = "none",
  outcomeCodeInput = "none",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const profile =
    profileInput === "battle_win"
      ? "battle_win"
      : profileInput === "battle_loss"
        ? "battle_loss"
        : profileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : profileInput === "breakthrough_success"
            ? "breakthrough_success"
            : profileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : profileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : profileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeCode =
    outcomeCodeInput === "success"
      ? "success"
      : outcomeCodeInput === "minor_fail"
        ? "minor_fail"
        : outcomeCodeInput === "retreat_fail"
          ? "retreat_fail"
          : outcomeCodeInput === "death_fail"
            ? "death_fail"
            : outcomeCodeInput === "blocked_no_qi"
              ? "blocked_no_qi"
              : outcomeCodeInput === "blocked_tribulation_setting"
                ? "blocked_tribulation_setting"
                : outcomeCodeInput === "blocked_auto_risk_policy"
                  ? "blocked_auto_risk_policy"
                  : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomOutcomeProfile = profile;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomOutcomeSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomOutcomeCode =
    outcomeCode;
}

function resolveBattleSceneAmbientRandomOutcomeProfile(
  signalInput,
  sourceInput = "none",
) {
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const signal = signalInput && typeof signalInput === "object" ? signalInput : null;
  const outcome = signal?.outcome && typeof signal.outcome === "object" ? signal.outcome : null;
  if (!outcome) {
    return "neutral";
  }
  if (source === "battle") {
    if (outcome.won === true) {
      return "battle_win";
    }
    const qiLoss = Math.max(0, Math.abs(Math.round(Number(outcome.qiDelta) || 0)));
    return qiLoss >= 18 ? "battle_loss_heavy" : "battle_loss";
  }
  if (source === "breakthrough") {
    const outcomeCode = String(outcome.outcome || "");
    if (outcomeCode === "success") {
      return "breakthrough_success";
    }
    if (outcomeCode === "minor_fail") {
      return "breakthrough_fail_minor";
    }
    if (outcomeCode === "retreat_fail" || outcomeCode === "death_fail") {
      return "breakthrough_fail_heavy";
    }
    if (
      outcomeCode === "blocked_no_qi" ||
      outcomeCode === "blocked_tribulation_setting" ||
      outcomeCode === "blocked_auto_risk_policy"
    ) {
      return "breakthrough_blocked";
    }
  }
  return "neutral";
}

function rollBattleSceneAmbientRandomImpact(
  modeInput,
  sourceInput,
  outcomeProfileInput = "neutral",
) {
  const mode =
    modeInput === "realtime" || modeInput === "auto" ? modeInput : "idle";
  const profile = resolveBattleSceneAmbientRandomImpactKindProfile(
    sourceInput,
    outcomeProfileInput,
  );
  const outcomeProfile =
    outcomeProfileInput === "battle_win" ||
    outcomeProfileInput === "battle_loss" ||
    outcomeProfileInput === "battle_loss_heavy" ||
    outcomeProfileInput === "breakthrough_success" ||
    outcomeProfileInput === "breakthrough_fail_minor" ||
    outcomeProfileInput === "breakthrough_fail_heavy" ||
    outcomeProfileInput === "breakthrough_blocked"
      ? outcomeProfileInput
      : "neutral";
  const random = Math.random();
  if (
    profile === "battle_bias" ||
    profile === "battle_win_bias" ||
    profile === "battle_loss_bias" ||
    profile === "battle_loss_heavy_bias"
  ) {
    const winChance =
      outcomeProfile === "battle_win"
        ? mode === "realtime"
          ? 0.82
          : mode === "auto"
            ? 0.86
            : 0.62
        : outcomeProfile === "battle_loss_heavy"
          ? mode === "realtime"
            ? 0.08
            : mode === "auto"
              ? 0.06
              : 0.24
          : outcomeProfile === "battle_loss"
            ? mode === "realtime"
              ? 0.18
              : mode === "auto"
                ? 0.14
                : 0.34
            : mode === "realtime"
              ? 0.68
              : mode === "auto"
                ? 0.72
                : 0.52;
    const kind = random < winChance ? "battle_win" : "battle_loss";
    if (mode === "realtime") {
      return {
        kind,
        tone:
          kind === "battle_win"
            ? "success"
            : outcomeProfile === "battle_loss_heavy"
              ? "error"
              : "warn",
        profile,
        outcomeProfile,
      };
    }
    if (mode === "auto") {
      return {
        kind,
        tone:
          kind === "battle_win"
            ? "success"
            : outcomeProfile === "battle_loss_heavy"
              ? "error"
              : "warn",
        profile,
        outcomeProfile,
      };
    }
    return {
      kind,
      tone: kind === "battle_win" ? "info" : "warn",
      profile,
      outcomeProfile,
    };
  }
  if (
    profile === "breakthrough_bias" ||
    profile === "breakthrough_success_bias" ||
    profile === "breakthrough_fail_minor_bias" ||
    profile === "breakthrough_fail_heavy_bias" ||
    profile === "breakthrough_blocked_bias"
  ) {
    const successChance =
      outcomeProfile === "breakthrough_success"
        ? mode === "realtime"
          ? 0.78
          : mode === "auto"
            ? 0.58
            : 0.54
        : outcomeProfile === "breakthrough_fail_minor"
          ? mode === "realtime"
            ? 0.24
            : mode === "auto"
              ? 0.18
              : 0.22
          : outcomeProfile === "breakthrough_fail_heavy"
            ? mode === "realtime"
              ? 0.06
              : mode === "auto"
                ? 0.04
                : 0.12
            : outcomeProfile === "breakthrough_blocked"
              ? mode === "realtime"
                ? 0.1
                : mode === "auto"
                  ? 0.08
                  : 0.16
              : mode === "realtime"
                ? 0.58
                : mode === "auto"
                  ? 0.34
                  : 0.42;
    const kind =
      random < successChance ? "breakthrough_success" : "breakthrough_fail";
    if (mode === "realtime") {
      return {
        kind,
        tone:
          kind === "breakthrough_success"
            ? "success"
            : outcomeProfile === "breakthrough_fail_heavy"
              ? "error"
              : "warn",
        profile,
        outcomeProfile,
      };
    }
    if (mode === "auto") {
      return {
        kind,
        tone:
          kind === "breakthrough_success"
            ? "success"
            : outcomeProfile === "breakthrough_blocked"
              ? "warn"
              : "error",
        profile,
        outcomeProfile,
      };
    }
    return {
      kind,
      tone:
        kind === "breakthrough_success"
          ? "info"
          : outcomeProfile === "breakthrough_blocked"
            ? "info"
            : "warn",
      profile,
      outcomeProfile,
    };
  }
  if (mode === "realtime") {
    const kind =
      random < 0.58
        ? "battle_win"
        : random < 0.85
          ? "battle_loss"
          : "breakthrough_success";
    return {
      kind,
      tone: kind === "battle_loss" ? "warn" : "success",
      profile,
      outcomeProfile,
    };
  }
  if (mode === "auto") {
    const kind =
      random < 0.62
        ? "battle_win"
        : random < 0.86
          ? "battle_loss"
          : "breakthrough_fail";
    return {
      kind,
      tone:
        kind === "battle_win"
          ? "success"
          : kind === "battle_loss"
            ? "warn"
            : "error",
      profile,
      outcomeProfile,
    };
  }
  const kind = random < 0.5 ? "battle_win" : "battle_loss";
  return {
    kind,
    tone: kind === "battle_win" ? "info" : "warn",
    profile,
    outcomeProfile,
  };
}

function setBattleSceneAmbientImpactRandomSyncPolicy(
  syncDuelInput = true,
  sourceInput = "none",
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const syncDuel = syncDuelInput === false ? "off" : "on";
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomSyncDuel = syncDuel;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomSyncSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomSyncOutcomeProfile =
    outcomeProfile;
}

function resolveBattleSceneAmbientRandomSyncDuel(
  sourceInput,
  outcomeProfileInput = "neutral",
) {
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  if (sourceInput === "battle") {
    return outcomeProfile === "battle_loss_heavy" ? false : true;
  }
  if (sourceInput === "breakthrough") {
    return outcomeProfile === "breakthrough_success";
  }
  return true;
}

function resolveBattleSceneAmbientRandomRecoveryWindowMs(
  sourceInput,
  outcomeProfileInput = "neutral",
) {
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  if (sourceInput === "battle") {
    if (outcomeProfile === "battle_win") {
      return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_WIN;
    }
    if (outcomeProfile === "battle_loss") {
      return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_LOSS;
    }
    if (outcomeProfile === "battle_loss_heavy") {
      return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_LOSS_HEAVY;
    }
    return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE;
  }
  if (sourceInput === "breakthrough") {
    if (outcomeProfile === "breakthrough_success") {
      return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_SUCCESS;
    }
    if (outcomeProfile === "breakthrough_fail_minor") {
      return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_FAIL_MINOR;
    }
    if (outcomeProfile === "breakthrough_fail_heavy") {
      return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_FAIL_HEAVY;
    }
    if (outcomeProfile === "breakthrough_blocked") {
      return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_BLOCKED;
    }
    return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH;
  }
  return BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS;
}

function setBattleSceneAmbientImpactRandomRecovery(
  remainingMsInput = 0,
  maxMsInput = BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS,
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const remainingMs = Math.max(0, Math.round(Number(remainingMsInput) || 0));
  const maxMs = Math.max(
    0,
    Math.round(
      Number(maxMsInput) ||
        BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS,
    ),
  );
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomRecoveryMs =
    String(remainingMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomRecoveryMaxMs =
    String(maxMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomRecoveryOutcomeProfile =
    outcomeProfile;
}

function setBattleSceneAmbientImpactRandomResidue(
  sourceInput = "none",
  syncDuelInput = true,
  outcomeProfileInput = "neutral",
  kindInput = "none",
  toneInput = "none",
  outcomeCodeInput = "none",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const syncDuel = syncDuelInput === false ? "off" : "on";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                ? "breakthrough_blocked"
                  : "neutral";
  const kind =
    typeof kindInput === "string" && kindInput
      ? kindInput
      : "none";
  const tone =
    typeof toneInput === "string" && toneInput
      ? normalizeBattleSceneTone(toneInput)
      : "none";
  const outcomeCode =
    outcomeCodeInput === "success"
      ? "success"
      : outcomeCodeInput === "minor_fail"
        ? "minor_fail"
        : outcomeCodeInput === "retreat_fail"
          ? "retreat_fail"
          : outcomeCodeInput === "death_fail"
            ? "death_fail"
            : outcomeCodeInput === "blocked_no_qi"
              ? "blocked_no_qi"
              : outcomeCodeInput === "blocked_tribulation_setting"
                ? "blocked_tribulation_setting"
                : outcomeCodeInput === "blocked_auto_risk_policy"
                  ? "blocked_auto_risk_policy"
                  : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueKind = kind;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueTone = tone;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueOutcomeCode =
    outcomeCode;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueSyncDuel =
    syncDuel;
  dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueOutcomeProfile =
    outcomeProfile;
}

function setBattleSceneAmbientImpactSignal(signalInput, sourceInput = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  const signal =
    signalInput && typeof signalInput === "object" ? signalInput : null;
  const source =
    signal?.source === "battle" || signal?.source === "breakthrough"
      ? signal.source
      : sourceInput === "random"
        ? "random"
        : "idle";
  const kind =
    typeof signal?.kind === "string" && signal.kind
      ? signal.kind
      : "none";
  const signalTone =
    typeof signal?.tone === "string" && signal.tone
      ? normalizeBattleSceneTone(signal.tone)
      : "none";
  const outcomeCode =
    typeof signal?.outcome?.outcome === "string" && signal.outcome.outcome
      ? signal.outcome.outcome
      : "none";
  const residueOutcomeCode =
    source === "random" &&
    typeof signal?.residueOutcomeCode === "string" &&
    signal.residueOutcomeCode
      ? signal.residueOutcomeCode
      : "none";
  const residueOriginKind =
    source === "random" &&
    typeof signal?.residueOriginKind === "string" &&
    signal.residueOriginKind
      ? signal.residueOriginKind
      : "none";
  const residueOriginTone =
    source === "random" &&
    typeof signal?.residueOriginTone === "string" &&
    signal.residueOriginTone
      ? normalizeBattleSceneTone(signal.residueOriginTone)
      : "none";
  const residueSource =
    source === "random" &&
    (signal?.residueSource === "battle" || signal?.residueSource === "breakthrough")
      ? signal.residueSource
      : "none";
  const residueSyncDuel = source === "random" ? signal?.syncDuel !== false : true;
  const residueOutcomeProfile =
    source === "random" &&
    (signal?.residueOutcomeProfile === "battle_win" ||
      signal?.residueOutcomeProfile === "battle_loss" ||
      signal?.residueOutcomeProfile === "battle_loss_heavy" ||
      signal?.residueOutcomeProfile === "breakthrough_success" ||
      signal?.residueOutcomeProfile === "breakthrough_fail_minor" ||
      signal?.residueOutcomeProfile === "breakthrough_fail_heavy" ||
      signal?.residueOutcomeProfile === "breakthrough_blocked")
      ? signal.residueOutcomeProfile
      : "neutral";
  const outcomeProfile =
    source === "battle" || source === "breakthrough"
      ? resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(signal)
      : residueOutcomeProfile;
  const signalSyncDuel =
    source === "idle" ? "off" : signal?.syncDuel === false ? "off" : "on";
  const originSource =
    source === "battle" || source === "breakthrough"
      ? source
      : source === "random"
        ? residueSource
        : "none";
  const originOutcomeCode =
    source === "battle" || source === "breakthrough"
      ? outcomeCode
      : source === "random"
        ? residueOutcomeCode
        : "none";
  const originOutcomeProfile =
    source === "battle" || source === "breakthrough"
      ? outcomeProfile
      : source === "random"
        ? residueOutcomeProfile
        : "neutral";
  const originSyncDuel =
    source === "battle" || source === "breakthrough" || source === "random"
      ? signalSyncDuel
      : "off";
  const originKind =
    source === "battle" || source === "breakthrough"
      ? kind
      : source === "random"
        ? residueOriginKind
        : "none";
  const originTone =
    source === "battle" || source === "breakthrough"
      ? signalTone
      : source === "random"
        ? residueOriginTone
        : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactOriginSource = originSource;
  dom.battleSceneArena.dataset.sceneAmbientImpactOriginKind = originKind;
  dom.battleSceneArena.dataset.sceneAmbientImpactOriginTone = originTone;
  dom.battleSceneArena.dataset.sceneAmbientImpactOriginOutcomeCode =
    originOutcomeCode;
  dom.battleSceneArena.dataset.sceneAmbientImpactOriginOutcomeProfile =
    originOutcomeProfile;
  dom.battleSceneArena.dataset.sceneAmbientImpactOriginSyncDuel =
    originSyncDuel;
  setBattleSceneAmbientImpactRandomSignal(
    source === "random" ? kind : "none",
    source === "random" ? signalTone : "none",
  );
  dom.battleSceneArena.dataset.sceneAmbientImpactKind = kind;
  dom.battleSceneArena.dataset.sceneAmbientImpactTone = signalTone;
  dom.battleSceneArena.dataset.sceneAmbientImpactOutcomeCode = outcomeCode;
  dom.battleSceneArena.dataset.sceneAmbientImpactOutcomeProfile =
    outcomeProfile;
  dom.battleSceneArena.dataset.sceneAmbientImpactSyncDuel = signalSyncDuel;
  setBattleSceneAmbientImpactRandomResidue(
    residueSource,
    residueSyncDuel,
    residueOutcomeProfile,
    residueOriginKind,
    residueOriginTone,
    residueOutcomeCode,
  );
}

function resolveBattleSceneResultDrivenAmbientImpactReplayMax(signalInput) {
  const signal =
    signalInput && typeof signalInput === "object" ? signalInput : null;
  const outcomeProfile =
    resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(signal);
  if (signal?.source === "battle") {
    if (outcomeProfile === "battle_win") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_WIN;
    }
    if (outcomeProfile === "battle_loss") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_LOSS;
    }
    if (outcomeProfile === "battle_loss_heavy") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_LOSS_HEAVY;
    }
    return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE;
  }
  if (signal?.source === "breakthrough") {
    if (outcomeProfile === "breakthrough_success") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_SUCCESS;
    }
    if (outcomeProfile === "breakthrough_fail_minor") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_FAIL_MINOR;
    }
    if (outcomeProfile === "breakthrough_fail_heavy") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_FAIL_HEAVY;
    }
    if (outcomeProfile === "breakthrough_blocked") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_BLOCKED;
    }
    return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH;
  }
  return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS;
}

function resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(signalInput) {
  const signal =
    signalInput && typeof signalInput === "object" ? signalInput : null;
  const source =
    signal?.source === "battle" || signal?.source === "breakthrough"
      ? signal.source
      : "none";
  return resolveBattleSceneAmbientRandomOutcomeProfile(signal, source);
}

function resolveBattleSceneResultDrivenAmbientImpactReplayMinIntervalMs(
  signalInput,
) {
  const signal =
    signalInput && typeof signalInput === "object" ? signalInput : null;
  const outcomeProfile =
    resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(signal);
  if (signal?.source === "battle") {
    if (outcomeProfile === "battle_win") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_WIN;
    }
    if (outcomeProfile === "battle_loss") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_LOSS;
    }
    if (outcomeProfile === "battle_loss_heavy") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_LOSS_HEAVY;
    }
    return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE;
  }
  if (signal?.source === "breakthrough") {
    if (outcomeProfile === "breakthrough_success") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_SUCCESS;
    }
    if (outcomeProfile === "breakthrough_fail_minor") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_FAIL_MINOR;
    }
    if (outcomeProfile === "breakthrough_fail_heavy") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_FAIL_HEAVY;
    }
    if (outcomeProfile === "breakthrough_blocked") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_BLOCKED;
    }
    return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH;
  }
  return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS;
}

function resolveBattleSceneResultDrivenAmbientImpactPriorityWindowMs(signalInput) {
  const signal =
    signalInput && typeof signalInput === "object" ? signalInput : null;
  const outcomeProfile =
    resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(signal);
  if (signal?.source === "battle") {
    if (outcomeProfile === "battle_win") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_WIN;
    }
    if (outcomeProfile === "battle_loss") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_LOSS;
    }
    if (outcomeProfile === "battle_loss_heavy") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_LOSS_HEAVY;
    }
    return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE;
  }
  if (signal?.source === "breakthrough") {
    if (outcomeProfile === "breakthrough_success") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_SUCCESS;
    }
    if (outcomeProfile === "breakthrough_fail_minor") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_FAIL_MINOR;
    }
    if (outcomeProfile === "breakthrough_fail_heavy") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_FAIL_HEAVY;
    }
    if (outcomeProfile === "breakthrough_blocked") {
      return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_BLOCKED;
    }
    return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH;
  }
  return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS;
}

function setBattleSceneAmbientImpactReplay(
  countInput = 0,
  maxInput = BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS,
  sourceInput = "none",
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const count = Math.max(0, Math.round(Number(countInput) || 0));
  const replayMax = Math.max(
    1,
    Math.round(
      Number(maxInput) || BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS,
    ),
  );
  const replayRemaining = Math.max(0, replayMax - count);
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  dom.battleSceneArena.dataset.sceneAmbientImpactReplay = String(count);
  dom.battleSceneArena.dataset.sceneAmbientImpactReplayMax = String(replayMax);
  dom.battleSceneArena.dataset.sceneAmbientImpactReplayRemaining =
    String(replayRemaining);
  dom.battleSceneArena.dataset.sceneAmbientImpactReplaySource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactReplayOutcomeProfile =
    outcomeProfile;
}

function setBattleSceneAmbientImpactCooldown(
  cooldownMsInput = 0,
  cooldownMaxMsInput = BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS,
  sourceInput = "none",
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const cooldownMs = Math.max(0, Math.round(Number(cooldownMsInput) || 0));
  const cooldownMaxMs = Math.max(
    0,
    Math.round(
      Number(cooldownMaxMsInput) ||
        BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS,
    ),
  );
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  dom.battleSceneArena.dataset.sceneAmbientImpactCooldownMs =
    String(cooldownMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactCooldownMaxMs =
    String(cooldownMaxMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactCooldownSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactCooldownOutcomeProfile =
    outcomeProfile;
}

function setBattleSceneAmbientImpactPriorityWindow(
  remainingMsInput = 0,
  maxMsInput = BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
  sourceInput = "none",
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const remainingMs = Math.max(0, Math.round(Number(remainingMsInput) || 0));
  const maxMs = Math.max(
    0,
    Math.round(
      Number(maxMsInput) ||
        BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
    ),
  );
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  dom.battleSceneArena.dataset.sceneAmbientImpactPriorityRemainingMs =
    String(remainingMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactPriorityMaxMs = String(maxMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactPrioritySource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactPriorityOutcomeProfile =
    outcomeProfile;
}

function setBattleSceneAmbientImpactSignalAge(
  ageMsInput = 0,
  maxMsInput = BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
  sourceInput = "none",
  outcomeProfileInput = "neutral",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const ageMs = Math.max(0, Math.round(Number(ageMsInput) || 0));
  const maxMs = Math.max(
    0,
    Math.round(
      Number(maxMsInput) ||
        BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
    ),
  );
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  dom.battleSceneArena.dataset.sceneAmbientImpactSignalAgeMs = String(ageMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactSignalAgeMaxMs = String(maxMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactSignalAgeSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactSignalAgeOutcomeProfile =
    outcomeProfile;
}

function setBattleSceneAmbientImpactSequence(
  explicitSeqInput = 0,
  signalSeqInput = 0,
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const explicitSeq = Math.max(0, Math.round(Number(explicitSeqInput) || 0));
  const signalSeq = Math.max(0, Math.round(Number(signalSeqInput) || 0));
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitSeq =
    String(explicitSeq);
  dom.battleSceneArena.dataset.sceneAmbientImpactSignalSeq = String(signalSeq);
}

function setBattleSceneAmbientImpactExplicitSnapshot(
  sourceInput = "none",
  kindInput = "none",
  toneInput = "none",
  outcomeCodeInput = "none",
  outcomeProfileInput = "neutral",
  syncDuelInput = "off",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const source =
    sourceInput === "battle" || sourceInput === "breakthrough"
      ? sourceInput
      : "none";
  const kind =
    typeof kindInput === "string" && kindInput
      ? kindInput
      : "none";
  const tone =
    typeof toneInput === "string" && toneInput
      ? normalizeBattleSceneTone(toneInput)
      : "none";
  const outcomeCode =
    outcomeCodeInput === "success"
      ? "success"
      : outcomeCodeInput === "minor_fail"
        ? "minor_fail"
        : outcomeCodeInput === "retreat_fail"
          ? "retreat_fail"
          : outcomeCodeInput === "death_fail"
            ? "death_fail"
            : outcomeCodeInput === "blocked_no_qi"
              ? "blocked_no_qi"
              : outcomeCodeInput === "blocked_tribulation_setting"
                ? "blocked_tribulation_setting"
                : outcomeCodeInput === "blocked_auto_risk_policy"
                  ? "blocked_auto_risk_policy"
                  : "none";
  const outcomeProfile =
    outcomeProfileInput === "battle_win"
      ? "battle_win"
      : outcomeProfileInput === "battle_loss"
        ? "battle_loss"
        : outcomeProfileInput === "battle_loss_heavy"
          ? "battle_loss_heavy"
          : outcomeProfileInput === "breakthrough_success"
            ? "breakthrough_success"
            : outcomeProfileInput === "breakthrough_fail_minor"
              ? "breakthrough_fail_minor"
              : outcomeProfileInput === "breakthrough_fail_heavy"
                ? "breakthrough_fail_heavy"
                : outcomeProfileInput === "breakthrough_blocked"
                  ? "breakthrough_blocked"
                  : "neutral";
  const syncDuel = syncDuelInput === "on" || syncDuelInput === true ? "on" : "off";
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitKind = kind;
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitTone = tone;
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitOutcomeCode =
    outcomeCode;
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitOutcomeProfile =
    outcomeProfile;
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitSyncDuel = syncDuel;
}

function setBattleSceneAmbientImpactExplicitSnapshotLifecycle(
  ageMsInput = 0,
  recoveryMaxMsInput = BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS,
  quietThresholdMsInput = BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS,
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const ageMs = Math.max(0, Math.round(Number(ageMsInput) || 0));
  const recoveryMaxMs = Math.max(
    0,
    Math.round(
      Number(recoveryMaxMsInput) ||
        BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS,
    ),
  );
  const quietThresholdMs = Math.max(
    0,
    Math.round(
      Number(quietThresholdMsInput) ||
        BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS,
    ),
  );
  const recoveryRemainingMs = Math.max(0, recoveryMaxMs - ageMs);
  const quietRemainingMs = Math.max(0, quietThresholdMs - ageMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitAgeMs = String(ageMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitRecoveryMaxMs =
    String(recoveryMaxMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitQuietThresholdMs =
    String(quietThresholdMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitRecoveryRemainingMs =
    String(recoveryRemainingMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitQuietRemainingMs =
    String(quietRemainingMs);
}

function setBattleSceneAmbientImpactExplicitSnapshotState(
  gateInput = "no_signal",
  freshInput = "none",
  activeInput = "none",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const gate =
    gateInput === "fresh"
      ? "fresh"
      : gateInput === "stale_sequence"
        ? "stale_sequence"
        : gateInput === "stale_window"
          ? "stale_window"
          : gateInput === "replay_exhausted"
            ? "replay_exhausted"
            : gateInput === "replay_cooldown"
              ? "replay_cooldown"
              : "no_signal";
  const fresh =
    freshInput === "fresh"
      ? "fresh"
      : freshInput === "stale"
        ? "stale"
        : "none";
  const active = activeInput === "signal" ? "signal" : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitGate = gate;
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitFresh = fresh;
  dom.battleSceneArena.dataset.sceneAmbientImpactExplicitActive = active;
}

function setBattleSceneAmbientImpactResultSnapshot(signalInput = null) {
  if (!dom.battleSceneArena) {
    return;
  }
  const signal =
    signalInput && typeof signalInput === "object" ? signalInput : null;
  const source =
    signal?.source === "battle" || signal?.source === "breakthrough"
      ? signal.source
      : "none";
  const kind =
    typeof signal?.kind === "string" && signal.kind
      ? signal.kind
      : "none";
  const tone =
    typeof signal?.tone === "string" && signal.tone
      ? normalizeBattleSceneTone(signal.tone)
      : "none";
  const outcomeCode =
    typeof signal?.outcome?.outcome === "string" && signal.outcome.outcome
      ? signal.outcome.outcome
      : "none";
  const outcomeProfile =
    source === "battle" || source === "breakthrough"
      ? resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(signal)
      : "neutral";
  const syncDuel =
    source === "none" ? "off" : signal?.syncDuel === false ? "off" : "on";
  dom.battleSceneArena.dataset.sceneAmbientImpactResultSource = source;
  dom.battleSceneArena.dataset.sceneAmbientImpactResultKind = kind;
  dom.battleSceneArena.dataset.sceneAmbientImpactResultTone = tone;
  dom.battleSceneArena.dataset.sceneAmbientImpactResultOutcomeCode =
    outcomeCode;
  dom.battleSceneArena.dataset.sceneAmbientImpactResultOutcomeProfile =
    outcomeProfile;
  dom.battleSceneArena.dataset.sceneAmbientImpactResultSyncDuel = syncDuel;
}

function setBattleSceneAmbientImpactResultSnapshotLifecycle(
  explicitSeqInput = 0,
  ageMsInput = 0,
  ageMaxMsInput = BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
  replayCountInput = 0,
  replayMaxInput = 0,
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const explicitSeq = Math.max(0, Math.round(Number(explicitSeqInput) || 0));
  const ageMs = Math.max(0, Math.round(Number(ageMsInput) || 0));
  const ageMaxMs = Math.max(
    0,
    Math.round(
      Number(ageMaxMsInput) ||
        BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
    ),
  );
  const replayCount = Math.max(0, Math.round(Number(replayCountInput) || 0));
  const replayMax = Math.max(0, Math.round(Number(replayMaxInput) || 0));
  const replayRemaining = Math.max(0, replayMax - replayCount);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultExplicitSeq =
    String(explicitSeq);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultSignalAgeMs =
    String(ageMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultSignalAgeMaxMs =
    String(ageMaxMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultReplayCount =
    String(replayCount);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultReplayMax =
    String(replayMax);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultReplayRemaining =
    String(replayRemaining);
}

function setBattleSceneAmbientImpactResultSnapshotWindows(
  cooldownMsInput = 0,
  cooldownMaxMsInput = BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS,
  priorityRemainingMsInput = 0,
  priorityMaxMsInput = BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const cooldownMs = Math.max(0, Math.round(Number(cooldownMsInput) || 0));
  const cooldownMaxMs = Math.max(
    0,
    Math.round(
      Number(cooldownMaxMsInput) ||
        BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS,
    ),
  );
  const priorityRemainingMs = Math.max(
    0,
    Math.round(Number(priorityRemainingMsInput) || 0),
  );
  const priorityMaxMs = Math.max(
    0,
    Math.round(
      Number(priorityMaxMsInput) ||
        BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
    ),
  );
  dom.battleSceneArena.dataset.sceneAmbientImpactResultCooldownMs =
    String(cooldownMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultCooldownMaxMs =
    String(cooldownMaxMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultPriorityRemainingMs =
    String(priorityRemainingMs);
  dom.battleSceneArena.dataset.sceneAmbientImpactResultPriorityMaxMs =
    String(priorityMaxMs);
}

function setBattleSceneAmbientImpactResultSnapshotState(
  gateInput = "no_signal",
  freshInput = "none",
  activeInput = "none",
) {
  if (!dom.battleSceneArena) {
    return;
  }
  const gate =
    gateInput === "fresh"
      ? "fresh"
      : gateInput === "stale_sequence"
        ? "stale_sequence"
        : gateInput === "stale_window"
          ? "stale_window"
          : gateInput === "replay_exhausted"
            ? "replay_exhausted"
            : gateInput === "replay_cooldown"
              ? "replay_cooldown"
              : "no_signal";
  const fresh =
    freshInput === "fresh"
      ? "fresh"
      : freshInput === "stale"
        ? "stale"
        : "none";
  const active = activeInput === "signal" ? "signal" : "none";
  dom.battleSceneArena.dataset.sceneAmbientImpactResultGate = gate;
  dom.battleSceneArena.dataset.sceneAmbientImpactResultFresh = fresh;
  dom.battleSceneArena.dataset.sceneAmbientImpactResultActive = active;
}

function isBattleSceneResultDrivenAmbientImpactSignalStale() {
  const signal =
    battleSceneLastResultDrivenImpactSignal &&
    typeof battleSceneLastResultDrivenImpactSignal === "object"
      ? battleSceneLastResultDrivenImpactSignal
      : null;
  if (!signal) {
    return false;
  }
  if (
    battleSceneLastResultDrivenImpactSignalExplicitSeq > 0 &&
    battleSceneLastExplicitEventSeq > 0
  ) {
    return (
      battleSceneLastResultDrivenImpactSignalExplicitSeq !==
      battleSceneLastExplicitEventSeq
    );
  }
  if (
    battleSceneLastResultDrivenImpactSignalExplicitAtMs <= 0 ||
    battleSceneLastExplicitEventAtMs <= 0
  ) {
    return false;
  }
  return (
    battleSceneLastResultDrivenImpactSignalExplicitAtMs !==
    battleSceneLastExplicitEventAtMs
  );
}

function resolveBattleSceneResultDrivenAmbientImpactGate(nowMs = Date.now()) {
  const signal =
    battleSceneLastResultDrivenImpactSignal &&
    typeof battleSceneLastResultDrivenImpactSignal === "object"
      ? battleSceneLastResultDrivenImpactSignal
      : null;
  if (!signal) {
    return {
      signal: null,
      reason: "no_signal",
      cooldownRemainingMs: 0,
      cooldownMaxMs: BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS,
      priorityRemainingMs: 0,
      priorityMaxMs: BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
      signalAgeMs: 0,
      signalAgeMaxMs: BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS,
    };
  }
  const replayMinIntervalMs =
    resolveBattleSceneResultDrivenAmbientImpactReplayMinIntervalMs(signal);
  const priorityWindowMs =
    resolveBattleSceneResultDrivenAmbientImpactPriorityWindowMs(signal);
  if (isBattleSceneResultDrivenAmbientImpactSignalStale()) {
    return {
      signal: null,
      reason: "stale_sequence",
      cooldownRemainingMs: 0,
      cooldownMaxMs: replayMinIntervalMs,
      priorityRemainingMs: 0,
      priorityMaxMs: priorityWindowMs,
      signalAgeMs: 0,
      signalAgeMaxMs: priorityWindowMs,
    };
  }
  const normalizedNowMs = Math.max(0, Number(nowMs) || Date.now());
  const elapsedMs = normalizedNowMs - battleSceneLastResultDrivenImpactAtMs;
  const priorityRemainingMs = Math.max(
    0,
    priorityWindowMs - elapsedMs,
  );
  if (elapsedMs > priorityWindowMs) {
    return {
      signal: null,
      reason: "stale_window",
      cooldownRemainingMs: 0,
      cooldownMaxMs: replayMinIntervalMs,
      priorityRemainingMs: 0,
      priorityMaxMs: priorityWindowMs,
      signalAgeMs: priorityWindowMs,
      signalAgeMaxMs: priorityWindowMs,
    };
  }
  const signalAgeMs = Math.max(
    0,
    Math.min(priorityWindowMs, elapsedMs),
  );
  const replayMax = resolveBattleSceneResultDrivenAmbientImpactReplayMax(signal);
  if (
    battleSceneLastResultDrivenImpactReplayCount >=
    replayMax
  ) {
    return {
      signal: null,
      reason: "replay_exhausted",
      cooldownRemainingMs: 0,
      cooldownMaxMs: replayMinIntervalMs,
      priorityRemainingMs,
      priorityMaxMs: priorityWindowMs,
      signalAgeMs,
      signalAgeMaxMs: priorityWindowMs,
    };
  }
  const replayQuietMs =
    normalizedNowMs - battleSceneLastResultDrivenImpactReplayAtMs;
  const replayCooldownRemainingMs = Math.max(0, replayMinIntervalMs - replayQuietMs);
  if (
    battleSceneLastResultDrivenImpactReplayAtMs > 0 &&
    replayQuietMs < replayMinIntervalMs
  ) {
    return {
      signal: null,
      reason: "replay_cooldown",
      cooldownRemainingMs: replayCooldownRemainingMs,
      cooldownMaxMs: replayMinIntervalMs,
      priorityRemainingMs,
      priorityMaxMs: priorityWindowMs,
      signalAgeMs,
      signalAgeMaxMs: priorityWindowMs,
    };
  }
  return {
    signal,
    reason: "fresh",
    cooldownRemainingMs: 0,
    cooldownMaxMs: replayMinIntervalMs,
    priorityRemainingMs,
    priorityMaxMs: priorityWindowMs,
    signalAgeMs,
    signalAgeMaxMs: priorityWindowMs,
  };
}

function resolveBattleSceneResultDrivenAmbientImpactSignal(nowMs = Date.now()) {
  return resolveBattleSceneResultDrivenAmbientImpactGate(nowMs).signal;
}

function normalizeBattleSceneWorld(worldInput) {
  if (worldInput === "mortal" || worldInput === "immortal") {
    return worldInput;
  }
  return "true";
}

function resolveBattleSceneTier(stageInput) {
  const stage = stageInput && typeof stageInput === "object" ? stageInput : null;
  if (!stage) {
    return "novice";
  }
  if (Number(stage.is_tribulation) === 1) {
    return "tribulation";
  }
  const difficultyIndex = Math.max(1, Number(stage.difficulty_index) || 1);
  if (difficultyIndex >= 150) {
    return "mythic";
  }
  if (difficultyIndex >= 90) {
    return "ascendant";
  }
  if (difficultyIndex >= 40) {
    return "adept";
  }
  return "novice";
}

function setBattleSceneAtmosphere(stageInput) {
  if (!dom.battleSceneArena) {
    return;
  }
  const stage = stageInput && typeof stageInput === "object" ? stageInput : null;
  dom.battleSceneArena.dataset.sceneWorld = normalizeBattleSceneWorld(stage?.world);
  dom.battleSceneArena.dataset.sceneTier = resolveBattleSceneTier(stage);
}

function setBattleSceneStageLabels(stage, displayName) {
  const worldKey = normalizeBattleSceneWorld(stage?.world);
  const stageTier = resolveBattleSceneTier(stage);
  if (dom.battleScenePlayerStage) {
    const playerName = String(state.playerName || "-");
    const stageName = String(displayName || "-");
    const playerStageLabel = `${state.playerName} · ${displayName}`;
    dom.battleScenePlayerStage.textContent = playerStageLabel;
    dom.battleScenePlayerStage.dataset.stageLabel = playerStageLabel;
    dom.battleScenePlayerStage.dataset.stageKey = `player_${worldKey}_${stageTier}`;
    dom.battleScenePlayerStage.dataset.playerName = playerName;
    dom.battleScenePlayerStage.dataset.stageName = stageName;
  }
  if (dom.battleSceneEnemyStage) {
    const worldLabel = String(worldKo(stage.world) || "-");
    const qiRequired = fmtNumber(stage.qi_required);
    const enemyStageLabel =
      `${worldLabel} 수문자 · 요구 기 ${qiRequired}`;
    dom.battleSceneEnemyStage.textContent = enemyStageLabel;
    dom.battleSceneEnemyStage.dataset.stageLabel = enemyStageLabel;
    dom.battleSceneEnemyStage.dataset.stageKey = `enemy_${worldKey}_${stageTier}`;
    dom.battleSceneEnemyStage.dataset.worldLabel = worldLabel;
    dom.battleSceneEnemyStage.dataset.qiRequired = qiRequired;
  }
}

function clampBattleSceneGauge(value, max = BATTLE_SCENE_DUEL_MAX_HP) {
  return Math.max(0, Math.min(max, Number(value) || 0));
}

function rollBattleSceneInteger(min, max) {
  const normalizedMin = Math.floor(Math.min(min, max));
  const normalizedMax = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (normalizedMax - normalizedMin + 1)) + normalizedMin;
}

function resolveBattleSceneHpTier(hpPct) {
  if (hpPct <= 28) {
    return "danger";
  }
  if (hpPct <= 56) {
    return "warn";
  }
  return "safe";
}

function resolveBattleSceneCastTier(castPct) {
  if (castPct >= 100) {
    return "full";
  }
  if (castPct >= 72) {
    return "high";
  }
  if (castPct >= 36) {
    return "mid";
  }
  return "low";
}

function resolveBattleSceneComboTier(comboInput) {
  const combo = Math.max(0, Math.floor(Number(comboInput) || 0));
  if (combo >= 8) {
    return "frenzy";
  }
  if (combo >= 3) {
    return "flow";
  }
  return "calm";
}

function resolveBattleSceneLead(playerHpPct, enemyHpPct) {
  const gap = Math.round(Number(playerHpPct) || 0) - Math.round(Number(enemyHpPct) || 0);
  if (Math.abs(gap) <= 6) {
    return "even";
  }
  return gap > 0 ? "player" : "enemy";
}

function resolveBattleSceneDangerSide(playerHpPct, enemyHpPct) {
  const playerDanger = Math.round(Number(playerHpPct) || 0) <= 30;
  const enemyDanger = Math.round(Number(enemyHpPct) || 0) <= 30;
  if (playerDanger && enemyDanger) {
    return "both";
  }
  if (playerDanger) {
    return "player";
  }
  if (enemyDanger) {
    return "enemy";
  }
  return "none";
}

function resolveBattleSceneDuelPressure(mode = "idle") {
  const playerHpPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.playerHp, BATTLE_SCENE_DUEL_MAX_HP) /
      BATTLE_SCENE_DUEL_MAX_HP) *
      100,
  );
  const enemyHpPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.enemyHp, BATTLE_SCENE_DUEL_MAX_HP) /
      BATTLE_SCENE_DUEL_MAX_HP) *
      100,
  );
  const minHpPct = Math.min(playerHpPct, enemyHpPct);
  const hpGap = Math.abs(playerHpPct - enemyHpPct);
  if (minHpPct <= 24 || hpGap >= 44) {
    return "high";
  }
  if (minHpPct <= 52 || hpGap >= 22) {
    return "medium";
  }
  return mode === "realtime" ? "medium" : "low";
}

function resolveBattleSceneDuelLeadTone() {
  const hpGap = battleSceneDuelState.playerHp - battleSceneDuelState.enemyHp;
  if (Math.abs(hpGap) <= 6) {
    return "info";
  }
  return hpGap > 0 ? "success" : "warn";
}

function setBattleSceneLeadEffectState(stateInput = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  const state =
    stateInput === "swing_player" ||
    stateInput === "swing_enemy" ||
    stateInput === "swing_even" ||
    stateInput === "resonance_player" ||
    stateInput === "resonance_enemy" ||
    stateInput === "resonance_even"
      ? stateInput
      : "idle";
  dom.battleSceneArena.dataset.sceneLeadEffect = state;
}

function setBattleScenePressureEffectState(stateInput = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  const state =
    stateInput === "spike_medium" ||
    stateInput === "spike_high" ||
    stateInput === "resonance_medium" ||
    stateInput === "resonance_high"
      ? stateInput
      : "idle";
  dom.battleSceneArena.dataset.scenePressureEffect = state;
}

function setBattleSceneDangerEffectState(stateInput = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  const state =
    stateInput === "pulse_player" ||
    stateInput === "pulse_enemy" ||
    stateInput === "pulse_both" ||
    stateInput === "resonance_player" ||
    stateInput === "resonance_enemy" ||
    stateInput === "resonance_both"
      ? stateInput
      : "idle";
  dom.battleSceneArena.dataset.sceneDangerEffect = state;
}

function setBattleSceneComboEffectState(stateInput = "idle") {
  if (!dom.battleSceneArena) {
    return;
  }
  const state =
    stateInput === "surge_flow" ||
    stateInput === "surge_frenzy" ||
    stateInput === "cooldown_flow" ||
    stateInput === "cooldown_calm" ||
    stateInput === "resonance_flow" ||
    stateInput === "resonance_frenzy"
      ? stateInput
      : "idle";
  dom.battleSceneArena.dataset.sceneComboEffect = state;
}

function maybeTriggerBattleSceneLeadSwing(nextLeadInput) {
  const nextLead = nextLeadInput === "player" || nextLeadInput === "enemy" ? nextLeadInput : "even";
  if (battleSceneLastLeadState === nextLead) {
    return;
  }
  const prevLead = battleSceneLastLeadState;
  battleSceneLastLeadState = nextLead;
  if (prevLead === null) {
    return;
  }
  const now = Date.now();
  if (now - battleSceneLastLeadSwingAtMs < BATTLE_SCENE_LEAD_SWING_MIN_INTERVAL_MS) {
    return;
  }
  const tone = nextLead === "player" ? "success" : nextLead === "enemy" ? "warn" : "info";
  if (dom.battleSceneArena) {
    const className = `scene-lead-swing-${nextLead}`;
    dom.battleSceneArena.classList.remove(...BATTLE_SCENE_LEAD_SWING_CLASSES);
    void dom.battleSceneArena.offsetWidth;
    dom.battleSceneArena.classList.add(className);
    if (battleSceneLeadSwingTimer !== null) {
      window.clearTimeout(battleSceneLeadSwingTimer);
    }
    const durationMs = BATTLE_SCENE_LEAD_SWING_DURATIONS_MS[nextLead] || 360;
    setBattleSceneLeadEffectState(`swing_${nextLead}`);
    battleSceneLeadSwingTimer = window.setTimeout(() => {
      dom.battleSceneArena?.classList.remove(className);
      setBattleSceneLeadEffectState();
      battleSceneLeadSwingTimer = null;
    }, durationMs);
  }
  if (!shouldReduceBattleSceneMotion()) {
    const anchor = nextLead === "even" ? "center" : nextLead;
    spawnBattleSceneShockwave({
      anchor,
      tone,
      variant: nextLead === "even" ? "telegraph" : "telegraph-urgent",
      radiusPx: nextLead === "even" ? 72 : 86,
      thicknessPx: nextLead === "even" ? 2.3 : 2.8,
      lingerSec: nextLead === "even" ? 0.58 : 0.66,
    });
    spawnBattleSceneTrail({
      anchor: "center",
      tone,
      shape: nextLead === "even" ? "wave" : "slash",
      angleDeg: nextLead === "player" ? 14 : nextLead === "enemy" ? 166 : 0,
      length: nextLead === "even" ? 88 : 96,
    });
    spawnBattleSceneSpark({
      anchor,
      tone,
      shape: "ring",
      scale: nextLead === "even" ? 1.02 : 1.14,
    });
    if (nextLead === "player" || nextLead === "enemy") {
      spawnBattleSceneChargeMote({
        anchor: nextLead,
        tone,
        radiusPx: 30,
        sizePx: 6.6,
        lingerSec: 0.78,
        sweepDeg: nextLead === "player" ? 210 : -210,
      });
    }
    triggerBattleSceneCameraShake(nextLead === "even" ? "light" : "lateral", { fromAmbient: true });
    triggerBattleSceneZoomPulse("soft", { fromAmbient: true });
    triggerBattleSceneHitStop("light", { fromAmbient: true });
  }
  if (now - battleSceneLastLeadSwingTickerAtMs >= BATTLE_SCENE_LEAD_SWING_TICKER_MIN_INTERVAL_MS) {
    pushBattleSceneTicker(
      nextLead === "player"
        ? "주도권 전환 · 수련자 우세"
        : nextLead === "enemy"
          ? "주도권 전환 · 적수 압박"
          : "전장 균형 재형성 · 진형 재정렬",
      tone,
    );
    battleSceneLastLeadSwingTickerAtMs = now;
  }
  battleSceneLastLeadSwingAtMs = now;
}

function triggerBattleSceneLeadResonance(leadInput = "even", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const lead = leadInput === "player" || leadInput === "enemy" ? leadInput : "even";
  const now = Date.now();
  const minIntervalMs = BATTLE_SCENE_LEAD_RESONANCE_MIN_INTERVAL_MS[lead] || 1000;
  if (now - battleSceneLastLeadResonanceAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && lead === "even" && Math.random() > 0.66) {
    return;
  }
  const className = `scene-lead-resonance-${lead}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_LEAD_RESONANCE_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneLeadResonanceTimer !== null) {
    window.clearTimeout(battleSceneLeadResonanceTimer);
  }
  const durationMs = BATTLE_SCENE_LEAD_RESONANCE_DURATIONS_MS[lead] || 380;
  setBattleSceneLeadEffectState(`resonance_${lead}`);
  battleSceneLeadResonanceTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    setBattleSceneLeadEffectState();
    battleSceneLeadResonanceTimer = null;
  }, durationMs);

  const tone = lead === "player" ? "success" : lead === "enemy" ? "warn" : "info";
  const anchor = lead === "even" ? "center" : lead;
  spawnBattleSceneShockwave({
    anchor,
    tone,
    variant: lead === "even" ? "telegraph" : "telegraph-urgent",
    radiusPx: lead === "even" ? 68 : 82,
    thicknessPx: lead === "even" ? 2.2 : 2.6,
    lingerSec: lead === "even" ? 0.54 : 0.62,
  });
  spawnBattleSceneTrail({
    anchor: "center",
    tone,
    shape: lead === "even" ? "wave" : "slash",
    angleDeg: lead === "player" ? 18 : lead === "enemy" ? 162 : 0,
    length: lead === "even" ? 82 : 92,
  });
  spawnBattleSceneSpark({
    anchor,
    tone,
    shape: "ring",
    scale: lead === "even" ? 0.98 : 1.1,
  });
  if (lead === "player" || lead === "enemy") {
    spawnBattleSceneChargeMote({
      anchor: lead,
      tone,
      radiusPx: 28,
      sizePx: 6.2,
      lingerSec: 0.7,
      sweepDeg: lead === "player" ? 206 : -206,
    });
  }
  triggerBattleSceneCameraShake(lead === "even" ? "light" : "lateral", { fromAmbient: true });
  triggerBattleSceneZoomPulse("soft", { fromAmbient: true });
  triggerBattleSceneHitStop("light", { fromAmbient: true });

  if (now - battleSceneLastLeadResonanceTickerAtMs >= BATTLE_SCENE_LEAD_RESONANCE_TICKER_MIN_INTERVAL_MS) {
    pushBattleSceneTicker(
      lead === "player"
        ? "주도권 유지 · 수련자 압박 지속"
        : lead === "enemy"
          ? "적수 우세 유지 · 수비 전환 필요"
          : "균형 교착 유지 · 간격 탐색 중",
      tone,
    );
    battleSceneLastLeadResonanceTickerAtMs = now;
  }
  battleSceneLastLeadResonanceAtMs = now;
}

function triggerBattleScenePressureSpike(level = "medium", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedLevel = level === "high" ? "high" : "medium";
  const now = Date.now();
  const minIntervalMs = BATTLE_SCENE_PRESSURE_SPIKE_MIN_INTERVAL_MS[normalizedLevel] || 700;
  if (now - battleSceneLastPressureSpikeAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedLevel === "medium" && Math.random() > 0.56) {
    return;
  }
  const className = `scene-pressure-spike-${normalizedLevel}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_PRESSURE_SPIKE_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleScenePressureSpikeTimer !== null) {
    window.clearTimeout(battleScenePressureSpikeTimer);
  }
  const durationMs = BATTLE_SCENE_PRESSURE_SPIKE_DURATIONS_MS[normalizedLevel] || 360;
  setBattleScenePressureEffectState(`spike_${normalizedLevel}`);
  battleScenePressureSpikeTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    setBattleScenePressureEffectState();
    battleScenePressureSpikeTimer = null;
  }, durationMs);
  battleSceneLastPressureSpikeAtMs = now;
}

function triggerBattleScenePressureResonance(level = "medium", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedLevel = level === "high" ? "high" : "medium";
  const now = Date.now();
  const minIntervalMs = BATTLE_SCENE_PRESSURE_RESONANCE_MIN_INTERVAL_MS[normalizedLevel] || 1000;
  if (now - battleSceneLastPressureResonanceAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedLevel === "medium" && Math.random() > 0.66) {
    return;
  }
  const className = `scene-pressure-resonance-${normalizedLevel}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_PRESSURE_RESONANCE_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleScenePressureResonanceTimer !== null) {
    window.clearTimeout(battleScenePressureResonanceTimer);
  }
  const durationMs = BATTLE_SCENE_PRESSURE_RESONANCE_DURATIONS_MS[normalizedLevel] || 420;
  setBattleScenePressureEffectState(`resonance_${normalizedLevel}`);
  battleScenePressureResonanceTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    setBattleScenePressureEffectState();
    battleScenePressureResonanceTimer = null;
  }, durationMs);

  const tone = normalizedLevel === "high" ? "error" : "warn";
  spawnBattleSceneShockwave({
    anchor: "center",
    tone,
    variant: normalizedLevel === "high" ? "telegraph-urgent" : "telegraph",
    radiusPx: normalizedLevel === "high" ? 96 : 78,
    thicknessPx: normalizedLevel === "high" ? 3 : 2.3,
    lingerSec: normalizedLevel === "high" ? 0.64 : 0.56,
  });
  spawnBattleSceneTrail({
    anchor: "center",
    tone,
    shape: "wave",
    angleDeg: 0,
    length: normalizedLevel === "high" ? 104 : 86,
  });
  spawnBattleSceneSpark({
    anchor: "center",
    tone,
    shape: "ring",
    scale: normalizedLevel === "high" ? 1.16 : 1.02,
  });
  if (normalizedLevel === "high") {
    spawnBattleSceneChargeMote({
      anchor: "center",
      tone,
      radiusPx: 34,
      sizePx: 6.8,
      lingerSec: 0.7,
      sweepDeg: 236,
    });
  }
  triggerBattleSceneCameraShake(normalizedLevel === "high" ? "medium" : "light", { fromAmbient: true });
  triggerBattleSceneZoomPulse(normalizedLevel === "high" ? "burst" : "soft", { fromAmbient: true });
  triggerBattleSceneHitStop(normalizedLevel === "high" ? "medium" : "light", { fromAmbient: true });

  if (
    now - battleSceneLastPressureResonanceTickerAtMs >=
    BATTLE_SCENE_PRESSURE_RESONANCE_TICKER_MIN_INTERVAL_MS
  ) {
    pushBattleSceneTicker(
      normalizedLevel === "high"
        ? "고압 공명 유지 · 전장 균열 확산"
        : "압력 공명 유지 · 충돌 기류 증폭",
      tone,
    );
    battleSceneLastPressureResonanceTickerAtMs = now;
  }
  battleSceneLastPressureResonanceAtMs = now;
}

function maybeTriggerBattleScenePressureTransition(nextPressureInput) {
  const nextPressure =
    nextPressureInput === "high"
      ? "high"
      : nextPressureInput === "medium"
        ? "medium"
        : "low";
  if (battleSceneLastPressureState === nextPressure) {
    return;
  }
  const prevPressure = battleSceneLastPressureState;
  battleSceneLastPressureState = nextPressure;
  if (prevPressure === null || shouldReduceBattleSceneMotion()) {
    return;
  }
  const escalation =
    (prevPressure === "low" && (nextPressure === "medium" || nextPressure === "high")) ||
    (prevPressure === "medium" && nextPressure === "high");
  if (!escalation) {
    return;
  }
  const isHigh = nextPressure === "high";
  triggerBattleScenePressureSpike(isHigh ? "high" : "medium");
  spawnBattleSceneShockwave({
    anchor: "center",
    tone: isHigh ? "error" : "warn",
    variant: isHigh ? "telegraph-urgent" : "telegraph",
    radiusPx: isHigh ? 102 : 82,
    thicknessPx: isHigh ? 3.1 : 2.4,
    lingerSec: isHigh ? 0.64 : 0.56,
  });
  spawnBattleSceneTrail({
    anchor: "center",
    tone: isHigh ? "error" : "warn",
    shape: "wave",
    angleDeg: 0,
    length: isHigh ? 108 : 92,
  });
  triggerBattleSceneCameraShake(isHigh ? "medium" : "light", { fromAmbient: true });
  triggerBattleSceneZoomPulse(isHigh ? "burst" : "soft", { fromAmbient: true });
  triggerBattleSceneHitStop(isHigh ? "medium" : "light", { fromAmbient: true });
  const now = Date.now();
  if (now - battleSceneLastPressureTickerAtMs >= BATTLE_SCENE_PRESSURE_TICKER_MIN_INTERVAL_MS) {
    pushBattleSceneTicker(
      isHigh ? "전장 압력 급등 · 붕괴 직전 파동" : "전장 압력 상승 · 충돌 강도 증가",
      isHigh ? "error" : "warn",
    );
    battleSceneLastPressureTickerAtMs = now;
  }
}

function triggerBattleSceneDangerPulse(side = "player", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedSide =
    side === "both"
      ? "both"
      : side === "enemy"
        ? "enemy"
        : "player";
  const now = Date.now();
  const minIntervalMs = BATTLE_SCENE_DANGER_PULSE_MIN_INTERVAL_MS[normalizedSide] || 820;
  if (now - battleSceneLastDangerPulseAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedSide !== "both" && Math.random() > 0.62) {
    return;
  }
  const className = `scene-danger-pulse-${normalizedSide}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_DANGER_PULSE_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneDangerPulseTimer !== null) {
    window.clearTimeout(battleSceneDangerPulseTimer);
  }
  const durationMs = BATTLE_SCENE_DANGER_PULSE_DURATIONS_MS[normalizedSide] || 420;
  setBattleSceneDangerEffectState(`pulse_${normalizedSide}`);
  battleSceneDangerPulseTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    setBattleSceneDangerEffectState();
    battleSceneDangerPulseTimer = null;
  }, durationMs);

  const tone = normalizedSide === "enemy" ? "success" : normalizedSide === "both" ? "error" : "warn";
  const anchor = normalizedSide === "both" ? "center" : normalizedSide;
  spawnBattleSceneShockwave({
    anchor,
    tone,
    variant: normalizedSide === "both" ? "telegraph-urgent" : "telegraph",
    radiusPx: normalizedSide === "both" ? 96 : 78,
    thicknessPx: normalizedSide === "both" ? 3 : 2.4,
    lingerSec: normalizedSide === "both" ? 0.66 : 0.58,
  });
  spawnBattleSceneSpark({
    anchor,
    tone,
    shape: "ring",
    scale: normalizedSide === "both" ? 1.16 : 1.02,
  });
  if (normalizedSide === "both") {
    spawnBattleSceneTrail({ anchor: "center", tone: "error", shape: "wave", angleDeg: 0, length: 104 });
    spawnBattleSceneTrail({ anchor: "center", tone: "warn", shape: "wave", angleDeg: 180, length: 96 });
  }
  triggerBattleSceneCameraShake(normalizedSide === "both" ? "medium" : "light", { fromAmbient: true });
  triggerBattleSceneZoomPulse(normalizedSide === "both" ? "burst" : "soft", { fromAmbient: true });
  triggerBattleSceneHitStop(normalizedSide === "both" ? "medium" : "light", { fromAmbient: true });

  if (now - battleSceneLastDangerTickerAtMs >= BATTLE_SCENE_DANGER_TICKER_MIN_INTERVAL_MS) {
    pushBattleSceneTicker(
      normalizedSide === "player"
        ? "수련자 위기 · 방어 집중 필요"
        : normalizedSide === "enemy"
          ? "적수 위기 · 마무리 기회"
          : "쌍방 위기 · 전장 붕괴 직전",
      tone,
    );
    battleSceneLastDangerTickerAtMs = now;
  }
  battleSceneLastDangerPulseAtMs = now;
}

function triggerBattleSceneDangerResonance(side = "player", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedSide =
    side === "both"
      ? "both"
      : side === "enemy"
        ? "enemy"
        : "player";
  const now = Date.now();
  const minIntervalMs = BATTLE_SCENE_DANGER_RESONANCE_MIN_INTERVAL_MS[normalizedSide] || 1120;
  if (now - battleSceneLastDangerResonanceAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedSide !== "both" && Math.random() > 0.68) {
    return;
  }
  const className = `scene-danger-resonance-${normalizedSide}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_DANGER_RESONANCE_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneDangerResonanceTimer !== null) {
    window.clearTimeout(battleSceneDangerResonanceTimer);
  }
  const durationMs = BATTLE_SCENE_DANGER_RESONANCE_DURATIONS_MS[normalizedSide] || 460;
  setBattleSceneDangerEffectState(`resonance_${normalizedSide}`);
  battleSceneDangerResonanceTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    setBattleSceneDangerEffectState();
    battleSceneDangerResonanceTimer = null;
  }, durationMs);

  const tone = normalizedSide === "enemy" ? "success" : normalizedSide === "both" ? "error" : "warn";
  const anchor = normalizedSide === "both" ? "center" : normalizedSide;
  spawnBattleSceneShockwave({
    anchor,
    tone,
    variant: normalizedSide === "both" ? "telegraph-urgent" : "telegraph",
    radiusPx: normalizedSide === "both" ? 102 : 82,
    thicknessPx: normalizedSide === "both" ? 3.1 : 2.5,
    lingerSec: normalizedSide === "both" ? 0.7 : 0.6,
  });
  spawnBattleSceneSpark({
    anchor,
    tone,
    shape: "ring",
    scale: normalizedSide === "both" ? 1.2 : 1.08,
  });
  spawnBattleSceneTrail({
    anchor: "center",
    tone,
    shape: "wave",
    angleDeg: normalizedSide === "enemy" ? 162 : normalizedSide === "player" ? 18 : 0,
    length: normalizedSide === "both" ? 110 : 90,
  });
  if (normalizedSide === "both") {
    spawnBattleSceneTrail({
      anchor: "center",
      tone: "warn",
      shape: "wave",
      angleDeg: 180,
      length: 98,
    });
    spawnBattleSceneChargeMote({
      anchor: "center",
      tone: "error",
      radiusPx: 36,
      sizePx: 7.2,
      lingerSec: 0.76,
      sweepDeg: 252,
    });
  }
  triggerBattleSceneCameraShake(normalizedSide === "both" ? "medium" : "light", { fromAmbient: true });
  triggerBattleSceneZoomPulse(normalizedSide === "both" ? "burst" : "soft", { fromAmbient: true });
  triggerBattleSceneHitStop(normalizedSide === "both" ? "medium" : "light", { fromAmbient: true });

  if (
    now - battleSceneLastDangerResonanceTickerAtMs >=
    BATTLE_SCENE_DANGER_RESONANCE_TICKER_MIN_INTERVAL_MS
  ) {
    pushBattleSceneTicker(
      normalizedSide === "player"
        ? "수련자 위기 공명 · 방어 호흡 유지"
        : normalizedSide === "enemy"
          ? "적수 위기 공명 · 마무리 압박 유지"
          : "쌍방 위기 공명 · 붕괴 임계 유지",
      tone,
    );
    battleSceneLastDangerResonanceTickerAtMs = now;
  }
  battleSceneLastDangerResonanceAtMs = now;
}

function maybeTriggerBattleSceneDangerTransition(nextDangerInput) {
  const nextDanger =
    nextDangerInput === "both"
      ? "both"
      : nextDangerInput === "enemy"
        ? "enemy"
        : nextDangerInput === "player"
          ? "player"
          : "none";
  if (battleSceneLastDangerState === nextDanger) {
    return;
  }
  const prevDanger = battleSceneLastDangerState;
  battleSceneLastDangerState = nextDanger;
  if (prevDanger === null || shouldReduceBattleSceneMotion()) {
    return;
  }
  if (nextDanger === "none") {
    return;
  }
  const escalation =
    prevDanger === "none" ||
    (prevDanger !== "both" && nextDanger === "both");
  if (escalation) {
    triggerBattleSceneDangerPulse(nextDanger, { fromAmbient: true });
  }
}

function triggerBattleSceneComboSurge(tier = "flow", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedTier = tier === "frenzy" ? "frenzy" : "flow";
  const now = Date.now();
  const minIntervalMs = BATTLE_SCENE_COMBO_SURGE_MIN_INTERVAL_MS[normalizedTier] || 720;
  if (now - battleSceneLastComboSurgeAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedTier === "flow" && Math.random() > 0.58) {
    return;
  }
  const className = `scene-combo-surge-${normalizedTier}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_COMBO_COOLDOWN_CLASSES);
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_COMBO_SURGE_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneComboSurgeTimer !== null) {
    window.clearTimeout(battleSceneComboSurgeTimer);
  }
  const durationMs = BATTLE_SCENE_COMBO_SURGE_DURATIONS_MS[normalizedTier] || 460;
  setBattleSceneComboEffectState(`surge_${normalizedTier}`);
  battleSceneComboSurgeTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    setBattleSceneComboEffectState();
    battleSceneComboSurgeTimer = null;
  }, durationMs);

  const tone = normalizedTier === "frenzy" ? "error" : "success";
  spawnBattleSceneShockwave({
    anchor: "center",
    tone,
    variant: normalizedTier === "frenzy" ? "telegraph-urgent" : "telegraph",
    radiusPx: normalizedTier === "frenzy" ? 106 : 84,
    thicknessPx: normalizedTier === "frenzy" ? 3.1 : 2.5,
    lingerSec: normalizedTier === "frenzy" ? 0.68 : 0.58,
  });
  spawnBattleSceneTrail({
    anchor: "center",
    tone,
    shape: "wave",
    angleDeg: normalizedTier === "frenzy" ? 0 : 12,
    length: normalizedTier === "frenzy" ? 112 : 92,
  });
  if (normalizedTier === "frenzy") {
    spawnBattleSceneTrail({
      anchor: "center",
      tone: "warn",
      shape: "wave",
      angleDeg: 180,
      length: 102,
    });
  }
  spawnBattleSceneSpark({
    anchor: "center",
    tone,
    shape: "ring",
    scale: normalizedTier === "frenzy" ? 1.22 : 1.08,
  });
  spawnBattleSceneChargeMote({
    anchor: "center",
    tone,
    radiusPx: normalizedTier === "frenzy" ? 38 : 30,
    sizePx: normalizedTier === "frenzy" ? 7 : 6.1,
    lingerSec: normalizedTier === "frenzy" ? 0.76 : 0.66,
    sweepDeg: normalizedTier === "frenzy" ? 260 : 210,
  });
  triggerBattleSceneCameraShake(normalizedTier === "frenzy" ? "medium" : "lateral", { fromAmbient: true });
  triggerBattleSceneZoomPulse(normalizedTier === "frenzy" ? "burst" : "soft", { fromAmbient: true });
  triggerBattleSceneHitStop(normalizedTier === "frenzy" ? "medium" : "light", { fromAmbient: true });

  if (now - battleSceneLastComboSurgeTickerAtMs >= BATTLE_SCENE_COMBO_SURGE_TICKER_MIN_INTERVAL_MS) {
    pushBattleSceneTicker(
      normalizedTier === "frenzy"
        ? "연격 폭주 점화 · 광란 구간 돌입"
        : "연격 기류 상승 · 연계 리듬 가속",
      normalizedTier === "frenzy" ? "error" : "success",
    );
    battleSceneLastComboSurgeTickerAtMs = now;
  }
  battleSceneLastComboSurgeAtMs = now;
}

function triggerBattleSceneComboCooldown(tier = "flow", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedTier = tier === "calm" ? "calm" : "flow";
  const now = Date.now();
  const minIntervalMs = BATTLE_SCENE_COMBO_COOLDOWN_MIN_INTERVAL_MS[normalizedTier] || 840;
  if (now - battleSceneLastComboCooldownAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedTier === "calm" && Math.random() > 0.64) {
    return;
  }
  const className = `scene-combo-cooldown-${normalizedTier}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_COMBO_SURGE_CLASSES);
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_COMBO_COOLDOWN_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneComboCooldownTimer !== null) {
    window.clearTimeout(battleSceneComboCooldownTimer);
  }
  const durationMs = BATTLE_SCENE_COMBO_COOLDOWN_DURATIONS_MS[normalizedTier] || 460;
  setBattleSceneComboEffectState(`cooldown_${normalizedTier}`);
  battleSceneComboCooldownTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    setBattleSceneComboEffectState();
    battleSceneComboCooldownTimer = null;
  }, durationMs);

  const tone = normalizedTier === "calm" ? "info" : "warn";
  spawnBattleSceneShockwave({
    anchor: "center",
    tone,
    variant: "telegraph",
    radiusPx: normalizedTier === "calm" ? 68 : 78,
    thicknessPx: normalizedTier === "calm" ? 2.1 : 2.3,
    lingerSec: normalizedTier === "calm" ? 0.54 : 0.58,
  });
  spawnBattleSceneTrail({
    anchor: "center",
    tone,
    shape: "wave",
    angleDeg: normalizedTier === "calm" ? 180 : 154,
    length: normalizedTier === "calm" ? 78 : 86,
  });
  spawnBattleSceneSpark({
    anchor: "center",
    tone,
    shape: "dot",
    scale: normalizedTier === "calm" ? 0.92 : 0.98,
  });
  triggerBattleSceneCameraShake(normalizedTier === "calm" ? "light" : "lateral", { fromAmbient: true });
  triggerBattleSceneZoomPulse("soft", { fromAmbient: true });
  triggerBattleSceneHitStop("light", { fromAmbient: true });

  if (now - battleSceneLastComboCooldownTickerAtMs >= BATTLE_SCENE_COMBO_COOLDOWN_TICKER_MIN_INTERVAL_MS) {
    pushBattleSceneTicker(
      normalizedTier === "calm"
        ? "연격 냉각 완료 · 기본 자세 복귀"
        : "연격 과열 완화 · 호흡 재정렬",
      tone,
    );
    battleSceneLastComboCooldownTickerAtMs = now;
  }
  battleSceneLastComboCooldownAtMs = now;
}

function triggerBattleSceneComboResonance(tier = "flow", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedTier = tier === "frenzy" ? "frenzy" : "flow";
  const now = Date.now();
  const minIntervalMs = BATTLE_SCENE_COMBO_RESONANCE_MIN_INTERVAL_MS[normalizedTier] || 900;
  if (now - battleSceneLastComboResonanceAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedTier === "flow" && Math.random() > 0.62) {
    return;
  }
  const className = `scene-combo-resonance-${normalizedTier}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_COMBO_COOLDOWN_CLASSES);
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_COMBO_RESONANCE_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneComboResonanceTimer !== null) {
    window.clearTimeout(battleSceneComboResonanceTimer);
  }
  const durationMs = BATTLE_SCENE_COMBO_RESONANCE_DURATIONS_MS[normalizedTier] || 440;
  setBattleSceneComboEffectState(`resonance_${normalizedTier}`);
  battleSceneComboResonanceTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    setBattleSceneComboEffectState();
    battleSceneComboResonanceTimer = null;
  }, durationMs);

  const lead = options.lead === "player" || options.lead === "enemy" ? options.lead : "center";
  const anchor = normalizedTier === "frenzy" && lead !== "center" ? lead : "center";
  const tone = normalizedTier === "frenzy" ? "error" : "success";
  spawnBattleSceneShockwave({
    anchor,
    tone,
    variant: normalizedTier === "frenzy" ? "telegraph-urgent" : "telegraph",
    radiusPx: normalizedTier === "frenzy" ? 92 : 74,
    thicknessPx: normalizedTier === "frenzy" ? 2.9 : 2.3,
    lingerSec: normalizedTier === "frenzy" ? 0.64 : 0.54,
  });
  spawnBattleSceneTrail({
    anchor: "center",
    tone,
    shape: "wave",
    angleDeg: anchor === "player" ? 20 : anchor === "enemy" ? 160 : 0,
    length: normalizedTier === "frenzy" ? 96 : 84,
  });
  spawnBattleSceneSpark({
    anchor,
    tone,
    shape: "ring",
    scale: normalizedTier === "frenzy" ? 1.16 : 1.04,
  });
  if (normalizedTier === "frenzy") {
    spawnBattleSceneChargeMote({
      anchor,
      tone,
      radiusPx: 34,
      sizePx: 6.8,
      lingerSec: 0.72,
      sweepDeg: anchor === "enemy" ? -220 : 220,
    });
  }
  triggerBattleSceneCameraShake(normalizedTier === "frenzy" ? "medium" : "light", { fromAmbient: true });
  triggerBattleSceneZoomPulse(normalizedTier === "frenzy" ? "burst" : "soft", { fromAmbient: true });
  triggerBattleSceneHitStop(normalizedTier === "frenzy" ? "medium" : "light", { fromAmbient: true });

  if (now - battleSceneLastComboResonanceTickerAtMs >= BATTLE_SCENE_COMBO_RESONANCE_TICKER_MIN_INTERVAL_MS) {
    pushBattleSceneTicker(
      normalizedTier === "frenzy"
        ? "광란 공명 유지 · 연격 파동 증폭"
        : "연격 공명 유지 · 전장 기류 동조",
      normalizedTier === "frenzy" ? "error" : "success",
    );
    battleSceneLastComboResonanceTickerAtMs = now;
  }
  battleSceneLastComboResonanceAtMs = now;
}

function maybeTriggerBattleSceneComboTierTransition(nextTierInput, options = {}) {
  const nextTier =
    nextTierInput === "frenzy"
      ? "frenzy"
      : nextTierInput === "flow"
        ? "flow"
        : "calm";
  if (battleSceneLastComboTierState === nextTier) {
    return;
  }
  const prevTier = battleSceneLastComboTierState;
  battleSceneLastComboTierState = nextTier;
  if (prevTier === null || shouldReduceBattleSceneMotion()) {
    return;
  }
  const escalation =
    (prevTier === "calm" && (nextTier === "flow" || nextTier === "frenzy")) ||
    (prevTier === "flow" && nextTier === "frenzy");
  if (escalation) {
    triggerBattleSceneComboSurge(nextTier, options);
    return;
  }
  const downshift =
    (prevTier === "frenzy" && (nextTier === "flow" || nextTier === "calm")) ||
    (prevTier === "flow" && nextTier === "calm");
  if (!downshift) {
    return;
  }
  triggerBattleSceneComboCooldown(nextTier, options);
}

function renderBattleSceneDuelHud() {
  const playerHpPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.playerHp, BATTLE_SCENE_DUEL_MAX_HP) /
      BATTLE_SCENE_DUEL_MAX_HP) *
      100,
  );
  const enemyHpPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.enemyHp, BATTLE_SCENE_DUEL_MAX_HP) /
      BATTLE_SCENE_DUEL_MAX_HP) *
      100,
  );
  const playerCastPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.playerCast, BATTLE_SCENE_DUEL_MAX_CAST) /
      BATTLE_SCENE_DUEL_MAX_CAST) *
      100,
  );
  const enemyCastPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.enemyCast, BATTLE_SCENE_DUEL_MAX_CAST) /
      BATTLE_SCENE_DUEL_MAX_CAST) *
      100,
  );
  const playerHpTier = resolveBattleSceneHpTier(playerHpPct);
  const playerCastTier = resolveBattleSceneCastTier(playerCastPct);
  const enemyHpTier = resolveBattleSceneHpTier(enemyHpPct);
  const enemyCastTier = resolveBattleSceneCastTier(enemyCastPct);
  if (dom.battleScenePlayerHpBar) {
    dom.battleScenePlayerHpBar.style.width = `${playerHpPct}%`;
    dom.battleScenePlayerHpBar.dataset.fillPct = String(playerHpPct);
    dom.battleScenePlayerHpBar.dataset.gaugeTier = playerHpTier;
    dom.battleScenePlayerHpBar.dataset.gaugeKey = `hp_${playerHpTier}`;
  }
  if (dom.battleSceneEnemyHpBar) {
    dom.battleSceneEnemyHpBar.style.width = `${enemyHpPct}%`;
    dom.battleSceneEnemyHpBar.dataset.fillPct = String(enemyHpPct);
    dom.battleSceneEnemyHpBar.dataset.gaugeTier = enemyHpTier;
    dom.battleSceneEnemyHpBar.dataset.gaugeKey = `hp_${enemyHpTier}`;
  }
  if (dom.battleScenePlayerCastBar) {
    dom.battleScenePlayerCastBar.style.width = `${playerCastPct}%`;
    dom.battleScenePlayerCastBar.dataset.fillPct = String(playerCastPct);
    dom.battleScenePlayerCastBar.dataset.gaugeTier = playerCastTier;
    dom.battleScenePlayerCastBar.dataset.gaugeKey = `cast_${playerCastTier}`;
  }
  if (dom.battleSceneEnemyCastBar) {
    dom.battleSceneEnemyCastBar.style.width = `${enemyCastPct}%`;
    dom.battleSceneEnemyCastBar.dataset.fillPct = String(enemyCastPct);
    dom.battleSceneEnemyCastBar.dataset.gaugeTier = enemyCastTier;
    dom.battleSceneEnemyCastBar.dataset.gaugeKey = `cast_${enemyCastTier}`;
  }
  if (dom.battleScenePlayerVitals) {
    dom.battleScenePlayerVitals.textContent = `HP ${playerHpPct}% · 기세 ${playerCastPct}%`;
    dom.battleScenePlayerVitals.dataset.hpPct = String(playerHpPct);
    dom.battleScenePlayerVitals.dataset.castPct = String(playerCastPct);
    dom.battleScenePlayerVitals.dataset.hpTier = playerHpTier;
    dom.battleScenePlayerVitals.dataset.castTier = playerCastTier;
    dom.battleScenePlayerVitals.dataset.vitalsKey = `${playerHpTier}_${playerCastTier}`;
  }
  if (dom.battleSceneEnemyVitals) {
    dom.battleSceneEnemyVitals.textContent = `HP ${enemyHpPct}% · 기세 ${enemyCastPct}%`;
    dom.battleSceneEnemyVitals.dataset.hpPct = String(enemyHpPct);
    dom.battleSceneEnemyVitals.dataset.castPct = String(enemyCastPct);
    dom.battleSceneEnemyVitals.dataset.hpTier = enemyHpTier;
    dom.battleSceneEnemyVitals.dataset.castTier = enemyCastTier;
    dom.battleSceneEnemyVitals.dataset.vitalsKey = `${enemyHpTier}_${enemyCastTier}`;
  }
  if (dom.battleSceneArena) {
    dom.battleSceneArena.dataset.scenePlayerHpPct = String(playerHpPct);
    dom.battleSceneArena.dataset.scenePlayerCastPct = String(playerCastPct);
    dom.battleSceneArena.dataset.sceneEnemyHpPct = String(enemyHpPct);
    dom.battleSceneArena.dataset.sceneEnemyCastPct = String(enemyCastPct);
  }
  if (dom.battleScenePlayer) {
    dom.battleScenePlayer.dataset.hpTier = playerHpTier;
    dom.battleScenePlayer.dataset.castTier = playerCastTier;
    dom.battleScenePlayer.dataset.hpPct = String(playerHpPct);
    dom.battleScenePlayer.dataset.castPct = String(playerCastPct);
    if (dom.battleSceneArena) {
      dom.battleSceneArena.dataset.scenePlayerHpTier = playerHpTier;
      dom.battleSceneArena.dataset.scenePlayerCastTier = playerCastTier;
    }
  }
  if (dom.battleSceneEnemy) {
    dom.battleSceneEnemy.dataset.hpTier = enemyHpTier;
    dom.battleSceneEnemy.dataset.castTier = enemyCastTier;
    dom.battleSceneEnemy.dataset.hpPct = String(enemyHpPct);
    dom.battleSceneEnemy.dataset.castPct = String(enemyCastPct);
    if (dom.battleSceneArena) {
      dom.battleSceneArena.dataset.sceneEnemyHpTier = enemyHpTier;
      dom.battleSceneArena.dataset.sceneEnemyCastTier = enemyCastTier;
    }
  }
  if (dom.battleSceneArena) {
    const sceneLead = resolveBattleSceneLead(
      playerHpPct,
      enemyHpPct,
    );
    const scenePressure = battleSceneDuelState.pressure;
    const sceneComboTier = resolveBattleSceneComboTier(
      battleSceneDuelState.combo,
    );
    const sceneDanger = resolveBattleSceneDangerSide(playerHpPct, enemyHpPct);
    dom.battleSceneArena.dataset.scenePressure = battleSceneDuelState.pressure;
    dom.battleSceneArena.dataset.sceneComboTier = sceneComboTier;
    dom.battleSceneArena.dataset.sceneLead = sceneLead;
    dom.battleSceneArena.dataset.sceneDanger = sceneDanger;
    maybeTriggerBattleScenePressureTransition(scenePressure);
    maybeTriggerBattleSceneComboTierTransition(sceneComboTier);
    maybeTriggerBattleSceneDangerTransition(sceneDanger);
    maybeTriggerBattleSceneLeadSwing(sceneLead);
  }
  if (dom.battleSceneClashCore) {
    dom.battleSceneClashCore.dataset.pressure = battleSceneDuelState.pressure;
  }
  renderBattleSceneCombatMetrics();
}

function resetBattleSceneDuelState(options = {}) {
  if (!options.keepRound) {
    battleSceneDuelState.round = 1;
  }
  battleSceneDuelState.playerHp = BATTLE_SCENE_DUEL_MAX_HP;
  battleSceneDuelState.enemyHp = BATTLE_SCENE_DUEL_MAX_HP;
  battleSceneDuelState.playerCast = rollBattleSceneInteger(12, 36);
  battleSceneDuelState.enemyCast = rollBattleSceneInteger(12, 36);
  battleSceneDuelState.pressure = "low";
  battleSceneDuelState.combo = 0;
  battleSceneDuelState.maxCombo = 0;
  battleSceneDuelState.dpsMomentum = 0;
  battleSceneLastLeadState = null;
  battleSceneLastLeadSwingAtMs = 0;
  battleSceneLastLeadSwingTickerAtMs = 0;
  battleSceneLastLeadResonanceAtMs = 0;
  battleSceneLastLeadResonanceTickerAtMs = 0;
  battleSceneLastPressureState = null;
  battleSceneLastPressureSpikeAtMs = 0;
  battleSceneLastPressureTickerAtMs = 0;
  battleSceneLastPressureResonanceAtMs = 0;
  battleSceneLastPressureResonanceTickerAtMs = 0;
  battleSceneLastDangerState = null;
  battleSceneLastDangerPulseAtMs = 0;
  battleSceneLastDangerTickerAtMs = 0;
  battleSceneLastDangerResonanceAtMs = 0;
  battleSceneLastDangerResonanceTickerAtMs = 0;
  battleSceneLastComboTierState = null;
  battleSceneLastComboSurgeAtMs = 0;
  battleSceneLastComboSurgeTickerAtMs = 0;
  battleSceneLastComboCooldownAtMs = 0;
  battleSceneLastComboCooldownTickerAtMs = 0;
  battleSceneLastComboResonanceAtMs = 0;
  battleSceneLastComboResonanceTickerAtMs = 0;
  if (battleSceneLeadSwingTimer !== null) {
    window.clearTimeout(battleSceneLeadSwingTimer);
    battleSceneLeadSwingTimer = null;
  }
  if (battleSceneLeadResonanceTimer !== null) {
    window.clearTimeout(battleSceneLeadResonanceTimer);
    battleSceneLeadResonanceTimer = null;
  }
  if (battleScenePressureSpikeTimer !== null) {
    window.clearTimeout(battleScenePressureSpikeTimer);
    battleScenePressureSpikeTimer = null;
  }
  if (battleScenePressureResonanceTimer !== null) {
    window.clearTimeout(battleScenePressureResonanceTimer);
    battleScenePressureResonanceTimer = null;
  }
  if (battleSceneDangerPulseTimer !== null) {
    window.clearTimeout(battleSceneDangerPulseTimer);
    battleSceneDangerPulseTimer = null;
  }
  if (battleSceneDangerResonanceTimer !== null) {
    window.clearTimeout(battleSceneDangerResonanceTimer);
    battleSceneDangerResonanceTimer = null;
  }
  if (battleSceneComboSurgeTimer !== null) {
    window.clearTimeout(battleSceneComboSurgeTimer);
    battleSceneComboSurgeTimer = null;
  }
  if (battleSceneComboCooldownTimer !== null) {
    window.clearTimeout(battleSceneComboCooldownTimer);
    battleSceneComboCooldownTimer = null;
  }
  if (battleSceneComboResonanceTimer !== null) {
    window.clearTimeout(battleSceneComboResonanceTimer);
    battleSceneComboResonanceTimer = null;
  }
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_LEAD_SWING_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_PRESSURE_SPIKE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_PRESSURE_RESONANCE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_DANGER_PULSE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_DANGER_RESONANCE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_COMBO_SURGE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_COMBO_COOLDOWN_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_COMBO_RESONANCE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_LEAD_RESONANCE_CLASSES);
  setBattleSceneLeadEffectState();
  setBattleScenePressureEffectState();
  setBattleSceneDangerEffectState();
  setBattleSceneComboEffectState();
  clearBattleSceneComboBanner();
  resetBattleSceneActorFrames();
  setBattleSceneImpactCue("idle");
  setBattleSceneImpactKinetic("normal");
  setBattleSceneImpactVfx("normal");
  setBattleSceneAmbientImpactSource("idle");
  setBattleSceneAmbientImpactLock("free");
  setBattleSceneAmbientImpactGate("no_signal");
  setBattleSceneAmbientImpactFresh("none");
  setBattleSceneAmbientImpactActive("none");
  setBattleSceneAmbientImpactRandomState("idle");
  setBattleSceneAmbientImpactRandomRecoverySource("none");
  setBattleSceneAmbientImpactRandomCadence(
    BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR,
    "none",
  );
  setBattleSceneAmbientImpactRandomProbability(
    BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE,
    "none",
  );
  setBattleSceneAmbientImpactRandomKindProfile("neutral", "none");
  setBattleSceneAmbientImpactRandomOutcomeProfile("neutral", "none", "none");
  setBattleSceneAmbientImpactRandomSyncPolicy(true, "none");
  setBattleSceneAmbientImpactRandomQuietThreshold(
    BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS,
    "none",
  );
  setBattleSceneAmbientImpactRandomRecovery(0);
  setBattleSceneAmbientImpactSignal(null, "idle");
  setBattleSceneAmbientImpactReplay(0);
  setBattleSceneAmbientImpactCooldown(0);
  setBattleSceneAmbientImpactPriorityWindow(0);
  setBattleSceneAmbientImpactSignalAge(0);
  setBattleSceneAmbientImpactSequence(0, 0);
  battleSceneLastResultDrivenImpactSignal = null;
  battleSceneLastResultDrivenImpactSignalExplicitAtMs = 0;
  battleSceneLastResultDrivenImpactSignalExplicitSeq = 0;
  battleSceneLastExplicitEventSeq = 0;
  battleSceneLastExplicitEventSource = "";
  battleSceneLastExplicitEventKind = "none";
  battleSceneLastExplicitEventTone = "none";
  battleSceneLastExplicitEventOutcomeCode = "none";
  battleSceneLastExplicitEventOutcomeProfile = "neutral";
  battleSceneLastExplicitEventSyncDuel = "off";
  battleSceneLastResultDrivenImpactReplayCount = 0;
  battleSceneLastResultDrivenImpactReplayAtMs = 0;
  setBattleSceneAmbientImpactExplicitSnapshot();
  setBattleSceneAmbientImpactExplicitSnapshotLifecycle();
  setBattleSceneAmbientImpactExplicitSnapshotState();
  setBattleSceneAmbientImpactResultSnapshot();
  setBattleSceneAmbientImpactResultSnapshotLifecycle();
  setBattleSceneAmbientImpactResultSnapshotWindows();
  setBattleSceneAmbientImpactResultSnapshotState();
  if (options.clearTicker) {
    clearBattleSceneTicker();
  }
  renderBattleSceneDuelHud();
}

function applyBattleSceneOutcomeDuelTransitions(options = {}) {
  const lead = options.lead === "player" || options.lead === "enemy" ? options.lead : "even";
  const pressure =
    options.pressure === "high"
      ? "high"
      : options.pressure === "medium"
        ? "medium"
        : "low";
  const danger =
    options.danger === "both"
      ? "both"
      : options.danger === "player"
        ? "player"
        : options.danger === "enemy"
          ? "enemy"
          : "none";
  const comboTier =
    options.comboTier === "frenzy"
      ? "frenzy"
      : options.comboTier === "flow"
        ? "flow"
        : "calm";
  const comboAction =
    options.comboAction === "surge"
      ? "surge"
      : options.comboAction === "cooldown"
        ? "cooldown"
        : "resonance";

  maybeTriggerBattleSceneLeadSwing(lead);
  triggerBattleSceneLeadResonance(lead, { fromOutcome: true });
  maybeTriggerBattleScenePressureTransition(pressure);
  if (pressure !== "low") {
    triggerBattleScenePressureSpike(pressure === "high" ? "high" : "medium", {
      fromOutcome: true,
    });
    triggerBattleScenePressureResonance(pressure === "high" ? "high" : "medium", {
      fromOutcome: true,
    });
  }
  maybeTriggerBattleSceneDangerTransition(danger);
  if (danger !== "none") {
    triggerBattleSceneDangerPulse(danger, { fromOutcome: true });
    triggerBattleSceneDangerResonance(danger, { fromOutcome: true });
  }
  maybeTriggerBattleSceneComboTierTransition(comboTier, {
    fromOutcome: true,
    lead,
  });
  if (comboAction === "surge") {
    triggerBattleSceneComboSurge(comboTier === "calm" ? "flow" : comboTier, {
      fromOutcome: true,
      lead,
    });
    return;
  }
  if (comboAction === "cooldown") {
    triggerBattleSceneComboCooldown(comboTier === "frenzy" ? "flow" : comboTier, {
      fromOutcome: true,
      lead,
    });
    return;
  }
  if (comboTier !== "calm") {
    triggerBattleSceneComboResonance(comboTier, {
      fromOutcome: true,
      lead,
    });
  }
}

function syncBattleSceneDuelFromImpact(kind, options = {}) {
  const source =
    options?.source === "battle" || options?.source === "breakthrough"
      ? options.source
      : "ambient";
  const outcome = options && typeof options.outcome === "object" ? options.outcome : null;
  let comboAction = "resonance";
  let tickerText = "";
  let tickerTone = "info";
  let tickerKey = `${source}_ticker`;
  let bannerText = "";
  let bannerTone = "info";
  let bannerKey = `${source}_banner`;
  let applyOutcomeTransition = false;

  if (source === "battle" && outcome) {
    if (outcome.won) {
      const qiGain = Math.max(1, Math.round(Number(outcome.qiDelta) || 0));
      const spiritGain = Math.max(0, Math.round(Number(outcome.spiritCoinDelta) || 0));
      const essenceGain = Math.max(0, Math.round(Number(outcome.rebirthEssenceDelta) || 0));
      const enemyDamage = Math.max(
        14,
        Math.min(42, Math.round(14 + qiGain * 0.52 + spiritGain * 0.18 + essenceGain * 4)),
      );
      const castGain = Math.max(
        18,
        Math.min(48, Math.round(16 + qiGain * 0.46 + spiritGain * 0.16)),
      );
      const enemyCastDrop = Math.max(4, Math.min(24, Math.round(castGain * 0.38)));
      battleSceneDuelState.enemyHp = clampBattleSceneGauge(
        battleSceneDuelState.enemyHp - enemyDamage,
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.playerHp = clampBattleSceneGauge(
        battleSceneDuelState.playerHp + Math.max(3, Math.round(spiritGain * 0.12)),
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.playerCast = clampBattleSceneGauge(
        battleSceneDuelState.playerCast + castGain,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.enemyCast = clampBattleSceneGauge(
        battleSceneDuelState.enemyCast - enemyCastDrop,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.combo = Math.min(
        14,
        battleSceneDuelState.combo + 2 + (essenceGain > 0 ? 1 : 0),
      );
      battleSceneDuelState.maxCombo = Math.max(
        battleSceneDuelState.maxCombo,
        battleSceneDuelState.combo,
      );
      battleSceneDuelState.dpsMomentum = Math.min(
        36,
        battleSceneDuelState.dpsMomentum + enemyDamage * 0.44 + castGain * 0.08,
      );
      comboAction = "surge";
      tickerText = "수동 전투 승리 · 전장 주도권 확보";
      tickerTone = "success";
      tickerKey = "battle_win";
    } else {
      const qiLoss = Math.max(1, Math.abs(Math.round(Number(outcome.qiDelta) || 0)));
      const playerDamage = Math.max(16, Math.min(44, Math.round(16 + qiLoss * 0.72)));
      const enemyCastGain = Math.max(16, Math.min(44, Math.round(14 + qiLoss * 0.55)));
      const playerCastDrop = Math.max(8, Math.min(28, Math.round(playerDamage * 0.34)));
      battleSceneDuelState.playerHp = clampBattleSceneGauge(
        battleSceneDuelState.playerHp - playerDamage,
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.enemyCast = clampBattleSceneGauge(
        battleSceneDuelState.enemyCast + enemyCastGain,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.playerCast = clampBattleSceneGauge(
        battleSceneDuelState.playerCast - playerCastDrop,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 2);
      battleSceneDuelState.dpsMomentum = Math.max(
        0,
        battleSceneDuelState.dpsMomentum - playerDamage * 0.42,
      );
      comboAction = "cooldown";
      tickerText = "수동 전투 패배 · 진형 재정비";
      tickerTone = "warn";
      tickerKey = "battle_loss";
    }
    applyOutcomeTransition = true;
  } else if (source === "breakthrough" && outcome) {
    const outcomeCode = String(outcome.outcome || "");
    const successPct = Math.max(0, Math.min(100, Number(outcome.successPct) || 0));
    const deathPct = Math.max(0, Math.min(100, Number(outcome.deathPct) || 0));
    const stageQiRequired = Math.max(
      1,
      Math.round(Number(outcome.stageQiRequired || outcome.stage?.qi_required) || 1),
    );
    const outcomeQiDelta = Math.round(Number(outcome.qiDelta) || 0);
    const outcomeQiLoss = Math.max(0, -outcomeQiDelta);
    const fromDifficultyIndex = Math.max(
      0,
      Math.round(Number(outcome.fromDifficultyIndex || outcome.difficultyIndex || outcome.stage?.difficulty_index) || 0),
    );
    const toDifficultyIndex = Math.max(
      0,
      Math.round(Number(outcome.toDifficultyIndex || outcome.nextStage?.difficulty_index) || 0),
    );

    if (outcome.attempted !== true) {
      const blockedNoQi = outcomeCode === "blocked_no_qi";
      const blockedTribulationSetting = outcomeCode === "blocked_tribulation_setting";
      const blockedAutoRiskPolicy = outcomeCode === "blocked_auto_risk_policy";
      const pausedByPolicy =
        outcome.pausedByPolicy === true || outcome.autoBreakthroughPaused === true;
      const autoPolicyReason = String(
        outcome.autoPolicy?.reason || outcome.reason || "",
      );
      const autoPolicyReasonLabel = String(
        outcome.autoPolicy?.reasonLabelKo || outcome.reasonLabelKo || "정책 차단",
      );
      const autoPolicyNextActionKo = String(
        outcome.autoPolicy?.nextActionKo || outcome.nextActionKo || "",
      );
      const policyConsecutiveBlocks = Math.max(
        0,
        Number(outcome.consecutiveBlocks) || 0,
      );
      const policyPauseThreshold = Math.max(
        0,
        Number(outcome.pauseThreshold || outcome.threshold) || 0,
      );
      const blockedRequiredQi = Math.max(
        1,
        Math.round(Number(outcome.requiredQi || outcome.stage?.qi_required) || 1),
      );
      const blockedCurrentQiRaw = Number(outcome.currentQi);
      const blockedCurrentQi = Math.max(
        0,
        Number.isFinite(blockedCurrentQiRaw)
          ? Math.round(blockedCurrentQiRaw)
          : Math.round(Number(state?.currencies?.qi) || 0),
      );
      const blockedQiDeficit = Math.max(
        0,
        Math.round(
          Number(outcome.qiDeficit) || blockedRequiredQi - blockedCurrentQi,
        ),
      );
      const blockedDifficultyIndex = Math.max(
        0,
        Math.round(Number(outcome.difficultyIndex || outcome.stage?.difficulty_index) || 0),
      );
      if (blockedNoQi) {
        const deficitRatio = Math.max(
          0,
          Math.min(2.4, blockedQiDeficit / Math.max(1, blockedRequiredQi)),
        );
        const castPenalty = Math.max(
          8,
          Math.min(20, Math.round(8 + deficitRatio * 8)),
        );
        const enemyCastGain = Math.max(
          0,
          Math.min(8, Math.round(2 + deficitRatio * 4)),
        );
        const comboPenalty = deficitRatio >= 1 ? 2 : 1;
        const momentumScale = Math.max(0.58, 0.86 - deficitRatio * 0.18);
        battleSceneDuelState.playerCast = clampBattleSceneGauge(
          battleSceneDuelState.playerCast - castPenalty,
          BATTLE_SCENE_DUEL_MAX_CAST,
        );
        battleSceneDuelState.enemyCast = clampBattleSceneGauge(
          battleSceneDuelState.enemyCast + enemyCastGain,
          BATTLE_SCENE_DUEL_MAX_CAST,
        );
        battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - comboPenalty);
        battleSceneDuelState.dpsMomentum = Math.max(
          0,
          battleSceneDuelState.dpsMomentum * momentumScale,
        );
        comboAction = "cooldown";
        tickerText = `돌파 기력 부족 · 기 ${fmtNumber(blockedCurrentQi)}/${fmtNumber(blockedRequiredQi)}`;
        tickerTone = "warn";
        tickerKey = "breakthrough_blocked_no_qi";
        bannerText =
          blockedQiDeficit > 0
            ? `기 ${fmtNumber(blockedQiDeficit)} 부족 · 축기 후 재시도`
            : "축기 재정렬 후 재시도";
        bannerTone = "warn";
        bannerKey = "breakthrough_blocked_no_qi";
        applyOutcomeTransition = true;
      } else if (blockedTribulationSetting) {
        battleSceneDuelState.playerCast = clampBattleSceneGauge(
          battleSceneDuelState.playerCast - 4,
          BATTLE_SCENE_DUEL_MAX_CAST,
        );
        battleSceneDuelState.enemyCast = clampBattleSceneGauge(
          battleSceneDuelState.enemyCast - 2,
          BATTLE_SCENE_DUEL_MAX_CAST,
        );
        battleSceneDuelState.dpsMomentum = Math.max(0, battleSceneDuelState.dpsMomentum * 0.94);
        comboAction = "resonance";
        tickerText =
          blockedDifficultyIndex > 0
            ? `도겁 자동 대기 · 난이도 ${fmtNumber(blockedDifficultyIndex)}`
            : "도겁 자동 대기 · 설정 확인 필요";
        tickerTone = "warn";
        tickerKey = "breakthrough_blocked_tribulation_setting";
        bannerText =
          blockedDifficultyIndex > 0
            ? `도겁 자동 허용 꺼짐 · 난이도 ${fmtNumber(blockedDifficultyIndex)}`
            : "도겁 자동 허용 꺼짐";
        bannerTone = "info";
        bannerKey = "breakthrough_blocked_tribulation_setting";
        applyOutcomeTransition = true;
      } else if (blockedAutoRiskPolicy) {
        if (pausedByPolicy) {
          battleSceneDuelState.playerCast = clampBattleSceneGauge(
            battleSceneDuelState.playerCast - 16,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.enemyCast = clampBattleSceneGauge(
            battleSceneDuelState.enemyCast + 8,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 3);
          battleSceneDuelState.dpsMomentum = Math.max(
            0,
            battleSceneDuelState.dpsMomentum * 0.58,
          );
          comboAction = "cooldown";
          tickerText = `자동 돌파 일시정지 · ${autoPolicyReasonLabel}`;
          tickerTone = "error";
          tickerKey = "breakthrough_paused_by_policy";
          const pauseMeta =
            policyConsecutiveBlocks > 0 || policyPauseThreshold > 0
              ? `연속 ${Math.max(policyConsecutiveBlocks, policyPauseThreshold)}회 차단`
              : "연속 차단 임계 도달";
          bannerText = autoPolicyNextActionKo
            ? `${pauseMeta} · ${autoPolicyNextActionKo}`
            : pauseMeta;
          bannerTone = "error";
          bannerKey = "breakthrough_paused_by_policy";
          applyOutcomeTransition = true;
        } else if (autoPolicyReason === "blocked_extreme_risk") {
          battleSceneDuelState.playerCast = clampBattleSceneGauge(
            battleSceneDuelState.playerCast - 14,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.enemyCast = clampBattleSceneGauge(
            battleSceneDuelState.enemyCast + 6,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 2);
          battleSceneDuelState.dpsMomentum = Math.max(
            0,
            battleSceneDuelState.dpsMomentum * 0.68,
          );
          comboAction = "cooldown";
          tickerText = `자동 돌파 차단 · ${autoPolicyReasonLabel}`;
          tickerTone = "error";
          tickerKey = "breakthrough_blocked_auto_risk_policy";
          bannerText = autoPolicyNextActionKo || "치명 위험 구간 · 수동 판단 필요";
          bannerTone = "error";
          bannerKey = "breakthrough_blocked_auto_risk_policy";
          applyOutcomeTransition = true;
        } else if (autoPolicyReason === "blocked_high_risk") {
          battleSceneDuelState.playerCast = clampBattleSceneGauge(
            battleSceneDuelState.playerCast - 10,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.enemyCast = clampBattleSceneGauge(
            battleSceneDuelState.enemyCast + 4,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 1);
          battleSceneDuelState.dpsMomentum = Math.max(
            0,
            battleSceneDuelState.dpsMomentum * 0.8,
          );
          comboAction = "cooldown";
          tickerText = `자동 돌파 차단 · ${autoPolicyReasonLabel}`;
          tickerTone = "warn";
          tickerKey = "breakthrough_blocked_auto_risk_policy";
          bannerText = autoPolicyNextActionKo || "고위험 구간 · 보정 후 수동 시도";
          bannerTone = "warn";
          bannerKey = "breakthrough_blocked_auto_risk_policy";
          applyOutcomeTransition = true;
        } else if (autoPolicyReason === "blocked_high_qi_cost") {
          battleSceneDuelState.playerCast = clampBattleSceneGauge(
            battleSceneDuelState.playerCast - 6,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.enemyCast = clampBattleSceneGauge(
            battleSceneDuelState.enemyCast + 2,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 1);
          battleSceneDuelState.dpsMomentum = Math.max(
            0,
            battleSceneDuelState.dpsMomentum * 0.9,
          );
          comboAction = "resonance";
          tickerText = `자동 돌파 차단 · ${autoPolicyReasonLabel}`;
          tickerTone = "warn";
          tickerKey = "breakthrough_blocked_auto_risk_policy";
          bannerText = autoPolicyNextActionKo || "기(氣) 비축 후 재시도";
          bannerTone = "info";
          bannerKey = "breakthrough_blocked_auto_risk_policy";
          applyOutcomeTransition = true;
        } else {
          battleSceneDuelState.playerCast = clampBattleSceneGauge(
            battleSceneDuelState.playerCast - 11,
            BATTLE_SCENE_DUEL_MAX_CAST,
          );
          battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 1);
          battleSceneDuelState.dpsMomentum = Math.max(
            0,
            battleSceneDuelState.dpsMomentum * 0.82,
          );
          comboAction = "cooldown";
          tickerText = `자동 돌파 차단 · ${autoPolicyReasonLabel}`;
          tickerTone = "warn";
          tickerKey = "breakthrough_blocked_auto_risk_policy";
          if (autoPolicyNextActionKo) {
            bannerText = autoPolicyNextActionKo;
            bannerTone = "info";
            bannerKey = "breakthrough_blocked_auto_risk_policy";
          }
          applyOutcomeTransition = true;
        }
      } else {
        battleSceneDuelState.playerCast = clampBattleSceneGauge(
          battleSceneDuelState.playerCast - 12,
          BATTLE_SCENE_DUEL_MAX_CAST,
        );
        battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 1);
        battleSceneDuelState.dpsMomentum = Math.max(0, battleSceneDuelState.dpsMomentum * 0.82);
        comboAction = "cooldown";
        tickerText = "돌파 차단 · 준비 조건 미충족";
        tickerTone = "error";
        tickerKey = "breakthrough_blocked";
        applyOutcomeTransition = true;
      }
    } else if (outcomeCode === "success") {
      const successQiConsume = Math.max(
        1,
        outcomeQiLoss || Math.round(stageQiRequired * 0.85),
      );
      const successQiConsumeRatio = Math.max(
        0,
        Math.min(1.4, successQiConsume / Math.max(1, stageQiRequired)),
      );
      battleSceneDuelState.playerHp = BATTLE_SCENE_DUEL_MAX_HP;
      battleSceneDuelState.enemyHp = clampBattleSceneGauge(
        Math.round(76 - successPct * 0.24 - successQiConsumeRatio * 6),
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.playerCast = clampBattleSceneGauge(
        58 + Math.round(successPct * 0.34 + successQiConsumeRatio * 8),
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.enemyCast = clampBattleSceneGauge(
        18 + Math.round((100 - successPct) * 0.2 - successQiConsumeRatio * 4),
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.combo = Math.min(
        14,
        Math.max(
          battleSceneDuelState.combo + 3 + (successQiConsumeRatio >= 0.85 ? 1 : 0),
          successPct >= 70 ? 9 : 7,
        ),
      );
      battleSceneDuelState.maxCombo = Math.max(
        battleSceneDuelState.maxCombo,
        battleSceneDuelState.combo,
      );
      battleSceneDuelState.dpsMomentum = Math.min(
        36,
        18 + successPct * 0.16 + successQiConsumeRatio * 4,
      );
      comboAction = "surge";
      tickerText =
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `돌파 성공 · ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)} · 기 ${fmtSignedInteger(-successQiConsume)}`
          : `돌파 성공 · 기 ${fmtSignedInteger(-successQiConsume)}`;
      tickerTone = "success";
      tickerKey = "breakthrough_success";
      bannerText =
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `경지 돌파 ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)} · 성공률 ${successPct.toFixed(1)}%`
          : `경지 돌파 · 성공률 ${successPct.toFixed(1)}%`;
      bannerTone = "success";
      bannerKey = "breakthrough_success";
      applyOutcomeTransition = true;
    } else if (outcomeCode === "minor_fail") {
      const minorQiLoss = Math.max(
        1,
        outcomeQiLoss || Math.round(stageQiRequired * 0.22),
      );
      const hpLoss = Math.max(
        14,
        Math.min(36, Math.round(12 + minorQiLoss * 0.22 + deathPct * 0.22)),
      );
      const enemyCastGain = Math.max(14, Math.min(40, Math.round(10 + hpLoss * 0.72)));
      const playerCastDrop = Math.max(8, Math.min(24, Math.round(hpLoss * 0.5)));
      battleSceneDuelState.playerHp = clampBattleSceneGauge(
        battleSceneDuelState.playerHp - hpLoss,
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.enemyCast = clampBattleSceneGauge(
        battleSceneDuelState.enemyCast + enemyCastGain,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.playerCast = clampBattleSceneGauge(
        battleSceneDuelState.playerCast - playerCastDrop,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 2);
      battleSceneDuelState.dpsMomentum = Math.max(0, battleSceneDuelState.dpsMomentum - hpLoss * 0.5);
      comboAction = "cooldown";
      tickerText =
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `돌파 경상 실패 · ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)} · 기 ${fmtSignedInteger(-minorQiLoss)}`
          : `돌파 경상 실패 · 기 ${fmtSignedInteger(-minorQiLoss)}`;
      tickerTone = "warn";
      tickerKey = "breakthrough_minor_fail";
      bannerText =
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `경상 실패 · 난이도 ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)}${
              deathPct > 0 ? ` · 사망률 ${deathPct.toFixed(1)}%` : ""
            }`
          : deathPct > 0
            ? `경상 실패 · 사망률 ${deathPct.toFixed(1)}% 구간`
            : "경상 실패 · 기맥 요동";
      bannerTone = "warn";
      bannerKey = "breakthrough_minor_fail";
      applyOutcomeTransition = true;
    } else if (outcomeCode === "retreat_fail") {
      const retreatLayers = Math.max(1, Number(outcome.retreatLayers) || 1);
      const retreatQiLoss = Math.max(
        1,
        outcomeQiLoss || Math.round(stageQiRequired * 0.28),
      );
      const hpLoss = Math.max(
        24,
        Math.min(52, Math.round(22 + retreatLayers * 6 + retreatQiLoss * 0.16 + deathPct * 0.14)),
      );
      const enemyCastGain = Math.max(16, Math.min(46, Math.round(12 + hpLoss * 0.52)));
      const playerCastDrop = Math.max(14, Math.min(40, Math.round(hpLoss * 0.62)));
      battleSceneDuelState.playerHp = clampBattleSceneGauge(
        battleSceneDuelState.playerHp - hpLoss,
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.enemyHp = clampBattleSceneGauge(
        battleSceneDuelState.enemyHp + Math.max(6, retreatLayers * 4),
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.enemyCast = clampBattleSceneGauge(
        battleSceneDuelState.enemyCast + enemyCastGain,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.playerCast = clampBattleSceneGauge(
        battleSceneDuelState.playerCast - playerCastDrop,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - (3 + retreatLayers));
      battleSceneDuelState.dpsMomentum = Math.max(0, battleSceneDuelState.dpsMomentum * 0.42);
      comboAction = "cooldown";
      tickerText =
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `돌파 후퇴 실패 · ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)} · 기 ${fmtSignedInteger(-retreatQiLoss)}`
          : `돌파 후퇴 실패 · ${retreatLayers}단계 하락 · 기 ${fmtSignedInteger(-retreatQiLoss)}`;
      tickerTone = "error";
      tickerKey = "breakthrough_retreat_fail";
      bannerText =
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `경지 후퇴 ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)} · 기 ${fmtSignedInteger(-retreatQiLoss)}`
          : `경지 후퇴 ${retreatLayers}단계 · 기 ${fmtSignedInteger(-retreatQiLoss)}`;
      bannerTone = "error";
      bannerKey = "breakthrough_retreat_fail";
      applyOutcomeTransition = true;
    } else if (outcomeCode === "death_fail") {
      const reward = Math.max(0, Number(outcome.rebirthReward) || 0);
      battleSceneDuelState.playerHp = clampBattleSceneGauge(
        22 + reward * 1.4,
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.enemyHp = clampBattleSceneGauge(
        86 + deathPct * 0.08,
        BATTLE_SCENE_DUEL_MAX_HP,
      );
      battleSceneDuelState.playerCast = clampBattleSceneGauge(
        14 + reward * 2.2,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.enemyCast = clampBattleSceneGauge(
        62 + deathPct * 0.12,
        BATTLE_SCENE_DUEL_MAX_CAST,
      );
      battleSceneDuelState.combo = 0;
      battleSceneDuelState.dpsMomentum = Math.max(0, battleSceneDuelState.dpsMomentum * 0.24);
      comboAction = "cooldown";
      tickerText =
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `도겁 사망 · ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)} 환생`
          : "도겁 사망 · 환생 전환";
      tickerTone = "error";
      tickerKey = "breakthrough_death_fail";
      bannerText =
        toDifficultyIndex > 0
          ? `환생 발동 · 난이도 ${fmtNumber(toDifficultyIndex)} 재정렬`
          : "환생 발동 · 기맥 재정렬";
      bannerTone = "warn";
      bannerKey = "breakthrough_death_fail";
      applyOutcomeTransition = true;
    } else {
      battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 1);
      battleSceneDuelState.dpsMomentum = Math.max(0, battleSceneDuelState.dpsMomentum * 0.76);
      comboAction = "resonance";
      tickerText = "돌파 결과 갱신 · 전장 기세 재계산";
      tickerTone = "info";
      tickerKey = "breakthrough_result";
      applyOutcomeTransition = true;
    }
  } else if (kind === "battle_win") {
    battleSceneDuelState.enemyHp = clampBattleSceneGauge(
      battleSceneDuelState.enemyHp - rollBattleSceneInteger(18, 34),
      BATTLE_SCENE_DUEL_MAX_HP,
    );
    battleSceneDuelState.playerCast = clampBattleSceneGauge(
      battleSceneDuelState.playerCast + rollBattleSceneInteger(22, 36),
      BATTLE_SCENE_DUEL_MAX_CAST,
    );
    tickerText = "수동 전투 승리 · 전장 주도권 확보";
    tickerTone = "success";
    tickerKey = "battle_win";
  } else if (kind === "battle_loss") {
    battleSceneDuelState.playerHp = clampBattleSceneGauge(
      battleSceneDuelState.playerHp - rollBattleSceneInteger(18, 34),
      BATTLE_SCENE_DUEL_MAX_HP,
    );
    battleSceneDuelState.enemyCast = clampBattleSceneGauge(
      battleSceneDuelState.enemyCast + rollBattleSceneInteger(22, 36),
      BATTLE_SCENE_DUEL_MAX_CAST,
    );
    tickerText = "수동 전투 패배 · 진형 재정비";
    tickerTone = "warn";
    tickerKey = "battle_loss";
  } else if (kind === "breakthrough_success") {
    battleSceneDuelState.playerHp = BATTLE_SCENE_DUEL_MAX_HP;
    battleSceneDuelState.enemyHp = BATTLE_SCENE_DUEL_MAX_HP;
    battleSceneDuelState.playerCast = rollBattleSceneInteger(34, 72);
    battleSceneDuelState.enemyCast = rollBattleSceneInteger(14, 48);
    tickerText = "돌파 성공 · 기세 급상승";
    tickerTone = "success";
    tickerKey = "breakthrough_success";
    bannerText = "경지 돌파 · 영맥 개화";
    bannerTone = "success";
    bannerKey = "breakthrough_success";
  } else {
    battleSceneDuelState.playerHp = clampBattleSceneGauge(
      battleSceneDuelState.playerHp - rollBattleSceneInteger(10, 22),
      BATTLE_SCENE_DUEL_MAX_HP,
    );
    battleSceneDuelState.enemyCast = clampBattleSceneGauge(
      battleSceneDuelState.enemyCast + rollBattleSceneInteger(12, 26),
      BATTLE_SCENE_DUEL_MAX_CAST,
    );
    tickerText = "돌파 실패 · 기세 불안정";
    tickerTone = "warn";
    tickerKey = "breakthrough_fail";
  }

  battleSceneDuelState.pressure = resolveBattleSceneDuelPressure(resolveBattleSceneAmbientMode());
  const playerHpPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.playerHp, BATTLE_SCENE_DUEL_MAX_HP) /
      BATTLE_SCENE_DUEL_MAX_HP) *
      100,
  );
  const enemyHpPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.enemyHp, BATTLE_SCENE_DUEL_MAX_HP) /
      BATTLE_SCENE_DUEL_MAX_HP) *
      100,
  );
  if (applyOutcomeTransition) {
    const lead = resolveBattleSceneLead(playerHpPct, enemyHpPct);
    const danger = resolveBattleSceneDangerSide(playerHpPct, enemyHpPct);
    const comboTier = resolveBattleSceneComboTier(battleSceneDuelState.combo);
    applyBattleSceneOutcomeDuelTransitions({
      lead,
      pressure: battleSceneDuelState.pressure,
      danger,
      comboTier,
      comboAction,
    });
  }
  if (tickerText) {
    pushBattleSceneTicker(tickerText, tickerTone, source, tickerKey);
  }
  if (bannerText) {
    setBattleSceneSkillBanner(bannerText, bannerTone, source, {
      key: bannerKey,
      actor: "center",
    });
  }
  renderBattleSceneDuelHud();
}

function applyBattleSceneDuelBurst(attacker, mode = "idle", visuals = true, options = {}) {
  const attackerKey = attacker === "player" ? "playerCast" : "enemyCast";
  const defenderKey = attacker === "player" ? "enemyHp" : "playerHp";
  const attackerAnchor = attacker === "player" ? "player" : "enemy";
  const defenderAnchor = attacker === "player" ? "enemy" : "player";
  const fromAmbient = options.fromAmbient === true;
  const resultPrioritySuppressed = options.resultPrioritySuppressed === true;
  const suppressAmbientNarrative = options.suppressAmbientNarrative === true;
  const suppressAmbientActorFrames = options.suppressAmbientActorFrames === true;
  const allowKineticFx =
    !resultPrioritySuppressed ||
    Math.random() < (mode === "realtime" ? 0.34 : mode === "auto" ? 0.26 : 0.2);
  const allowAmbientTicker =
    !suppressAmbientNarrative &&
    (!resultPrioritySuppressed || Math.random() < 0.52);
  const allowAmbientBanner =
    !suppressAmbientNarrative &&
    (!resultPrioritySuppressed || Math.random() < 0.38);
  const tone = attacker === "player" ? "success" : "warn";
  const skillPool =
    attacker === "player"
      ? BATTLE_SCENE_PLAYER_SKILLS
      : BATTLE_SCENE_ENEMY_SKILLS;
  const skillLabel =
    skillPool[rollBattleSceneInteger(0, skillPool.length - 1)] || "비기";
  const burstDamage =
    mode === "realtime"
      ? rollBattleSceneInteger(22, 38)
      : mode === "auto"
        ? rollBattleSceneInteger(18, 32)
        : rollBattleSceneInteger(14, 24);
  battleSceneDuelState[attackerKey] = 0;
  battleSceneDuelState[defenderKey] = clampBattleSceneGauge(
    battleSceneDuelState[defenderKey] - burstDamage,
    BATTLE_SCENE_DUEL_MAX_HP,
  );
  battleSceneDuelState.combo += 1;
  battleSceneDuelState.maxCombo = Math.max(
    battleSceneDuelState.maxCombo,
    battleSceneDuelState.combo,
  );
  battleSceneDuelState.dpsMomentum = Math.min(
    36,
    battleSceneDuelState.dpsMomentum + burstDamage * 0.5,
  );
  playBattleSfx("burst", {
    attacker,
    mode,
  });
  playBattleHaptic("burst", {
    attacker,
    mode,
  });
  if (allowKineticFx) {
    triggerBattleSceneCameraShake(
      mode === "realtime" ? "heavy" : mode === "auto" ? "medium" : "lateral",
      { fromAmbient },
    );
    triggerBattleSceneZoomPulse(
      mode === "realtime" || burstDamage >= 30 ? "burst" : "soft",
      { fromAmbient },
    );
    triggerBattleSceneHitStop(
      mode === "realtime" || burstDamage >= 30 ? "heavy" : "medium",
      { fromAmbient },
    );
  }
  const shouldShowComboBanner =
    !suppressAmbientNarrative
      ? !resultPrioritySuppressed || battleSceneDuelState.combo % 5 === 0
      : battleSceneDuelState.combo >= BATTLE_SCENE_RESULT_PRIORITY_COMBO_BANNER_MIN_COMBO &&
        battleSceneDuelState.combo % 3 === 0 &&
        Math.random() < 0.18;
  if (shouldShowComboBanner) {
    setBattleSceneComboBanner(battleSceneDuelState.combo, tone, "ambient");
  }
  if (!suppressAmbientActorFrames) {
    setBattleSceneActorFrame(attacker, "skill");
    setBattleSceneActorFrame(defenderAnchor, "hit");
  }
  if (allowAmbientTicker) {
    pushBattleSceneTicker(
      `${attacker === "player" ? "수련자" : "적수"} 비기 ${skillLabel} · ${burstDamage}`,
      tone,
    );
  }
  if (allowAmbientBanner) {
    setBattleSceneSkillBanner(
      `${attacker === "player" ? "수련자" : "적수"} · ${skillLabel}`,
      tone,
      "ambient",
      {
        key: attacker === "player" ? "ambient_skill_player" : "ambient_skill_enemy",
        actor: attacker,
        skillLabel,
      },
    );
  }
  if (!visuals || resultPrioritySuppressed) {
    return;
  }
  spawnBattleSceneFloat("비기", { tone, anchor: attackerAnchor });
  spawnBattleSceneFloat(`-${burstDamage}`, { tone, anchor: defenderAnchor });
  spawnBattleSceneSpark({ anchor: "center", tone, shape: "ring", scale: 1.24 });
  spawnBattleSceneTrail({ anchor: "center", tone, shape: "wave", angleDeg: 0, length: 104 });
  spawnBattleSceneShockwave({
    anchor: "center",
    tone,
    radiusPx: mode === "realtime" ? 90 : mode === "auto" ? 82 : 74,
    thicknessPx: mode === "realtime" ? 3 : 2.5,
    lingerSec: mode === "realtime" ? 0.68 : 0.6,
  });
}

function applyBattleSceneDuelStrike(attacker, mode = "idle", visuals = true, options = {}) {
  const defenderKey = attacker === "player" ? "enemyHp" : "playerHp";
  const attackerCastKey = attacker === "player" ? "playerCast" : "enemyCast";
  const defenderAnchor = attacker === "player" ? "enemy" : "player";
  const attackerAnchor = attacker === "player" ? "player" : "enemy";
  const fromAmbient = options.fromAmbient === true;
  const resultPrioritySuppressed = options.resultPrioritySuppressed === true;
  const suppressAmbientNarrative = options.suppressAmbientNarrative === true;
  const suppressAmbientActorFrames = options.suppressAmbientActorFrames === true;
  const allowKineticFx =
    !resultPrioritySuppressed ||
    Math.random() < (mode === "realtime" ? 0.42 : mode === "auto" ? 0.34 : 0.26);
  const allowAmbientTicker =
    !suppressAmbientNarrative &&
    (!resultPrioritySuppressed || Math.random() < 0.48);
  const tone = attacker === "player" ? "success" : "warn";
  const [minDamage, maxDamage] =
    mode === "realtime" ? [7, 13] : mode === "auto" ? [5, 9] : [3, 6];
  let damage = rollBattleSceneInteger(minDamage, maxDamage);
  const critChance = mode === "realtime" ? 0.22 : mode === "auto" ? 0.14 : 0.08;
  const isCrit = Math.random() < critChance;
  if (isCrit) {
    damage = Math.max(damage + 2, Math.round(damage * 1.55));
  }
  const castGain = mode === "realtime" ? 24 : mode === "auto" ? 18 : 12;
  battleSceneDuelState[defenderKey] = clampBattleSceneGauge(
    battleSceneDuelState[defenderKey] - damage,
    BATTLE_SCENE_DUEL_MAX_HP,
  );
  battleSceneDuelState.combo += 1;
  battleSceneDuelState.maxCombo = Math.max(
    battleSceneDuelState.maxCombo,
    battleSceneDuelState.combo,
  );
  battleSceneDuelState.dpsMomentum = Math.min(
    36,
    battleSceneDuelState.dpsMomentum + damage * 0.28,
  );
  battleSceneDuelState[attackerCastKey] = clampBattleSceneGauge(
    battleSceneDuelState[attackerCastKey] + castGain,
    BATTLE_SCENE_DUEL_MAX_CAST,
  );
  playBattleSfx("strike", {
    attacker,
    isCrit,
    mode,
    damage,
  });
  playBattleHaptic("strike", {
    attacker,
    isCrit,
    mode,
    damage,
  });
  if (allowKineticFx) {
    triggerBattleSceneCameraShake(
      isCrit ? "medium" : attacker === "enemy" ? "lateral" : mode === "realtime" ? "medium" : "light",
      { fromAmbient },
    );
    triggerBattleSceneZoomPulse(
      isCrit || mode === "realtime" ? "burst" : "soft",
      { fromAmbient },
    );
    triggerBattleSceneHitStop(
      isCrit ? "medium" : mode === "realtime" ? "medium" : "light",
      { fromAmbient },
    );
  }
  const shouldOpenComboBanner =
    battleSceneDuelState.combo >= 3 &&
    (isCrit || battleSceneDuelState.combo % (resultPrioritySuppressed ? 5 : 3) === 0);
  const shouldShowComboBanner =
    !suppressAmbientNarrative
      ? shouldOpenComboBanner
      : shouldOpenComboBanner &&
        battleSceneDuelState.combo >= BATTLE_SCENE_RESULT_PRIORITY_COMBO_BANNER_MIN_COMBO &&
        Math.random() < 0.16;
  if (shouldShowComboBanner) {
    setBattleSceneComboBanner(
      battleSceneDuelState.combo,
      isCrit ? "error" : tone,
      "ambient",
    );
  }
  if (!suppressAmbientActorFrames) {
    setBattleSceneActorFrame(attacker, "attack");
    setBattleSceneActorFrame(defenderAnchor, "hit");
  }
  if ((isCrit || damage >= 12) && allowAmbientTicker) {
    pushBattleSceneTicker(
      `${attacker === "player" ? "수련자" : "적수"} ${isCrit ? "치명타" : "강타"} · ${damage}`,
      isCrit ? "error" : tone,
    );
  }
  if (visuals && !resultPrioritySuppressed) {
    spawnBattleSceneFloat(`-${damage}`, {
      tone: isCrit ? "error" : tone,
      anchor: defenderAnchor,
    });
    if (isCrit) {
      spawnBattleSceneFloat("치명", { tone: "error", anchor: attackerAnchor });
    }
    spawnBattleSceneSpark({
      anchor: "center",
      tone,
      shape: isCrit ? "ring" : "shard",
      scale: isCrit ? 1.24 : 0.98,
    });
    spawnBattleSceneTrail({
      anchor: "center",
      tone,
      angleDeg: attacker === "player" ? 12 : 166,
      length: isCrit ? 102 : 84,
    });
    spawnBattleSceneShockwave({
      anchor: "center",
      tone: isCrit ? "error" : tone,
      radiusPx: isCrit ? 70 : 48,
      thicknessPx: isCrit ? 2.8 : 2,
      lingerSec: isCrit ? 0.56 : 0.42,
    });
  }
  if (battleSceneDuelState[attackerCastKey] >= BATTLE_SCENE_DUEL_MAX_CAST) {
    applyBattleSceneDuelBurst(attacker, mode, visuals, options);
  }
}

function runBattleSceneDuelTick(mode = "idle", options = {}) {
  const visuals = options.visuals !== false;
  const resultPrioritySuppressed = options.resultPrioritySuppressed === true;
  const suppressAmbientNarrative = options.suppressAmbientNarrative === true;
  const suppressAmbientActorFrames = options.suppressAmbientActorFrames === true;
  const baseStrikeAttempts = mode === "realtime" ? 2 : 1;
  const strikeAttempts = resultPrioritySuppressed ? 1 : baseStrikeAttempts;
  const baseStrikeChance = mode === "realtime" ? 0.92 : mode === "auto" ? 0.76 : 0.52;
  const strikeChance = resultPrioritySuppressed
    ? baseStrikeChance * BATTLE_SCENE_RESULT_PRIORITY_STRIKE_CHANCE_SCALE
    : baseStrikeChance;
  let strikeHappened = false;
  for (let i = 0; i < strikeAttempts; i += 1) {
    if (Math.random() > strikeChance) {
      continue;
    }
    const momentum = battleSceneDuelState.playerHp - battleSceneDuelState.enemyHp;
    const playerBias = momentum < 0 ? 0.58 : momentum > 0 ? 0.42 : 0.5;
    const attacker = Math.random() < playerBias ? "player" : "enemy";
    applyBattleSceneDuelStrike(attacker, mode, visuals, {
      fromAmbient: true,
      resultPrioritySuppressed,
      suppressAmbientNarrative,
      suppressAmbientActorFrames,
    });
    strikeHappened = true;
  }
  if (!strikeHappened && battleSceneDuelState.combo > 0) {
    const comboDecayStep = resultPrioritySuppressed ? 0 : mode === "realtime" ? 2 : 1;
    if (comboDecayStep > 0) {
      battleSceneDuelState.combo = Math.max(
        0,
        battleSceneDuelState.combo - comboDecayStep,
      );
      if (
        battleSceneDuelState.combo === 0 &&
        !suppressAmbientNarrative &&
        Math.random() < (resultPrioritySuppressed ? 0.08 : 0.2)
      ) {
        pushBattleSceneTicker("연격 종료 · 기세 재정렬", "info");
      }
    }
    if (battleSceneDuelState.combo <= 0) {
      clearBattleSceneComboBanner();
    }
  }

  const playerDown = battleSceneDuelState.playerHp <= 0;
  const enemyDown = battleSceneDuelState.enemyHp <= 0;
  if (playerDown || enemyDown) {
    if (resultPrioritySuppressed) {
      // 결과 우선 구간에서는 ambient 라운드 리셋을 지연해 엔진 실결과 연출 비중을 유지한다.
      battleSceneDuelState.playerHp = Math.max(12, battleSceneDuelState.playerHp);
      battleSceneDuelState.enemyHp = Math.max(12, battleSceneDuelState.enemyHp);
      battleSceneDuelState.combo = Math.max(0, battleSceneDuelState.combo - 1);
      clearBattleSceneComboBanner();
    } else {
      const playerWon = enemyDown && !playerDown ? true : playerDown && !enemyDown ? false : Math.random() < 0.5;
      const tone = playerWon ? "success" : "warn";
      if (visuals && !resultPrioritySuppressed) {
        triggerBattleSceneImpact(playerWon ? "battle_win" : "battle_loss", tone, {
          fromAmbient: true,
          syncDuel: false,
        });
        spawnBattleSceneFloat(playerWon ? "환영 승리" : "환영 패배", {
          tone,
          anchor: "center",
        });
      }
      if (
        !suppressAmbientNarrative &&
        (!resultPrioritySuppressed || Math.random() < 0.4)
      ) {
        pushBattleSceneTicker(
          `${battleSceneDuelState.round}R 종료 · ${playerWon ? "수련자 우세" : "적수 우세"}`,
          tone,
        );
      }
      battleSceneDuelState.round += 1;
      battleSceneDuelState.playerHp = BATTLE_SCENE_DUEL_MAX_HP;
      battleSceneDuelState.enemyHp = BATTLE_SCENE_DUEL_MAX_HP;
      battleSceneDuelState.playerCast = rollBattleSceneInteger(12, 34);
      battleSceneDuelState.enemyCast = rollBattleSceneInteger(12, 34);
      battleSceneDuelState.combo = 0;
      clearBattleSceneComboBanner();
    }
  }

  battleSceneDuelState.dpsMomentum = Math.max(
    0,
    battleSceneDuelState.dpsMomentum * (mode === "realtime" ? 0.86 : mode === "auto" ? 0.82 : 0.76),
  );
  battleSceneDuelState.pressure = resolveBattleSceneDuelPressure(mode);
  renderBattleSceneDuelHud();
}

function spawnBattleSceneFloat(text, options = {}) {
  if (!dom.battleSceneFloatLayer) {
    return;
  }
  const anchor = options.anchor === "player" || options.anchor === "enemy" ? options.anchor : "center";
  const tone = normalizeBattleSceneTone(options.tone || "info");
  const anchorPoint =
    anchor === "player"
      ? { leftPct: 28, topPct: 69 }
      : anchor === "enemy"
        ? { leftPct: 72, topPct: 44 }
        : { leftPct: 50, topPct: 52 };
  const jitterX = (Math.random() - 0.5) * 12;
  const jitterY = (Math.random() - 0.5) * 8;
  const floatNode = document.createElement("span");
  floatNode.className = "battle-float";
  floatNode.classList.add(`tone-${tone}`);
  floatNode.textContent = String(text);
  floatNode.style.left = `calc(${anchorPoint.leftPct}% + ${jitterX.toFixed(1)}px)`;
  floatNode.style.top = `calc(${anchorPoint.topPct}% + ${jitterY.toFixed(1)}px)`;
  floatNode.addEventListener(
    "animationend",
    () => {
      floatNode.remove();
      syncBattleSceneMotionLayerContracts();
    },
    { once: true },
  );
  dom.battleSceneFloatLayer.append(floatNode);
  while (dom.battleSceneFloatLayer.childElementCount > 18) {
    dom.battleSceneFloatLayer.firstElementChild?.remove();
  }
  syncBattleSceneMotionLayerContracts();
}

function spawnBattleSceneSpark(options = {}) {
  if (!dom.battleSceneSparkLayer || shouldReduceBattleSceneMotion()) {
    return;
  }
  const anchor = options.anchor === "player" || options.anchor === "enemy" ? options.anchor : "center";
  const tone = normalizeBattleSceneTone(options.tone || "info");
  const shape =
    options.shape === "shard" || options.shape === "ring" ? options.shape : "dot";
  const anchorPoint =
    anchor === "player"
      ? { leftPct: 30, topPct: 68 }
      : anchor === "enemy"
        ? { leftPct: 70, topPct: 46 }
        : { leftPct: 50, topPct: 54 };
  const jitterX = (Math.random() - 0.5) * 18;
  const jitterY = (Math.random() - 0.5) * 12;
  const angleDeg = (Number(options.angleDeg) || 0) + (Math.random() - 0.5) * 36;
  const scale = Math.max(0.7, Math.min(1.6, Number(options.scale) || 1));
  const node = document.createElement("span");
  node.className = `battle-spark tone-${tone} shape-${shape}`;
  node.style.left = `calc(${anchorPoint.leftPct}% + ${jitterX.toFixed(1)}px)`;
  node.style.top = `calc(${anchorPoint.topPct}% + ${jitterY.toFixed(1)}px)`;
  node.style.setProperty("--battle-spark-angle", `${angleDeg.toFixed(1)}deg`);
  node.style.setProperty("--battle-spark-scale", scale.toFixed(2));
  node.addEventListener(
    "animationend",
    () => {
      node.remove();
      syncBattleSceneMotionLayerContracts();
    },
    { once: true },
  );
  dom.battleSceneSparkLayer.append(node);
  while (
    dom.battleSceneSparkLayer.childElementCount >
    resolveBattleSceneLayerCap("spark", options)
  ) {
    dom.battleSceneSparkLayer.firstElementChild?.remove();
  }
  syncBattleSceneMotionLayerContracts();
}

function spawnBattleSceneChargeMote(options = {}) {
  if (!dom.battleSceneSparkLayer || shouldReduceBattleSceneMotion()) {
    return;
  }
  const tone = normalizeBattleSceneTone(options.tone || "info");
  const anchor = options.anchor === "player" || options.anchor === "enemy" ? options.anchor : "center";
  const anchorPoint =
    anchor === "player"
      ? { leftPct: 30, topPct: 68 }
      : anchor === "enemy"
        ? { leftPct: 70, topPct: 46 }
        : { leftPct: 50, topPct: 54 };
  const radiusPx = Math.max(12, Math.min(40, Number(options.radiusPx) || 22));
  const sizePx = Math.max(3, Math.min(9, Number(options.sizePx) || 5));
  const startAngleDeg = Number(options.startAngleDeg) || Math.random() * 360;
  const sweepDeg = Number(options.sweepDeg) || (Math.random() > 0.5 ? 176 : -176);
  const lingerSec = Math.max(0.34, Math.min(1.8, Number(options.lingerSec) || 0.88));
  const jitterX = (Math.random() - 0.5) * 9;
  const jitterY = (Math.random() - 0.5) * 7;
  const node = document.createElement("span");
  node.className = `battle-charge-mote tone-${tone}`;
  node.style.left = `calc(${anchorPoint.leftPct}% + ${jitterX.toFixed(1)}px)`;
  node.style.top = `calc(${anchorPoint.topPct}% + ${jitterY.toFixed(1)}px)`;
  node.style.setProperty("--battle-charge-mote-radius", `${radiusPx.toFixed(1)}px`);
  node.style.setProperty("--battle-charge-mote-size", `${sizePx.toFixed(1)}px`);
  node.style.setProperty("--battle-charge-mote-angle-start", `${startAngleDeg.toFixed(1)}deg`);
  node.style.setProperty("--battle-charge-mote-sweep", `${sweepDeg.toFixed(1)}deg`);
  node.style.setProperty("--battle-charge-mote-linger-sec", `${lingerSec.toFixed(2)}s`);
  node.addEventListener(
    "animationend",
    () => {
      node.remove();
      syncBattleSceneMotionLayerContracts();
    },
    { once: true },
  );
  dom.battleSceneSparkLayer.append(node);
  while (
    dom.battleSceneSparkLayer.childElementCount >
    resolveBattleSceneLayerCap("charge", options)
  ) {
    dom.battleSceneSparkLayer.firstElementChild?.remove();
  }
  syncBattleSceneMotionLayerContracts();
}

function spawnBattleSceneTrail(options = {}) {
  if (!dom.battleSceneTrailLayer || shouldReduceBattleSceneMotion()) {
    return;
  }
  const tone = normalizeBattleSceneTone(options.tone || "info");
  const shape = options.shape === "wave" ? "wave" : "slash";
  const anchor = options.anchor === "player" || options.anchor === "enemy" ? options.anchor : "center";
  const anchorPoint =
    anchor === "player"
      ? { leftPct: 34, topPct: 66 }
      : anchor === "enemy"
        ? { leftPct: 66, topPct: 44 }
        : { leftPct: 50, topPct: 52 };
  const jitterX = (Math.random() - 0.5) * 12;
  const jitterY = (Math.random() - 0.5) * 10;
  const baseAngleDeg = Number(options.angleDeg) || 0;
  const angleDeg = baseAngleDeg + (Math.random() - 0.5) * 18;
  const length = Math.max(42, Math.min(118, Number(options.length) || 72));
  const node = document.createElement("span");
  node.className = `battle-trail tone-${tone} shape-${shape}`;
  node.style.left = `calc(${anchorPoint.leftPct}% + ${jitterX.toFixed(1)}px)`;
  node.style.top = `calc(${anchorPoint.topPct}% + ${jitterY.toFixed(1)}px)`;
  node.style.setProperty("--battle-trail-angle", `${angleDeg.toFixed(1)}deg`);
  node.style.setProperty("--battle-trail-length", `${length.toFixed(1)}px`);
  node.addEventListener(
    "animationend",
    () => {
      node.remove();
      syncBattleSceneMotionLayerContracts();
    },
    { once: true },
  );
  dom.battleSceneTrailLayer.append(node);
  while (
    dom.battleSceneTrailLayer.childElementCount >
    resolveBattleSceneLayerCap("trail", options)
  ) {
    dom.battleSceneTrailLayer.firstElementChild?.remove();
  }
  syncBattleSceneMotionLayerContracts();
}

function spawnBattleSceneShockwave(options = {}) {
  if (!dom.battleSceneShockwaveLayer || shouldReduceBattleSceneMotion()) {
    return;
  }
  const tone = normalizeBattleSceneTone(options.tone || "info");
  const variant =
    options.variant === "telegraph" || options.variant === "telegraph-urgent"
      ? options.variant
      : "default";
  const anchor = options.anchor === "player" || options.anchor === "enemy" ? options.anchor : "center";
  const anchorPoint =
    anchor === "player"
      ? { leftPct: 32, topPct: 66 }
      : anchor === "enemy"
        ? { leftPct: 68, topPct: 45 }
        : { leftPct: 50, topPct: 53 };
  const jitterX = (Math.random() - 0.5) * 14;
  const jitterY = (Math.random() - 0.5) * 10;
  const radiusPx = Math.max(22, Math.min(148, Number(options.radiusPx) || 56));
  const thicknessPx = Math.max(1, Math.min(4.6, Number(options.thicknessPx) || 2.2));
  const lingerSec = Math.max(0.24, Math.min(1.4, Number(options.lingerSec) || 0.56));
  const node = document.createElement("span");
  node.className = `battle-shockwave tone-${tone} variant-${variant}`;
  node.style.left = `calc(${anchorPoint.leftPct}% + ${jitterX.toFixed(1)}px)`;
  node.style.top = `calc(${anchorPoint.topPct}% + ${jitterY.toFixed(1)}px)`;
  node.style.setProperty("--battle-shockwave-radius", `${radiusPx.toFixed(1)}px`);
  node.style.setProperty("--battle-shockwave-thickness", `${thicknessPx.toFixed(2)}px`);
  node.style.setProperty("--battle-shockwave-linger-sec", `${lingerSec.toFixed(2)}s`);
  node.addEventListener(
    "animationend",
    () => {
      node.remove();
      syncBattleSceneMotionLayerContracts();
    },
    { once: true },
  );
  dom.battleSceneShockwaveLayer.append(node);
  while (
    dom.battleSceneShockwaveLayer.childElementCount >
    resolveBattleSceneLayerCap("shockwave", options)
  ) {
    dom.battleSceneShockwaveLayer.firstElementChild?.remove();
  }
  syncBattleSceneMotionLayerContracts();
}

function maybeSpawnBattleSceneCastTelegraph(actor, options = {}) {
  if (!dom.battleSceneShockwaveLayer || shouldReduceBattleSceneMotion()) {
    return;
  }
  const actorKey = actor === "enemy" ? "enemy" : "player";
  const castPct = Math.max(0, Math.min(100, Number(options.castPct) || 0));
  if (castPct < 72) {
    return;
  }
  const resultPrioritySuppressed = options.resultPrioritySuppressed === true;
  if (resultPrioritySuppressed && castPct < 96) {
    return;
  }
  const mode = options.mode === "realtime" || options.mode === "auto" ? options.mode : "idle";
  const lowPerformanceMode =
    options.lowPerformanceMode === true || isBattleSceneLowPerformanceModeEnabled();
  const suppressionScale = resultPrioritySuppressed ? 0.56 : 1;
  const intervalScale =
    (lowPerformanceMode ? 1.45 : 1) *
    (resultPrioritySuppressed ? 1.42 : 1);
  const minIntervalMs =
    (mode === "realtime"
      ? castPct >= 96
        ? BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_REALTIME_MS - 200
        : BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_REALTIME_MS
      : mode === "auto"
        ? castPct >= 96
          ? BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_AUTO_MS - 180
          : BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_AUTO_MS
        : castPct >= 96
          ? BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_IDLE_MS - 220
          : BATTLE_SCENE_CAST_TELEGRAPH_MIN_INTERVAL_IDLE_MS) * intervalScale;
  const now = Date.now();
  if (now - battleSceneLastCastTelegraphAtMs[actorKey] < minIntervalMs) {
    return;
  }
  const telegraphChance =
    (mode === "realtime" ? 0.8 : mode === "auto" ? 0.7 : 0.58) *
    (lowPerformanceMode ? 0.72 : 1) *
    suppressionScale;
  if (castPct < 92 && Math.random() > telegraphChance) {
    return;
  }
  if (resultPrioritySuppressed && Math.random() > 0.64) {
    return;
  }
  if (lowPerformanceMode && castPct >= 92 && Math.random() > 0.82) {
    return;
  }
  const tone = actorKey === "player" ? "success" : "warn";
  const variant = castPct >= 96 ? "telegraph-urgent" : "telegraph";
  const radiusPx = (castPct >= 96 ? 62 : 54) + (castPct / 100) * 24;
  const thicknessPx = castPct >= 96 ? 3.1 : 2.4;
  const lingerSec = castPct >= 96 ? 0.62 : 0.72;
  spawnBattleSceneShockwave({
    anchor: actorKey,
    tone,
    variant,
    radiusPx,
    thicknessPx,
    lingerSec,
    lowPerformanceMode,
  });
  if (
    castPct >= 96 &&
    (!lowPerformanceMode ||
      Math.random() < (resultPrioritySuppressed ? 0.42 : 0.68))
  ) {
    spawnBattleSceneSpark({
      anchor: actorKey,
      tone,
      shape: "ring",
      scale: 1.08,
      lowPerformanceMode,
    });
  }
  battleSceneLastCastTelegraphAtMs[actorKey] = now;
}

function maybeSpawnBattleSceneChargeMote(actor, options = {}) {
  if (!dom.battleSceneSparkLayer || shouldReduceBattleSceneMotion()) {
    return;
  }
  const actorKey = actor === "enemy" ? "enemy" : "player";
  const castPct = Math.max(0, Math.min(100, Number(options.castPct) || 0));
  if (castPct < 52) {
    return;
  }
  const resultPrioritySuppressed = options.resultPrioritySuppressed === true;
  if (resultPrioritySuppressed && castPct < 96) {
    return;
  }
  const mode = options.mode === "realtime" || options.mode === "auto" ? options.mode : "idle";
  const lowPerformanceMode =
    options.lowPerformanceMode === true || isBattleSceneLowPerformanceModeEnabled();
  const suppressionScale = resultPrioritySuppressed ? 0.52 : 1;
  const intervalScale =
    (lowPerformanceMode ? 1.42 : 1) *
    (resultPrioritySuppressed ? 1.36 : 1);
  const minIntervalMs =
    (mode === "realtime"
      ? castPct >= 96
        ? BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_REALTIME_MS - 180
        : BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_REALTIME_MS
      : mode === "auto"
        ? castPct >= 96
          ? BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_AUTO_MS - 160
          : BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_AUTO_MS
        : castPct >= 96
          ? BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_IDLE_MS - 200
          : BATTLE_SCENE_CHARGE_MOTE_MIN_INTERVAL_IDLE_MS) * intervalScale;
  const now = Date.now();
  if (now - battleSceneLastChargeMoteAtMs[actorKey] < minIntervalMs) {
    return;
  }
  const spawnChance =
    castPct >= 96
      ? mode === "realtime"
        ? 0.96
        : mode === "auto"
          ? 0.88
          : 0.74
      : castPct >= 80
        ? mode === "realtime"
          ? 0.82
          : mode === "auto"
            ? 0.68
            : 0.56
        : mode === "realtime"
          ? 0.62
          : mode === "auto"
            ? 0.5
            : 0.34;
  if (
    Math.random() >
    spawnChance * (lowPerformanceMode ? 0.68 : 1) * suppressionScale
  ) {
    return;
  }
  const tone = actorKey === "player" ? "success" : "warn";
  spawnBattleSceneChargeMote({
    anchor: actorKey,
    tone,
    radiusPx:
      castPct >= 96 ? 31 + Math.random() * 5 : castPct >= 80 ? 26 + Math.random() * 5 : 20 + Math.random() * 5,
    sizePx: castPct >= 96 ? 7 : castPct >= 80 ? 6 : 4.8,
    lingerSec:
      mode === "realtime" ? 0.66 : mode === "auto" ? 0.76 : 0.92,
    sweepDeg:
      (actorKey === "player" ? 1 : -1) * (castPct >= 96 ? 232 : castPct >= 80 ? 204 : 172),
    lowPerformanceMode,
  });
  if (
    castPct >= 96 &&
    Math.random() <
      (lowPerformanceMode
        ? resultPrioritySuppressed
          ? 0.24
          : 0.36
        : resultPrioritySuppressed
          ? 0.34
          : 0.54)
  ) {
    spawnBattleSceneSpark({
      anchor: actorKey,
      tone,
      shape: "dot",
      scale: 0.84 + Math.random() * 0.34,
      lowPerformanceMode,
    });
  }
  battleSceneLastChargeMoteAtMs[actorKey] = now;
}

function triggerBattleSceneFlash(tone = "info") {
  if (!dom.battleSceneFlash) {
    return;
  }
  const normalizedTone = normalizeBattleSceneTone(tone);
  dom.battleSceneFlash.classList.remove("is-active", ...BATTLE_SCENE_TONE_CLASSES);
  dom.battleSceneFlash.classList.add(`tone-${normalizedTone}`);
  dom.battleSceneFlash.dataset.tone = normalizedTone;
  void dom.battleSceneFlash.offsetWidth;
  dom.battleSceneFlash.classList.add("is-active");
  dom.battleSceneFlash.dataset.flashActive = "true";
  syncBattleSceneMotionLayerContracts();
  if (battleSceneFlashTimer !== null) {
    window.clearTimeout(battleSceneFlashTimer);
  }
  battleSceneFlashTimer = window.setTimeout(() => {
    dom.battleSceneFlash?.classList.remove("is-active");
    if (dom.battleSceneFlash) {
      dom.battleSceneFlash.dataset.flashActive = "false";
    }
    syncBattleSceneMotionLayerContracts();
    battleSceneFlashTimer = null;
  }, 520);
}

function triggerBattleSceneCameraShake(preset = "light", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedPreset =
    preset === "heavy"
      ? "heavy"
      : preset === "medium"
        ? "medium"
        : preset === "lateral"
          ? "lateral"
          : "light";
  const now = Date.now();
  const minIntervalMs = normalizedPreset === "light" ? 140 : 95;
  if (now - battleSceneLastShakeAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedPreset === "light" && Math.random() > 0.58) {
    return;
  }
  const className = `scene-shake-${normalizedPreset}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_SHAKE_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneShakeTimer !== null) {
    window.clearTimeout(battleSceneShakeTimer);
  }
  const durationMs = BATTLE_SCENE_SHAKE_DURATIONS_MS[normalizedPreset] || 240;
  battleSceneShakeTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    battleSceneShakeTimer = null;
  }, durationMs);
  battleSceneLastShakeAtMs = now;
}

function triggerBattleSceneZoomPulse(preset = "soft", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedPreset = preset === "burst" ? "burst" : "soft";
  const now = Date.now();
  const minIntervalMs = normalizedPreset === "burst" ? 220 : 320;
  if (now - battleSceneLastZoomAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedPreset === "soft" && Math.random() > 0.46) {
    return;
  }
  const className = `scene-zoom-${normalizedPreset}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_ZOOM_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneZoomTimer !== null) {
    window.clearTimeout(battleSceneZoomTimer);
  }
  const durationMs = BATTLE_SCENE_ZOOM_DURATIONS_MS[normalizedPreset] || 300;
  battleSceneZoomTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    battleSceneZoomTimer = null;
  }, durationMs);
  battleSceneLastZoomAtMs = now;
}

function triggerBattleSceneHitStop(preset = "light", options = {}) {
  if (!dom.battleSceneArena || shouldReduceBattleSceneMotion()) {
    return;
  }
  const normalizedPreset =
    preset === "heavy"
      ? "heavy"
      : preset === "medium"
        ? "medium"
        : "light";
  const now = Date.now();
  const minIntervalMs = normalizedPreset === "light" ? 88 : 64;
  if (now - battleSceneLastHitStopAtMs < minIntervalMs) {
    return;
  }
  if (options.fromAmbient === true && normalizedPreset === "light" && Math.random() > 0.42) {
    return;
  }
  const className = `scene-hit-stop-${normalizedPreset}`;
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_HIT_STOP_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(className);
  if (battleSceneHitStopTimer !== null) {
    window.clearTimeout(battleSceneHitStopTimer);
  }
  const durationMs = BATTLE_SCENE_HIT_STOP_DURATIONS_MS[normalizedPreset] || 72;
  battleSceneHitStopTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(className);
    battleSceneHitStopTimer = null;
  }, durationMs);
  battleSceneLastHitStopAtMs = now;
}

function triggerBattleSceneImpact(kind, tone = "info", options = {}) {
  if (!dom.battleSceneArena) {
    return;
  }
  const fromAmbient = options && options.fromAmbient === true;
  const source =
    options?.source === "battle" || options?.source === "breakthrough"
      ? options.source
      : "";
  const syncDuel = !(options && options.syncDuel === false);
  if (!fromAmbient) {
    battleSceneLastExplicitEventAtMs = Date.now();
    battleSceneLastExplicitEventSeq += 1;
    battleSceneLastExplicitEventSource = source || "";
    battleSceneLastExplicitEventKind =
      typeof kind === "string" && kind ? kind : "none";
    battleSceneLastExplicitEventTone = normalizeBattleSceneTone(tone);
    battleSceneLastExplicitEventOutcomeCode =
      typeof options?.outcome?.outcome === "string" && options.outcome.outcome
        ? options.outcome.outcome
        : "none";
    const explicitRandomOutcomeProfile =
      resolveBattleSceneAmbientRandomOutcomeProfile(
        {
          source: battleSceneLastExplicitEventSource,
          outcome:
            options?.outcome && typeof options.outcome === "object"
              ? options.outcome
              : null,
        },
        battleSceneLastExplicitEventSource,
      );
    battleSceneLastExplicitEventOutcomeProfile = explicitRandomOutcomeProfile;
    battleSceneLastExplicitEventSyncDuel = syncDuel ? "on" : "off";
    setBattleSceneAmbientImpactExplicitSnapshot(
      battleSceneLastExplicitEventSource || "none",
      battleSceneLastExplicitEventKind,
      battleSceneLastExplicitEventTone,
      battleSceneLastExplicitEventOutcomeCode,
      battleSceneLastExplicitEventOutcomeProfile,
      battleSceneLastExplicitEventSyncDuel,
    );
    setBattleSceneAmbientImpactExplicitSnapshotLifecycle(
      0,
      resolveBattleSceneAmbientRandomRecoveryWindowMs(
        battleSceneLastExplicitEventSource,
        battleSceneLastExplicitEventOutcomeProfile,
      ),
      resolveBattleSceneAmbientRandomQuietThresholdMs(
        battleSceneLastExplicitEventSource,
        battleSceneLastExplicitEventOutcomeProfile,
      ),
    );
    setBattleSceneAmbientImpactExplicitSnapshotState("fresh", "fresh", "signal");
    setBattleSceneAmbientImpactSequence(
      battleSceneLastExplicitEventSeq,
      battleSceneLastResultDrivenImpactSignalExplicitSeq,
    );
    setBattleSceneAmbientImpactRandomRecoverySource(
      battleSceneLastExplicitEventSource || "none",
    );
    setBattleSceneAmbientImpactRandomCadence(
      resolveBattleSceneAmbientRandomImpactDivisor(
        battleSceneLastExplicitEventSource,
        explicitRandomOutcomeProfile,
      ),
      battleSceneLastExplicitEventSource || "none",
      explicitRandomOutcomeProfile,
    );
    setBattleSceneAmbientImpactRandomProbability(
      resolveBattleSceneAmbientRandomImpactProbabilityScale(
        battleSceneLastExplicitEventSource,
        explicitRandomOutcomeProfile,
      ),
      battleSceneLastExplicitEventSource || "none",
      explicitRandomOutcomeProfile,
    );
    setBattleSceneAmbientImpactRandomKindProfile(
      resolveBattleSceneAmbientRandomImpactKindProfile(
        battleSceneLastExplicitEventSource,
        explicitRandomOutcomeProfile,
      ),
      battleSceneLastExplicitEventSource || "none",
    );
    setBattleSceneAmbientImpactRandomOutcomeProfile(
      explicitRandomOutcomeProfile,
      battleSceneLastExplicitEventSource || "none",
      battleSceneLastExplicitEventOutcomeCode,
    );
    setBattleSceneAmbientImpactRandomSyncPolicy(
      resolveBattleSceneAmbientRandomSyncDuel(
        battleSceneLastExplicitEventSource,
        explicitRandomOutcomeProfile,
      ),
      battleSceneLastExplicitEventSource || "none",
      explicitRandomOutcomeProfile,
    );
    setBattleSceneAmbientImpactRandomQuietThreshold(
      resolveBattleSceneAmbientRandomQuietThresholdMs(
        battleSceneLastExplicitEventSource,
        explicitRandomOutcomeProfile,
      ),
      battleSceneLastExplicitEventSource || "none",
      explicitRandomOutcomeProfile,
    );
    const randomRecoveryWindowMs =
      resolveBattleSceneAmbientRandomRecoveryWindowMs(
        battleSceneLastExplicitEventSource,
        explicitRandomOutcomeProfile,
      );
    setBattleSceneAmbientImpactRandomRecovery(
      randomRecoveryWindowMs,
      randomRecoveryWindowMs,
      explicitRandomOutcomeProfile,
    );
    setBattleSceneAmbientImpactExplicitSnapshotState("fresh", "fresh", "signal");
    if (source) {
      battleSceneLastResultDrivenImpactAtMs = battleSceneLastExplicitEventAtMs;
      battleSceneLastResultDrivenImpactSignal = {
        kind,
        tone: normalizeBattleSceneTone(tone),
        source,
        syncDuel,
        outcome:
          options?.outcome && typeof options.outcome === "object"
            ? options.outcome
            : undefined,
      };
      battleSceneLastResultDrivenImpactSignalExplicitAtMs = battleSceneLastExplicitEventAtMs;
      battleSceneLastResultDrivenImpactSignalExplicitSeq =
        battleSceneLastExplicitEventSeq;
      setBattleSceneAmbientImpactResultSnapshot(
        battleSceneLastResultDrivenImpactSignal,
      );
      setBattleSceneAmbientImpactResultSnapshotLifecycle(
        battleSceneLastResultDrivenImpactSignalExplicitSeq,
        0,
        resolveBattleSceneResultDrivenAmbientImpactPriorityWindowMs(
          battleSceneLastResultDrivenImpactSignal,
        ),
        0,
        resolveBattleSceneResultDrivenAmbientImpactReplayMax(
          battleSceneLastResultDrivenImpactSignal,
        ),
      );
      setBattleSceneAmbientImpactResultSnapshotWindows(
        0,
        resolveBattleSceneResultDrivenAmbientImpactReplayMinIntervalMs(
          battleSceneLastResultDrivenImpactSignal,
        ),
        resolveBattleSceneResultDrivenAmbientImpactPriorityWindowMs(
          battleSceneLastResultDrivenImpactSignal,
        ),
        resolveBattleSceneResultDrivenAmbientImpactPriorityWindowMs(
          battleSceneLastResultDrivenImpactSignal,
        ),
      );
      setBattleSceneAmbientImpactResultSnapshotState("fresh", "fresh", "signal");
      setBattleSceneAmbientImpactSource("result");
      setBattleSceneAmbientImpactLock("result");
      setBattleSceneAmbientImpactGate("fresh");
      setBattleSceneAmbientImpactFresh("fresh");
      setBattleSceneAmbientImpactActive("signal");
      setBattleSceneAmbientImpactRandomState("suppressed_result_signal");
      setBattleSceneAmbientImpactSignal(
        battleSceneLastResultDrivenImpactSignal,
        source,
      );
      battleSceneLastResultDrivenImpactReplayCount = 0;
      battleSceneLastResultDrivenImpactReplayAtMs = 0;
      const resultDrivenAmbientReplayOutcomeProfile =
        resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(
          battleSceneLastResultDrivenImpactSignal,
        );
      const resultDrivenAmbientReplayMax =
        resolveBattleSceneResultDrivenAmbientImpactReplayMax(
          battleSceneLastResultDrivenImpactSignal,
        );
      const resultDrivenAmbientReplayMinIntervalMs =
        resolveBattleSceneResultDrivenAmbientImpactReplayMinIntervalMs(
          battleSceneLastResultDrivenImpactSignal,
        );
      const resultDrivenAmbientPriorityWindowMs =
        resolveBattleSceneResultDrivenAmbientImpactPriorityWindowMs(
          battleSceneLastResultDrivenImpactSignal,
        );
      setBattleSceneAmbientImpactReplay(
        0,
        resultDrivenAmbientReplayMax,
        source,
        resultDrivenAmbientReplayOutcomeProfile,
      );
      setBattleSceneAmbientImpactCooldown(
        0,
        resultDrivenAmbientReplayMinIntervalMs,
        source,
        resultDrivenAmbientReplayOutcomeProfile,
      );
      setBattleSceneAmbientImpactPriorityWindow(
        resultDrivenAmbientPriorityWindowMs,
        resultDrivenAmbientPriorityWindowMs,
        source,
        resultDrivenAmbientReplayOutcomeProfile,
      );
      setBattleSceneAmbientImpactSignalAge(
        0,
        resultDrivenAmbientPriorityWindowMs,
        source,
        resultDrivenAmbientReplayOutcomeProfile,
      );
      setBattleSceneAmbientImpactSequence(
        battleSceneLastExplicitEventSeq,
        battleSceneLastResultDrivenImpactSignalExplicitSeq,
      );
    } else {
      if (battleSceneLastResultDrivenImpactSignal) {
        setBattleSceneAmbientImpactGate("stale_sequence");
        setBattleSceneAmbientImpactFresh("stale");
        setBattleSceneAmbientImpactActive("none");
        setBattleSceneAmbientImpactRandomState("suppressed_recovery_window");
        setBattleSceneAmbientImpactSignal(null, "idle");
        setBattleSceneAmbientImpactCooldown(
          0,
          resolveBattleSceneResultDrivenAmbientImpactReplayMinIntervalMs(
            battleSceneLastResultDrivenImpactSignal,
          ),
          battleSceneLastResultDrivenImpactSignal.source,
          resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(
            battleSceneLastResultDrivenImpactSignal,
          ),
        );
        const resultDrivenAmbientPriorityWindowMs =
          resolveBattleSceneResultDrivenAmbientImpactPriorityWindowMs(
            battleSceneLastResultDrivenImpactSignal,
          );
        setBattleSceneAmbientImpactPriorityWindow(
          0,
          resultDrivenAmbientPriorityWindowMs,
          battleSceneLastResultDrivenImpactSignal.source,
          resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(
            battleSceneLastResultDrivenImpactSignal,
          ),
        );
        setBattleSceneAmbientImpactSignalAge(
          0,
          resultDrivenAmbientPriorityWindowMs,
          battleSceneLastResultDrivenImpactSignal.source,
          resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(
            battleSceneLastResultDrivenImpactSignal,
          ),
        );
      } else {
        setBattleSceneAmbientImpactGate("no_signal");
        setBattleSceneAmbientImpactFresh("none");
        setBattleSceneAmbientImpactActive("none");
        setBattleSceneAmbientImpactRandomState("suppressed_recovery_window");
        setBattleSceneAmbientImpactSignal(null, "idle");
        setBattleSceneAmbientImpactCooldown(0);
        setBattleSceneAmbientImpactPriorityWindow(0);
        setBattleSceneAmbientImpactSignalAge(0);
      }
    }
  }
  const impactClass =
    kind === "battle_win"
      ? "scene-impact-win"
      : kind === "battle_loss"
        ? "scene-impact-loss"
        : kind === "breakthrough_success"
          ? "scene-impact-breakthrough-success"
          : "scene-impact-breakthrough-fail";
  const sceneState =
    kind === "battle_win"
      ? "battle_win"
      : kind === "battle_loss"
        ? "battle_loss"
        : kind === "breakthrough_success"
          ? "breakthrough_success"
          : "breakthrough_fail";
  const impactActorFrameCue = applyBattleSceneImpactActorFrames(kind, options);
  const impactKineticCue = resolveBattleSceneImpactKineticCue(kind, options);
  const impactVfxCue = resolveBattleSceneImpactVfxCue(kind, options);
  setBattleSceneImpactCue(impactActorFrameCue);
  setBattleSceneImpactKinetic(impactKineticCue.cue);
  setBattleSceneImpactVfx(impactVfxCue.cue);
  dom.battleSceneArena.classList.remove(...BATTLE_SCENE_IMPACT_CLASSES);
  void dom.battleSceneArena.offsetWidth;
  dom.battleSceneArena.classList.add(impactClass);
  setBattleSceneState(sceneState);
  if (battleSceneImpactTimer !== null) {
    window.clearTimeout(battleSceneImpactTimer);
  }
  battleSceneImpactTimer = window.setTimeout(() => {
    dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_IMPACT_CLASSES);
    battleSceneImpactTimer = null;
  }, 560);
  triggerBattleSceneFlash(tone);
  playBattleSfx("impact", {
    kind,
    tone,
  });
  playBattleHaptic("impact", {
    kind,
    tone,
  });
  triggerBattleSceneCameraShake(impactKineticCue.shakePreset, { fromAmbient });
  triggerBattleSceneZoomPulse(impactKineticCue.zoomPreset, { fromAmbient });
  triggerBattleSceneHitStop(impactKineticCue.hitStopPreset, { fromAmbient });
  triggerBattleSceneImpactVfxFromCue(impactVfxCue, tone, {
    fromAmbient,
  });
  if (syncDuel) {
    syncBattleSceneDuelFromImpact(kind, options);
  }
}

function resolveBattleSceneAmbientMode() {
  if (!state || !state.settings) {
    return "idle";
  }
  if (isRealtimeAutoRunning()) {
    return "realtime";
  }
  if (state.settings.autoBattle || state.settings.autoBreakthrough) {
    return "auto";
  }
  return "idle";
}

function runBattleSceneAmbientTick() {
  if (!dom.battleSceneArena || !state || document.hidden) {
    return;
  }
  const mode = resolveBattleSceneAmbientMode();
  setBattleSceneLoopMode(mode);
  const reducedMotion = shouldReduceBattleSceneMotion();
  const lowPerformanceMode = isBattleSceneLowPerformanceModeEnabled();
  battleSceneAmbientStep += 1;
  dom.battleSceneArena.dataset.scenePerformance = lowPerformanceMode ? "low" : "normal";
  const ambientPulseDivisor = resolveBattleSceneAmbientPulseDivisor(mode, {
    lowPerformanceMode,
  });
  const shouldPulseByMode = battleSceneAmbientStep % ambientPulseDivisor === 0;
  const ambientProbabilityScale = resolveBattleSceneAmbientProbabilityScale(mode, {
    lowPerformanceMode,
  });
  const now = Date.now();
  const quietMs = now - battleSceneLastExplicitEventAtMs;
  const resultDrivenQuietMs = now - battleSceneLastResultDrivenImpactAtMs;
  const prioritizeOutcomeSignals =
    quietMs < BATTLE_SCENE_RESULT_PRIORITY_WINDOW_MS ||
    resultDrivenQuietMs < BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_SUPPRESSION_WINDOW_MS;
  const holdDuelTickByOutcome =
    prioritizeOutcomeSignals &&
    resultDrivenQuietMs < BATTLE_SCENE_RESULT_PRIORITY_DUEL_HOLD_WINDOW_MS;
  const suppressAmbientNarrative =
    prioritizeOutcomeSignals &&
    resultDrivenQuietMs < BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_NARRATIVE_SUPPRESSION_WINDOW_MS;
  const suppressAmbientSfx =
    prioritizeOutcomeSignals &&
    resultDrivenQuietMs < BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_SFX_SUPPRESSION_WINDOW_MS;
  const suppressAmbientActorFrames =
    prioritizeOutcomeSignals &&
    resultDrivenQuietMs < BATTLE_SCENE_RESULT_PRIORITY_ACTOR_FRAME_SUPPRESSION_WINDOW_MS;
  const suppressAmbientDecorations =
    prioritizeOutcomeSignals &&
    resultDrivenQuietMs < BATTLE_SCENE_RESULT_DRIVEN_DECORATION_SUPPRESSION_WINDOW_MS;
  dom.battleSceneArena.dataset.sceneOutcomePriority = holdDuelTickByOutcome
    ? "hold"
    : suppressAmbientNarrative
      ? "narrative"
    : prioritizeOutcomeSignals
      ? "suppressed"
      : "normal";
  const shouldRunDuelTick =
    !holdDuelTickByOutcome &&
    (!prioritizeOutcomeSignals ||
      battleSceneAmbientStep % BATTLE_SCENE_RESULT_PRIORITY_DUEL_TICK_DIVISOR === 0);
  if (shouldRunDuelTick) {
    runBattleSceneDuelTick(mode, {
      visuals: !reducedMotion && !lowPerformanceMode && !prioritizeOutcomeSignals,
      resultPrioritySuppressed: prioritizeOutcomeSignals,
      suppressAmbientNarrative,
      suppressAmbientActorFrames,
    });
  }
  const playerHpPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.playerHp, BATTLE_SCENE_DUEL_MAX_HP) /
      BATTLE_SCENE_DUEL_MAX_HP) *
      100,
  );
  const enemyHpPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.enemyHp, BATTLE_SCENE_DUEL_MAX_HP) /
      BATTLE_SCENE_DUEL_MAX_HP) *
      100,
  );
  const playerCastPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.playerCast, BATTLE_SCENE_DUEL_MAX_CAST) /
      BATTLE_SCENE_DUEL_MAX_CAST) *
      100,
  );
  const enemyCastPct = Math.round(
    (clampBattleSceneGauge(battleSceneDuelState.enemyCast, BATTLE_SCENE_DUEL_MAX_CAST) /
      BATTLE_SCENE_DUEL_MAX_CAST) *
      100,
  );
  const sceneLead = resolveBattleSceneLead(playerHpPct, enemyHpPct);
  const sceneComboTier = resolveBattleSceneComboTier(battleSceneDuelState.combo);
  const dangerSide = resolveBattleSceneDangerSide(playerHpPct, enemyHpPct);
  const allowAmbientTransitions =
    !suppressAmbientNarrative ||
    battleSceneAmbientStep % BATTLE_SCENE_RESULT_PRIORITY_TRANSITION_DIVISOR === 0;
  if (allowAmbientTransitions) {
    maybeTriggerBattleSceneComboTierTransition(sceneComboTier, { fromAmbient: true });
    maybeTriggerBattleSceneDangerTransition(dangerSide);
  }
  const shouldPlayAmbientSfx =
    !holdDuelTickByOutcome &&
    (!suppressAmbientSfx ||
      battleSceneAmbientStep % BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_SFX_DIVISOR === 0);
  if (shouldPlayAmbientSfx) {
    playBattleSfx("ambient", {
      mode,
      pressure: battleSceneDuelState.pressure,
      lead: sceneLead,
    });
  }
  if (reducedMotion) {
    return;
  }
  const shouldPulseZoom =
    shouldPulseByMode &&
    (battleSceneDuelState.pressure === "high" || battleSceneDuelState.combo >= 6);
  const allowOutcomePriorityPulse =
    !prioritizeOutcomeSignals ||
    (mode === "realtime" &&
      battleSceneDuelState.pressure === "high" &&
      Math.random() < 0.2 * ambientProbabilityScale);
  if (shouldPulseZoom && allowOutcomePriorityPulse) {
    triggerBattleSceneZoomPulse(
      mode === "realtime" || battleSceneDuelState.pressure === "high" ? "burst" : "soft",
      { fromAmbient: true },
    );
    triggerBattleSceneHitStop(
      mode === "realtime" || battleSceneDuelState.pressure === "high" ? "medium" : "light",
      { fromAmbient: true },
    );
  }
  const shouldPulsePressureSpike =
    battleSceneDuelState.pressure === "high" && shouldPulseByMode;
  if (
    !prioritizeOutcomeSignals &&
    shouldPulsePressureSpike &&
    Math.random() <
      (mode === "realtime" ? 0.54 : mode === "auto" ? 0.38 : 0.22) *
        ambientProbabilityScale
  ) {
    triggerBattleScenePressureSpike("high", { fromAmbient: true });
  }
  const shouldPulsePressureResonance =
    battleSceneDuelState.pressure !== "low" && shouldPulseByMode;
  if (
    !prioritizeOutcomeSignals &&
    shouldPulsePressureResonance &&
    Math.random() <
      (battleSceneDuelState.pressure === "high"
        ? mode === "realtime"
          ? 0.38
          : mode === "auto"
            ? 0.28
            : 0.16
        : mode === "realtime"
          ? 0.24
          : mode === "auto"
            ? 0.18
            : 0.1) *
        ambientProbabilityScale
  ) {
    triggerBattleScenePressureResonance(
      battleSceneDuelState.pressure === "high" ? "high" : "medium",
      { fromAmbient: true },
    );
  }
  const shouldPulseDanger = dangerSide !== "none" && shouldPulseByMode;
  if (
    !prioritizeOutcomeSignals &&
    shouldPulseDanger &&
    Math.random() <
      (dangerSide === "both" ? 0.62 : mode === "realtime" ? 0.46 : mode === "auto" ? 0.34 : 0.22) *
        ambientProbabilityScale
  ) {
    triggerBattleSceneDangerPulse(dangerSide, { fromAmbient: true });
  }
  const shouldPulseDangerResonance = dangerSide !== "none" && shouldPulseByMode;
  if (
    !prioritizeOutcomeSignals &&
    shouldPulseDangerResonance &&
    Math.random() <
      (dangerSide === "both"
        ? mode === "realtime"
          ? 0.44
          : mode === "auto"
            ? 0.34
            : 0.2
        : mode === "realtime"
          ? 0.28
          : mode === "auto"
            ? 0.2
            : 0.12) *
        ambientProbabilityScale
  ) {
    triggerBattleSceneDangerResonance(dangerSide, { fromAmbient: true });
  }
  const shouldPulseLeadResonance = shouldPulseByMode;
  if (
    !prioritizeOutcomeSignals &&
    shouldPulseLeadResonance &&
    Math.random() <
      (sceneLead === "even"
        ? mode === "realtime"
          ? 0.22
          : mode === "auto"
            ? 0.16
            : 0.08
        : mode === "realtime"
          ? 0.38
          : mode === "auto"
            ? 0.28
            : 0.16) *
        ambientProbabilityScale
  ) {
    triggerBattleSceneLeadResonance(sceneLead, { fromAmbient: true });
  }
  const shouldPulseComboSurge = sceneComboTier !== "calm" && shouldPulseByMode;
  if (
    !prioritizeOutcomeSignals &&
    shouldPulseComboSurge &&
    Math.random() <
      (sceneComboTier === "frenzy"
        ? mode === "realtime"
          ? 0.56
          : mode === "auto"
            ? 0.42
            : 0.24
        : mode === "realtime"
          ? 0.36
          : mode === "auto"
            ? 0.26
            : 0.14) *
        ambientProbabilityScale
  ) {
    triggerBattleSceneComboSurge(sceneComboTier, { fromAmbient: true });
  }
  const shouldPulseComboResonance = sceneComboTier !== "calm" && shouldPulseByMode;
  if (
    !prioritizeOutcomeSignals &&
    shouldPulseComboResonance &&
    Math.random() <
      (sceneComboTier === "frenzy"
        ? mode === "realtime"
          ? 0.5
          : mode === "auto"
            ? 0.36
            : 0.2
        : mode === "realtime"
          ? 0.3
          : mode === "auto"
            ? 0.22
            : 0.12) *
        ambientProbabilityScale
  ) {
    triggerBattleSceneComboResonance(sceneComboTier, { fromAmbient: true, lead: sceneLead });
  }
  maybeSpawnBattleSceneCastTelegraph("player", {
    mode,
    castPct: playerCastPct,
    lowPerformanceMode,
    resultPrioritySuppressed: suppressAmbientDecorations,
  });
  maybeSpawnBattleSceneCastTelegraph("enemy", {
    mode,
    castPct: enemyCastPct,
    lowPerformanceMode,
    resultPrioritySuppressed: suppressAmbientDecorations,
  });
  maybeSpawnBattleSceneChargeMote("player", {
    mode,
    castPct: playerCastPct,
    lowPerformanceMode,
    resultPrioritySuppressed: suppressAmbientDecorations,
  });
  maybeSpawnBattleSceneChargeMote("enemy", {
    mode,
    castPct: enemyCastPct,
    lowPerformanceMode,
    resultPrioritySuppressed: suppressAmbientDecorations,
  });

  if (!prioritizeOutcomeSignals) {
    const tonePool =
      mode === "realtime"
        ? ["success", "success", "info", "warn"]
        : mode === "auto"
          ? ["success", "info", "info", "warn"]
          : ["info", "info", "warn"];
    const sparkCount = lowPerformanceMode
      ? mode === "realtime"
        ? 1
        : mode === "auto"
          ? 1
          : 0
      : mode === "realtime"
        ? 2
        : mode === "auto"
          ? 2
          : 1;
    const sparkSpawnChance = (lowPerformanceMode ? 0.62 : 0.76) * ambientProbabilityScale;
    for (let i = 0; i < sparkCount; i += 1) {
      if (Math.random() > sparkSpawnChance) {
        continue;
      }
      const anchorRoll = Math.random();
      const anchor = anchorRoll < 0.33 ? "player" : anchorRoll < 0.66 ? "enemy" : "center";
      const tone = tonePool[Math.floor(Math.random() * tonePool.length)] || "info";
      const shapeRoll = Math.random();
      const shape = shapeRoll < 0.5 ? "dot" : shapeRoll < 0.83 ? "shard" : "ring";
      spawnBattleSceneSpark({
        anchor,
        tone,
        shape,
        scale: 0.9 + Math.random() * 0.5,
        lowPerformanceMode,
      });
    }
    const trailCount = lowPerformanceMode
      ? mode === "realtime"
        ? 1
        : 0
      : mode === "realtime"
        ? 2
        : mode === "auto"
          ? 1
          : 0;
    const trailSpawnChance =
      (mode === "realtime" ? 0.74 : 0.66) *
      (lowPerformanceMode ? 0.74 : 1) *
      ambientProbabilityScale;
    for (let i = 0; i < trailCount; i += 1) {
      if (Math.random() > trailSpawnChance) {
        continue;
      }
      const trailTone = Math.random() < 0.62 ? "success" : "warn";
      const laneRoll = Math.random();
      if (laneRoll < 0.38) {
        spawnBattleSceneTrail({
          anchor: "center",
          tone: trailTone,
          angleDeg: 12 + Math.random() * 8,
          length: 74 + Math.random() * 24,
          lowPerformanceMode,
        });
      } else if (laneRoll < 0.76) {
        spawnBattleSceneTrail({
          anchor: "center",
          tone: trailTone,
          angleDeg: 164 + Math.random() * 10,
          length: 70 + Math.random() * 20,
          lowPerformanceMode,
        });
      } else {
        spawnBattleSceneTrail({
          anchor: "center",
          tone: "info",
          shape: "wave",
          angleDeg: (Math.random() - 0.5) * 26,
          length: 88 + Math.random() * 16,
          lowPerformanceMode,
        });
      }
    }
    const shouldSpawnShockwave =
      shouldPulseByMode &&
      (battleSceneDuelState.pressure === "high" || battleSceneDuelState.combo >= 5) &&
      Math.random() <
        (mode === "realtime" ? 0.52 : mode === "auto" ? 0.34 : 0.18) *
          ambientProbabilityScale *
          (lowPerformanceMode ? 0.82 : 1);
    if (shouldSpawnShockwave) {
      const lead = resolveBattleSceneLead(playerHpPct, enemyHpPct);
      const anchor = lead === "player" ? "player" : lead === "enemy" ? "enemy" : "center";
      const tone =
        lead === "player" ? "success" : lead === "enemy" ? "warn" : battleSceneDuelState.pressure === "high" ? "error" : "info";
      spawnBattleSceneShockwave({
        anchor,
        tone,
        radiusPx:
          mode === "realtime" ? 72 + Math.random() * 24 : mode === "auto" ? 62 + Math.random() * 18 : 52 + Math.random() * 12,
        thicknessPx: mode === "realtime" ? 2.8 : mode === "auto" ? 2.4 : 2,
        lingerSec: mode === "realtime" ? 0.58 : mode === "auto" ? 0.52 : 0.46,
        lowPerformanceMode,
      });
    }

  }

  const resultDrivenImpactGate =
    resolveBattleSceneResultDrivenAmbientImpactGate(now);
  const resultDrivenImpactSignal = resultDrivenImpactGate.signal;
  const resultDrivenImpactGateReason =
    resultDrivenImpactGate?.reason || "no_signal";
  const resultDrivenAmbientReplayMinIntervalMs =
    resolveBattleSceneResultDrivenAmbientImpactReplayMinIntervalMs(
      resultDrivenImpactSignal,
    );
  const staleResultDrivenImpactSignal =
    resultDrivenImpactGateReason === "stale_sequence";
  if (staleResultDrivenImpactSignal && !resultDrivenImpactSignal) {
    battleSceneLastResultDrivenImpactSignal = null;
    battleSceneLastResultDrivenImpactSignalExplicitAtMs = 0;
    battleSceneLastResultDrivenImpactSignalExplicitSeq = 0;
    battleSceneLastResultDrivenImpactReplayCount = 0;
    battleSceneLastResultDrivenImpactReplayAtMs = 0;
    setBattleSceneAmbientImpactResultSnapshot();
    setBattleSceneAmbientImpactResultSnapshotLifecycle();
    setBattleSceneAmbientImpactResultSnapshotWindows();
    setBattleSceneAmbientImpactResultSnapshotState();
    setBattleSceneAmbientImpactSource("idle");
    setBattleSceneAmbientImpactSignal(null, "idle");
    setBattleSceneAmbientImpactReplay(0);
  }
  const hasResultDrivenAmbientImpactSignal = !!resultDrivenImpactSignal;
  setBattleSceneAmbientImpactResultSnapshotLifecycle(
    battleSceneLastResultDrivenImpactSignalExplicitSeq,
    resultDrivenImpactGate.signalAgeMs,
    resultDrivenImpactGate.signalAgeMaxMs,
    battleSceneLastResultDrivenImpactReplayCount,
    resolveBattleSceneResultDrivenAmbientImpactReplayMax(
      resultDrivenImpactSignal,
    ),
  );
  setBattleSceneAmbientImpactResultSnapshotWindows(
    resultDrivenImpactGate.cooldownRemainingMs,
    resultDrivenImpactGate.cooldownMaxMs,
    resultDrivenImpactGate.priorityRemainingMs,
    resultDrivenImpactGate.priorityMaxMs,
  );
  setBattleSceneAmbientImpactResultSnapshotState(
    resultDrivenImpactGateReason,
    hasResultDrivenAmbientImpactSignal
      ? "fresh"
      : resultDrivenImpactGateReason == "stale_sequence" ||
          resultDrivenImpactGateReason == "stale_window"
        ? "stale"
        : "none",
    hasResultDrivenAmbientImpactSignal ? "signal" : "none",
  );
  const useResultDrivenAmbientImpact = hasResultDrivenAmbientImpactSignal;
  const resultDrivenAmbientReplayOutcomeProfile =
    hasResultDrivenAmbientImpactSignal && resultDrivenImpactSignal
      ? resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(
          resultDrivenImpactSignal,
        )
      : "neutral";
  const resultDrivenAmbientCooldownSource =
    resultDrivenImpactSignal?.source === "battle" ||
    resultDrivenImpactSignal?.source === "breakthrough"
      ? resultDrivenImpactSignal.source
      : battleSceneLastResultDrivenImpactSignal?.source === "battle" ||
          battleSceneLastResultDrivenImpactSignal?.source === "breakthrough"
        ? battleSceneLastResultDrivenImpactSignal.source
        : "none";
  const resultDrivenAmbientCooldownOutcomeProfile =
    resultDrivenAmbientCooldownSource !== "none" &&
    battleSceneLastResultDrivenImpactSignal
      ? resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(
          battleSceneLastResultDrivenImpactSignal,
        )
      : resultDrivenAmbientReplayOutcomeProfile;
  const resultDrivenAmbientPrioritySource = resultDrivenAmbientCooldownSource;
  const resultDrivenAmbientPriorityOutcomeProfile =
    resultDrivenAmbientCooldownOutcomeProfile;
  const resultDrivenAmbientSignalAgeSource = resultDrivenAmbientPrioritySource;
  const resultDrivenAmbientSignalAgeOutcomeProfile =
    resultDrivenAmbientPriorityOutcomeProfile;
  const resultDrivenAmbientReplayMax = resolveBattleSceneResultDrivenAmbientImpactReplayMax(
    resultDrivenImpactSignal,
  );
  const suppressRandomByResultGate =
    resultDrivenImpactGateReason === "replay_cooldown" ||
    resultDrivenImpactGateReason === "replay_exhausted";
  const randomRecoverySource =
    hasResultDrivenAmbientImpactSignal
      ? resultDrivenImpactSignal?.source
      : battleSceneLastExplicitEventSource;
  const randomOutcomeProfile =
    hasResultDrivenAmbientImpactSignal && resultDrivenImpactSignal
      ? resolveBattleSceneAmbientRandomOutcomeProfile(
          resultDrivenImpactSignal,
          randomRecoverySource,
        )
      : randomRecoverySource
        ? battleSceneLastExplicitEventOutcomeProfile
        : "neutral";
  const randomOutcomeCode = randomRecoverySource
    ? battleSceneLastExplicitEventOutcomeCode
    : "none";
  const randomOriginKind = randomRecoverySource
    ? battleSceneLastExplicitEventKind
    : "none";
  const randomOriginTone = randomRecoverySource
    ? battleSceneLastExplicitEventTone
    : "none";
  const randomImpactCadenceDivisor =
    resolveBattleSceneAmbientRandomImpactDivisor(
      randomRecoverySource,
      randomOutcomeProfile,
    );
  const randomImpactProbabilityScale =
    resolveBattleSceneAmbientRandomImpactProbabilityScale(
      randomRecoverySource,
      randomOutcomeProfile,
    );
  const randomKindProfile = resolveBattleSceneAmbientRandomImpactKindProfile(
    randomRecoverySource,
    randomOutcomeProfile,
  );
  const randomSyncDuel = resolveBattleSceneAmbientRandomSyncDuel(
    randomRecoverySource,
    randomOutcomeProfile,
  );
  const randomQuietThresholdMs = resolveBattleSceneAmbientRandomQuietThresholdMs(
    randomRecoverySource,
    randomOutcomeProfile,
  );
  const randomRecoveryMaxMs = resolveBattleSceneAmbientRandomRecoveryWindowMs(
    randomRecoverySource,
    randomOutcomeProfile,
  );
  const explicitAgeMs =
    battleSceneLastExplicitEventAtMs > 0 ? Math.max(0, quietMs) : 0;
  const randomRecoveryRemainingMs = Math.max(
    0,
    randomRecoveryMaxMs - Math.max(0, quietMs),
  );
  const suppressRandomByRecoveryWindow =
    !hasResultDrivenAmbientImpactSignal && randomRecoveryRemainingMs > 0;
  const allowRandomAmbientImpact =
    !hasResultDrivenAmbientImpactSignal &&
    !suppressRandomByResultGate &&
    !suppressRandomByRecoveryWindow;
  setBattleSceneAmbientImpactRandomRecovery(
    randomRecoveryRemainingMs,
    randomRecoveryMaxMs,
    randomOutcomeProfile,
  );
  setBattleSceneAmbientImpactRandomRecoverySource(
    randomRecoverySource || "none",
  );
  setBattleSceneAmbientImpactRandomCadence(
    randomImpactCadenceDivisor,
    randomRecoverySource || "none",
    randomOutcomeProfile,
  );
  setBattleSceneAmbientImpactRandomProbability(
    randomImpactProbabilityScale,
    randomRecoverySource || "none",
    randomOutcomeProfile,
  );
  setBattleSceneAmbientImpactRandomKindProfile(
    randomKindProfile,
    randomRecoverySource || "none",
  );
  setBattleSceneAmbientImpactRandomOutcomeProfile(
    randomOutcomeProfile,
    randomRecoverySource || "none",
    randomOutcomeCode,
  );
  setBattleSceneAmbientImpactRandomSyncPolicy(
    randomSyncDuel,
    randomRecoverySource || "none",
    randomOutcomeProfile,
  );
  setBattleSceneAmbientImpactRandomQuietThreshold(
    randomQuietThresholdMs,
    randomRecoverySource || "none",
    randomOutcomeProfile,
  );
  setBattleSceneAmbientImpactExplicitSnapshotLifecycle(
    explicitAgeMs,
    randomRecoveryMaxMs,
    randomQuietThresholdMs,
  );
  setBattleSceneAmbientImpactExplicitSnapshotState(
    resultDrivenImpactGateReason,
    hasResultDrivenAmbientImpactSignal
      ? "fresh"
      : resultDrivenImpactGateReason === "stale_sequence" ||
          resultDrivenImpactGateReason === "stale_window"
        ? "stale"
        : "none",
    hasResultDrivenAmbientImpactSignal ? "signal" : "none",
  );
  setBattleSceneAmbientImpactRandomState(
    hasResultDrivenAmbientImpactSignal
      ? "suppressed_result_signal"
      : resultDrivenImpactGateReason === "replay_cooldown"
        ? "suppressed_replay_cooldown"
        : resultDrivenImpactGateReason === "replay_exhausted"
          ? "suppressed_replay_exhausted"
          : suppressRandomByRecoveryWindow
            ? "suppressed_recovery_window"
          : allowRandomAmbientImpact
            ? "ready"
            : "idle",
  );
  setBattleSceneAmbientImpactLock(
    hasResultDrivenAmbientImpactSignal ? "result" : "free",
  );
  setBattleSceneAmbientImpactGate(resultDrivenImpactGateReason);
  setBattleSceneAmbientImpactFresh(
    hasResultDrivenAmbientImpactSignal
      ? "fresh"
      : staleResultDrivenImpactSignal
        ? "stale"
        : "none",
  );
  setBattleSceneAmbientImpactActive(
    hasResultDrivenAmbientImpactSignal ? "signal" : "none",
  );
  setBattleSceneAmbientImpactSequence(
    battleSceneLastExplicitEventSeq,
    battleSceneLastResultDrivenImpactSignalExplicitSeq,
  );
  setBattleSceneAmbientImpactCooldown(
    resultDrivenImpactGate.cooldownRemainingMs,
    resultDrivenImpactGate.cooldownMaxMs,
    resultDrivenAmbientCooldownSource,
    resultDrivenAmbientCooldownOutcomeProfile,
  );
  setBattleSceneAmbientImpactPriorityWindow(
    resultDrivenImpactGate.priorityRemainingMs,
    resultDrivenImpactGate.priorityMaxMs,
    resultDrivenAmbientPrioritySource,
    resultDrivenAmbientPriorityOutcomeProfile,
  );
  setBattleSceneAmbientImpactSignalAge(
    resultDrivenImpactGate.signalAgeMs,
    resultDrivenImpactGate.signalAgeMaxMs,
    resultDrivenAmbientSignalAgeSource,
    resultDrivenAmbientSignalAgeOutcomeProfile,
  );
  const ambientImpactCadenceDivisor = useResultDrivenAmbientImpact
    ? 1
    : randomImpactCadenceDivisor;
  const ambientImpactQuietThresholdMs = useResultDrivenAmbientImpact
    ? lowPerformanceMode
      ? 2800
      : BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS
    : lowPerformanceMode
      ? Math.max(2800, randomQuietThresholdMs)
      : randomQuietThresholdMs;
  const shouldPulseImpact =
    quietMs > ambientImpactQuietThresholdMs &&
    shouldPulseByMode &&
    battleSceneAmbientStep % ambientImpactCadenceDivisor === 0 &&
    (useResultDrivenAmbientImpact || allowRandomAmbientImpact);
  const randomAmbientImpactChance = Math.min(
    1,
    (lowPerformanceMode
      ? mode === "realtime"
        ? 0.56
        : mode === "auto"
          ? 0.42
          : 0.28
      : 1) * randomImpactProbabilityScale,
  );
  const allowAmbientImpact = useResultDrivenAmbientImpact
    ? !lowPerformanceMode ||
      Math.random() < (mode === "realtime" ? 0.92 : mode === "auto" ? 0.78 : 0.64)
    : allowRandomAmbientImpact &&
      Math.random() < randomAmbientImpactChance;
  if (shouldPulseImpact && allowAmbientImpact) {
    if (useResultDrivenAmbientImpact && resultDrivenImpactSignal) {
      triggerBattleSceneImpact(
        resultDrivenImpactSignal.kind,
        resultDrivenImpactSignal.tone,
        {
          fromAmbient: true,
          source: resultDrivenImpactSignal.source,
          outcome: resultDrivenImpactSignal.outcome,
          syncDuel: false,
        },
      );
      battleSceneLastResultDrivenImpactReplayCount += 1;
      battleSceneLastResultDrivenImpactReplayAtMs = now;
      setBattleSceneAmbientImpactReplay(
        battleSceneLastResultDrivenImpactReplayCount,
        resultDrivenAmbientReplayMax,
        resultDrivenImpactSignal.source,
        resultDrivenAmbientReplayOutcomeProfile,
      );
      setBattleSceneAmbientImpactResultSnapshotLifecycle(
        battleSceneLastResultDrivenImpactSignalExplicitSeq,
        resultDrivenImpactGate.signalAgeMs,
        resultDrivenImpactGate.signalAgeMaxMs,
        battleSceneLastResultDrivenImpactReplayCount,
        resultDrivenAmbientReplayMax,
      );
      setBattleSceneAmbientImpactResultSnapshotWindows(
        resultDrivenAmbientReplayMinIntervalMs,
        resultDrivenAmbientReplayMinIntervalMs,
        resultDrivenImpactGate.priorityRemainingMs,
        resultDrivenImpactGate.priorityMaxMs,
      );
      setBattleSceneAmbientImpactResultSnapshotState(
        resultDrivenImpactGateReason,
        hasResultDrivenAmbientImpactSignal ? "fresh" : "none",
        "signal",
      );
      setBattleSceneAmbientImpactCooldown(
        resultDrivenAmbientReplayMinIntervalMs,
        resultDrivenAmbientReplayMinIntervalMs,
        resultDrivenImpactSignal.source,
        resultDrivenAmbientReplayOutcomeProfile,
      );
      setBattleSceneAmbientImpactSource("result");
      setBattleSceneAmbientImpactSignal(
        resultDrivenImpactSignal,
        resultDrivenImpactSignal.source,
      );
      setBattleSceneAmbientImpactActive("signal");
      setBattleSceneAmbientImpactRandomState("suppressed_result_signal");
    } else if (mode === "realtime") {
      const randomImpactDescriptor = rollBattleSceneAmbientRandomImpact(
        mode,
        randomRecoverySource,
        randomOutcomeProfile,
      );
      const { kind, tone, outcomeProfile } = randomImpactDescriptor;
      triggerBattleSceneImpact(kind, tone, {
        fromAmbient: true,
        source: randomRecoverySource,
        syncDuel: randomSyncDuel,
      });
      setBattleSceneAmbientImpactSource("random");
      setBattleSceneAmbientImpactSignal(
        {
          kind,
          tone,
          source: "random",
          residueSource: randomRecoverySource || "none",
          residueOriginKind: randomOriginKind,
          residueOriginTone: randomOriginTone,
          residueOutcomeCode: randomOutcomeCode,
          residueOutcomeProfile: outcomeProfile,
          syncDuel: randomSyncDuel,
        },
        "random",
      );
      setBattleSceneAmbientImpactActive("none");
      setBattleSceneAmbientImpactRandomState("triggered");
      setBattleSceneAmbientImpactReplay(0);
    } else if (mode === "auto") {
      const randomImpactDescriptor = rollBattleSceneAmbientRandomImpact(
        mode,
        randomRecoverySource,
        randomOutcomeProfile,
      );
      const { kind, tone, outcomeProfile } = randomImpactDescriptor;
      triggerBattleSceneImpact(kind, tone, {
        fromAmbient: true,
        source: randomRecoverySource,
        syncDuel: randomSyncDuel,
      });
      setBattleSceneAmbientImpactSource("random");
      setBattleSceneAmbientImpactSignal(
        {
          kind,
          tone,
          source: "random",
          residueSource: randomRecoverySource || "none",
          residueOriginKind: randomOriginKind,
          residueOriginTone: randomOriginTone,
          residueOutcomeCode: randomOutcomeCode,
          residueOutcomeProfile: outcomeProfile,
          syncDuel: randomSyncDuel,
        },
        "random",
      );
      setBattleSceneAmbientImpactActive("none");
      setBattleSceneAmbientImpactRandomState("triggered");
      setBattleSceneAmbientImpactReplay(0);
    } else {
      const randomImpactDescriptor = rollBattleSceneAmbientRandomImpact(
        mode,
        randomRecoverySource,
        randomOutcomeProfile,
      );
      const { kind, tone, outcomeProfile } = randomImpactDescriptor;
      triggerBattleSceneImpact(kind, tone, {
        fromAmbient: true,
        source: randomRecoverySource,
        syncDuel: randomSyncDuel,
      });
      setBattleSceneAmbientImpactSource("random");
      setBattleSceneAmbientImpactSignal(
        {
          kind,
          tone,
          source: "random",
          residueSource: randomRecoverySource || "none",
          residueOriginKind: randomOriginKind,
          residueOriginTone: randomOriginTone,
          residueOutcomeCode: randomOutcomeCode,
          residueOutcomeProfile: outcomeProfile,
          syncDuel: randomSyncDuel,
        },
        "random",
      );
      setBattleSceneAmbientImpactActive("none");
      setBattleSceneAmbientImpactRandomState("triggered");
      setBattleSceneAmbientImpactReplay(0);
    }
  } else if (
    !resultDrivenImpactSignal &&
    quietMs > (lowPerformanceMode ? 5200 : 4200) &&
    battleSceneAmbientStep % (lowPerformanceMode ? 6 : 4) === 0
  ) {
    setBattleSceneAmbientImpactSource("idle");
    setBattleSceneAmbientImpactGate("no_signal");
    setBattleSceneAmbientImpactSignal(null, "idle");
    setBattleSceneAmbientImpactFresh("none");
    setBattleSceneAmbientImpactActive("none");
    setBattleSceneAmbientImpactRandomState("idle");
    setBattleSceneAmbientImpactRandomRecoverySource("none");
    setBattleSceneAmbientImpactRandomCadence(
      BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR,
      "none",
    );
    setBattleSceneAmbientImpactRandomProbability(
      BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE,
      "none",
    );
    setBattleSceneAmbientImpactRandomKindProfile("neutral", "none");
    setBattleSceneAmbientImpactRandomOutcomeProfile("neutral", "none", "none");
    setBattleSceneAmbientImpactRandomSyncPolicy(true, "none");
    setBattleSceneAmbientImpactRandomQuietThreshold(
      BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS,
      "none",
    );
    setBattleSceneAmbientImpactRandomRecovery(0);
    battleSceneLastResultDrivenImpactSignal = null;
    battleSceneLastResultDrivenImpactSignalExplicitAtMs = 0;
    battleSceneLastResultDrivenImpactSignalExplicitSeq = 0;
    battleSceneLastExplicitEventSeq = 0;
    battleSceneLastExplicitEventSource = "";
    battleSceneLastExplicitEventKind = "none";
    battleSceneLastExplicitEventTone = "none";
    battleSceneLastExplicitEventOutcomeCode = "none";
    battleSceneLastExplicitEventOutcomeProfile = "neutral";
    battleSceneLastExplicitEventSyncDuel = "off";
    battleSceneLastResultDrivenImpactReplayCount = 0;
    battleSceneLastResultDrivenImpactReplayAtMs = 0;
    setBattleSceneAmbientImpactExplicitSnapshot();
    setBattleSceneAmbientImpactExplicitSnapshotLifecycle();
    setBattleSceneAmbientImpactExplicitSnapshotState();
    setBattleSceneAmbientImpactResultSnapshot();
    setBattleSceneAmbientImpactResultSnapshotLifecycle();
    setBattleSceneAmbientImpactResultSnapshotWindows();
    setBattleSceneAmbientImpactResultSnapshotState();
    setBattleSceneAmbientImpactReplay(0);
    setBattleSceneAmbientImpactCooldown(0);
    setBattleSceneAmbientImpactPriorityWindow(0);
    setBattleSceneAmbientImpactSignalAge(0);
    setBattleSceneAmbientImpactSequence(0, 0);
  }

  if (
    !suppressAmbientNarrative &&
    quietMs > (lowPerformanceMode ? 10000 : 8000) &&
    battleSceneAmbientStep % (lowPerformanceMode ? 8 : 6) === 0
  ) {
    const leadTone = resolveBattleSceneDuelLeadTone();
    if (mode === "realtime") {
      setBattleSceneStatus(`실시간 교전 ${battleSceneDuelState.round}R`, leadTone, "ambient", "ambient_realtime");
      setBattleSceneResult(
        `수련자 ${playerHpPct}% · 적수 ${enemyHpPct}% · 자동 전투 루프가 연출을 갱신 중입니다.`,
        "info",
        "ambient",
        "ambient_realtime",
      );
      if (Math.random() < (lowPerformanceMode ? 0.32 : 0.44)) {
        pushBattleSceneTicker(
          `실시간 ${battleSceneDuelState.round}R · 수련자 ${playerHpPct}% / 적수 ${enemyHpPct}%`,
          leadTone,
          "ambient",
          "ambient_realtime",
        );
      }
    } else if (mode === "auto") {
      setBattleSceneStatus(`자동 교전 ${battleSceneDuelState.round}R`, leadTone, "ambient", "ambient_auto");
      setBattleSceneResult(
        `수련자 ${playerHpPct}% · 적수 ${enemyHpPct}% · 자동 옵션 기반 전장 파동 순환 중`,
        "info",
        "ambient",
        "ambient_auto",
      );
      if (Math.random() < (lowPerformanceMode ? 0.26 : 0.36)) {
        pushBattleSceneTicker(
          `자동 ${battleSceneDuelState.round}R · 압력 ${Math.round(battleSceneDuelState.dpsMomentum * 10)}`,
          leadTone,
          "ambient",
          "ambient_auto",
        );
      }
    } else {
      setBattleSceneStatus("전장 호흡 감지", leadTone, "ambient", "ambient_idle");
      setBattleSceneResult(
        `환영 교전 ${battleSceneDuelState.round}R · 수련자 ${playerHpPct}% / 적수 ${enemyHpPct}%`,
        "info",
        "ambient",
        "ambient_idle",
      );
      if (Math.random() < (lowPerformanceMode ? 0.18 : 0.28)) {
        pushBattleSceneTicker("전장 파동 안정화 · 조작 없이도 교전 지속", "info", "ambient", "ambient_idle");
      }
    }
  }
}

function startBattleSceneAmbientLoop() {
  if (!dom.battleSceneArena || !state) {
    return;
  }
  if (document.hidden) {
    stopBattleSceneAmbientLoop();
    setBattleSceneLoopMode(resolveBattleSceneAmbientMode());
    return;
  }
  if (battleSceneAmbientTimer !== null) {
    return;
  }
  battleSceneAmbientStep = 0;
  setBattleSceneLoopMode(resolveBattleSceneAmbientMode());
  renderBattleSceneDuelHud();
  runBattleSceneAmbientTick();
  battleSceneAmbientTimer = window.setInterval(
    runBattleSceneAmbientTick,
    BATTLE_SCENE_AMBIENT_TICK_MS,
  );
}

function stopBattleSceneAmbientLoop() {
  if (battleSceneAmbientTimer !== null) {
    window.clearInterval(battleSceneAmbientTimer);
    battleSceneAmbientTimer = null;
  }
  if (battleSceneShakeTimer !== null) {
    window.clearTimeout(battleSceneShakeTimer);
    battleSceneShakeTimer = null;
  }
  if (battleSceneZoomTimer !== null) {
    window.clearTimeout(battleSceneZoomTimer);
    battleSceneZoomTimer = null;
  }
  if (battleSceneHitStopTimer !== null) {
    window.clearTimeout(battleSceneHitStopTimer);
    battleSceneHitStopTimer = null;
  }
  if (battleSceneLeadSwingTimer !== null) {
    window.clearTimeout(battleSceneLeadSwingTimer);
    battleSceneLeadSwingTimer = null;
  }
  if (battleSceneLeadResonanceTimer !== null) {
    window.clearTimeout(battleSceneLeadResonanceTimer);
    battleSceneLeadResonanceTimer = null;
  }
  if (battleScenePressureSpikeTimer !== null) {
    window.clearTimeout(battleScenePressureSpikeTimer);
    battleScenePressureSpikeTimer = null;
  }
  if (battleScenePressureResonanceTimer !== null) {
    window.clearTimeout(battleScenePressureResonanceTimer);
    battleScenePressureResonanceTimer = null;
  }
  if (battleSceneDangerPulseTimer !== null) {
    window.clearTimeout(battleSceneDangerPulseTimer);
    battleSceneDangerPulseTimer = null;
  }
  if (battleSceneDangerResonanceTimer !== null) {
    window.clearTimeout(battleSceneDangerResonanceTimer);
    battleSceneDangerResonanceTimer = null;
  }
  if (battleSceneComboSurgeTimer !== null) {
    window.clearTimeout(battleSceneComboSurgeTimer);
    battleSceneComboSurgeTimer = null;
  }
  if (battleSceneComboCooldownTimer !== null) {
    window.clearTimeout(battleSceneComboCooldownTimer);
    battleSceneComboCooldownTimer = null;
  }
  if (battleSceneComboResonanceTimer !== null) {
    window.clearTimeout(battleSceneComboResonanceTimer);
    battleSceneComboResonanceTimer = null;
  }
  battleSfxAmbientLastPlayAtMs = 0;
  battleSceneLastShakeAtMs = 0;
  battleSceneLastZoomAtMs = 0;
  battleSceneLastHitStopAtMs = 0;
  battleSceneLastLeadSwingAtMs = 0;
  battleSceneLastLeadSwingTickerAtMs = 0;
  battleSceneLastLeadState = null;
  battleSceneLastLeadResonanceAtMs = 0;
  battleSceneLastLeadResonanceTickerAtMs = 0;
  battleSceneLastPressureSpikeAtMs = 0;
  battleSceneLastPressureTickerAtMs = 0;
  battleSceneLastPressureState = null;
  battleSceneLastPressureResonanceAtMs = 0;
  battleSceneLastPressureResonanceTickerAtMs = 0;
  battleSceneLastDangerPulseAtMs = 0;
  battleSceneLastDangerTickerAtMs = 0;
  battleSceneLastDangerState = null;
  battleSceneLastDangerResonanceAtMs = 0;
  battleSceneLastDangerResonanceTickerAtMs = 0;
  battleSceneLastComboSurgeAtMs = 0;
  battleSceneLastComboSurgeTickerAtMs = 0;
  battleSceneLastComboTierState = null;
  battleSceneLastComboCooldownAtMs = 0;
  battleSceneLastComboCooldownTickerAtMs = 0;
  battleSceneLastComboResonanceAtMs = 0;
  battleSceneLastComboResonanceTickerAtMs = 0;
  battleSceneLastCastTelegraphAtMs.player = 0;
  battleSceneLastCastTelegraphAtMs.enemy = 0;
  battleSceneLastChargeMoteAtMs.player = 0;
  battleSceneLastChargeMoteAtMs.enemy = 0;
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_SHAKE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_ZOOM_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_HIT_STOP_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_LEAD_SWING_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_LEAD_RESONANCE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_PRESSURE_SPIKE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_PRESSURE_RESONANCE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_DANGER_PULSE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_DANGER_RESONANCE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_COMBO_SURGE_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_COMBO_COOLDOWN_CLASSES);
  dom.battleSceneArena?.classList.remove(...BATTLE_SCENE_COMBO_RESONANCE_CLASSES);
  setBattleSceneLeadEffectState();
  setBattleScenePressureEffectState();
  setBattleSceneDangerEffectState();
  setBattleSceneComboEffectState();
  if (battleSceneSkillBannerTimer !== null) {
    window.clearTimeout(battleSceneSkillBannerTimer);
    battleSceneSkillBannerTimer = null;
  }
  if (dom.battleSceneSkillBanner) {
    dom.battleSceneSkillBanner.classList.remove("is-active");
    dom.battleSceneSkillBanner.setAttribute("aria-hidden", "true");
    dom.battleSceneSkillBanner.dataset.bannerState = "idle";
    dom.battleSceneSkillBanner.dataset.bannerSource = "idle";
    dom.battleSceneSkillBanner.dataset.bannerKey = "idle";
    dom.battleSceneSkillBanner.dataset.bannerActor = "none";
    dom.battleSceneSkillBanner.dataset.skillLabel = "none";
  }
  clearBattleSceneComboBanner();
  if (dom.battleSceneSparkLayer) {
    dom.battleSceneSparkLayer.innerHTML = "";
  }
  if (dom.battleSceneTrailLayer) {
    dom.battleSceneTrailLayer.innerHTML = "";
  }
  if (dom.battleSceneShockwaveLayer) {
    dom.battleSceneShockwaveLayer.innerHTML = "";
  }
  if (dom.battleSceneFlash) {
    dom.battleSceneFlash.classList.remove("is-active", ...BATTLE_SCENE_TONE_CLASSES);
    dom.battleSceneFlash.dataset.tone = "info";
    dom.battleSceneFlash.dataset.flashActive = "false";
  }
  syncBattleSceneMotionLayerContracts();
  resetBattleSceneActorFrames();
  setBattleSceneImpactCue("idle");
  setBattleSceneImpactKinetic("normal");
  setBattleSceneImpactVfx("normal");
  setBattleSceneAmbientImpactSource("idle");
  setBattleSceneAmbientImpactLock("free");
  setBattleSceneAmbientImpactGate("no_signal");
  setBattleSceneAmbientImpactFresh("none");
  setBattleSceneAmbientImpactActive("none");
  setBattleSceneAmbientImpactRandomState("idle");
  setBattleSceneAmbientImpactRandomRecoverySource("none");
  setBattleSceneAmbientImpactRandomCadence(
    BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR,
    "none",
  );
  setBattleSceneAmbientImpactRandomProbability(
    BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE,
    "none",
  );
  setBattleSceneAmbientImpactRandomKindProfile("neutral", "none");
  setBattleSceneAmbientImpactRandomOutcomeProfile("neutral", "none", "none");
  setBattleSceneAmbientImpactRandomSyncPolicy(true, "none");
  setBattleSceneAmbientImpactRandomQuietThreshold(
    BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS,
    "none",
  );
  setBattleSceneAmbientImpactRandomRecovery(0);
  setBattleSceneAmbientImpactSignal(null, "idle");
  setBattleSceneAmbientImpactReplay(0);
  setBattleSceneAmbientImpactCooldown(0);
  setBattleSceneAmbientImpactPriorityWindow(0);
  setBattleSceneAmbientImpactSignalAge(0);
  setBattleSceneAmbientImpactSequence(0, 0);
  battleSceneLastResultDrivenImpactSignal = null;
  battleSceneLastResultDrivenImpactSignalExplicitAtMs = 0;
  battleSceneLastResultDrivenImpactSignalExplicitSeq = 0;
  battleSceneLastExplicitEventSeq = 0;
  battleSceneLastExplicitEventSource = "";
  battleSceneLastExplicitEventKind = "none";
  battleSceneLastExplicitEventTone = "none";
  battleSceneLastExplicitEventOutcomeCode = "none";
  battleSceneLastExplicitEventOutcomeProfile = "neutral";
  battleSceneLastExplicitEventSyncDuel = "off";
  battleSceneLastResultDrivenImpactReplayCount = 0;
  battleSceneLastResultDrivenImpactReplayAtMs = 0;
  setBattleSceneAmbientImpactExplicitSnapshot();
  setBattleSceneAmbientImpactExplicitSnapshotLifecycle();
  setBattleSceneAmbientImpactExplicitSnapshotState();
  setBattleSceneAmbientImpactResultSnapshot();
  setBattleSceneAmbientImpactResultSnapshotLifecycle();
  setBattleSceneAmbientImpactResultSnapshotWindows();
  setBattleSceneAmbientImpactResultSnapshotState();
  battleSceneDuelState.pressure = "low";
  renderBattleSceneDuelHud();
}

function renderBattleScene(stage, displayName) {
  if (!stage) {
    return;
  }
  setBattleSceneAtmosphere(stage);
  setBattleSceneLoopMode(resolveBattleSceneAmbientMode());
  setBattleSceneStageLabels(stage, displayName);
  renderBattleSceneDuelHud();
  applyBattleSceneUiState();
  renderBattleSceneTicker();
}

function playBattleSceneBattleOutcome(outcome) {
  if (!outcome) {
    return;
  }
  if (outcome.won) {
    setBattleSceneStatus("전투 승리", "success", "battle", "battle_win");
    setBattleSceneResult(
      `전투 승리 · 기 ${fmtSignedInteger(outcome.qiDelta)} · 영석 ${fmtSignedInteger(outcome.spiritCoinDelta)}`,
      "success",
      "battle",
      "battle_win",
    );
    triggerBattleSceneImpact("battle_win", "success", {
      source: "battle",
      outcome,
    });
    spawnBattleSceneFloat(`기 ${fmtSignedInteger(outcome.qiDelta)}`, { tone: "success", anchor: "player" });
    spawnBattleSceneFloat(`영석 ${fmtSignedInteger(outcome.spiritCoinDelta)}`, {
      tone: "success",
      anchor: "player",
    });
    if ((Number(outcome.rebirthEssenceDelta) || 0) > 0) {
      spawnBattleSceneFloat(`정수 ${fmtSignedInteger(outcome.rebirthEssenceDelta)}`, {
        tone: "warn",
        anchor: "player",
      });
    }
    spawnBattleSceneFloat("일격 적중", { tone: "info", anchor: "enemy" });
    return;
  }
  setBattleSceneStatus("전투 패배", "error", "battle", "battle_loss");
  setBattleSceneResult(`전투 패배 · 기 ${fmtSignedInteger(outcome.qiDelta)}`, "error", "battle", "battle_loss");
  triggerBattleSceneImpact("battle_loss", "error", {
    source: "battle",
    outcome,
  });
  spawnBattleSceneFloat(`기 ${fmtSignedInteger(outcome.qiDelta)}`, { tone: "error", anchor: "player" });
  spawnBattleSceneFloat("적 반격", { tone: "warn", anchor: "enemy" });
}

function playBattleSceneBreakthroughOutcome(outcome) {
  if (!outcome) {
    return;
  }
  const fromDifficultyIndex = Math.max(
    0,
    Math.round(Number(outcome.fromDifficultyIndex || outcome.difficultyIndex || outcome.stage?.difficulty_index) || 0),
  );
  const toDifficultyIndex = Math.max(
    0,
    Math.round(Number(outcome.toDifficultyIndex || outcome.nextStage?.difficulty_index) || 0),
  );
  if (!outcome.attempted) {
    const outcomeCode = String(outcome.outcome || "");
    const blockedNoQi = outcomeCode === "blocked_no_qi";
    const blockedTribulationSetting = outcomeCode === "blocked_tribulation_setting";
    const tone = blockedNoQi || blockedTribulationSetting ? "warn" : "error";
    setBattleSceneStatus(
      blockedTribulationSetting ? "자동 도겁 대기" : "돌파 조건 부족",
      tone,
      "breakthrough",
      blockedTribulationSetting
        ? "breakthrough_blocked_tribulation_setting"
        : blockedNoQi
          ? "breakthrough_blocked_no_qi"
          : "breakthrough_blocked",
    );
    setBattleSceneResult(
      outcome.message || "돌파를 진행할 수 없습니다.",
      tone,
      "breakthrough",
      blockedTribulationSetting
        ? "breakthrough_blocked_tribulation_setting"
        : blockedNoQi
          ? "breakthrough_blocked_no_qi"
          : "breakthrough_blocked",
    );
    triggerBattleSceneImpact("breakthrough_fail", tone, {
      source: "breakthrough",
      outcome,
    });
    spawnBattleSceneFloat(
      blockedTribulationSetting ? "도겁 대기" : "돌파 차단",
      { tone, anchor: "center" },
    );
    return;
  }
  if (outcome.outcome === "success") {
    const qiConsume = Math.max(
      1,
      Math.round(
        Math.max(
          0,
          -Number(outcome.qiDelta) ||
            Number(outcome.stageQiRequired || outcome.stage?.qi_required || 0) * 0.85,
        ),
      ),
    );
    setBattleSceneStatus("돌파 성공", "success", "breakthrough", "breakthrough_success");
    setBattleSceneResult(
      `${outcome.message || "돌파 성공"}${
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? ` · 난이도 ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)}`
          : ""
      } · 기 ${fmtSignedInteger(-qiConsume)}`,
      "success",
      "breakthrough",
      "breakthrough_success",
    );
    triggerBattleSceneImpact("breakthrough_success", "success", {
      source: "breakthrough",
      outcome,
    });
    spawnBattleSceneFloat("경지 상승", { tone: "success", anchor: "center" });
    spawnBattleSceneFloat(`기 ${fmtSignedInteger(-qiConsume)}`, { tone: "warn", anchor: "player" });
    return;
  }
  if (outcome.outcome === "minor_fail") {
    const qiLoss = Math.max(
      1,
      Math.round(
        Math.max(
          0,
          -Number(outcome.qiDelta) ||
            Number(outcome.stageQiRequired || outcome.stage?.qi_required || 0) * 0.22,
        ),
      ),
    );
    setBattleSceneStatus("돌파 실패(경상)", "warn", "breakthrough", "breakthrough_minor_fail");
    setBattleSceneResult(
      `${outcome.message || "경상 실패"}${
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? ` · 난이도 ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)}`
          : ""
      } · 기 ${fmtSignedInteger(-qiLoss)}`,
      "warn",
      "breakthrough",
      "breakthrough_minor_fail",
    );
    triggerBattleSceneImpact("breakthrough_fail", "warn", {
      source: "breakthrough",
      outcome,
    });
    spawnBattleSceneFloat(`기 ${fmtSignedInteger(-qiLoss)}`, { tone: "error", anchor: "player" });
    spawnBattleSceneFloat("경상", { tone: "warn", anchor: "center" });
    return;
  }
  if (outcome.outcome === "retreat_fail") {
    const qiLoss = Math.max(
      1,
      Math.round(
        Math.max(
          0,
          -Number(outcome.qiDelta) ||
            Number(outcome.stageQiRequired || outcome.stage?.qi_required || 0) * 0.28,
        ),
      ),
    );
    const retreatLayers = Math.max(1, Number(outcome.retreatLayers) || 1);
    setBattleSceneStatus("돌파 실패(후퇴)", "error", "breakthrough", "breakthrough_retreat_fail");
    setBattleSceneResult(
      `${outcome.message || "경지 후퇴 발생"}${
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? ` · 난이도 ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)}`
          : ` · ${retreatLayers}단계 하락`
      } · 기 ${fmtSignedInteger(-qiLoss)}`,
      "error",
      "breakthrough",
      "breakthrough_retreat_fail",
    );
    triggerBattleSceneImpact("breakthrough_fail", "error", {
      source: "breakthrough",
      outcome,
    });
    spawnBattleSceneFloat(`기 ${fmtSignedInteger(-qiLoss)}`, { tone: "error", anchor: "player" });
    spawnBattleSceneFloat(`${retreatLayers}단계 후퇴`, { tone: "error", anchor: "center" });
    return;
  }
  if (outcome.outcome === "death_fail") {
    const reward = Math.max(0, Number(outcome.rebirthReward) || 0);
    const resetStageNameKo = String(outcome.resetStageNameKo || "");
    setBattleSceneStatus("도겁 사망", "error", "breakthrough", "breakthrough_death_fail");
    setBattleSceneResult(
      `${outcome.message || "사망 후 환생 발동"}${
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? ` · 난이도 ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)}`
          : ""
      }${resetStageNameKo ? ` · ${resetStageNameKo}` : ""}`,
      "error",
      "breakthrough",
      "breakthrough_death_fail",
    );
    triggerBattleSceneImpact("breakthrough_fail", "error", {
      source: "breakthrough",
      outcome,
    });
    spawnBattleSceneFloat("환생 발동", { tone: "warn", anchor: "center" });
    spawnBattleSceneFloat(`정수 ${fmtSignedInteger(reward)}`, { tone: "success", anchor: "player" });
    return;
  }
  setBattleSceneStatus("돌파 결과 확인", "info", "breakthrough", "breakthrough_result");
  setBattleSceneResult(outcome.message || "돌파 처리 완료", "info", "breakthrough", "breakthrough_result");
  triggerBattleSceneImpact("breakthrough_fail", "info", {
    source: "breakthrough",
    outcome,
  });
}

function resolveBattleSceneBreakthroughStageQiRequiredFromEvent(event, lossRatioFallback) {
  const rawStageQiRequired = Math.round(Number(event?.stageQiRequired) || 0);
  if (rawStageQiRequired > 0) {
    const stageQiRequired = Math.max(1, rawStageQiRequired);
    return stageQiRequired;
  }
  const lossRatio = Math.max(0.01, Number(lossRatioFallback) || 0.22);
  const qiDelta = Number(event?.qiDelta);
  if (Number.isFinite(qiDelta) && qiDelta < 0) {
    return Math.max(1, Math.round(Math.abs(qiDelta) / lossRatio));
  }
  if (context && state) {
    const stage = getStage(context, state.progression?.difficultyIndex);
    const stageQi = Math.max(1, Math.round(Number(stage?.qi_required) || 1));
    return stageQi;
  }
  return 1;
}

function resolveBattleSceneEventSignalFromCollectedEvent(eventInput) {
  const event =
    eventInput && typeof eventInput === "object"
      ? eventInput
      : null;
  const kind = String(event?.kind || "");
  if (!kind) {
    return null;
  }
  if (kind === "breakthrough_death_fail") {
    const rebirthReward = Math.max(0, Number(event.rebirthReward) || 0);
    const deathPct = Math.max(0, Math.min(95, Number(event.deathPct) || 0));
    const stageQiRequired = resolveBattleSceneBreakthroughStageQiRequiredFromEvent(event, 0.28);
    const fromDifficultyIndex = Math.max(
      0,
      Math.round(Number(event.fromDifficultyIndex || event.difficultyIndex) || 0),
    );
    const toDifficultyIndex = Math.max(0, Math.round(Number(event.toDifficultyIndex) || 0));
    const resetStageNameKo = String(event.resetStageNameKo || "");
    return {
      priority: 100,
      tone: "error",
      impactKind: "breakthrough_fail",
      statusTextKo: "도겁 사망",
      resultHintKo: `도겁 사망 · 환생정수 +${fmtNumber(rebirthReward)}${
        deathPct > 0 ? ` · 사망률 ${deathPct.toFixed(1)}%` : ""
      }${
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? ` · ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)}`
          : ""
      }${
        resetStageNameKo ? ` · ${resetStageNameKo}` : ""
      }`,
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: true,
          outcome: "death_fail",
          rebirthReward,
          deathPct,
          fromDifficultyIndex,
          toDifficultyIndex,
          resetStageNameKo,
          stage: {
            qi_required: stageQiRequired,
          },
        },
      },
    };
  }
  if (kind === "breakthrough_retreat_fail") {
    const retreatLayers = Math.max(1, Number(event.retreatLayers) || 1);
    const qiDelta = Math.round(Number(event.qiDelta) || 0);
    const deathPct = Math.max(0, Math.min(95, Number(event.deathPct) || 0));
    const stageQiRequired = resolveBattleSceneBreakthroughStageQiRequiredFromEvent(event, 0.28);
    const fromDifficultyIndex = Math.max(0, Math.round(Number(event.fromDifficultyIndex) || 0));
    const toDifficultyIndex = Math.max(0, Math.round(Number(event.toDifficultyIndex) || 0));
    return {
      priority: 92,
      tone: "error",
      impactKind: "breakthrough_fail",
      statusTextKo: "돌파 후퇴 실패",
      resultHintKo:
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `후퇴 ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)}${
              qiDelta !== 0 ? ` · 기 ${fmtSignedInteger(qiDelta)}` : ""
            }`
          : `후퇴 ${retreatLayers}단계${
              qiDelta !== 0 ? ` · 기 ${fmtSignedInteger(qiDelta)}` : ""
            }`,
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: true,
          outcome: "retreat_fail",
          retreatLayers,
          deathPct,
          qiDelta,
          fromDifficultyIndex,
          toDifficultyIndex,
          stage: {
            qi_required: stageQiRequired,
          },
        },
      },
    };
  }
  if (kind === "auto_breakthrough_paused_by_policy") {
    const reasonLabel = String(event.reasonLabelKo || event.reason || "정책 차단");
    const consecutiveBlocks = Math.max(0, Number(event.consecutiveBlocks) || 0);
    const pauseThreshold = Math.max(0, Number(event.threshold) || 0);
    const policyReason = String(event.reason || "");
    const nextActionKo = String(event.nextActionKo || "");
    const nextActionText = nextActionKo ? ` · ${nextActionKo}` : "";
    return {
      priority: 88,
      tone: "error",
      impactKind: "breakthrough_fail",
      statusTextKo: "자동돌파 일시정지",
      resultHintKo:
        consecutiveBlocks > 0
          ? `${reasonLabel} · 연속 ${consecutiveBlocks}회${nextActionText}`
          : `${reasonLabel}${nextActionText}`,
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: false,
          outcome: "blocked_auto_risk_policy",
          reason: policyReason,
          reasonLabelKo: reasonLabel,
          nextActionKo,
          pausedByPolicy: true,
          consecutiveBlocks,
          pauseThreshold,
          autoPolicy: {
            reason: policyReason,
            reasonLabelKo: reasonLabel,
            nextActionKo,
          },
        },
      },
    };
  }
  if (kind === "breakthrough_minor_fail") {
    const qiDelta = Number(event.qiDelta) || 0;
    const deathPct = Math.max(0, Math.min(95, Number(event.deathPct) || 0));
    const stageQiRequired = resolveBattleSceneBreakthroughStageQiRequiredFromEvent(event, 0.22);
    const fromDifficultyIndex = Math.max(
      0,
      Math.round(Number(event.fromDifficultyIndex || event.difficultyIndex) || 0),
    );
    const toDifficultyIndex = Math.max(
      0,
      Math.round(Number(event.toDifficultyIndex || event.difficultyIndex) || 0),
    );
    return {
      priority: 84,
      tone: "warn",
      impactKind: "breakthrough_fail",
      statusTextKo: "돌파 경상 실패",
      resultHintKo:
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `돌파 경상 실패 · ${fmtNumber(fromDifficultyIndex)}→${fmtNumber(toDifficultyIndex)} · 기 ${fmtSignedInteger(qiDelta)}`
          : `돌파 경상 실패 · 기 ${fmtSignedInteger(qiDelta)}`,
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: true,
          outcome: "minor_fail",
          successPct: Math.max(0, Math.min(100, Number(event.successPct) || 0)),
          deathPct,
          qiDelta: Number(event.qiDelta) || 0,
          fromDifficultyIndex,
          toDifficultyIndex,
          stage: {
            qi_required: stageQiRequired,
          },
        },
      },
    };
  }
  if (kind === "breakthrough_success") {
    const fromDifficultyIndex = Math.max(0, Number(event.fromDifficultyIndex) || 0);
    const toDifficultyIndex = Math.max(0, Number(event.toDifficultyIndex) || 0);
    const successPct = Math.max(0, Math.min(100, Number(event.successPct) || 0));
    const deathPct = Math.max(0, Math.min(95, Number(event.deathPct) || 0));
    const stageQiRequired = resolveBattleSceneBreakthroughStageQiRequiredFromEvent(event, 0.85);
    const qiDelta = Math.round(Number(event.qiDelta) || 0);
    const qiHintText = qiDelta !== 0 ? ` · 기 ${fmtSignedInteger(qiDelta)}` : "";
    return {
      priority: 78,
      tone: "success",
      impactKind: "breakthrough_success",
      statusTextKo: "돌파 성공",
      resultHintKo:
        fromDifficultyIndex > 0 && toDifficultyIndex > 0
          ? `돌파 성공 · ${fromDifficultyIndex}→${toDifficultyIndex}${qiHintText}`
          : `돌파 성공${qiHintText}`,
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: true,
          outcome: "success",
          successPct,
          deathPct,
          qiDelta,
          fromDifficultyIndex,
          toDifficultyIndex,
          stage: {
            qi_required: stageQiRequired,
          },
        },
      },
    };
  }
  if (kind === "breakthrough_blocked_auto_policy") {
    const reasonLabel = String(event.reasonLabelKo || "정책 차단");
    const policyReason = String(event.reason || "");
    const nextActionKo =
      typeof event.nextActionKo === "string" && event.nextActionKo
        ? ` · ${event.nextActionKo}`
        : "";
    return {
      priority: 72,
      tone: "warn",
      impactKind: "breakthrough_fail",
      statusTextKo: "자동 돌파 차단",
      resultHintKo: `${reasonLabel}${nextActionKo}`,
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: false,
          outcome: "blocked_auto_risk_policy",
          reason: policyReason,
          reasonLabelKo: reasonLabel,
          nextActionKo: String(event.nextActionKo || ""),
          autoPolicy: {
            reason: policyReason,
            reasonLabelKo: reasonLabel,
            nextActionKo: String(event.nextActionKo || ""),
          },
        },
      },
    };
  }
  if (kind === "breakthrough_blocked_no_qi") {
    const requiredQi = Math.max(1, Number(event.requiredQi) || 1);
    const currentQi = Math.max(0, Number(event.currentQi) || 0);
    const qiDeficit = Math.max(
      0,
      Number(event.qiDeficit) || requiredQi - currentQi,
    );
    return {
      priority: 68,
      tone: "warn",
      impactKind: "breakthrough_fail",
      statusTextKo: "자동 돌파 기 부족",
      resultHintKo:
        typeof event.message === "string" && event.message
          ? `${event.message} · 기 ${fmtNumber(currentQi)}/${fmtNumber(requiredQi)}`
          : `기 부족 · 기 ${fmtNumber(currentQi)}/${fmtNumber(requiredQi)}`,
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: false,
          outcome: "blocked_no_qi",
          requiredQi,
          currentQi,
          qiDeficit,
          stage: {
            qi_required: requiredQi,
          },
        },
      },
    };
  }
  if (kind === "breakthrough_blocked_tribulation_setting") {
    const difficultyIndex = Math.max(0, Number(event.difficultyIndex) || 0);
    return {
      priority: 70,
      tone: "warn",
      impactKind: "breakthrough_fail",
      statusTextKo: "자동 돌파 도겁 대기",
      resultHintKo:
        typeof event.message === "string" && event.message
          ? difficultyIndex > 0
            ? `${event.message} · 난이도 ${difficultyIndex}`
            : event.message
          : difficultyIndex > 0
            ? `도겁 자동 허용 꺼짐 · 난이도 ${difficultyIndex}`
            : "도겁 자동 허용 꺼짐",
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: false,
          outcome: "blocked_tribulation_setting",
          difficultyIndex,
          stage: {
            difficulty_index: difficultyIndex,
          },
        },
      },
    };
  }
  if (kind === "auto_breakthrough_warmup_skip") {
    const remainingSec = Math.max(0, Number(event.warmupRemainingSec) || 0);
    return {
      priority: 66,
      tone: "warn",
      impactKind: "breakthrough_fail",
      statusTextKo: "자동 돌파 워밍업",
      resultHintKo:
        remainingSec > 0 ? `워밍업 차단 · 잔여 ${remainingSec}초` : "워밍업 차단",
      impactOptions: {
        source: "breakthrough",
        outcome: {
          attempted: false,
          outcome: "blocked_auto_risk_policy",
        },
      },
    };
  }
  if (kind === "battle_loss") {
    const qiDelta = Number(event.qiDelta) || 0;
    return {
      priority: 48,
      tone: "warn",
      impactKind: "battle_loss",
      statusTextKo: "전투 패배",
      resultHintKo: `전투 패배 · 기 ${fmtSignedInteger(qiDelta)}`,
      impactOptions: {
        source: "battle",
        outcome: {
          won: false,
          qiDelta: Number(event.qiDelta) || 0,
          spiritCoinDelta: Number(event.spiritCoinDelta) || 0,
          rebirthEssenceDelta: Number(event.rebirthEssenceDelta) || 0,
        },
      },
    };
  }
  if (kind === "battle_win") {
    const qiDelta = Number(event.qiDelta) || 0;
    const spiritCoinDelta = Number(event.spiritCoinDelta) || 0;
    const rebirthEssenceDelta = Number(event.rebirthEssenceDelta) || 0;
    return {
      priority: 42,
      tone: "success",
      impactKind: "battle_win",
      statusTextKo: "전투 승리",
      resultHintKo: `전투 승리 · 기 ${fmtSignedInteger(qiDelta)} · 영석 ${fmtSignedInteger(spiritCoinDelta)}${
        rebirthEssenceDelta !== 0 ? ` · 정수 ${fmtSignedInteger(rebirthEssenceDelta)}` : ""
      }`,
      impactOptions: {
        source: "battle",
        outcome: {
          won: true,
          qiDelta: Number(event.qiDelta) || 0,
          spiritCoinDelta: Number(event.spiritCoinDelta) || 0,
          rebirthEssenceDelta: Number(event.rebirthEssenceDelta) || 0,
        },
      },
    };
  }
  return null;
}

function resolveBattleSceneEventSignalScore(signalInput, eventInput, orderInput) {
  const signal = signalInput && typeof signalInput === "object" ? signalInput : null;
  if (!signal) {
    return Number.NEGATIVE_INFINITY;
  }
  const priorityScore = Math.max(0, Number(signal.priority) || 0) * 1000;
  const secRaw = Math.max(0, Number(eventInput?.sec) || 0);
  const secScore = Math.log1p(secRaw) * 24;
  const orderScore = Math.max(0, Number(orderInput) || 0) * 0.8;
  return priorityScore + secScore + orderScore;
}

function resolveBattleSceneEventSignalFromCollectedEvents(eventsInput) {
  if (!Array.isArray(eventsInput) || eventsInput.length <= 0) {
    return null;
  }
  let picked = null;
  let pickedScore = Number.NEGATIVE_INFINITY;
  for (let idx = 0; idx < eventsInput.length; idx += 1) {
    const event = eventsInput[idx];
    const signal = resolveBattleSceneEventSignalFromCollectedEvent(event);
    if (!signal) {
      continue;
    }
    const eventSec = Math.max(0, Number(event?.sec) || 0);
    const score = resolveBattleSceneEventSignalScore(signal, event, idx);
    if (!picked || score > pickedScore) {
      picked = {
        ...signal,
        eventSec,
        eventOrder: idx,
        score,
      };
      pickedScore = score;
    }
  }
  return picked;
}

function buildBattleSceneCollectedEventFromAutoSummaryLastEngineOutcome(summaryInput) {
  const summary = summaryInput && typeof summaryInput === "object" ? summaryInput : null;
  const lastEngineOutcome =
    summary?.lastEngineOutcome && typeof summary.lastEngineOutcome === "object"
      ? summary.lastEngineOutcome
      : null;
  if (!lastEngineOutcome) {
    return null;
  }
  const source =
    lastEngineOutcome.source === "battle" || lastEngineOutcome.source === "breakthrough"
      ? lastEngineOutcome.source
      : "";
  const outcome =
    lastEngineOutcome.outcome && typeof lastEngineOutcome.outcome === "object"
      ? lastEngineOutcome.outcome
      : null;
  const sec = Math.max(0, Number(lastEngineOutcome.sec) || 0);
  if (!source || !outcome) {
    return null;
  }
  if (source === "battle") {
    return {
      sec,
      kind: outcome.won ? "battle_win" : "battle_loss",
      difficultyIndex: Number(outcome.difficultyIndex) || 0,
      stageQiRequired: Number(outcome.stageQiRequired) || 0,
      qiDelta: Number(outcome.qiDelta) || 0,
      spiritCoinDelta: Number(outcome.spiritCoinDelta) || 0,
      rebirthEssenceDelta: Number(outcome.rebirthEssenceDelta) || 0,
    };
  }
  const outcomeCode = String(outcome.outcome || "");
  if (outcome.attempted !== true) {
    if (outcomeCode === "blocked_no_qi") {
      return {
        sec,
        kind: "breakthrough_blocked_no_qi",
        requiredQi: Number(outcome.requiredQi) || 0,
        currentQi: Number(outcome.currentQi) || 0,
        qiDeficit: Number(outcome.qiDeficit) || 0,
        message: String(outcome.message || ""),
      };
    }
    if (outcomeCode === "blocked_tribulation_setting") {
      return {
        sec,
        kind: "breakthrough_blocked_tribulation_setting",
        difficultyIndex: Number(outcome.difficultyIndex || outcome.stage?.difficulty_index) || 0,
        message: String(outcome.message || ""),
      };
    }
    if (outcomeCode === "blocked_auto_risk_policy") {
      const reason = String(outcome.autoPolicy?.reason || outcome.reason || "");
      const reasonLabelKo = String(
        outcome.autoPolicy?.reasonLabelKo || outcome.reasonLabelKo || "",
      );
      const nextActionKo = String(
        outcome.autoPolicy?.nextActionKo || outcome.nextActionKo || "",
      );
      const pauseReason = String(summary?.autoBreakthroughPauseReason || "");
      const pauseReasonLabelKo = String(summary?.autoBreakthroughPauseReasonLabelKo || "");
      const pauseNextActionKo = String(summary?.autoBreakthroughPauseNextActionKo || "");
      const pauseThreshold = Math.max(
        1,
        Number(summary?.autoBreakthroughPauseThreshold || outcome.pauseThreshold || outcome.threshold) || 1,
      );
      const pauseConsecutiveBlocks = Math.max(
        pauseThreshold,
        Number(
          summary?.autoBreakthroughPauseConsecutiveBlocks || outcome.consecutiveBlocks,
        ) || pauseThreshold,
      );
      if (
        summary?.autoBreakthroughPaused === true &&
        (!pauseReason || !reason || pauseReason === reason)
      ) {
        return {
          sec,
          kind: "auto_breakthrough_paused_by_policy",
          threshold: pauseThreshold,
          consecutiveBlocks: pauseConsecutiveBlocks,
          reason: pauseReason || reason,
          reasonLabelKo: pauseReasonLabelKo || reasonLabelKo,
          nextActionKo: pauseNextActionKo || nextActionKo,
        };
      }
      return {
        sec,
        kind: "breakthrough_blocked_auto_policy",
        reason,
        reasonLabelKo,
        message: String(outcome.message || ""),
        nextActionKo,
      };
    }
    return null;
  }
  if (outcomeCode === "success") {
    return {
      sec,
      kind: "breakthrough_success",
      successPct: Number(outcome.successPct) || 0,
      deathPct: Number(outcome.deathPct) || 0,
      fromDifficultyIndex: Number(outcome.fromDifficultyIndex) || 0,
      toDifficultyIndex: Number(outcome.toDifficultyIndex) || 0,
      stageQiRequired: Number(outcome.stageQiRequired || outcome.stage?.qi_required) || 0,
      qiDelta: Number(outcome.qiDelta) || 0,
    };
  }
  if (outcomeCode === "minor_fail") {
    return {
      sec,
      kind: "breakthrough_minor_fail",
      difficultyIndex: Number(outcome.difficultyIndex || outcome.stage?.difficulty_index) || 0,
      fromDifficultyIndex:
        Number(outcome.fromDifficultyIndex || outcome.stage?.difficulty_index) || 0,
      toDifficultyIndex:
        Number(outcome.toDifficultyIndex || outcome.stage?.difficulty_index) || 0,
      successPct: Number(outcome.successPct) || 0,
      deathPct: Number(outcome.deathPct) || 0,
      stageQiRequired: Number(outcome.stageQiRequired || outcome.stage?.qi_required) || 0,
      qiDelta: Number(outcome.qiDelta) || 0,
    };
  }
  if (outcomeCode === "retreat_fail") {
    return {
      sec,
      kind: "breakthrough_retreat_fail",
      retreatLayers: Number(outcome.retreatLayers) || 0,
      fromDifficultyIndex: Number(outcome.fromDifficultyIndex) || 0,
      toDifficultyIndex: Number(outcome.toDifficultyIndex) || 0,
      successPct: Number(outcome.successPct) || 0,
      deathPct: Number(outcome.deathPct) || 0,
      stageQiRequired: Number(outcome.stageQiRequired || outcome.stage?.qi_required) || 0,
      qiDelta: Number(outcome.qiDelta) || 0,
    };
  }
  if (outcomeCode === "death_fail") {
    return {
      sec,
      kind: "breakthrough_death_fail",
      difficultyIndex: Number(outcome.difficultyIndex || outcome.stage?.difficulty_index) || 0,
      fromDifficultyIndex:
        Number(outcome.fromDifficultyIndex || outcome.stage?.difficulty_index) || 0,
      toDifficultyIndex:
        Number(outcome.toDifficultyIndex || outcome.nextStage?.difficulty_index) || 0,
      resetStageNameKo: String(outcome.resetStageNameKo || ""),
      rebirthReward: Number(outcome.rebirthReward) || 0,
      successPct: Number(outcome.successPct) || 0,
      deathPct: Number(outcome.deathPct) || 0,
      stageQiRequired: Number(outcome.stageQiRequired || outcome.stage?.qi_required) || 0,
      qiDelta: Number(outcome.qiDelta) || 0,
    };
  }
  return null;
}

function resolveBattleSceneEventSignalFromAutoSummary(summaryInput) {
  const summary = summaryInput && typeof summaryInput === "object" ? summaryInput : null;
  if (!summary) {
    return null;
  }
  const collectedSignal = resolveBattleSceneEventSignalFromCollectedEvents(summary.collectedEvents);
  const directEvent = buildBattleSceneCollectedEventFromAutoSummaryLastEngineOutcome(summary);
  if (!directEvent) {
    return collectedSignal;
  }
  const directSignal = resolveBattleSceneEventSignalFromCollectedEvent(directEvent);
  if (!directSignal) {
    return collectedSignal;
  }
  const directSignalWithMeta = {
    ...directSignal,
    eventSec: Math.max(0, Number(directEvent.sec) || 0),
    eventOrder: Math.max(0, Number(collectedSignal?.eventOrder) || 0) + 1,
  };
  const lastEngineOutcome =
    summary.lastEngineOutcome && typeof summary.lastEngineOutcome === "object"
      ? summary.lastEngineOutcome
      : null;
  if (
    (lastEngineOutcome?.source === "battle" || lastEngineOutcome?.source === "breakthrough") &&
    lastEngineOutcome.outcome &&
    typeof lastEngineOutcome.outcome === "object"
  ) {
    const existingOutcome =
      directSignalWithMeta.impactOptions?.outcome &&
      typeof directSignalWithMeta.impactOptions.outcome === "object"
        ? directSignalWithMeta.impactOptions.outcome
        : {};
    directSignalWithMeta.impactOptions = {
      ...(directSignalWithMeta.impactOptions || {}),
      source: lastEngineOutcome.source,
      outcome: {
        ...existingOutcome,
        ...lastEngineOutcome.outcome,
      },
    };
  }
  const directScore =
    resolveBattleSceneEventSignalScore(
      directSignalWithMeta,
      { sec: directSignalWithMeta.eventSec },
      directSignalWithMeta.eventOrder,
    ) + 120;
  directSignalWithMeta.score = directScore;
  if (!collectedSignal) {
    return directSignalWithMeta;
  }
  const summarySeconds = Math.max(0, Number(summary.seconds) || 0);
  const directSec = Math.max(0, Number(directSignalWithMeta.eventSec) || 0);
  const collectedSec = Math.max(0, Number(collectedSignal.eventSec) || 0);
  if (
    summarySeconds > 0 &&
    summarySeconds <= BATTLE_SCENE_SHORT_SUMMARY_DIRECT_SIGNAL_MAX_SECONDS &&
    directSec >= collectedSec
  ) {
    return directSignalWithMeta;
  }
  return directScore >= Number(collectedSignal.score || 0)
    ? directSignalWithMeta
    : collectedSignal;
}

function resolveBattleSceneImpactOptionsFromAutoSummary(summaryInput, eventSignalInput) {
  const eventSignal =
    eventSignalInput && typeof eventSignalInput === "object"
      ? eventSignalInput
      : null;
  if (
    eventSignal?.impactOptions &&
    typeof eventSignal.impactOptions === "object"
  ) {
    return eventSignal.impactOptions;
  }
  const summary = summaryInput && typeof summaryInput === "object" ? summaryInput : null;
  const lastEngineOutcome =
    summary?.lastEngineOutcome && typeof summary.lastEngineOutcome === "object"
      ? summary.lastEngineOutcome
      : null;
  if (
    (lastEngineOutcome?.source === "battle" || lastEngineOutcome?.source === "breakthrough") &&
    lastEngineOutcome.outcome &&
    typeof lastEngineOutcome.outcome === "object"
  ) {
    return {
      source: lastEngineOutcome.source,
      outcome: lastEngineOutcome.outcome,
    };
  }
  return undefined;
}

function playBattleSceneAutoSummary(summaryInput, sourceLabel = "자동 진행") {
  const summary =
    summaryInput && typeof summaryInput === "object" ? summaryInput : null;
  if (!summary) {
    return;
  }
  const battles = Math.max(0, Number(summary.battles) || 0);
  const battleWins = Math.max(0, Number(summary.battleWins) || 0);
  const breakthroughs = Math.max(0, Number(summary.breakthroughs) || 0);
  const rebirths = Math.max(0, Number(summary.rebirths) || 0);
  const blockCounts = resolveAutoBreakthroughBlockCounts(summary);
  const warmupSkips = Math.max(0, Number(summary.autoBreakthroughWarmupSkips) || 0);
  const eventSignal = resolveBattleSceneEventSignalFromAutoSummary(summary);
  if (
    battles <= 0 &&
    breakthroughs <= 0 &&
    rebirths <= 0 &&
    blockCounts.totalBlocks <= 0 &&
    warmupSkips <= 0 &&
    !eventSignal &&
    summary.autoBreakthroughPaused !== true
  ) {
    return;
  }

  let tone = "info";
  let impactKind = "battle_win";
  let statusText = `${sourceLabel} 갱신`;
  if (eventSignal) {
    tone = eventSignal.tone;
    impactKind = eventSignal.impactKind;
    statusText = `${sourceLabel} ${eventSignal.statusTextKo}`;
  } else if (rebirths > 0) {
    tone = "error";
    impactKind = "breakthrough_fail";
    statusText = `${sourceLabel} 환생 발생`;
  } else if (summary.autoBreakthroughPaused) {
    tone = "error";
    impactKind = "breakthrough_fail";
    statusText = `${sourceLabel} 자동돌파 일시정지`;
  } else if (breakthroughs > 0) {
    tone = "success";
    impactKind = "breakthrough_success";
    statusText = `${sourceLabel} 돌파 진행`;
  } else if (battles > 0) {
    const losses = Math.max(0, battles - battleWins);
    tone = battleWins > losses ? "success" : losses > 0 ? "warn" : "info";
    impactKind = battleWins > 0 ? "battle_win" : "battle_loss";
    statusText = `${sourceLabel} 전투 진행`;
  } else if (blockCounts.totalBlocks > 0 || warmupSkips > 0) {
    tone = "warn";
    impactKind = "breakthrough_fail";
    statusText = `${sourceLabel} 돌파 대기`;
  }

  const parts = [];
  if (battles > 0) {
    parts.push(`전투 ${battles}회`);
    parts.push(`승리 ${battleWins}회`);
  }
  if (breakthroughs > 0) {
    parts.push(`돌파 ${breakthroughs}회`);
  }
  if (warmupSkips > 0) {
    parts.push(`워밍업 차단 ${warmupSkips}회`);
  }
  if (blockCounts.policyBlocks > 0) {
    parts.push(`위험 차단 ${blockCounts.policyBlocks}회`);
  }
  if (blockCounts.noQiBlocks > 0) {
    parts.push(`기 부족 차단 ${blockCounts.noQiBlocks}회`);
  }
  if (blockCounts.tribulationSettingBlocks > 0) {
    parts.push(`도겁 설정 차단 ${blockCounts.tribulationSettingBlocks}회`);
  }
  if (summary.autoBreakthroughPaused) {
    const pauseReasonLabel = String(summary.autoBreakthroughPauseReasonLabelKo || "정책");
    const pauseNextActionKo = String(summary.autoBreakthroughPauseNextActionKo || "");
    parts.push(
      `자동돌파 일시정지(${pauseReasonLabel}${pauseNextActionKo ? ` · ${pauseNextActionKo}` : ""})`,
    );
  }
  if (rebirths > 0) {
    parts.push(`환생 ${rebirths}회`);
  }
  if (eventSignal?.resultHintKo) {
    parts.push(`최근 이벤트 ${eventSignal.resultHintKo}`);
  }
  const impactOptions = resolveBattleSceneImpactOptionsFromAutoSummary(
    summary,
    eventSignal,
  );

  const summaryMessageKey = eventSignal?.outcomeCode
    ? `auto_${eventSignal.outcomeCode}`
    : summary.autoBreakthroughPaused
      ? "auto_paused"
      : rebirths > 0
        ? "auto_rebirth"
        : breakthroughs > 0
          ? "auto_breakthrough"
          : battles > 0
            ? "auto_battle"
            : "auto_summary";
  setBattleSceneStatus(statusText, tone, "auto", summaryMessageKey);
  setBattleSceneResult(
    `${sourceLabel} · ${parts.length > 0 ? parts.join(" · ") : "변화 없음"}`,
    tone,
    "auto",
    summaryMessageKey,
  );
  triggerBattleSceneImpact(impactKind, tone, impactOptions);

  if (battles > 0) {
    spawnBattleSceneFloat(`전투 +${battles}`, {
      tone: tone === "error" ? "warn" : "success",
      anchor: "center",
    });
  }
  if (breakthroughs > 0) {
    spawnBattleSceneFloat(`돌파 +${breakthroughs}`, {
      tone: "success",
      anchor: "center",
    });
  }
  if (blockCounts.totalBlocks > 0) {
    spawnBattleSceneFloat(`차단 ${blockCounts.totalBlocks}`, {
      tone: "warn",
      anchor: "enemy",
    });
  }
  if (rebirths > 0) {
    spawnBattleSceneFloat(`환생 ${rebirths}`, {
      tone: "error",
      anchor: "center",
    });
  }
}

function playBattleSceneOfflineSummary(offlineReportInput) {
  const report =
    offlineReportInput && typeof offlineReportInput === "object"
      ? offlineReportInput
      : null;
  const summary =
    report?.summary && typeof report.summary === "object"
      ? report.summary
      : null;
  const auto =
    summary?.autoSummary && typeof summary.autoSummary === "object"
      ? summary.autoSummary
      : null;
  if (!summary || !auto || (Number(summary.appliedOfflineSec) || 0) <= 0) {
    return;
  }
  const delta =
    report?.delta && typeof report.delta === "object"
      ? report.delta
      : { qi: 0, spiritCoin: 0, rebirthEssence: 0 };
  const rebirths = Math.max(0, Number(auto.rebirths) || 0);
  const breakthroughs = Math.max(0, Number(auto.breakthroughs) || 0);
  const battles = Math.max(0, Number(auto.battles) || 0);
  const blockedLabel = buildAutoBreakthroughBlockSummaryLabelKo(auto);
  const autoSummaryForSignal = {
    ...auto,
    collectedEvents: Array.isArray(report?.events) ? report.events : auto.collectedEvents,
  };
  const eventSignal = resolveBattleSceneEventSignalFromAutoSummary(autoSummaryForSignal);
  const impactOptions = resolveBattleSceneImpactOptionsFromAutoSummary(
    autoSummaryForSignal,
    eventSignal,
  );
  const tone = eventSignal
    ? eventSignal.tone
    : rebirths > 0
      ? "error"
      : breakthroughs > 0 || battles > 0
        ? "success"
        : "info";
  const impactKind = eventSignal
    ? eventSignal.impactKind
    : rebirths > 0
      ? "breakthrough_fail"
      : breakthroughs > 0
        ? "breakthrough_success"
        : "battle_win";
  const offlineMessageKey = eventSignal?.outcomeCode
    ? `offline_${eventSignal.outcomeCode}`
    : rebirths > 0
      ? "offline_rebirth"
      : breakthroughs > 0
        ? "offline_breakthrough"
        : battles > 0
          ? "offline_battle"
          : "offline_summary";
  setBattleSceneStatus(
    eventSignal?.statusTextKo ? `오프라인 정산 ${eventSignal.statusTextKo}` : "오프라인 정산 완료",
    tone,
    "offline",
    offlineMessageKey,
  );
  setBattleSceneResult(
    `오프라인 ${fmtDurationSec(summary.appliedOfflineSec)} · 전투 ${battles}회 · 돌파 ${breakthroughs}회${
      blockedLabel ? ` · ${blockedLabel}` : ""
    } · 환생 ${rebirths}회${
      eventSignal?.resultHintKo ? ` · 최근 이벤트 ${eventSignal.resultHintKo}` : ""
    }`,
    tone,
    "offline",
    offlineMessageKey,
  );
  triggerBattleSceneImpact(impactKind, tone, impactOptions);
  if ((Number(delta.qi) || 0) !== 0) {
    spawnBattleSceneFloat(`기 ${fmtSignedInteger(delta.qi)}`, {
      tone: delta.qi >= 0 ? "success" : "error",
      anchor: "player",
    });
  }
  if ((Number(delta.spiritCoin) || 0) !== 0) {
    spawnBattleSceneFloat(`영석 ${fmtSignedInteger(delta.spiritCoin)}`, {
      tone: delta.spiritCoin >= 0 ? "success" : "error",
      anchor: "player",
    });
  }
  if ((Number(delta.rebirthEssence) || 0) !== 0) {
    spawnBattleSceneFloat(`정수 ${fmtSignedInteger(delta.rebirthEssence)}`, {
      tone: delta.rebirthEssence >= 0 ? "warn" : "error",
      anchor: "player",
    });
  }
}

function clampInteger(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  const normalized = Math.floor(parsed);
  return Math.max(min, Math.min(max, normalized));
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch] || ch,
  );
}

function markSlotSummaryDirty() {
  slotSummaryDirty = true;
}

function safeLocalGetItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalRemoveItem(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function safeLocalSetItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function normalizeSlotLockMap(candidate) {
  const normalized = createDefaultSlotLockMap();
  if (!candidate || typeof candidate !== "object") {
    return normalized;
  }
  for (const slot of [1, 2, 3]) {
    normalized[slot] = candidate[slot] === true || candidate[String(slot)] === true;
  }
  return normalized;
}

function isSlotLocked(slot) {
  const normalizedSlot = normalizeSaveSlot(slot, 1);
  return slotLocks[normalizedSlot] === true;
}

function persistSlotLocks() {
  return safeLocalSetItem(MOBILE_MVP_SLOT_LOCKS_KEY, JSON.stringify(slotLocks));
}

function setSlotLocked(slot, locked, options = {}) {
  const normalizedSlot = normalizeSaveSlot(slot, 1);
  slotLocks[normalizedSlot] = locked === true;
  markSlotSummaryDirty();
  if (options.persist === false) {
    return true;
  }
  return persistSlotLocks();
}

function restoreSlotLocks() {
  const raw = safeLocalGetItem(MOBILE_MVP_SLOT_LOCKS_KEY);
  if (!raw) {
    slotLocks = createDefaultSlotLockMap();
    return;
  }
  try {
    slotLocks = normalizeSlotLockMap(JSON.parse(raw));
  } catch {
    slotLocks = createDefaultSlotLockMap();
  }
}

function getActiveStorageKey() {
  return buildStorageKeyForSlot(activeSaveSlot);
}

function resolvePreferredCopyTargetSlot() {
  const currentTarget = normalizeSaveSlot(dom.optCopySlotTarget?.value, 1);
  if (currentTarget !== activeSaveSlot) {
    return currentTarget;
  }
  return activeSaveSlot === 1 ? 2 : 1;
}

function syncCopySlotTargetOptions() {
  if (!dom.optCopySlotTarget) {
    return;
  }
  const summaryBySlot = new Map(
    [1, 2, 3].map((slot) => [slot, summarizeSaveSlot(slot)]),
  );
  const options = Array.from(dom.optCopySlotTarget.options || []);
  for (const option of options) {
    const optionSlot = normalizeSaveSlot(option.value, 1);
    const slotSummary = summaryBySlot.get(optionSlot);
    const lockedLabel = isSlotLocked(optionSlot) ? " · 잠금" : "";
    option.disabled = isCopyTargetSlotDisabled(activeSaveSlot, optionSlot);
    option.textContent =
      `슬롯 ${optionSlot} · ${resolveSlotSummaryStateShortKo(slotSummary?.state || "empty")}${lockedLabel}`;
    option.title = slotSummary?.summary || `슬롯 ${optionSlot}`;
  }
}

function syncCopySlotTargetSelection() {
  if (!dom.optCopySlotTarget) {
    return;
  }
  syncCopySlotTargetOptions();
  dom.optCopySlotTarget.value = String(resolvePreferredCopyTargetSlot());
}

function setActiveSaveSlot(slot, options = {}) {
  const persistPref = options.persistPref !== false;
  activeSaveSlot = normalizeSaveSlot(slot, activeSaveSlot || 1);
  if (dom.optSaveSlot) {
    dom.optSaveSlot.value = String(activeSaveSlot);
  }
  syncCopySlotTargetSelection();
  if (persistPref) {
    try {
      window.localStorage.setItem(MOBILE_MVP_SLOT_PREFS_KEY, String(activeSaveSlot));
    } catch {
      // ignore preference persistence failures
    }
  }
  markSlotSummaryDirty();
}

function restoreSaveSlotPreference() {
  let preferred = 1;
  try {
    preferred = normalizeSaveSlot(
      window.localStorage.getItem(MOBILE_MVP_SLOT_PREFS_KEY),
      1,
    );
  } catch {
    preferred = 1;
  }
  setActiveSaveSlot(preferred, { persistPref: false });
}

function readSlotPayload(slot, options = {}) {
  const includeLegacyForSlot1 =
    options.includeLegacyForSlot1 === undefined ? true : options.includeLegacyForSlot1;
  const normalized = normalizeSaveSlot(slot, 1);
  const slotKey = buildStorageKeyForSlot(normalized);
  const raw = safeLocalGetItem(slotKey);
  if (raw) {
    return { slot: normalized, raw, source: "slot" };
  }
  if (includeLegacyForSlot1 && normalized === 1) {
    const legacyRaw = safeLocalGetItem(MOBILE_MVP_STORAGE_KEY);
    if (legacyRaw) {
      return { slot: normalized, raw: legacyRaw, source: "legacy" };
    }
  }
  return { slot: normalized, raw: null, source: "none" };
}

function readActiveSlotPayload() {
  return readSlotPayload(activeSaveSlot, { includeLegacyForSlot1: true });
}

function summarizeSaveSlot(slot) {
  const payload = readSlotPayload(slot, { includeLegacyForSlot1: true });
  if (!payload.raw) {
    return {
      slot,
      state: "empty",
      source: payload.source,
      summary: `슬롯 ${slot}: 비어 있음`,
    };
  }

  try {
    const parsed = JSON.parse(payload.raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("invalid object");
    }
    const playerName =
      typeof parsed.playerName === "string" && parsed.playerName.trim()
        ? parsed.playerName.trim()
        : "도심";
    const parsedDifficulty = Number(parsed.progression?.difficultyIndex);
    const difficultyIndex =
      Number.isFinite(parsedDifficulty) && parsedDifficulty >= 1
        ? Math.floor(parsedDifficulty)
        : 1;
    let stageLabel = `난이도 ${difficultyIndex}`;
    if (context) {
      try {
        const stage = getStage(context, difficultyIndex);
        stageLabel = getStageDisplayNameKo(context, stage);
      } catch {
        stageLabel = `난이도 ${difficultyIndex}`;
      }
    }
    const savedAt = fmtDateTimeFromIso(parsed.lastSavedAtIso);
    return {
      slot,
      state: "ok",
      source: payload.source,
      summary: `슬롯 ${slot}: ${playerName} · ${stageLabel} · 저장 ${savedAt}`,
    };
  } catch {
    return {
      slot,
      state: "corrupt",
      source: payload.source,
      summary: `슬롯 ${slot}: 손상된 저장 데이터`,
    };
  }
}

function buildSlotActionConfirmMessage(title, lines) {
  return [`[${title}]`, ...lines].join("\n");
}

function tryConsumeSlotQuickLoadDebounce() {
  const result = resolveDebouncedAction(
    slotQuickLoadLastAcceptedAtMs,
    Date.now(),
    SLOT_QUICK_LOAD_DEBOUNCE_MS,
  );
  if (!result.accepted) {
    const waitSec = Math.max(0.1, result.remainingMs / 1000);
    setStatus(`슬롯 불러오기 연속 입력 대기 중 (${waitSec.toFixed(1)}초)`, true);
    return false;
  }
  slotQuickLoadLastAcceptedAtMs = result.lastAcceptedEpochMs;
  return true;
}

function applySlotHintTone(node, tone) {
  if (!node) {
    return;
  }
  node.classList.remove("tone-info", "tone-warn", "tone-error");
  if (tone === "error") {
    node.classList.add("tone-error");
    return;
  }
  if (tone === "warn") {
    node.classList.add("tone-warn");
    return;
  }
  node.classList.add("tone-info");
}

function applyRiskTone(node, tone) {
  if (!node) {
    return;
  }
  node.classList.remove("tone-info", "tone-warn", "tone-error");
  if (tone === "error") {
    node.classList.add("tone-error");
    return;
  }
  if (tone === "warn") {
    node.classList.add("tone-warn");
    return;
  }
  node.classList.add("tone-info");
}

function setOfflineCompareResultState(currentCodeInput, targetCodeInput) {
  const label = buildOfflineDetailCompareResultStateLabelKo(
    currentCodeInput,
    targetCodeInput,
  );
  dom.offlineCompareCodeResult.textContent = label;
  dom.offlineModal.dataset.compareResult = label;
  applyRiskTone(
    dom.offlineCompareCodeResult,
    buildOfflineDetailCompareResultStateTone(currentCodeInput, targetCodeInput),
  );
}

function setOfflineCompareResultLabel(currentCodeInput, targetCodeInput) {
  const label = buildOfflineDetailCompareResultLabelKo(
    currentCodeInput,
    targetCodeInput,
  );
  dom.offlineCompareCodeResult.textContent = label;
  dom.offlineModal.dataset.compareResult = label;
  applyRiskTone(
    dom.offlineCompareCodeResult,
    buildOfflineDetailCompareResultStateTone(currentCodeInput, targetCodeInput),
  );
}

function setOfflineCompareCodeLabel(codeInput) {
  const normalizedCode = typeof codeInput === "string" ? codeInput.trim() : "";
  const label = normalizedCode || "비교 코드 없음";
  dom.offlineDetailCompareCode.textContent = label;
  dom.offlineModal.dataset.compareCode = label;
}

function setOfflineCompareDeltaSummary(
  currentCodeInput,
  targetCodeInput,
  idleWhenEmpty = false,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (idleWhenEmpty && !targetText) {
    dom.offlineCompareCodeDeltaSummary.textContent = "차이 요약: 대기 중";
    dom.offlineModal.dataset.compareDeltaSummary = "차이 요약: 대기 중";
    applyRiskTone(dom.offlineCompareCodeDeltaSummary, "info");
    return;
  }
  const label = buildOfflineDetailCompareCodeDeltaSummaryLabelKo(
    currentCodeInput,
    targetText,
  );
  dom.offlineCompareCodeDeltaSummary.textContent = label;
  dom.offlineModal.dataset.compareDeltaSummary = label;
  applyRiskTone(
    dom.offlineCompareCodeDeltaSummary,
    buildOfflineDetailCompareCodeDeltaSummaryTone(currentCodeInput, targetText),
  );
}

function setOfflineCompareMatchSummary(
  currentCodeInput,
  targetCodeInput,
  idleWhenEmpty = false,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (idleWhenEmpty && !targetText) {
    dom.offlineCompareCodeMatchSummary.textContent = "일치 요약: 대기 중";
    dom.offlineModal.dataset.compareMatchSummary = "일치 요약: 대기 중";
    applyRiskTone(dom.offlineCompareCodeMatchSummary, "info");
    return;
  }
  const label = buildOfflineDetailCompareCodeMatchSummaryLabelKo(
    currentCodeInput,
    targetText,
  );
  dom.offlineCompareCodeMatchSummary.textContent = label;
  dom.offlineModal.dataset.compareMatchSummary = label;
  applyRiskTone(
    dom.offlineCompareCodeMatchSummary,
    buildOfflineDetailCompareCodeMatchSummaryTone(currentCodeInput, targetText),
  );
}

function setOfflineCompareSource(sourceInput) {
  const source = typeof sourceInput === "string" ? sourceInput.trim() : "";
  const normalizedSource = source || "none";
  offlineCompareSource = normalizedSource;
  const label = buildOfflineDetailCompareCodeSourceLabelKo(normalizedSource);
  dom.offlineCompareCodeSource.textContent = label;
  dom.offlineModal.dataset.compareSource = label;
  applyRiskTone(
    dom.offlineCompareCodeSource,
    buildOfflineDetailCompareCodeSourceTone(normalizedSource),
  );
  return label;
}

function setOfflineCompareCurrentSummary(currentCodeInput) {
  const currentText =
    typeof currentCodeInput === "string" ? currentCodeInput.trim() : "";
  const label = buildOfflineDetailCompareCodeCurrentSummaryLabelKo(currentText);
  dom.offlineCompareCodeCurrentSummary.textContent = label;
  dom.offlineModal.dataset.compareCurrentSummary = label;
  applyRiskTone(
    dom.offlineCompareCodeCurrentSummary,
    buildOfflineDetailCompareCodeCurrentSummaryTone(currentText),
  );
}

function setOfflineCompareTargetSummary(targetCodeInput) {
  const targetText =
    typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  const label = buildOfflineDetailCompareCodeTargetSummaryLabelKo(targetText);
  dom.offlineCompareCodeTargetSummary.textContent = label;
  dom.offlineModal.dataset.compareTargetSummary = label;
  applyRiskTone(
    dom.offlineCompareCodeTargetSummary,
    buildOfflineDetailCompareCodeTargetSummaryTone(targetText),
  );
}

function syncOfflineCompareRowContract() {
  if (!dom.offlineCompareRow) {
    return;
  }
  const inputText = String(dom.offlineCompareCodeInput?.value || "").trim();
  const targetMode = String(
    dom.btnApplyOfflineCompareViewMode?.dataset.targetMode || "",
  ).trim();
  const applyViewLabel = String(
    dom.btnApplyOfflineCompareViewMode?.textContent || "보기 모드 맞추기",
  ).trim();
  dom.offlineCompareRow.dataset.inputState = inputText ? "present" : "empty";
  dom.offlineCompareRow.dataset.inputLength = String(inputText.length);
  dom.offlineCompareRow.dataset.targetMode = targetMode || "none";
  dom.offlineCompareRow.dataset.applyViewEnabled = String(
    !dom.btnApplyOfflineCompareViewMode?.disabled,
  );
  dom.offlineCompareRow.dataset.applyViewLabel =
    applyViewLabel || "보기 모드 맞추기";
  dom.offlineCompareRow.dataset.pasteButtonLabel =
    dom.btnPasteOfflineCompareCode?.textContent?.trim() || "비교 코드 붙여넣기";
  dom.offlineCompareRow.dataset.pasteButtonDisabled = String(
    dom.btnPasteOfflineCompareCode?.disabled === true,
  );
  dom.offlineCompareRow.dataset.loadPayloadButtonLabel =
    dom.btnLoadOfflineCompareCodeFromPayload?.textContent?.trim() ||
    "savePayload에서 대조";
  dom.offlineCompareRow.dataset.loadPayloadButtonDisabled = String(
    dom.btnLoadOfflineCompareCodeFromPayload?.disabled === true,
  );
  dom.offlineCompareRow.dataset.compareButtonLabel =
    dom.btnCompareOfflineCode?.textContent?.trim() || "비교 코드 대조";
  dom.offlineCompareRow.dataset.compareButtonDisabled = String(
    dom.btnCompareOfflineCode?.disabled === true,
  );
}

function syncOfflineCompareViewModeAction(currentCodeInput, targetCodeInput) {
  if (!dom.btnApplyOfflineCompareViewMode) {
    return;
  }
  const targetMode = resolveOfflineDetailCompareViewModeAlignmentTarget(
    currentCodeInput,
    targetCodeInput,
  );
  if (targetMode !== "all" && targetMode !== "critical") {
    dom.btnApplyOfflineCompareViewMode.disabled = true;
    dom.btnApplyOfflineCompareViewMode.dataset.targetMode = "";
    dom.btnApplyOfflineCompareViewMode.textContent = "보기 모드 맞추기";
    syncOfflineCompareRowContract();
    return;
  }
  const modeLabelKo = targetMode === "critical" ? "핵심" : "전체";
  dom.btnApplyOfflineCompareViewMode.disabled = false;
  dom.btnApplyOfflineCompareViewMode.dataset.targetMode = targetMode;
  dom.btnApplyOfflineCompareViewMode.textContent = `보기 모드 맞추기(${modeLabelKo})`;
  syncOfflineCompareRowContract();
}

function setOfflineCompareActionHint(currentCodeInput, targetCodeInput) {
  const label = buildOfflineDetailCompareActionHintLabelKo(
    currentCodeInput,
    targetCodeInput,
  );
  const tone = buildOfflineDetailCompareActionHintTone(
    currentCodeInput,
    targetCodeInput,
  );
  dom.offlineCompareCodeActionHint.textContent = label;
  dom.offlineModal.dataset.compareActionHint = label;
  applyRiskTone(dom.offlineCompareCodeActionHint, tone);
  syncOfflineCompareViewModeAction(currentCodeInput, targetCodeInput);
}

function syncSlotActionButtons() {
  const targetSlot = normalizeSaveSlot(dom.optCopySlotTarget.value, activeSaveSlot);
  const targetSummary = summarizeSaveSlot(targetSlot);
  const targetLocked = isSlotLocked(targetSlot);
  const copyPolicy = resolveSlotCopyPolicy(
    activeSaveSlot,
    targetSlot,
    targetSummary.state,
    targetLocked,
  );
  dom.btnCopySlot.disabled = !copyPolicy.allowed;
  if (copyPolicy.allowed) {
    dom.btnCopySlot.title = "";
  } else if (copyPolicy.reason === "target_locked") {
    dom.btnCopySlot.title = "대상 슬롯 잠금 해제 후 복제 가능";
  } else {
    dom.btnCopySlot.title = "복제 대상은 활성 슬롯과 달라야 함";
  }

  const sourceSummary = summarizeSaveSlot(activeSaveSlot);
  const sourceLocked = isSlotLocked(activeSaveSlot);
  const deletePolicy = resolveSlotDeletePolicy(
    activeSaveSlot,
    sourceSummary.state,
    sourceLocked,
  );
  const lockHintText = sourceLocked
    ? `활성 슬롯 ${activeSaveSlot}: 잠금됨 (삭제/덮어쓰기 보호 중)`
    : `활성 슬롯 ${activeSaveSlot}: 잠금 해제 (삭제/덮어쓰기 가능)`;
  const lockHintTone = sourceLocked ? "warn" : "info";
  const targetHintText = `대상 슬롯 ${targetSlot}: ${resolveSlotSummaryStateLabelKo(targetSummary.state)}${
    targetLocked ? " · 잠금됨" : ""
  }`;
  const targetHintTone = targetLocked
    ? "warn"
    : resolveSlotSummaryStateTone(targetSummary.state);
  const copyHintText = `복제: ${resolveSlotCopyHint(copyPolicy)}`;
  const copyHintTone = resolveSlotCopyHintTone(copyPolicy);
  const deleteHintText = `삭제: ${resolveSlotDeleteHint(deletePolicy)}`;
  const deleteHintTone = resolveSlotDeleteHintTone(deletePolicy);
  if (dom.savePanel) {
    dom.savePanel.dataset.activeSlot = String(activeSaveSlot);
    dom.savePanel.dataset.copyTargetSlot = String(targetSlot);
    dom.savePanel.dataset.sourceSlotState = sourceSummary.state || "empty";
    dom.savePanel.dataset.sourceSlotLocked = String(sourceLocked);
    dom.savePanel.dataset.sourceSlotSummary =
      `슬롯 ${activeSaveSlot}: ${resolveSlotSummaryStateLabelKo(sourceSummary.state)}${
        sourceLocked ? " · 잠금됨" : ""
      }`;
    dom.savePanel.dataset.targetSlotState = targetSummary.state || "empty";
    dom.savePanel.dataset.targetSlotLocked = String(targetLocked);
    dom.savePanel.dataset.targetSlotSummary = targetHintText;
    dom.savePanel.dataset.copyPolicyReason = copyPolicy.reason || "unknown";
    dom.savePanel.dataset.copyAllowed = String(copyPolicy.allowed);
    dom.savePanel.dataset.copyPolicyLabel = copyHintText;
    dom.savePanel.dataset.deletePolicyReason = deletePolicy.reason || "unknown";
    dom.savePanel.dataset.deleteAllowed = String(deletePolicy.allowed);
    dom.savePanel.dataset.deletePolicyLabel = deleteHintText;
  }
  if (dom.slotActionHintBox) {
    dom.slotActionHintBox.dataset.lockHint = lockHintText;
    dom.slotActionHintBox.dataset.lockTone = lockHintTone;
    dom.slotActionHintBox.dataset.targetHint = targetHintText;
    dom.slotActionHintBox.dataset.targetTone = targetHintTone;
    dom.slotActionHintBox.dataset.copyHint = copyHintText;
    dom.slotActionHintBox.dataset.copyTone = copyHintTone;
    dom.slotActionHintBox.dataset.deleteHint = deleteHintText;
    dom.slotActionHintBox.dataset.deleteTone = deleteHintTone;
  }
  dom.btnDeleteSlot.disabled = !deletePolicy.allowed;
  if (deletePolicy.allowed) {
    dom.btnDeleteSlot.title = "";
  } else if (deletePolicy.reason === "slot_locked") {
    dom.btnDeleteSlot.title = "활성 슬롯 잠금 해제 후 삭제 가능";
  } else {
    dom.btnDeleteSlot.title = "삭제할 저장 데이터가 없음";
  }

  if (dom.slotLockHint) {
    dom.slotLockHint.textContent = lockHintText;
    applySlotHintTone(dom.slotLockHint, lockHintTone);
  }
  if (dom.btnToggleSlotLock) {
    dom.btnToggleSlotLock.textContent = sourceLocked ? "활성 슬롯 잠금 해제" : "활성 슬롯 잠금";
    dom.btnToggleSlotLock.title = sourceLocked
      ? "잠금을 해제하면 삭제/덮어쓰기가 가능합니다."
      : "잠그면 삭제/덮어쓰기를 차단합니다.";
  }
  if (dom.slotTargetHint) {
    dom.slotTargetHint.textContent = targetHintText;
    applySlotHintTone(dom.slotTargetHint, targetHintTone);
  }
  if (dom.slotCopyHint) {
    dom.slotCopyHint.textContent = copyHintText;
    applySlotHintTone(dom.slotCopyHint, copyHintTone);
  }
  if (dom.slotDeleteHint) {
    dom.slotDeleteHint.textContent = deleteHintText;
    applySlotHintTone(dom.slotDeleteHint, deleteHintTone);
  }
  if (dom.savePanel) {
    dom.savePanel.dataset.copyButtonLabel =
      dom.btnCopySlot?.textContent?.trim() || "활성 슬롯 복제";
    dom.savePanel.dataset.copyButtonDisabled = String(
      dom.btnCopySlot?.disabled === true,
    );
    dom.savePanel.dataset.toggleLockButtonLabel =
      dom.btnToggleSlotLock?.textContent?.trim() || "활성 슬롯 잠금";
    dom.savePanel.dataset.toggleLockButtonDisabled = String(
      dom.btnToggleSlotLock?.disabled === true,
    );
    dom.savePanel.dataset.deleteButtonLabel =
      dom.btnDeleteSlot?.textContent?.trim() || "활성 슬롯 삭제";
    dom.savePanel.dataset.deleteButtonDisabled = String(
      dom.btnDeleteSlot?.disabled === true,
    );
    dom.savePanel.dataset.saveButtonLabel =
      dom.btnSaveLocal?.textContent?.trim() || "로컬 저장";
    dom.savePanel.dataset.saveButtonDisabled = String(
      dom.btnSaveLocal?.disabled === true,
    );
    dom.savePanel.dataset.loadButtonLabel =
      dom.btnLoadLocal?.textContent?.trim() || "로컬 불러오기";
    dom.savePanel.dataset.loadButtonDisabled = String(
      dom.btnLoadLocal?.disabled === true,
    );
    dom.savePanel.dataset.exportButtonLabel =
      dom.btnExportState?.textContent?.trim() || "JSON 내보내기";
    dom.savePanel.dataset.exportButtonDisabled = String(
      dom.btnExportState?.disabled === true,
    );
    dom.savePanel.dataset.importButtonLabel =
      dom.btnImportState?.textContent?.trim() || "JSON 가져오기";
    dom.savePanel.dataset.importButtonDisabled = String(
      dom.btnImportState?.disabled === true,
    );
  }
}

function renderSaveSlotSummary(force = false) {
  const now = Date.now();
  if (!force && !slotSummaryDirty && now - slotSummaryLastRenderedAtMs < 1500) {
    return;
  }
  const rows = [1, 2, 3].map((slot) => summarizeSaveSlot(slot));
  const activeRow =
    rows.find((row) => row.slot === activeSaveSlot) || rows[0] || { slot: activeSaveSlot, state: "empty" };
  if (dom.saveSlotSummaryList) {
    const okCount = rows.filter((row) => row.state === "ok").length;
    const emptyCount = rows.filter((row) => row.state === "empty").length;
    const corruptCount = rows.filter((row) => row.state === "corrupt").length;
    const lockedCount = rows.filter((row) => isSlotLocked(row.slot)).length;
    dom.saveSlotSummaryList.dataset.slotCount = String(rows.length);
    dom.saveSlotSummaryList.dataset.activeSlot = String(activeSaveSlot);
    dom.saveSlotSummaryList.dataset.activeSlotState = String(activeRow.state || "empty");
    dom.saveSlotSummaryList.dataset.activeSlotSummary = String(
      activeRow.summary || `슬롯 ${activeSaveSlot}: 비어 있음`,
    );
    dom.saveSlotSummaryList.dataset.activeSlotSource = String(
      activeRow.source || "none",
    );
    dom.saveSlotSummaryList.dataset.activeSlotLocked = String(
      isSlotLocked(activeSaveSlot),
    );
    dom.saveSlotSummaryList.dataset.okCount = String(okCount);
    dom.saveSlotSummaryList.dataset.emptyCount = String(emptyCount);
    dom.saveSlotSummaryList.dataset.corruptCount = String(corruptCount);
    dom.saveSlotSummaryList.dataset.lockedCount = String(lockedCount);
    dom.saveSlotSummaryList.dataset.stateBreakdownLabel =
      `정상 ${okCount} · 빈 슬롯 ${emptyCount} · 손상 ${corruptCount}`;
    dom.saveSlotSummaryList.dataset.lockedCountLabel = `잠금 슬롯 ${lockedCount}`;
  }
  dom.saveSlotSummaryList.innerHTML = rows
    .map((row) => {
      const classes = ["slot-summary-item"];
      if (row.slot === activeSaveSlot) {
        classes.push("active");
      }
      if (row.state === "corrupt") {
        classes.push("corrupt");
      }
      const sourceBadge =
        row.source === "legacy"
          ? '<span class="slot-source legacy">legacy</span>'
          : row.state === "ok"
            ? '<span class="slot-source">slot</span>'
            : "";
      const activeBadge =
        row.slot === activeSaveSlot
          ? '<span class="slot-source active">active</span>'
          : "";
      const lockBadge = isSlotLocked(row.slot)
        ? '<span class="slot-source locked">locked</span>'
        : "";
      return `<li class="${classes.join(" ")}" data-slot="${row.slot}" data-state="${row.state}" tabindex="0" role="button" aria-label="${escapeHtml(row.summary)}">
        <span>${escapeHtml(row.summary)}</span>
        <span class="slot-badges">${activeBadge}${lockBadge}${sourceBadge}</span>
      </li>`;
    })
    .join("");
  slotSummaryDirty = false;
  slotSummaryLastRenderedAtMs = now;
}

function formatOfflineEventLine(event) {
  const secLabel = `${fmtDurationSec(event.sec || 0)} 시점`;
  if (event.kind === "battle_win") {
    return `${secLabel}: 전투 승리 (기 ${fmtSignedInteger(event.qiDelta)}, 영석 ${fmtSignedInteger(event.spiritCoinDelta)})`;
  }
  if (event.kind === "battle_loss") {
    return `${secLabel}: 전투 패배 (기 ${fmtSignedInteger(event.qiDelta)})`;
  }
  if (event.kind === "breakthrough_success") {
    const qiDelta = Math.round(Number(event.qiDelta) || 0);
    return `${secLabel}: 돌파 성공 (난이도 ${event.fromDifficultyIndex} → ${event.toDifficultyIndex}${
      qiDelta !== 0 ? ` · 기 ${fmtSignedInteger(qiDelta)}` : ""
    })`;
  }
  if (event.kind === "breakthrough_minor_fail") {
    const fromDifficultyIndex = Math.max(
      0,
      Math.round(Number(event.fromDifficultyIndex || event.difficultyIndex) || 0),
    );
    const toDifficultyIndex = Math.max(
      0,
      Math.round(Number(event.toDifficultyIndex || event.difficultyIndex) || 0),
    );
    const deathPct = Math.max(0, Math.min(95, Number(event.deathPct) || 0));
    return `${secLabel}: 돌파 경상 실패 (${
      fromDifficultyIndex > 0 && toDifficultyIndex > 0
        ? `난이도 ${fmtNumber(fromDifficultyIndex)} → ${fmtNumber(toDifficultyIndex)} · `
        : ""
    }기 ${fmtSignedInteger(event.qiDelta)}${
      deathPct > 0 ? ` · 사망률 ${deathPct.toFixed(1)}%` : ""
    })`;
  }
  if (event.kind === "breakthrough_retreat_fail") {
    const fromDifficultyIndex = Math.max(0, Math.round(Number(event.fromDifficultyIndex) || 0));
    const toDifficultyIndex = Math.max(0, Math.round(Number(event.toDifficultyIndex) || 0));
    const qiDelta = Math.round(Number(event.qiDelta) || 0);
    return `${secLabel}: 돌파 후퇴 실패 (${
      fromDifficultyIndex > 0 && toDifficultyIndex > 0
        ? `난이도 ${fmtNumber(fromDifficultyIndex)} → ${fmtNumber(toDifficultyIndex)}`
        : `${event.retreatLayers}단계 하락`
    }${
      qiDelta !== 0 ? ` · 기 ${fmtSignedInteger(qiDelta)}` : ""
    })`;
  }
  if (event.kind === "breakthrough_death_fail") {
    const fromDifficultyIndex = Math.max(
      0,
      Math.round(Number(event.fromDifficultyIndex || event.difficultyIndex) || 0),
    );
    const toDifficultyIndex = Math.max(0, Math.round(Number(event.toDifficultyIndex) || 0));
    const resetStageNameKo = String(event.resetStageNameKo || "");
    const deathPct = Math.max(0, Math.min(95, Number(event.deathPct) || 0));
    return `${secLabel}: 도겁 사망 → 환생 (환생정수 +${fmtNumber(event.rebirthReward)}${
      deathPct > 0 ? ` · 사망률 ${deathPct.toFixed(1)}%` : ""
    }${
      fromDifficultyIndex > 0 && toDifficultyIndex > 0
        ? ` · 난이도 ${fmtNumber(fromDifficultyIndex)} → ${fmtNumber(toDifficultyIndex)}`
        : ""
    }${
      resetStageNameKo ? ` · ${resetStageNameKo}` : ""
    })`;
  }
  if (event.kind === "breakthrough_blocked_auto_policy") {
    const reasonLabel = String(event.reasonLabelKo || event.reason || "policy");
    const actionText =
      typeof event.nextActionKo === "string" && event.nextActionKo
        ? ` · ${event.nextActionKo}`
        : "";
    return `${secLabel}: 자동 돌파 차단 (${reasonLabel})${actionText}`;
  }
  if (event.kind === "breakthrough_blocked_no_qi") {
    const requiredQi = Math.max(1, Number(event.requiredQi) || 1);
    const currentQi = Math.max(0, Number(event.currentQi) || 0);
    return `${secLabel}: 자동 돌파 기 부족 (기 ${fmtNumber(currentQi)}/${fmtNumber(requiredQi)})`;
  }
  if (event.kind === "breakthrough_blocked_tribulation_setting") {
    const difficultyIndex = Math.max(0, Number(event.difficultyIndex) || 0);
    return `${secLabel}: 자동 돌파 도겁 대기 (자동 도겁 허용 꺼짐${
      difficultyIndex > 0 ? ` · 난이도 ${difficultyIndex}` : ""
    })`;
  }
  if (event.kind === "auto_breakthrough_paused_by_policy") {
    const reasonLabel = String(event.reasonLabelKo || event.reason || "policy");
    const threshold = Math.max(1, Number(event.threshold) || 1);
    const consecutiveBlocks = Math.max(
      threshold,
      Number(event.consecutiveBlocks) || threshold,
    );
    const nextActionText =
      typeof event.nextActionKo === "string" && event.nextActionKo
        ? ` · ${event.nextActionKo}`
        : "";
    return `${secLabel}: 자동 돌파 일시정지 (${reasonLabel}, 연속 ${consecutiveBlocks}회 차단${
      consecutiveBlocks !== threshold ? ` · 임계 ${threshold}회` : ""
    })${nextActionText}`;
  }
  if (event.kind === "offline_warmup_summary") {
    const label = String(
      event.labelKo ||
        `워밍업 ${Math.max(0, Number(event.beforeSec) || 0)}초 → ${Math.max(0, Number(event.afterSec) || 0)}초`,
    );
    return `${secLabel}: 오프라인 워밍업 요약 (${label})`;
  }
  return `${secLabel}: ${String(event.kind || "unknown")}`;
}

function renderOfflineDetailList(events) {
  const prioritizedRows = prioritizeOfflineDetailEvents(events);
  const mode = offlineDetailCriticalOnly ? "critical" : "all";
  const rows = filterOfflineDetailEventsByMode(prioritizedRows, mode);
  const filterSummaryLabel = buildOfflineDetailFilterSummaryLabelKo(
    prioritizedRows,
    mode,
  );
  const hiddenSummaryLabel = buildOfflineDetailHiddenSummaryLabelKo(
    prioritizedRows,
    mode,
  );
  const hiddenKindsSummaryLabel = buildOfflineDetailHiddenKindsSummaryLabelKo(
    prioritizedRows,
    mode,
  );
  const emptyLabel = offlineDetailCriticalOnly
    ? "핵심 이벤트 없음"
    : "세부 로그 없음";
  const currentCompareCode = buildOfflineDetailCompareCode(prioritizedRows, mode);
  setOfflineCompareCodeLabel(currentCompareCode);
  setOfflineCompareCurrentSummary(currentCompareCode);
  const targetText = String(dom.offlineCompareCodeInput.value || "").trim();
  setOfflineCompareResultState(currentCompareCode, targetText);
  setOfflineCompareActionHint(currentCompareCode, targetText);
  setOfflineCompareDeltaSummary(currentCompareCode, targetText, true);
  setOfflineCompareMatchSummary(currentCompareCode, targetText, true);
  dom.offlineDetailFilterSummary.textContent = filterSummaryLabel;
  dom.offlineDetailHiddenSummary.textContent = hiddenSummaryLabel;
  dom.offlineDetailHiddenKindsSummary.textContent = hiddenKindsSummaryLabel;
  if (dom.offlineDetailList) {
    dom.offlineDetailList.dataset.detailMode = mode;
    dom.offlineDetailList.dataset.detailExpanded = String(offlineDetailExpanded);
    dom.offlineDetailList.dataset.visibleCount = String(rows.length);
    dom.offlineDetailList.dataset.prioritizedCount = String(prioritizedRows.length);
    dom.offlineDetailList.dataset.hiddenCount = String(
      Math.max(0, prioritizedRows.length - rows.length),
    );
    dom.offlineDetailList.dataset.filterSummary = filterSummaryLabel;
    dom.offlineDetailList.dataset.hiddenSummary = hiddenSummaryLabel;
    dom.offlineDetailList.dataset.hiddenKindsSummary = hiddenKindsSummaryLabel;
    dom.offlineDetailList.dataset.emptyLabel = emptyLabel;
  }
  if (rows.length === 0) {
    dom.offlineDetailList.innerHTML = `<li class="delta-neutral">${emptyLabel}</li>`;
    return;
  }
  dom.offlineDetailList.innerHTML = rows
    .map((event) => `<li>${formatOfflineEventLine(event)}</li>`)
    .join("");
}

function setOfflineDetailCriticalOnly(enabled) {
  offlineDetailCriticalOnly = Boolean(enabled);
  dom.offlineDetailList.dataset.detailMode = offlineDetailCriticalOnly
    ? "critical"
    : "all";
  dom.btnToggleOfflineCriticalOnly.textContent = offlineDetailCriticalOnly
    ? "전체 로그 보기"
    : "핵심 로그만 보기";
}

function setOfflineDetailExpanded(expanded) {
  offlineDetailExpanded = expanded;
  dom.offlineDetailList.dataset.detailExpanded = String(expanded);
  dom.offlineDetailList.classList.toggle("hidden", !expanded);
  dom.btnToggleOfflineDetail.textContent = expanded ? "세부 로그 숨기기" : "세부 로그 보기";
}

function captureCurrentCurrencies() {
  return {
    qi: state.currencies.qi,
    spiritCoin: state.currencies.spiritCoin,
    rebirthEssence: state.currencies.rebirthEssence,
  };
}

function getRealtimeStats() {
  return state.realtimeStats;
}

function syncActionsPanelButtonContract() {
  if (!dom.actionsPanel) {
    return;
  }
  dom.actionsPanel.dataset.battleButtonLabel =
    dom.btnBattle?.textContent?.trim() || "전투 1회";
  dom.actionsPanel.dataset.breakthroughButtonLabel =
    dom.btnBreakthrough?.textContent?.trim() || "돌파 시도";
  dom.actionsPanel.dataset.auto10sButtonLabel =
    dom.btnAuto10s?.textContent?.trim() || "자동 10초 진행";
  dom.actionsPanel.dataset.realtimeButtonLabel =
    dom.btnRealtimeAuto?.textContent?.trim() || "실시간 자동 시작";
  dom.actionsPanel.dataset.resetButtonLabel =
    dom.btnResetRun?.textContent?.trim() || "런 초기화";
  dom.actionsPanel.dataset.exportReportLabel =
    dom.btnExportRealtimeReport?.textContent?.trim() || "실시간 리포트 JSON";
  dom.actionsPanel.dataset.resetReportLabel =
    dom.btnResetRealtimeStats?.textContent?.trim() || "실시간 통계 초기화";
  dom.actionsPanel.dataset.battleButtonDisabled = String(
    dom.btnBattle?.disabled === true,
  );
  dom.actionsPanel.dataset.breakthroughButtonDisabled = String(
    dom.btnBreakthrough?.disabled === true,
  );
  dom.actionsPanel.dataset.auto10sButtonDisabled = String(
    dom.btnAuto10s?.disabled === true,
  );
  dom.actionsPanel.dataset.realtimeButtonDisabled = String(
    dom.btnRealtimeAuto?.disabled === true,
  );
  dom.actionsPanel.dataset.resetButtonDisabled = String(
    dom.btnResetRun?.disabled === true,
  );
  dom.actionsPanel.dataset.exportReportDisabled = String(
    dom.btnExportRealtimeReport?.disabled === true,
  );
  dom.actionsPanel.dataset.resetReportDisabled = String(
    dom.btnResetRealtimeStats?.disabled === true,
  );
}

function getConfiguredAutoBreakthroughResumeWarmupSec() {
  return normalizeAutoBreakthroughResumeWarmupSec(
    state?.settings?.autoBreakthroughResumeWarmupSec,
    DEFAULT_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC,
  );
}

function ensureRealtimeStatsShape() {
  if (!state.realtimeStats || typeof state.realtimeStats !== "object") {
    const currency = captureCurrentCurrencies();
    state.realtimeStats = {
      sessionStartedAtIso: "",
      timelineSec: 0,
      autoBreakthroughWarmupUntilTimelineSec: 0,
      elapsedSec: 0,
      battles: 0,
      breakthroughs: 0,
      rebirths: 0,
      anchorQi: currency.qi,
      anchorSpiritCoin: currency.spiritCoin,
      anchorRebirthEssence: currency.rebirthEssence,
    };
    return;
  }
  if (!Number.isFinite(state.realtimeStats.autoBreakthroughWarmupUntilTimelineSec)) {
    state.realtimeStats.autoBreakthroughWarmupUntilTimelineSec = 0;
  }
}

function getAutoBreakthroughWarmupRemainingSec(statsInput = getRealtimeStats()) {
  const stats =
    statsInput && typeof statsInput === "object" ? statsInput : getRealtimeStats();
  const warmupUntilSec = Math.max(
    0,
    Math.floor(Number(stats.autoBreakthroughWarmupUntilTimelineSec) || 0),
  );
  const timelineSec = Math.max(0, Math.floor(Number(stats.timelineSec) || 0));
  return Math.max(0, warmupUntilSec - timelineSec);
}

function armAutoBreakthroughResumeWarmup(durationSecInput) {
  const stats = getRealtimeStats();
  const warmupDurationSec = normalizeAutoBreakthroughResumeWarmupSec(
    durationSecInput,
    getConfiguredAutoBreakthroughResumeWarmupSec(),
  );
  const timelineSec = Math.max(0, Math.floor(Number(stats.timelineSec) || 0));
  const currentWarmupUntilSec = Math.max(
    0,
    Math.floor(Number(stats.autoBreakthroughWarmupUntilTimelineSec) || 0),
  );
  const nextWarmupUntilSec = timelineSec + warmupDurationSec;
  stats.autoBreakthroughWarmupUntilTimelineSec = Math.max(
    currentWarmupUntilSec,
    nextWarmupUntilSec,
  );
  return getAutoBreakthroughWarmupRemainingSec(stats);
}

function ensureRealtimeAnchor() {
  const stats = getRealtimeStats();
  if (stats.sessionStartedAtIso) {
    return;
  }
  const currency = captureCurrentCurrencies();
  stats.sessionStartedAtIso = new Date().toISOString();
  stats.anchorQi = currency.qi;
  stats.anchorSpiritCoin = currency.spiritCoin;
  stats.anchorRebirthEssence = currency.rebirthEssence;
}

async function exportOfflineReportToPayload() {
  if (!lastOfflineReport) {
    setStatus("내보낼 오프라인 정산 리포트가 없음", true);
    return;
  }
  const exportMode = offlineDetailCriticalOnly ? "critical" : "all";
  const detailViewSnapshotAtExport = buildOfflineDetailReportSnapshot(
    lastOfflineReport.events,
    3,
    exportMode,
  );
  const payloadObj = {
    ...lastOfflineReport,
    exportedAtIso: new Date().toISOString(),
    detailViewSnapshotAtExport,
  };
  const payload = `${JSON.stringify(payloadObj, null, 2)}\n`;
  setSavePayloadValue(payload, "offline_report");
  let copied = false;
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(payload);
      copied = true;
    } catch {
      copied = false;
    }
  }
  setStatus(copied ? "오프라인 정산 리포트 JSON 복사 완료" : "오프라인 정산 리포트 JSON 생성 완료");
}

async function copyOfflineCompareCodeToClipboard() {
  const code = String(dom.offlineDetailCompareCode.textContent || "").trim();
  if (!isOfflineDetailCompareCode(code)) {
    setStatus("복사할 비교 코드가 없음", true);
    return;
  }
  let copied = false;
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
    } catch {
      copied = false;
    }
  }
  if (!copied) {
    setSavePayloadValue(`${code}\n`, "offline_compare_code");
  }
  setStatus(copied ? "오프라인 비교 코드 복사 완료" : "오프라인 비교 코드 생성 완료");
}

function runOfflineCompareCodeCheck(source = "keep") {
  const currentCode = String(dom.offlineDetailCompareCode.textContent || "").trim();
  const targetText = String(dom.offlineCompareCodeInput.value || "").trim();
  const normalizedSource = resolveOfflineDetailCompareCheckSource(
    source,
    offlineCompareSource,
    targetText,
  );
  setOfflineCompareSource(normalizedSource);
  setOfflineCompareResultState(currentCode, targetText);
  setOfflineCompareActionHint(currentCode, targetText);
  setOfflineCompareTargetSummary(targetText);
  setOfflineCompareDeltaSummary(currentCode, targetText);
  setOfflineCompareMatchSummary(currentCode, targetText);
  const targetInputState = resolveOfflineDetailCompareTargetInputState(targetText);
  if (targetInputState !== "valid") {
    const earlyMessage =
      resolveOfflineDetailCompareTargetInputStateStatusMessageKo(targetInputState);
    setStatus(
      buildOfflineDetailCompareStatusLabelKo(normalizedSource, earlyMessage),
      true,
    );
    return;
  }
  const targetCode = extractOfflineDetailCompareCode(targetText);
  if (targetText !== targetCode) {
    dom.offlineCompareCodeInput.value = targetCode;
    setOfflineCompareResultState(currentCode, targetCode);
    setOfflineCompareActionHint(currentCode, targetCode);
    setOfflineCompareTargetSummary(targetCode);
    setOfflineCompareDeltaSummary(currentCode, targetCode);
    setOfflineCompareMatchSummary(currentCode, targetCode);
  }
  const resultLabel = buildOfflineDetailCompareResultLabelKo(currentCode, targetCode);
  setOfflineCompareResultLabel(currentCode, targetCode);
  setOfflineCompareActionHint(currentCode, targetCode);
  const isError = isOfflineDetailCompareResultError(currentCode, targetCode);
  setStatus(buildOfflineDetailCompareStatusLabelKo(normalizedSource, resultLabel), isError);
}

async function pasteOfflineCompareCodeFromClipboard() {
  if (!(navigator.clipboard && typeof navigator.clipboard.readText === "function")) {
    const clipboardFailure = resolveOfflineDetailCompareClipboardFailureInfo("unsupported");
    setOfflineCompareSource(clipboardFailure.source);
    setStatus(
      buildOfflineDetailCompareStatusLabelKo(
        clipboardFailure.source,
        clipboardFailure.messageKo,
      ),
      true,
    );
    return;
  }
  let text = "";
  const currentCode = String(dom.offlineDetailCompareCode.textContent || "").trim();
  try {
    text = await navigator.clipboard.readText();
  } catch {
    const clipboardFailure = resolveOfflineDetailCompareClipboardFailureInfo("read_failed");
    setOfflineCompareSource(clipboardFailure.source);
    setStatus(
      buildOfflineDetailCompareStatusLabelKo(
        clipboardFailure.source,
        clipboardFailure.messageKo,
      ),
      true,
    );
    return;
  }
  const extractedCode = extractOfflineDetailCompareCode(text);
  if (!extractedCode) {
    const clipboardFailure = resolveOfflineDetailCompareClipboardFailureInfo("extract_failed");
    dom.offlineCompareCodeResult.textContent = buildOfflineDetailCompareInvalidTargetLabelKo();
    applyRiskTone(dom.offlineCompareCodeResult, "warn");
    setOfflineCompareTargetSummary(text);
    setOfflineCompareDeltaSummary(currentCode, text);
    setOfflineCompareMatchSummary(currentCode, text);
    setOfflineCompareActionHint(currentCode, text);
    setOfflineCompareSource(clipboardFailure.source);
    setStatus(
      buildOfflineDetailCompareStatusLabelKo(
        clipboardFailure.source,
        clipboardFailure.messageKo,
      ),
      true,
    );
    return;
  }
  dom.offlineCompareCodeInput.value = extractedCode;
  runOfflineCompareCodeCheck("clipboard");
}

function loadOfflineCompareCodeFromPayload() {
  const payloadText = String(dom.savePayload.value || "").trim();
  const currentCode = String(dom.offlineDetailCompareCode.textContent || "").trim();
  if (!payloadText) {
    const payloadFailure = resolveOfflineDetailComparePayloadFailureInfo("missing_payload");
    setOfflineCompareResultState(currentCode, payloadText);
    setOfflineCompareTargetSummary(payloadText);
    setOfflineCompareDeltaSummary(currentCode, payloadText);
    setOfflineCompareMatchSummary(currentCode, payloadText);
    setOfflineCompareActionHint(currentCode, payloadText);
    setOfflineCompareSource(payloadFailure.source);
    setStatus(
      buildOfflineDetailCompareStatusLabelKo(
        payloadFailure.source,
        payloadFailure.messageKo,
      ),
      true,
    );
    return;
  }
  const extracted = extractOfflineDetailCompareCodeFromPayloadTextWithSource(payloadText);
  if (!extracted.code) {
    const payloadFailure = resolveOfflineDetailComparePayloadFailureInfo("extract_failed");
    dom.offlineCompareCodeResult.textContent = buildOfflineDetailCompareInvalidTargetLabelKo();
    applyRiskTone(dom.offlineCompareCodeResult, "warn");
    setOfflineCompareTargetSummary(payloadText);
    setOfflineCompareDeltaSummary(currentCode, payloadText);
    setOfflineCompareMatchSummary(currentCode, payloadText);
    setOfflineCompareActionHint(currentCode, payloadText);
    setOfflineCompareSource(payloadFailure.source);
    setStatus(
      buildOfflineDetailCompareStatusLabelKo(
        payloadFailure.source,
        payloadFailure.messageKo,
      ),
      true,
    );
    return;
  }
  dom.offlineCompareCodeInput.value = extracted.code;
  runOfflineCompareCodeCheck(
    resolveOfflineDetailComparePayloadLoadSource(extracted.source),
  );
}

async function exportRealtimeReportToPayload() {
  const stats = getRealtimeStats();
  if (!stats.sessionStartedAtIso || stats.elapsedSec <= 0) {
    setStatus("내보낼 실시간 리포트가 없음", true);
    return;
  }
  const nowCurrencies = captureCurrentCurrencies();
  const payloadObj = {
    generatedAtIso: new Date().toISOString(),
    sessionStartedAtIso: stats.sessionStartedAtIso,
    elapsedSec: stats.elapsedSec,
    summary: {
      elapsedSec: stats.elapsedSec,
      battles: stats.battles,
      breakthroughs: stats.breakthroughs,
      rebirths: stats.rebirths,
      timelineSec: stats.timelineSec,
    },
    settings: {
      battleSpeed: state.settings.battleSpeed,
      autoBattle: state.settings.autoBattle,
      autoBreakthrough: state.settings.autoBreakthrough,
      autoTribulation: state.settings.autoTribulation,
    },
    delta: {
      qi: nowCurrencies.qi - stats.anchorQi,
      spiritCoin: nowCurrencies.spiritCoin - stats.anchorSpiritCoin,
      rebirthEssence: nowCurrencies.rebirthEssence - stats.anchorRebirthEssence,
    },
    stageDifficultyIndex: state.progression.difficultyIndex,
    rebirthCount: state.progression.rebirthCount,
  };
  const payload = `${JSON.stringify(payloadObj, null, 2)}\n`;
  setSavePayloadValue(payload, "realtime_report");
  let copied = false;
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(payload);
      copied = true;
    } catch {
      copied = false;
    }
  }
  setStatus(copied ? "실시간 리포트 JSON 복사 완료" : "실시간 리포트 JSON 생성 완료");
}

function buildOfflineStatus(prefix, summary) {
  if (!summary || summary.appliedOfflineSec <= 0) {
    return `${prefix}: 오프라인 정산 없음`;
  }
  const auto = summary.autoSummary;
  const warmupLabelKo = buildOfflineWarmupTelemetryLabelKo(summary);
  const warmupText =
    warmupLabelKo === "워밍업 없음" ? "" : ` · ${warmupLabelKo}`;
  const maxOfflineHours = Math.floor((summary.maxOfflineSec || 0) / 3600);
  const capText = summary.cappedByMaxOffline ? ` · ${maxOfflineHours}시간 cap 적용` : "";
  const blockedLabel = buildAutoBreakthroughBlockSummaryLabelKo(auto);
  const blockedText = blockedLabel ? ` · ${blockedLabel}` : "";
  const pausedReasonLabel = String(auto?.autoBreakthroughPauseReasonLabelKo || "정책");
  const pausedNextActionKo = String(auto?.autoBreakthroughPauseNextActionKo || "");
  const pausedText = auto?.autoBreakthroughPaused
    ? ` · 자동돌파 일시정지(${pausedReasonLabel}${pausedNextActionKo ? ` · ${pausedNextActionKo}` : ""})`
    : "";
  return `${prefix}: ${fmtDurationSec(summary.appliedOfflineSec)} 정산 (전투 ${auto?.battles ?? 0}회 · 돌파 ${auto?.breakthroughs ?? 0}회${warmupText}${blockedText}${pausedText} · 환생 ${auto?.rebirths ?? 0}회${capText})`;
}

function getCurrentSpeedTuning() {
  return resolveLoopTuningFromBattleSpeed(state.settings.battleSpeed);
}

function isRealtimeAutoRunning() {
  return realtimeAutoTimer !== null;
}

function resetRealtimeAutoSession() {
  const currency = captureCurrentCurrencies();
  const stats = getRealtimeStats();
  stats.sessionStartedAtIso = "";
  stats.timelineSec = 0;
  stats.autoBreakthroughWarmupUntilTimelineSec = 0;
  stats.elapsedSec = 0;
  stats.battles = 0;
  stats.breakthroughs = 0;
  stats.rebirths = 0;
  stats.anchorQi = currency.qi;
  stats.anchorSpiritCoin = currency.spiritCoin;
  stats.anchorRebirthEssence = currency.rebirthEssence;
  realtimePersistTicks = 0;
  realtimePolicyBlockAccum = 0;
  realtimeNoQiBlockAccum = 0;
  realtimeTribulationSettingBlockAccum = 0;
  realtimePolicyReasonAccum = createEmptyPolicyBlockReasonSummary();
}

function syncRealtimeAutoControls() {
  const stats = getRealtimeStats();
  const running = isRealtimeAutoRunning();
  const warmupRemainingSec = getAutoBreakthroughWarmupRemainingSec(stats);
  const warmupText =
    running && warmupRemainingSec > 0
      ? ` · 돌파 워밍업 ${warmupRemainingSec}s`
      : "";
  const realtimeLabel = running
    ? `진행 중 · ${fmtDurationSec(stats.elapsedSec)}${warmupText}`
    : "중지";
  dom.btnRealtimeAuto.textContent = running ? "실시간 자동 중지" : "실시간 자동 시작";
  dom.realtimeAutoStatus.textContent = realtimeLabel;
  if (dom.actionsPanel) {
    dom.actionsPanel.dataset.realtimeRunning = String(running);
    dom.actionsPanel.dataset.realtimeLabel = realtimeLabel;
    dom.actionsPanel.dataset.realtimeWarmupRemaining = String(
      Math.max(0, warmupRemainingSec),
    );
  }
  syncActionsPanelButtonContract();
}

function renderRealtimeSummary() {
  const stats = getRealtimeStats();
  const elapsedLabel = fmtDurationSec(stats.elapsedSec);
  const battlesLabel = fmtNumber(stats.battles);
  const breakthroughsLabel = fmtNumber(stats.breakthroughs);
  const rebirthsLabel = fmtNumber(stats.rebirths);
  const battlesDisplayLabel = `${battlesLabel}회`;
  const breakthroughsDisplayLabel = `${breakthroughsLabel}회`;
  const rebirthsDisplayLabel = `${rebirthsLabel}회`;
  dom.realtimeElapsed.textContent = elapsedLabel;
  dom.realtimeBattles.textContent = battlesDisplayLabel;
  dom.realtimeBreakthroughs.textContent = breakthroughsDisplayLabel;
  dom.realtimeRebirths.textContent = rebirthsDisplayLabel;
  if (dom.actionsPanel) {
    dom.actionsPanel.dataset.realtimeElapsed = elapsedLabel;
    dom.actionsPanel.dataset.realtimeBattles = battlesLabel;
    dom.actionsPanel.dataset.realtimeBreakthroughs = breakthroughsLabel;
    dom.actionsPanel.dataset.realtimeRebirths = rebirthsLabel;
    dom.actionsPanel.dataset.realtimeBattlesLabel = battlesDisplayLabel;
    dom.actionsPanel.dataset.realtimeBreakthroughsLabel =
      breakthroughsDisplayLabel;
    dom.actionsPanel.dataset.realtimeRebirthsLabel = rebirthsDisplayLabel;
  }
}

function stopRealtimeAuto(reason = "중지") {
  if (!isRealtimeAutoRunning()) {
    syncRealtimeAutoControls();
    return;
  }
  window.clearInterval(realtimeAutoTimer);
  realtimeAutoTimer = null;
  if (realtimePersistTicks > 0) {
    persistLocal();
    realtimePersistTicks = 0;
  }
  const stats = getRealtimeStats();
  addClientLog(
    "auto",
    `실시간 자동 종료(${reason}): ${fmtDurationSec(stats.elapsedSec)} · 전투 ${stats.battles}회 · 돌파 ${stats.breakthroughs}회 · 환생 ${stats.rebirths}회`,
  );
  setStatus(
    `실시간 자동 종료: ${fmtDurationSec(stats.elapsedSec)} 진행`,
  );
  syncRealtimeAutoControls();
}

function runRealtimeAutoTick() {
  const tuning = getCurrentSpeedTuning();
  const stats = getRealtimeStats();
  const warmupRemainingSecBefore = getAutoBreakthroughWarmupRemainingSec(stats);
  const summary = runAutoSliceSeconds(context, state, rng, {
    seconds: 1,
    battleEverySec: tuning.battleEverySec,
    breakthroughEverySec: tuning.breakthroughEverySec,
    passiveQiRatio: tuning.passiveQiRatio,
    collectEvents: true,
    maxCollectedEvents: 8,
    suppressLogs: true,
    timelineOffsetSec: stats.timelineSec,
    autoBreakthroughWarmupUntilSec: Math.max(
      0,
      Math.floor(Number(stats.autoBreakthroughWarmupUntilTimelineSec) || 0),
    ),
  });
  stats.timelineSec += 1;
  realtimePersistTicks += 1;
  stats.elapsedSec += 1;
  stats.battles += summary.battles;
  stats.breakthroughs += summary.breakthroughs;
  stats.rebirths += summary.rebirths;
  realtimePolicyBlockAccum += summary.breakthroughPolicyBlocks;
  realtimeNoQiBlockAccum += Math.max(0, Number(summary.breakthroughNoQiBlocks) || 0);
  realtimeTribulationSettingBlockAccum += Math.max(
    0,
    Number(summary.breakthroughTribulationSettingBlocks) || 0,
  );
  accumulatePolicyBlockReasonSummary(
    realtimePolicyReasonAccum,
    summary.breakthroughPolicyBlockReasons,
  );

  if (stats.elapsedSec % 10 === 0) {
    const reasonText = formatPolicyBlockReasonSummary(realtimePolicyReasonAccum);
    const blockedParts = [];
    if (realtimePolicyBlockAccum > 0) {
      blockedParts.push(
        `위험 차단 ${realtimePolicyBlockAccum}회${
          reasonText ? `(${reasonText})` : ""
        }`,
      );
    }
    if (realtimeNoQiBlockAccum > 0) {
      blockedParts.push(`기 부족 차단 ${realtimeNoQiBlockAccum}회`);
    }
    if (realtimeTribulationSettingBlockAccum > 0) {
      blockedParts.push(`도겁 설정 차단 ${realtimeTribulationSettingBlockAccum}회`);
    }
    addClientLog(
      "auto",
      `실시간 자동 ${fmtDurationSec(stats.elapsedSec)} 누적 (전투 ${stats.battles}회 · 돌파 ${stats.breakthroughs}회 · ${
        blockedParts.length > 0 ? blockedParts.join(" · ") : "차단 0회"
      } · 환생 ${stats.rebirths}회)`,
    );
    realtimePolicyBlockAccum = 0;
    realtimeNoQiBlockAccum = 0;
    realtimeTribulationSettingBlockAccum = 0;
    realtimePolicyReasonAccum = createEmptyPolicyBlockReasonSummary();
  }

  if (summary.autoBreakthroughPaused) {
    const reasonLabel = String(summary.autoBreakthroughPauseReasonLabelKo || "정책");
    const nextActionKo = String(summary.autoBreakthroughPauseNextActionKo || "");
    const nextActionText = nextActionKo ? ` · ${nextActionKo}` : "";
    addClientLog(
      "auto",
      `실시간 자동: 자동 돌파 일시정지 (${reasonLabel})${nextActionText}`,
    );
    setStatus(`실시간 자동: 자동 돌파 일시정지 (${reasonLabel})${nextActionText}`, true);
  }

  if (
    summary.battles > 0 ||
    summary.breakthroughs > 0 ||
    summary.rebirths > 0 ||
    summary.breakthroughPolicyBlocks > 0 ||
    summary.breakthroughNoQiBlocks > 0 ||
    summary.breakthroughTribulationSettingBlocks > 0 ||
    (Array.isArray(summary.collectedEvents) && summary.collectedEvents.length > 0) ||
    summary.autoBreakthroughPaused
  ) {
    playBattleSceneAutoSummary(summary, "실시간 자동");
  }

  const warmupRemainingSecAfter = getAutoBreakthroughWarmupRemainingSec(stats);
  if (
    warmupRemainingSecBefore > 0 &&
    warmupRemainingSecAfter === 0 &&
    state.settings.autoBreakthrough
  ) {
    addClientLog("auto", "실시간 자동: 돌파 워밍업 종료");
  }

  if (realtimePersistTicks >= 3) {
    persistLocal();
    realtimePersistTicks = 0;
  }

  render();
}

function startRealtimeAuto() {
  if (isRealtimeAutoRunning()) {
    return;
  }
  ensureRealtimeAnchor();
  realtimePolicyBlockAccum = 0;
  realtimeNoQiBlockAccum = 0;
  realtimeTribulationSettingBlockAccum = 0;
  realtimePolicyReasonAccum = createEmptyPolicyBlockReasonSummary();
  const tuning = getCurrentSpeedTuning();
  realtimeAutoTimer = window.setInterval(runRealtimeAutoTick, 1000);
  addClientLog("auto", `실시간 자동 시작(${tuning.labelKo})`);
  setStatus(`실시간 자동 시작(${tuning.labelKo})`);
  syncRealtimeAutoControls();
}

function maybeAutoStartRealtime(sourceLabel = "자동 재개") {
  if (!state?.settings?.autoResumeRealtime || document.hidden) {
    return false;
  }
  if (isRealtimeAutoRunning()) {
    return false;
  }
  ensureRealtimeAnchor();
  realtimePolicyBlockAccum = 0;
  realtimeNoQiBlockAccum = 0;
  realtimeTribulationSettingBlockAccum = 0;
  realtimePolicyReasonAccum = createEmptyPolicyBlockReasonSummary();
  const tuning = getCurrentSpeedTuning();
  realtimeAutoTimer = window.setInterval(runRealtimeAutoTick, 1000);
  addClientLog("auto", `실시간 자동 시작(${tuning.labelKo}, ${sourceLabel})`);
  syncRealtimeAutoControls();
  return true;
}

function applyOfflineCatchupNow() {
  const stats = getRealtimeStats();
  const warmupRemainingSecBefore = getAutoBreakthroughWarmupRemainingSec(stats);
  const tuning = getCurrentSpeedTuning();
  const before = {
    qi: state.currencies.qi,
    spiritCoin: state.currencies.spiritCoin,
    rebirthEssence: state.currencies.rebirthEssence,
  };
  const result = runOfflineCatchup(context, state, rng, {
    nowEpochMs: Date.now(),
    maxOfflineHours: state.settings.offlineCapHours,
    maxCollectedEvents: state.settings.offlineEventLimit,
    battleEverySec: tuning.battleEverySec,
    breakthroughEverySec: tuning.breakthroughEverySec,
    passiveQiRatio: tuning.passiveQiRatio,
    autoBreakthroughWarmupUntilSec: warmupRemainingSecBefore,
    syncAnchorToNow: true,
  });
  const warmupTelemetry = resolveOfflineWarmupTelemetry(result.summary);
  const warmupRemainingSecAfter = warmupTelemetry.after;
  stats.autoBreakthroughWarmupUntilTimelineSec = Math.max(
    0,
    Math.floor(Number(stats.timelineSec) || 0) + warmupRemainingSecAfter,
  );
  if (
    warmupRemainingSecBefore > 0 &&
    warmupRemainingSecAfter === 0 &&
    state.settings.autoBreakthrough
  ) {
    addClientLog("auto", "오프라인 정산: 돌파 워밍업 종료");
  }
  playBattleSceneOfflineSummary({
    summary: result.summary,
    delta: {
      qi: state.currencies.qi - before.qi,
      spiritCoin: state.currencies.spiritCoin - before.spiritCoin,
      rebirthEssence: state.currencies.rebirthEssence - before.rebirthEssence,
    },
    events: Array.isArray(result.summary.autoSummary?.collectedEvents)
      ? result.summary.autoSummary.collectedEvents
      : [],
  });
  return {
    summary: result.summary,
    delta: {
      qi: state.currencies.qi - before.qi,
      spiritCoin: state.currencies.spiritCoin - before.spiritCoin,
      rebirthEssence: state.currencies.rebirthEssence - before.rebirthEssence,
    },
    events: Array.isArray(result.summary.autoSummary?.collectedEvents)
      ? result.summary.autoSummary.collectedEvents
      : [],
  };
}

function applyResumeCatchupIfNeeded(prefix = "백그라운드 복귀") {
  const offline = applyOfflineCatchupNow();
  if (!offline.summary || offline.summary.appliedOfflineSec <= 0) {
    return false;
  }
  showOfflineModal(offline);
  setStatus(buildOfflineStatus(prefix, offline.summary));
  persistLocal();
  render();
  return true;
}

function setDeltaNode(node, value) {
  const amount = Number.isFinite(value) ? Math.floor(value) : 0;
  node.textContent = fmtSignedInteger(amount);
  node.classList.remove("delta-gain", "delta-loss", "delta-neutral");
  if (amount > 0) {
    node.classList.add("delta-gain");
  } else if (amount < 0) {
    node.classList.add("delta-loss");
  } else {
    node.classList.add("delta-neutral");
  }
}

function hideOfflineModal() {
  dom.offlineModal.classList.add("hidden");
  dom.offlineModal.setAttribute("aria-hidden", "true");
  dom.offlineModal.dataset.reportState = "empty";
  dom.offlineModal.dataset.appliedDuration = "0초";
  dom.offlineModal.dataset.rawDuration = "0초";
  dom.offlineModal.dataset.capState = "미적용";
  dom.offlineModal.dataset.warmupSummary = "워밍업 없음";
  dom.offlineModal.dataset.criticalSummary = "핵심 이벤트 없음";
  dom.offlineModal.dataset.battleCount = "0";
  dom.offlineModal.dataset.breakthroughCount = "0";
  dom.offlineModal.dataset.rebirthCount = "0";
  dom.offlineModal.dataset.qiDelta = "+0";
  dom.offlineModal.dataset.spiritDelta = "+0";
  dom.offlineModal.dataset.essenceDelta = "+0";
  dom.offlineModal.dataset.compareCode = "비교 코드 없음";
  dom.offlineModal.dataset.compareResult = "비교 대기 중";
  dom.offlineModal.dataset.compareActionHint = "가이드: 비교 코드를 입력하세요.";
  dom.offlineModal.dataset.compareSource = "출처: 없음";
  dom.offlineModal.dataset.compareCurrentSummary = "현재 코드: 없음";
  dom.offlineModal.dataset.compareTargetSummary = "대상 코드: 없음";
  dom.offlineModal.dataset.compareDeltaSummary = "차이 요약: 대기 중";
  dom.offlineModal.dataset.compareMatchSummary = "일치 요약: 대기 중";
  setOfflineCompareCodeLabel("");
  dom.offlineCompareCodeInput.value = "";
  setOfflineCompareResultState("", "");
  setOfflineCompareActionHint("", "");
  setOfflineCompareSource("none");
  setOfflineCompareCurrentSummary("");
  setOfflineCompareTargetSummary("");
  setOfflineCompareDeltaSummary("", "", true);
  setOfflineCompareMatchSummary("", "", true);
  dom.offlineDetailFilterSummary.textContent = "세부 로그 0건 (전체)";
  dom.offlineDetailHiddenSummary.textContent = "숨김 이벤트 없음";
  dom.offlineDetailHiddenKindsSummary.textContent = "숨김 상세 없음";
  dom.offlineDetailList.dataset.detailMode = "all";
  dom.offlineDetailList.dataset.detailExpanded = "false";
  dom.offlineDetailList.dataset.visibleCount = "0";
  dom.offlineDetailList.dataset.prioritizedCount = "0";
  dom.offlineDetailList.dataset.hiddenCount = "0";
  dom.offlineDetailList.dataset.filterSummary = "세부 로그 0건 (전체)";
  dom.offlineDetailList.dataset.hiddenSummary = "숨김 이벤트 없음";
  dom.offlineDetailList.dataset.hiddenKindsSummary = "숨김 상세 없음";
  dom.offlineDetailList.dataset.emptyLabel = "세부 로그 없음";
  setOfflineDetailCriticalOnly(false);
  setOfflineDetailExpanded(false);
}

function showOfflineModal(offline) {
  if (!offline || offline.summary.appliedOfflineSec <= 0) {
    lastOfflineReport = null;
    hideOfflineModal();
    return;
  }
  const { summary, delta, events } = offline;
  const auto = summary.autoSummary;
  const warmup = resolveOfflineWarmupTelemetry(summary);
  const warmupLabelKo = buildOfflineWarmupTelemetryLabelKo(summary);
  const criticalSummaryLabelKo = buildOfflineDetailCriticalSummaryLabelKo(events);
  const detailReportSnapshot = buildOfflineDetailReportSnapshot(events);
  const appliedDurationLabel = fmtDurationSec(summary.appliedOfflineSec);
  const rawDurationLabel = fmtDurationSec(summary.rawOfflineSec);
  const capStateLabel = summary.cappedByMaxOffline
    ? `${state.settings.offlineCapHours}시간 적용`
    : "미적용";
  const battleCountLabel = String(auto?.battles ?? 0);
  const breakthroughCountLabel = String(auto?.breakthroughs ?? 0);
  const rebirthCountLabel = String(auto?.rebirths ?? 0);
  const qiDeltaLabel = fmtSignedInteger(delta.qi);
  const spiritDeltaLabel = fmtSignedInteger(delta.spiritCoin);
  const essenceDeltaLabel = fmtSignedInteger(delta.rebirthEssence);
  dom.offlineAppliedDuration.textContent = appliedDurationLabel;
  dom.offlineRawDuration.textContent = rawDurationLabel;
  dom.offlineWarmupSummary.textContent = warmupLabelKo;
  dom.offlineCriticalSummary.textContent = criticalSummaryLabelKo;
  dom.offlineCapState.textContent = capStateLabel;
  dom.offlineBattleCount.textContent = `${battleCountLabel}회`;
  dom.offlineBreakthroughCount.textContent = `${breakthroughCountLabel}회`;
  dom.offlineRebirthCount.textContent = `${rebirthCountLabel}회`;
  setDeltaNode(dom.offlineQiDelta, delta.qi);
  setDeltaNode(dom.offlineSpiritDelta, delta.spiritCoin);
  setDeltaNode(dom.offlineEssenceDelta, delta.rebirthEssence);
  dom.offlineModal.dataset.reportState = "ready";
  dom.offlineModal.dataset.appliedDuration = appliedDurationLabel;
  dom.offlineModal.dataset.rawDuration = rawDurationLabel;
  dom.offlineModal.dataset.capState = capStateLabel;
  dom.offlineModal.dataset.warmupSummary = warmupLabelKo;
  dom.offlineModal.dataset.criticalSummary = criticalSummaryLabelKo;
  dom.offlineModal.dataset.battleCount = battleCountLabel;
  dom.offlineModal.dataset.breakthroughCount = breakthroughCountLabel;
  dom.offlineModal.dataset.rebirthCount = rebirthCountLabel;
  dom.offlineModal.dataset.qiDelta = qiDeltaLabel;
  dom.offlineModal.dataset.spiritDelta = spiritDeltaLabel;
  dom.offlineModal.dataset.essenceDelta = essenceDeltaLabel;
  lastOfflineReport = {
    generatedAtIso: new Date().toISOString(),
    playerName: state.playerName,
    stageDifficultyIndex: state.progression.difficultyIndex,
    warmup,
    warmupLabelKo,
    detailReportSnapshot,
    summary,
    delta,
    events,
  };
  dom.offlineCompareCodeInput.value = "";
  setOfflineCompareCodeLabel("");
  setOfflineCompareResultState("", "");
  setOfflineCompareActionHint("", "");
  setOfflineCompareSource("none");
  setOfflineCompareCurrentSummary("");
  setOfflineCompareTargetSummary("");
  setOfflineCompareDeltaSummary("", "", true);
  setOfflineCompareMatchSummary("", "", true);
  setOfflineDetailCriticalOnly(false);
  renderOfflineDetailList(events);
  setOfflineDetailExpanded(false);
  dom.offlineModal.classList.remove("hidden");
  dom.offlineModal.setAttribute("aria-hidden", "false");
}

function persistLocal() {
  try {
    state.lastActiveEpochMs = Date.now();
    window.localStorage.setItem(getActiveStorageKey(), serializeSliceState(state));
    markSlotSummaryDirty();
  } catch (err) {
    setStatus("로컬 저장 실패(브라우저 저장소 제한)", true);
  }
}

function updateLastSavedNow() {
  state.lastSavedAtIso = new Date().toISOString();
}

function renderLogs() {
  const rows = state.logs.length > 0 ? state.logs : [{ at: "-", kind: "info", message: "로그 없음" }];
  const latestRow = rows[0] || { at: "-", kind: "info", message: "로그 없음" };
  if (dom.logsPanel) {
    dom.logsPanel.dataset.logCount = String(state.logs.length);
    dom.logsPanel.dataset.lastLogKind = String(latestRow.kind || "info");
    dom.logsPanel.dataset.lastLogMessage = String(latestRow.message || "로그 없음");
    dom.logsPanel.dataset.lastLogAt = String(latestRow.at || "-");
  }
  dom.eventLogList.innerHTML = rows
    .map((row) => {
      const kind = String(row.kind || "info");
      return `<li class="${kind === "error" ? "error" : ""}">
        <span class="ts">[${row.at}]</span>
        <span class="kind">${kind}</span>
        <span>${row.message}</span>
      </li>`;
    })
    .join("");
}

function render() {
  ensureRealtimeStatsShape();
  const stage = getStage(context, state.progression.difficultyIndex);
  const displayName = getStageDisplayNameKo(context, stage);
  const preview = previewBreakthroughChance(context, state, {
    useBreakthroughElixir: dom.useBreakthroughElixir.checked,
    useTribulationTalisman: dom.useTribulationTalisman.checked,
  });
  const mitigatedPreview = previewBreakthroughChance(context, state, {
    useBreakthroughElixir: true,
    useTribulationTalisman: true,
  });
  const expectedDelta = resolveBreakthroughExpectedDelta(context, state, preview);
  const riskTier = resolveBreakthroughRiskTier(preview);
  const mitigation = resolveBreakthroughMitigationSummary(preview, mitigatedPreview);
  const recommendation = resolveBreakthroughRecommendation(preview, {
    hasBreakthroughElixir: state.inventory.breakthroughElixir > 0,
    hasTribulationTalisman: state.inventory.tribulationTalisman > 0,
    usingBreakthroughElixir: preview.useBreakthroughElixir,
    usingTribulationTalisman: preview.useTribulationTalisman,
    mitigatedPreview,
  });
  const recommendationToggle = resolveBreakthroughRecommendationToggles(preview, {
    hasBreakthroughElixir: state.inventory.breakthroughElixir > 0,
    hasTribulationTalisman: state.inventory.tribulationTalisman > 0,
    currentUseBreakthroughElixir: dom.useBreakthroughElixir.checked,
    currentUseTribulationTalisman: dom.useTribulationTalisman.checked,
  });
  const autoResumePolicy = resolveAutoBreakthroughResumePolicy(context, state);
  if (dom.breakthroughPreviewPanel) {
    dom.breakthroughPreviewPanel.dataset.riskTier = riskTier.tier;
    dom.breakthroughPreviewPanel.dataset.riskTone = riskTier.tone;
    dom.breakthroughPreviewPanel.dataset.riskLabel = riskTier.labelKo || "-";
    dom.breakthroughPreviewPanel.dataset.riskDescription =
      riskTier.descriptionKo || "-";
    dom.breakthroughPreviewPanel.dataset.expectedKey = expectedDelta.burdenTier || "none";
    dom.breakthroughPreviewPanel.dataset.expectedTone = expectedDelta.tone;
    dom.breakthroughPreviewPanel.dataset.expectedLabel = expectedDelta.labelKo || "-";
    dom.breakthroughPreviewPanel.dataset.mitigationKey = mitigation.key || "none";
    dom.breakthroughPreviewPanel.dataset.mitigationTone = mitigation.tone;
    dom.breakthroughPreviewPanel.dataset.mitigationLabel = mitigation.labelKo || "-";
    dom.breakthroughPreviewPanel.dataset.mitigationMessage =
      mitigation.messageKo || "-";
    dom.breakthroughPreviewPanel.dataset.recommendationKey = recommendation.key || "none";
    dom.breakthroughPreviewPanel.dataset.recommendationTone = recommendation.tone;
    dom.breakthroughPreviewPanel.dataset.recommendationLabel = recommendation.labelKo || "-";
    dom.breakthroughPreviewPanel.dataset.recommendationMessage =
      recommendation.messageKo || "-";
    dom.breakthroughPreviewPanel.dataset.autoResumeReason = autoResumePolicy.reason || "none";
    dom.breakthroughPreviewPanel.dataset.autoResumeTone = autoResumePolicy.tone;
    dom.breakthroughPreviewPanel.dataset.autoResumeLabel = autoResumePolicy.labelKo || "-";
    dom.breakthroughPreviewPanel.dataset.autoResumeMessage =
      autoResumePolicy.messageKo || "-";
    dom.breakthroughPreviewPanel.dataset.successPct = preview.successPct.toFixed(1);
    dom.breakthroughPreviewPanel.dataset.deathPct = preview.deathPct.toFixed(1);
    dom.breakthroughPreviewPanel.dataset.minorFailPct = preview.minorFailPct.toFixed(1);
    dom.breakthroughPreviewPanel.dataset.retreatFailPct = preview.retreatFailPct.toFixed(1);
    dom.breakthroughPreviewPanel.dataset.deathInFailPct = preview.deathInFailurePct.toFixed(1);
    dom.breakthroughPreviewPanel.dataset.expectedQiDelta = fmtSignedInteger(expectedDelta.expectedQiDelta);
    dom.breakthroughPreviewPanel.dataset.expectedEssenceDelta = fmtSignedFixed(
      expectedDelta.expectedRebirthEssenceDelta,
      1,
    );
    dom.breakthroughPreviewPanel.dataset.expectedDifficultyDelta = fmtSignedFixed(
      expectedDelta.expectedDifficultyDelta,
    );
    dom.breakthroughPreviewPanel.dataset.breakthroughElixirCount = fmtNumber(
      state.inventory.breakthroughElixir,
    );
    dom.breakthroughPreviewPanel.dataset.tribulationTalismanCount = fmtNumber(
      state.inventory.tribulationTalisman,
    );
    dom.breakthroughPreviewPanel.dataset.hasBreakthroughElixir = String(
      (Number(state.inventory.breakthroughElixir) || 0) > 0,
    );
    dom.breakthroughPreviewPanel.dataset.hasTribulationTalisman = String(
      (Number(state.inventory.tribulationTalisman) || 0) > 0,
    );
    dom.breakthroughPreviewPanel.dataset.useBreakthroughElixir = String(
      dom.useBreakthroughElixir.checked,
    );
    dom.breakthroughPreviewPanel.dataset.useTribulationTalisman = String(
      dom.useTribulationTalisman.checked,
    );
    dom.breakthroughPreviewPanel.dataset.recommendationReason =
      recommendationToggle.reason || "none";
    dom.breakthroughPreviewPanel.dataset.recommendationToggleMessage =
      recommendationToggle.messageKo || "-";
    dom.breakthroughPreviewPanel.dataset.nextElixir = String(
      recommendationToggle.nextUseBreakthroughElixir,
    );
    dom.breakthroughPreviewPanel.dataset.nextTalisman = String(
      recommendationToggle.nextUseTribulationTalisman,
    );
    dom.breakthroughPreviewPanel.dataset.missingElixir = String(
      recommendationToggle.missingBreakthroughElixir,
    );
    dom.breakthroughPreviewPanel.dataset.missingTalisman = String(
      recommendationToggle.missingTribulationTalisman,
    );
    dom.breakthroughPreviewPanel.dataset.autoResumeRiskTier =
      autoResumePolicy.riskTier?.tier || "none";
    dom.breakthroughPreviewPanel.dataset.autoResumeNextBreakthrough = String(
      autoResumePolicy.shouldEnableAutoBreakthrough,
    );
    dom.breakthroughPreviewPanel.dataset.autoResumeNextTribulation = String(
      autoResumePolicy.shouldEnableAutoTribulation,
    );
    dom.breakthroughPreviewPanel.dataset.autoResumeActionLabel =
      autoResumePolicy.actionLabelKo || "-";
    dom.breakthroughPreviewPanel.dataset.recommendationChanged = String(recommendationToggle.changed);
    dom.breakthroughPreviewPanel.dataset.autoResumeActionable = String(autoResumePolicy.actionable);
  }
  const stageWorldKey = normalizeBattleSceneWorld(stage.world);
  const stageTier = resolveBattleSceneTier(stage);
  const breakthroughReady =
    (Number(state.currencies.qi) || 0) >= (Number(stage.qi_required) || 0);

  if (dom.stagePanel) {
    dom.stagePanel.dataset.stageName = String(displayName || "-");
    dom.stagePanel.dataset.stageKey = `${stageWorldKey}_${stageTier}`;
    dom.stagePanel.dataset.worldLabel = String(worldKo(stage.world) || "-");
    dom.stagePanel.dataset.worldKey = stageWorldKey;
    dom.stagePanel.dataset.stageTier = stageTier;
    dom.stagePanel.dataset.breakthroughReady = String(breakthroughReady);
  }

  dom.stageDisplay.textContent = displayName;
  dom.stageDisplay.dataset.stageName = String(displayName || "-");
  dom.stageDisplay.dataset.stageKey = `${stageWorldKey}_${stageTier}`;
  dom.worldTag.textContent = worldKo(stage.world);
  dom.worldTag.dataset.worldLabel = String(worldKo(stage.world) || "-");
  dom.worldTag.dataset.worldKey = stageWorldKey;
  dom.difficultyIndex.textContent = String(stage.difficulty_index);
  dom.difficultyIndex.dataset.difficultyIndex = String(stage.difficulty_index);
  dom.difficultyIndex.dataset.stageTier = stageTier;
  dom.qiRequired.textContent = fmtNumber(stage.qi_required);
  dom.qiRequired.dataset.qiRequired = fmtNumber(stage.qi_required);
  dom.qiRequired.dataset.requiredState = breakthroughReady ? "ready" : "gated";
  dom.statQi.textContent = fmtNumber(state.currencies.qi);
  dom.statSpiritCoin.textContent = fmtNumber(state.currencies.spiritCoin);
  dom.statRebirthEssence.textContent = fmtNumber(state.currencies.rebirthEssence);
  dom.statRebirthCount.textContent = fmtNumber(state.progression.rebirthCount);
  if (dom.statsPanel) {
    const qiLabel = `${fmtNumber(state.currencies.qi)} 기`;
    const spiritCoinLabel = `${fmtNumber(state.currencies.spiritCoin)} 영석`;
    const rebirthEssenceLabel = `${fmtNumber(state.currencies.rebirthEssence)} 환생정수`;
    const rebirthCountLabel = `${fmtNumber(state.progression.rebirthCount)}회`;
    dom.statsPanel.dataset.qi = fmtNumber(state.currencies.qi);
    dom.statsPanel.dataset.spiritCoin = fmtNumber(state.currencies.spiritCoin);
    dom.statsPanel.dataset.rebirthEssence = fmtNumber(state.currencies.rebirthEssence);
    dom.statsPanel.dataset.rebirthCount = fmtNumber(state.progression.rebirthCount);
    dom.statsPanel.dataset.qiLabel = qiLabel;
    dom.statsPanel.dataset.spiritCoinLabel = spiritCoinLabel;
    dom.statsPanel.dataset.rebirthEssenceLabel = rebirthEssenceLabel;
    dom.statsPanel.dataset.rebirthCountLabel = rebirthCountLabel;
  }
  dom.invBreakthroughElixir.textContent = fmtNumber(state.inventory.breakthroughElixir);
  dom.invTribulationTalisman.textContent = fmtNumber(state.inventory.tribulationTalisman);
  dom.previewSuccessPct.textContent = preview.successPct.toFixed(1);
  dom.previewSuccessPct.dataset.pct = preview.successPct.toFixed(1);
  dom.previewDeathPct.textContent = preview.deathPct.toFixed(1);
  dom.previewDeathPct.dataset.pct = preview.deathPct.toFixed(1);
  dom.previewMinorFailPct.textContent = preview.minorFailPct.toFixed(1);
  dom.previewMinorFailPct.dataset.pct = preview.minorFailPct.toFixed(1);
  dom.previewRetreatFailPct.textContent = preview.retreatFailPct.toFixed(1);
  dom.previewRetreatFailPct.dataset.pct = preview.retreatFailPct.toFixed(1);
  dom.previewDeathInFailPct.textContent = preview.deathInFailurePct.toFixed(1);
  dom.previewDeathInFailPct.dataset.pct = preview.deathInFailurePct.toFixed(1);
  dom.previewExpectedLabel.textContent = expectedDelta.labelKo;
  dom.previewExpectedLabel.title = "1회 돌파 시도 기준 기대값";
  dom.previewExpectedLabel.dataset.tone = expectedDelta.tone;
  dom.previewExpectedLabel.dataset.expectedKey = expectedDelta.burdenTier || "none";
  dom.previewExpectedQiDelta.textContent = fmtSignedInteger(expectedDelta.expectedQiDelta);
  dom.previewExpectedQiDelta.dataset.value = fmtSignedInteger(expectedDelta.expectedQiDelta);
  dom.previewExpectedEssenceDelta.textContent = fmtSignedFixed(
    expectedDelta.expectedRebirthEssenceDelta,
    1,
  );
  dom.previewExpectedEssenceDelta.dataset.value = fmtSignedFixed(
    expectedDelta.expectedRebirthEssenceDelta,
    1,
  );
  dom.previewExpectedDifficultyDelta.textContent = fmtSignedFixed(
    expectedDelta.expectedDifficultyDelta,
  );
  dom.previewExpectedDifficultyDelta.dataset.value = fmtSignedFixed(
    expectedDelta.expectedDifficultyDelta,
  );
  applyRiskTone(dom.previewExpectedLabel, expectedDelta.tone);
  dom.previewRiskLabel.textContent = riskTier.labelKo;
  dom.previewRiskLabel.title = riskTier.descriptionKo;
  dom.previewRiskLabel.dataset.tone = riskTier.tone;
  dom.previewRiskLabel.dataset.riskTier = riskTier.tier;
  applyRiskTone(dom.previewRiskLabel, riskTier.tone);
  dom.previewMitigationLabel.textContent = mitigation.labelKo;
  dom.previewMitigationLabel.title = mitigation.messageKo;
  dom.previewMitigationLabel.dataset.tone = mitigation.tone;
  dom.previewMitigationLabel.dataset.mitigationKey = mitigation.key || "none";
  dom.previewMitigationHint.textContent = mitigation.messageKo;
  dom.previewMitigationHint.dataset.tone = mitigation.tone;
  dom.previewMitigationHint.dataset.mitigationKey = mitigation.key || "none";
  applyRiskTone(dom.previewMitigationLabel, mitigation.tone);
  applyRiskTone(dom.previewMitigationHint, mitigation.tone);
  dom.previewRecommendationLabel.textContent = recommendation.labelKo;
  dom.previewRecommendationLabel.title = recommendation.messageKo;
  dom.previewRecommendationLabel.dataset.tone = recommendation.tone;
  dom.previewRecommendationLabel.dataset.recommendationKey = recommendation.key || "none";
  dom.previewRecommendationHint.textContent = recommendation.messageKo;
  dom.previewRecommendationHint.dataset.tone = recommendation.tone;
  dom.previewRecommendationHint.dataset.recommendationKey = recommendation.key || "none";
  applyRiskTone(dom.previewRecommendationLabel, recommendation.tone);
  applyRiskTone(dom.previewRecommendationHint, recommendation.tone);
  dom.btnApplyRecommendation.disabled = !recommendationToggle.changed;
  dom.btnApplyRecommendation.title = recommendationToggle.messageKo;
  dom.btnApplyRecommendation.dataset.tone = recommendation.tone;
  dom.btnApplyRecommendation.dataset.recommendationReason = recommendationToggle.reason || "none";
  dom.btnApplyRecommendation.dataset.changed = String(recommendationToggle.changed);
  dom.btnApplyRecommendation.dataset.nextElixir = String(recommendationToggle.nextUseBreakthroughElixir);
  dom.btnApplyRecommendation.dataset.nextTalisman = String(recommendationToggle.nextUseTribulationTalisman);
  dom.btnApplyRecommendation.dataset.missingElixir = String(recommendationToggle.missingBreakthroughElixir);
  dom.btnApplyRecommendation.dataset.missingTalisman = String(recommendationToggle.missingTribulationTalisman);
  dom.autoBreakthroughResumeLabel.textContent = autoResumePolicy.labelKo;
  dom.autoBreakthroughResumeLabel.title = autoResumePolicy.messageKo;
  dom.autoBreakthroughResumeLabel.dataset.tone = autoResumePolicy.tone;
  dom.autoBreakthroughResumeLabel.dataset.policyReason = autoResumePolicy.reason;
  dom.autoBreakthroughResumeLabel.dataset.riskTier = autoResumePolicy.riskTier?.tier || "none";
  dom.autoBreakthroughResumeHint.textContent = autoResumePolicy.messageKo;
  dom.autoBreakthroughResumeHint.dataset.tone = autoResumePolicy.tone;
  dom.autoBreakthroughResumeHint.dataset.policyReason = autoResumePolicy.reason;
  dom.autoBreakthroughResumeHint.dataset.riskTier = autoResumePolicy.riskTier?.tier || "none";
  applyRiskTone(dom.autoBreakthroughResumeLabel, autoResumePolicy.tone);
  applyRiskTone(dom.autoBreakthroughResumeHint, autoResumePolicy.tone);
  dom.btnResumeAutoBreakthrough.disabled = !autoResumePolicy.actionable;
  dom.btnResumeAutoBreakthrough.title = autoResumePolicy.messageKo;
  dom.btnResumeAutoBreakthrough.textContent = autoResumePolicy.actionLabelKo;
  dom.btnResumeAutoBreakthrough.dataset.policyReason = autoResumePolicy.reason;
  dom.btnResumeAutoBreakthrough.dataset.actionable = String(autoResumePolicy.actionable);
  dom.btnResumeAutoBreakthrough.dataset.riskTier = autoResumePolicy.riskTier?.tier || "none";
  dom.btnResumeAutoBreakthrough.dataset.nextBreakthrough = String(
    autoResumePolicy.shouldEnableAutoBreakthrough,
  );
  dom.btnResumeAutoBreakthrough.dataset.nextTribulation = String(
    autoResumePolicy.shouldEnableAutoTribulation,
  );
  dom.btnResumeAutoBreakthrough.dataset.actionLabel = autoResumePolicy.actionLabelKo || "-";
  dom.playerNameInput.value = state.playerName;
  dom.optSaveSlot.value = String(activeSaveSlot);
  dom.lastSavedAt.textContent = fmtDateTimeFromIso(state.lastSavedAtIso);
  dom.lastActiveAt.textContent = fmtDateTimeFromEpochMs(state.lastActiveEpochMs);
  if (dom.savePanel) {
    dom.savePanel.dataset.lastSavedAt = fmtDateTimeFromIso(state.lastSavedAtIso);
    dom.savePanel.dataset.lastActiveAt = fmtDateTimeFromEpochMs(state.lastActiveEpochMs);
  }
  renderBattleScene(stage, displayName);
  renderBattleSfxControl();
  renderBattleHapticControl();

  const qiCurrent = Number(state.currencies.qi) || 0;
  const qiRequiredValue = Math.max(0, Number(stage.qi_required) || 0);
  const qiRatio = clampPercent((qiCurrent / Math.max(1, qiRequiredValue)) * 100);
  const qiProgressKey =
    qiCurrent <= 0
      ? "empty"
      : qiCurrent > qiRequiredValue
        ? "surplus"
        : breakthroughReady
          ? "ready"
          : "charging";
  if (dom.stagePanel) {
    dom.stagePanel.dataset.difficultyIndex = String(stage.difficulty_index);
    dom.stagePanel.dataset.qiCurrent = fmtNumber(state.currencies.qi);
    dom.stagePanel.dataset.qiRequired = fmtNumber(stage.qi_required);
    dom.stagePanel.dataset.requiredState = breakthroughReady ? "ready" : "gated";
    dom.stagePanel.dataset.qiPct = String(qiRatio);
    dom.stagePanel.dataset.progressKey = qiProgressKey;
  }
  dom.qiProgressBar.style.width = `${qiRatio}%`;
  dom.qiProgressBar.dataset.qiPct = String(qiRatio);
  dom.qiProgressBar.dataset.qiCurrent = fmtNumber(state.currencies.qi);
  dom.qiProgressBar.dataset.qiRequired = fmtNumber(stage.qi_required);
  dom.qiProgressBar.dataset.breakthroughReady = String(breakthroughReady);
  dom.qiProgressBar.dataset.progressKey = qiProgressKey;

  dom.optAutoBattle.checked = state.settings.autoBattle;
  dom.optAutoBreakthrough.checked = state.settings.autoBreakthrough;
  dom.optAutoTribulation.checked = state.settings.autoTribulation;
  dom.optAutoResumeRealtime.checked = state.settings.autoResumeRealtime;
  dom.optLowPerformanceBattleScene.checked = state.settings.lowPerformanceBattleScene === true;
  const autoBattleLabel = `자동 전투 ${state.settings.autoBattle ? "ON" : "OFF"}`;
  const autoBreakthroughLabel =
    `자동 돌파 ${state.settings.autoBreakthrough ? "ON" : "OFF"}`;
  const autoTribulationLabel =
    `자동 도겁 허용 ${state.settings.autoTribulation ? "ON" : "OFF"}`;
  const autoResumeRealtimeLabel =
    `앱 복귀 시 실시간 자동 재개 ${
      state.settings.autoResumeRealtime ? "ON" : "OFF"
    }`;
  const lowPerformanceBattleSceneLabel =
    `전투 연출 저사양 모드 ${
      state.settings.lowPerformanceBattleScene === true ? "ON" : "OFF"
    }`;
  const configuredWarmupSec = getConfiguredAutoBreakthroughResumeWarmupSec();
  const battleSpeedValue = String(state.settings.battleSpeed);
  const offlineCapHoursValue = String(state.settings.offlineCapHours);
  const offlineEventLimitValue = String(state.settings.offlineEventLimit);
  const battleSpeedLabel =
    dom.optBattleSpeed?.selectedOptions?.[0]?.textContent?.trim() || "표준";
  const warmupLabel = `${configuredWarmupSec}초`;
  const offlineCapLabel = `${offlineCapHoursValue}시간`;
  const offlineEventLimitLabel = `${offlineEventLimitValue}건`;
  dom.optAutoBreakthroughResumeWarmupSec.value = String(configuredWarmupSec);
  dom.optBattleSpeed.value = battleSpeedValue;
  dom.optOfflineCapHours.value = offlineCapHoursValue;
  dom.optOfflineEventLimit.value = offlineEventLimitValue;
  if (dom.settingsPanel) {
    dom.settingsPanel.dataset.autoBattle = String(state.settings.autoBattle);
    dom.settingsPanel.dataset.autoBattleLabel = autoBattleLabel;
    dom.settingsPanel.dataset.autoBreakthrough = String(
      state.settings.autoBreakthrough,
    );
    dom.settingsPanel.dataset.autoBreakthroughLabel = autoBreakthroughLabel;
    dom.settingsPanel.dataset.autoTribulation = String(
      state.settings.autoTribulation,
    );
    dom.settingsPanel.dataset.autoTribulationLabel = autoTribulationLabel;
    dom.settingsPanel.dataset.autoResumeRealtime = String(
      state.settings.autoResumeRealtime,
    );
    dom.settingsPanel.dataset.autoResumeRealtimeLabel = autoResumeRealtimeLabel;
    dom.settingsPanel.dataset.lowPerformanceBattleScene = String(
      state.settings.lowPerformanceBattleScene === true,
    );
    dom.settingsPanel.dataset.lowPerformanceBattleSceneLabel =
      lowPerformanceBattleSceneLabel;
    dom.settingsPanel.dataset.autoBreakthroughResumeWarmupSec = String(
      configuredWarmupSec,
    );
    dom.settingsPanel.dataset.battleSpeed = battleSpeedValue;
    dom.settingsPanel.dataset.offlineCapHours = offlineCapHoursValue;
    dom.settingsPanel.dataset.offlineEventLimit = offlineEventLimitValue;
    dom.settingsPanel.dataset.autoBreakthroughResumeWarmupLabel = warmupLabel;
    dom.settingsPanel.dataset.battleSpeedLabel = battleSpeedLabel;
    dom.settingsPanel.dataset.offlineCapLabel = offlineCapLabel;
    dom.settingsPanel.dataset.offlineEventLimitLabel = offlineEventLimitLabel;
  }
  syncCopySlotTargetSelection();
  syncSlotActionButtons();
  renderLogs();
  renderSaveSlotSummary();
  renderRealtimeSummary();
  syncRealtimeAutoControls();
  startBattleSceneAmbientLoop();
}

function tryLoadActiveSlot(sourceLabel = "로컬 불러오기") {
  const payload = readActiveSlotPayload();
  const raw = payload.raw;
  if (!raw) {
    setStatus(`슬롯 ${activeSaveSlot} 저장 데이터가 없음`, true);
    return false;
  }
  try {
    stopRealtimeAuto(sourceLabel);
    resetRealtimeAutoSession();
    state = parseSliceState(raw, context);
    ensureRealtimeStatsShape();
    resetBattleSceneDuelState({ clearTicker: true });
    addClientLog(
      "save",
      `${sourceLabel}: 슬롯 ${activeSaveSlot} 불러오기 완료${payload.source === "legacy" ? " (legacy)" : ""}`,
    );
    const offline = applyOfflineCatchupNow();
    setStatus(
      buildOfflineStatus(
        `${sourceLabel}(슬롯 ${activeSaveSlot})`,
        offline.summary,
      ),
    );
    showOfflineModal(offline);
    persistLocal();
    render();
    maybeAutoStartRealtime(sourceLabel);
    return true;
  } catch (err) {
    setStatus(err instanceof Error ? err.message : "불러오기 실패", true);
    return false;
  }
}

function handleSlotSummaryQuickAction(event, triggerLabel) {
  const element = event.target;
  if (!(element instanceof Element)) {
    return;
  }
  const row = element.closest("li[data-slot]");
  if (!row) {
    return;
  }
  const selectedSlot = normalizeSaveSlot(row.getAttribute("data-slot"), activeSaveSlot);
  const selectedState = normalizeSlotSummaryState(row.getAttribute("data-state"), "empty");
  const action = resolveSlotSummaryQuickAction(
    activeSaveSlot,
    selectedSlot,
    selectedState,
  );

  if (action.shouldLoad) {
    if (action.changedSlot) {
      const confirmed = window.confirm(
        buildSlotActionConfirmMessage("슬롯 불러오기", [
          `대상: 슬롯 ${action.nextActiveSlot} (${resolveSlotSummaryStateLabelKo(action.selectedState)})`,
          "현재 메모리 상태를 대체하여 불러옵니다.",
          "계속할까요?",
        ]),
      );
      if (!confirmed) {
        setStatus(`슬롯 ${action.nextActiveSlot} 불러오기 취소`);
        render();
        return;
      }
    }
    if (!tryConsumeSlotQuickLoadDebounce()) {
      render();
      return;
    }
    if (action.changedSlot) {
      setActiveSaveSlot(action.nextActiveSlot, { persistPref: true });
    }
    tryLoadActiveSlot(`슬롯 요약 ${triggerLabel}`);
    return;
  }

  if (action.changedSlot) {
    setActiveSaveSlot(action.nextActiveSlot, { persistPref: true });
  }

  if (action.actionKind === "switch_corrupt") {
    setStatus(`슬롯 ${activeSaveSlot} 저장 데이터가 손상되어 불러오기 불가`, true);
    render();
    return;
  }

  if (action.actionKind === "switch_empty") {
    setStatus(`세이브 슬롯 변경: 슬롯 ${activeSaveSlot} (저장 데이터 없음)`);
    render();
    return;
  }

  setStatus(`슬롯 ${activeSaveSlot} 저장 데이터가 없음`, true);
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}

function bindEvents() {
  dom.btnToggleBattleFocus.addEventListener("click", () => {
    applyBattleFocusMode(!battleFocusMode, { announce: true });
  });
  dom.btnToggleBattleSfx?.addEventListener("click", () => {
    setBattleSfxEnabled(!battleSfxEnabled, { announce: true });
  });
  dom.btnToggleBattleHaptic?.addEventListener("click", () => {
    setBattleHapticEnabled(!battleHapticEnabled, { announce: true });
  });
  const resumeBattleSfxFromGesture = () => {
    if (!battleSfxEnabled) {
      return;
    }
    requestResumeBattleSfxContext();
  };
  document.addEventListener("pointerdown", resumeBattleSfxFromGesture, { passive: true });
  document.addEventListener("keydown", resumeBattleSfxFromGesture);
  dom.btnCloseOfflineModal.addEventListener("click", hideOfflineModal);
  dom.btnToggleOfflineDetail.addEventListener("click", () => {
    setOfflineDetailExpanded(!offlineDetailExpanded);
  });
  dom.btnToggleOfflineCriticalOnly.addEventListener("click", () => {
    setOfflineDetailCriticalOnly(!offlineDetailCriticalOnly);
    renderOfflineDetailList(lastOfflineReport?.events ?? []);
  });
  dom.btnCompareOfflineCode.addEventListener("click", () => {
    runOfflineCompareCodeCheck();
  });
  dom.btnPasteOfflineCompareCode.addEventListener("click", () => {
    pasteOfflineCompareCodeFromClipboard();
  });
  dom.btnLoadOfflineCompareCodeFromPayload.addEventListener("click", () => {
    loadOfflineCompareCodeFromPayload();
  });
  dom.btnApplyOfflineCompareViewMode.addEventListener("click", () => {
    const targetMode = String(dom.btnApplyOfflineCompareViewMode.dataset.targetMode || "");
    if (targetMode !== "all" && targetMode !== "critical") {
      setStatus("정렬 가능한 보기 모드 없음", true);
      return;
    }
    setOfflineDetailCriticalOnly(targetMode === "critical");
    renderOfflineDetailList(lastOfflineReport?.events ?? []);
    const modeLabelKo = targetMode === "critical" ? "핵심" : "전체";
    setStatus(`비교 대상 보기 모드(${modeLabelKo})로 정렬 완료`);
  });
  dom.offlineCompareCodeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runOfflineCompareCodeCheck();
    }
  });
  dom.offlineCompareCodeInput.addEventListener("input", () => {
    const currentCode = String(dom.offlineDetailCompareCode.textContent || "").trim();
    setOfflineCompareSource(
      resolveOfflineDetailCompareInputSource(dom.offlineCompareCodeInput.value),
    );
    setOfflineCompareResultState(currentCode, dom.offlineCompareCodeInput.value);
    setOfflineCompareActionHint(currentCode, dom.offlineCompareCodeInput.value);
    setOfflineCompareTargetSummary(dom.offlineCompareCodeInput.value);
    setOfflineCompareDeltaSummary(currentCode, dom.offlineCompareCodeInput.value);
    setOfflineCompareMatchSummary(currentCode, dom.offlineCompareCodeInput.value);
  });
  dom.btnCopyOfflineCompareCode.addEventListener("click", () => {
    copyOfflineCompareCodeToClipboard();
  });
  dom.btnExportOfflineReport.addEventListener("click", () => {
    exportOfflineReportToPayload();
  });
  dom.btnExportRealtimeReport.addEventListener("click", () => {
    exportRealtimeReportToPayload();
  });
  dom.btnResetRealtimeStats.addEventListener("click", () => {
    resetRealtimeAutoSession();
    persistLocal();
    setStatus("실시간 통계 초기화 완료");
    render();
  });
  dom.offlineModal.addEventListener("click", (event) => {
    if (event.target === dom.offlineModal) {
      hideOfflineModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.offlineModal.classList.contains("hidden")) {
      hideOfflineModal();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopBattleSceneAmbientLoop();
      suspendBattleSfxContext();
      cancelBattleHaptic();
      if (isRealtimeAutoRunning()) {
        stopRealtimeAuto("백그라운드 진입");
      }
      persistLocal();
      render();
      return;
    }

    if (!document.hidden && state && context) {
      startBattleSceneAmbientLoop();
      requestResumeBattleSfxContext();
      const resumed = applyResumeCatchupIfNeeded();
      const restarted = maybeAutoStartRealtime("포그라운드 복귀");
      if (!resumed) {
        if (restarted) {
          setStatus("포그라운드 복귀: 실시간 자동 재개");
        }
        render();
      }
    }
  });
  window.addEventListener("pagehide", () => {
    stopBattleSceneAmbientLoop();
    suspendBattleSfxContext();
    cancelBattleHaptic();
    if (isRealtimeAutoRunning()) {
      stopRealtimeAuto("페이지 종료");
    }
    persistLocal();
  });

  dom.optAutoBattle.addEventListener("change", () => {
    state.settings.autoBattle = dom.optAutoBattle.checked;
    persistLocal();
    render();
  });
  dom.optAutoBreakthrough.addEventListener("change", () => {
    state.settings.autoBreakthrough = dom.optAutoBreakthrough.checked;
    persistLocal();
    render();
  });
  dom.optAutoTribulation.addEventListener("change", () => {
    state.settings.autoTribulation = dom.optAutoTribulation.checked;
    persistLocal();
    render();
  });
  dom.optAutoResumeRealtime.addEventListener("change", () => {
    state.settings.autoResumeRealtime = dom.optAutoResumeRealtime.checked;
    persistLocal();
    if (state.settings.autoResumeRealtime) {
      maybeAutoStartRealtime("옵션 변경");
    }
    render();
  });
  dom.optLowPerformanceBattleScene.addEventListener("change", () => {
    state.settings.lowPerformanceBattleScene = dom.optLowPerformanceBattleScene.checked;
    persistLocal();
    render();
  });
  dom.optAutoBreakthroughResumeWarmupSec.addEventListener("change", () => {
    state.settings.autoBreakthroughResumeWarmupSec =
      normalizeAutoBreakthroughResumeWarmupSec(
        dom.optAutoBreakthroughResumeWarmupSec.value,
        getConfiguredAutoBreakthroughResumeWarmupSec(),
      );
    persistLocal();
    render();
  });
  dom.optBattleSpeed.addEventListener("change", () => {
    state.settings.battleSpeed = clampInteger(
      dom.optBattleSpeed.value,
      state.settings.battleSpeed,
      1,
      3,
    );
    persistLocal();
    render();
  });
  dom.optOfflineCapHours.addEventListener("change", () => {
    state.settings.offlineCapHours = clampInteger(
      dom.optOfflineCapHours.value,
      state.settings.offlineCapHours,
      1,
      168,
    );
    persistLocal();
    render();
  });
  dom.optOfflineEventLimit.addEventListener("change", () => {
    state.settings.offlineEventLimit = clampInteger(
      dom.optOfflineEventLimit.value,
      state.settings.offlineEventLimit,
      5,
      120,
    );
    persistLocal();
    render();
  });
  dom.useBreakthroughElixir.addEventListener("change", () => {
    render();
  });
  dom.useTribulationTalisman.addEventListener("change", () => {
    render();
  });
  dom.btnApplyRecommendation.addEventListener("click", () => {
    const preview = previewBreakthroughChance(context, state, {
      useBreakthroughElixir: dom.useBreakthroughElixir.checked,
      useTribulationTalisman: dom.useTribulationTalisman.checked,
    });
    const recommendationToggle = resolveBreakthroughRecommendationToggles(preview, {
      hasBreakthroughElixir: state.inventory.breakthroughElixir > 0,
      hasTribulationTalisman: state.inventory.tribulationTalisman > 0,
      currentUseBreakthroughElixir: dom.useBreakthroughElixir.checked,
      currentUseTribulationTalisman: dom.useTribulationTalisman.checked,
    });
    if (!recommendationToggle.changed) {
      const insufficient =
        recommendationToggle.missingBreakthroughElixir ||
        recommendationToggle.missingTribulationTalisman;
      setStatus(
        `권장 설정 반영: 변경 없음 (${recommendationToggle.messageKo})`,
        insufficient,
      );
      render();
      return;
    }
    dom.useBreakthroughElixir.checked = recommendationToggle.nextUseBreakthroughElixir;
    dom.useTribulationTalisman.checked = recommendationToggle.nextUseTribulationTalisman;
    setStatus(`권장 설정 반영: ${recommendationToggle.messageKo}`);
    render();
  });

  dom.btnResumeAutoBreakthrough.addEventListener("click", () => {
    const resumePolicy = resolveAutoBreakthroughResumePolicy(context, state);
    if (!resumePolicy.actionable) {
      setStatus(
        `자동 돌파 재개: ${resumePolicy.messageKo}`,
        resumePolicy.tone !== "info",
      );
      render();
      return;
    }
    const confirmPolicy = resolveAutoBreakthroughResumeConfirmPolicy(resumePolicy);
    const recommendationPreview = previewBreakthroughChance(context, state, {
      useBreakthroughElixir: dom.useBreakthroughElixir.checked,
      useTribulationTalisman: dom.useTribulationTalisman.checked,
    });
    const recommendationToggle = resolveBreakthroughRecommendationToggles(
      recommendationPreview,
      {
        hasBreakthroughElixir: state.inventory.breakthroughElixir > 0,
        hasTribulationTalisman: state.inventory.tribulationTalisman > 0,
        currentUseBreakthroughElixir: dom.useBreakthroughElixir.checked,
        currentUseTribulationTalisman: dom.useTribulationTalisman.checked,
      },
    );
    const recommendationPlan = resolveAutoBreakthroughResumeRecommendationPlan(
      confirmPolicy,
      recommendationToggle,
    );
    if (confirmPolicy.requiresConfirm) {
      const confirmed = window.confirm(
        buildSlotActionConfirmMessage("자동 돌파 재개 확인", [
          `위험도: ${confirmPolicy.riskTier.labelKo}`,
          `사망 실패 확률: ${Number(confirmPolicy.preview?.deathFailPct || 0).toFixed(1)}%`,
          `기대값(1회): 기 ${fmtSignedInteger(confirmPolicy.expectedDelta?.expectedQiDelta)}, 환생정수 ${fmtSignedFixed(confirmPolicy.expectedDelta?.expectedRebirthEssenceDelta, 1)}, 경지 ${fmtSignedFixed(confirmPolicy.expectedDelta?.expectedDifficultyDelta, 1)}`,
          recommendationPlan.messageKo,
          confirmPolicy.enableTribulation
            ? "자동 도겁 허용이 함께 켜집니다."
            : "자동 돌파만 재개됩니다.",
          "계속할까요?",
        ]),
      );
      if (!confirmed) {
        setStatus("자동 돌파 재개 취소(사전 확인)", true);
        render();
        return;
      }
    }
    if (recommendationPlan.shouldApplyRecommendation) {
      dom.useBreakthroughElixir.checked =
        recommendationPlan.nextUseBreakthroughElixir;
      dom.useTribulationTalisman.checked =
        recommendationPlan.nextUseTribulationTalisman;
    }
    state.settings.autoBreakthrough = resumePolicy.shouldEnableAutoBreakthrough;
    if (resumePolicy.shouldEnableAutoTribulation) {
      state.settings.autoTribulation = true;
    }
    const warmupRemainingSec = armAutoBreakthroughResumeWarmup();
    persistLocal();
    const recommendationText = recommendationPlan.shouldApplyRecommendation
      ? " · 권장 설정 자동 적용"
      : "";
    const warmupText =
      warmupRemainingSec > 0 ? ` · 워밍업 ${warmupRemainingSec}초` : "";
    setStatus(
      `자동 돌파 재개: ${resumePolicy.actionLabelKo}${recommendationText}${warmupText}`,
    );
    render();
  });

  dom.optSaveSlot.addEventListener("change", () => {
    const prevSlot = activeSaveSlot;
    setActiveSaveSlot(dom.optSaveSlot.value, { persistPref: true });
    if (prevSlot !== activeSaveSlot) {
      setStatus(`세이브 슬롯 변경: 슬롯 ${activeSaveSlot}`);
    }
    render();
  });

  dom.btnToggleSlotLock.addEventListener("click", () => {
    const nextLocked = !isSlotLocked(activeSaveSlot);
    const persisted = setSlotLocked(activeSaveSlot, nextLocked);
    addClientLog("save", `슬롯 ${activeSaveSlot} ${nextLocked ? "잠금 설정" : "잠금 해제"}`);
    setStatus(
      `슬롯 ${activeSaveSlot} ${nextLocked ? "잠금 설정" : "잠금 해제"} 완료${persisted ? "" : " (저장소 접근 제한 가능)"}`,
      !persisted,
    );
    render();
  });

  dom.saveSlotSummaryList.addEventListener("click", (event) => {
    handleSlotSummaryQuickAction(event, "터치");
  });
  dom.saveSlotSummaryList.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    handleSlotSummaryQuickAction(event, "키보드");
  });

  dom.optCopySlotTarget.addEventListener("change", () => {
    const targetSlot = normalizeSaveSlot(dom.optCopySlotTarget.value, 1);
    if (targetSlot === activeSaveSlot) {
      syncCopySlotTargetSelection();
      setStatus("복제 대상은 활성 슬롯과 달라야 함", true);
      render();
      return;
    }
    dom.optCopySlotTarget.value = String(targetSlot);
    render();
  });

  dom.btnCopySlot.addEventListener("click", () => {
    const sourceSlot = activeSaveSlot;
    const targetSlot = normalizeSaveSlot(dom.optCopySlotTarget.value, sourceSlot);
    const targetSummary = summarizeSaveSlot(targetSlot);
    const targetLocked = isSlotLocked(targetSlot);
    const copyPolicy = resolveSlotCopyPolicy(
      sourceSlot,
      targetSlot,
      targetSummary.state,
      targetLocked,
    );
    if (!copyPolicy.allowed) {
      if (copyPolicy.reason === "target_locked") {
        setStatus(`슬롯 ${copyPolicy.targetSlot}이 잠겨 있어 복제할 수 없음`, true);
      } else {
        setStatus("복제 대상은 활성 슬롯과 달라야 함", true);
      }
      return;
    }
    const copiedState = cloneSliceState(state);
    copiedState.lastSavedAtIso = new Date().toISOString();
    copiedState.lastActiveEpochMs = Date.now();
    const raw = serializeSliceState(copiedState);
    if (copyPolicy.requiresConfirm) {
      const confirmed = window.confirm(
        buildSlotActionConfirmMessage("슬롯 복제", [
          `소스: 슬롯 ${copyPolicy.sourceSlot}`,
          `대상: 슬롯 ${copyPolicy.targetSlot} (${resolveSlotSummaryStateLabelKo(copyPolicy.targetState)})`,
          "대상 슬롯 데이터가 덮어써집니다.",
          "계속할까요?",
        ]),
      );
      if (!confirmed) {
        setStatus(`슬롯 ${copyPolicy.sourceSlot} → 슬롯 ${copyPolicy.targetSlot} 복제 취소`);
        return;
      }
    }
    const targetKey = buildStorageKeyForSlot(copyPolicy.targetSlot);
    const copied = safeLocalSetItem(targetKey, raw);
    if (!copied) {
      setStatus("슬롯 복제 실패(브라우저 저장소 제한)", true);
      return;
    }
    markSlotSummaryDirty();
    addClientLog(
      "save",
      `슬롯 ${copyPolicy.sourceSlot} → 슬롯 ${copyPolicy.targetSlot} 복제 완료 (메모리 스냅샷 기준)`,
    );
    setStatus(`슬롯 ${copyPolicy.sourceSlot} → 슬롯 ${copyPolicy.targetSlot} 복제 완료`);
    render();
  });

  dom.btnDeleteSlot.addEventListener("click", () => {
    const activeSummary = summarizeSaveSlot(activeSaveSlot);
    const deletePolicy = resolveSlotDeletePolicy(
      activeSaveSlot,
      activeSummary.state,
      isSlotLocked(activeSaveSlot),
    );
    if (!deletePolicy.allowed) {
      if (deletePolicy.reason === "slot_locked") {
        setStatus(`슬롯 ${deletePolicy.slot}이 잠겨 있어 삭제할 수 없음`, true);
      } else {
        setStatus(`슬롯 ${deletePolicy.slot} 삭제할 데이터가 없음`);
      }
      return;
    }
    const confirmed = window.confirm(
      buildSlotActionConfirmMessage("슬롯 삭제", [
        `대상: 슬롯 ${deletePolicy.slot} (${resolveSlotSummaryStateLabelKo(deletePolicy.slotState)})`,
        "현재 메모리 상태는 유지됩니다.",
        "계속할까요?",
      ]),
    );
    if (!confirmed) {
      setStatus(`슬롯 ${deletePolicy.slot} 삭제 취소`);
      return;
    }
    if (isRealtimeAutoRunning()) {
      stopRealtimeAuto("슬롯 삭제");
    }
    const slotKey = getActiveStorageKey();
    const deletedSlot = safeLocalRemoveItem(slotKey);
    const deletedLegacy =
      activeSaveSlot === 1 ? safeLocalRemoveItem(MOBILE_MVP_STORAGE_KEY) : false;
    markSlotSummaryDirty();
    addClientLog(
      "save",
      `슬롯 ${activeSaveSlot} 삭제 완료${deletedLegacy ? " (legacy 포함)" : ""}`,
    );
    setStatus(
      `슬롯 ${activeSaveSlot} 삭제 완료${deletedSlot ? "" : " (저장소 접근 제한 가능)"}`,
    );
    render();
  });

  dom.playerNameInput.addEventListener("change", () => {
    state.playerName = dom.playerNameInput.value.trim() || "도심";
    persistLocal();
    render();
  });

  dom.btnBattle.addEventListener("click", () => {
    const outcome = runBattleOnce(context, state, rng);
    playBattleSceneBattleOutcome(outcome);
    persistLocal();
    render();
  });

  dom.btnBreakthrough.addEventListener("click", () => {
    const preview = previewBreakthroughChance(context, state, {
      useBreakthroughElixir: dom.useBreakthroughElixir.checked,
      useTribulationTalisman: dom.useTribulationTalisman.checked,
    });
    const expectedDelta = resolveBreakthroughExpectedDelta(context, state, preview);
    const attemptPolicy = resolveBreakthroughManualAttemptPolicy(preview, expectedDelta);
    if (attemptPolicy.requiresConfirm) {
      const confirmed = window.confirm(
        buildSlotActionConfirmMessage("도겁 돌파 확인", [
          `위험도: ${attemptPolicy.riskTier.labelKo}`,
          `사망 실패 확률: ${preview.deathFailPct.toFixed(1)}%`,
          `기대값(1회): 기 ${fmtSignedInteger(expectedDelta.expectedQiDelta)}, 환생정수 ${fmtSignedFixed(expectedDelta.expectedRebirthEssenceDelta, 1)}, 경지 ${fmtSignedFixed(expectedDelta.expectedDifficultyDelta, 1)}`,
          "계속할까요?",
        ]),
      );
      if (!confirmed) {
        setStatus("돌파 시도 취소(고위험 확인)", true);
        setBattleSceneStatus("돌파 취소", "warn", "breakthrough", "breakthrough_cancelled");
        setBattleSceneResult(
          "고위험 확인 단계에서 수동으로 취소됨",
          "warn",
          "breakthrough",
          "breakthrough_cancelled",
        );
        triggerBattleSceneImpact("breakthrough_fail", "warn");
        spawnBattleSceneFloat("돌파 취소", { tone: "warn", anchor: "center" });
        render();
        return;
      }
    }
    const outcome = runBreakthroughAttempt(context, state, rng, {
      useBreakthroughElixir: dom.useBreakthroughElixir.checked,
      useTribulationTalisman: dom.useTribulationTalisman.checked,
      respectAutoTribulation: false,
    });
    if (!outcome.attempted) {
      setStatus(outcome.message || "돌파 시도 실패", true);
    } else {
      setStatus(outcome.message || "돌파 시도 완료");
    }
    playBattleSceneBreakthroughOutcome(outcome);
    persistLocal();
    render();
  });

  dom.btnAuto10s.addEventListener("click", () => {
    const tuning = getCurrentSpeedTuning();
    const stats = getRealtimeStats();
    const warmupRemainingSecBefore = getAutoBreakthroughWarmupRemainingSec(stats);
    const summary = runAutoSliceSeconds(context, state, rng, {
      seconds: 10,
      battleEverySec: tuning.battleEverySec,
      breakthroughEverySec: tuning.breakthroughEverySec,
      passiveQiRatio: tuning.passiveQiRatio,
      collectEvents: true,
      maxCollectedEvents: 28,
      autoBreakthroughWarmupUntilSec: warmupRemainingSecBefore,
    });
    const warmupRemainingSecAfter = resolveAutoBreakthroughWarmupRemainingSec(
      warmupRemainingSecBefore,
      summary.seconds,
    );
    stats.autoBreakthroughWarmupUntilTimelineSec = Math.max(
      0,
      Math.floor(Number(stats.timelineSec) || 0) + warmupRemainingSecAfter,
    );
    const warmupSkipText =
      summary.autoBreakthroughWarmupSkips > 0
        ? ` · 워밍업 차단 ${summary.autoBreakthroughWarmupSkips}회`
        : "";
    const blockedLabel = buildAutoBreakthroughBlockSummaryLabelKo({
      breakthroughPolicyBlocks: summary.breakthroughPolicyBlocks,
      breakthroughNoQiBlocks: summary.breakthroughNoQiBlocks,
      breakthroughTribulationSettingBlocks: summary.breakthroughTribulationSettingBlocks,
      breakthroughPolicyBlockReasons: summary.breakthroughPolicyBlockReasons,
    });
    const blockedText = blockedLabel ? ` · ${blockedLabel}` : "";
    const pausedReasonLabel = String(summary.autoBreakthroughPauseReasonLabelKo || "정책");
    const pausedNextActionKo = String(summary.autoBreakthroughPauseNextActionKo || "");
    const pausedText = summary.autoBreakthroughPaused
      ? ` · 자동돌파 일시정지(${pausedReasonLabel}${pausedNextActionKo ? ` · ${pausedNextActionKo}` : ""})`
      : "";
    const warmupRemainingText =
      warmupRemainingSecAfter > 0
        ? ` · 워밍업 잔여 ${warmupRemainingSecAfter}초`
        : "";
    if (
      warmupRemainingSecBefore > 0 &&
      warmupRemainingSecAfter === 0 &&
      state.settings.autoBreakthrough
    ) {
      addClientLog("auto", "자동 10초: 돌파 워밍업 종료");
    }
    setStatus(
      `자동 10초(${tuning.labelKo}): 전투 ${summary.battles}회 · 돌파 ${summary.breakthroughs}회${warmupSkipText}${blockedText}${pausedText}${warmupRemainingText} · 환생 ${summary.rebirths}회`,
    );
    playBattleSceneAutoSummary(summary, "자동 10초");
    persistLocal();
    render();
  });

  dom.btnRealtimeAuto.addEventListener("click", () => {
    if (isRealtimeAutoRunning()) {
      stopRealtimeAuto("사용자 중지");
      render();
      return;
    }
    startRealtimeAuto();
    render();
  });

  dom.btnResetRun.addEventListener("click", () => {
    const confirmed = window.confirm("런을 초기화할까요? 현재 상태가 덮어써집니다.");
    if (!confirmed) return;
    stopRealtimeAuto("런 초기화");
    resetRealtimeAutoSession();
    state = createInitialSliceState(context, {
      playerName: state.playerName,
      autoResumeRealtime: state.settings.autoResumeRealtime,
      autoBreakthroughResumeWarmupSec:
        state.settings.autoBreakthroughResumeWarmupSec,
      battleSpeed: state.settings.battleSpeed,
      lowPerformanceBattleScene: state.settings.lowPerformanceBattleScene,
      offlineCapHours: state.settings.offlineCapHours,
      offlineEventLimit: state.settings.offlineEventLimit,
    });
    lastOfflineReport = null;
    resetBattleSceneDuelState({ clearTicker: true });
    hideOfflineModal();
    setStatus("런 초기화 완료");
    persistLocal();
    render();
  });

  dom.btnSaveLocal.addEventListener("click", () => {
    updateLastSavedNow();
    persistLocal();
    render();
    setStatus(`로컬 저장 완료(슬롯 ${activeSaveSlot})`);
  });

  dom.btnLoadLocal.addEventListener("click", () => {
    tryLoadActiveSlot("로컬 불러오기");
  });

  dom.btnExportState.addEventListener("click", () => {
    setSavePayloadValue(serializeSliceState(state), "state_export");
    setStatus("현재 상태를 JSON으로 내보냈음");
  });

  dom.btnImportState.addEventListener("click", () => {
    const raw = dom.savePayload.value.trim();
    if (!raw) {
      setStatus("가져올 JSON이 비어 있음", true);
      return;
    }
    try {
      stopRealtimeAuto("JSON 가져오기");
      resetRealtimeAutoSession();
      const imported = parseSliceState(raw, context);
      state = cloneSliceState(imported);
      ensureRealtimeStatsShape();
      resetBattleSceneDuelState({ clearTicker: true });
      addClientLog("save", "JSON 가져오기 완료");
      const offline = applyOfflineCatchupNow();
      setStatus(buildOfflineStatus("JSON 가져오기 완료", offline.summary));
      showOfflineModal(offline);
      persistLocal();
      render();
      maybeAutoStartRealtime("JSON 가져오기");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "JSON 가져오기 실패", true);
    }
  });
  dom.savePayload.addEventListener("input", () => {
    syncSavePayloadContract(dom.savePayload.value.trim() ? "manual" : "empty");
  });
}

function addClientLog(kind, message) {
  state.logs.unshift({
    at: new Date().toISOString(),
    kind,
    message,
  });
  if (state.logs.length > 120) {
    state.logs.length = 120;
  }
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`데이터 로드 실패: ${path} (${response.status})`);
  }
  return response.json();
}

async function bootstrap() {
  try {
    setStatus("밸런스 데이터 로딩 중...");
    const [progressionRows, localeRows] = await Promise.all([
      fetchJson("../../data/export/realm_progression_v1.json"),
      fetchJson("../../data/export/realm_locale_ko_v1.json"),
    ]);
    context = buildSliceContext(progressionRows, localeRows);
    state = createInitialSliceState(context, { playerName: "도심" });
    ensureRealtimeStatsShape();
    resetBattleSceneDuelState({ clearTicker: true });
    resetRealtimeAutoSession();
    restoreSlotLocks();
    restoreSaveSlotPreference();
    restoreBattleSfxPreference();
    restoreBattleHapticPreference();
    let bootstrapStatus = "준비 완료";

    const payload = readActiveSlotPayload();
    const raw = payload.raw;
    if (raw) {
      try {
        state = parseSliceState(raw, context);
        ensureRealtimeStatsShape();
        resetBattleSceneDuelState({ clearTicker: true });
        addClientLog(
          "save",
          `기존 로컬 세이브 자동 로드(슬롯 ${activeSaveSlot}${payload.source === "legacy" ? ", legacy" : ""})`,
        );
        const offline = applyOfflineCatchupNow();
        bootstrapStatus = buildOfflineStatus(
          `오프라인 복귀(슬롯 ${activeSaveSlot})`,
          offline.summary,
        );
        showOfflineModal(offline);
        persistLocal();
      } catch {
        addClientLog("error", "기존 로컬 세이브가 손상되어 새 상태로 시작");
        bootstrapStatus = "손상된 저장 데이터를 건너뛰고 새 런으로 시작";
        hideOfflineModal();
      }
    } else {
      hideOfflineModal();
    }

    bindEvents();
    applyBattleFocusMode(true);
    render();
    setStatus(bootstrapStatus);
    const resumedRealtime = maybeAutoStartRealtime("앱 진입");
    if (resumedRealtime) {
      setStatus(`${bootstrapStatus} · 실시간 자동 재개`);
      render();
    }
  } catch (err) {
    setStatus(err instanceof Error ? err.message : "초기화 실패", true);
  }
}

bootstrap();
