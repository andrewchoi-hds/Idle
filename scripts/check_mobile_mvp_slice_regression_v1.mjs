#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildSliceContext,
  createInitialSliceState,
  createSeededRng,
  parseSliceState,
  runAutoSliceSeconds,
  runBattleOnce,
  runBreakthroughAttempt,
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

  state.settings.autoBattle = true;
  state.settings.autoBreakthrough = true;
  state.settings.autoTribulation = true;
  state.currencies.qi = 50000;
  const auto = runAutoSliceSeconds(context, state, rng, {
    seconds: 10,
    battleEverySec: 2,
    breakthroughEverySec: 3,
  });
  checks.push({
    id: "auto_loop_runs_and_collects_events",
    passed:
      auto.seconds === 10 &&
      auto.battles > 0 &&
      auto.breakthroughs >= 0 &&
      state.logs.length > 0,
  });

  const serialized = serializeSliceState(state);
  const restored = parseSliceState(serialized, context);
  checks.push({
    id: "save_roundtrip_is_parseable",
    passed:
      restored.progression.difficultyIndex === state.progression.difficultyIndex &&
      restored.currencies.qi === state.currencies.qi &&
      restored.playerName === state.playerName,
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
