#!/usr/bin/env -S npx tsx
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  buildBalanceIndexes,
  loadBalanceTables,
} from "../src/balance/balanceLoader";
import { applyBreakthroughStepToSaveV2 } from "../src/progression/saveBreakthroughRuntime";
import { validateSaveV2 } from "../src/save/validateSaveV2";

interface CliConfig {
  inputPath: string;
  outputPath: string;
  seed: number;
  forceAttempt: boolean;
  statusPenaltyPct: number;
  defensiveSkillGuardPct: number;
  rebirthLevels: {
    breakthrough_bonus?: number;
    tribulation_guard?: number;
    potion_mastery?: number;
  };
  consumableItemIds: string[];
}

function parseIntArg(raw: string, fallback: number): number {
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseFloatArg(raw: string, fallback: number): number {
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseArgs(argv: string[]): CliConfig {
  let inputPath = resolve(process.cwd(), "data/schema/save_v2.sample.json");
  let outputPath = resolve(
    process.cwd(),
    "data/sim/save_v2_breakthrough_step_ts_v1.json",
  );
  let seed = 20260223;
  let forceAttempt = false;
  let statusPenaltyPct = 0;
  let defensiveSkillGuardPct = 0;
  const consumableItemIds: string[] = [];
  const rebirthLevels: CliConfig["rebirthLevels"] = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--input" && next) {
      inputPath = resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (arg === "--output" && next) {
      outputPath = resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (arg === "--seed" && next) {
      seed = parseIntArg(next, 20260223);
      i += 1;
      continue;
    }
    if (arg === "--force-attempt") {
      forceAttempt = true;
      continue;
    }
    if (arg === "--status-penalty-pct" && next) {
      statusPenaltyPct = Math.max(0, parseFloatArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--defensive-guard-pct" && next) {
      defensiveSkillGuardPct = Math.max(0, parseFloatArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--rebirth-breakthrough-level" && next) {
      rebirthLevels.breakthrough_bonus = Math.max(0, parseIntArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--rebirth-guard-level" && next) {
      rebirthLevels.tribulation_guard = Math.max(0, parseIntArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--rebirth-potion-level" && next) {
      rebirthLevels.potion_mastery = Math.max(0, parseIntArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--consumable" && next) {
      consumableItemIds.push(next);
      i += 1;
      continue;
    }
  }

  return {
    inputPath,
    outputPath,
    seed,
    forceAttempt,
    statusPenaltyPct,
    defensiveSkillGuardPct,
    rebirthLevels,
    consumableItemIds,
  };
}

async function main(): Promise<void> {
  const cli = parseArgs(process.argv.slice(2));
  const [tables, saveRaw] = await Promise.all([
    loadBalanceTables(),
    readFile(cli.inputPath, "utf-8"),
  ]);
  const indexes = buildBalanceIndexes(tables);

  const parsed = JSON.parse(saveRaw) as unknown;
  const saveValidation = validateSaveV2(parsed);
  if (!saveValidation.ok || !saveValidation.value) {
    const msg = saveValidation.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`invalid input save_v2 payload: ${msg}`);
  }
  const saveBefore = saveValidation.value;

  const result = applyBreakthroughStepToSaveV2(tables, indexes, saveBefore, {
    rngSeed: cli.seed,
    forceAttempt: cli.forceAttempt,
    statusPenaltyPct: cli.statusPenaltyPct,
    defensiveSkillGuardPct: cli.defensiveSkillGuardPct,
    rebirthLevels: cli.rebirthLevels,
    consumableItemIds: cli.consumableItemIds,
    inferRebirthLevelsFromRebirthCount: true,
    consumeInventoryItems: true,
    bumpSaveTimestamp: true,
  });

  const payload = {
    generated_at_utc: new Date().toISOString(),
    config: cli,
    summary: {
      attempted: result.attempted,
      skipReason: result.skipReason,
      outcome: result.attemptResult?.outcome ?? null,
      difficultyBefore: result.stageBefore.difficultyIndex,
      difficultyAfter: result.stageAfter.difficultyIndex,
      stageBefore: result.stageBefore.stageNameKo,
      stageAfter: result.stageAfter.stageNameKo,
      qiBefore: saveBefore.currencies.qi,
      qiAfter: result.save.currencies.qi,
      breakthroughFailStreakBefore: saveBefore.pity_counters.breakthrough_fail_streak,
      breakthroughFailStreakAfter: result.save.pity_counters.breakthrough_fail_streak,
      tribulationFailStreakBefore: saveBefore.pity_counters.tribulation_fail_streak,
      tribulationFailStreakAfter: result.save.pity_counters.tribulation_fail_streak,
      rebirthCountBefore: saveBefore.progression.rebirth_count,
      rebirthCountAfter: result.save.progression.rebirth_count,
    },
    runtime: result,
    save_after: result.save,
  };

  await writeFile(cli.outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  process.stdout.write(`wrote save breakthrough step -> ${cli.outputPath}\n`);
  process.stdout.write(
    `attempted=${payload.summary.attempted} | outcome=${payload.summary.outcome ?? "none"} | diff=${payload.summary.difficultyBefore}->${payload.summary.difficultyAfter}\n`,
  );
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
