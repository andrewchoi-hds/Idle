#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildOfflineDetailCompareCode,
  buildOfflineDetailCompareCodeCurrentSummaryLabelKo,
  buildOfflineDetailCompareCodeCurrentSummaryTone,
  buildOfflineDetailCompareCodeDeltaSummaryLabelKo,
  buildOfflineDetailCompareCodeMatchSummaryLabelKo,
  buildOfflineDetailCompareCodeMatchSummaryTone,
  buildOfflineDetailCompareCodeSourceLabelKo,
  buildOfflineDetailCompareCodeSourceTone,
  buildOfflineDetailCompareStatusLabelKo,
  resolveOfflineDetailCompareCheckSource,
  resolveOfflineDetailCompareInputSource,
  resolveOfflineDetailCompareTargetInputState,
  buildOfflineDetailCompareCodeTargetSummaryLabelKo,
  buildOfflineDetailCompareCodeTargetSummaryTone,
  buildOfflineDetailCompareCodeDeltaSummaryTone,
  buildOfflineDetailCompareResultLabelKo,
  buildOfflineDetailCompareResultStateLabelKo,
  buildOfflineDetailCompareResultStateTone,
  buildOfflineDetailCompareActionHintLabelKo,
  buildOfflineDetailCompareActionHintTone,
  resolveOfflineDetailCompareViewModeAlignmentTarget,
  buildOfflineDetailCriticalSummaryLabelKo,
  buildOfflineDetailKindDigest,
  buildOfflineDetailHiddenKindsSummaryLabelKo,
  buildOfflineDetailReportSnapshot,
  buildOfflineDetailHiddenSummaryLabelKo,
  buildOfflineDetailFilterSummaryLabelKo,
  buildStorageKeyForSlot,
  buildSliceContext,
  createInitialSliceState,
  createSeededRng,
  extractOfflineDetailCompareCode,
  extractOfflineDetailCompareCodeFromPayloadText,
  extractOfflineDetailCompareCodeFromPayloadTextWithSource,
  filterOfflineDetailEventsByMode,
  isCopyTargetSlotDisabled,
  isOfflineDetailCompareCode,
  normalizeSaveSlot,
  normalizeSlotSummaryState,
  parseOfflineDetailCompareCode,
  parseSliceState,
  prioritizeOfflineDetailEvents,
  resolveOfflineDetailCompareCodeDiff,
  summarizeOfflineDetailCriticalEvents,
  summarizeOfflineDetailFilterResult,
  summarizeOfflineDetailHiddenKinds,
  resolveAutoBreakthroughResumeConfirmPolicy,
  resolveAutoBreakthroughResumePolicy,
  resolveAutoBreakthroughResumeRecommendationPlan,
  resolveAutoBreakthroughWarmupRemainingSec,
  buildOfflineWarmupTelemetryLabelKo,
  resolveOfflineWarmupTelemetry,
  previewBreakthroughChance,
  resolveBreakthroughAutoAttemptPolicy,
  resolveBreakthroughExpectedDelta,
  resolveBreakthroughManualAttemptPolicy,
  resolveBreakthroughMitigationSummary,
  resolveBreakthroughRecommendation,
  resolveBreakthroughRecommendationToggles,
  resolveBreakthroughRiskTier,
  resolveDebouncedAction,
  resolveSlotCopyHint,
  resolveSlotCopyHintTone,
  resolveLoopTuningFromBattleSpeed,
  resolveSlotCopyPolicy,
  resolveSlotDeleteHint,
  resolveSlotDeleteHintTone,
  resolveSlotDeletePolicy,
  resolveSlotSummaryStateLabelKo,
  resolveSlotSummaryStateShortKo,
  resolveSlotSummaryStateTone,
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
      isCopyTargetSlotDisabled(1, 1) === true &&
      isCopyTargetSlotDisabled(1, 2) === false &&
      isCopyTargetSlotDisabled(3, 3) === true &&
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
  const copyToLocked = resolveSlotCopyPolicy(2, 3, "ok", true);
  checks.push({
    id: "slot_copy_policy_handles_empty_overwrite_and_locked_target",
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
      copyToCorrupt.reason === "target_corrupt" &&
      copyToLocked.allowed === false &&
      copyToLocked.requiresConfirm === false &&
      copyToLocked.reason === "target_locked",
  });

  const deleteEmpty = resolveSlotDeletePolicy(1, "empty");
  const deleteOk = resolveSlotDeletePolicy(2, "ok");
  const deleteCorrupt = resolveSlotDeletePolicy(3, "corrupt");
  const deleteLocked = resolveSlotDeletePolicy(2, "ok", true);
  checks.push({
    id: "slot_delete_policy_skips_empty_confirms_non_empty_and_blocks_locked",
    passed:
      deleteEmpty.allowed === false &&
      deleteEmpty.requiresConfirm === false &&
      deleteEmpty.reason === "empty_slot" &&
      deleteOk.allowed === true &&
      deleteOk.requiresConfirm === true &&
      deleteOk.reason === "has_data" &&
      deleteCorrupt.allowed === true &&
      deleteCorrupt.requiresConfirm === true &&
      deleteCorrupt.reason === "corrupt_slot" &&
      deleteLocked.allowed === false &&
      deleteLocked.requiresConfirm === false &&
      deleteLocked.reason === "slot_locked",
  });

  const copyHintEmptyTarget = resolveSlotCopyHint(copyToEmpty);
  const copyHintConfirm = resolveSlotCopyHint(copyToData);
  const copyHintBlocked = resolveSlotCopyHint(copySameSlot);
  const copyHintLocked = resolveSlotCopyHint(copyToLocked);
  const deleteHintEmpty = resolveSlotDeleteHint(deleteEmpty);
  const deleteHintOk = resolveSlotDeleteHint(deleteOk);
  const deleteHintCorrupt = resolveSlotDeleteHint(deleteCorrupt);
  const deleteHintLocked = resolveSlotDeleteHint(deleteLocked);
  checks.push({
    id: "slot_action_hints_match_policy_reasons",
    passed:
      copyHintEmptyTarget.includes("복제 가능") &&
      copyHintConfirm.includes("덮어써") &&
      copyHintBlocked.includes("달라야") &&
      copyHintLocked.includes("잠겨") &&
      deleteHintEmpty.includes("삭제할 데이터가 없습니다") &&
      deleteHintOk.includes("메모리 상태는 유지") &&
      deleteHintCorrupt.includes("손상된 저장 데이터") &&
      deleteHintLocked.includes("잠겨"),
  });

  checks.push({
    id: "slot_action_hint_tones_match_policy_reasons",
    passed:
      resolveSlotCopyHintTone(copyToEmpty) === "info" &&
      resolveSlotCopyHintTone(copyToData) === "warn" &&
      resolveSlotCopyHintTone(copySameSlot) === "warn" &&
      resolveSlotCopyHintTone(copyToLocked) === "error" &&
      resolveSlotDeleteHintTone(deleteOk) === "info" &&
      resolveSlotDeleteHintTone(deleteCorrupt) === "warn" &&
      resolveSlotDeleteHintTone(deleteEmpty) === "warn" &&
      resolveSlotDeleteHintTone(deleteLocked) === "error",
  });

  checks.push({
    id: "slot_target_state_label_and_tone_match",
    passed:
      resolveSlotSummaryStateLabelKo("empty") === "비어 있음" &&
      resolveSlotSummaryStateLabelKo("ok") === "저장 데이터 있음" &&
      resolveSlotSummaryStateLabelKo("corrupt") === "손상된 저장 데이터" &&
      resolveSlotSummaryStateShortKo("empty") === "비어있음" &&
      resolveSlotSummaryStateShortKo("ok") === "저장됨" &&
      resolveSlotSummaryStateShortKo("corrupt") === "손상" &&
      resolveSlotSummaryStateTone("empty") === "info" &&
      resolveSlotSummaryStateTone("ok") === "warn" &&
      resolveSlotSummaryStateTone("corrupt") === "error",
  });

  const initWithResume = createInitialSliceState(context, {
    playerName: "resume",
    autoResumeRealtime: true,
    autoBreakthroughResumeWarmupSec: 9,
  });
  const warmupClampBase = createInitialSliceState(context, {
    playerName: "warmup-clamp",
  });
  const warmupClampHigh = parseSliceState(
    JSON.stringify({
      ...warmupClampBase,
      settings: {
        ...warmupClampBase.settings,
        autoBreakthroughResumeWarmupSec: 99,
      },
    }),
    context,
  );
  const warmupClampLow = parseSliceState(
    JSON.stringify({
      ...warmupClampBase,
      settings: {
        ...warmupClampBase.settings,
        autoBreakthroughResumeWarmupSec: -4,
      },
    }),
    context,
  );
  checks.push({
    id: "initial_state_applies_auto_resume_and_warmup_option",
    passed:
      initWithResume.settings.autoResumeRealtime === true &&
      initWithResume.settings.autoBreakthroughResumeWarmupSec === 9 &&
      warmupClampHigh.settings.autoBreakthroughResumeWarmupSec === 30 &&
      warmupClampLow.settings.autoBreakthroughResumeWarmupSec === 0,
  });

  checks.push({
    id: "auto_breakthrough_warmup_remaining_progress_clamps_to_zero",
    passed:
      resolveAutoBreakthroughWarmupRemainingSec(8, 3) === 5 &&
      resolveAutoBreakthroughWarmupRemainingSec(8, 8) === 0 &&
      resolveAutoBreakthroughWarmupRemainingSec(8, 99) === 0 &&
      resolveAutoBreakthroughWarmupRemainingSec(-2, 2) === 0,
  });

  checks.push({
    id: "offline_warmup_telemetry_normalizes_before_after_consumed",
    passed:
      resolveOfflineWarmupTelemetry({
        appliedOfflineSec: 2,
        autoBreakthroughWarmupRemainingSecBefore: 5,
        autoBreakthroughWarmupRemainingSecAfter: 3,
        autoSummary: {
          autoBreakthroughWarmupSkips: 2,
        },
      }).consumed === 2 &&
      resolveOfflineWarmupTelemetry({
        appliedOfflineSec: 3,
        autoBreakthroughWarmupRemainingSecBefore: 5,
      }).after === 2 &&
      resolveOfflineWarmupTelemetry({
        appliedOfflineSec: 0,
        autoBreakthroughWarmupRemainingSecBefore: 0,
      }).hadWarmup === false,
  });

  checks.push({
    id: "offline_warmup_telemetry_label_formats_consistently",
    passed:
      buildOfflineWarmupTelemetryLabelKo({
        appliedOfflineSec: 2,
        autoBreakthroughWarmupRemainingSecBefore: 5,
        autoBreakthroughWarmupRemainingSecAfter: 3,
        autoSummary: {
          autoBreakthroughWarmupSkips: 2,
        },
      }).includes("워밍업 5초 → 3초") &&
      buildOfflineWarmupTelemetryLabelKo({
        appliedOfflineSec: 3,
        autoBreakthroughWarmupRemainingSecBefore: 3,
        autoBreakthroughWarmupRemainingSecAfter: 0,
        autoSummary: {
          autoBreakthroughWarmupSkips: 3,
        },
      }).includes("소진") &&
      buildOfflineWarmupTelemetryLabelKo({
        appliedOfflineSec: 0,
        autoBreakthroughWarmupRemainingSecBefore: 0,
      }) === "워밍업 없음",
  });

  const prioritizedOfflineEvents = prioritizeOfflineDetailEvents([
    { sec: 2, kind: "battle_win" },
    { sec: 7, kind: "auto_breakthrough_paused_by_policy" },
    { sec: 5, kind: "offline_warmup_summary" },
    { sec: 9, kind: "battle_loss" },
    { sec: 8, kind: "breakthrough_death_fail" },
    { sec: 10, kind: "auto_breakthrough_paused_by_policy" },
  ]);
  checks.push({
    id: "offline_detail_events_prioritize_critical_kinds",
    passed:
      Array.isArray(prioritizedOfflineEvents) &&
      prioritizedOfflineEvents.length === 6 &&
      prioritizedOfflineEvents[0].kind === "offline_warmup_summary" &&
      prioritizedOfflineEvents[1].kind === "auto_breakthrough_paused_by_policy" &&
      prioritizedOfflineEvents[1].sec === 7 &&
      prioritizedOfflineEvents[2].kind === "auto_breakthrough_paused_by_policy" &&
      prioritizedOfflineEvents[2].sec === 10 &&
      prioritizedOfflineEvents[3].kind === "breakthrough_death_fail" &&
      prioritizedOfflineEvents[4].kind === "battle_win" &&
      prioritizedOfflineEvents[5].kind === "battle_loss" &&
      prioritizeOfflineDetailEvents(null).length === 0,
  });

  const filteredCriticalOfflineEvents = filterOfflineDetailEventsByMode(
    prioritizedOfflineEvents,
    "critical",
  );
  const filteredAllOfflineEvents = filterOfflineDetailEventsByMode(
    prioritizedOfflineEvents,
    "all",
  );
  checks.push({
    id: "offline_detail_events_filter_mode_critical_only",
    passed:
      Array.isArray(filteredCriticalOfflineEvents) &&
      filteredCriticalOfflineEvents.length === 4 &&
      filteredCriticalOfflineEvents[0].kind === "offline_warmup_summary" &&
      filteredCriticalOfflineEvents[1].kind === "auto_breakthrough_paused_by_policy" &&
      filteredCriticalOfflineEvents[2].kind === "auto_breakthrough_paused_by_policy" &&
      filteredCriticalOfflineEvents[3].kind === "breakthrough_death_fail" &&
      Array.isArray(filteredAllOfflineEvents) &&
      filteredAllOfflineEvents.length === prioritizedOfflineEvents.length &&
      filterOfflineDetailEventsByMode(prioritizedOfflineEvents, "unknown").length ===
        prioritizedOfflineEvents.length &&
      filterOfflineDetailEventsByMode(null, "critical").length === 0,
  });

  const allModeSummary = summarizeOfflineDetailFilterResult(prioritizedOfflineEvents, "all");
  const criticalModeSummary = summarizeOfflineDetailFilterResult(
    prioritizedOfflineEvents,
    "critical",
  );
  checks.push({
    id: "offline_detail_filter_summary_result_and_label",
    passed:
      allModeSummary.mode === "all" &&
      allModeSummary.visible === 6 &&
      allModeSummary.total === 6 &&
      allModeSummary.hidden === 0 &&
      allModeSummary.hasHidden === false &&
      criticalModeSummary.mode === "critical" &&
      criticalModeSummary.visible === 4 &&
      criticalModeSummary.total === 6 &&
      criticalModeSummary.hidden === 2 &&
      criticalModeSummary.hasHidden === true &&
      buildOfflineDetailFilterSummaryLabelKo(prioritizedOfflineEvents, "all") ===
        "세부 로그 6건 (전체)" &&
      buildOfflineDetailFilterSummaryLabelKo(prioritizedOfflineEvents, "critical") ===
        "세부 로그 4/6건 (핵심)" &&
      buildOfflineDetailFilterSummaryLabelKo([], "critical") === "세부 로그 0/0건 (핵심)",
  });

  checks.push({
    id: "offline_detail_hidden_summary_label_matches_mode_and_hidden",
    passed:
      buildOfflineDetailHiddenSummaryLabelKo(prioritizedOfflineEvents, "all") ===
        "숨김 이벤트 없음" &&
      buildOfflineDetailHiddenSummaryLabelKo(prioritizedOfflineEvents, "critical") ===
        "비핵심 2건 숨김" &&
      buildOfflineDetailHiddenSummaryLabelKo([], "critical") === "숨김 이벤트 없음",
  });

  const hiddenKindsSummary = summarizeOfflineDetailHiddenKinds(
    prioritizedOfflineEvents,
    "critical",
  );
  checks.push({
    id: "offline_detail_hidden_kinds_summary_label_matches_breakdown",
    passed:
      hiddenKindsSummary.mode === "critical" &&
      hiddenKindsSummary.hidden === 2 &&
      hiddenKindsSummary.items.length === 2 &&
      hiddenKindsSummary.items[0].kind === "battle_win" &&
      hiddenKindsSummary.items[0].count === 1 &&
      hiddenKindsSummary.items[1].kind === "battle_loss" &&
      hiddenKindsSummary.items[1].count === 1 &&
      buildOfflineDetailHiddenKindsSummaryLabelKo(prioritizedOfflineEvents, "all") ===
        "숨김 상세 없음" &&
      buildOfflineDetailHiddenKindsSummaryLabelKo(prioritizedOfflineEvents, "critical") ===
        "숨김 상세 전투 승리 1건 · 전투 패배 1건" &&
      buildOfflineDetailHiddenKindsSummaryLabelKo([], "critical") === "숨김 상세 없음",
  });

  const detailKindDigest = buildOfflineDetailKindDigest(prioritizedOfflineEvents, 3);
  checks.push({
    id: "offline_detail_kind_digest_signature_is_stable",
    passed:
      detailKindDigest.totalEvents === 6 &&
      detailKindDigest.uniqueKinds === 5 &&
      typeof detailKindDigest.checksum === "string" &&
      /^\d{6}$/.test(detailKindDigest.checksum) &&
      detailKindDigest.signature ===
        "auto_breakthrough_paused_by_policy:2|offline_warmup_summary:1|breakthrough_death_fail:1|battle_win:1|battle_loss:1" &&
      Array.isArray(detailKindDigest.topKinds) &&
      detailKindDigest.topKinds.length === 3 &&
      detailKindDigest.topKinds[0].kind === "auto_breakthrough_paused_by_policy" &&
      detailKindDigest.topKinds[0].count === 2 &&
      detailKindDigest.topKinds[1].kind === "offline_warmup_summary" &&
      detailKindDigest.topKinds[1].count === 1 &&
      detailKindDigest.topKinds[2].kind === "breakthrough_death_fail" &&
      detailKindDigest.topKinds[2].count === 1,
  });

  const offlineDetailCompareCodeAll = buildOfflineDetailCompareCode(
    prioritizedOfflineEvents,
    "all",
  );
  const offlineDetailCompareCodeCritical = buildOfflineDetailCompareCode(
    prioritizedOfflineEvents,
    "critical",
  );
  const allChecksumReplacement = offlineDetailCompareCodeAll.includes("-A000000-")
    ? "999999"
    : "000000";
  const offlineDetailCompareCodeAllChecksumMismatch = offlineDetailCompareCodeAll.replace(
    /-A\d{6}-S/,
    `-A${allChecksumReplacement}-S`,
  );
  const offlineDetailCompareCodeAggregateMismatch = offlineDetailCompareCodeAll.replace(
    /-T\d+-/,
    "-T99-",
  );
  checks.push({
    id: "offline_detail_compare_code_has_mode_and_checksum",
    passed:
      typeof offlineDetailCompareCodeAll === "string" &&
      typeof offlineDetailCompareCodeCritical === "string" &&
      offlineDetailCompareCodeAll.startsWith("ODR1-T6-C4-H2-VA-") &&
      offlineDetailCompareCodeCritical.startsWith("ODR1-T6-C4-H2-VC-") &&
      isOfflineDetailCompareCode(offlineDetailCompareCodeAll) &&
      isOfflineDetailCompareCode(offlineDetailCompareCodeCritical) &&
      isOfflineDetailCompareCode("ODR1-T6-C4-H2-VA-A123456-S654321") &&
      !isOfflineDetailCompareCode("ODR1-T6-C4-H2-VX-A123456-S654321") &&
      !isOfflineDetailCompareCode("ODR1-T6-C4-H2-VA-A12345-S654321") &&
      offlineDetailCompareCodeAll !== offlineDetailCompareCodeCritical,
  });

  checks.push({
    id: "offline_detail_compare_code_extracts_from_text_or_json",
    passed:
      extractOfflineDetailCompareCode(offlineDetailCompareCodeAll) ===
        offlineDetailCompareCodeAll &&
      extractOfflineDetailCompareCode(
        `debug payload => ${offlineDetailCompareCodeCritical} end`,
      ) === offlineDetailCompareCodeCritical &&
      extractOfflineDetailCompareCode(
        `{"detailReportSnapshot":{"compareCode":"${offlineDetailCompareCodeAll}"}}`,
      ) === offlineDetailCompareCodeAll &&
      extractOfflineDetailCompareCode("compare code missing") === "",
  });

  checks.push({
    id: "offline_detail_compare_code_extracts_from_payload_text",
    passed:
      extractOfflineDetailCompareCodeFromPayloadText(
        JSON.stringify({
          detailViewSnapshotAtExport: {
            compareCode: offlineDetailCompareCodeCritical,
          },
          detailReportSnapshot: {
            compareCode: offlineDetailCompareCodeAll,
          },
        }),
      ) === offlineDetailCompareCodeCritical &&
      extractOfflineDetailCompareCodeFromPayloadText(
        JSON.stringify({
          detailReportSnapshot: {
            compareCode: offlineDetailCompareCodeAll,
          },
        }),
      ) === offlineDetailCompareCodeAll &&
      extractOfflineDetailCompareCodeFromPayloadText(
        `report => ${offlineDetailCompareCodeAll}`,
      ) === offlineDetailCompareCodeAll &&
      extractOfflineDetailCompareCodeFromPayloadText("payload missing compare code") === "",
  });

  const payloadSourceFromDetailView = extractOfflineDetailCompareCodeFromPayloadTextWithSource(
    JSON.stringify({
      detailViewSnapshotAtExport: {
        compareCode: offlineDetailCompareCodeCritical,
      },
      detailReportSnapshot: {
        compareCode: offlineDetailCompareCodeAll,
      },
    }),
  );
  const payloadSourceFromDetailReport = extractOfflineDetailCompareCodeFromPayloadTextWithSource(
    JSON.stringify({
      detailReportSnapshot: {
        compareCode: offlineDetailCompareCodeAll,
      },
    }),
  );
  const payloadSourceFromText = extractOfflineDetailCompareCodeFromPayloadTextWithSource(
    `report => ${offlineDetailCompareCodeCritical}`,
  );
  const payloadSourceMissing = extractOfflineDetailCompareCodeFromPayloadTextWithSource(
    "payload missing compare code",
  );
  checks.push({
    id: "offline_detail_compare_code_payload_source_is_stable",
    passed:
      payloadSourceFromDetailView.code === offlineDetailCompareCodeCritical &&
      payloadSourceFromDetailView.source === "detail_view_snapshot" &&
      payloadSourceFromDetailReport.code === offlineDetailCompareCodeAll &&
      payloadSourceFromDetailReport.source === "detail_report_snapshot" &&
      payloadSourceFromText.code === offlineDetailCompareCodeCritical &&
      payloadSourceFromText.source === "text" &&
      payloadSourceMissing.code === "" &&
      payloadSourceMissing.source === "none",
  });

  checks.push({
    id: "offline_detail_compare_code_source_label_matches_source",
    passed:
      buildOfflineDetailCompareCodeSourceLabelKo("detail_view_snapshot") ===
        "출처: savePayload.detailViewSnapshotAtExport" &&
      buildOfflineDetailCompareCodeSourceLabelKo("detail_report_snapshot") ===
        "출처: savePayload.detailReportSnapshot" &&
      buildOfflineDetailCompareCodeSourceLabelKo("text") === "출처: savePayload 텍스트" &&
      buildOfflineDetailCompareCodeSourceLabelKo("payload") === "출처: savePayload 텍스트" &&
      buildOfflineDetailCompareCodeSourceLabelKo("clipboard") === "출처: 클립보드 텍스트" &&
      buildOfflineDetailCompareCodeSourceLabelKo("input") === "출처: 비교 코드 입력값" &&
      buildOfflineDetailCompareCodeSourceLabelKo("unknown") === "출처: 없음",
  });

  checks.push({
    id: "offline_detail_compare_code_source_tone_matches_source",
    passed:
      buildOfflineDetailCompareCodeSourceTone("detail_view_snapshot") === "info" &&
      buildOfflineDetailCompareCodeSourceTone("detail_report_snapshot") === "info" &&
      buildOfflineDetailCompareCodeSourceTone("text") === "warn" &&
      buildOfflineDetailCompareCodeSourceTone("payload") === "warn" &&
      buildOfflineDetailCompareCodeSourceTone("clipboard") === "warn" &&
      buildOfflineDetailCompareCodeSourceTone("input") === "warn" &&
      buildOfflineDetailCompareCodeSourceTone("none") === "info" &&
      buildOfflineDetailCompareCodeSourceTone("unknown") === "error",
  });

  checks.push({
    id: "offline_detail_compare_status_label_includes_source_prefix",
    passed:
      buildOfflineDetailCompareStatusLabelKo("none", "비교 코드 입력 필요") ===
        "[출처: 없음] 비교 코드 입력 필요" &&
      buildOfflineDetailCompareStatusLabelKo("clipboard", "비교 코드 형식 오류") ===
        "[출처: 클립보드 텍스트] 비교 코드 형식 오류" &&
      buildOfflineDetailCompareStatusLabelKo(
        "detail_view_snapshot",
        "비교 코드 일치",
      ) === "[출처: savePayload.detailViewSnapshotAtExport] 비교 코드 일치" &&
      buildOfflineDetailCompareStatusLabelKo("unknown", "") === "[출처: 없음] 상태 없음",
  });

  checks.push({
    id: "offline_detail_compare_status_label_supports_extraction_failures",
    passed:
      buildOfflineDetailCompareStatusLabelKo("clipboard", "클립보드 읽기 미지원 환경") ===
        "[출처: 클립보드 텍스트] 클립보드 읽기 미지원 환경" &&
      buildOfflineDetailCompareStatusLabelKo("clipboard", "클립보드 읽기 실패") ===
        "[출처: 클립보드 텍스트] 클립보드 읽기 실패" &&
      buildOfflineDetailCompareStatusLabelKo(
        "clipboard",
        "클립보드에서 비교 코드 인식 실패",
      ) === "[출처: 클립보드 텍스트] 클립보드에서 비교 코드 인식 실패" &&
      buildOfflineDetailCompareStatusLabelKo("none", "savePayload 입력 필요") ===
        "[출처: 없음] savePayload 입력 필요" &&
      buildOfflineDetailCompareStatusLabelKo(
        "payload",
        "savePayload에서 비교 코드 인식 실패",
      ) === "[출처: savePayload 텍스트] savePayload에서 비교 코드 인식 실패",
  });

  checks.push({
    id: "offline_detail_compare_input_source_resolves_none_or_input",
    passed:
      resolveOfflineDetailCompareInputSource("") === "none" &&
      resolveOfflineDetailCompareInputSource("   ") === "none" &&
      resolveOfflineDetailCompareInputSource("ODR1-T6-C4-H2-VA-A000000-S000000") ===
        "input",
  });

  checks.push({
    id: "offline_detail_compare_check_source_resolves_keep_input_and_explicit",
    passed:
      resolveOfflineDetailCompareCheckSource(
        "input",
        "detail_view_snapshot",
        "",
      ) === "none" &&
      resolveOfflineDetailCompareCheckSource(
        "input",
        "detail_view_snapshot",
        "ODR1-T6-C4-H2-VA-A000000-S000000",
      ) === "input" &&
      resolveOfflineDetailCompareCheckSource(
        "keep",
        "detail_view_snapshot",
        "ODR1-T6-C4-H2-VA-A000000-S000000",
      ) === "detail_view_snapshot" &&
      resolveOfflineDetailCompareCheckSource(
        "keep",
        "none",
        "ODR1-T6-C4-H2-VA-A000000-S000000",
      ) === "input" &&
      resolveOfflineDetailCompareCheckSource("keep", "", "") === "none" &&
      resolveOfflineDetailCompareCheckSource("clipboard", "none", "") ===
        "clipboard" &&
      resolveOfflineDetailCompareCheckSource("", "input", "") === "none",
  });

  checks.push({
    id: "offline_detail_compare_target_input_state_distinguishes_empty_invalid_valid",
    passed:
      resolveOfflineDetailCompareTargetInputState("") === "empty" &&
      resolveOfflineDetailCompareTargetInputState("   ") === "empty" &&
      resolveOfflineDetailCompareTargetInputState("invalid text") === "invalid" &&
      resolveOfflineDetailCompareTargetInputState(
        `prefix ${offlineDetailCompareCodeAll} suffix`,
      ) === "valid",
  });

  checks.push({
    id: "offline_detail_compare_code_target_summary_label_matches_target",
    passed:
      buildOfflineDetailCompareCodeTargetSummaryLabelKo("") === "대상 코드: 없음" &&
      buildOfflineDetailCompareCodeTargetSummaryLabelKo("no compare code in this text") ===
        "대상 코드 형식 오류" &&
      buildOfflineDetailCompareCodeTargetSummaryLabelKo(offlineDetailCompareCodeAll) ===
        "대상 코드: 총 6 · 핵심표시 4 · 숨김 2 · 보기 전체" &&
      buildOfflineDetailCompareCodeTargetSummaryLabelKo(
        `payload => ${offlineDetailCompareCodeCritical}`,
      ) === "대상 코드: 총 6 · 핵심표시 4 · 숨김 2 · 보기 핵심",
  });

  checks.push({
    id: "offline_detail_compare_code_target_summary_tone_matches_target",
    passed:
      buildOfflineDetailCompareCodeTargetSummaryTone("") === "info" &&
      buildOfflineDetailCompareCodeTargetSummaryTone("no compare code in this text") ===
        "warn" &&
      buildOfflineDetailCompareCodeTargetSummaryTone(offlineDetailCompareCodeAll) ===
        "info" &&
      buildOfflineDetailCompareCodeTargetSummaryTone(
        `payload => ${offlineDetailCompareCodeCritical}`,
      ) === "info",
  });

  checks.push({
    id: "offline_detail_compare_code_current_summary_label_matches_current",
    passed:
      buildOfflineDetailCompareCodeCurrentSummaryLabelKo("") === "현재 코드: 없음" &&
      buildOfflineDetailCompareCodeCurrentSummaryLabelKo("invalid text") ===
        "현재 코드 형식 오류" &&
      buildOfflineDetailCompareCodeCurrentSummaryLabelKo(offlineDetailCompareCodeAll) ===
        "현재 코드: 총 6 · 핵심표시 4 · 숨김 2 · 보기 전체" &&
      buildOfflineDetailCompareCodeCurrentSummaryLabelKo(
        `log ${offlineDetailCompareCodeCritical} log`,
      ) === "현재 코드: 총 6 · 핵심표시 4 · 숨김 2 · 보기 핵심",
  });

  checks.push({
    id: "offline_detail_compare_code_current_summary_tone_matches_current",
    passed:
      buildOfflineDetailCompareCodeCurrentSummaryTone("") === "info" &&
      buildOfflineDetailCompareCodeCurrentSummaryTone("invalid text") ===
        "warn" &&
      buildOfflineDetailCompareCodeCurrentSummaryTone(offlineDetailCompareCodeAll) ===
        "info" &&
      buildOfflineDetailCompareCodeCurrentSummaryTone(
        `log ${offlineDetailCompareCodeCritical} log`,
      ) === "info",
  });

  checks.push({
    id: "offline_detail_compare_code_delta_summary_label_matches_diff",
    passed:
      buildOfflineDetailCompareCodeDeltaSummaryLabelKo(
        offlineDetailCompareCodeAll,
        "",
      ) === "차이 요약: 대상 코드 없음" &&
      buildOfflineDetailCompareCodeDeltaSummaryLabelKo(
        "INVALID",
        offlineDetailCompareCodeAll,
      ) === "차이 요약: 현재 코드 없음" &&
      buildOfflineDetailCompareCodeDeltaSummaryLabelKo(
        offlineDetailCompareCodeAll,
        "invalid target",
      ) === "차이 요약: 대상 코드 형식 오류" &&
      buildOfflineDetailCompareCodeDeltaSummaryLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "차이 요약: 차이 없음" &&
      buildOfflineDetailCompareCodeDeltaSummaryLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeCritical,
      ) === "차이 요약: 보기 전체→핵심 · view checksum 변경",
  });

  checks.push({
    id: "offline_detail_compare_code_delta_summary_tone_matches_diff",
    passed:
      buildOfflineDetailCompareCodeDeltaSummaryTone(offlineDetailCompareCodeAll, "") ===
        "info" &&
      buildOfflineDetailCompareCodeDeltaSummaryTone("INVALID", offlineDetailCompareCodeAll) ===
        "error" &&
      buildOfflineDetailCompareCodeDeltaSummaryTone(offlineDetailCompareCodeAll, "invalid") ===
        "warn" &&
      buildOfflineDetailCompareCodeDeltaSummaryTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "info" &&
      buildOfflineDetailCompareCodeDeltaSummaryTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeCritical,
      ) === "warn" &&
      buildOfflineDetailCompareCodeDeltaSummaryTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAllChecksumMismatch,
      ) === "warn" &&
      buildOfflineDetailCompareCodeDeltaSummaryTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAggregateMismatch,
      ) === "error",
  });

  checks.push({
    id: "offline_detail_compare_code_match_summary_label_matches_diff",
    passed:
      buildOfflineDetailCompareCodeMatchSummaryLabelKo(
        offlineDetailCompareCodeAll,
        "",
      ) === "일치 요약: 대상 코드 없음" &&
      buildOfflineDetailCompareCodeMatchSummaryLabelKo(
        "INVALID",
        offlineDetailCompareCodeAll,
      ) === "일치 요약: 현재 코드 없음" &&
      buildOfflineDetailCompareCodeMatchSummaryLabelKo(
        offlineDetailCompareCodeAll,
        "invalid target",
      ) === "일치 요약: 대상 코드 형식 오류" &&
      buildOfflineDetailCompareCodeMatchSummaryLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) ===
        "일치 요약: 총 일치 · 핵심표시 일치 · 숨김 일치 · 보기 일치 · 전체 checksum 일치 · view checksum 일치" &&
      buildOfflineDetailCompareCodeMatchSummaryLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeCritical,
      ) ===
        "일치 요약: 총 일치 · 핵심표시 일치 · 숨김 일치 · 보기 불일치 · 전체 checksum 일치 · view checksum 불일치",
  });

  checks.push({
    id: "offline_detail_compare_code_match_summary_tone_matches_diff",
    passed:
      buildOfflineDetailCompareCodeMatchSummaryTone(offlineDetailCompareCodeAll, "") ===
        "info" &&
      buildOfflineDetailCompareCodeMatchSummaryTone("INVALID", offlineDetailCompareCodeAll) ===
        "error" &&
      buildOfflineDetailCompareCodeMatchSummaryTone(offlineDetailCompareCodeAll, "invalid") ===
        "warn" &&
      buildOfflineDetailCompareCodeMatchSummaryTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "info" &&
      buildOfflineDetailCompareCodeMatchSummaryTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeCritical,
      ) === "warn" &&
      buildOfflineDetailCompareCodeMatchSummaryTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAllChecksumMismatch,
      ) === "warn" &&
      buildOfflineDetailCompareCodeMatchSummaryTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAggregateMismatch,
      ) === "error",
  });

  checks.push({
    id: "offline_detail_compare_code_result_state_label_matches_input_state",
    passed:
      buildOfflineDetailCompareResultStateLabelKo(offlineDetailCompareCodeAll, "") ===
        "비교 대기 중" &&
      buildOfflineDetailCompareResultStateLabelKo(offlineDetailCompareCodeAll, "invalid") ===
        "비교 코드를 입력하세요" &&
      buildOfflineDetailCompareResultStateLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "비교 결과: 완전 일치" &&
      buildOfflineDetailCompareResultStateLabelKo(
        offlineDetailCompareCodeAll,
        `payload => ${offlineDetailCompareCodeCritical}`,
      ) === "비교 결과: 전체 분포 동일, view 분포 차이" &&
      buildOfflineDetailCompareResultStateLabelKo("INVALID", offlineDetailCompareCodeAll) ===
        "현재 비교 코드가 없어 대조 불가",
  });

  checks.push({
    id: "offline_detail_compare_code_result_state_tone_matches_input_state",
    passed:
      buildOfflineDetailCompareResultStateTone(offlineDetailCompareCodeAll, "") === "info" &&
      buildOfflineDetailCompareResultStateTone(offlineDetailCompareCodeAll, "invalid") ===
        "warn" &&
      buildOfflineDetailCompareResultStateTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "info" &&
      buildOfflineDetailCompareResultStateTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeCritical,
      ) === "warn" &&
      buildOfflineDetailCompareResultStateTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAllChecksumMismatch,
      ) === "warn" &&
      buildOfflineDetailCompareResultStateTone(
        "INVALID",
        offlineDetailCompareCodeAll,
      ) === "error",
  });

  checks.push({
    id: "offline_detail_compare_code_action_hint_label_matches_state",
    passed:
      buildOfflineDetailCompareActionHintLabelKo(offlineDetailCompareCodeAll, "") ===
        "가이드: 비교 코드를 입력하세요." &&
      buildOfflineDetailCompareActionHintLabelKo(offlineDetailCompareCodeAll, "invalid") ===
        "가이드: ODR1 비교 코드를 붙여넣거나 입력하세요." &&
      buildOfflineDetailCompareActionHintLabelKo("INVALID", offlineDetailCompareCodeAll) ===
        "가이드: 오프라인 정산 로그를 열어 현재 코드를 먼저 생성하세요." &&
      buildOfflineDetailCompareActionHintLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "가이드: 코드가 일치합니다. 그대로 유지하세요." &&
      buildOfflineDetailCompareActionHintLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeCritical,
      ) === "가이드: 보기 모드 차이입니다. 동일 모드로 다시 비교하세요." &&
      buildOfflineDetailCompareActionHintLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAllChecksumMismatch,
      ) === "가이드: 이벤트 구성 분포가 다릅니다. 정산 로그 원본을 확인하세요." &&
      buildOfflineDetailCompareActionHintLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAggregateMismatch,
      ) === "가이드: 주요 집계가 다릅니다. 저장 시점/필터를 다시 확인하세요.",
  });

  checks.push({
    id: "offline_detail_compare_code_action_hint_tone_matches_state",
    passed:
      buildOfflineDetailCompareActionHintTone(offlineDetailCompareCodeAll, "") === "warn" &&
      buildOfflineDetailCompareActionHintTone(offlineDetailCompareCodeAll, "invalid") ===
        "warn" &&
      buildOfflineDetailCompareActionHintTone("INVALID", offlineDetailCompareCodeAll) ===
        "error" &&
      buildOfflineDetailCompareActionHintTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "info" &&
      buildOfflineDetailCompareActionHintTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeCritical,
      ) === "warn" &&
      buildOfflineDetailCompareActionHintTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAllChecksumMismatch,
      ) === "warn" &&
      buildOfflineDetailCompareActionHintTone(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAggregateMismatch,
      ) === "error",
  });

  checks.push({
    id: "offline_detail_compare_view_mode_alignment_target_matches_state",
    passed:
      resolveOfflineDetailCompareViewModeAlignmentTarget(offlineDetailCompareCodeAll, "") ===
        "" &&
      resolveOfflineDetailCompareViewModeAlignmentTarget(
        offlineDetailCompareCodeAll,
        "invalid",
      ) === "" &&
      resolveOfflineDetailCompareViewModeAlignmentTarget(
        "INVALID",
        offlineDetailCompareCodeAll,
      ) === "" &&
      resolveOfflineDetailCompareViewModeAlignmentTarget(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "" &&
      resolveOfflineDetailCompareViewModeAlignmentTarget(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeCritical,
      ) === "critical" &&
      resolveOfflineDetailCompareViewModeAlignmentTarget(
        offlineDetailCompareCodeCritical,
        offlineDetailCompareCodeAll,
      ) === "all" &&
      resolveOfflineDetailCompareViewModeAlignmentTarget(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAllChecksumMismatch,
      ) === "" &&
      resolveOfflineDetailCompareViewModeAlignmentTarget(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAggregateMismatch,
      ) === "",
  });

  const parsedOfflineCompareCode = parseOfflineDetailCompareCode(offlineDetailCompareCodeAll);
  const compareCodeDiff = resolveOfflineDetailCompareCodeDiff(
    offlineDetailCompareCodeAll,
    offlineDetailCompareCodeCritical,
  );
  checks.push({
    id: "offline_detail_compare_code_parse_and_diff_are_consistent",
    passed:
      !!parsedOfflineCompareCode &&
      parsedOfflineCompareCode.version === "ODR1" &&
      parsedOfflineCompareCode.totalEvents === 6 &&
      parsedOfflineCompareCode.criticalVisibleEvents === 4 &&
      parsedOfflineCompareCode.hiddenCriticalEvents === 2 &&
      parsedOfflineCompareCode.viewMode === "all" &&
      parsedOfflineCompareCode.allChecksum.length === 6 &&
      parsedOfflineCompareCode.viewChecksum.length === 6 &&
      compareCodeDiff.comparable === true &&
      compareCodeDiff.reason === "ok" &&
      compareCodeDiff.identical === false &&
      compareCodeDiff.sameTotalEvents === true &&
      compareCodeDiff.sameCriticalVisibleEvents === true &&
      compareCodeDiff.sameHiddenCriticalEvents === true &&
      compareCodeDiff.sameViewMode === false &&
      resolveOfflineDetailCompareCodeDiff(offlineDetailCompareCodeAll, "BAD").reason ===
        "target_invalid" &&
      buildOfflineDetailCompareResultLabelKo(
        offlineDetailCompareCodeAll,
        offlineDetailCompareCodeAll,
      ) === "비교 결과: 완전 일치" &&
      buildOfflineDetailCompareResultLabelKo(offlineDetailCompareCodeAll, "BAD").includes(
        "형식 오류",
      ),
  });

  const detailReportSnapshot = buildOfflineDetailReportSnapshot(prioritizedOfflineEvents, 1);
  const detailReportSnapshotCriticalView = buildOfflineDetailReportSnapshot(
    prioritizedOfflineEvents,
    1,
    "critical",
  );
  checks.push({
    id: "offline_detail_report_snapshot_contains_filter_breakdown",
    passed:
      detailReportSnapshot.totalEvents === 6 &&
      detailReportSnapshot.visibleAllEvents === 6 &&
      detailReportSnapshot.visibleCriticalEvents === 4 &&
      detailReportSnapshot.hiddenCriticalEvents === 2 &&
      detailReportSnapshot.viewMode === "all" &&
      detailReportSnapshot.viewVisibleEvents === 6 &&
      detailReportSnapshot.viewHiddenEvents === 0 &&
      detailReportSnapshot.labelsKo.all === "세부 로그 6건 (전체)" &&
      detailReportSnapshot.labelsKo.critical === "세부 로그 4/6건 (핵심)" &&
      detailReportSnapshot.labelsKo.hidden === "비핵심 2건 숨김" &&
      detailReportSnapshot.labelsKo.hiddenKinds === "숨김 상세 전투 승리 1건 · 외 1건" &&
      detailReportSnapshot.labelsKo.view === "세부 로그 6건 (전체)" &&
      detailReportSnapshot.labelsKo.viewHidden === "숨김 이벤트 없음" &&
      detailReportSnapshot.labelsKo.viewHiddenKinds === "숨김 상세 없음" &&
      Array.isArray(detailReportSnapshot.hiddenKindsTop) &&
      detailReportSnapshot.hiddenKindsTop.length === 1 &&
      detailReportSnapshot.hiddenKindsTop[0].kind === "battle_win" &&
      detailReportSnapshot.hiddenKindsTop[0].count === 1 &&
      detailReportSnapshot.compareCode === offlineDetailCompareCodeAll &&
      typeof detailReportSnapshot.kindDigest.all.checksum === "string" &&
      /^\d{6}$/.test(detailReportSnapshot.kindDigest.all.checksum) &&
      typeof detailReportSnapshot.kindDigest.view.checksum === "string" &&
      /^\d{6}$/.test(detailReportSnapshot.kindDigest.view.checksum) &&
      detailReportSnapshot.kindDigest.all.signature ===
        "auto_breakthrough_paused_by_policy:2|offline_warmup_summary:1|breakthrough_death_fail:1|battle_win:1|battle_loss:1" &&
      detailReportSnapshot.kindDigest.view.signature ===
        "auto_breakthrough_paused_by_policy:2|offline_warmup_summary:1|breakthrough_death_fail:1|battle_win:1|battle_loss:1" &&
      detailReportSnapshotCriticalView.viewMode === "critical" &&
      detailReportSnapshotCriticalView.viewVisibleEvents === 4 &&
      detailReportSnapshotCriticalView.viewHiddenEvents === 2 &&
      detailReportSnapshotCriticalView.labelsKo.view === "세부 로그 4/6건 (핵심)" &&
      detailReportSnapshotCriticalView.labelsKo.viewHidden === "비핵심 2건 숨김" &&
      detailReportSnapshotCriticalView.labelsKo.viewHiddenKinds ===
        "숨김 상세 전투 승리 1건 · 외 1건" &&
      detailReportSnapshotCriticalView.compareCode === offlineDetailCompareCodeCritical &&
      detailReportSnapshotCriticalView.kindDigest.view.signature ===
        "auto_breakthrough_paused_by_policy:2|offline_warmup_summary:1|breakthrough_death_fail:1",
  });

  const offlineCriticalSummary = summarizeOfflineDetailCriticalEvents([
    { sec: 5, kind: "offline_warmup_summary" },
    { sec: 7, kind: "auto_breakthrough_paused_by_policy" },
    { sec: 8, kind: "breakthrough_death_fail" },
    { sec: 9, kind: "battle_win" },
  ]);
  checks.push({
    id: "offline_detail_critical_summary_counts_and_label",
    passed:
      offlineCriticalSummary.warmup === 1 &&
      offlineCriticalSummary.paused === 1 &&
      offlineCriticalSummary.death === 1 &&
      offlineCriticalSummary.total === 3 &&
      buildOfflineDetailCriticalSummaryLabelKo([
        { kind: "offline_warmup_summary" },
        { kind: "auto_breakthrough_paused_by_policy" },
      ]) === "총 2건 (워밍업 1 · 일시정지 1)" &&
      buildOfflineDetailCriticalSummaryLabelKo([]) === "핵심 이벤트 없음",
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

  const previewTribulationState = createInitialSliceState(context, { playerName: "preview-trib" });
  previewTribulationState.progression.difficultyIndex = 198;
  const previewTribulationBase = previewBreakthroughChance(context, previewTribulationState, {
    useBreakthroughElixir: false,
    useTribulationTalisman: false,
  });
  const previewTribulationBoosted = previewBreakthroughChance(context, previewTribulationState, {
    useBreakthroughElixir: true,
    useTribulationTalisman: true,
  });
  const previewMortalState = createInitialSliceState(context, { playerName: "preview-mortal" });
  const previewMortal = previewBreakthroughChance(context, previewMortalState, {
    useBreakthroughElixir: false,
    useTribulationTalisman: false,
  });
  const riskTribulationBase = resolveBreakthroughRiskTier(previewTribulationBase);
  const riskTribulationBoosted = resolveBreakthroughRiskTier(previewTribulationBoosted);
  const riskMortal = resolveBreakthroughRiskTier(previewMortal);
  const triTotal =
    previewTribulationBase.successPct +
    previewTribulationBase.minorFailPct +
    previewTribulationBase.retreatFailPct +
    previewTribulationBase.deathFailPct;
  const mortalTotal =
    previewMortal.successPct +
    previewMortal.minorFailPct +
    previewMortal.retreatFailPct +
    previewMortal.deathFailPct;
  const triFailureSplitTotal =
    previewTribulationBase.deathInFailurePct +
    previewTribulationBase.retreatInFailurePct +
    previewTribulationBase.minorInFailurePct;
  checks.push({
    id: "breakthrough_preview_distribution_is_consistent",
    passed:
      Math.abs(triTotal - 100) < 0.000001 &&
      Math.abs(triFailureSplitTotal - 100) < 0.000001 &&
      previewTribulationBase.minorFailPct >= 0 &&
      previewTribulationBase.retreatFailPct >= 0 &&
      previewTribulationBase.deathFailPct >= 0 &&
      previewTribulationBoosted.successPct >= previewTribulationBase.successPct &&
      previewTribulationBoosted.deathPct <= previewTribulationBase.deathPct &&
      previewTribulationBoosted.deathFailPct <= previewTribulationBase.deathFailPct &&
      riskTribulationBoosted.rank <= riskTribulationBase.rank &&
      riskTribulationBase.tone !== "info" &&
      riskMortal.tier === "safe" &&
      riskMortal.tone === "info" &&
      Math.abs(mortalTotal - 100) < 0.000001 &&
      previewMortal.deathInFailurePct === 0 &&
      previewMortal.deathFailPct === 0 &&
      previewMortal.retreatFailPct === 0,
  });

  previewTribulationState.currencies.qi = Math.max(
    previewTribulationState.currencies.qi,
    (context.stageByDifficulty.get(198)?.qi_required ?? 1) * 3,
  );
  const expectedTribulation = resolveBreakthroughExpectedDelta(
    context,
    previewTribulationState,
    previewTribulationBase,
  );
  const expectedMortal = resolveBreakthroughExpectedDelta(
    context,
    previewMortalState,
    previewMortal,
  );
  checks.push({
    id: "breakthrough_expected_delta_matches_stage_risk_profile",
    passed:
      expectedTribulation.expectedQiDelta < 0 &&
      expectedTribulation.expectedRebirthEssenceDelta > 0 &&
      Number.isFinite(expectedTribulation.expectedDifficultyDelta) &&
      expectedMortal.expectedQiDelta < 0 &&
      expectedMortal.expectedRebirthEssenceDelta === 0 &&
      expectedMortal.expectedDifficultyDelta > 0,
  });

  const manualPolicyExtreme = resolveBreakthroughManualAttemptPolicy(
    {
      stage: { is_tribulation: 1 },
      successPct: 34,
      deathFailPct: 14,
    },
    { expectedQiLossRatio: 0.71 },
  );
  const manualPolicyHigh = resolveBreakthroughManualAttemptPolicy(
    {
      stage: { is_tribulation: 1 },
      successPct: 47,
      deathFailPct: 9,
    },
    { expectedQiLossRatio: 0.42 },
  );
  const manualPolicyHighCost = resolveBreakthroughManualAttemptPolicy(
    {
      stage: { is_tribulation: 0 },
      successPct: 84,
      deathFailPct: 0,
    },
    { expectedQiLossRatio: 0.72 },
  );
  const manualPolicySafe = resolveBreakthroughManualAttemptPolicy(
    {
      stage: { is_tribulation: 0 },
      successPct: 86,
      deathFailPct: 0,
    },
    { expectedQiLossRatio: 0.18 },
  );
  checks.push({
    id: "breakthrough_manual_attempt_policy_requires_confirm_on_high_risk_or_cost",
    passed:
      manualPolicyExtreme.requiresConfirm === true &&
      manualPolicyExtreme.reason === "extreme_risk" &&
      manualPolicyExtreme.tone === "error" &&
      manualPolicyHigh.requiresConfirm === true &&
      manualPolicyHigh.reason === "high_risk" &&
      manualPolicyHigh.tone === "warn" &&
      manualPolicyHighCost.requiresConfirm === true &&
      manualPolicyHighCost.reason === "high_qi_cost" &&
      manualPolicySafe.requiresConfirm === false &&
      manualPolicySafe.reason === "safe",
  });

  const autoPolicyBlocked = resolveBreakthroughAutoAttemptPolicy(
    {
      stage: { is_tribulation: 1 },
      successPct: 45,
      deathFailPct: 11,
    },
    { expectedQiLossRatio: 0.41 },
  );
  const autoPolicySafe = resolveBreakthroughAutoAttemptPolicy(
    {
      stage: { is_tribulation: 0 },
      successPct: 86,
      deathFailPct: 0,
    },
    { expectedQiLossRatio: 0.2 },
  );
  checks.push({
    id: "breakthrough_auto_attempt_policy_blocks_high_risk_paths",
    passed:
      autoPolicyBlocked.allowed === false &&
      autoPolicyBlocked.reason === "blocked_high_risk" &&
      autoPolicyBlocked.reasonLabelKo === "고위험" &&
      autoPolicyBlocked.tone === "warn" &&
      typeof autoPolicyBlocked.nextActionKo === "string" &&
      autoPolicyBlocked.nextActionKo.length > 0 &&
      autoPolicySafe.allowed === true &&
      autoPolicySafe.reason === "safe",
  });

  const resumeReadyState = createInitialSliceState(context, { playerName: "resume-ready" });
  resumeReadyState.settings.autoBreakthrough = false;
  const resumeReadyPolicy = resolveAutoBreakthroughResumePolicy(context, resumeReadyState);
  const resumeOnState = createInitialSliceState(context, { playerName: "resume-on" });
  resumeOnState.settings.autoBreakthrough = true;
  const resumeOnPolicy = resolveAutoBreakthroughResumePolicy(context, resumeOnState);
  const resumeBlockedState = createInitialSliceState(context, { playerName: "resume-blocked" });
  resumeBlockedState.settings.autoBreakthrough = false;
  resumeBlockedState.settings.autoTribulation = true;
  resumeBlockedState.progression.difficultyIndex = 198;
  resumeBlockedState.inventory.breakthroughElixir = 0;
  resumeBlockedState.inventory.tribulationTalisman = 0;
  resumeBlockedState.currencies.qi = Math.max(
    1,
    (context.stageByDifficulty.get(198)?.qi_required ?? 1) * 6,
  );
  const resumeBlockedPolicy = resolveAutoBreakthroughResumePolicy(context, resumeBlockedState);
  const resumeNeedTribulationState = createInitialSliceState(context, {
    playerName: "resume-tribulation-toggle",
  });
  resumeNeedTribulationState.settings.autoBreakthrough = false;
  resumeNeedTribulationState.settings.autoTribulation = false;
  resumeNeedTribulationState.progression.difficultyIndex = 13;
  resumeNeedTribulationState.currencies.qi = Math.max(
    1,
    (context.stageByDifficulty.get(13)?.qi_required ?? 1) * 4,
  );
  const resumeNeedTribulationPolicy = resolveAutoBreakthroughResumePolicy(
    context,
    resumeNeedTribulationState,
  );
  const resumeTribulationReadyState = createInitialSliceState(context, {
    playerName: "resume-tribulation-ready",
  });
  resumeTribulationReadyState.settings.autoBreakthrough = false;
  resumeTribulationReadyState.settings.autoTribulation = true;
  resumeTribulationReadyState.progression.difficultyIndex = 13;
  resumeTribulationReadyState.currencies.qi = Math.max(
    1,
    (context.stageByDifficulty.get(13)?.qi_required ?? 1) * 4,
  );
  const resumeTribulationReadyPolicy = resolveAutoBreakthroughResumePolicy(
    context,
    resumeTribulationReadyState,
  );
  checks.push({
    id: "auto_breakthrough_resume_policy_matches_state_and_risk",
    passed:
      resumeReadyPolicy.reason === "resume_ready" &&
      resumeReadyPolicy.actionable === true &&
      resumeReadyPolicy.shouldEnableAutoBreakthrough === true &&
      resumeOnPolicy.reason === "already_enabled" &&
      resumeOnPolicy.actionable === false &&
      resumeBlockedPolicy.actionable === false &&
      resumeBlockedPolicy.reason !== "resume_ready" &&
      resumeNeedTribulationPolicy.reason === "tribulation_disabled" &&
      resumeNeedTribulationPolicy.actionable === true &&
      resumeNeedTribulationPolicy.shouldEnableAutoBreakthrough === true &&
      resumeNeedTribulationPolicy.shouldEnableAutoTribulation === true,
  });

  const resumeConfirmReady = resolveAutoBreakthroughResumeConfirmPolicy(
    resumeReadyPolicy,
  );
  const resumeConfirmTribulationReady = resolveAutoBreakthroughResumeConfirmPolicy(
    resumeTribulationReadyPolicy,
  );
  const resumeConfirmNeedTribulation = resolveAutoBreakthroughResumeConfirmPolicy(
    resumeNeedTribulationPolicy,
  );
  const resumeConfirmBlocked = resolveAutoBreakthroughResumeConfirmPolicy(
    resumeBlockedPolicy,
  );
  checks.push({
    id: "auto_breakthrough_resume_confirm_policy_matches_tribulation_context",
    passed:
      resumeConfirmReady.requiresConfirm === false &&
      resumeConfirmReady.reason === "non_tribulation" &&
      resumeConfirmTribulationReady.requiresConfirm === true &&
      resumeConfirmTribulationReady.reason === "tribulation_auto_resume" &&
      resumeConfirmNeedTribulation.requiresConfirm === true &&
      resumeConfirmNeedTribulation.reason === "enable_tribulation_auto_resume" &&
      resumeConfirmNeedTribulation.enableTribulation === true &&
      resumeConfirmBlocked.requiresConfirm === false &&
      resumeConfirmBlocked.reason === "not_actionable",
  });

  const resumeRecommendationToggle = resolveBreakthroughRecommendationToggles(
    {
      stage: { is_tribulation: 1 },
      successPct: 45,
      deathFailPct: 11,
    },
    {
      hasBreakthroughElixir: true,
      hasTribulationTalisman: true,
      currentUseBreakthroughElixir: false,
      currentUseTribulationTalisman: false,
    },
  );
  const resumeRecommendationPlan = resolveAutoBreakthroughResumeRecommendationPlan(
    resumeConfirmNeedTribulation,
    resumeRecommendationToggle,
  );
  const resumeRecommendationPlanNoConfirm =
    resolveAutoBreakthroughResumeRecommendationPlan(
      resumeConfirmReady,
      resumeRecommendationToggle,
    );
  const resumeRecommendationToggleMissing = resolveBreakthroughRecommendationToggles(
    {
      stage: { is_tribulation: 1 },
      successPct: 45,
      deathFailPct: 11,
    },
    {
      hasBreakthroughElixir: false,
      hasTribulationTalisman: false,
      currentUseBreakthroughElixir: true,
      currentUseTribulationTalisman: true,
    },
  );
  const resumeRecommendationPlanMissing =
    resolveAutoBreakthroughResumeRecommendationPlan(
      resumeConfirmNeedTribulation,
      resumeRecommendationToggleMissing,
    );
  const resumeRecommendationToggleNoChange = resolveBreakthroughRecommendationToggles(
    {
      stage: { is_tribulation: 1 },
      successPct: 74,
      deathFailPct: 3,
    },
    {
      hasBreakthroughElixir: true,
      hasTribulationTalisman: true,
      currentUseBreakthroughElixir: false,
      currentUseTribulationTalisman: false,
    },
  );
  const resumeRecommendationPlanNoChange =
    resolveAutoBreakthroughResumeRecommendationPlan(
      resumeConfirmTribulationReady,
      resumeRecommendationToggleNoChange,
    );
  checks.push({
    id: "auto_breakthrough_resume_recommendation_plan_applies_only_on_confirm",
    passed:
      resumeRecommendationPlan.shouldApplyRecommendation === true &&
      resumeRecommendationPlan.nextUseBreakthroughElixir === true &&
      resumeRecommendationPlan.nextUseTribulationTalisman === true &&
      resumeRecommendationPlan.messageKo.includes("권장 설정 자동 적용") &&
      resumeRecommendationPlanNoConfirm.shouldApplyRecommendation === false &&
      resumeRecommendationPlanMissing.shouldApplyRecommendation === true &&
      resumeRecommendationPlanMissing.hasMissing === true &&
      resumeRecommendationPlanMissing.tone === "warn" &&
      resumeRecommendationPlanMissing.messageKo.includes("보유 없음") &&
      resumeRecommendationPlanNoChange.shouldApplyRecommendation === false &&
      resumeRecommendationPlanNoChange.messageKo === "권장 설정 변경 없음",
  });

  const autoPolicyBlockedState = createInitialSliceState(context, { playerName: "auto-blocked" });
  autoPolicyBlockedState.settings.autoTribulation = true;
  autoPolicyBlockedState.progression.difficultyIndex = 198;
  autoPolicyBlockedState.inventory.breakthroughElixir = 0;
  autoPolicyBlockedState.inventory.tribulationTalisman = 0;
  autoPolicyBlockedState.currencies.qi = Math.max(
    1,
    (context.stageByDifficulty.get(198)?.qi_required ?? 1) * 6,
  );
  const autoPolicyBlockedAttempt = runBreakthroughAttempt(
    context,
    autoPolicyBlockedState,
    createSeededRng(902),
    {
      respectAutoTribulation: true,
      enforceAutoRiskPolicy: true,
      useBreakthroughElixir: true,
      useTribulationTalisman: true,
      suppressLogs: true,
    },
  );
  checks.push({
    id: "auto_breakthrough_block_result_contains_guidance",
    passed:
      autoPolicyBlockedAttempt.attempted === false &&
      autoPolicyBlockedAttempt.outcome === "blocked_auto_risk_policy" &&
      typeof autoPolicyBlockedAttempt.autoPolicy?.reasonLabelKo === "string" &&
      autoPolicyBlockedAttempt.autoPolicy.reasonLabelKo.length > 0 &&
      typeof autoPolicyBlockedAttempt.autoPolicy?.nextActionKo === "string" &&
      autoPolicyBlockedAttempt.autoPolicy.nextActionKo.length > 0,
  });

  const recommendationNeedGuard = resolveBreakthroughRecommendation(
    {
      stage: { is_tribulation: 1 },
      successPct: 38,
      deathFailPct: 19,
    },
    {
      hasBreakthroughElixir: true,
      hasTribulationTalisman: true,
      usingBreakthroughElixir: false,
      usingTribulationTalisman: false,
      mitigatedPreview: {
        stage: { is_tribulation: 1 },
        successPct: 52,
        deathFailPct: 9,
      },
    },
  );
  const recommendationPrepared = resolveBreakthroughRecommendation(
    {
      stage: { is_tribulation: 1 },
      successPct: 52,
      deathFailPct: 9,
    },
    {
      hasBreakthroughElixir: true,
      hasTribulationTalisman: true,
      usingBreakthroughElixir: true,
      usingTribulationTalisman: true,
      mitigatedPreview: {
        stage: { is_tribulation: 1 },
        successPct: 52,
        deathFailPct: 9,
      },
    },
  );
  const recommendationSafe = resolveBreakthroughRecommendation({
    stage: { is_tribulation: 0 },
    successPct: 77,
    deathFailPct: 0,
  });
  checks.push({
    id: "breakthrough_recommendation_matches_context_and_inventory",
    passed:
      recommendationNeedGuard.labelKo === "수호부 권장" &&
      recommendationNeedGuard.tone === "warn" &&
      recommendationNeedGuard.messageKo.includes("수호부") &&
      recommendationPrepared.labelKo === "준비 완료" &&
      recommendationPrepared.tone === "info" &&
      recommendationSafe.labelKo === "자원 비축" &&
      recommendationSafe.tone === "info",
  });

  const mitigationLarge = resolveBreakthroughMitigationSummary(
    {
      stage: { is_tribulation: 1 },
      successPct: 40,
      deathFailPct: 18,
    },
    {
      stage: { is_tribulation: 1 },
      successPct: 55,
      deathFailPct: 8,
    },
  );
  const mitigationNone = resolveBreakthroughMitigationSummary(
    {
      stage: { is_tribulation: 1 },
      successPct: 55,
      deathFailPct: 8,
    },
    {
      stage: { is_tribulation: 1 },
      successPct: 55,
      deathFailPct: 8,
    },
  );
  const mitigationSafe = resolveBreakthroughMitigationSummary(
    {
      stage: { is_tribulation: 0 },
      successPct: 70,
      deathFailPct: 0,
    },
    {
      stage: { is_tribulation: 0 },
      successPct: 82,
      deathFailPct: 0,
    },
  );
  checks.push({
    id: "breakthrough_mitigation_summary_reports_delta_and_risk_shift",
    passed:
      mitigationLarge.labelKo === "개선 큼" &&
      mitigationLarge.tone === "info" &&
      mitigationLarge.riskImproved === true &&
      mitigationLarge.successDeltaPct > 0 &&
      mitigationLarge.deathFailDeltaPct > 0 &&
      mitigationNone.labelKo === "개선 없음" &&
      mitigationNone.tone === "warn" &&
      mitigationNone.riskImproved === false &&
      mitigationSafe.labelKo === "비도겁" &&
      mitigationSafe.tone === "info",
  });

  const toggleHighRisk = resolveBreakthroughRecommendationToggles(
    {
      stage: { is_tribulation: 1 },
      deathFailPct: 19,
    },
    {
      hasBreakthroughElixir: true,
      hasTribulationTalisman: true,
      currentUseBreakthroughElixir: false,
      currentUseTribulationTalisman: false,
    },
  );
  const toggleMediumRiskNoElixir = resolveBreakthroughRecommendationToggles(
    {
      stage: { is_tribulation: 1 },
      deathFailPct: 6,
    },
    {
      hasBreakthroughElixir: false,
      hasTribulationTalisman: true,
      currentUseBreakthroughElixir: false,
      currentUseTribulationTalisman: false,
    },
  );
  const toggleNonTribulation = resolveBreakthroughRecommendationToggles(
    {
      stage: { is_tribulation: 0 },
      deathFailPct: 0,
    },
    {
      hasBreakthroughElixir: true,
      hasTribulationTalisman: true,
      currentUseBreakthroughElixir: true,
      currentUseTribulationTalisman: true,
    },
  );
  checks.push({
    id: "breakthrough_recommendation_toggles_apply_expected_settings",
    passed:
      toggleHighRisk.changed === true &&
      toggleHighRisk.reason === "high_risk_enable_all" &&
      toggleHighRisk.nextUseBreakthroughElixir === true &&
      toggleHighRisk.nextUseTribulationTalisman === true &&
      toggleMediumRiskNoElixir.missingBreakthroughElixir === true &&
      toggleMediumRiskNoElixir.nextUseBreakthroughElixir === false &&
      toggleNonTribulation.changed === true &&
      toggleNonTribulation.reason === "disable_non_tribulation" &&
      toggleNonTribulation.nextUseBreakthroughElixir === false &&
      toggleNonTribulation.nextUseTribulationTalisman === false,
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

  const warmupBaseState = createInitialSliceState(context, { playerName: "warmup-base" });
  warmupBaseState.settings.autoBattle = false;
  warmupBaseState.settings.autoBreakthrough = true;
  warmupBaseState.settings.autoTribulation = false;
  warmupBaseState.progression.difficultyIndex = 1;
  warmupBaseState.currencies.qi = 500000;
  const warmupBaseSummary = runAutoSliceSeconds(
    context,
    warmupBaseState,
    createSeededRng(311),
    {
      seconds: 6,
      battleEverySec: 2,
      breakthroughEverySec: 1,
      passiveQiRatio: 0.012,
      suppressLogs: true,
    },
  );
  const warmupGuardState = createInitialSliceState(context, { playerName: "warmup-guard" });
  warmupGuardState.settings.autoBattle = false;
  warmupGuardState.settings.autoBreakthrough = true;
  warmupGuardState.settings.autoTribulation = false;
  warmupGuardState.progression.difficultyIndex = 1;
  warmupGuardState.currencies.qi = 500000;
  const warmupGuardSummary = runAutoSliceSeconds(
    context,
    warmupGuardState,
    createSeededRng(311),
    {
      seconds: 6,
      battleEverySec: 2,
      breakthroughEverySec: 1,
      passiveQiRatio: 0.012,
      autoBreakthroughWarmupUntilSec: 3,
      collectEvents: true,
      maxCollectedEvents: 10,
      suppressLogs: true,
    },
  );
  checks.push({
    id: "auto_breakthrough_resume_warmup_guard_skips_until_threshold",
    passed:
      warmupBaseSummary.breakthroughs === 6 &&
      warmupGuardSummary.breakthroughs === 3 &&
      warmupGuardSummary.autoBreakthroughWarmupSkips === 3 &&
      warmupGuardSummary.autoBreakthroughWarmupRemainingSec === 0 &&
      warmupGuardSummary.collectedEvents.some(
        (event) =>
          event.kind === "auto_breakthrough_warmup_skip" &&
          event.warmupUntilSec === 3,
      ),
  });

  const warmupChunkState = createInitialSliceState(context, { playerName: "warmup-chunk" });
  warmupChunkState.settings.autoBattle = false;
  warmupChunkState.settings.autoBreakthrough = true;
  warmupChunkState.settings.autoTribulation = false;
  warmupChunkState.progression.difficultyIndex = 1;
  warmupChunkState.currencies.qi = 500000;
  const warmupChunkA = runAutoSliceSeconds(context, warmupChunkState, createSeededRng(13), {
    seconds: 1,
    battleEverySec: 2,
    breakthroughEverySec: 1,
    passiveQiRatio: 0.012,
    timelineOffsetSec: 0,
    autoBreakthroughWarmupUntilSec: 3,
    suppressLogs: true,
  });
  const warmupChunkB = runAutoSliceSeconds(context, warmupChunkState, createSeededRng(13), {
    seconds: 1,
    battleEverySec: 2,
    breakthroughEverySec: 1,
    passiveQiRatio: 0.012,
    timelineOffsetSec: 1,
    autoBreakthroughWarmupUntilSec: 3,
    suppressLogs: true,
  });
  const warmupChunkC = runAutoSliceSeconds(context, warmupChunkState, createSeededRng(13), {
    seconds: 1,
    battleEverySec: 2,
    breakthroughEverySec: 1,
    passiveQiRatio: 0.012,
    timelineOffsetSec: 2,
    autoBreakthroughWarmupUntilSec: 3,
    suppressLogs: true,
  });
  const warmupChunkD = runAutoSliceSeconds(context, warmupChunkState, createSeededRng(13), {
    seconds: 1,
    battleEverySec: 2,
    breakthroughEverySec: 1,
    passiveQiRatio: 0.012,
    timelineOffsetSec: 3,
    autoBreakthroughWarmupUntilSec: 3,
    suppressLogs: true,
  });
  checks.push({
    id: "auto_breakthrough_warmup_guard_tracks_timeline_offset",
    passed:
      warmupChunkA.autoBreakthroughWarmupSkips === 1 &&
      warmupChunkA.autoBreakthroughWarmupRemainingSec === 2 &&
      warmupChunkB.autoBreakthroughWarmupSkips === 1 &&
      warmupChunkB.autoBreakthroughWarmupRemainingSec === 1 &&
      warmupChunkC.autoBreakthroughWarmupSkips === 1 &&
      warmupChunkC.autoBreakthroughWarmupRemainingSec === 0 &&
      warmupChunkD.autoBreakthroughWarmupSkips === 0,
  });

  const autoRiskState = createInitialSliceState(context, { playerName: "auto-risk" });
  autoRiskState.settings.autoBattle = false;
  autoRiskState.settings.autoBreakthrough = true;
  autoRiskState.settings.autoTribulation = true;
  autoRiskState.progression.difficultyIndex = 198;
  autoRiskState.inventory.breakthroughElixir = 0;
  autoRiskState.inventory.tribulationTalisman = 0;
  autoRiskState.currencies.qi = Math.max(
    1,
    (context.stageByDifficulty.get(198)?.qi_required ?? 1) * 6,
  );
  const autoRiskSummary = runAutoSliceSeconds(
    context,
    autoRiskState,
    createSeededRng(77),
    {
      seconds: 4,
      battleEverySec: 2,
      breakthroughEverySec: 1,
      passiveQiRatio: 0.012,
      collectEvents: true,
      maxCollectedEvents: 10,
      suppressLogs: true,
    },
  );
  checks.push({
    id: "auto_breakthrough_blocks_high_risk_tribulation_attempts",
    passed:
      autoRiskSummary.seconds === 4 &&
      autoRiskSummary.breakthroughs === 0 &&
      autoRiskSummary.breakthroughPolicyBlocks > 0 &&
      autoRiskSummary.breakthroughPolicyBlocks ===
        ((autoRiskSummary.breakthroughPolicyBlockReasons?.extremeRisk || 0) +
          (autoRiskSummary.breakthroughPolicyBlockReasons?.highRisk || 0) +
          (autoRiskSummary.breakthroughPolicyBlockReasons?.highQiCost || 0)) &&
      autoRiskSummary.collectedEvents.some(
        (event) =>
          event.kind === "breakthrough_blocked_auto_policy" &&
          typeof event.reasonLabelKo === "string" &&
          event.reasonLabelKo.length > 0 &&
          typeof event.nextActionKo === "string",
      ),
  });

  const autoPauseState = createInitialSliceState(context, { playerName: "auto-pause" });
  autoPauseState.settings.autoBattle = false;
  autoPauseState.settings.autoBreakthrough = true;
  autoPauseState.settings.autoTribulation = true;
  autoPauseState.progression.difficultyIndex = 198;
  autoPauseState.inventory.breakthroughElixir = 0;
  autoPauseState.inventory.tribulationTalisman = 0;
  autoPauseState.currencies.qi = Math.max(
    1,
    (context.stageByDifficulty.get(198)?.qi_required ?? 1) * 8,
  );
  const autoPauseSummary = runAutoSliceSeconds(
    context,
    autoPauseState,
    createSeededRng(79),
    {
      seconds: 6,
      battleEverySec: 2,
      breakthroughEverySec: 1,
      passiveQiRatio: 0.012,
      collectEvents: true,
      maxCollectedEvents: 20,
      autoBreakthroughPausePolicyBlockThreshold: 2,
      suppressLogs: true,
    },
  );
  checks.push({
    id: "auto_breakthrough_pauses_after_consecutive_policy_blocks",
    passed:
      autoPauseSummary.autoBreakthroughPaused === true &&
      autoPauseSummary.autoBreakthroughPauseReason.length > 0 &&
      autoPauseSummary.autoBreakthroughPauseReasonLabelKo.length > 0 &&
      autoPauseSummary.autoBreakthroughPauseAtSec > 0 &&
      autoPauseSummary.breakthroughPolicyBlocks >= 2 &&
      autoPauseState.settings.autoBreakthrough === false &&
      autoPauseSummary.collectedEvents.some(
        (event) => event.kind === "auto_breakthrough_paused_by_policy",
      ),
  });

  state.settings.autoBattle = true;
  state.settings.autoBreakthrough = true;
  state.settings.autoTribulation = true;
  state.settings.autoResumeRealtime = true;
  state.settings.autoBreakthroughResumeWarmupSec = 9;
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

  const offlineWarmupState = createInitialSliceState(context, {
    playerName: "offline-warmup",
  });
  offlineWarmupState.settings.autoBattle = false;
  offlineWarmupState.settings.autoBreakthrough = true;
  offlineWarmupState.settings.autoTribulation = false;
  offlineWarmupState.progression.difficultyIndex = 1;
  offlineWarmupState.currencies.qi = 500000;
  offlineWarmupState.lastActiveEpochMs = 2000000000000;
  const offlineWarmup = runOfflineCatchup(
    context,
    offlineWarmupState,
    createSeededRng(301),
    {
      nowEpochMs: offlineWarmupState.lastActiveEpochMs + 5 * 1000,
      maxOfflineHours: 12,
      maxCollectedEvents: 20,
      battleEverySec: 2,
      breakthroughEverySec: 1,
      passiveQiRatio: 0.012,
      autoBreakthroughWarmupUntilSec: 3,
      syncAnchorToNow: true,
    },
  );
  const offlineWarmupRemainState = createInitialSliceState(context, {
    playerName: "offline-warmup-remain",
  });
  offlineWarmupRemainState.settings.autoBattle = false;
  offlineWarmupRemainState.settings.autoBreakthrough = true;
  offlineWarmupRemainState.settings.autoTribulation = false;
  offlineWarmupRemainState.progression.difficultyIndex = 1;
  offlineWarmupRemainState.currencies.qi = 500000;
  offlineWarmupRemainState.lastActiveEpochMs = 2000000005000;
  const offlineWarmupRemain = runOfflineCatchup(
    context,
    offlineWarmupRemainState,
    createSeededRng(302),
    {
      nowEpochMs: offlineWarmupRemainState.lastActiveEpochMs + 2 * 1000,
      maxOfflineHours: 12,
      maxCollectedEvents: 20,
      battleEverySec: 2,
      breakthroughEverySec: 1,
      passiveQiRatio: 0.012,
      autoBreakthroughWarmupUntilSec: 3,
      syncAnchorToNow: true,
    },
  );
  checks.push({
    id: "offline_catchup_respects_auto_breakthrough_warmup_guard",
    passed:
      offlineWarmup.summary.autoSummary !== null &&
      offlineWarmup.summary.autoBreakthroughWarmupRemainingSecBefore === 3 &&
      offlineWarmup.summary.autoBreakthroughWarmupRemainingSecAfter === 0 &&
      offlineWarmup.summary.autoSummary.seconds === 5 &&
      offlineWarmup.summary.autoSummary.breakthroughs === 2 &&
      offlineWarmup.summary.autoSummary.autoBreakthroughWarmupSkips === 3 &&
      offlineWarmup.summary.autoSummary.autoBreakthroughWarmupRemainingSec === 0 &&
      offlineWarmup.summary.autoSummary.collectedEvents.some(
        (event) => event.kind === "auto_breakthrough_warmup_skip",
      ) &&
      offlineWarmup.summary.autoSummary.collectedEvents.some(
        (event) =>
          event.kind === "offline_warmup_summary" &&
          event.beforeSec === 3 &&
          event.afterSec === 0 &&
          event.exhausted === true &&
          String(event.labelKo || "").includes("워밍업 3초"),
      ) &&
      offlineWarmupRemain.summary.autoSummary !== null &&
      offlineWarmupRemain.summary.autoBreakthroughWarmupRemainingSecBefore === 3 &&
      offlineWarmupRemain.summary.autoBreakthroughWarmupRemainingSecAfter === 1 &&
      offlineWarmupRemain.summary.autoSummary.seconds === 2 &&
      offlineWarmupRemain.summary.autoSummary.autoBreakthroughWarmupSkips === 2 &&
      offlineWarmupRemain.summary.autoSummary.autoBreakthroughWarmupRemainingSec === 1 &&
      offlineWarmupRemain.summary.autoSummary.collectedEvents.some(
        (event) =>
          event.kind === "offline_warmup_summary" &&
          event.beforeSec === 3 &&
          event.afterSec === 1 &&
          event.exhausted === false,
      ),
  });

  const offlineWarmupNoElapsedState = createInitialSliceState(context, {
    playerName: "offline-warmup-no-elapsed",
  });
  offlineWarmupNoElapsedState.lastActiveEpochMs = 2000000020000;
  const offlineWarmupNoElapsed = runOfflineCatchup(
    context,
    offlineWarmupNoElapsedState,
    createSeededRng(303),
    {
      nowEpochMs: offlineWarmupNoElapsedState.lastActiveEpochMs,
      maxOfflineHours: 12,
      maxCollectedEvents: 20,
      autoBreakthroughWarmupUntilSec: 4,
      syncAnchorToNow: true,
    },
  );
  checks.push({
    id: "offline_catchup_keeps_warmup_when_no_time_elapsed",
    passed:
      offlineWarmupNoElapsed.summary.skipReason === "time_not_elapsed" &&
      offlineWarmupNoElapsed.summary.autoSummary === null &&
      offlineWarmupNoElapsed.summary.autoBreakthroughWarmupRemainingSecBefore === 4 &&
      offlineWarmupNoElapsed.summary.autoBreakthroughWarmupRemainingSecAfter === 4,
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
      offline.summary.autoBreakthroughWarmupRemainingSecBefore === 0 &&
      offline.summary.autoBreakthroughWarmupRemainingSecAfter === 0 &&
      offline.summary.autoSummary !== null &&
      offline.summary.autoSummary.seconds === 64800 &&
      Array.isArray(offline.summary.autoSummary.collectedEvents) &&
      offline.summary.autoSummary.collectedEvents.length > 0 &&
      offline.summary.autoSummary.collectedEvents.length <= 40 &&
      offline.summary.autoSummary.collectedEvents.every(
        (event) => event.kind !== "offline_warmup_summary",
      ) &&
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
      noElapsed.summary.autoSummary === null &&
      noElapsed.summary.autoBreakthroughWarmupRemainingSecBefore === 0 &&
      noElapsed.summary.autoBreakthroughWarmupRemainingSecAfter === 0,
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
      restored.settings.autoBreakthroughResumeWarmupSec ===
        state.settings.autoBreakthroughResumeWarmupSec &&
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
