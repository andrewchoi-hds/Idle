import {
  MOBILE_MVP_STORAGE_KEY,
  buildSliceContext,
  cloneSliceState,
  createInitialSliceState,
  createSeededRng,
  getStage,
  getStageDisplayNameKo,
  parseSliceState,
  previewBreakthroughChance,
  runAutoSliceSeconds,
  runBattleOnce,
  runBreakthroughAttempt,
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
  optAutoBattle: document.getElementById("optAutoBattle"),
  optAutoBreakthrough: document.getElementById("optAutoBreakthrough"),
  optAutoTribulation: document.getElementById("optAutoTribulation"),
  useBreakthroughElixir: document.getElementById("useBreakthroughElixir"),
  useTribulationTalisman: document.getElementById("useTribulationTalisman"),
  playerNameInput: document.getElementById("playerNameInput"),
  lastSavedAt: document.getElementById("lastSavedAt"),
  savePayload: document.getElementById("savePayload"),
  btnBattle: document.getElementById("btnBattle"),
  btnBreakthrough: document.getElementById("btnBreakthrough"),
  btnAuto10s: document.getElementById("btnAuto10s"),
  btnResetRun: document.getElementById("btnResetRun"),
  btnSaveLocal: document.getElementById("btnSaveLocal"),
  btnLoadLocal: document.getElementById("btnLoadLocal"),
  btnExportState: document.getElementById("btnExportState"),
  btnImportState: document.getElementById("btnImportState"),
  eventLogList: document.getElementById("eventLogList"),
};

let context = null;
let state = null;
let rng = createSeededRng(Date.now());

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

function persistLocal() {
  try {
    window.localStorage.setItem(MOBILE_MVP_STORAGE_KEY, serializeSliceState(state));
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
  const stage = getStage(context, state.progression.difficultyIndex);
  const displayName = getStageDisplayNameKo(context, stage);
  const preview = previewBreakthroughChance(context, state, {
    useBreakthroughElixir: dom.useBreakthroughElixir.checked,
    useTribulationTalisman: dom.useTribulationTalisman.checked,
  });

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
  dom.playerNameInput.value = state.playerName;
  dom.lastSavedAt.textContent = state.lastSavedAtIso || "없음";

  const qiRatio = clampPercent((state.currencies.qi / stage.qi_required) * 100);
  dom.qiProgressBar.style.width = `${qiRatio}%`;

  dom.optAutoBattle.checked = state.settings.autoBattle;
  dom.optAutoBreakthrough.checked = state.settings.autoBreakthrough;
  dom.optAutoTribulation.checked = state.settings.autoTribulation;
  renderLogs();
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}

function bindEvents() {
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
    const summary = runAutoSliceSeconds(context, state, rng, {
      seconds: 10,
      battleEverySec: 2,
      breakthroughEverySec: 3,
      passiveQiRatio: 0.012,
    });
    setStatus(
      `자동 10초: 전투 ${summary.battles}회 · 돌파 ${summary.breakthroughs}회 · 환생 ${summary.rebirths}회`,
    );
    persistLocal();
    render();
  });

  dom.btnResetRun.addEventListener("click", () => {
    const confirmed = window.confirm("런을 초기화할까요? 현재 상태가 덮어써집니다.");
    if (!confirmed) return;
    state = createInitialSliceState(context, { playerName: state.playerName });
    setStatus("런 초기화 완료");
    persistLocal();
    render();
  });

  dom.btnSaveLocal.addEventListener("click", () => {
    updateLastSavedNow();
    persistLocal();
    render();
    setStatus("로컬 저장 완료");
  });

  dom.btnLoadLocal.addEventListener("click", () => {
    const raw = window.localStorage.getItem(MOBILE_MVP_STORAGE_KEY);
    if (!raw) {
      setStatus("로컬 저장 데이터가 없음", true);
      return;
    }
    try {
      state = parseSliceState(raw, context);
      addClientLog("save", "로컬 저장 데이터 불러오기 완료");
      render();
      setStatus("로컬 불러오기 완료");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "불러오기 실패", true);
    }
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
      const imported = parseSliceState(raw, context);
      state = cloneSliceState(imported);
      addClientLog("save", "JSON 가져오기 완료");
      persistLocal();
      render();
      setStatus("JSON 가져오기 완료");
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

    const raw = window.localStorage.getItem(MOBILE_MVP_STORAGE_KEY);
    if (raw) {
      try {
        state = parseSliceState(raw, context);
        addClientLog("save", "기존 로컬 세이브 자동 로드");
      } catch {
        addClientLog("error", "기존 로컬 세이브가 손상되어 새 상태로 시작");
      }
    }

    bindEvents();
    render();
    setStatus("준비 완료");
  } catch (err) {
    setStatus(err instanceof Error ? err.message : "초기화 실패", true);
  }
}

bootstrap();
