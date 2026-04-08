#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

const REQUIRED_HTML_IDS = [
  "appStatus",
  "focusControlsPanel",
  "btnToggleBattleFocus",
  "btnToggleBattleSfx",
  "btnToggleBattleHaptic",
  "battleFocusHint",
  "battleSfxHint",
  "battleHapticHint",
  "settingsPanel",
  "stagePanel",
  "savePanel",
  "stageDisplay",
  "worldTag",
  "difficultyIndex",
  "qiRequired",
  "qiProgressBar",
  "battleScenePanel",
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
  "statsPanel",
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
  "breakthroughPreviewPanel",
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
  "assetsPanel",
  "logsPanel",
  "btnBattle",
  "btnBreakthrough",
  "btnAuto10s",
  "btnRealtimeAuto",
  "btnResetRun",
  "actionsPanel",
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
  "offlineCompareRow",
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
  "focusControlsPanel",
  "battleFocusHint",
  "battleSfxHint",
  "battleHapticHint",
  "settingsPanel",
  "stagePanel",
  "savePanel",
  "battleScenePanel",
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
  "statsPanel",
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
  "actionsPanel",
  "optAutoResumeRealtime",
  "optLowPerformanceBattleScene",
  "optAutoBreakthroughResumeWarmupSec",
  "optBattleSpeed",
  "optOfflineCapHours",
  "optOfflineEventLimit",
  "breakthroughPreviewPanel",
  "optSaveSlot",
  "optCopySlotTarget",
  "slotActionHintBox",
  "slotLockHint",
  "slotTargetHint",
  "slotCopyHint",
  "slotDeleteHint",
  "savePayload",
  "btnCopySlot",
  "btnToggleSlotLock",
  "btnDeleteSlot",
  "saveSlotSummaryList",
  "logsPanel",
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
  "offlineCompareRow",
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
    'data-fill-pct="100"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-fill-pct="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-gauge-tier="safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-gauge-tier="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-gauge-key="hp_safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="breakthroughPreviewPanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-risk-tier="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-risk-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-risk-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-risk-description="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-expected-key="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-expected-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-expected-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-mitigation-key="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-mitigation-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-mitigation-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-mitigation-message="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-key="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-message="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-summary="- · -"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-toggle-message="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-reason="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-message="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-summary="- · -"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-success-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-death-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-minor-fail-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-retreat-fail-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-death-in-fail-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-expected-qi-delta="+0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-expected-essence-delta="+0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-expected-difficulty-delta="+0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-breakthrough-elixir-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-tribulation-talisman-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-inventory-summary="영약 0 · 수호부 0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-has-breakthrough-elixir="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-has-tribulation-talisman="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-use-breakthrough-elixir="true"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-use-tribulation-talisman="true"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-toggle-summary="영약 ON · 수호부 ON"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-odds-summary="성공 0.0% · 사망 0.0%"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="재고 영약 0 · 수호부 0 · 설정 영약 ON · 수호부 ON · 확률 성공 0.0% · 사망 0.0% · 권장 - · - · 재개 - · -"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-reason="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-next-elixir="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-next-talisman="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-missing-elixir="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-missing-talisman="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-risk-tier="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-next-breakthrough="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-next-tribulation="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-action-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-changed="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-actionable="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-gauge-key="cast_low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="stagePanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-name="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-world-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-world-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-tier="novice"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-breakthrough-ready="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-summary="- · - · 난이도 0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-difficulty-index="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-current="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-required="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-required-state="gated"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-pct="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-progress-key="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="기 0 / 0 · 돌파 대기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-summary="기 0 / 0 · 돌파 대기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="- · - · 난이도 0 · 기 0 / 0 · 돌파 대기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="- · idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="난이도 0 · novice"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="요구 기 0 · 돌파 대기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-lock-hint="잠금 상태 준비 중..."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-lock-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-target-hint="대상 슬롯 상태 준비 중..."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-target-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-copy-hint="복제 규칙 준비 중..."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-copy-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-delete-hint="삭제 규칙 준비 중..."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-delete-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="잠금 상태 준비 중... · 대상 슬롯 상태 준비 중... · 복제 규칙 준비 중... · 삭제 규칙 준비 중..."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-slot-count="3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-active-slot="1"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-active-slot-state="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-active-slot-summary="슬롯 1: 비어 있음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-active-slot-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-active-slot-locked="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ok-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-empty-count="3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-corrupt-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-locked-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-state-breakdown-label="정상 0 · 빈 슬롯 3 · 손상 0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-locked-count-label="잠금 슬롯 0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="활성 1번 · 정상 0 · 빈 슬롯 3 · 손상 0 · 잠금 0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-payload-state="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-payload-source="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-payload-length="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-payload-lines="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="payload 비어 있음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-payload-summary="payload 비어 있음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-copy-button-label="활성 슬롯 복제"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-copy-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-toggle-lock-button-label="활성 슬롯 잠금"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-toggle-lock-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-delete-button-label="활성 슬롯 삭제"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-delete-button-disabled="true"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-save-button-label="로컬 저장"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-save-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-load-button-label="로컬 불러오기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-load-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-export-button-label="JSON 내보내기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-export-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-import-button-label="JSON 가져오기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-import-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-selection-summary="활성 1번 · 슬롯 1: 비어 있음 → 대상 슬롯 2: 비어 있음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-button-summary="로컬 저장 · 로컬 불러오기 · JSON 내보내기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="활성 1번 · 슬롯 1: 비어 있음 → 대상 슬롯 2: 비어 있음 · 로컬 저장 · 로컬 불러오기 · JSON 내보내기 · payload 비어 있음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="logsPanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-log-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-last-log-kind="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-last-log-message="로그 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-last-log-at="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-log-count-label="로그 0건"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-last-log-summary="[-] info · 로그 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-log-summary="로그 0건 · [-] info · 로그 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="로그 0건 · [-] info · 로그 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="offlineCompareRow"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-input-state="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-input-length="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-target-mode="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-apply-view-enabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-apply-view-label="보기 모드 맞추기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-paste-button-label="비교 코드 붙여넣기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-paste-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-load-payload-button-label="savePayload에서 대조"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-load-payload-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-button-label="비교 코드 대조"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-input-summary="입력 없음 · 보기 모드 미정"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-action-summary="비교 코드 붙여넣기 · savePayload에서 대조 · 비교 코드 대조 · 보기 모드 맞추기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="입력 없음 · 보기 모드 미정 · 비교 코드 붙여넣기 · savePayload에서 대조 · 비교 코드 대조 · 보기 모드 맞추기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-code="비교 코드 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-result="비교 대기 중"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-action-hint="가이드: 비교 코드를 입력하세요."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-source="출처: 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-current-summary="현재 코드: 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-target-summary="대상 코드: 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-delta-summary="차이 요약: 대기 중"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-match-summary="일치 요약: 대기 중"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-compare-summary="비교 대기 중 · 출처: 없음 · 가이드: 비교 코드를 입력하세요."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-detail-mode="all"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-detail-expanded="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-visible-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-prioritized-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-hidden-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-filter-summary="세부 로그 0건 (전체)"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-hidden-summary="숨김 이벤트 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-hidden-kinds-summary="숨김 상세 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-empty-label="세부 로그 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="세부 로그 0건 (전체) · 숨김 이벤트 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-report-state="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-applied-duration="0초"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-raw-duration="0초"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-cap-state="미적용"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-warmup-summary="워밍업 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-critical-summary="핵심 이벤트 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-breakthrough-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-rebirth-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-count-label="0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-breakthrough-count-label="0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-rebirth-count-label="0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-resource-summary="기 0 · 영석 0 · 환생정수 0 · 환생 0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="기 0 · 영석 0 · 환생정수 0 · 환생 0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-count-summary="전투 0회 · 돌파 0회 · 환생 0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-delta-tone="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-spirit-delta-tone="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-essence-delta-tone="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-resource-delta-summary="기 +0 · 영석 +0 · 환생정수 +0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="assetsPanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-link-count="3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-primary-source="kenney"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-primary-label="Kenney Asset Library (CC0)"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-source-summary="Kenney Asset Library (CC0) · Oriental Roof Tiles (CC0) · Pixel FX Pack (CC0)"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-license-summary="CC0 3건"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="Kenney Asset Library (CC0) · 3개 링크 · CC0 3건"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-source-slot-summary="슬롯 1: 비어 있음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-target-slot-summary="대상 슬롯 2: 비어 있음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-copy-policy-label="복제: 복제 규칙 준비 중..."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-delete-policy-label="삭제: 삭제 규칙 준비 중..."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-label="0 기"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-spirit-coin-label="0 영석"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-rebirth-essence-label="0 환생정수"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-rebirth-count-label="0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-delta="+0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-spirit-delta="+0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-essence-delta="+0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-focus="true"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-focus-toggle-label="전투 집중 ON"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-focus-toggle-pressed="true"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-focus-hint="전투/액션 중심 화면입니다. 운영 패널은 접혀 있습니다."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-sfx-supported="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-sfx-enabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-sfx-hint="전투 효과음: 꺼짐"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-sfx-toggle-label="전투 효과음 OFF"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-sfx-toggle-pressed="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-sfx-toggle-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-haptic-supported="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-haptic-enabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-haptic-hint="전투 진동: 꺼짐"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-haptic-toggle-label="전투 진동 OFF"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-haptic-toggle-pressed="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-haptic-toggle-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-control-summary="전투 집중 ON · 전투 효과음 OFF · 전투 진동 OFF"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-support-summary="효과음 미지원 · 진동 미지원"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="전투 집중 ON · 전투 효과음 OFF · 전투 진동 OFF · 효과음 미지원 · 진동 미지원"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="battleScenePanel"',
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
    'data-overview-summary="대기 · 대기 · 압력 낮음 · 균형 · 수련자 HP 100% · 기세 0% · 적수 HP 100% · 기세 0%"',
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
    'data-impact-cue="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-impact-kinetic="normal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-impact-vfx="normal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-frame="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-stage-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-stage-key="player_idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-name="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-stage-name="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-frame="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-stage-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-stage-key="enemy_idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-world-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-qi-required="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-hp-tier="safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-cast-tier="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-hp-tier="safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-cast-tier="low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-hp-pct="100"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-cast-pct="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-hp-pct="100"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-cast-pct="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-vitals-text="HP 100% · 기세 0%"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-vitals-key="safe_low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-hp-gauge-key="hp_safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-cast-gauge-key="cast_low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-vitals-text="HP 100% · 기세 0%"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-vitals-key="safe_low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-hp-gauge-key="hp_safe"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-enemy-cast-gauge-key="cast_low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-scene-summary="대기 · 대기 · 압력 낮음 · 균형"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-actor-summary="수련자 HP 100% · 기세 0% · 적수 HP 100% · 기세 0%"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-lead="even"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-danger="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-lead-effect="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-pressure-effect="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-danger-effect="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-effect="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-lock="free"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-gate="no_signal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-fresh="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-active="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-sync-duel="off"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-origin-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-origin-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-origin-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-origin-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-origin-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-origin-sync-duel="off"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-recovery-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-recovery-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-recovery-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-recovery-max-ms="1400"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-cadence-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-cadence-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-cadence-divisor="2"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-probability-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-probability-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-probability-scale-pct="100"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-kind-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-kind-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-outcome-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-sync-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-sync-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-sync-duel="on"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-quiet-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-quiet-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-quiet-threshold-ms="2200"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-residue-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-residue-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-residue-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-residue-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-residue-sync-duel="on"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-random-residue-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-replay="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-replay-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-replay-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-replay-max="3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-replay-remaining="3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-cooldown-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-cooldown-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-cooldown-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-cooldown-max-ms="960"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-priority-remaining-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-priority-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-priority-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-priority-max-ms="6800"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-signal-age-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-signal-age-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-signal-age-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-signal-age-max-ms="6800"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-seq="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-sync-duel="off"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-age-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-recovery-max-ms="1400"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-quiet-threshold-ms="2200"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-recovery-remaining-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-quiet-remaining-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-gate="no_signal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-fresh="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-explicit-active="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-source="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-kind="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-tone="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-outcome-code="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-outcome-profile="neutral"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-sync-duel="off"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-explicit-seq="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-signal-age-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-signal-age-max-ms="6800"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-replay-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-replay-max="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-replay-remaining="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-cooldown-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-cooldown-max-ms="960"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-priority-remaining-ms="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-priority-max-ms="6800"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-gate="no_signal"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-fresh="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-result-active="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ambient-impact-signal-seq="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-status-text="대기 중"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-status-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-status-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-status-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-status-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-status-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-result-text="전장 파동 감지 중 · 자동/실시간 루프에서 연출이 계속 갱신됩니다."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-result-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-result-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-result-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-result-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ticker-text="전투 신호 대기 · 상시 교전 로그를 수집 중입니다."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ticker-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ticker-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ticker-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ticker-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-ticker-queue-count="0"',
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
    'data-round-badge-key="round_idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-round-badge-tone="info"',
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
    'data-combo-badge-key="combo_calm"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-badge-tone="info"',
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
    'data-dps-badge-key="pressure_low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-dps-badge-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-flash-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-flash-active="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-float-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-spark-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-trail-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-shockwave-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-skill-banner-text="기세 수렴"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-skill-banner-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-skill-banner-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-skill-banner-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-skill-banner-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-skill-banner-actor="none"',
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
    'data-combo-banner-text="연격 x3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-banner-state="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-banner-source="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-banner-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-banner-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-banner-tier="flow"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-combo-banner-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="focusControlsPanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-focus="true"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-focus-hint="전투/액션 중심 화면입니다. 운영 패널은 접혀 있습니다."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-sfx-supported="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-sfx-enabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-sfx-hint="전투 효과음: 꺼짐"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-haptic-supported="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-haptic-enabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-haptic-hint="전투 진동: 꺼짐"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="settingsPanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-battle="true"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-battle-label="자동 전투 ON"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-breakthrough="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-breakthrough-label="자동 돌파 OFF"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-tribulation="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-tribulation-label="자동 도겁 허용 OFF"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-realtime="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-resume-realtime-label="앱 복귀 시 실시간 자동 재개 OFF"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-low-performance-battle-scene="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-low-performance-battle-scene-label="전투 연출 저사양 모드 OFF"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-breakthrough-resume-warmup-sec="6"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto-breakthrough-resume-warmup-label="6초"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-speed="2"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-speed-label="표준"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-offline-cap-hours="12"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-offline-cap-label="12시간"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-offline-event-limit="24"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-offline-event-limit-label="24건"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-toggle-summary="전투 ON · 돌파 OFF · 도겁 OFF"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-limit-summary="워밍업 6초 · 속도 표준 · 오프라인 12시간/24건"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="전투 ON · 돌파 OFF · 도겁 OFF · 워밍업 6초 · 속도 표준 · 오프라인 12시간/24건"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-button-label="전투 1회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-breakthrough-button-label="돌파 시도"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto10s-button-label="자동 10초 진행"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-button-label="실시간 자동 시작"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-reset-button-label="런 초기화"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-export-report-label="실시간 리포트 JSON"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-reset-report-label="실시간 통계 초기화"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-battle-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-breakthrough-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-auto10s-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-reset-button-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-export-report-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-reset-report-disabled="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-summary="중지 · 전투 0회 · 돌파 0회 · 환생 0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-button-summary="전투 1회 · 돌파 시도 · 실시간 자동 시작"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="중지 · 전투 0회 · 돌파 0회 · 환생 0회 · 전투 1회 · 돌파 시도 · 실시간 자동 시작"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="savePanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-active-slot="1"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-copy-target-slot="2"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-source-slot-state="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-source-slot-locked="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-target-slot-state="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-target-slot-locked="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-copy-policy-reason="unknown"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-copy-allowed="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-delete-policy-reason="unknown"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-delete-allowed="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-last-saved-at="없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-last-active-at="없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="actionsPanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-running="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-label="중지"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-warmup-remaining="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-warmup-label="워밍업 없음"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-elapsed="0초"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-battles="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-breakthroughs="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-rebirths="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-battles-label="0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-breakthroughs-label="0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-realtime-rebirths-label="0회"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="statsPanel"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-spirit-coin="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-rebirth-essence="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-rebirth-count="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewRiskLabel" class="risk-pill" data-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-risk-tier="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewExpectedLabel" class="risk-pill" data-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-expected-key="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewMitigationLabel" class="risk-pill" data-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-mitigation-key="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewMitigationHint" class="recommendation-text" data-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewRecommendationLabel" class="risk-pill" data-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-recommendation-key="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewRecommendationHint" class="recommendation-text" data-tone="info"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="btnApplyRecommendation" type="button" class="ghost-btn recommendation-btn" data-tone="info" data-recommendation-reason="none" data-changed="false" data-next-elixir="false" data-next-talisman="false" data-missing-elixir="false" data-missing-talisman="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="autoBreakthroughResumeLabel" class="risk-pill" data-tone="info" data-policy-reason="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-risk-tier="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="autoBreakthroughResumeHint" class="recommendation-text" data-tone="info" data-policy-reason="none"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="btnResumeAutoBreakthrough" type="button" class="ghost-btn recommendation-btn" data-policy-reason="none" data-actionable="false" data-risk-tier="none" data-next-breakthrough="false" data-next-tribulation="false" data-action-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewSuccessPct" data-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewDeathPct" data-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewMinorFailPct" data-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewRetreatFailPct" data-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewDeathInFailPct" data-pct="0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewExpectedQiDelta" data-value="+0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewExpectedEssenceDelta" data-value="+0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'id="previewExpectedDifficultyDelta" data-value="+0.0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-vitals-key="safe_low"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-name="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-world-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-world-key="idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-difficulty-index="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-tier="novice"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-required="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-required-state="gated"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-pct="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-current="0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-breakthrough-ready="false"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-progress-key="empty"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-key="player_idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-key="enemy_idle"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-player-name="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-stage-name="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-world-label="-"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-qi-required="0"',
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
    'data-overview-summary="idle · info · idle · idle · none · none · 기세 수렴"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="info · idle · idle · 대기 중"',
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
    'data-overview-summary="idle · info · idle · idle · flow · 0 · 연격 x3"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="info · idle · idle · 전장 파동 감지 중 · 자동/실시간 루프에서 연출이 계속 갱신됩니다."',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="info · idle · idle · 전투 신호 대기 · 상시 교전 로그를 수집 중입니다. · 큐 0건"',
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
    'data-overview-summary="대기 · 1R"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="연격 대기 · 연격 x0"',
    "index.html",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="압력 낮음 · 압력 0"',
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
    'data-badge-key="round_idle"',
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
    'data-badge-key="combo_calm"',
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
    'data-badge-key="pressure_low"',
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
    'dom.battleScenePlayerHpBar.dataset.fillPct = String(playerHpPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePlayerHpBar.dataset.gaugeTier = playerHpTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayerHpBar.dataset.gaugeKey = `hp_${playerHpTier}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayerCastBar.dataset.fillPct = String(playerCastPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePlayerCastBar.dataset.gaugeTier = playerCastTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayerCastBar.dataset.gaugeKey = `cast_${playerCastTier}`;',
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
    'dom.battleSceneEnemyHpBar.dataset.fillPct = String(enemyHpPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneEnemyHpBar.dataset.gaugeTier = enemyHpTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemyHpBar.dataset.gaugeKey = `hp_${enemyHpTier}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemyCastBar.dataset.fillPct = String(enemyCastPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneEnemyCastBar.dataset.gaugeTier = enemyCastTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemyCastBar.dataset.gaugeKey = `cast_${enemyCastTier}`;',
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
    "dom.battleScenePlayerStage.dataset.stageLabel = playerStageLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayerStage.dataset.stageKey = `player_${worldKey}_${stageTier}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePlayerStage.dataset.playerName = playerName;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePlayerStage.dataset.stageName = stageName;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneEnemyStage.dataset.stageLabel = enemyStageLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemyStage.dataset.stageKey = `enemy_${worldKey}_${stageTier}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneEnemyStage.dataset.worldLabel = worldLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneEnemyStage.dataset.qiRequired = qiRequired;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.stagePanel.dataset.stageName = String(displayName || "-");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.stagePanel.dataset.stageKey = `${stageWorldKey}_${stageTier}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.stagePanel.dataset.worldLabel = String(worldKo(stage.world) || "-");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.worldKey = stageWorldKey;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.stageTier = stageTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.breakthroughReady = String(breakthroughReady);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.stageSummary = stageSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.qiSummary = qiSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.overviewSummary = overviewSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.difficultyIndex = String(stage.difficulty_index);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.qiCurrent = fmtNumber(state.currencies.qi);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.qiRequired = fmtNumber(stage.qi_required);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.stagePanel.dataset.requiredState = breakthroughReady ? "ready" : "gated";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.qiPct = String(qiRatio);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.stagePanel.dataset.progressKey = qiProgressKey;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.stageDisplay.dataset.stageName = String(displayName || "-");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.stageDisplay.dataset.stageKey = `${stageWorldKey}_${stageTier}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.stageDisplay.dataset.overviewSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.worldTag.dataset.worldLabel = String(worldKo(stage.world) || "-");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.worldTag.dataset.worldKey = stageWorldKey;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.worldTag.dataset.overviewSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.difficultyIndex.dataset.difficultyIndex = String(stage.difficulty_index);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.difficultyIndex.dataset.stageTier = stageTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.difficultyIndex.dataset.overviewSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.qiRequired.dataset.qiRequired = fmtNumber(stage.qi_required);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.qiRequired.dataset.requiredState = breakthroughReady ? "ready" : "gated";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.qiRequired.dataset.overviewSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.qiProgressBar.dataset.qiPct = String(qiRatio);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.qiProgressBar.dataset.qiCurrent = fmtNumber(state.currencies.qi);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.qiProgressBar.dataset.qiRequired = fmtNumber(stage.qi_required);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.qiProgressBar.dataset.breakthroughReady = String(breakthroughReady);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.qiProgressBar.dataset.progressKey = qiProgressKey;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.qiProgressBar.dataset.overviewSummary = qiSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.riskTier = riskTier.tier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.riskTone = riskTier.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.riskLabel = riskTier.labelKo || "-";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.riskDescription =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.expectedKey = expectedDelta.burdenTier || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.expectedTone = expectedDelta.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.expectedLabel = expectedDelta.labelKo || "-";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.mitigationKey = mitigation.key || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.mitigationTone = mitigation.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.mitigationLabel = mitigation.labelKo || "-";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.mitigationMessage =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.recommendationKey = recommendation.key || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.recommendationTone = recommendation.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.recommendationLabel = recommendation.labelKo || "-";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.recommendationMessage =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.recommendationSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.autoResumeReason = autoResumePolicy.reason || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.autoResumeTone = autoResumePolicy.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.autoResumeLabel = autoResumePolicy.labelKo || "-";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.autoResumeMessage =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.autoResumeSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.successPct = preview.successPct.toFixed(1);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.deathPct = preview.deathPct.toFixed(1);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.minorFailPct = preview.minorFailPct.toFixed(1);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.retreatFailPct = preview.retreatFailPct.toFixed(1);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.deathInFailPct = preview.deathInFailurePct.toFixed(1);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.expectedQiDelta = fmtSignedInteger(expectedDelta.expectedQiDelta);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.expectedEssenceDelta = fmtSignedFixed(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.expectedDifficultyDelta = fmtSignedFixed(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.breakthroughElixirCount = fmtNumber(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.tribulationTalismanCount = fmtNumber(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.inventorySummary = inventorySummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.hasBreakthroughElixir = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.hasTribulationTalisman = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.useBreakthroughElixir = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.useTribulationTalisman = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.toggleSummary = toggleSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.oddsSummary = oddsSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.overviewSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.recommendationReason =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.recommendationToggleMessage =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.nextElixir = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.nextTalisman = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.missingElixir = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.missingTalisman = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.autoResumeRiskTier =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.autoResumeNextBreakthrough = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.autoResumeNextTribulation = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.breakthroughPreviewPanel.dataset.autoResumeActionLabel =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.recommendationChanged = String(recommendationToggle.changed);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.breakthroughPreviewPanel.dataset.autoResumeActionable = String(autoResumePolicy.actionable);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.lockHint = lockHintText;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.lockTone = lockHintTone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.targetHint = targetHintText;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.targetTone = targetHintTone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.copyHint = copyHintText;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.copyTone = copyHintTone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.deleteHint = deleteHintText;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.deleteTone = deleteHintTone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.slotActionHintBox.dataset.overviewSummary = [",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.slotCount = String(rows.length);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.activeSlot = String(activeSaveSlot);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.saveSlotSummaryList.dataset.activeSlotState = String(activeRow.state || "empty");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.activeSlotSummary = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.activeSlotSource = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.activeSlotLocked = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.okCount = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.emptyCount = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.corruptCount = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.lockedCount = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.stateBreakdownLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.saveSlotSummaryList.dataset.lockedCountLabel = `잠금 슬롯 ${lockedCount}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.saveSlotSummaryList.dataset.overviewSummary = overviewSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePayload.dataset.payloadState = payloadState;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePayload.dataset.payloadSource = payloadSource;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePayload.dataset.payloadLength = payloadLength;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePayload.dataset.payloadLines = payloadLines;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePayload.dataset.overviewSummary = payloadSummary;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.payloadState = payloadState;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.payloadSource = payloadSource;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.payloadLength = payloadLength;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.payloadLines = payloadLines;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.payloadSummary = payloadSummary;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function syncSavePanelOverviewSummary() {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.overviewSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "syncSavePanelOverviewSummary();",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'setSavePayloadValue(payload, "offline_report");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'setSavePayloadValue(`${code}\\n`, "offline_compare_code");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'setSavePayloadValue(payload, "realtime_report");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'setSavePayloadValue(serializeSliceState(state), "state_export");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'syncSavePayloadContract(dom.savePayload.value.trim() ? "manual" : "empty");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.copyButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.copyButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.toggleLockButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.toggleLockButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.deleteButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.deleteButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.saveButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.saveButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.loadButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.loadButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.exportButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.exportButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.importButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.importButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.selectionSummary = selectionSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.savePanel.dataset.buttonSummary = [',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "syncSavePanelOverviewSummary();",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.logsPanel.dataset.logCount = String(state.logs.length);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.logsPanel.dataset.lastLogKind = String(latestRow.kind || "info");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.logsPanel.dataset.lastLogMessage = String(latestRow.message || "로그 없음");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.logsPanel.dataset.lastLogAt = String(latestRow.at || "-");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.logsPanel.dataset.logCountLabel = logCountLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.logsPanel.dataset.lastLogSummary = lastLogSummary;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.logsPanel.dataset.logSummary = logSummary;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.logsPanel.dataset.overviewSummary = logSummary;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.detailMode = mode;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.detailExpanded = String(offlineDetailExpanded);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.visibleCount = String(rows.length);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.prioritizedCount = String(prioritizedRows.length);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.hiddenCount = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.filterSummary = filterSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.hiddenSummary = hiddenSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.hiddenKindsSummary = hiddenKindsSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.overviewSummary = overviewSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineDetailList.dataset.emptyLabel = emptyLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.detailMode = "all";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.detailExpanded = "false";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.visibleCount = "0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.prioritizedCount = "0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.hiddenCount = "0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.filterSummary = "세부 로그 0건 (전체)";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.hiddenSummary = "숨김 이벤트 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.hiddenKindsSummary = "숨김 상세 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.overviewSummary = "세부 로그 0건 (전체) · 숨김 이벤트 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineDetailList.dataset.emptyLabel = "세부 로그 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineCompareRow.dataset.inputState = inputText ? "present" : "empty";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.inputLength = String(inputText.length);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineCompareRow.dataset.targetMode = targetMode || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.applyViewEnabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineCompareRow.dataset.applyViewLabel =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.pasteButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.pasteButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.loadPayloadButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.loadPayloadButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.compareButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.compareButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.inputSummary = inputText",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineCompareRow.dataset.actionSummary = [",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineCompareRow.dataset.overviewSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "syncOfflineCompareRowContract();",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.compareResult = label;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareCode = label;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareDeltaSummary = "차이 요약: 대기 중";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.compareDeltaSummary = label;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareMatchSummary = "일치 요약: 대기 중";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.compareMatchSummary = label;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.compareSource = label;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.compareCurrentSummary = label;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.compareTargetSummary = label;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.compareActionHint = label;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function syncOfflineCompareSummary() {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareCode = "비교 코드 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareResult = "비교 대기 중";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareActionHint = "가이드: 비교 코드를 입력하세요.";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareSource = "출처: 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareCurrentSummary = "현재 코드: 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareTargetSummary = "대상 코드: 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareDeltaSummary = "차이 요약: 대기 중";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareMatchSummary = "일치 요약: 대기 중";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.compareSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function syncOfflineModalOverviewSummary() {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.overviewSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.reportState = "empty";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.appliedDuration = "0초";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.rawDuration = "0초";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.capState = "미적용";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.warmupSummary = "워밍업 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.criticalSummary = "핵심 이벤트 없음";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.battleCount = "0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.battleCountLabel = "0회";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.breakthroughCount = "0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.breakthroughCountLabel = "0회";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.rebirthCount = "0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.rebirthCountLabel = "0회";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.countSummary = "전투 0회 · 돌파 0회 · 환생 0회";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.qiDeltaTone = "neutral";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.spiritDeltaTone = "neutral";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.essenceDeltaTone = "neutral";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.resourceDeltaSummary = "기 +0 · 영석 +0 · 환생정수 +0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.qiDelta = "+0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.spiritDelta = "+0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.essenceDelta = "+0";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.offlineModal.dataset.reportState = "ready";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.appliedDuration = appliedDurationLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.rawDuration = rawDurationLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.capState = capStateLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.warmupSummary = warmupLabelKo;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.criticalSummary = criticalSummaryLabelKo;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.battleCount = battleCountLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.battleCountLabel = battleCountDisplayLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.breakthroughCount = breakthroughCountLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.breakthroughCountLabel = breakthroughCountDisplayLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.rebirthCount = rebirthCountLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.rebirthCountLabel = rebirthCountDisplayLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.countSummary = countSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.qiDeltaTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.spiritDeltaTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.essenceDeltaTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.resourceDeltaSummary = resourceDeltaSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "syncOfflineModalOverviewSummary();",
    "app.mjs",
    failures,
  );
  assertIncludes(
    html,
    'data-overview-summary="전투 0회 · 돌파 0회 · 환생 0회 · 기 +0 · 영석 +0 · 환생정수 +0 · 비교 대기 중 · 출처: 없음 · 가이드: 비교 코드를 입력하세요."',
    "index.html",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.qiDelta = qiDeltaLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.spiritDelta = spiritDeltaLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.offlineModal.dataset.essenceDelta = essenceDeltaLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.sceneState =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.sceneLoop =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.sceneWorld =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.sceneTier =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.scenePerformance =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.sceneOutcomePriority =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.impactCue =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.impactKinetic =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.impactVfx =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerFrame =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerStageLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerStageKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerName =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerStageName =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyFrame =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyStageLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyStageKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyWorldLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyQiRequired =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerHpTier =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerCastTier =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyHpTier =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyCastTier =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerHpPct =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerCastPct =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyHpPct =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyCastPct =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerVitalsText =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerVitalsKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerHpGaugeKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.playerCastGaugeKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyVitalsText =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyVitalsKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyHpGaugeKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.enemyCastGaugeKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function summarizeBattleSceneLoopModeKo(loopMode) {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.sceneSummary = [",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.actorSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.overviewSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.lead =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.danger =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.leadEffect =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.pressureEffect =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.dangerEffect =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboEffect =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpact =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactLock =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactGate =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactFresh =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactActive =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactKind =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactOutcomeCode =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactSyncDuel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactOriginSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactOriginKind =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactOriginTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactOriginOutcomeCode =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactOriginOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactOriginSyncDuel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomState =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomRecoverySource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomRecoveryOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomRecoveryMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomRecoveryMaxMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomCadenceSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomCadenceOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomCadenceDivisor =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomProbabilitySource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomProbabilityOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomProbabilityScalePct =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomKindSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomKindProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomKind =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomOutcomeSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomOutcomeCode =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomSyncSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomSyncOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomSyncDuel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomQuietSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomQuietOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomQuietThresholdMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomResidueSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomResidueKind =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomResidueTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomResidueOutcomeCode =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomResidueSyncDuel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactRandomResidueOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactReplay =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactReplaySource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactReplayOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactReplayMax =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactReplayRemaining =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactCooldownMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactCooldownSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactCooldownOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactCooldownMaxMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactPriorityRemainingMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactPrioritySource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactPriorityOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactPriorityMaxMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactSignalAgeSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactSignalAgeOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactSignalAgeMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactSignalAgeMaxMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitSeq =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitKind =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitOutcomeCode =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitSyncDuel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitAgeMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitRecoveryMaxMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitQuietThresholdMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitRecoveryRemainingMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitQuietRemainingMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitGate =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitFresh =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactExplicitActive =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultKind =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultOutcomeCode =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultOutcomeProfile =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultSyncDuel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultExplicitSeq =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultSignalAgeMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultSignalAgeMaxMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultReplayCount =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultReplayMax =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultReplayRemaining =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultCooldownMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultCooldownMaxMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultPriorityRemainingMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultPriorityMaxMs =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultGate =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultFresh =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactResultActive =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.ambientImpactSignalSeq =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'syncBattleScenePanelContract();',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.statusTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.statusText =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.statusState =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.statusSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.statusKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.resultTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.resultText =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.resultState =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.resultSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.resultKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.tickerTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.tickerText =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.tickerState =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.tickerSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.tickerKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.tickerQueueCount =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "syncBattleScenePanelContract();",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.round =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.roundBadgeKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.roundBadgeTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboCount =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboTier =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBadgeKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBadgeTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.dpsScore =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.pressure =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.dpsBadgeKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.dpsBadgeTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.flashTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.flashActive =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.floatCount =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.sparkCount =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.trailCount =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.shockwaveCount =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function syncBattleSceneMotionLayerContracts() {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.skillBannerState =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.skillBannerText =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.skillBannerSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.skillBannerKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.skillBannerTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.skillBannerActor =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.skillLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBannerState =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBannerText =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBannerSource =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBannerKey =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBannerTone =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBannerTier =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePanel.dataset.comboBannerCount =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'syncBattleScenePanelContract();',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.focusToggleLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.focusTogglePressed = String(battleFocusMode);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.battleFocus = String(battleFocusMode);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.battleFocusHint = focusHint;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.battleSfxSupported = String(supported);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.battleSfxEnabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.battleSfxHint = sfxHint;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.sfxToggleLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.sfxTogglePressed = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.sfxToggleDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.battleHapticSupported = String(supported);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.battleHapticEnabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.battleHapticHint = hapticHint;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.hapticToggleLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.hapticTogglePressed = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.hapticToggleDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function syncFocusControlsPanelSummaries() {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.controlSummary = controlSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.focusControlsPanel.dataset.supportSummary = supportSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.focusControlsPanel.dataset.overviewSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoBattle = String(state.settings.autoBattle);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoBattleLabel = autoBattleLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoBreakthrough = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoBreakthroughLabel = autoBreakthroughLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoTribulation = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoTribulationLabel = autoTribulationLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoResumeRealtime = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoResumeRealtimeLabel = autoResumeRealtimeLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.lowPerformanceBattleScene = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.lowPerformanceBattleSceneLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoBreakthroughResumeWarmupSec = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.autoBreakthroughResumeWarmupLabel = warmupLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.battleSpeed = battleSpeedValue;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.battleSpeedLabel = battleSpeedLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.offlineCapHours = offlineCapHoursValue;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.offlineCapLabel = offlineCapLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.offlineEventLimit = offlineEventLimitValue;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.offlineEventLimitLabel = offlineEventLimitLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.toggleSummary = settingsToggleSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.settingsPanel.dataset.limitSummary = settingsLimitSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.settingsPanel.dataset.overviewSummary =',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.battleButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.breakthroughButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.auto10sButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.resetButtonLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.exportReportLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.resetReportLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.battleButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.breakthroughButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.auto10sButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.resetButtonDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.exportReportDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.resetReportDisabled = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.buttonSummary = buttonSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function syncActionsPanelOverviewSummary() {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.overviewSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "syncActionsPanelOverviewSummary();",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "syncActionsPanelButtonContract();",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.activeSlot = String(activeSaveSlot);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.copyTargetSlot = String(targetSlot);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.savePanel.dataset.sourceSlotState = sourceSummary.state || "empty";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.sourceSlotLocked = String(sourceLocked);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.savePanel.dataset.targetSlotState = targetSummary.state || "empty";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.targetSlotLocked = String(targetLocked);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.sourceSlotSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.targetSlotSummary = targetHintText;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.savePanel.dataset.copyPolicyReason = copyPolicy.reason || "unknown";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.copyAllowed = String(copyPolicy.allowed);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.copyPolicyLabel = copyHintText;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.savePanel.dataset.deletePolicyReason = deletePolicy.reason || "unknown";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.deleteAllowed = String(deletePolicy.allowed);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.deletePolicyLabel = deleteHintText;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.lastSavedAt = fmtDateTimeFromIso(state.lastSavedAtIso);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.savePanel.dataset.lastActiveAt = fmtDateTimeFromEpochMs(state.lastActiveEpochMs);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeRunning = String(running);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeLabel = realtimeLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeWarmupRemaining = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeWarmupLabel = warmupLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeElapsed = elapsedLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeBattles = battlesLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeBreakthroughs = breakthroughsLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeRebirths = rebirthsLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeBattlesLabel = battlesDisplayLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeBreakthroughsLabel =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeRebirthsLabel = rebirthsDisplayLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.actionsPanel.dataset.realtimeSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.qi = fmtNumber(state.currencies.qi);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.spiritCoin = fmtNumber(state.currencies.spiritCoin);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.rebirthEssence = fmtNumber(state.currencies.rebirthEssence);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.rebirthCount = fmtNumber(state.progression.rebirthCount);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.qiLabel = qiLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.spiritCoinLabel = spiritCoinLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.rebirthEssenceLabel = rebirthEssenceLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.rebirthCountLabel = rebirthCountLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.resourceSummary = resourceSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.statsPanel.dataset.overviewSummary = resourceSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'assetsPanel: document.getElementById("assetsPanel"),',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function syncAssetsPanelContract() {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.assetsPanel.dataset.linkCount = String(normalizedLinks.length);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.assetsPanel.dataset.primarySource = primary.source;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.assetsPanel.dataset.primaryLabel = primary.label;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.assetsPanel.dataset.sourceSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.assetsPanel.dataset.licenseSummary =",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.assetsPanel.dataset.overviewSummary = overviewSummaryLabel;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "syncAssetsPanelContract();",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewExpectedLabel.dataset.tone = expectedDelta.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewExpectedLabel.dataset.expectedKey = expectedDelta.burdenTier || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewRiskLabel.dataset.tone = riskTier.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewRiskLabel.dataset.riskTier = riskTier.tier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewMitigationLabel.dataset.tone = mitigation.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewMitigationLabel.dataset.mitigationKey = mitigation.key || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewMitigationHint.dataset.tone = mitigation.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewMitigationHint.dataset.mitigationKey = mitigation.key || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewRecommendationLabel.dataset.tone = recommendation.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewRecommendationLabel.dataset.recommendationKey = recommendation.key || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewRecommendationHint.dataset.tone = recommendation.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewRecommendationHint.dataset.recommendationKey = recommendation.key || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnApplyRecommendation.dataset.tone = recommendation.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.btnApplyRecommendation.dataset.recommendationReason = recommendationToggle.reason || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnApplyRecommendation.dataset.changed = String(recommendationToggle.changed);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnApplyRecommendation.dataset.nextElixir = String(recommendationToggle.nextUseBreakthroughElixir);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnApplyRecommendation.dataset.nextTalisman = String(recommendationToggle.nextUseTribulationTalisman);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnApplyRecommendation.dataset.missingElixir = String(recommendationToggle.missingBreakthroughElixir);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnApplyRecommendation.dataset.missingTalisman = String(recommendationToggle.missingTribulationTalisman);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.autoBreakthroughResumeLabel.dataset.tone = autoResumePolicy.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.autoBreakthroughResumeLabel.dataset.policyReason = autoResumePolicy.reason;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.autoBreakthroughResumeLabel.dataset.riskTier = autoResumePolicy.riskTier?.tier || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.autoBreakthroughResumeHint.dataset.tone = autoResumePolicy.tone;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.autoBreakthroughResumeHint.dataset.policyReason = autoResumePolicy.reason;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.autoBreakthroughResumeHint.dataset.riskTier = autoResumePolicy.riskTier?.tier || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnResumeAutoBreakthrough.dataset.policyReason = autoResumePolicy.reason;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnResumeAutoBreakthrough.dataset.actionable = String(autoResumePolicy.actionable);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.btnResumeAutoBreakthrough.dataset.riskTier = autoResumePolicy.riskTier?.tier || "none";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnResumeAutoBreakthrough.dataset.nextBreakthrough = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.btnResumeAutoBreakthrough.dataset.nextTribulation = String(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.btnResumeAutoBreakthrough.dataset.actionLabel = autoResumePolicy.actionLabelKo || "-";',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewSuccessPct.dataset.pct = preview.successPct.toFixed(1);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewDeathPct.dataset.pct = preview.deathPct.toFixed(1);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewMinorFailPct.dataset.pct = preview.minorFailPct.toFixed(1);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewRetreatFailPct.dataset.pct = preview.retreatFailPct.toFixed(1);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.previewDeathInFailPct.dataset.pct = preview.deathInFailurePct.toFixed(1);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewExpectedQiDelta.dataset.value = fmtSignedInteger(expectedDelta.expectedQiDelta);",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewExpectedEssenceDelta.dataset.value = fmtSignedFixed(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.previewExpectedDifficultyDelta.dataset.value = fmtSignedFixed(",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayerVitals.dataset.hpPct = String(playerHpPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayerVitals.dataset.castPct = String(playerCastPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePlayerVitals.dataset.hpTier = playerHpTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleScenePlayerVitals.dataset.castTier = playerCastTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleScenePlayerVitals.dataset.vitalsKey = `${playerHpTier}_${playerCastTier}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemyVitals.dataset.hpPct = String(enemyHpPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemyVitals.dataset.castPct = String(enemyCastPct);',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneEnemyVitals.dataset.hpTier = enemyHpTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneEnemyVitals.dataset.castTier = enemyCastTier;",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'dom.battleSceneEnemyVitals.dataset.vitalsKey = `${enemyHpTier}_${enemyCastTier}`;',
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
    'dom.battleSceneRoundBadge.dataset.badgeKey = `round_${loopMode}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneRoundBadge.dataset.overviewSummary = roundOverviewSummary;",
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
    'dom.battleSceneComboBadge.dataset.badgeKey = `combo_${comboTier}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "dom.battleSceneComboBadge.dataset.overviewSummary = comboOverviewSummary;",
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
    'dom.battleSceneDpsBadge.dataset.badgeKey = `pressure_${battleSceneDuelState.pressure}`;',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "summarizeBattleSceneComboTierKo(comboTier)",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    '`${summarizeBattleScenePressureKo(battleSceneDuelState.pressure)} · 압력 ${pressureScore}`',
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
    'syncBattleSceneMessageOverview(dom.battleSceneStatus, BATTLE_SCENE_DEFAULT_STATUS);',
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
    'syncBattleSceneMessageOverview(dom.battleSceneResult, BATTLE_SCENE_DEFAULT_RESULT);',
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
    "function syncBattleSceneMessageOverview(node, defaultText, options = {}) {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'node.dataset.overviewSummary = parts.join(" · ");',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "includeQueueCount: true,",
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
    'syncBattleSceneBannerOverview(dom.battleSceneSkillBanner, {',
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
    'syncBattleSceneBannerOverview(dom.battleSceneComboBanner, {',
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    "function syncBattleSceneBannerOverview(node, options = {}) {",
    "app.mjs",
    failures,
  );
  assertIncludes(
    app,
    'node.dataset.overviewSummary = parts.join(" · ");',
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
