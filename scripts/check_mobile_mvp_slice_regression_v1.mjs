#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildStorageKeyForSlot,
  buildSliceContext,
  createInitialSliceState,
  createSeededRng,
  normalizeSaveSlot,
  normalizeSlotSummaryState,
  parseSliceState,
  resolveDebouncedAction,
  resolveLoopTuningFromBattleSpeed,
  resolveSlotCopyPolicy,
  resolveSlotDeletePolicy,
  resolveSlotSummaryQuickAction,
  runAutoSliceSeconds,
  runBattleOnce,
  runBreakthroughAttempt,
  runOfflineCatchup,
  serializeSliceState,
} from "../mobile/mvp_v1/engine.mjs";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

function parseArgs(argv) {
  let reportFile = "";
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--report-file" && argv[i + 1]) {
      reportFile = resolve(process.cwd(), argv[i + 1]);
      i += 1;
    }
  }
  return { reportFile };
}

async function loadJson(relativePath) {
  const path = resolve(ROOT, relativePath);
  const raw = await readFile(path, "utf-8");
  return JSON.parse(raw);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [progressionRows, localeRows] = await Promise.all([
    loadJson("data/export/realm_progression_v1.json"),
    loadJson("data/export/realm_locale_ko_v1.json"),
  ]);

  const context = buildSliceContext(progressionRows, localeRows);
  const rng = createSeededRng(20260224);
  const state = createInitialSliceState(context, { playerName: "regression" });
  const checks = [];

  checks.push({
    id: "save_slot_key_and_normalization_work",
    passed:
      normalizeSaveSlot("2", 1) === 2 &&
      normalizeSaveSlot("9", 1) === 3 &&
      normalizeSaveSlot("0", 1) === 1 &&
      buildStorageKeyForSlot(3) === "idle_xianxia_mobile_mvp_v1_save_slot_3",
  });

  const quickLoadSameSlot = resolveSlotSummaryQuickAction(2, 2, "ok");
  const quickLoadSwitchSlot = resolveSlotSummaryQuickAction(1, 3, "ok");
  checks.push({
    id: "slot_summary_quick_action_loads_when_state_ok",
    passed:
      quickLoadSameSlot.nextActiveSlot === 2 &&
      quickLoadSameSlot.shouldLoad === true &&
      quickLoadSameSlot.actionKind === "switch_and_load" &&
      quickLoadSameSlot.changedSlot === false &&
      quickLoadSwitchSlot.nextActiveSlot === 3 &&
      quickLoadSwitchSlot.shouldLoad === true &&
      quickLoadSwitchSlot.actionKind === "switch_and_load" &&
      quickLoadSwitchSlot.changedSlot === true,
  });

  const quickCorrupt = resolveSlotSummaryQuickAction(1, 3, "corrupt");
  const quickEmptySwitch = resolveSlotSummaryQuickAction(3, 1, "empty");
  const quickEmptySame = resolveSlotSummaryQuickAction(2, 2, "unknown_state");
  checks.push({
    id: "slot_summary_quick_action_handles_empty_and_corrupt_states",
    passed:
      normalizeSlotSummaryState("ok", "empty") === "ok" &&
      normalizeSlotSummaryState("unknown", "corrupt") === "corrupt" &&
      quickCorrupt.nextActiveSlot === 3 &&
      quickCorrupt.shouldLoad === false &&
      quickCorrupt.actionKind === "switch_corrupt" &&
      quickEmptySwitch.nextActiveSlot === 1 &&
      quickEmptySwitch.shouldLoad === false &&
      quickEmptySwitch.actionKind === "switch_empty" &&
      quickEmptySame.nextActiveSlot === 2 &&
      quickEmptySame.shouldLoad === false &&
      quickEmptySame.actionKind === "empty",
  });

  const debounceFirst = resolveDebouncedAction(0, 1000, 700);
  const debounceSecond = resolveDebouncedAction(
    debounceFirst.lastAcceptedEpochMs,
    1300,
    700,
  );
  const debounceThird = resolveDebouncedAction(
    debounceFirst.lastAcceptedEpochMs,
    1700,
    700,
  );
  checks.push({
    id: "slot_summary_quick_action_debounce_blocks_double_tap",
    passed:
      debounceFirst.accepted === true &&
      debounceFirst.lastAcceptedEpochMs === 1000 &&
      debounceSecond.accepted === false &&
      debounceSecond.remainingMs === 400 &&
      debounceSecond.nextAllowedEpochMs === 1700 &&
      debounceThird.accepted === true &&
      debounceThird.lastAcceptedEpochMs === 1700 &&
      debounceThird.nextAllowedEpochMs === 2400,
  });

  const copySameSlot = resolveSlotCopyPolicy(2, 2, "ok");
  const copyToEmpty = resolveSlotCopyPolicy(2, 3, "empty");
  const copyToData = resolveSlotCopyPolicy(2, 1, "ok");
  const copyToCorrupt = resolveSlotCopyPolicy(2, 1, "corrupt");
  checks.push({
    id: "slot_copy_policy_requires_confirm_only_on_non_empty_target",
    passed:
      copySameSlot.allowed === false &&
      copySameSlot.reason === "same_slot" &&
      copyToEmpty.allowed === true &&
      copyToEmpty.requiresConfirm === false &&
      copyToEmpty.reason === "target_empty" &&
      copyToData.allowed === true &&
      copyToData.requiresConfirm === true &&
      copyToData.reason === "target_has_data" &&
      copyToCorrupt.allowed === true &&
      copyToCorrupt.requiresConfirm === true &&
      copyToCorrupt.reason === "target_corrupt",
  });

  const deleteEmpty = resolveSlotDeletePolicy(1, "empty");
  const deleteOk = resolveSlotDeletePolicy(2, "ok");
  const deleteCorrupt = resolveSlotDeletePolicy(3, "corrupt");
  checks.push({
    id: "slot_delete_policy_skips_empty_and_confirms_non_empty",
    passed:
      deleteEmpty.allowed === false &&
      deleteEmpty.requiresConfirm === false &&
      deleteEmpty.reason === "empty_slot" &&
      deleteOk.allowed === true &&
      deleteOk.requiresConfirm === true &&
      deleteOk.reason === "has_data" &&
      deleteCorrupt.allowed === true &&
      deleteCorrupt.requiresConfirm === true &&
      deleteCorrupt.reason === "corrupt_slot",
  });

  const initWithResume = createInitialSliceState(context, {
    playerName: "resume",
    autoResumeRealtime: true,
  });
  checks.push({
    id: "initial_state_applies_auto_resume_option",
    passed: initWithResume.settings.autoResumeRealtime === true,
  });

  const beforeBattle = {
    qi: state.currencies.qi,
    spiritCoin: state.currencies.spiritCoin,
  };
  runBattleOnce(context, state, rng);
  checks.push({
    id: "battle_once_changes_currency_or_qi",
    passed:
      state.currencies.qi !== beforeBattle.qi ||
      state.currencies.spiritCoin !== beforeBattle.spiritCoin,
  });

  state.currencies.qi = 0;
  const blocked = runBreakthroughAttempt(context, state, rng, {
    respectAutoTribulation: false,
  });
  checks.push({
    id: "breakthrough_blocked_when_qi_insufficient",
    passed: blocked.attempted === false && blocked.outcome === "blocked_no_qi",
  });

  state.progression.difficultyIndex = 198;
  const deathStageQiRequired = context.stageByDifficulty.get(198)?.qi_required ?? 0;
  state.currencies.qi = Math.max(5_000_000_000, deathStageQiRequired + 1);
  const rebirthBefore = state.progression.rebirthCount;
  const essenceBefore = state.currencies.rebirthEssence;
  const death = runBreakthroughAttempt(context, state, rng, {
    respectAutoTribulation: false,
    debugForcedOutcome: "death_fail",
  });
  checks.push({
    id: "death_triggers_rebirth_loop",
    passed:
      death.outcome === "death_fail" &&
      state.progression.rebirthCount === rebirthBefore + 1 &&
      state.progression.difficultyIndex === 1 &&
      state.currencies.rebirthEssence > essenceBefore,
  });

  const slowState = createInitialSliceState(context, { playerName: "slow" });
  slowState.settings.autoBattle = true;
  slowState.settings.autoBreakthrough = false;
  slowState.currencies.qi = 100000;
  const slowTuning = resolveLoopTuningFromBattleSpeed(1);
  const slowSummary = runAutoSliceSeconds(context, slowState, createSeededRng(11), {
    seconds: 12,
    battleEverySec: slowTuning.battleEverySec,
    breakthroughEverySec: slowTuning.breakthroughEverySec,
    passiveQiRatio: slowTuning.passiveQiRatio,
  });

  const fastState = createInitialSliceState(context, { playerName: "fast" });
  fastState.settings.autoBattle = true;
  fastState.settings.autoBreakthrough = false;
  fastState.currencies.qi = 100000;
  const fastTuning = resolveLoopTuningFromBattleSpeed(3);
  const fastSummary = runAutoSliceSeconds(context, fastState, createSeededRng(11), {
    seconds: 12,
    battleEverySec: fastTuning.battleEverySec,
    breakthroughEverySec: fastTuning.breakthroughEverySec,
    passiveQiRatio: fastTuning.passiveQiRatio,
  });
  checks.push({
    id: "battle_speed_tuning_changes_auto_cadence",
    passed:
      slowTuning.labelKo === "저속" &&
      fastTuning.labelKo === "고속" &&
      slowTuning.battleEverySec === 3 &&
      fastTuning.battleEverySec === 1 &&
      slowSummary.battles === 4 &&
      fastSummary.battles === 12,
  });

  const timelineState = createInitialSliceState(context, { playerName: "timeline" });
  timelineState.settings.autoBattle = true;
  timelineState.settings.autoBreakthrough = false;
  timelineState.currencies.qi = 100000;
  const chunkA = runAutoSliceSeconds(context, timelineState, createSeededRng(21), {
    seconds: 1,
    battleEverySec: slowTuning.battleEverySec,
    breakthroughEverySec: slowTuning.breakthroughEverySec,
    passiveQiRatio: slowTuning.passiveQiRatio,
    timelineOffsetSec: 0,
    suppressLogs: true,
  });
  const chunkB = runAutoSliceSeconds(context, timelineState, createSeededRng(21), {
    seconds: 1,
    battleEverySec: slowTuning.battleEverySec,
    breakthroughEverySec: slowTuning.breakthroughEverySec,
    passiveQiRatio: slowTuning.passiveQiRatio,
    timelineOffsetSec: 1,
    suppressLogs: true,
  });
  const chunkC = runAutoSliceSeconds(context, timelineState, createSeededRng(21), {
    seconds: 1,
    battleEverySec: slowTuning.battleEverySec,
    breakthroughEverySec: slowTuning.breakthroughEverySec,
    passiveQiRatio: slowTuning.passiveQiRatio,
    timelineOffsetSec: 2,
    suppressLogs: true,
  });
  checks.push({
    id: "timeline_offset_keeps_realtime_cadence_across_chunks",
    passed: chunkA.battles === 0 && chunkB.battles === 0 && chunkC.battles === 1,
  });

  state.settings.autoBattle = true;
  state.settings.autoBreakthrough = true;
  state.settings.autoTribulation = true;
  state.settings.autoResumeRealtime = true;
  state.settings.battleSpeed = 3;
  state.settings.offlineCapHours = 18;
  state.settings.offlineEventLimit = 40;
  state.currencies.qi = 50000;
  const speedTuning = resolveLoopTuningFromBattleSpeed(state.settings.battleSpeed);
  const auto = runAutoSliceSeconds(context, state, rng, {
    seconds: 10,
    battleEverySec: speedTuning.battleEverySec,
    breakthroughEverySec: speedTuning.breakthroughEverySec,
    passiveQiRatio: speedTuning.passiveQiRatio,
  });
  checks.push({
    id: "auto_loop_runs_and_collects_events",
    passed:
      auto.seconds === 10 &&
      auto.battles > 0 &&
      auto.breakthroughs >= 0 &&
      state.logs.length > 0,
  });

  const offlineNowEpochMs = 1771894800000;
  state.lastActiveEpochMs = offlineNowEpochMs - 20 * 3600 * 1000;
  const offline = runOfflineCatchup(context, state, rng, {
    nowEpochMs: offlineNowEpochMs,
    maxOfflineHours: state.settings.offlineCapHours,
    maxCollectedEvents: state.settings.offlineEventLimit,
    battleEverySec: speedTuning.battleEverySec,
    breakthroughEverySec: speedTuning.breakthroughEverySec,
    passiveQiRatio: speedTuning.passiveQiRatio,
    syncAnchorToNow: true,
  });
  checks.push({
    id: "offline_catchup_respects_cap_setting_and_syncs_anchor",
    passed:
      offline.summary.rawOfflineSec === 72000 &&
      offline.summary.appliedOfflineSec === 64800 &&
      offline.summary.cappedByMaxOffline === true &&
      offline.summary.autoSummary !== null &&
      offline.summary.autoSummary.seconds === 64800 &&
      Array.isArray(offline.summary.autoSummary.collectedEvents) &&
      offline.summary.autoSummary.collectedEvents.length > 0 &&
      offline.summary.autoSummary.collectedEvents.length <= 40 &&
      state.lastActiveEpochMs === offlineNowEpochMs &&
      state.logs.some((row) => row.kind === "offline"),
  });

  const noElapsed = runOfflineCatchup(context, state, rng, {
    nowEpochMs: state.lastActiveEpochMs,
    maxOfflineHours: state.settings.offlineCapHours,
    maxCollectedEvents: state.settings.offlineEventLimit,
    syncAnchorToNow: true,
  });
  checks.push({
    id: "offline_catchup_skips_when_no_elapsed_time",
    passed:
      noElapsed.summary.rawOfflineSec === 0 &&
      noElapsed.summary.appliedOfflineSec === 0 &&
      noElapsed.summary.skipReason === "time_not_elapsed" &&
      noElapsed.summary.autoSummary === null,
  });

  const serialized = serializeSliceState(state);
  const restored = parseSliceState(serialized, context);
  checks.push({
    id: "save_roundtrip_is_parseable",
    passed:
      restored.progression.difficultyIndex === state.progression.difficultyIndex &&
      restored.currencies.qi === state.currencies.qi &&
      restored.playerName === state.playerName &&
      restored.lastActiveEpochMs === state.lastActiveEpochMs &&
      restored.settings.autoResumeRealtime === state.settings.autoResumeRealtime &&
      restored.settings.battleSpeed === state.settings.battleSpeed &&
      restored.settings.offlineCapHours === state.settings.offlineCapHours &&
      restored.settings.offlineEventLimit === state.settings.offlineEventLimit &&
      typeof restored.realtimeStats === "object" &&
      restored.realtimeStats.elapsedSec === state.realtimeStats.elapsedSec &&
      restored.realtimeStats.timelineSec === state.realtimeStats.timelineSec &&
      restored.realtimeStats.anchorQi >= 0,
  });

  let failed = 0;
  for (const check of checks) {
    if (check.passed) {
      process.stdout.write(`[pass] ${check.id}\n`);
    } else {
      failed += 1;
      process.stdout.write(`[fail] ${check.id}\n`);
    }
  }

  const report = {
    suite: "mobile_mvp_slice_regression",
    generated_at_utc: new Date().toISOString(),
    scenario_count: checks.length,
    pass_count: checks.length - failed,
    fail_count: failed,
    passed: failed === 0,
    checks,
  };

  if (args.reportFile) {
    await writeFile(args.reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf-8");
  }

  if (failed > 0) {
    throw new Error(`mobile mvp regression failed: ${failed} scenario(s)`);
  }
  process.stdout.write("all mobile mvp slice regression checks passed\n");
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack || err.message : String(err)}\n`);
  process.exitCode = 1;
});
