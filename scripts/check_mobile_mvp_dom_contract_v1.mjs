#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

const REQUIRED_HTML_IDS = [
  "appStatus",
  "stageDisplay",
  "worldTag",
  "difficultyIndex",
  "qiRequired",
  "qiProgressBar",
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
  "btnCompareOfflineCode",
  "btnExportOfflineReport",
  "offlineDetailFilterSummary",
  "offlineDetailHiddenSummary",
  "offlineDetailHiddenKindsSummary",
  "offlineDetailCompareCode",
  "offlineCompareCodeResult",
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
  "btnCompareOfflineCode",
  "btnExportOfflineReport",
  "offlineDetailFilterSummary",
  "offlineDetailHiddenSummary",
  "offlineDetailHiddenKindsSummary",
  "offlineDetailCompareCode",
  "offlineCompareCodeResult",
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
  assertIncludes(app, "function startRealtimeAuto(", "app.mjs", failures);
  assertIncludes(app, "function stopRealtimeAuto(", "app.mjs", failures);
  assertIncludes(css, ".offline-modal", "app.css", failures);
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
