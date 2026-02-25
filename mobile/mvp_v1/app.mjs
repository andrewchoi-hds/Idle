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
  buildOfflineDetailCompareResultStateLabelKo,
  buildOfflineDetailCompareResultStateTone,
  buildOfflineDetailCompareActionHintLabelKo,
  buildOfflineDetailCompareActionHintTone,
  resolveOfflineDetailCompareViewModeAlignmentTarget,
  buildOfflineDetailCompareCodeSourceLabelKo,
  buildOfflineDetailCompareCodeSourceTone,
  resolveOfflineDetailCompareInputSource,
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
  appStatus: document.getElementById("appStatus"),
  stageDisplay: document.getElementById("stageDisplay"),
  worldTag: document.getElementById("worldTag"),
  difficultyIndex: document.getElementById("difficultyIndex"),
  qiRequired: document.getElementById("qiRequired"),
  qiProgressBar: document.getElementById("qiProgressBar"),
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
  optAutoBreakthroughResumeWarmupSec: document.getElementById("optAutoBreakthroughResumeWarmupSec"),
  optBattleSpeed: document.getElementById("optBattleSpeed"),
  optOfflineCapHours: document.getElementById("optOfflineCapHours"),
  optOfflineEventLimit: document.getElementById("optOfflineEventLimit"),
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
let realtimePolicyReasonAccum = createEmptyPolicyBlockReasonSummary();
let slotSummaryDirty = true;
let slotSummaryLastRenderedAtMs = 0;
let slotQuickLoadLastAcceptedAtMs = 0;
const SLOT_QUICK_LOAD_DEBOUNCE_MS = 700;
const DEFAULT_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC = 6;

function setStatus(message, isError = false) {
  dom.appStatus.textContent = message;
  dom.appStatus.style.color = isError ? "#f27167" : "#f3bd4d";
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
  dom.offlineCompareCodeResult.textContent = buildOfflineDetailCompareResultStateLabelKo(
    currentCodeInput,
    targetCodeInput,
  );
  applyRiskTone(
    dom.offlineCompareCodeResult,
    buildOfflineDetailCompareResultStateTone(currentCodeInput, targetCodeInput),
  );
}

function setOfflineCompareResultLabel(currentCodeInput, targetCodeInput) {
  dom.offlineCompareCodeResult.textContent = buildOfflineDetailCompareResultLabelKo(
    currentCodeInput,
    targetCodeInput,
  );
  applyRiskTone(
    dom.offlineCompareCodeResult,
    buildOfflineDetailCompareResultStateTone(currentCodeInput, targetCodeInput),
  );
}

function setOfflineCompareDeltaSummary(
  currentCodeInput,
  targetCodeInput,
  idleWhenEmpty = false,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (idleWhenEmpty && !targetText) {
    dom.offlineCompareCodeDeltaSummary.textContent = "차이 요약: 대기 중";
    applyRiskTone(dom.offlineCompareCodeDeltaSummary, "info");
    return;
  }
  dom.offlineCompareCodeDeltaSummary.textContent =
    buildOfflineDetailCompareCodeDeltaSummaryLabelKo(currentCodeInput, targetText);
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
    applyRiskTone(dom.offlineCompareCodeMatchSummary, "info");
    return;
  }
  dom.offlineCompareCodeMatchSummary.textContent =
    buildOfflineDetailCompareCodeMatchSummaryLabelKo(currentCodeInput, targetText);
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
  applyRiskTone(
    dom.offlineCompareCodeSource,
    buildOfflineDetailCompareCodeSourceTone(normalizedSource),
  );
  return label;
}

function setOfflineCompareCurrentSummary(currentCodeInput) {
  const currentText =
    typeof currentCodeInput === "string" ? currentCodeInput.trim() : "";
  dom.offlineCompareCodeCurrentSummary.textContent =
    buildOfflineDetailCompareCodeCurrentSummaryLabelKo(currentText);
  applyRiskTone(
    dom.offlineCompareCodeCurrentSummary,
    buildOfflineDetailCompareCodeCurrentSummaryTone(currentText),
  );
}

function setOfflineCompareTargetSummary(targetCodeInput) {
  const targetText =
    typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  dom.offlineCompareCodeTargetSummary.textContent =
    buildOfflineDetailCompareCodeTargetSummaryLabelKo(targetText);
  applyRiskTone(
    dom.offlineCompareCodeTargetSummary,
    buildOfflineDetailCompareCodeTargetSummaryTone(targetText),
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
    return;
  }
  const modeLabelKo = targetMode === "critical" ? "핵심" : "전체";
  dom.btnApplyOfflineCompareViewMode.disabled = false;
  dom.btnApplyOfflineCompareViewMode.dataset.targetMode = targetMode;
  dom.btnApplyOfflineCompareViewMode.textContent = `보기 모드 맞추기(${modeLabelKo})`;
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
  dom.btnDeleteSlot.disabled = !deletePolicy.allowed;
  if (deletePolicy.allowed) {
    dom.btnDeleteSlot.title = "";
  } else if (deletePolicy.reason === "slot_locked") {
    dom.btnDeleteSlot.title = "활성 슬롯 잠금 해제 후 삭제 가능";
  } else {
    dom.btnDeleteSlot.title = "삭제할 저장 데이터가 없음";
  }

  if (dom.slotLockHint) {
    dom.slotLockHint.textContent = sourceLocked
      ? `활성 슬롯 ${activeSaveSlot}: 잠금됨 (삭제/덮어쓰기 보호 중)`
      : `활성 슬롯 ${activeSaveSlot}: 잠금 해제 (삭제/덮어쓰기 가능)`;
    applySlotHintTone(dom.slotLockHint, sourceLocked ? "warn" : "info");
  }
  if (dom.btnToggleSlotLock) {
    dom.btnToggleSlotLock.textContent = sourceLocked ? "활성 슬롯 잠금 해제" : "활성 슬롯 잠금";
    dom.btnToggleSlotLock.title = sourceLocked
      ? "잠금을 해제하면 삭제/덮어쓰기가 가능합니다."
      : "잠그면 삭제/덮어쓰기를 차단합니다.";
  }
  if (dom.slotTargetHint) {
    const lockSuffix = targetLocked ? " · 잠금됨" : "";
    dom.slotTargetHint.textContent =
      `대상 슬롯 ${targetSlot}: ${resolveSlotSummaryStateLabelKo(targetSummary.state)}${lockSuffix}`;
    applySlotHintTone(
      dom.slotTargetHint,
      targetLocked ? "warn" : resolveSlotSummaryStateTone(targetSummary.state),
    );
  }
  if (dom.slotCopyHint) {
    dom.slotCopyHint.textContent = `복제: ${resolveSlotCopyHint(copyPolicy)}`;
    applySlotHintTone(dom.slotCopyHint, resolveSlotCopyHintTone(copyPolicy));
  }
  if (dom.slotDeleteHint) {
    dom.slotDeleteHint.textContent = `삭제: ${resolveSlotDeleteHint(deletePolicy)}`;
    applySlotHintTone(dom.slotDeleteHint, resolveSlotDeleteHintTone(deletePolicy));
  }
}

function renderSaveSlotSummary(force = false) {
  const now = Date.now();
  if (!force && !slotSummaryDirty && now - slotSummaryLastRenderedAtMs < 1500) {
    return;
  }
  const rows = [1, 2, 3].map((slot) => summarizeSaveSlot(slot));
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
    return `${secLabel}: 돌파 성공 (난이도 ${event.fromDifficultyIndex} → ${event.toDifficultyIndex})`;
  }
  if (event.kind === "breakthrough_minor_fail") {
    return `${secLabel}: 돌파 경상 실패 (기 ${fmtSignedInteger(event.qiDelta)})`;
  }
  if (event.kind === "breakthrough_retreat_fail") {
    return `${secLabel}: 돌파 후퇴 실패 (${event.retreatLayers}단계 하락)`;
  }
  if (event.kind === "breakthrough_death_fail") {
    return `${secLabel}: 도겁 사망 → 환생 (환생정수 +${fmtNumber(event.rebirthReward)})`;
  }
  if (event.kind === "breakthrough_blocked_auto_policy") {
    const reasonLabel = String(event.reasonLabelKo || event.reason || "policy");
    const actionText =
      typeof event.nextActionKo === "string" && event.nextActionKo
        ? ` · ${event.nextActionKo}`
        : "";
    return `${secLabel}: 자동 돌파 차단 (${reasonLabel})${actionText}`;
  }
  if (event.kind === "auto_breakthrough_paused_by_policy") {
    const reasonLabel = String(event.reasonLabelKo || event.reason || "policy");
    const threshold = Math.max(1, Number(event.threshold) || 1);
    return `${secLabel}: 자동 돌파 일시정지 (${reasonLabel}, 연속 ${threshold}회 차단)`;
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
  const currentCompareCode = buildOfflineDetailCompareCode(prioritizedRows, mode);
  dom.offlineDetailCompareCode.textContent = currentCompareCode;
  setOfflineCompareCurrentSummary(currentCompareCode);
  const targetText = String(dom.offlineCompareCodeInput.value || "").trim();
  setOfflineCompareResultState(currentCompareCode, targetText);
  setOfflineCompareActionHint(currentCompareCode, targetText);
  setOfflineCompareDeltaSummary(currentCompareCode, targetText, true);
  setOfflineCompareMatchSummary(currentCompareCode, targetText, true);
  dom.offlineDetailFilterSummary.textContent = buildOfflineDetailFilterSummaryLabelKo(
    prioritizedRows,
    mode,
  );
  dom.offlineDetailHiddenSummary.textContent = buildOfflineDetailHiddenSummaryLabelKo(
    prioritizedRows,
    mode,
  );
  dom.offlineDetailHiddenKindsSummary.textContent = buildOfflineDetailHiddenKindsSummaryLabelKo(
    prioritizedRows,
    mode,
  );
  if (rows.length === 0) {
    dom.offlineDetailList.innerHTML = offlineDetailCriticalOnly
      ? '<li class="delta-neutral">핵심 이벤트 없음</li>'
      : '<li class="delta-neutral">세부 로그 없음</li>';
    return;
  }
  dom.offlineDetailList.innerHTML = rows
    .map((event) => `<li>${formatOfflineEventLine(event)}</li>`)
    .join("");
}

function setOfflineDetailCriticalOnly(enabled) {
  offlineDetailCriticalOnly = Boolean(enabled);
  dom.btnToggleOfflineCriticalOnly.textContent = offlineDetailCriticalOnly
    ? "전체 로그 보기"
    : "핵심 로그만 보기";
}

function setOfflineDetailExpanded(expanded) {
  offlineDetailExpanded = expanded;
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
  dom.savePayload.value = payload;
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
    dom.savePayload.value = `${code}\n`;
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
  const sourceLabelKo = setOfflineCompareSource(normalizedSource);
  setOfflineCompareResultState(currentCode, targetText);
  setOfflineCompareActionHint(currentCode, targetText);
  setOfflineCompareTargetSummary(targetText);
  setOfflineCompareDeltaSummary(currentCode, targetText);
  setOfflineCompareMatchSummary(currentCode, targetText);
  const targetCode = extractOfflineDetailCompareCode(targetText);
  if (!targetCode) {
    setStatus("비교 코드 입력 필요", true);
    return;
  }
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
  const isError = resultLabel.includes("오류") || resultLabel.includes("불가");
  setStatus(`[${sourceLabelKo}] ${resultLabel}`, isError);
}

async function pasteOfflineCompareCodeFromClipboard() {
  if (!(navigator.clipboard && typeof navigator.clipboard.readText === "function")) {
    setStatus("클립보드 읽기 미지원 환경", true);
    return;
  }
  let text = "";
  const currentCode = String(dom.offlineDetailCompareCode.textContent || "").trim();
  try {
    text = await navigator.clipboard.readText();
  } catch {
    setStatus("클립보드 읽기 실패", true);
    return;
  }
  const extractedCode = extractOfflineDetailCompareCode(text);
  if (!extractedCode) {
    dom.offlineCompareCodeResult.textContent = "입력 비교 코드 형식 오류";
    applyRiskTone(dom.offlineCompareCodeResult, "warn");
    setOfflineCompareTargetSummary(text);
    setOfflineCompareDeltaSummary(currentCode, text);
    setOfflineCompareMatchSummary(currentCode, text);
    setOfflineCompareActionHint(currentCode, text);
    setOfflineCompareSource("clipboard");
    setStatus("클립보드에서 비교 코드 인식 실패", true);
    return;
  }
  dom.offlineCompareCodeInput.value = extractedCode;
  runOfflineCompareCodeCheck("clipboard");
}

function loadOfflineCompareCodeFromPayload() {
  const payloadText = String(dom.savePayload.value || "").trim();
  const currentCode = String(dom.offlineDetailCompareCode.textContent || "").trim();
  if (!payloadText) {
    setOfflineCompareResultState(currentCode, payloadText);
    setOfflineCompareTargetSummary(payloadText);
    setOfflineCompareDeltaSummary(currentCode, payloadText);
    setOfflineCompareMatchSummary(currentCode, payloadText);
    setOfflineCompareActionHint(currentCode, payloadText);
    setOfflineCompareSource("none");
    setStatus("savePayload 입력 필요", true);
    return;
  }
  const extracted = extractOfflineDetailCompareCodeFromPayloadTextWithSource(payloadText);
  if (!extracted.code) {
    dom.offlineCompareCodeResult.textContent = "입력 비교 코드 형식 오류";
    applyRiskTone(dom.offlineCompareCodeResult, "warn");
    setOfflineCompareTargetSummary(payloadText);
    setOfflineCompareDeltaSummary(currentCode, payloadText);
    setOfflineCompareMatchSummary(currentCode, payloadText);
    setOfflineCompareActionHint(currentCode, payloadText);
    setOfflineCompareSource("payload");
    setStatus("savePayload에서 비교 코드 인식 실패", true);
    return;
  }
  dom.offlineCompareCodeInput.value = extracted.code;
  runOfflineCompareCodeCheck(extracted.source || "payload");
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
  dom.savePayload.value = payload;
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
  const reasonText = formatPolicyBlockReasonSummary(auto?.breakthroughPolicyBlockReasons);
  const blockedText =
    (auto?.breakthroughPolicyBlocks ?? 0) > 0
      ? ` · 위험 차단 ${auto.breakthroughPolicyBlocks}회${
          reasonText ? `(${reasonText})` : ""
        }`
      : "";
  const pausedText = auto?.autoBreakthroughPaused
    ? ` · 자동돌파 일시정지(${String(auto.autoBreakthroughPauseReasonLabelKo || "정책")})`
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
  dom.btnRealtimeAuto.textContent = running ? "실시간 자동 중지" : "실시간 자동 시작";
  dom.realtimeAutoStatus.textContent = running
    ? `진행 중 · ${fmtDurationSec(stats.elapsedSec)}${warmupText}`
    : "중지";
}

function renderRealtimeSummary() {
  const stats = getRealtimeStats();
  dom.realtimeElapsed.textContent = fmtDurationSec(stats.elapsedSec);
  dom.realtimeBattles.textContent = `${fmtNumber(stats.battles)}회`;
  dom.realtimeBreakthroughs.textContent = `${fmtNumber(stats.breakthroughs)}회`;
  dom.realtimeRebirths.textContent = `${fmtNumber(stats.rebirths)}회`;
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
  accumulatePolicyBlockReasonSummary(
    realtimePolicyReasonAccum,
    summary.breakthroughPolicyBlockReasons,
  );

  if (stats.elapsedSec % 10 === 0) {
    const reasonText = formatPolicyBlockReasonSummary(realtimePolicyReasonAccum);
    addClientLog(
      "auto",
      `실시간 자동 ${fmtDurationSec(stats.elapsedSec)} 누적 (전투 ${stats.battles}회 · 돌파 ${stats.breakthroughs}회 · 위험 차단 ${realtimePolicyBlockAccum}회${
        reasonText ? `(${reasonText})` : ""
      } · 환생 ${stats.rebirths}회)`,
    );
    realtimePolicyBlockAccum = 0;
    realtimePolicyReasonAccum = createEmptyPolicyBlockReasonSummary();
  }

  if (summary.autoBreakthroughPaused) {
    const reasonLabel = String(summary.autoBreakthroughPauseReasonLabelKo || "정책");
    addClientLog(
      "auto",
      `실시간 자동: 자동 돌파 일시정지 (${reasonLabel})`,
    );
    setStatus(`실시간 자동: 자동 돌파 일시정지 (${reasonLabel})`, true);
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
  dom.offlineDetailCompareCode.textContent = "비교 코드 없음";
  setOfflineCompareCurrentSummary("");
  dom.offlineCompareCodeInput.value = "";
  setOfflineCompareResultState("", "");
  setOfflineCompareActionHint("", "");
  setOfflineCompareSource("none");
  setOfflineCompareTargetSummary("");
  setOfflineCompareDeltaSummary("", "", true);
  setOfflineCompareMatchSummary("", "", true);
  dom.offlineDetailFilterSummary.textContent = "세부 로그 0건 (전체)";
  dom.offlineDetailHiddenSummary.textContent = "숨김 이벤트 없음";
  dom.offlineDetailHiddenKindsSummary.textContent = "숨김 상세 없음";
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
  dom.offlineAppliedDuration.textContent = fmtDurationSec(summary.appliedOfflineSec);
  dom.offlineRawDuration.textContent = fmtDurationSec(summary.rawOfflineSec);
  dom.offlineWarmupSummary.textContent = warmupLabelKo;
  dom.offlineCriticalSummary.textContent = criticalSummaryLabelKo;
  dom.offlineCapState.textContent = summary.cappedByMaxOffline
    ? `${state.settings.offlineCapHours}시간 적용`
    : "미적용";
  dom.offlineBattleCount.textContent = `${auto?.battles ?? 0}회`;
  dom.offlineBreakthroughCount.textContent = `${auto?.breakthroughs ?? 0}회`;
  dom.offlineRebirthCount.textContent = `${auto?.rebirths ?? 0}회`;
  setDeltaNode(dom.offlineQiDelta, delta.qi);
  setDeltaNode(dom.offlineSpiritDelta, delta.spiritCoin);
  setDeltaNode(dom.offlineEssenceDelta, delta.rebirthEssence);
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

  dom.stageDisplay.textContent = displayName;
  dom.worldTag.textContent = worldKo(stage.world);
  dom.difficultyIndex.textContent = String(stage.difficulty_index);
  dom.qiRequired.textContent = fmtNumber(stage.qi_required);
  dom.statQi.textContent = fmtNumber(state.currencies.qi);
  dom.statSpiritCoin.textContent = fmtNumber(state.currencies.spiritCoin);
  dom.statRebirthEssence.textContent = fmtNumber(state.currencies.rebirthEssence);
  dom.statRebirthCount.textContent = fmtNumber(state.progression.rebirthCount);
  dom.invBreakthroughElixir.textContent = fmtNumber(state.inventory.breakthroughElixir);
  dom.invTribulationTalisman.textContent = fmtNumber(state.inventory.tribulationTalisman);
  dom.previewSuccessPct.textContent = preview.successPct.toFixed(1);
  dom.previewDeathPct.textContent = preview.deathPct.toFixed(1);
  dom.previewMinorFailPct.textContent = preview.minorFailPct.toFixed(1);
  dom.previewRetreatFailPct.textContent = preview.retreatFailPct.toFixed(1);
  dom.previewDeathInFailPct.textContent = preview.deathInFailurePct.toFixed(1);
  dom.previewExpectedLabel.textContent = expectedDelta.labelKo;
  dom.previewExpectedLabel.title = "1회 돌파 시도 기준 기대값";
  dom.previewExpectedQiDelta.textContent = fmtSignedInteger(expectedDelta.expectedQiDelta);
  dom.previewExpectedEssenceDelta.textContent = fmtSignedFixed(
    expectedDelta.expectedRebirthEssenceDelta,
    1,
  );
  dom.previewExpectedDifficultyDelta.textContent = fmtSignedFixed(
    expectedDelta.expectedDifficultyDelta,
  );
  applyRiskTone(dom.previewExpectedLabel, expectedDelta.tone);
  dom.previewRiskLabel.textContent = riskTier.labelKo;
  dom.previewRiskLabel.title = riskTier.descriptionKo;
  applyRiskTone(dom.previewRiskLabel, riskTier.tone);
  dom.previewMitigationLabel.textContent = mitigation.labelKo;
  dom.previewMitigationLabel.title = mitigation.messageKo;
  dom.previewMitigationHint.textContent = mitigation.messageKo;
  applyRiskTone(dom.previewMitigationLabel, mitigation.tone);
  applyRiskTone(dom.previewMitigationHint, mitigation.tone);
  dom.previewRecommendationLabel.textContent = recommendation.labelKo;
  dom.previewRecommendationLabel.title = recommendation.messageKo;
  dom.previewRecommendationHint.textContent = recommendation.messageKo;
  applyRiskTone(dom.previewRecommendationLabel, recommendation.tone);
  applyRiskTone(dom.previewRecommendationHint, recommendation.tone);
  dom.btnApplyRecommendation.disabled = !recommendationToggle.changed;
  dom.btnApplyRecommendation.title = recommendationToggle.messageKo;
  dom.autoBreakthroughResumeLabel.textContent = autoResumePolicy.labelKo;
  dom.autoBreakthroughResumeLabel.title = autoResumePolicy.messageKo;
  dom.autoBreakthroughResumeHint.textContent = autoResumePolicy.messageKo;
  applyRiskTone(dom.autoBreakthroughResumeLabel, autoResumePolicy.tone);
  applyRiskTone(dom.autoBreakthroughResumeHint, autoResumePolicy.tone);
  dom.btnResumeAutoBreakthrough.disabled = !autoResumePolicy.actionable;
  dom.btnResumeAutoBreakthrough.title = autoResumePolicy.messageKo;
  dom.btnResumeAutoBreakthrough.textContent = autoResumePolicy.actionLabelKo;
  dom.playerNameInput.value = state.playerName;
  dom.optSaveSlot.value = String(activeSaveSlot);
  dom.lastSavedAt.textContent = fmtDateTimeFromIso(state.lastSavedAtIso);
  dom.lastActiveAt.textContent = fmtDateTimeFromEpochMs(state.lastActiveEpochMs);

  const qiRatio = clampPercent((state.currencies.qi / stage.qi_required) * 100);
  dom.qiProgressBar.style.width = `${qiRatio}%`;

  dom.optAutoBattle.checked = state.settings.autoBattle;
  dom.optAutoBreakthrough.checked = state.settings.autoBreakthrough;
  dom.optAutoTribulation.checked = state.settings.autoTribulation;
  dom.optAutoResumeRealtime.checked = state.settings.autoResumeRealtime;
  dom.optAutoBreakthroughResumeWarmupSec.value = String(
    getConfiguredAutoBreakthroughResumeWarmupSec(),
  );
  dom.optBattleSpeed.value = String(state.settings.battleSpeed);
  dom.optOfflineCapHours.value = String(state.settings.offlineCapHours);
  dom.optOfflineEventLimit.value = String(state.settings.offlineEventLimit);
  syncCopySlotTargetSelection();
  syncSlotActionButtons();
  renderLogs();
  renderSaveSlotSummary();
  renderRealtimeSummary();
  syncRealtimeAutoControls();
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
      if (isRealtimeAutoRunning()) {
        stopRealtimeAuto("백그라운드 진입");
      }
      persistLocal();
      render();
      return;
    }

    if (!document.hidden && state && context) {
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
    runBattleOnce(context, state, rng);
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
    const blockedReasonText = formatPolicyBlockReasonSummary(
      summary.breakthroughPolicyBlockReasons,
    );
    const blockedText =
      summary.breakthroughPolicyBlocks > 0
        ? ` · 위험 차단 ${summary.breakthroughPolicyBlocks}회${
            blockedReasonText ? `(${blockedReasonText})` : ""
          }`
        : "";
    const pausedText = summary.autoBreakthroughPaused
      ? ` · 자동돌파 일시정지(${String(summary.autoBreakthroughPauseReasonLabelKo || "정책")})`
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
      offlineCapHours: state.settings.offlineCapHours,
      offlineEventLimit: state.settings.offlineEventLimit,
    });
    lastOfflineReport = null;
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
    dom.savePayload.value = serializeSliceState(state);
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
    resetRealtimeAutoSession();
    restoreSlotLocks();
    restoreSaveSlotPreference();
    let bootstrapStatus = "준비 완료";

    const payload = readActiveSlotPayload();
    const raw = payload.raw;
    if (raw) {
      try {
        state = parseSliceState(raw, context);
        ensureRealtimeStatsShape();
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
