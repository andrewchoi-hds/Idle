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
  assertIncludes(app, "function resetBattleSceneActorFrames(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneImpactCue(", "app.mjs", failures);
  assertIncludes(app, "function setBattleSceneImpactKinetic(", "app.mjs", failures);
  assertIncludes(app, "const impactActorFrameCue = applyBattleSceneImpactActorFrames(kind, options);", "app.mjs", failures);
  assertIncludes(app, "const impactKineticCue = resolveBattleSceneImpactKineticCue(kind, options);", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneImpactCue", "app.mjs", failures);
  assertIncludes(app, "dataset.sceneImpactKinetic", "app.mjs", failures);
  assertIncludes(app, 'cue: "breakthrough_retreat_fail"', "app.mjs", failures);
  assertIncludes(app, 'cue: "breakthrough_death_fail"', "app.mjs", failures);
  assertIncludes(app, 'cue: "battle_win_dominant"', "app.mjs", failures);
  assertIncludes(app, 'cue: "battle_loss_crushing"', "app.mjs", failures);
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
