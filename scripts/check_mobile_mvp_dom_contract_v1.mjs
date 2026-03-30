#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

const REQUIRED_HTML_IDS = [
  "appStatus",
  "btnToggleBattleFocus",
  "btnToggleBattleSfx",
  "btnToggleBattleHaptic",
  "battleFocusHint",
  "battleSfxHint",
  "battleHapticHint",
  "stageDisplay",
  "worldTag",
  "difficultyIndex",
  "qiRequired",
  "qiProgressBar",
  "battleSceneArena",
  "battleScenePlayer",
  "battleSceneEnemy",
  "battleScenePlayerHpBar",
  "battleScenePlayerCastBar",
  "battleScenePlayerVitals",
  "battleSceneEnemyHpBar",
  "battleSceneEnemyCastBar",
  "battleSceneEnemyVitals",
  "battleSceneClashCore",
  "battleSceneRoundBadge",
  "battleSceneComboBadge",
  "battleSceneDpsBadge",
  "battleSceneSkillBanner",
  "battleSceneComboBanner",
  "battleSceneShockwaveLayer",
  "battleSceneTicker",
  "statQi",
  "statSpiritCoin",
  "statRebirthEssence",
  "statRebirthCount",
  "invBreakthroughElixir",
  "invTribulationTalisman",
  "previewSuccessPct",
  "previewDeathPct",
  "previewMinorFailPct",
  "previewRetreatFailPct",
  "previewRiskLabel",
  "previewDeathInFailPct",
  "previewExpectedLabel",
  "previewExpectedQiDelta",
  "previewExpectedEssenceDelta",
  "previewExpectedDifficultyDelta",
  "previewMitigationLabel",
  "previewMitigationHint",
  "previewRecommendationLabel",
  "previewRecommendationHint",
  "btnApplyRecommendation",
  "autoBreakthroughResumeLabel",
  "autoBreakthroughResumeHint",
  "btnResumeAutoBreakthrough",
  "optAutoBattle",
  "optAutoBreakthrough",
  "optAutoTribulation",
  "optAutoResumeRealtime",
  "optLowPerformanceBattleScene",
  "optAutoBreakthroughResumeWarmupSec",
  "optBattleSpeed",
  "optOfflineCapHours",
  "optOfflineEventLimit",
  "playerNameInput",
  "optSaveSlot",
  "optCopySlotTarget",
  "slotActionHintBox",
  "slotLockHint",
  "slotTargetHint",
  "slotCopyHint",
  "slotDeleteHint",
  "lastSavedAt",
  "lastActiveAt",
  "savePayload",
  "btnCopySlot",
  "btnToggleSlotLock",
  "btnDeleteSlot",
  "saveSlotSummaryList",
  "btnBattle",
  "btnBreakthrough",
  "btnAuto10s",
  "btnRealtimeAuto",
  "btnResetRun",
  "realtimeAutoStatus",
  "realtimeElapsed",
  "realtimeBattles",
  "realtimeBreakthroughs",
  "realtimeRebirths",
  "btnExportRealtimeReport",
  "btnResetRealtimeStats",
  "btnSaveLocal",
  "btnLoadLocal",
  "btnExportState",
  "btnImportState",
  "eventLogList",
  "offlineModal",
  "offlineAppliedDuration",
  "offlineRawDuration",
  "offlineWarmupSummary",
  "offlineCriticalSummary",
  "offlineCapState",
  "offlineBattleCount",
  "offlineBreakthroughCount",
  "offlineRebirthCount",
  "offlineQiDelta",
  "offlineSpiritDelta",
  "offlineEssenceDelta",
  "btnToggleOfflineDetail",
  "btnToggleOfflineCriticalOnly",
  "btnCopyOfflineCompareCode",
  "offlineCompareCodeInput",
  "btnPasteOfflineCompareCode",
  "btnLoadOfflineCompareCodeFromPayload",
  "btnCompareOfflineCode",
  "btnApplyOfflineCompareViewMode",
  "btnExportOfflineReport",
  "offlineDetailFilterSummary",
  "offlineDetailHiddenSummary",
  "offlineDetailHiddenKindsSummary",
  "offlineDetailCompareCode",
  "offlineCompareCodeResult",
  "offlineCompareCodeActionHint",
  "offlineCompareCodeSource",
  "offlineCompareCodeCurrentSummary",
  "offlineCompareCodeTargetSummary",
  "offlineCompareCodeDeltaSummary",
  "offlineCompareCodeMatchSummary",
  "offlineDetailList",
  "btnCloseOfflineModal",
  "btnRealtimeAuto",
  "realtimeAutoStatus",
  "realtimeElapsed",
  "realtimeBattles",
  "realtimeBreakthroughs",
  "realtimeRebirths",
  "btnExportRealtimeReport",
  "btnResetRealtimeStats",
];

const REQUIRED_DOM_KEYS = [
  "btnToggleBattleFocus",
  "btnToggleBattleSfx",
  "btnToggleBattleHaptic",
  "battleFocusHint",
  "battleSfxHint",
  "battleHapticHint",
  "battleSceneArena",
  "battleScenePlayer",
  "battleSceneEnemy",
  "battleScenePlayerHpBar",
  "battleScenePlayerCastBar",
  "battleScenePlayerVitals",
  "battleSceneEnemyHpBar",
  "battleSceneEnemyCastBar",
  "battleSceneEnemyVitals",
  "battleSceneClashCore",
  "battleSceneRoundBadge",
  "battleSceneComboBadge",
  "battleSceneDpsBadge",
  "battleSceneSkillBanner",
  "battleSceneComboBanner",
  "battleSceneShockwaveLayer",
  "battleSceneTicker",
  "previewMinorFailPct",
  "previewRetreatFailPct",
  "previewRiskLabel",
  "previewDeathInFailPct",
  "previewExpectedLabel",
  "previewExpectedQiDelta",
  "previewExpectedEssenceDelta",
  "previewExpectedDifficultyDelta",
  "previewMitigationLabel",
  "previewMitigationHint",
  "previewRecommendationLabel",
  "previewRecommendationHint",
  "btnApplyRecommendation",
  "autoBreakthroughResumeLabel",
  "autoBreakthroughResumeHint",
  "btnResumeAutoBreakthrough",
  "optAutoResumeRealtime",
  "optLowPerformanceBattleScene",
  "optAutoBreakthroughResumeWarmupSec",
  "optBattleSpeed",
  "optOfflineCapHours",
  "optOfflineEventLimit",
  "optSaveSlot",
  "optCopySlotTarget",
  "slotActionHintBox",
  "slotLockHint",
  "slotTargetHint",
  "slotCopyHint",
  "slotDeleteHint",
  "btnCopySlot",
  "btnToggleSlotLock",
  "btnDeleteSlot",
  "saveSlotSummaryList",
  "offlineModal",
  "offlineAppliedDuration",
  "offlineRawDuration",
  "offlineWarmupSummary",
  "offlineCriticalSummary",
  "offlineCapState",
  "offlineBattleCount",
  "offlineBreakthroughCount",
  "offlineRebirthCount",
  "offlineQiDelta",
  "offlineSpiritDelta",
  "offlineEssenceDelta",
  "btnToggleOfflineDetail",
  "btnToggleOfflineCriticalOnly",
  "btnCopyOfflineCompareCode",
  "offlineCompareCodeInput",
  "btnPasteOfflineCompareCode",
  "btnLoadOfflineCompareCodeFromPayload",
  "btnCompareOfflineCode",
  "btnApplyOfflineCompareViewMode",
  "btnExportOfflineReport",
  "offlineDetailFilterSummary",
  "offlineDetailHiddenSummary",
  "offlineDetailHiddenKindsSummary",
  "offlineDetailCompareCode",
  "offlineCompareCodeResult",
  "offlineCompareCodeActionHint",
  "offlineCompareCodeSource",
  "offlineCompareCodeCurrentSummary",
  "offlineCompareCodeTargetSummary",
  "offlineCompareCodeDeltaSummary",
  "offlineCompareCodeMatchSummary",
  "offlineDetailList",
  "btnCloseOfflineModal",
];

function assertIncludes(text, token, label, failures) {
  if (!text.includes(token)) {
    failures.push(`${label}: missing token "${token}"`);
  }
}

async function main() {
  const htmlPath = resolve(ROOT, "mobile/mvp_v1/index.html");
  const appPath = resolve(ROOT, "mobile/mvp_v1/app.mjs");
  const cssPath = resolve(ROOT, "mobile/mvp_v1/app.css");
  const [html, app, css] = await Promise.all([
    readFile(htmlPath, "utf-8"),
    readFile(appPath, "utf-8"),
    readFile(cssPath, "utf-8"),
  ]);

  const failures = [];

  assertIncludes(
    html,
    'name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'meta name="theme-color"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-actor-frame="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-hp-tier="safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-cast-tier="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-hp-pct="100"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-cast-pct="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-pressure="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-loop="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-world="true"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-tier="novice"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-performance="normal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-outcome-priority="normal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-impact-cue="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-impact-kinetic="normal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-impact-vfx="normal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-player-frame="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-enemy-frame="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-player-hp-tier="safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-player-cast-tier="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-enemy-hp-tier="safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-enemy-cast-tier="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-player-hp-pct="100"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-player-cast-pct="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-enemy-hp-pct="100"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-enemy-cast-pct="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-round="1"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-combo-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-dps-score="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="battleSceneStatus"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="battleSceneResult"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-message-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-message-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-message-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="battleSceneTicker"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-message-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-queue-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-round="1"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-loop="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-tier="calm"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-dps-score="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-pressure="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-banner-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-banner-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-banner-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-banner-actor="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-skill-label="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-tier="flow"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-pressure="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-combo-tier="calm"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-lead="even"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-danger="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-lead-effect="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-pressure-effect="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-danger-effect="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-combo-effect="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-lock="free"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-gate="no_signal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-fresh="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-active="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-recovery-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-cadence-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-cadence-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-cadence-divisor="2"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-probability-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-probability-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-probability-scale-pct="100"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-kind-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-kind-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-outcome-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-sync-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-sync-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-sync-duel="on"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-residue-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-residue-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-residue-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-residue-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-residue-sync-duel="on"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-residue-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-quiet-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-quiet-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-quiet-threshold-ms="2200"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-recovery-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-recovery-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-random-recovery-max-ms="1400"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-seq="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-sync-duel="off"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-age-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-recovery-max-ms="1400"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-quiet-threshold-ms="2200"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-recovery-remaining-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-quiet-remaining-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-gate="no_signal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-fresh="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-active="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-gate="no_signal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-fresh="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-explicit-active="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-sync-duel="off"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-explicit-seq="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-signal-age-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-signal-age-max-ms="6800"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-replay-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-replay-max="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-replay-remaining="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-cooldown-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-cooldown-max-ms="960"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-priority-remaining-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-priority-max-ms="6800"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-gate="no_signal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-fresh="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-result-active="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-signal-seq="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-origin-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-origin-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-origin-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-origin-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-origin-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-origin-sync-duel="off"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-sync-duel="off"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-replay="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-replay-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-replay-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-replay-max="3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-replay-remaining="3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-cooldown-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-cooldown-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-cooldown-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-cooldown-max-ms="960"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-priority-remaining-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-priority-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-priority-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-priority-max-ms="6800"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-signal-age-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-signal-age-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-signal-age-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-ambient-impact-signal-age-max-ms="6800"',
    "index.html",
    failures,
  );

  for (const id of REQUIRED_HTML_IDS) {
    assertIncludes(html, `id="${id}"`, "index.html", failures);
  }

  for (const key of REQUIRED_DOM_KEYS) {
    assertIncludes(app, `${key}: document.getElementById("${key}")`, "app.mjs", failures);
  }

  assertIncludes(app, "function showOfflineModal(", "app.mjs", failures);
  assertIncludes(app, "function hideOfflineModal(", "app.mjs", failures);
  assertIncludes(app, "function exportOfflineReportToPayload(", "app.mjs", failures);
  assertIncludes(app, "function exportRealtimeReportToPayload(", "app.mjs", failures);
  assertIncludes(app, "function setOfflineDetailExpanded(", "app.mjs", failures);
  assertIncludes(app, "function applyBattleFocusMode(", "app.mjs", failures);
  assertIncludes(app, "function renderBattleSfxControl(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSfxAmbientCue(", "app.mjs", failures);
  assertIncludes(app, "function playBattleSfx(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSfxEnabled(", "app.mjs", failures);
  assertIncludes(app, "function renderBattleHapticControl(", "app.mjs", failures);
  assertIncludes(app, "function playBattleHaptic(", "app.mjs", failures);
  assertIncludes(app, "function setBattleHapticEnabled(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneCameraShake(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneZoomPulse(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneHitStop(", "app.mjs", failures);
  assertIncludes(app, "function maybeTriggerBattleSceneLeadSwing(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneLeadResonance(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleScenePressureSpike(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleScenePressureResonance(", "app.mjs", failures);
  assertIncludes(app, "function maybeTriggerBattleScenePressureTransition(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneDangerPulse(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneDangerResonance(", "app.mjs", failures);
  assertIncludes(app, "function maybeTriggerBattleSceneDangerTransition(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneComboSurge(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneComboCooldown(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneComboResonance(", "app.mjs", failures);
  assertIncludes(app, "function maybeTriggerBattleSceneComboTierTransition(", "app.mjs", failures);
  assertIncludes(app, "function applyBattleSceneOutcomeDuelTransitions(", "app.mjs", failures);
  assertIncludes(app, "function syncBattleSceneDuelFromImpact(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneEventSignalScore(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneEventSignalFromCollectedEvents(", "app.mjs", failures);
  assertIncludes(
    app,
    "function buildBattleSceneCollectedEventFromAutoSummaryLastEngineOutcome(",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "function resolveBattleSceneEventSignalFromAutoSummary(", "app.mjs", failures);
  assertIncludes(app, "summary.lastEngineOutcome", "app.mjs", failures);
  assertIncludes(app, 'kind === "breakthrough_blocked_no_qi"', "app.mjs", failures);
  assertIncludes(app, 'kind === "breakthrough_blocked_tribulation_setting"', "app.mjs", failures);
  assertIncludes(app, 'outcomeCode === "blocked_tribulation_setting"', "app.mjs", failures);
  assertIncludes(app, 'outcomeCode === "blocked_auto_risk_policy"', "app.mjs", failures);
  assertIncludes(app, 'autoPolicyReason === "blocked_extreme_risk"', "app.mjs", failures);
  assertIncludes(app, 'autoPolicyReason === "blocked_high_qi_cost"', "app.mjs", failures);
  assertIncludes(app, "pausedByPolicy", "app.mjs", failures);
  assertIncludes(app, "pauseThreshold", "app.mjs", failures);
  assertIncludes(app, "blockedQiDeficit", "app.mjs", failures);
  assertIncludes(app, "successQiConsume", "app.mjs", failures);
  assertIncludes(app, "outcome.requiredQi", "app.mjs", failures);
  assertIncludes(app, "outcome.difficultyIndex", "app.mjs", failures);
  assertIncludes(app, "outcome.stageQiRequired", "app.mjs", failures);
  assertIncludes(app, "outcome.fromDifficultyIndex", "app.mjs", failures);
  assertIncludes(app, "outcome.toDifficultyIndex", "app.mjs", failures);
  assertIncludes(app, "resetStageNameKo", "app.mjs", failures);
  assertIncludes(app, "event?.stageQiRequired", "app.mjs", failures);
  assertIncludes(app, "kind === \"breakthrough_retreat_fail\"", "app.mjs", failures);
  assertIncludes(app, '"도겁 자동 허용 꺼짐"', "app.mjs", failures);
  assertIncludes(app, "breakthroughNoQiBlocks", "app.mjs", failures);
  assertIncludes(app, "breakthroughTribulationSettingBlocks", "app.mjs", failures);
  assertIncludes(app, "autoBreakthroughPauseNextActionKo", "app.mjs", failures);
  assertIncludes(app, "autoBreakthroughPauseThreshold", "app.mjs", failures);
  assertIncludes(app, "autoBreakthroughPauseConsecutiveBlocks", "app.mjs", failures);
  assertIncludes(app, "const BATTLE_SCENE_RESULT_PRIORITY_WINDOW_MS = 2600;", "app.mjs", failures);
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_SUPPRESSION_WINDOW_MS = 6200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_DECORATION_SUPPRESSION_WINDOW_MS = 3800;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_SHORT_SUMMARY_DIRECT_SIGNAL_MAX_SECONDS = 12;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_DUEL_TICK_DIVISOR = 2;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_STRIKE_CHANCE_SCALE = 0.42;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_DUEL_HOLD_WINDOW_MS = 1800;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_NARRATIVE_SUPPRESSION_WINDOW_MS = 5200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_SFX_SUPPRESSION_WINDOW_MS = 5600;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_SFX_DIVISOR = 3;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_TRANSITION_DIVISOR = 4;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_COMBO_BANNER_MIN_COMBO = 9;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_PRIORITY_ACTOR_FRAME_SUPPRESSION_WINDOW_MS = 5400;",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "battleSceneLastResultDrivenImpactAtMs", "app.mjs", failures);
  assertIncludes(
    app,
    "summarySeconds <= BATTLE_SCENE_SHORT_SUMMARY_DIRECT_SIGNAL_MAX_SECONDS",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "function resolveBattleSceneImpactOptionsFromAutoSummary(", "app.mjs", failures);
  assertIncludes(app, "resultPrioritySuppressed", "app.mjs", failures);
  assertIncludes(app, "function spawnBattleSceneShockwave(", "app.mjs", failures);
  assertIncludes(app, "function maybeSpawnBattleSceneCastTelegraph(", "app.mjs", failures);
  assertIncludes(app, "function maybeSpawnBattleSceneChargeMote(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneComboBanner(", "app.mjs", failures);
  assertIncludes(
    app,
    "function applyBattleSceneDuelBurst(attacker, mode = \"idle\", visuals = true, options = {})",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function applyBattleSceneDuelStrike(attacker, mode = \"idle\", visuals = true, options = {})",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "function runBattleSceneDuelTick(", "app.mjs", failures);
  assertIncludes(app, "resultPrioritySuppressed: prioritizeOutcomeSignals", "app.mjs", failures);
  assertIncludes(
    app,
    "battleSceneAmbientStep % BATTLE_SCENE_RESULT_PRIORITY_DUEL_TICK_DIVISOR === 0",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "baseStrikeChance * BATTLE_SCENE_RESULT_PRIORITY_STRIKE_CHANCE_SCALE",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "holdDuelTickByOutcome", "app.mjs", failures);
  assertIncludes(app, "suppressAmbientNarrative", "app.mjs", failures);
  assertIncludes(app, "suppressAmbientSfx", "app.mjs", failures);
  assertIncludes(app, "shouldPlayAmbientSfx", "app.mjs", failures);
  assertIncludes(app, "allowAmbientTransitions", "app.mjs", failures);
  assertIncludes(app, "suppressAmbientActorFrames", "app.mjs", failures);
  assertIncludes(
    app,
    "battleSceneAmbientStep % BATTLE_SCENE_RESULT_PRIORITY_TRANSITION_DIVISOR === 0",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "shouldShowComboBanner", "app.mjs", failures);
  assertIncludes(
    app,
    "battleSceneAmbientStep % BATTLE_SCENE_RESULT_PRIORITY_AMBIENT_SFX_DIVISOR === 0",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "dataset.sceneOutcomePriority", "app.mjs", failures);
  assertIncludes(app, '? "narrative"', "app.mjs", failures);
  assertIncludes(app, "function pushBattleSceneTicker(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneSkillBanner(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneActorFrame(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneImpactActorFrameCue(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneImpactKineticCue(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneImpactVfxCue(", "app.mjs", failures);
  assertIncludes(app, "function resetBattleSceneActorFrames(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneImpactCue(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneImpactKinetic(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneImpactVfx(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactSource(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactLock(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactGate(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactFresh(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactSequence(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactSignal(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomState(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomRecoverySource(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomCadence(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomProbability(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomKindProfile(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomOutcomeProfile(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomSyncPolicy(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomResidue(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomQuietThreshold(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneAmbientRandomImpactDivisor(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneAmbientRandomImpactProbabilityScale(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneAmbientRandomImpactKindProfile(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneAmbientRandomOutcomeProfile(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneAmbientRandomSyncDuel(", "app.mjs", failures);
  assertIncludes(app, "function rollBattleSceneAmbientRandomImpact(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneAmbientRandomQuietThresholdMs(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneAmbientRandomRecoveryWindowMs(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactRandomRecovery(", "app.mjs", failures);
  assertIncludes(
    app,
    "function isBattleSceneResultDrivenAmbientImpactSignalStale(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function resolveBattleSceneResultDrivenAmbientImpactGate(",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "function resolveBattleSceneResultDrivenAmbientImpactSignal(", "app.mjs", failures);
  assertIncludes(app, "function triggerBattleSceneImpactVfxFromCue(", "app.mjs", failures);
  assertIncludes(app, "const impactActorFrameCue = applyBattleSceneImpactActorFrames(kind, options);", "app.mjs", failures);
  assertIncludes(app, "const impactKineticCue = resolveBattleSceneImpactKineticCue(kind, options);", "app.mjs", failures);
  assertIncludes(app, "const impactVfxCue = resolveBattleSceneImpactVfxCue(kind, options);", "app.mjs", failures);
  assertIncludes(app, "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS = 6800;", "app.mjs", failures);
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE = 6200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_WIN = 6800;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_LOSS = 6200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_LOSS_HEAVY = 5400;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_SUCCESS =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_FAIL_MINOR =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_FAIL_HEAVY =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_BLOCKED =",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR = 2;", "app.mjs", failures);
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE = 3;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH = 4;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_WIN = 4;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_LOSS = 5;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BATTLE_LOSS_HEAVY = 6;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_SUCCESS = 5;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_FAIL_MINOR = 6;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_FAIL_HEAVY = 7;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_DIVISOR_BREAKTHROUGH_BLOCKED = 6;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE = 1;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE = 0.82;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH = 0.64;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_WIN = 0.76;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_LOSS = 0.58;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BATTLE_LOSS_HEAVY = 0.36;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_SUCCESS =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_FAIL_MINOR =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_FAIL_HEAVY =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_IMPACT_PROBABILITY_SCALE_BREAKTHROUGH_BLOCKED =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS = 2200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE = 2600;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH = 3200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_WIN = 2800;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_LOSS = 3400;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BATTLE_LOSS_HEAVY = 4000;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_SUCCESS = 3600;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_FAIL_MINOR =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_FAIL_HEAVY =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_QUIET_THRESHOLD_MS_BREAKTHROUGH_BLOCKED =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS = 3;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE = 2;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH = 4;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_WIN = 3;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_LOSS = 2;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_LOSS_HEAVY = 1;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_SUCCESS = 5;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_FAIL_MINOR = 4;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_FAIL_HEAVY = 2;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_BLOCKED = 1;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS = 960;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE = 1080;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH = 840;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_WIN = 900;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_LOSS = 1200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_LOSS_HEAVY = 1500;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_SUCCESS = 720;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_FAIL_MINOR = 960;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_FAIL_HEAVY = 1260;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_BLOCKED = 1320;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS = 1400;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE = 1200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH = 1800;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_WIN = 1000;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_LOSS = 1600;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BATTLE_LOSS_HEAVY = 2200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_SUCCESS = 1500;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_FAIL_MINOR = 2400;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_FAIL_HEAVY = 3200;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "const BATTLE_SCENE_AMBIENT_RANDOM_RECOVERY_WINDOW_MS_BREAKTHROUGH_BLOCKED = 2600;",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "syncDuel: false", "app.mjs", failures);
  assertIncludes(
    app,
    "function resolveBattleSceneResultDrivenAmbientImpactReplayMax(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function resolveBattleSceneResultDrivenAmbientImpactReplayMinIntervalMs(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function resolveBattleSceneResultDrivenAmbientImpactPriorityWindowMs(",
    "app.mjs",
    failures,
  );
  assertIncludes(app, "function setBattleSceneAmbientImpactReplay(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactCooldown(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactPriorityWindow(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactSignalAge(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneAmbientImpactActive(", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastResultDrivenImpactReplayCount += 1;", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastResultDrivenImpactReplayAtMs = now;", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactReplay(0);", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactCooldown(0);", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactPriorityWindow(0);", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactSignalAge(0);", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneLoop", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneWorld", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneTier", "app.mjs", failures);
  assertIncludes(app, "dataset.scenePerformance", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneOutcomePriority", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneImpactCue", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneImpactKinetic", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneImpactVfx", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpact", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactLock", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactGate", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactFresh", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactActive", "app.mjs", failures);
  assertIncludes(app, "dataset.scenePlayerFrame", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneEnemyFrame", "app.mjs", failures);
  assertIncludes(app, "dataset.scenePlayerHpTier", "app.mjs", failures);
  assertIncludes(app, "dataset.scenePlayerCastTier", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneEnemyHpTier", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneEnemyCastTier", "app.mjs", failures);
  assertIncludes(app, "dataset.scenePlayerHpPct", "app.mjs", failures);
  assertIncludes(app, "dataset.scenePlayerCastPct", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneEnemyHpPct", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneEnemyCastPct", "app.mjs", failures);
  assertIncludes(app, "dataset.hpTier", "app.mjs", failures);
  assertIncludes(app, "dataset.castTier", "app.mjs", failures);
  assertIncludes(app, "dataset.hpPct", "app.mjs", failures);
  assertIncludes(app, "dataset.castPct", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneRound", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneComboCount", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneDpsScore", "app.mjs", failures);
  assertIncludes(app, "dataset.tone", "app.mjs", failures);
  assertIncludes(app, "dataset.bannerState", "app.mjs", failures);
  assertIncludes(app, "dataset.tier", "app.mjs", failures);
  assertIncludes(app, "dataset.scenePressure", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneComboTier", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneLead", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneDanger", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneLeadEffect", "app.mjs", failures);
  assertIncludes(app, "dataset.scenePressureEffect", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneDangerEffect", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneComboEffect", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomState", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomRecoverySource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomCadenceSource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomCadenceOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomCadenceDivisor", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomProbabilitySource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomProbabilityOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomProbabilityScalePct", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomSyncOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomQuietOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomRecoveryOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomRecoveryMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomRecoveryMaxMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomKind", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomTone", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomResidueKind", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomResidueTone", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomResidueOutcomeCode", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitSeq", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitSource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitKind", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitTone", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitOutcomeCode", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitSyncDuel", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitAgeMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitRecoveryMaxMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitQuietThresholdMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitRecoveryRemainingMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitQuietRemainingMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitGate", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitFresh", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitActive", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitGate", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitFresh", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactExplicitActive", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultSource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultKind", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultTone", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultOutcomeCode", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultSyncDuel", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultExplicitSeq", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultSignalAgeMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultSignalAgeMaxMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultReplayCount", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultReplayMax", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultReplayRemaining", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultCooldownMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultCooldownMaxMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultPriorityRemainingMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultPriorityMaxMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultGate", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultFresh", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactResultActive", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactSignalSeq", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactSource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactOriginSource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactOriginKind", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactOriginTone", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactOriginOutcomeCode", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactOriginOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactOriginSyncDuel", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactRandomOutcomeCode", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactKind", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactTone", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactOutcomeCode", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactSyncDuel", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactReplay", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactReplaySource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactReplayOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactReplayMax", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactReplayRemaining", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactCooldownMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactCooldownSource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactCooldownOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactCooldownMaxMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactPriorityRemainingMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactPrioritySource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactPriorityOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactPriorityMaxMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactSignalAgeSource", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactSignalAgeOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactSignalAgeMs", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneAmbientImpactSignalAgeMaxMs", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastResultDrivenImpactSignalExplicitAtMs", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastExplicitEventSeq", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastExplicitEventKind", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastExplicitEventTone", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastExplicitEventOutcomeCode", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastExplicitEventOutcomeProfile", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastResultDrivenImpactSignalExplicitSeq", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastExplicitEventSeq += 1;", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastResultDrivenImpactSignalExplicitSeq =", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastResultDrivenImpactSignalExplicitSeq !==", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactSequence(", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactSequence(0, 0);", "app.mjs", failures);
  assertIncludes(app, "const resultDrivenImpactGate =", "app.mjs", failures);
  assertIncludes(app, "const resultDrivenImpactGateReason =", "app.mjs", failures);
  assertIncludes(app, "const resultDrivenAmbientReplayMinIntervalMs =", "app.mjs", failures);
  assertIncludes(app, "const staleResultDrivenImpactSignal =", "app.mjs", failures);
  assertIncludes(app, 'resultDrivenImpactGateReason === "stale_sequence"', "app.mjs", failures);
  assertIncludes(app, "const suppressRandomByResultGate =", "app.mjs", failures);
  assertIncludes(app, "const randomRecoverySource =", "app.mjs", failures);
  assertIncludes(app, "const randomImpactCadenceDivisor =", "app.mjs", failures);
  assertIncludes(app, "const randomImpactProbabilityScale =", "app.mjs", failures);
  assertIncludes(app, "resolveBattleSceneAmbientRandomImpactProbabilityScale(", "app.mjs", failures);
  assertIncludes(app, "const randomRecoveryMaxMs =", "app.mjs", failures);
  assertIncludes(app, "const randomRecoveryRemainingMs =", "app.mjs", failures);
  assertIncludes(app, "const suppressRandomByRecoveryWindow =", "app.mjs", failures);
  assertIncludes(app, 'resultDrivenImpactGateReason === "replay_cooldown"', "app.mjs", failures);
  assertIncludes(app, 'resultDrivenImpactGateReason === "replay_exhausted"', "app.mjs", failures);
  assertIncludes(app, "const hasResultDrivenAmbientImpactSignal = !!resultDrivenImpactSignal;", "app.mjs", failures);
  assertIncludes(app, "const allowRandomAmbientImpact =", "app.mjs", failures);
  assertIncludes(app, "!suppressRandomByResultGate &&", "app.mjs", failures);
  assertIncludes(app, "!suppressRandomByRecoveryWindow", "app.mjs", failures);
  assertIncludes(app, "const randomAmbientImpactChance =", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactRandomRecovery(", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactRandomRecoverySource(", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactRandomCadence(", "app.mjs", failures);
  assertIncludes(app, "setBattleSceneAmbientImpactRandomProbability(", "app.mjs", failures);
  assertIncludes(app, "resultDrivenImpactGate.cooldownRemainingMs", "app.mjs", failures);
  assertIncludes(app, "resultDrivenImpactGate.cooldownMaxMs", "app.mjs", failures);
  assertIncludes(app, "resultDrivenImpactGate.priorityRemainingMs", "app.mjs", failures);
  assertIncludes(app, "resultDrivenImpactGate.priorityMaxMs", "app.mjs", failures);
  assertIncludes(app, "const resultDrivenAmbientPrioritySource =", "app.mjs", failures);
  assertIncludes(app, "const resultDrivenAmbientPriorityOutcomeProfile =", "app.mjs", failures);
  assertIncludes(app, "const resultDrivenAmbientSignalAgeSource =", "app.mjs", failures);
  assertIncludes(app, "const resultDrivenAmbientSignalAgeOutcomeProfile =", "app.mjs", failures);
  assertIncludes(app, "resultDrivenImpactGate.signalAgeMs", "app.mjs", failures);
  assertIncludes(app, "resultDrivenImpactGate.signalAgeMaxMs", "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactLock("result")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactLock("free")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactGate("fresh")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactGate("stale_sequence")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactGate("no_signal")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactFresh("fresh")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactFresh("stale")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactFresh("none")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactActive("signal")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactActive("none")', "app.mjs", failures);
  assertIncludes(
    app,
    'setBattleSceneAmbientImpactRandomState("suppressed_result_signal")',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    '"suppressed_replay_cooldown"',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    '"suppressed_replay_exhausted"',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    '"suppressed_recovery_window"',
    "app.mjs",
    failures,
  );
  assertIncludes(app, 'stateInput === "ready"', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomState("triggered")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomState("idle")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomRecoverySource("none")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomCadence(', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomProbability(', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomKindProfile(', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomOutcomeProfile(', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomSyncPolicy(', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomResidue(', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactRandomQuietThreshold(', "app.mjs", failures);
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomKindProfile = profile;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomOutcomeProfile = profile;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomOutcomeSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomKindSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomKind = kind;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomTone = tone;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.scenePlayerFrame = frame;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneEnemyFrame = frame;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.scenePlayerHpTier = playerHpTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.scenePlayerCastTier = playerCastTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneEnemyHpTier = enemyHpTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneEnemyCastTier = enemyCastTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneLoop = String(loopMode || "idle");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneWorld = normalizeBattleSceneWorld(stage?.world);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneTier = resolveBattleSceneTier(stage);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.scenePerformance = lowPerformanceMode ? "low" : "normal";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneOutcomePriority = holdDuelTickByOutcome',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.scenePlayerHpPct = String(playerHpPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.scenePlayerCastPct = String(playerCastPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneEnemyHpPct = String(enemyHpPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneEnemyCastPct = String(enemyCastPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayer.dataset.hpTier = playerHpTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayer.dataset.castTier = playerCastTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayer.dataset.hpPct = String(playerHpPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayer.dataset.castPct = String(playerCastPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemy.dataset.hpTier = enemyHpTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemy.dataset.castTier = enemyCastTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemy.dataset.hpPct = String(enemyHpPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemy.dataset.castPct = String(enemyCastPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneRound = String(battleSceneDuelState.round);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneRoundBadge.dataset.round = String(battleSceneDuelState.round);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneRoundBadge.dataset.loop = loopMode;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneComboCount = String(battleSceneDuelState.combo);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneComboBadge.dataset.comboTier = comboTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBadge.dataset.comboCount = String(battleSceneDuelState.combo);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneDpsScore = String(pressureScore);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneDpsBadge.dataset.dpsScore = String(pressureScore);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneDpsBadge.dataset.pressure = battleSceneDuelState.pressure;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "node.dataset.tone = normalizedTone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneStatus.dataset.messageState =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneStatus.dataset.messageSource = normalizeBattleSceneMessageSource(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneStatus.dataset.messageKey = normalizeBattleSceneMessageKey(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneResult.dataset.messageState =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneResult.dataset.messageKey = normalizeBattleSceneMessageKey(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneResult.dataset.messageSource = normalizeBattleSceneMessageSource(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneTicker.dataset.messageState = "idle";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneTicker.dataset.messageSource = "idle";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneTicker.dataset.messageKey = "idle";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneTicker.dataset.messageState = "active";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneTicker.dataset.messageKey = normalizeBattleSceneMessageKey(latest.key);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneTicker.dataset.messageSource = normalizeBattleSceneMessageSource(latest.source);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneTicker.dataset.queueCount = String(battleSceneTickerState.items.length);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'key: normalizeBattleSceneMessageKey(key || `${normalizedSource}_ticker`),',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "source: normalizedSource,",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "pushBattleSceneTicker(tickerText, tickerTone, source, tickerKey);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneSkillBanner.dataset.bannerState = "active";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneSkillBanner.dataset.bannerSource = normalizeBattleSceneMessageSource(source);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneSkillBanner.dataset.bannerKey = bannerKey;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneSkillBanner.dataset.bannerActor = bannerActor;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneSkillBanner.dataset.skillLabel = skillLabel;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBanner.dataset.bannerState = "active";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBanner.dataset.bannerSource = normalizeBattleSceneMessageSource(source);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBanner.dataset.bannerKey =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBanner.dataset.tier = tier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBanner.dataset.comboCount = String(combo);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBanner.dataset.bannerSource = "idle";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBanner.dataset.bannerKey = "idle";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneComboBanner.dataset.comboCount = "0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.scenePressure = battleSceneDuelState.pressure;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneComboTier = sceneComboTier;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneLead = sceneLead;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneDanger = sceneDanger;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneLeadEffect = state;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.scenePressureEffect = state;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneDangerEffect = state;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneComboEffect = state;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomSyncDuel = syncDuel;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomSyncSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomSyncOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomCadenceOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomProbabilityOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomQuietOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomRecoveryOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueKind = kind;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueTone = tone;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueOutcomeCode =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueSyncDuel =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomResidueOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(app, "residueOriginKind:", "app.mjs", failures);
  assertIncludes(app, "residueOriginTone:", "app.mjs", failures);
  assertIncludes(app, "residueOutcomeCode:", "app.mjs", failures);
  assertIncludes(app, "battleSceneLastExplicitEventSyncDuel", "app.mjs", failures);
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitKind = kind;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitTone = tone;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitOutcomeCode =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitSyncDuel = syncDuel;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitAgeMs = String(ageMs);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitRecoveryMaxMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitQuietThresholdMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitRecoveryRemainingMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitQuietRemainingMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitGate = gate;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitFresh = fresh;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitActive = active;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitGate = gate;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitFresh = fresh;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactExplicitActive = active;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultKind = kind;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultTone = tone;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultOutcomeCode =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultSyncDuel = syncDuel;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultExplicitSeq =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultSignalAgeMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultSignalAgeMaxMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultReplayCount =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultReplayMax =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultReplayRemaining =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultCooldownMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultCooldownMaxMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultPriorityRemainingMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultPriorityMaxMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultGate = gate;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultFresh = fresh;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactResultActive = active;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactOriginOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactOriginSyncDuel =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomOutcomeCode =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactReplaySource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactReplayOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactCooldownSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactCooldownOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactPrioritySource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactPriorityOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactSignalAgeSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactSignalAgeOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactOriginSource = originSource;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactOriginKind = originKind;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactOriginTone = originTone;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactOriginOutcomeCode =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactTone = signalTone;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactSyncDuel = signalSyncDuel;',
    "app.mjs",
    failures,
  );
  assertIncludes(app, "syncDuel,", "app.mjs", failures);
  assertIncludes(
    app,
    'const explicitRandomOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'battleSceneLastExplicitEventOutcomeProfile = explicitRandomOutcomeProfile;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'const randomKindProfile = resolveBattleSceneAmbientRandomImpactKindProfile(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'const randomOutcomeProfile =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'hasResultDrivenAmbientImpactSignal && resultDrivenImpactSignal',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'resolveBattleSceneAmbientRandomOutcomeProfile(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'const randomSyncDuel = resolveBattleSceneAmbientRandomSyncDuel(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'const randomRecoveryMaxMs = resolveBattleSceneAmbientRandomRecoveryWindowMs(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'battleSceneLastExplicitEventOutcomeProfile',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'const randomImpactDescriptor = rollBattleSceneAmbientRandomImpact(',
    "app.mjs",
    failures,
  );
  assertIncludes(app, 'profile === "battle_bias"', "app.mjs", failures);
  assertIncludes(app, '"battle_win_bias"', "app.mjs", failures);
  assertIncludes(app, '"battle_loss_bias"', "app.mjs", failures);
  assertIncludes(app, '"battle_loss_heavy_bias"', "app.mjs", failures);
  assertIncludes(app, 'profile === "breakthrough_bias"', "app.mjs", failures);
  assertIncludes(app, '"breakthrough_success_bias"', "app.mjs", failures);
  assertIncludes(app, '"breakthrough_fail_minor_bias"', "app.mjs", failures);
  assertIncludes(app, '"breakthrough_fail_heavy_bias"', "app.mjs", failures);
  assertIncludes(app, '"breakthrough_blocked_bias"', "app.mjs", failures);
  assertIncludes(app, 'outcomeProfile === "battle_loss_heavy"', "app.mjs", failures);
  assertIncludes(app, 'outcomeProfile === "breakthrough_fail_heavy"', "app.mjs", failures);
  assertIncludes(app, 'outcomeProfile === "breakthrough_blocked"', "app.mjs", failures);
  assertIncludes(
    app,
    'const outcomeProfile =\n    resolveBattleSceneResultDrivenAmbientImpactOutcomeProfile(signal);',
    "app.mjs",
    failures,
  );
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_WIN;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BATTLE_LOSS_HEAVY;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_SUCCESS;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MIN_INTERVAL_MS_BREAKTHROUGH_BLOCKED;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_WIN;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BATTLE_LOSS_HEAVY;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_SUCCESS;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_PRIORITY_WINDOW_MS_BREAKTHROUGH_BLOCKED;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_WIN;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BATTLE_LOSS_HEAVY;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_SUCCESS;', "app.mjs", failures);
  assertIncludes(app, 'return BATTLE_SCENE_RESULT_DRIVEN_AMBIENT_IMPACT_MAX_REPLAYS_BREAKTHROUGH_BLOCKED;', "app.mjs", failures);
  assertIncludes(app, 'return outcomeProfile === "battle_loss_heavy" ? false : true;', "app.mjs", failures);
  assertIncludes(app, 'return outcomeProfile === "breakthrough_success";', "app.mjs", failures);
  assertIncludes(
    app,
    'signal?.residueSource === "battle" || signal?.residueSource === "breakthrough"',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'const residueSyncDuel = source === "random" ? signal?.syncDuel !== false : true;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'signal?.residueOutcomeProfile === "battle_win"',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'residueSource: randomRecoverySource || "none"',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'residueOutcomeProfile: outcomeProfile,',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomQuietSource = source;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneArena.dataset.sceneAmbientImpactRandomQuietThresholdMs =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'const randomQuietThresholdMs = resolveBattleSceneAmbientRandomQuietThresholdMs(',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'const ambientImpactQuietThresholdMs = useResultDrivenAmbientImpact',
    "app.mjs",
    failures,
  );
  assertIncludes(app, 'cue: "breakthrough_retreat_fail"', "app.mjs", failures);
  assertIncludes(app, 'cue: "breakthrough_death_fail"', "app.mjs", failures);
  assertIncludes(app, 'cue: "battle_win_dominant"', "app.mjs", failures);
  assertIncludes(app, 'cue: "battle_loss_crushing"', "app.mjs", failures);
  assertIncludes(app, 'cue: "breakthrough_success_peak"', "app.mjs", failures);
  assertIncludes(app, 'cue: "breakthrough_blocked_auto_risk_pause"', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactSource("result")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactSource("random")', "app.mjs", failures);
  assertIncludes(app, 'setBattleSceneAmbientImpactSignal(null, "idle")', "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneCastTier(", "app.mjs", failures);
  assertIncludes(app, "function isBattleSceneLowPerformanceModeEnabled(", "app.mjs", failures);
  assertIncludes(app, "function resolveBattleSceneAmbientPulseDivisor(", "app.mjs", failures);
  assertIncludes(app, "function startRealtimeAuto(", "app.mjs", failures);
  assertIncludes(app, "function stopRealtimeAuto(", "app.mjs", failures);
  assertIncludes(css, ".focus-controls", "app.css", failures);
  assertIncludes(css, "#btnToggleBattleSfx[aria-pressed=\"true\"]", "app.css", failures);
  assertIncludes(css, "#btnToggleBattleHaptic[aria-pressed=\"true\"]", "app.css", failures);
  assertIncludes(css, ".app.battle-focus-mode .panel[data-panel-role=\"secondary\"]", "app.css", failures);
  assertIncludes(css, ".battle-actor-hp-track", "app.css", failures);
  assertIncludes(css, ".battle-scene-clash-core", "app.css", failures);
  assertIncludes(css, ".battle-scene-top-hud", "app.css", failures);
  assertIncludes(css, ".battle-scene-skill-banner", "app.css", failures);
  assertIncludes(css, ".battle-scene-combo-banner", "app.css", failures);
  assertIncludes(css, ".battle-scene-ticker", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-shake-heavy", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-zoom-burst", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-hit-stop-heavy", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-lead-swing-player", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-lead-resonance-player", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-pressure-spike-high", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-pressure-resonance-high", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-danger-pulse-both", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-danger-resonance-both", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-combo-surge-frenzy", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-combo-cooldown-calm", "app.css", failures);
  assertIncludes(css, ".battle-scene-arena.scene-combo-resonance-frenzy", "app.css", failures);
  assertIncludes(css, ".battle-scene-shockwave-layer", "app.css", failures);
  assertIncludes(css, ".battle-shockwave.variant-telegraph", "app.css", failures);
  assertIncludes(css, ".battle-charge-mote", "app.css", failures);
  assertIncludes(css, ".battle-actor[data-actor-frame=\"attack\"]", "app.css", failures);
  assertIncludes(css, ".battle-actor[data-cast-tier=\"full\"]", "app.css", failures);
  assertIncludes(css, "[data-scene-combo-tier=\"frenzy\"]", "app.css", failures);
  assertIncludes(css, "@keyframes battle-avatar-frame-skill", "app.css", failures);
  assertIncludes(css, "@keyframes battle-cast-charge", "app.css", failures);
  assertIncludes(css, "battle_avatar_cultivator_skill.svg", "app.css", failures);
  assertIncludes(css, "battle_avatar_guardian_hit.svg", "app.css", failures);
  assertIncludes(css, ".offline-modal", "app.css", failures);
  assertIncludes(css, ".offline-compare-result.tone-error", "app.css", failures);
  assertIncludes(css, ".offline-compare-current-summary.tone-error", "app.css", failures);
  assertIncludes(css, ".offline-compare-target-summary.tone-error", "app.css", failures);
  assertIncludes(css, ".offline-compare-delta-summary.tone-error", "app.css", failures);
  assertIncludes(css, ".offline-compare-match-summary.tone-error", "app.css", failures);
  assertIncludes(css, ".offline-compare-source.tone-error", "app.css", failures);
  assertIncludes(css, ".offline-compare-action-hint.tone-error", "app.css", failures);
  assertIncludes(css, ".actions {", "app.css", failures);
  assertIncludes(css, "env(safe-area-inset-bottom)", "app.css", failures);

  if (failures.length > 0) {
    for (const line of failures) {
      process.stdout.write(`[fail] ${line}\n`);
    }
    throw new Error(`mobile mvp dom contract check failed: ${failures.length} issue(s)`);
  }

  process.stdout.write("all mobile mvp dom contract checks passed\n");
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack || err.message : String(err)}\n`);
  process.exitCode = 1;
});
