const MAX_LOG_ENTRIES = 120;
export const MOBILE_MVP_STORAGE_KEY = "idle_xianxia_mobile_mvp_v1_save";
export const MOBILE_MVP_STORAGE_KEY_PREFIX = "idle_xianxia_mobile_mvp_v1_save_slot_";
export const MOBILE_MVP_SLOT_PREFS_KEY = "idle_xianxia_mobile_mvp_v1_slot_pref";
export const MOBILE_MVP_SLOT_LOCKS_KEY = "idle_xianxia_mobile_mvp_v1_slot_locks";
const DEFAULT_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC = 6;
const MIN_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC = 0;
const MAX_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC = 30;
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

export function normalizeAutoBreakthroughResumeWarmupSec(value, fallback) {
  const normalizedFallback = clamp(
    toNonNegativeInt(
      fallback,
      DEFAULT_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC,
    ),
    MIN_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC,
    MAX_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC,
  );
  return clamp(
    toNonNegativeInt(value, normalizedFallback),
    MIN_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC,
    MAX_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC,
  );
}

export function resolveAutoBreakthroughWarmupRemainingSec(
  currentRemainingSecInput,
  elapsedSecInput,
) {
  const currentRemainingSec = Math.max(
    0,
    toNonNegativeInt(currentRemainingSecInput, 0),
  );
  const elapsedSec = Math.max(0, toNonNegativeInt(elapsedSecInput, 0));
  return Math.max(0, currentRemainingSec - elapsedSec);
}

export function resolveOfflineWarmupTelemetry(offlineSummaryInput) {
  const summary =
    offlineSummaryInput && typeof offlineSummaryInput === "object"
      ? offlineSummaryInput
      : {};
  const before = Math.max(
    0,
    toNonNegativeInt(summary.autoBreakthroughWarmupRemainingSecBefore, 0),
  );
  const appliedOfflineSec = Math.max(0, toNonNegativeInt(summary.appliedOfflineSec, 0));
  const afterFallback = resolveAutoBreakthroughWarmupRemainingSec(before, appliedOfflineSec);
  const after = Math.max(
    0,
    toNonNegativeInt(summary.autoBreakthroughWarmupRemainingSecAfter, afterFallback),
  );
  const autoSummary =
    summary.autoSummary && typeof summary.autoSummary === "object"
      ? summary.autoSummary
      : {};
  const skippedAttempts = Math.max(
    0,
    toNonNegativeInt(autoSummary.autoBreakthroughWarmupSkips, 0),
  );
  const consumed = Math.max(0, before - after);
  return {
    before,
    after,
    consumed,
    skippedAttempts,
    hadWarmup: before > 0,
    exhausted: before > 0 && after === 0,
  };
}

export function buildOfflineWarmupTelemetryLabelKo(offlineSummaryInput) {
  const telemetry = resolveOfflineWarmupTelemetry(offlineSummaryInput);
  if (!telemetry.hadWarmup) {
    return "워밍업 없음";
  }
  const exhaustedText = telemetry.exhausted ? " · 소진" : "";
  return `워밍업 ${telemetry.before}초 → ${telemetry.after}초 (차단 ${telemetry.skippedAttempts}회${exhaustedText})`;
}

const CRITICAL_OFFLINE_DETAIL_KINDS = new Set([
  "offline_warmup_summary",
  "auto_breakthrough_paused_by_policy",
  "breakthrough_death_fail",
]);

export function isCriticalOfflineDetailEventKind(kindInput) {
  if (typeof kindInput !== "string") {
    return false;
  }
  return CRITICAL_OFFLINE_DETAIL_KINDS.has(kindInput);
}

export function prioritizeOfflineDetailEvents(eventsInput) {
  const rows = Array.isArray(eventsInput) ? eventsInput.slice() : [];
  const buckets = [[], [], [], []];
  for (const row of rows) {
    const kind = row && typeof row.kind === "string" ? row.kind : "";
    let priority = 3;
    if (kind === "offline_warmup_summary") {
      priority = 0;
    } else if (kind === "auto_breakthrough_paused_by_policy") {
      priority = 1;
    } else if (kind === "breakthrough_death_fail") {
      priority = 2;
    }
    buckets[priority].push(row);
  }
  return buckets[0].concat(buckets[1], buckets[2], buckets[3]);
}

export function filterOfflineDetailEventsByMode(eventsInput, modeInput = "all") {
  const rows = Array.isArray(eventsInput) ? eventsInput.slice() : [];
  const mode = modeInput === "critical" ? "critical" : "all";
  if (mode !== "critical") {
    return rows;
  }
  return rows.filter((row) =>
    isCriticalOfflineDetailEventKind(
      row && typeof row.kind === "string" ? row.kind : "",
    ),
  );
}

export function summarizeOfflineDetailFilterResult(eventsInput, modeInput = "all") {
  const rows = Array.isArray(eventsInput) ? eventsInput.slice() : [];
  const mode = modeInput === "critical" ? "critical" : "all";
  const visibleRows = filterOfflineDetailEventsByMode(rows, mode);
  const total = rows.length;
  const visible = visibleRows.length;
  return {
    mode,
    total,
    visible,
    hidden: Math.max(0, total - visible),
    hasHidden: total > visible,
  };
}

export function buildOfflineDetailFilterSummaryLabelKo(eventsInput, modeInput = "all") {
  const summary = summarizeOfflineDetailFilterResult(eventsInput, modeInput);
  if (summary.mode === "critical") {
    return `세부 로그 ${summary.visible}/${summary.total}건 (핵심)`;
  }
  return `세부 로그 ${summary.visible}건 (전체)`;
}

export function buildOfflineDetailHiddenSummaryLabelKo(eventsInput, modeInput = "all") {
  const summary = summarizeOfflineDetailFilterResult(eventsInput, modeInput);
  if (summary.hidden <= 0) {
    return "숨김 이벤트 없음";
  }
  if (summary.mode === "critical") {
    return `비핵심 ${summary.hidden}건 숨김`;
  }
  return `숨김 이벤트 ${summary.hidden}건`;
}

function resolveOfflineDetailKindLabelKo(kindInput) {
  if (kindInput === "battle_win") return "전투 승리";
  if (kindInput === "battle_loss") return "전투 패배";
  if (kindInput === "breakthrough_success") return "돌파 성공";
  if (kindInput === "breakthrough_minor_fail") return "돌파 경상 실패";
  if (kindInput === "breakthrough_retreat_fail") return "돌파 후퇴 실패";
  if (kindInput === "breakthrough_blocked_auto_policy") return "자동 돌파 차단";
  if (kindInput === "offline_warmup_summary") return "워밍업 요약";
  if (kindInput === "auto_breakthrough_paused_by_policy") return "자동 돌파 일시정지";
  if (kindInput === "breakthrough_death_fail") return "도겁 사망";
  return "기타";
}

export function summarizeOfflineDetailHiddenKinds(eventsInput, modeInput = "all") {
  const rows = Array.isArray(eventsInput) ? eventsInput.slice() : [];
  const mode = modeInput === "critical" ? "critical" : "all";
  const hiddenRows =
    mode === "critical"
      ? rows.filter(
          (row) =>
            !isCriticalOfflineDetailEventKind(
              row && typeof row.kind === "string" ? row.kind : "",
            ),
        )
      : [];
  const countsByKind = new Map();
  hiddenRows.forEach((row, index) => {
    const kind = row && typeof row.kind === "string" ? row.kind : "unknown";
    const prev = countsByKind.get(kind);
    if (prev) {
      prev.count += 1;
      return;
    }
    countsByKind.set(kind, {
      kind,
      labelKo: resolveOfflineDetailKindLabelKo(kind),
      count: 1,
      firstIndex: index,
    });
  });
  const items = Array.from(countsByKind.values()).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.firstIndex - b.firstIndex;
  });
  return {
    mode,
    hidden: hiddenRows.length,
    items: items.map((item) => ({
      kind: item.kind,
      labelKo: item.labelKo,
      count: item.count,
    })),
  };
}

export function buildOfflineDetailHiddenKindsSummaryLabelKo(
  eventsInput,
  modeInput = "all",
  maxKindsInput = 3,
) {
  const summary = summarizeOfflineDetailHiddenKinds(eventsInput, modeInput);
  if (summary.hidden <= 0) {
    return "숨김 상세 없음";
  }
  const maxKinds = clamp(toNonNegativeInt(maxKindsInput, 3), 1, 5);
  const topItems = summary.items.slice(0, maxKinds);
  const shownCount = topItems.reduce((acc, item) => acc + item.count, 0);
  const parts = topItems.map((item) => `${item.labelKo} ${item.count}건`);
  const remaining = Math.max(0, summary.hidden - shownCount);
  const remainingText = remaining > 0 ? ` · 외 ${remaining}건` : "";
  return `숨김 상세 ${parts.join(" · ")}${remainingText}`;
}

function buildOfflineDetailSignatureChecksum(signatureInput) {
  const signature = typeof signatureInput === "string" ? signatureInput : "";
  let value = 0;
  for (let i = 0; i < signature.length; i += 1) {
    value = (value * 131 + signature.charCodeAt(i)) % 1000000;
  }
  return String(value).padStart(6, "0");
}

const OFFLINE_DETAIL_COMPARE_CODE_EXACT_PATTERN =
  /^ODR1-T\d+-C\d+-H\d+-V[AC]-A\d{6}-S\d{6}$/;
const OFFLINE_DETAIL_COMPARE_CODE_SEARCH_PATTERN =
  /ODR1-T\d+-C\d+-H\d+-V[AC]-A\d{6}-S\d{6}/;

export function buildOfflineDetailKindDigest(eventsInput, maxKindsInput = 8) {
  const rows = Array.isArray(eventsInput) ? eventsInput.slice() : [];
  const maxKinds = clamp(toNonNegativeInt(maxKindsInput, 8), 1, 20);
  const countsByKind = new Map();
  rows.forEach((row, index) => {
    const kind = row && typeof row.kind === "string" ? row.kind : "unknown";
    const prev = countsByKind.get(kind);
    if (prev) {
      prev.count += 1;
      return;
    }
    countsByKind.set(kind, {
      kind,
      count: 1,
      firstIndex: index,
    });
  });
  const items = Array.from(countsByKind.values()).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.firstIndex - b.firstIndex;
  });
  const signature = items.map((item) => `${item.kind}:${item.count}`).join("|");
  return {
    totalEvents: rows.length,
    uniqueKinds: items.length,
    signature,
    checksum: buildOfflineDetailSignatureChecksum(signature),
    topKinds: items.slice(0, maxKinds).map((item) => ({
      kind: item.kind,
      count: item.count,
    })),
  };
}

export function buildOfflineDetailCompareCode(eventsInput, viewModeInput = "all") {
  const rows = Array.isArray(eventsInput) ? eventsInput.slice() : [];
  const viewMode = viewModeInput === "critical" ? "critical" : "all";
  const allSummary = summarizeOfflineDetailFilterResult(rows, "all");
  const criticalSummary = summarizeOfflineDetailFilterResult(rows, "critical");
  const viewRows = filterOfflineDetailEventsByMode(rows, viewMode);
  const allDigest = buildOfflineDetailKindDigest(rows, 20);
  const viewDigest = buildOfflineDetailKindDigest(viewRows, 20);
  const viewCode = viewMode === "critical" ? "C" : "A";
  return `ODR1-T${allSummary.total}-C${criticalSummary.visible}-H${criticalSummary.hidden}-V${viewCode}-A${allDigest.checksum}-S${viewDigest.checksum}`;
}

export function isOfflineDetailCompareCode(codeInput) {
  if (typeof codeInput !== "string") {
    return false;
  }
  return OFFLINE_DETAIL_COMPARE_CODE_EXACT_PATTERN.test(codeInput);
}

export function extractOfflineDetailCompareCode(textInput) {
  const text = typeof textInput === "string" ? textInput.trim() : "";
  const matched = OFFLINE_DETAIL_COMPARE_CODE_SEARCH_PATTERN.exec(text);
  return matched ? matched[0] : "";
}

export function buildOfflineDetailCompareCodeSourceLabelKo(sourceInput) {
  const source = typeof sourceInput === "string" ? sourceInput.trim() : "";
  if (source === "detail_view_snapshot") {
    return "출처: savePayload.detailViewSnapshotAtExport";
  }
  if (source === "detail_report_snapshot") {
    return "출처: savePayload.detailReportSnapshot";
  }
  if (source === "text" || source === "payload") {
    return "출처: savePayload 텍스트";
  }
  if (source === "clipboard") {
    return "출처: 클립보드 텍스트";
  }
  if (source === "input") {
    return "출처: 비교 코드 입력값";
  }
  return "출처: 없음";
}

export function buildOfflineDetailCompareCodeSourceTone(sourceInput) {
  const source = typeof sourceInput === "string" ? sourceInput.trim() : "";
  if (source === "detail_view_snapshot" || source === "detail_report_snapshot") {
    return "info";
  }
  if (
    source === "text" ||
    source === "payload" ||
    source === "clipboard" ||
    source === "input"
  ) {
    return "warn";
  }
  if (source === "none") {
    return "info";
  }
  return "error";
}

export function buildOfflineDetailCompareStatusLabelKo(
  sourceInput,
  messageInput,
) {
  const sourceLabel = buildOfflineDetailCompareCodeSourceLabelKo(sourceInput);
  const message = typeof messageInput === "string" ? messageInput.trim() : "";
  if (!message) {
    return `[${sourceLabel}] 상태 없음`;
  }
  return `[${sourceLabel}] ${message}`;
}

export function resolveOfflineDetailCompareClipboardFailureInfo(reasonInput) {
  const reason = typeof reasonInput === "string" ? reasonInput.trim() : "";
  if (reason === "unsupported") {
    return {
      source: "clipboard",
      messageKo: "클립보드 읽기 미지원 환경",
    };
  }
  if (reason === "read_failed") {
    return {
      source: "clipboard",
      messageKo: "클립보드 읽기 실패",
    };
  }
  return {
    source: "clipboard",
    messageKo: "클립보드에서 비교 코드 인식 실패",
  };
}

export function resolveOfflineDetailComparePayloadFailureInfo(reasonInput) {
  const reason = typeof reasonInput === "string" ? reasonInput.trim() : "";
  if (reason === "missing_payload") {
    return {
      source: "none",
      messageKo: "savePayload 입력 필요",
    };
  }
  return {
    source: "payload",
    messageKo: "savePayload에서 비교 코드 인식 실패",
  };
}

export function resolveOfflineDetailComparePayloadLoadSource(sourceInput) {
  const source = typeof sourceInput === "string" ? sourceInput.trim() : "";
  if (source === "detail_view_snapshot" || source === "detail_report_snapshot") {
    return source;
  }
  if (source === "text") {
    return "text";
  }
  return "payload";
}

export function resolveOfflineDetailCompareInputSource(codeInput) {
  const text = typeof codeInput === "string" ? codeInput.trim() : "";
  return text ? "input" : "none";
}

export function resolveOfflineDetailCompareTargetInputState(codeInput) {
  const text = typeof codeInput === "string" ? codeInput.trim() : "";
  if (!text) {
    return "empty";
  }
  return extractOfflineDetailCompareCode(text) ? "valid" : "invalid";
}

export function resolveOfflineDetailCompareTargetInputStateStatusMessageKo(
  stateInput,
) {
  const state = typeof stateInput === "string" ? stateInput.trim() : "";
  if (state === "empty") {
    return "비교 코드 입력 필요";
  }
  return "비교 코드 형식 오류";
}

export function resolveOfflineDetailCompareCheckSource(
  requestedSourceInput,
  currentSourceInput,
  codeInput,
) {
  const requested =
    typeof requestedSourceInput === "string" ? requestedSourceInput.trim() : "";
  const current = typeof currentSourceInput === "string" ? currentSourceInput.trim() : "";
  if (requested === "input") {
    return resolveOfflineDetailCompareInputSource(codeInput);
  }
  if (requested === "keep") {
    if (current && current !== "none") {
      return current;
    }
    return resolveOfflineDetailCompareInputSource(codeInput);
  }
  if (!requested) {
    return "none";
  }
  return requested;
}

export function extractOfflineDetailCompareCodeFromPayloadTextWithSource(payloadInput) {
  const text = typeof payloadInput === "string" ? payloadInput.trim() : "";
  if (!text) {
    return {
      code: "",
      source: "none",
    };
  }
  try {
    const parsed = JSON.parse(text);
    const fromDetailView = extractOfflineDetailCompareCode(
      parsed?.detailViewSnapshotAtExport?.compareCode,
    );
    if (fromDetailView) {
      return {
        code: fromDetailView,
        source: "detail_view_snapshot",
      };
    }
    const fromDetailReport = extractOfflineDetailCompareCode(
      parsed?.detailReportSnapshot?.compareCode,
    );
    if (fromDetailReport) {
      return {
        code: fromDetailReport,
        source: "detail_report_snapshot",
      };
    }
  } catch {
    // Ignore JSON parse failures and fall back to first detected token.
  }
  const fallbackCode = extractOfflineDetailCompareCode(text);
  if (fallbackCode) {
    return {
      code: fallbackCode,
      source: "text",
    };
  }
  return {
    code: "",
    source: "none",
  };
}

export function extractOfflineDetailCompareCodeFromPayloadText(payloadInput) {
  return extractOfflineDetailCompareCodeFromPayloadTextWithSource(payloadInput).code;
}

function buildOfflineDetailCompareCodeSummaryLabelKo(codeInput, labelPrefixInput) {
  const labelPrefix = typeof labelPrefixInput === "string" ? labelPrefixInput.trim() : "";
  const normalizedPrefix = labelPrefix || "대상 코드";
  const text = typeof codeInput === "string" ? codeInput.trim() : "";
  if (!text) {
    return `${normalizedPrefix}: 없음`;
  }
  const extracted = extractOfflineDetailCompareCode(text);
  if (!extracted) {
    return `${normalizedPrefix} 형식 오류`;
  }
  const parsed = parseOfflineDetailCompareCode(extracted);
  if (!parsed) {
    return `${normalizedPrefix} 형식 오류`;
  }
  const viewLabelKo = parsed.viewMode === "critical" ? "핵심" : "전체";
  return `${normalizedPrefix}: 총 ${parsed.totalEvents} · 핵심표시 ${parsed.criticalVisibleEvents} · 숨김 ${parsed.hiddenCriticalEvents} · 보기 ${viewLabelKo}`;
}

export function buildOfflineDetailCompareCodeTargetSummaryLabelKo(codeInput) {
  return buildOfflineDetailCompareCodeSummaryLabelKo(codeInput, "대상 코드");
}

export function buildOfflineDetailCompareCodeTargetSummaryTone(codeInput) {
  const text = typeof codeInput === "string" ? codeInput.trim() : "";
  if (!text) {
    return "info";
  }
  return parseOfflineDetailCompareCode(text) ? "info" : "warn";
}

export function buildOfflineDetailCompareCodeCurrentSummaryLabelKo(codeInput) {
  return buildOfflineDetailCompareCodeSummaryLabelKo(codeInput, "현재 코드");
}

export function buildOfflineDetailCompareCodeCurrentSummaryTone(codeInput) {
  const text = typeof codeInput === "string" ? codeInput.trim() : "";
  if (!text) {
    return "info";
  }
  return parseOfflineDetailCompareCode(text) ? "info" : "warn";
}

export function parseOfflineDetailCompareCode(codeInput) {
  const raw = extractOfflineDetailCompareCode(codeInput);
  const matched = /^ODR1-T(\d+)-C(\d+)-H(\d+)-V([AC])-A(\d{6})-S(\d{6})$/.exec(raw);
  if (!matched) {
    return null;
  }
  const viewMode = matched[4] === "C" ? "critical" : "all";
  return {
    raw,
    version: "ODR1",
    totalEvents: toNonNegativeInt(matched[1], 0),
    criticalVisibleEvents: toNonNegativeInt(matched[2], 0),
    hiddenCriticalEvents: toNonNegativeInt(matched[3], 0),
    viewMode,
    allChecksum: matched[5],
    viewChecksum: matched[6],
  };
}

export function resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCodeInput) {
  const current = parseOfflineDetailCompareCode(currentCodeInput);
  const target = parseOfflineDetailCompareCode(targetCodeInput);
  if (!current || !target) {
    return {
      comparable: false,
      reason: !current ? "current_invalid" : "target_invalid",
      current,
      target,
    };
  }
  return {
    comparable: true,
    reason: "ok",
    current,
    target,
    identical: current.raw === target.raw,
    sameTotalEvents: current.totalEvents === target.totalEvents,
    sameCriticalVisibleEvents:
      current.criticalVisibleEvents === target.criticalVisibleEvents,
    sameHiddenCriticalEvents:
      current.hiddenCriticalEvents === target.hiddenCriticalEvents,
    sameViewMode: current.viewMode === target.viewMode,
    sameAllChecksum: current.allChecksum === target.allChecksum,
    sameViewChecksum: current.viewChecksum === target.viewChecksum,
  };
}

export function buildOfflineDetailCompareResultLabelKo(
  currentCodeInput,
  targetCodeInput,
) {
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCodeInput);
  if (!diff.comparable) {
    return diff.reason === "current_invalid"
      ? buildOfflineDetailCompareMissingCurrentLabelKo()
      : buildOfflineDetailCompareInvalidTargetLabelKo();
  }
  if (diff.identical) {
    return buildOfflineDetailCompareResultIdenticalLabelKo();
  }
  if (
    diff.sameTotalEvents &&
    diff.sameCriticalVisibleEvents &&
    diff.sameHiddenCriticalEvents &&
    diff.sameAllChecksum &&
    !diff.sameViewChecksum
  ) {
    return buildOfflineDetailCompareResultViewMismatchLabelKo();
  }
  if (
    diff.sameTotalEvents &&
    diff.sameCriticalVisibleEvents &&
    diff.sameHiddenCriticalEvents &&
    !diff.sameAllChecksum
  ) {
    return buildOfflineDetailCompareResultAggregateMismatchLabelKo();
  }
  const parts = [];
  if (!diff.sameTotalEvents) {
    parts.push(`총 ${diff.current.totalEvents}→${diff.target.totalEvents}`);
  }
  if (!diff.sameCriticalVisibleEvents) {
    parts.push(
      `핵심 ${diff.current.criticalVisibleEvents}→${diff.target.criticalVisibleEvents}`,
    );
  }
  if (!diff.sameHiddenCriticalEvents) {
    parts.push(
      `숨김 ${diff.current.hiddenCriticalEvents}→${diff.target.hiddenCriticalEvents}`,
    );
  }
  if (!diff.sameViewMode) {
    const currentMode = diff.current.viewMode === "critical" ? "핵심" : "전체";
    const targetMode = diff.target.viewMode === "critical" ? "핵심" : "전체";
    parts.push(`view ${currentMode}→${targetMode}`);
  }
  return parts.length > 0
    ? `비교 결과: ${parts.join(", ")}`
    : buildOfflineDetailCompareResultCodeDifferenceLabelKo();
}

export function buildOfflineDetailCompareInvalidTargetLabelKo() {
  return "입력 비교 코드 형식 오류";
}

export function buildOfflineDetailCompareResultIdenticalLabelKo() {
  return "비교 결과: 완전 일치";
}

export function buildOfflineDetailCompareResultViewMismatchLabelKo() {
  return "비교 결과: 전체 분포 동일, view 분포 차이";
}

export function buildOfflineDetailCompareResultAggregateMismatchLabelKo() {
  return "비교 결과: 집계 동일, 구성 분포 차이";
}

export function buildOfflineDetailCompareResultCodeDifferenceLabelKo() {
  return "비교 결과: 코드 차이 감지";
}

export function buildOfflineDetailCompareMissingCurrentLabelKo() {
  return "현재 비교 코드가 없어 대조 불가";
}

export function buildOfflineDetailCompareResultPendingLabelKo() {
  return "비교 대기 중";
}

export function buildOfflineDetailCompareResultInputRequiredLabelKo() {
  return "비교 코드를 입력하세요";
}

export function isOfflineDetailCompareResultError(
  currentCodeInput,
  targetCodeInput,
) {
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCodeInput);
  return !diff.comparable;
}

export function buildOfflineDetailCompareResultStateLabelKo(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return buildOfflineDetailCompareResultPendingLabelKo();
  }
  const targetCode = extractOfflineDetailCompareCode(targetText);
  if (!targetCode) {
    return buildOfflineDetailCompareResultInputRequiredLabelKo();
  }
  return buildOfflineDetailCompareResultLabelKo(currentCodeInput, targetCode);
}

export function buildOfflineDetailCompareResultStateTone(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return "info";
  }
  const targetCode = extractOfflineDetailCompareCode(targetText);
  if (!targetCode) {
    return "warn";
  }
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCode);
  if (!diff.comparable) {
    return diff.reason === "current_invalid" ? "error" : "warn";
  }
  if (diff.identical) {
    return "info";
  }
  if (
    !diff.sameViewMode &&
    diff.sameTotalEvents &&
    diff.sameCriticalVisibleEvents &&
    diff.sameHiddenCriticalEvents &&
    diff.sameAllChecksum
  ) {
    return "warn";
  }
  if (!diff.sameAllChecksum || !diff.sameViewChecksum) {
    return "warn";
  }
  return "warn";
}

export function buildOfflineDetailCompareActionHintLabelKo(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return buildOfflineDetailCompareActionHintInputRequiredLabelKo();
  }
  const targetCode = extractOfflineDetailCompareCode(targetText);
  if (!targetCode) {
    return buildOfflineDetailCompareActionHintInvalidTargetLabelKo();
  }
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCode);
  if (!diff.comparable) {
    return diff.reason === "current_invalid"
      ? buildOfflineDetailCompareActionHintMissingCurrentLabelKo()
      : buildOfflineDetailCompareActionHintInvalidTargetLabelKo();
  }
  if (diff.identical) {
    return buildOfflineDetailCompareActionHintIdenticalLabelKo();
  }
  if (
    !diff.sameViewMode &&
    diff.sameTotalEvents &&
    diff.sameCriticalVisibleEvents &&
    diff.sameHiddenCriticalEvents &&
    diff.sameAllChecksum
  ) {
    return buildOfflineDetailCompareActionHintViewMismatchLabelKo();
  }
  if (!diff.sameAllChecksum || !diff.sameViewChecksum) {
    return buildOfflineDetailCompareActionHintChecksumMismatchLabelKo();
  }
  return buildOfflineDetailCompareActionHintAggregateMismatchLabelKo();
}

export function buildOfflineDetailCompareActionHintInputRequiredLabelKo() {
  return "가이드: 비교 코드를 입력하세요.";
}

export function buildOfflineDetailCompareActionHintInvalidTargetLabelKo() {
  return "가이드: ODR1 비교 코드를 붙여넣거나 입력하세요.";
}

export function buildOfflineDetailCompareActionHintMissingCurrentLabelKo() {
  return "가이드: 오프라인 정산 로그를 열어 현재 코드를 먼저 생성하세요.";
}

export function buildOfflineDetailCompareActionHintIdenticalLabelKo() {
  return "가이드: 코드가 일치합니다. 그대로 유지하세요.";
}

export function buildOfflineDetailCompareActionHintViewMismatchLabelKo() {
  return "가이드: 보기 모드 차이입니다. 동일 모드로 다시 비교하세요.";
}

export function buildOfflineDetailCompareActionHintChecksumMismatchLabelKo() {
  return "가이드: 이벤트 구성 분포가 다릅니다. 정산 로그 원본을 확인하세요.";
}

export function buildOfflineDetailCompareActionHintAggregateMismatchLabelKo() {
  return "가이드: 주요 집계가 다릅니다. 저장 시점/필터를 다시 확인하세요.";
}

export function buildOfflineDetailCompareActionHintTone(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return "warn";
  }
  const targetCode = extractOfflineDetailCompareCode(targetText);
  if (!targetCode) {
    return "warn";
  }
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCode);
  if (!diff.comparable) {
    return diff.reason === "current_invalid" ? "error" : "warn";
  }
  if (diff.identical) {
    return "info";
  }
  if (
    !diff.sameViewMode &&
    diff.sameTotalEvents &&
    diff.sameCriticalVisibleEvents &&
    diff.sameHiddenCriticalEvents &&
    diff.sameAllChecksum
  ) {
    return "warn";
  }
  if (!diff.sameAllChecksum || !diff.sameViewChecksum) {
    return "warn";
  }
  return "error";
}

export function resolveOfflineDetailCompareViewModeAlignmentTarget(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return "";
  }
  const targetCode = extractOfflineDetailCompareCode(targetText);
  if (!targetCode) {
    return "";
  }
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCode);
  if (!diff.comparable || diff.identical || diff.sameViewMode) {
    return "";
  }
  if (
    diff.sameTotalEvents &&
    diff.sameCriticalVisibleEvents &&
    diff.sameHiddenCriticalEvents &&
    diff.sameAllChecksum
  ) {
    return diff.target.viewMode;
  }
  return "";
}

function formatSignedDelta(valueInput) {
  const value = Number(valueInput) || 0;
  if (value > 0) {
    return `+${value}`;
  }
  return String(value);
}

export function buildOfflineDetailCompareCodeDeltaSummaryLabelKo(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return buildOfflineDetailCompareCodeDeltaSummaryTargetMissingLabelKo();
  }
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCodeInput);
  if (!diff.comparable) {
    return diff.reason === "current_invalid"
      ? buildOfflineDetailCompareCodeDeltaSummaryCurrentMissingLabelKo()
      : buildOfflineDetailCompareCodeDeltaSummaryInvalidTargetLabelKo();
  }
  if (diff.identical) {
    return buildOfflineDetailCompareCodeDeltaSummaryNoDifferenceLabelKo();
  }
  const parts = [];
  if (!diff.sameTotalEvents) {
    parts.push(
      buildOfflineDetailCompareCodeDeltaSummaryTotalChangedLabelKo(
        diff.target.totalEvents - diff.current.totalEvents,
      ),
    );
  }
  if (!diff.sameCriticalVisibleEvents) {
    parts.push(
      buildOfflineDetailCompareCodeDeltaSummaryCriticalVisibleChangedLabelKo(
        diff.target.criticalVisibleEvents - diff.current.criticalVisibleEvents,
      ),
    );
  }
  if (!diff.sameHiddenCriticalEvents) {
    parts.push(
      buildOfflineDetailCompareCodeDeltaSummaryHiddenChangedLabelKo(
        diff.target.hiddenCriticalEvents - diff.current.hiddenCriticalEvents,
      ),
    );
  }
  if (!diff.sameViewMode) {
    parts.push(
      buildOfflineDetailCompareCodeDeltaSummaryViewModeChangedLabelKo(
        diff.current.viewMode,
        diff.target.viewMode,
      ),
    );
  }
  if (!diff.sameAllChecksum) {
    parts.push(buildOfflineDetailCompareCodeDeltaSummaryAllChecksumChangedLabelKo());
  }
  if (!diff.sameViewChecksum) {
    parts.push(buildOfflineDetailCompareCodeDeltaSummaryViewChecksumChangedLabelKo());
  }
  return parts.length > 0
    ? `${buildOfflineDetailCompareCodeDeltaSummaryPrefixLabelKo()} ${parts.join(buildOfflineDetailCompareCodeDeltaSummaryItemSeparatorLabelKo())}`
    : buildOfflineDetailCompareCodeDeltaSummaryCodeDifferenceLabelKo();
}

export function buildOfflineDetailCompareCodeDeltaSummaryTargetMissingLabelKo() {
  return `${buildOfflineDetailCompareCodeDeltaSummaryPrefixLabelKo()} ${buildOfflineDetailCompareCodeDeltaSummaryTargetMissingMessageLabelKo()}`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryTargetMissingMessageLabelKo() {
  return "대상 코드 없음";
}

export function buildOfflineDetailCompareCodeDeltaSummaryCurrentMissingLabelKo() {
  return `${buildOfflineDetailCompareCodeDeltaSummaryPrefixLabelKo()} ${buildOfflineDetailCompareCodeDeltaSummaryCurrentMissingMessageLabelKo()}`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryCurrentMissingMessageLabelKo() {
  return "현재 코드 없음";
}

export function buildOfflineDetailCompareCodeDeltaSummaryInvalidTargetLabelKo() {
  return `${buildOfflineDetailCompareCodeDeltaSummaryPrefixLabelKo()} 대상 코드 형식 오류`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryNoDifferenceLabelKo() {
  return `${buildOfflineDetailCompareCodeDeltaSummaryPrefixLabelKo()} 차이 없음`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryCodeDifferenceLabelKo() {
  return `${buildOfflineDetailCompareCodeDeltaSummaryPrefixLabelKo()} 코드 차이 감지`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryPrefixLabelKo() {
  return "차이 요약:";
}

export function buildOfflineDetailCompareCodeDeltaSummaryItemSeparatorLabelKo() {
  return " · ";
}

export function buildOfflineDetailCompareCodeDeltaSummaryTotalChangedLabelKo(
  totalEventsDelta,
) {
  return `총 ${formatSignedDelta(totalEventsDelta)}`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryCriticalVisibleChangedLabelKo(
  criticalVisibleEventsDelta,
) {
  return `핵심표시 ${formatSignedDelta(criticalVisibleEventsDelta)}`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryHiddenChangedLabelKo(
  hiddenCriticalEventsDelta,
) {
  return `숨김 ${formatSignedDelta(hiddenCriticalEventsDelta)}`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryViewModeChangedLabelKo(
  currentViewMode,
  targetViewMode,
) {
  const currentMode =
    currentViewMode === "critical"
      ? buildOfflineDetailCompareCodeDeltaSummaryViewModeCriticalLabelKo()
      : buildOfflineDetailCompareCodeDeltaSummaryViewModeAllLabelKo();
  const targetMode =
    targetViewMode === "critical"
      ? buildOfflineDetailCompareCodeDeltaSummaryViewModeCriticalLabelKo()
      : buildOfflineDetailCompareCodeDeltaSummaryViewModeAllLabelKo();
  return `${buildOfflineDetailCompareCodeDeltaSummaryViewModeKeyLabelKo()} ${currentMode}${buildOfflineDetailCompareCodeDeltaSummaryViewModeTransitionLabelKo()}${targetMode}`;
}

export function buildOfflineDetailCompareCodeDeltaSummaryViewModeKeyLabelKo() {
  return "보기";
}

export function buildOfflineDetailCompareCodeDeltaSummaryViewModeCriticalLabelKo() {
  return "핵심";
}

export function buildOfflineDetailCompareCodeDeltaSummaryViewModeAllLabelKo() {
  return "전체";
}

export function buildOfflineDetailCompareCodeDeltaSummaryViewModeTransitionLabelKo() {
  return "→";
}

export function buildOfflineDetailCompareCodeDeltaSummaryViewChecksumChangedLabelKo() {
  return "view checksum 변경";
}

export function buildOfflineDetailCompareCodeDeltaSummaryAllChecksumChangedLabelKo() {
  return "전체 checksum 변경";
}

export function buildOfflineDetailCompareCodeDeltaSummaryTone(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return "info";
  }
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetText);
  if (!diff.comparable) {
    return diff.reason === "current_invalid" ? "error" : "warn";
  }
  if (diff.identical) {
    return "info";
  }
  if (
    !diff.sameTotalEvents ||
    !diff.sameCriticalVisibleEvents ||
    !diff.sameHiddenCriticalEvents
  ) {
    return "error";
  }
  if (!diff.sameAllChecksum || !diff.sameViewChecksum || !diff.sameViewMode) {
    return "warn";
  }
  return "warn";
}

function boolMark(value) {
  return value
    ? buildOfflineDetailCompareCodeMatchSummaryMatchedLabelKo()
    : buildOfflineDetailCompareCodeMatchSummaryMismatchedLabelKo();
}

export function buildOfflineDetailCompareCodeMatchSummaryLabelKo(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return buildOfflineDetailCompareCodeMatchSummaryTargetMissingLabelKo();
  }
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetCodeInput);
  if (!diff.comparable) {
    return diff.reason === "current_invalid"
      ? buildOfflineDetailCompareCodeMatchSummaryCurrentMissingLabelKo()
      : buildOfflineDetailCompareCodeMatchSummaryInvalidTargetLabelKo();
  }
  return `${buildOfflineDetailCompareCodeMatchSummaryPrefixLabelKo()} ${buildOfflineDetailCompareCodeMatchSummaryTotalKeyLabelKo()} ${boolMark(diff.sameTotalEvents)} · ${buildOfflineDetailCompareCodeMatchSummaryCriticalVisibleKeyLabelKo()} ${boolMark(
    diff.sameCriticalVisibleEvents,
  )} · ${buildOfflineDetailCompareCodeMatchSummaryHiddenKeyLabelKo()} ${boolMark(diff.sameHiddenCriticalEvents)} · ${buildOfflineDetailCompareCodeMatchSummaryViewKeyLabelKo()} ${boolMark(
    diff.sameViewMode,
  )} · ${buildOfflineDetailCompareCodeMatchSummaryAllChecksumKeyLabelKo()} ${boolMark(diff.sameAllChecksum)} · ${buildOfflineDetailCompareCodeMatchSummaryViewChecksumKeyLabelKo()} ${boolMark(
    diff.sameViewChecksum,
  )}`;
}

export function buildOfflineDetailCompareCodeMatchSummaryTargetMissingLabelKo() {
  return `${buildOfflineDetailCompareCodeMatchSummaryPrefixLabelKo()} 대상 코드 없음`;
}

export function buildOfflineDetailCompareCodeMatchSummaryCurrentMissingLabelKo() {
  return `${buildOfflineDetailCompareCodeMatchSummaryPrefixLabelKo()} 현재 코드 없음`;
}

export function buildOfflineDetailCompareCodeMatchSummaryInvalidTargetLabelKo() {
  return `${buildOfflineDetailCompareCodeMatchSummaryPrefixLabelKo()} 대상 코드 형식 오류`;
}

export function buildOfflineDetailCompareCodeMatchSummaryPrefixLabelKo() {
  return "일치 요약:";
}

export function buildOfflineDetailCompareCodeMatchSummaryTotalKeyLabelKo() {
  return "총";
}

export function buildOfflineDetailCompareCodeMatchSummaryCriticalVisibleKeyLabelKo() {
  return "핵심표시";
}

export function buildOfflineDetailCompareCodeMatchSummaryHiddenKeyLabelKo() {
  return "숨김";
}

export function buildOfflineDetailCompareCodeMatchSummaryViewKeyLabelKo() {
  return "보기";
}

export function buildOfflineDetailCompareCodeMatchSummaryAllChecksumKeyLabelKo() {
  return "전체 checksum";
}

export function buildOfflineDetailCompareCodeMatchSummaryViewChecksumKeyLabelKo() {
  return "view checksum";
}

export function buildOfflineDetailCompareCodeMatchSummaryMatchedLabelKo() {
  return "일치";
}

export function buildOfflineDetailCompareCodeMatchSummaryMismatchedLabelKo() {
  return "불일치";
}

export function buildOfflineDetailCompareCodeMatchSummaryTone(
  currentCodeInput,
  targetCodeInput,
) {
  const targetText = typeof targetCodeInput === "string" ? targetCodeInput.trim() : "";
  if (!targetText) {
    return "info";
  }
  const diff = resolveOfflineDetailCompareCodeDiff(currentCodeInput, targetText);
  if (!diff.comparable) {
    return diff.reason === "current_invalid" ? "error" : "warn";
  }
  if (
    diff.sameTotalEvents &&
    diff.sameCriticalVisibleEvents &&
    diff.sameHiddenCriticalEvents &&
    diff.sameViewMode &&
    diff.sameAllChecksum &&
    diff.sameViewChecksum
  ) {
    return "info";
  }
  if (
    !diff.sameTotalEvents ||
    !diff.sameCriticalVisibleEvents ||
    !diff.sameHiddenCriticalEvents
  ) {
    return "error";
  }
  return "warn";
}

export function buildOfflineDetailReportSnapshot(
  eventsInput,
  maxKindsInput = 3,
  viewModeInput = "all",
) {
  const rows = Array.isArray(eventsInput) ? eventsInput.slice() : [];
  const maxKinds = clamp(toNonNegativeInt(maxKindsInput, 3), 1, 5);
  const viewMode = viewModeInput === "critical" ? "critical" : "all";
  const allSummary = summarizeOfflineDetailFilterResult(rows, "all");
  const criticalSummary = summarizeOfflineDetailFilterResult(rows, "critical");
  const hiddenKindsSummary = summarizeOfflineDetailHiddenKinds(rows, "critical");
  const viewSummary = summarizeOfflineDetailFilterResult(rows, viewMode);
  const viewRows = filterOfflineDetailEventsByMode(rows, viewMode);
  const allKindDigest = buildOfflineDetailKindDigest(rows);
  const viewKindDigest = buildOfflineDetailKindDigest(viewRows);
  const compareCode = buildOfflineDetailCompareCode(rows, viewMode);
  return {
    totalEvents: allSummary.total,
    visibleAllEvents: allSummary.visible,
    visibleCriticalEvents: criticalSummary.visible,
    hiddenCriticalEvents: criticalSummary.hidden,
    viewMode,
    viewVisibleEvents: viewSummary.visible,
    viewHiddenEvents: viewSummary.hidden,
    labelsKo: {
      all: buildOfflineDetailFilterSummaryLabelKo(rows, "all"),
      critical: buildOfflineDetailFilterSummaryLabelKo(rows, "critical"),
      hidden: buildOfflineDetailHiddenSummaryLabelKo(rows, "critical"),
      hiddenKinds: buildOfflineDetailHiddenKindsSummaryLabelKo(
        rows,
        "critical",
        maxKinds,
      ),
      view: buildOfflineDetailFilterSummaryLabelKo(rows, viewMode),
      viewHidden: buildOfflineDetailHiddenSummaryLabelKo(rows, viewMode),
      viewHiddenKinds: buildOfflineDetailHiddenKindsSummaryLabelKo(
        rows,
        viewMode,
        maxKinds,
      ),
    },
    hiddenKindsTop: hiddenKindsSummary.items.slice(0, maxKinds),
    compareCode,
    kindDigest: {
      all: allKindDigest,
      viewMode,
      view: viewKindDigest,
    },
  };
}

export function summarizeOfflineDetailCriticalEvents(eventsInput) {
  const rows = Array.isArray(eventsInput) ? eventsInput : [];
  const summary = {
    warmup: 0,
    paused: 0,
    death: 0,
    total: 0,
  };
  for (const row of rows) {
    const kind = row && typeof row.kind === "string" ? row.kind : "";
    if (kind === "offline_warmup_summary") {
      summary.warmup += 1;
    } else if (kind === "auto_breakthrough_paused_by_policy") {
      summary.paused += 1;
    } else if (kind === "breakthrough_death_fail") {
      summary.death += 1;
    }
  }
  summary.total = summary.warmup + summary.paused + summary.death;
  return summary;
}

export function buildOfflineDetailCriticalSummaryLabelKo(eventsInput) {
  const summary = summarizeOfflineDetailCriticalEvents(eventsInput);
  if (summary.total <= 0) {
    return "핵심 이벤트 없음";
  }
  const parts = [];
  if (summary.warmup > 0) {
    parts.push(`워밍업 ${summary.warmup}`);
  }
  if (summary.paused > 0) {
    parts.push(`일시정지 ${summary.paused}`);
  }
  if (summary.death > 0) {
    parts.push(`사망 ${summary.death}`);
  }
  return `총 ${summary.total}건 (${parts.join(" · ")})`;
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

export function isCopyTargetSlotDisabled(activeSlot, optionSlot) {
  return normalizeSaveSlot(activeSlot, 1) === normalizeSaveSlot(optionSlot, 1);
}

export function normalizeSlotSummaryState(state, fallback = "empty") {
  const normalizedFallback = SLOT_SUMMARY_STATES.has(fallback) ? fallback : "empty";
  if (typeof state !== "string") {
    return normalizedFallback;
  }
  return SLOT_SUMMARY_STATES.has(state) ? state : normalizedFallback;
}

export function resolveSlotSummaryStateLabelKo(state) {
  const normalizedState = normalizeSlotSummaryState(state, "empty");
  if (normalizedState === "ok") {
    return "저장 데이터 있음";
  }
  if (normalizedState === "corrupt") {
    return "손상된 저장 데이터";
  }
  return "비어 있음";
}

export function resolveSlotSummaryStateShortKo(state) {
  const normalizedState = normalizeSlotSummaryState(state, "empty");
  if (normalizedState === "ok") {
    return "저장됨";
  }
  if (normalizedState === "corrupt") {
    return "손상";
  }
  return "비어있음";
}

export function resolveSlotSummaryStateTone(state) {
  const normalizedState = normalizeSlotSummaryState(state, "empty");
  if (normalizedState === "corrupt") {
    return "error";
  }
  if (normalizedState === "ok") {
    return "warn";
  }
  return "info";
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

export function resolveSlotCopyPolicy(sourceSlot, targetSlot, targetState, targetLocked = false) {
  const normalizedSourceSlot = normalizeSaveSlot(sourceSlot, 1);
  const normalizedTargetSlot = normalizeSaveSlot(targetSlot, normalizedSourceSlot);
  const normalizedTargetState = normalizeSlotSummaryState(targetState, "empty");
  const normalizedTargetLocked = targetLocked === true;
  const sameSlot = normalizedSourceSlot === normalizedTargetSlot;
  if (sameSlot) {
    return {
      sourceSlot: normalizedSourceSlot,
      targetSlot: normalizedTargetSlot,
      targetState: normalizedTargetState,
      targetLocked: normalizedTargetLocked,
      allowed: false,
      requiresConfirm: false,
      reason: "same_slot",
    };
  }
  if (normalizedTargetLocked) {
    return {
      sourceSlot: normalizedSourceSlot,
      targetSlot: normalizedTargetSlot,
      targetState: normalizedTargetState,
      targetLocked: normalizedTargetLocked,
      allowed: false,
      requiresConfirm: false,
      reason: "target_locked",
    };
  }
  if (normalizedTargetState === "empty") {
    return {
      sourceSlot: normalizedSourceSlot,
      targetSlot: normalizedTargetSlot,
      targetState: normalizedTargetState,
      targetLocked: normalizedTargetLocked,
      allowed: true,
      requiresConfirm: false,
      reason: "target_empty",
    };
  }
  return {
    sourceSlot: normalizedSourceSlot,
    targetSlot: normalizedTargetSlot,
    targetState: normalizedTargetState,
    targetLocked: normalizedTargetLocked,
    allowed: true,
    requiresConfirm: true,
    reason: normalizedTargetState === "corrupt" ? "target_corrupt" : "target_has_data",
  };
}

export function resolveSlotDeletePolicy(slot, slotState, slotLocked = false) {
  const normalizedSlot = normalizeSaveSlot(slot, 1);
  const normalizedState = normalizeSlotSummaryState(slotState, "empty");
  const normalizedSlotLocked = slotLocked === true;
  if (normalizedState === "empty") {
    return {
      slot: normalizedSlot,
      slotState: normalizedState,
      slotLocked: normalizedSlotLocked,
      allowed: false,
      requiresConfirm: false,
      reason: "empty_slot",
    };
  }
  if (normalizedSlotLocked) {
    return {
      slot: normalizedSlot,
      slotState: normalizedState,
      slotLocked: normalizedSlotLocked,
      allowed: false,
      requiresConfirm: false,
      reason: "slot_locked",
    };
  }
  return {
    slot: normalizedSlot,
    slotState: normalizedState,
    slotLocked: normalizedSlotLocked,
    allowed: true,
    requiresConfirm: true,
    reason: normalizedState === "corrupt" ? "corrupt_slot" : "has_data",
  };
}

export function resolveSlotCopyHint(copyPolicy) {
  const policy = copyPolicy && typeof copyPolicy === "object" ? copyPolicy : {};
  if (policy.allowed) {
    return policy.requiresConfirm
      ? "복제 시 대상 슬롯 저장 데이터가 덮어써집니다."
      : "복제 가능: 현재 슬롯 데이터를 대상 슬롯으로 복제합니다.";
  }
  if (policy.reason === "target_locked") {
    return "대상 슬롯이 잠겨 있어 복제할 수 없습니다.";
  }
  if (policy.reason === "same_slot") {
    return "복제 대상은 활성 슬롯과 달라야 합니다.";
  }
  return "복제 조건을 확인하세요.";
}

export function resolveSlotDeleteHint(deletePolicy) {
  const policy = deletePolicy && typeof deletePolicy === "object" ? deletePolicy : {};
  if (policy.allowed) {
    if (policy.reason === "corrupt_slot") {
      return "손상된 저장 데이터도 삭제 가능합니다.";
    }
    return "삭제 시 슬롯 저장 데이터만 제거되고 현재 메모리 상태는 유지됩니다.";
  }
  if (policy.reason === "slot_locked") {
    return "활성 슬롯이 잠겨 있어 삭제할 수 없습니다.";
  }
  if (policy.reason === "empty_slot") {
    return "활성 슬롯이 비어 있어 삭제할 데이터가 없습니다.";
  }
  return "삭제 조건을 확인하세요.";
}

export function resolveSlotCopyHintTone(copyPolicy) {
  const policy = copyPolicy && typeof copyPolicy === "object" ? copyPolicy : {};
  if (policy.allowed) {
    return policy.requiresConfirm ? "warn" : "info";
  }
  if (policy.reason === "target_locked") {
    return "error";
  }
  if (policy.reason === "same_slot") {
    return "warn";
  }
  return "warn";
}

export function resolveSlotDeleteHintTone(deletePolicy) {
  const policy = deletePolicy && typeof deletePolicy === "object" ? deletePolicy : {};
  if (policy.allowed) {
    return policy.reason === "corrupt_slot" ? "warn" : "info";
  }
  if (policy.reason === "slot_locked") {
    return "error";
  }
  if (policy.reason === "empty_slot") {
    return "warn";
  }
  return "warn";
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

function calcRetreatWeightPct(stage) {
  if (!stage || stage.is_tribulation !== 1) {
    return 0;
  }
  return clamp(28 + stage.fail_retreat_max * 11, 20, 78);
}

function calcBreakthroughOutcomeDistribution(stage, successPct, deathPct) {
  const normalizedSuccessPct = clamp(Number(successPct) || 0, 0, 100);
  const failChancePct = Math.max(0, 100 - normalizedSuccessPct);
  if (!stage || stage.is_tribulation !== 1) {
    return {
      successPct: normalizedSuccessPct,
      failChancePct,
      deathFailPct: 0,
      retreatFailPct: 0,
      minorFailPct: failChancePct,
      retreatWeightPct: 0,
      deathInFailurePct: 0,
      retreatInFailurePct: 0,
      minorInFailurePct: 100,
    };
  }

  const normalizedDeathPct = clamp(Number(deathPct) || 0, 0, 100);
  const retreatWeightPct = calcRetreatWeightPct(stage);
  const retreatInFailurePct = clamp(
    retreatWeightPct,
    0,
    Math.max(0, 100 - normalizedDeathPct),
  );
  const minorInFailurePct = Math.max(0, 100 - normalizedDeathPct - retreatInFailurePct);
  const deathFailPct = (failChancePct * normalizedDeathPct) / 100;
  const retreatFailPct = (failChancePct * retreatInFailurePct) / 100;
  const minorFailPct = (failChancePct * minorInFailurePct) / 100;
  return {
    successPct: normalizedSuccessPct,
    failChancePct,
    deathFailPct,
    retreatFailPct,
    minorFailPct,
    retreatWeightPct,
    deathInFailurePct: normalizedDeathPct,
    retreatInFailurePct,
    minorInFailurePct,
  };
}

function riskTierRank(tier) {
  if (tier === "extreme") return 4;
  if (tier === "high") return 3;
  if (tier === "medium") return 2;
  if (tier === "low") return 1;
  return 0;
}

export function resolveBreakthroughRiskTier(preview = {}) {
  const stage = preview.stage;
  const deathFailPct = clamp(Number(preview.deathFailPct) || 0, 0, 100);
  const tribulationStage = stage?.is_tribulation === 1;
  if (!tribulationStage || deathFailPct <= 0) {
    return {
      tier: "safe",
      rank: riskTierRank("safe"),
      tone: "info",
      labelKo: "비도겁 구간",
      descriptionKo: "사망 위험 없음",
    };
  }

  if (deathFailPct >= 18) {
    return {
      tier: "extreme",
      rank: riskTierRank("extreme"),
      tone: "error",
      labelKo: "치명",
      descriptionKo: "사망 실패 확률 매우 높음",
    };
  }
  if (deathFailPct >= 10) {
    return {
      tier: "high",
      rank: riskTierRank("high"),
      tone: "error",
      labelKo: "위험",
      descriptionKo: "수호부/환생 보정 권장",
    };
  }
  if (deathFailPct >= 4) {
    return {
      tier: "medium",
      rank: riskTierRank("medium"),
      tone: "warn",
      labelKo: "주의",
      descriptionKo: "도겁 실패 리스크 존재",
    };
  }
  return {
    tier: "low",
    rank: riskTierRank("low"),
    tone: "warn",
    labelKo: "경미",
    descriptionKo: "낮은 도겁 리스크",
  };
}

export function resolveBreakthroughRecommendation(currentPreview, options = {}) {
  const preview =
    currentPreview && typeof currentPreview === "object" ? currentPreview : {};
  const currentRisk = resolveBreakthroughRiskTier(preview);
  const hasBreakthroughElixir = options.hasBreakthroughElixir === true;
  const hasTribulationTalisman = options.hasTribulationTalisman === true;
  const usingBreakthroughElixir = options.usingBreakthroughElixir === true;
  const usingTribulationTalisman = options.usingTribulationTalisman === true;
  const mitigatedPreview =
    options.mitigatedPreview && typeof options.mitigatedPreview === "object"
      ? options.mitigatedPreview
      : preview;
  const mitigatedRisk = resolveBreakthroughRiskTier(mitigatedPreview);
  const currentSuccessPct = clamp(Number(preview.successPct) || 0, 0, 100);
  const mitigatedSuccessPct = clamp(Number(mitigatedPreview.successPct) || 0, 0, 100);
  const currentDeathFailPct = clamp(Number(preview.deathFailPct) || 0, 0, 100);
  const mitigatedDeathFailPct = clamp(
    Number(mitigatedPreview.deathFailPct) || 0,
    0,
    100,
  );
  const successGainPct = Math.max(0, mitigatedSuccessPct - currentSuccessPct);
  const deathFailDropPct = Math.max(0, currentDeathFailPct - mitigatedDeathFailPct);
  const riskReduced =
    mitigatedRisk.rank < currentRisk.rank ||
    deathFailDropPct >= 0.1 ||
    successGainPct >= 0.1;
  const tribulationStage = preview?.stage?.is_tribulation === 1;

  if (!tribulationStage || currentRisk.tier === "safe") {
    return {
      tone: "info",
      labelKo: "자원 비축",
      messageKo: "비도겁 구간입니다. 영약/수호부를 비축하세요.",
    };
  }

  if (
    (currentRisk.tier === "high" || currentRisk.tier === "extreme") &&
    hasTribulationTalisman &&
    !usingTribulationTalisman
  ) {
    const dropText =
      deathFailDropPct > 0
        ? ` (예상 사망 위험 ${deathFailDropPct.toFixed(1)}%p 감소)`
        : "";
    return {
      tone: "warn",
      labelKo: "수호부 권장",
      messageKo: `도겁 구간 위험도가 높습니다. 수호부 사용을 권장합니다.${dropText}`,
    };
  }

  if (
    (currentRisk.tier === "medium" || currentRisk.tier === "high" || currentRisk.tier === "extreme") &&
    hasBreakthroughElixir &&
    !usingBreakthroughElixir
  ) {
    const gainText =
      successGainPct > 0
        ? ` (예상 성공률 +${successGainPct.toFixed(1)}%p)`
        : "";
    return {
      tone: "warn",
      labelKo: "영약 권장",
      messageKo: `돌파 성공률이 낮습니다. 영약 사용을 권장합니다.${gainText}`,
    };
  }

  if (currentRisk.tier === "extreme" && !riskReduced) {
    return {
      tone: "error",
      labelKo: "재정비 권장",
      messageKo: "사망 위험이 매우 높습니다. 환생 보정과 자원 확보 후 재도전하세요.",
    };
  }

  if (usingTribulationTalisman || usingBreakthroughElixir) {
    return {
      tone: "info",
      labelKo: "준비 완료",
      messageKo: `현재 위험도 ${currentRisk.labelKo}. 설정 유지 후 돌파를 진행하세요.`,
    };
  }

  return {
    tone: currentRisk.tone === "error" ? "warn" : currentRisk.tone,
    labelKo: "주의 진행",
    messageKo: `현재 위험도 ${currentRisk.labelKo}. 필요 시 수동으로 자원을 보강하세요.`,
  };
}

export function resolveBreakthroughRecommendationToggles(currentPreview, options = {}) {
  const preview =
    currentPreview && typeof currentPreview === "object" ? currentPreview : {};
  const riskTier = resolveBreakthroughRiskTier(preview);
  const tribulationStage = preview?.stage?.is_tribulation === 1;
  const hasBreakthroughElixir = options.hasBreakthroughElixir === true;
  const hasTribulationTalisman = options.hasTribulationTalisman === true;
  const currentUseBreakthroughElixir = options.currentUseBreakthroughElixir === true;
  const currentUseTribulationTalisman = options.currentUseTribulationTalisman === true;

  let nextUseBreakthroughElixir = currentUseBreakthroughElixir && hasBreakthroughElixir;
  let nextUseTribulationTalisman = currentUseTribulationTalisman && hasTribulationTalisman;
  let reason = "keep_current";

  if (!tribulationStage || riskTier.tier === "safe") {
    nextUseBreakthroughElixir = false;
    nextUseTribulationTalisman = false;
    reason = "disable_non_tribulation";
  } else if (riskTier.tier === "extreme" || riskTier.tier === "high") {
    nextUseBreakthroughElixir = hasBreakthroughElixir;
    nextUseTribulationTalisman = hasTribulationTalisman;
    reason = "high_risk_enable_all";
  } else if (riskTier.tier === "medium") {
    nextUseBreakthroughElixir = hasBreakthroughElixir;
    reason = "medium_risk_enable_elixir";
  } else if (riskTier.tier === "low") {
    reason = "low_risk_keep_optional";
  }

  const needsBreakthroughElixir =
    tribulationStage &&
    (riskTier.tier === "medium" || riskTier.tier === "high" || riskTier.tier === "extreme");
  const needsTribulationTalisman =
    tribulationStage && (riskTier.tier === "high" || riskTier.tier === "extreme");
  const missingBreakthroughElixir = needsBreakthroughElixir && !hasBreakthroughElixir;
  const missingTribulationTalisman = needsTribulationTalisman && !hasTribulationTalisman;
  const changed =
    nextUseBreakthroughElixir !== currentUseBreakthroughElixir ||
    nextUseTribulationTalisman !== currentUseTribulationTalisman;

  let messageKo = "현재 설정이 이미 권장 상태입니다.";
  if (reason === "disable_non_tribulation") {
    messageKo = "비도겁 구간이므로 영약/수호부 사용을 해제합니다.";
  } else if (reason === "high_risk_enable_all") {
    messageKo = "고위험 도겁 구간으로 영약/수호부 사용을 권장합니다.";
  } else if (reason === "medium_risk_enable_elixir") {
    messageKo = "중위험 도겁 구간으로 영약 사용을 권장합니다.";
  } else if (reason === "low_risk_keep_optional") {
    messageKo = "저위험 구간으로 현재 설정을 유지합니다.";
  }
  if (missingBreakthroughElixir || missingTribulationTalisman) {
    const missingLabels = [];
    if (missingBreakthroughElixir) missingLabels.push("영약");
    if (missingTribulationTalisman) missingLabels.push("수호부");
    messageKo += ` (보유 없음: ${missingLabels.join(", ")})`;
  }

  return {
    reason,
    changed,
    riskTier,
    nextUseBreakthroughElixir,
    nextUseTribulationTalisman,
    missingBreakthroughElixir,
    missingTribulationTalisman,
    messageKo,
  };
}

function fmtSignedPct(value) {
  const amount = Number(value) || 0;
  if (amount > 0) {
    return `+${amount.toFixed(1)}%p`;
  }
  if (amount < 0) {
    return `-${Math.abs(amount).toFixed(1)}%p`;
  }
  return "+0.0%p";
}

export function resolveBreakthroughMitigationSummary(currentPreview, mitigatedPreview) {
  const current =
    currentPreview && typeof currentPreview === "object" ? currentPreview : {};
  const mitigated =
    mitigatedPreview && typeof mitigatedPreview === "object" ? mitigatedPreview : current;
  const currentRisk = resolveBreakthroughRiskTier(current);
  const mitigatedRisk = resolveBreakthroughRiskTier(mitigated);
  const currentSuccessPct = clamp(Number(current.successPct) || 0, 0, 100);
  const mitigatedSuccessPct = clamp(Number(mitigated.successPct) || 0, 0, 100);
  const currentDeathFailPct = clamp(Number(current.deathFailPct) || 0, 0, 100);
  const mitigatedDeathFailPct = clamp(Number(mitigated.deathFailPct) || 0, 0, 100);
  const successDeltaPct = mitigatedSuccessPct - currentSuccessPct;
  const deathFailDeltaPct = currentDeathFailPct - mitigatedDeathFailPct;
  const riskImproved = mitigatedRisk.rank < currentRisk.rank;
  const tribulationStage = current?.stage?.is_tribulation === 1;

  if (!tribulationStage || currentRisk.tier === "safe") {
    return {
      tone: "info",
      labelKo: "비도겁",
      messageKo: "현재 경지는 도겁 리스크가 없어 보정 효과가 제한적입니다.",
      successDeltaPct,
      deathFailDeltaPct,
      riskImproved: false,
      riskBefore: currentRisk,
      riskAfter: mitigatedRisk,
    };
  }

  if (successDeltaPct <= 0.05 && deathFailDeltaPct <= 0.05 && !riskImproved) {
    return {
      tone: "warn",
      labelKo: "개선 없음",
      messageKo: "현재 조건 대비 추가 보정 효과가 거의 없습니다.",
      successDeltaPct,
      deathFailDeltaPct,
      riskImproved,
      riskBefore: currentRisk,
      riskAfter: mitigatedRisk,
    };
  }

  let labelKo = "개선 경미";
  if (riskImproved || successDeltaPct >= 8 || deathFailDeltaPct >= 6) {
    labelKo = "개선 큼";
  } else if (successDeltaPct >= 4 || deathFailDeltaPct >= 3) {
    labelKo = "개선 보통";
  }

  const riskText = riskImproved
    ? `위험도 ${currentRisk.labelKo}→${mitigatedRisk.labelKo}`
    : `위험도 ${currentRisk.labelKo} 유지`;
  return {
    tone: "info",
    labelKo,
    messageKo: `보정 적용 시 성공 ${fmtSignedPct(successDeltaPct)}, 사망 ${fmtSignedPct(-deathFailDeltaPct)} (${riskText})`,
    successDeltaPct,
    deathFailDeltaPct,
    riskImproved,
    riskBefore: currentRisk,
    riskAfter: mitigatedRisk,
  };
}

function calcAverageRetreatLayers(stage) {
  const min = Math.max(0, toNonNegativeInt(stage?.fail_retreat_min, 0));
  const max = Math.max(min, toNonNegativeInt(stage?.fail_retreat_max, min));
  return (min + max) / 2;
}

export function resolveBreakthroughExpectedDelta(context, state, previewInput) {
  const preview =
    previewInput && typeof previewInput === "object"
      ? previewInput
      : previewBreakthroughChance(context, state, {
          useBreakthroughElixir: false,
          useTribulationTalisman: false,
        });
  const stage = preview?.stage || getStage(context, state?.progression?.difficultyIndex || 1);
  const successProb = clamp(Number(preview.successPct) || 0, 0, 100) / 100;
  const minorFailProb = clamp(Number(preview.minorFailPct) || 0, 0, 100) / 100;
  const retreatFailProb = clamp(Number(preview.retreatFailPct) || 0, 0, 100) / 100;
  const deathFailProb = clamp(Number(preview.deathFailPct) || 0, 0, 100) / 100;
  const qiRequired = Math.max(1, Number(stage.qi_required) || 1);
  const currentQi = Math.max(0, toNonNegativeInt(state?.currencies?.qi, qiRequired));
  const currentDifficultyIndex = Math.max(
    1,
    toNonNegativeInt(state?.progression?.difficultyIndex, stage.difficulty_index || 1),
  );

  const qiLossSuccess = Math.round(qiRequired * 0.85);
  const qiLossMinorFail = Math.max(1, Math.round(qiRequired * 0.22));
  const qiLossRetreatFail = Math.max(1, Math.round(qiRequired * 0.28));
  const qiLossDeathFail = currentQi;
  const expectedQiLoss =
    successProb * qiLossSuccess +
    minorFailProb * qiLossMinorFail +
    retreatFailProb * qiLossRetreatFail +
    deathFailProb * qiLossDeathFail;
  const expectedQiDelta = -expectedQiLoss;

  const rebirthReward = calcRebirthReward(
    stage,
    toNonNegativeInt(state?.progression?.rebirthCount, 0),
  );
  const expectedRebirthEssenceDelta = deathFailProb * rebirthReward;
  const avgRetreatLayers = calcAverageRetreatLayers(stage);
  const deathResetDelta = -(currentDifficultyIndex - 1);
  const expectedDifficultyDelta =
    successProb * 1 +
    retreatFailProb * -avgRetreatLayers +
    deathFailProb * deathResetDelta;

  const expectedQiLossRatio = expectedQiLoss / Math.max(1, currentQi);
  let tone = "info";
  let labelKo = "부담 낮음";
  if (expectedQiLossRatio >= 0.6 || deathFailProb >= 0.12) {
    tone = "error";
    labelKo = "부담 큼";
  } else if (expectedQiLossRatio >= 0.35 || deathFailProb >= 0.05) {
    tone = "warn";
    labelKo = "부담 보통";
  }

  return {
    tone,
    labelKo,
    expectedQiDelta,
    expectedQiLoss,
    expectedQiLossRatio,
    expectedRebirthEssenceDelta,
    expectedDifficultyDelta,
    rebirthReward,
    probabilities: {
      successProb,
      minorFailProb,
      retreatFailProb,
      deathFailProb,
    },
  };
}

export function resolveBreakthroughManualAttemptPolicy(previewInput, expectedDeltaInput) {
  const preview =
    previewInput && typeof previewInput === "object" ? previewInput : {};
  const expectedDelta =
    expectedDeltaInput && typeof expectedDeltaInput === "object"
      ? expectedDeltaInput
      : {};
  const riskTier = resolveBreakthroughRiskTier(preview);
  const deathFailPct = clamp(Number(preview.deathFailPct) || 0, 0, 100);
  const expectedQiLossRatio = clamp(Number(expectedDelta.expectedQiLossRatio) || 0, 0, 1);

  let reason = "safe";
  let requiresConfirm = false;
  let tone = "info";
  let messageKo = "돌파 진행 가능";
  if (riskTier.tier === "extreme" || deathFailPct >= 12) {
    reason = "extreme_risk";
    requiresConfirm = true;
    tone = "error";
    messageKo = "고위험 도겁 구간입니다. 확인 후 진행하세요.";
  } else if (riskTier.tier === "high" || deathFailPct >= 8) {
    reason = "high_risk";
    requiresConfirm = true;
    tone = "warn";
    messageKo = "도겁 사망 위험이 높아 확인이 필요합니다.";
  } else if (expectedQiLossRatio >= 0.65) {
    reason = "high_qi_cost";
    requiresConfirm = true;
    tone = "warn";
    messageKo = "기 소모 기대값이 높아 확인이 필요합니다.";
  }

  return {
    reason,
    requiresConfirm,
    tone,
    riskTier,
    deathFailPct,
    expectedQiLossRatio,
    messageKo,
  };
}

export function resolveBreakthroughAutoAttemptPolicy(previewInput, expectedDeltaInput) {
  const manualPolicy = resolveBreakthroughManualAttemptPolicy(
    previewInput,
    expectedDeltaInput,
  );
  const isTribulationStage = previewInput?.stage?.is_tribulation === 1;

  if (!isTribulationStage || manualPolicy.reason === "safe") {
    return {
      allowed: true,
      reason: "safe",
      reasonLabelKo: "안전",
      tone: "info",
      messageKo: "자동 돌파 진행 가능",
      nextActionKo: "",
      manualPolicy,
    };
  }

  if (manualPolicy.reason === "extreme_risk") {
    return {
      allowed: false,
      reason: "blocked_extreme_risk",
      reasonLabelKo: "치명 위험",
      tone: "error",
      messageKo: "자동 돌파 중단: 치명 도겁 구간은 수동 확인이 필요합니다.",
      nextActionKo: "환생 보정/영약/수호부를 확보한 뒤 수동으로 재시도하세요.",
      manualPolicy,
    };
  }
  if (manualPolicy.reason === "high_risk") {
    return {
      allowed: false,
      reason: "blocked_high_risk",
      reasonLabelKo: "고위험",
      tone: "warn",
      messageKo: "자동 돌파 중단: 위험 도겁 구간은 수동 확인이 필요합니다.",
      nextActionKo: "수호부/영약 보정 후 수동으로 재시도하세요.",
      manualPolicy,
    };
  }
  if (manualPolicy.reason === "high_qi_cost") {
    return {
      allowed: false,
      reason: "blocked_high_qi_cost",
      reasonLabelKo: "고기 소모",
      tone: "warn",
      messageKo: "자동 돌파 중단: 기대 기 소모가 높아 수동 확인이 필요합니다.",
      nextActionKo: "기(氣)를 더 모은 뒤 수동으로 재시도하세요.",
      manualPolicy,
    };
  }

  return {
    allowed: true,
    reason: "safe",
    reasonLabelKo: "안전",
    tone: "info",
    messageKo: "자동 돌파 진행 가능",
    nextActionKo: "",
    manualPolicy,
  };
}

export function resolveAutoBreakthroughResumePolicy(context, state) {
  const stage = getStage(context, state?.progression?.difficultyIndex || 1);
  const autoBreakthroughEnabled = state?.settings?.autoBreakthrough === true;
  const autoTribulationEnabled = state?.settings?.autoTribulation === true;
  const isTribulationStage = stage.is_tribulation === 1;
  const preview = previewBreakthroughChance(context, state, {
    useBreakthroughElixir: true,
    useTribulationTalisman: true,
  });
  const expectedDelta = resolveBreakthroughExpectedDelta(context, state, preview);
  const autoPolicy = resolveBreakthroughAutoAttemptPolicy(preview, expectedDelta);

  if (autoBreakthroughEnabled) {
    return {
      reason: "already_enabled",
      tone: "info",
      labelKo: "진행 중",
      messageKo: "자동 돌파가 이미 켜져 있습니다.",
      actionLabelKo: "자동 돌파 진행 중",
      actionable: false,
      shouldEnableAutoBreakthrough: true,
      shouldEnableAutoTribulation: false,
      stage,
      isTribulationStage,
      preview,
      expectedDelta,
      riskTier: resolveBreakthroughRiskTier(preview),
      autoPolicy,
    };
  }

  if (!autoPolicy.allowed) {
    return {
      reason: autoPolicy.reason,
      tone: autoPolicy.tone,
      labelKo: "재개 보류",
      messageKo: autoPolicy.nextActionKo || autoPolicy.messageKo,
      actionLabelKo: "재개 조건 미충족",
      actionable: false,
      shouldEnableAutoBreakthrough: false,
      shouldEnableAutoTribulation: false,
      stage,
      isTribulationStage,
      preview,
      expectedDelta,
      riskTier: resolveBreakthroughRiskTier(preview),
      autoPolicy,
    };
  }

  if (isTribulationStage && !autoTribulationEnabled) {
    return {
      reason: "tribulation_disabled",
      tone: "warn",
      labelKo: "도겁 허용 필요",
      messageKo: "현재 도겁 단계입니다. 자동 도겁 허용을 켜야 자동 돌파가 재개됩니다.",
      actionLabelKo: "도겁 허용 후 재개",
      actionable: true,
      shouldEnableAutoBreakthrough: true,
      shouldEnableAutoTribulation: true,
      stage,
      isTribulationStage,
      preview,
      expectedDelta,
      riskTier: resolveBreakthroughRiskTier(preview),
      autoPolicy,
    };
  }

  return {
    reason: "resume_ready",
    tone: "info",
    labelKo: "재개 가능",
    messageKo: "현재 조건에서 자동 돌파를 재개할 수 있습니다.",
    actionLabelKo: "자동 돌파 재개",
    actionable: true,
    shouldEnableAutoBreakthrough: true,
    shouldEnableAutoTribulation: false,
    stage,
    isTribulationStage,
    preview,
    expectedDelta,
    riskTier: resolveBreakthroughRiskTier(preview),
    autoPolicy,
  };
}

export function resolveAutoBreakthroughResumeConfirmPolicy(resumePolicyInput) {
  const resumePolicy =
    resumePolicyInput && typeof resumePolicyInput === "object"
      ? resumePolicyInput
      : {};
  const actionable = resumePolicy.actionable === true;
  const shouldEnableAutoBreakthrough =
    resumePolicy.shouldEnableAutoBreakthrough === true;
  const isTribulationStage = resumePolicy.isTribulationStage === true;
  const riskTier =
    resumePolicy.riskTier && typeof resumePolicy.riskTier === "object"
      ? resumePolicy.riskTier
      : { labelKo: "비도겁 구간", tone: "info" };
  const preview =
    resumePolicy.preview && typeof resumePolicy.preview === "object"
      ? resumePolicy.preview
      : {};
  const expectedDelta =
    resumePolicy.expectedDelta && typeof resumePolicy.expectedDelta === "object"
      ? resumePolicy.expectedDelta
      : {};

  if (!actionable || !shouldEnableAutoBreakthrough) {
    return {
      requiresConfirm: false,
      reason: "not_actionable",
      tone: "info",
      messageKo: "자동 돌파 재개 확인이 필요하지 않습니다.",
      riskTier,
      preview,
      expectedDelta,
      enableTribulation: false,
    };
  }

  if (!isTribulationStage) {
    return {
      requiresConfirm: false,
      reason: "non_tribulation",
      tone: "info",
      messageKo: "비도겁 구간은 즉시 재개할 수 있습니다.",
      riskTier,
      preview,
      expectedDelta,
      enableTribulation: false,
    };
  }

  const enableTribulation = resumePolicy.shouldEnableAutoTribulation === true;
  return {
    requiresConfirm: true,
    reason: enableTribulation
      ? "enable_tribulation_auto_resume"
      : "tribulation_auto_resume",
    tone: "warn",
    messageKo: enableTribulation
      ? "도겁 자동 허용과 자동 돌파가 함께 재개됩니다. 확인 후 진행하세요."
      : "도겁 단계 자동 돌파를 재개합니다. 확인 후 진행하세요.",
    riskTier,
    preview,
    expectedDelta,
    enableTribulation,
  };
}

export function resolveAutoBreakthroughResumeRecommendationPlan(
  confirmPolicyInput,
  recommendationToggleInput,
) {
  const confirmPolicy =
    confirmPolicyInput && typeof confirmPolicyInput === "object"
      ? confirmPolicyInput
      : {};
  const recommendationToggle =
    recommendationToggleInput && typeof recommendationToggleInput === "object"
      ? recommendationToggleInput
      : {};
  const changed = recommendationToggle.changed === true;
  const nextUseBreakthroughElixir =
    recommendationToggle.nextUseBreakthroughElixir === true;
  const nextUseTribulationTalisman =
    recommendationToggle.nextUseTribulationTalisman === true;
  const shouldApplyRecommendation =
    confirmPolicy.requiresConfirm === true && changed;
  const missingBreakthroughElixir =
    recommendationToggle.missingBreakthroughElixir === true;
  const missingTribulationTalisman =
    recommendationToggle.missingTribulationTalisman === true;
  const hasMissing =
    missingBreakthroughElixir || missingTribulationTalisman;

  const elixirText = nextUseBreakthroughElixir ? "ON" : "OFF";
  const talismanText = nextUseTribulationTalisman ? "ON" : "OFF";
  let messageKo = "권장 설정 변경 없음";
  if (shouldApplyRecommendation) {
    messageKo = `확인 시 권장 설정 자동 적용: 영약 ${elixirText}, 수호부 ${talismanText}`;
  } else if (changed) {
    messageKo = `권장 설정 제안: 영약 ${elixirText}, 수호부 ${talismanText}`;
  }
  if (hasMissing) {
    const missingLabels = [];
    if (missingBreakthroughElixir) missingLabels.push("영약");
    if (missingTribulationTalisman) missingLabels.push("수호부");
    messageKo += ` (보유 없음: ${missingLabels.join(", ")})`;
  }

  return {
    shouldApplyRecommendation,
    changed,
    nextUseBreakthroughElixir,
    nextUseTribulationTalisman,
    missingBreakthroughElixir,
    missingTribulationTalisman,
    hasMissing,
    tone: hasMissing ? "warn" : "info",
    messageKo,
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
  const retreatWeight = calcRetreatWeightPct(stage);
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
      autoBreakthroughResumeWarmupSec: normalizeAutoBreakthroughResumeWarmupSec(
        options.autoBreakthroughResumeWarmupSec,
        DEFAULT_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC,
      ),
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
      autoBreakthroughWarmupUntilTimelineSec: 0,
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
  const distribution = calcBreakthroughOutcomeDistribution(stage, successPct, deathPct);

  return {
    stage,
    successPct,
    deathPct,
    minorFailPct: distribution.minorFailPct,
    retreatFailPct: distribution.retreatFailPct,
    deathFailPct: distribution.deathFailPct,
    failChancePct: distribution.failChancePct,
    retreatWeightPct: distribution.retreatWeightPct,
    deathInFailurePct: distribution.deathInFailurePct,
    retreatInFailurePct: distribution.retreatInFailurePct,
    minorInFailurePct: distribution.minorInFailurePct,
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
  const enforceAutoRiskPolicy = pickBoolean(options.enforceAutoRiskPolicy, false);
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
  if (respectAutoTribulation && enforceAutoRiskPolicy) {
    const expectedDelta = resolveBreakthroughExpectedDelta(context, state, preview);
    const autoPolicy = resolveBreakthroughAutoAttemptPolicy(preview, expectedDelta);
    if (!autoPolicy.allowed) {
      return {
        attempted: false,
        outcome: "blocked_auto_risk_policy",
        stage,
        preview,
        expectedDelta,
        autoPolicy,
        message: autoPolicy.messageKo,
      };
    }
  }
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
  const autoBreakthroughWarmupUntilSec = Math.max(
    0,
    toNonNegativeInt(options.autoBreakthroughWarmupUntilSec, 0),
  );
  const pauseAutoBreakthroughOnPolicyBlocks = pickBoolean(
    options.pauseAutoBreakthroughOnPolicyBlocks,
    true,
  );
  const autoBreakthroughPausePolicyBlockThreshold = clamp(
    toNonNegativeInt(options.autoBreakthroughPausePolicyBlockThreshold, 3),
    1,
    20,
  );
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
    autoBreakthroughWarmupSkips: 0,
    autoBreakthroughWarmupRemainingSec: 0,
    breakthroughPolicyBlocks: 0,
    breakthroughPolicyBlockReasons: {
      extremeRisk: 0,
      highRisk: 0,
      highQiCost: 0,
    },
    autoBreakthroughPaused: false,
    autoBreakthroughPauseReason: "",
    autoBreakthroughPauseReasonLabelKo: "",
    autoBreakthroughPauseAtSec: 0,
    rebirths: 0,
  };
  const collectedEvents = [];
  let consecutivePolicyBlocks = 0;

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
      if (timelineSec <= autoBreakthroughWarmupUntilSec) {
        summary.autoBreakthroughWarmupSkips += 1;
        summary.autoBreakthroughWarmupRemainingSec = Math.max(
          summary.autoBreakthroughWarmupRemainingSec,
          autoBreakthroughWarmupUntilSec - timelineSec + 1,
        );
        consecutivePolicyBlocks = 0;
        if (collectEvents) {
          pushLimited(
            collectedEvents,
            {
              sec: timelineSec,
              kind: "auto_breakthrough_warmup_skip",
              warmupUntilSec: autoBreakthroughWarmupUntilSec,
              warmupRemainingSec: Math.max(
                0,
                autoBreakthroughWarmupUntilSec - timelineSec + 1,
              ),
            },
            maxCollectedEvents,
          );
        }
        continue;
      }
      const breakthrough = runBreakthroughAttempt(context, state, rng, {
        respectAutoTribulation: true,
        enforceAutoRiskPolicy: true,
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
        consecutivePolicyBlocks = 0;
        if (breakthrough.outcome === "death_fail") {
          summary.rebirths += 1;
        }
      } else if (breakthrough.outcome === "blocked_auto_risk_policy") {
        summary.breakthroughPolicyBlocks += 1;
        consecutivePolicyBlocks += 1;
        if (breakthrough.autoPolicy?.reason === "blocked_extreme_risk") {
          summary.breakthroughPolicyBlockReasons.extremeRisk += 1;
        } else if (breakthrough.autoPolicy?.reason === "blocked_high_risk") {
          summary.breakthroughPolicyBlockReasons.highRisk += 1;
        } else if (breakthrough.autoPolicy?.reason === "blocked_high_qi_cost") {
          summary.breakthroughPolicyBlockReasons.highQiCost += 1;
        }
        if (collectEvents) {
          pushLimited(
            collectedEvents,
            {
              sec: timelineSec,
              kind: "breakthrough_blocked_auto_policy",
              reason: breakthrough.autoPolicy?.reason || "blocked_auto_risk_policy",
              reasonLabelKo: breakthrough.autoPolicy?.reasonLabelKo || "",
              message: breakthrough.message || "",
              nextActionKo: breakthrough.autoPolicy?.nextActionKo || "",
            },
            maxCollectedEvents,
          );
        }
        if (
          pauseAutoBreakthroughOnPolicyBlocks &&
          !summary.autoBreakthroughPaused &&
          consecutivePolicyBlocks >= autoBreakthroughPausePolicyBlockThreshold
        ) {
          state.settings.autoBreakthrough = false;
          summary.autoBreakthroughPaused = true;
          summary.autoBreakthroughPauseReason =
            breakthrough.autoPolicy?.reason || "blocked_auto_risk_policy";
          summary.autoBreakthroughPauseReasonLabelKo =
            breakthrough.autoPolicy?.reasonLabelKo || "정책 차단";
          summary.autoBreakthroughPauseAtSec = timelineSec;
          if (!suppressLogs) {
            addLog(
              state,
              "auto",
              `자동 돌파 일시정지: 연속 차단 ${consecutivePolicyBlocks}회 (${summary.autoBreakthroughPauseReasonLabelKo})`,
            );
          }
          if (collectEvents) {
            pushLimited(
              collectedEvents,
              {
                sec: timelineSec,
                kind: "auto_breakthrough_paused_by_policy",
                threshold: autoBreakthroughPausePolicyBlockThreshold,
                consecutiveBlocks: consecutivePolicyBlocks,
                reason: summary.autoBreakthroughPauseReason,
                reasonLabelKo: summary.autoBreakthroughPauseReasonLabelKo,
              },
              maxCollectedEvents,
            );
          }
        }
      } else {
        consecutivePolicyBlocks = 0;
      }
    }
  }

  if (!suppressLogs) {
    const warmupText =
      summary.autoBreakthroughWarmupSkips > 0
        ? ` · 돌파 워밍업 차단 ${summary.autoBreakthroughWarmupSkips}회`
        : "";
    const pauseText = summary.autoBreakthroughPaused
      ? ` · 자동돌파 일시정지(${summary.autoBreakthroughPauseReasonLabelKo})`
      : "";
    addLog(
      state,
      "auto",
      `자동 ${seconds}초 진행 완료 (전투 ${summary.battles}회, 돌파 ${summary.breakthroughs}회${warmupText}, 위험 차단 ${summary.breakthroughPolicyBlocks}회, 환생 ${summary.rebirths}회${pauseText})`,
    );
  }

  const finalTimelineSec = timelineOffsetSec + seconds;
  summary.autoBreakthroughWarmupRemainingSec = Math.max(
    0,
    autoBreakthroughWarmupUntilSec - finalTimelineSec,
  );
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
  const autoBreakthroughWarmupUntilSec = Math.max(
    0,
    toNonNegativeInt(options.autoBreakthroughWarmupUntilSec, 0),
  );
  const autoBreakthroughWarmupRemainingSecBefore = autoBreakthroughWarmupUntilSec;
  const rawOfflineSec = Math.max(0, Math.floor((nowEpochMs - anchorEpochMs) / 1000));
  const maxOfflineHours = clamp(Number(options.maxOfflineHours) || 12, 0, 168);
  const maxOfflineSec = Math.floor(maxOfflineHours * 3600);
  const appliedOfflineSec = Math.min(rawOfflineSec, maxOfflineSec);
  const cappedByMaxOffline = rawOfflineSec > appliedOfflineSec;
  const syncAnchorToNow = pickBoolean(options.syncAnchorToNow, true);
  const maxCollectedEvents = clamp(
    toNonNegativeInt(options.maxCollectedEvents, 24),
    0,
    120,
  );

  let autoSummary = null;
  let autoBreakthroughWarmupRemainingSecAfter =
    autoBreakthroughWarmupRemainingSecBefore;
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
      autoBreakthroughWarmupUntilSec,
      suppressLogs: true,
      collectEvents: true,
      maxCollectedEvents,
    });
    autoBreakthroughWarmupRemainingSecAfter = Math.max(
      0,
      toNonNegativeInt(
        autoSummary.autoBreakthroughWarmupRemainingSec,
        autoBreakthroughWarmupRemainingSecBefore,
      ),
    );
    const warmupTelemetry = resolveOfflineWarmupTelemetry({
      appliedOfflineSec,
      autoBreakthroughWarmupRemainingSecBefore,
      autoBreakthroughWarmupRemainingSecAfter,
      autoSummary,
    });
    if (warmupTelemetry.hadWarmup && Array.isArray(autoSummary.collectedEvents)) {
      pushLimited(
        autoSummary.collectedEvents,
        {
          sec: appliedOfflineSec,
          kind: "offline_warmup_summary",
          beforeSec: warmupTelemetry.before,
          afterSec: warmupTelemetry.after,
          consumedSec: warmupTelemetry.consumed,
          skippedAttempts: warmupTelemetry.skippedAttempts,
          exhausted: warmupTelemetry.exhausted,
          labelKo: buildOfflineWarmupTelemetryLabelKo({
            appliedOfflineSec,
            autoBreakthroughWarmupRemainingSecBefore,
            autoBreakthroughWarmupRemainingSecAfter,
            autoSummary,
          }),
        },
        maxCollectedEvents,
      );
    }
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
      autoBreakthroughWarmupRemainingSecBefore,
      autoBreakthroughWarmupRemainingSecAfter,
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
      autoBreakthroughResumeWarmupSec: normalizeAutoBreakthroughResumeWarmupSec(
        parsed.settings?.autoBreakthroughResumeWarmupSec,
        DEFAULT_AUTO_BREAKTHROUGH_RESUME_WARMUP_SEC,
      ),
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
      autoBreakthroughWarmupUntilTimelineSec: toNonNegativeInt(
        parsed.realtimeStats?.autoBreakthroughWarmupUntilTimelineSec,
        0,
      ),
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
