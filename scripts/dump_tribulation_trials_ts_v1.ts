#!/usr/bin/env -S npx tsx
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  buildBalanceIndexes,
  loadBalanceTables,
} from "../src/balance/balanceLoader";
import {
  runBreakthroughTrials,
  type BreakthroughTrialInput,
} from "../src/progression/tribulationEngine";

interface CliConfig {
  outputPath: string;
  difficultyIndexes: number[];
  trials: number;
  seed: number;
  currentQi: number | null;
  failStreak: number;
  statusPenaltyPct: number;
  defensiveSkillGuardPct: number;
  rebirthLevels: {
    breakthrough_bonus: number;
    tribulation_guard: number;
    potion_mastery: number;
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
  let outputPath = resolve(process.cwd(), "data/sim/tribulation_trials_ts_v1.json");
  const difficultyIndexes: number[] = [];
  let trials = 5000;
  let seed = 20260223;
  let currentQi: number | null = null;
  let failStreak = 0;
  let statusPenaltyPct = 0;
  let defensiveSkillGuardPct = 0;
  const consumableItemIds: string[] = [];

  let rebirthBreakthroughLevel = 0;
  let rebirthGuardLevel = 0;
  let rebirthPotionLevel = 0;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--difficulty-index" && next) {
      difficultyIndexes.push(parseIntArg(next, 13));
      i += 1;
      continue;
    }
    if (arg === "--trials" && next) {
      trials = Math.max(1, parseIntArg(next, 5000));
      i += 1;
      continue;
    }
    if (arg === "--seed" && next) {
      seed = parseIntArg(next, 20260223);
      i += 1;
      continue;
    }
    if (arg === "--output" && next) {
      outputPath = resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (arg === "--current-qi" && next) {
      currentQi = Math.max(0, parseIntArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--fail-streak" && next) {
      failStreak = Math.max(0, parseIntArg(next, 0));
      i += 1;
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
      rebirthBreakthroughLevel = Math.max(0, parseIntArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--rebirth-guard-level" && next) {
      rebirthGuardLevel = Math.max(0, parseIntArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--rebirth-potion-level" && next) {
      rebirthPotionLevel = Math.max(0, parseIntArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--consumable" && next) {
      consumableItemIds.push(next);
      i += 1;
      continue;
    }
  }

  if (difficultyIndexes.length === 0) {
    difficultyIndexes.push(13, 117, 190);
  }

  return {
    outputPath,
    difficultyIndexes,
    trials,
    seed,
    currentQi,
    failStreak,
    statusPenaltyPct,
    defensiveSkillGuardPct,
    rebirthLevels: {
      breakthrough_bonus: rebirthBreakthroughLevel,
      tribulation_guard: rebirthGuardLevel,
      potion_mastery: rebirthPotionLevel,
    },
    consumableItemIds,
  };
}

function round4(value: number): number {
  return Number(value.toFixed(4));
}

async function main(): Promise<void> {
  const cli = parseArgs(process.argv.slice(2));
  const tables = await loadBalanceTables();
  const indexes = buildBalanceIndexes(tables);

  const reports = cli.difficultyIndexes.map((difficultyIndex) => {
    const row = indexes.progressionByDifficulty.get(difficultyIndex);
    if (!row) {
      throw new Error(`Unknown difficulty_index: ${difficultyIndex}`);
    }

    const trialInput: BreakthroughTrialInput = {
      difficultyIndex,
      trials: cli.trials,
      seed: (cli.seed + difficultyIndex * 17) >>> 0,
      currentQi: cli.currentQi ?? row.qi_required * 2,
      failStreak: cli.failStreak,
      statusPenaltyPct: cli.statusPenaltyPct,
      defensiveSkillGuardPct: cli.defensiveSkillGuardPct,
      rebirthLevels: cli.rebirthLevels,
      consumableItemIds: cli.consumableItemIds,
    };
    const report = runBreakthroughTrials(tables, indexes, trialInput);

    return {
      difficultyIndex,
      stageNameKo: report.sample.stageNameKo,
      world: report.sample.world,
      isTribulation: report.sample.isTribulation,
      trials: report.config.trials,
      runtimeRates: {
        successPct: round4(report.sample.rates.successPct),
        deathPctOnFailure: round4(report.sample.rates.deathPct),
      },
      sampledRates: {
        blockedNoQi: round4(report.rates.blocked_no_qi),
        success: round4(report.rates.success),
        minorFail: round4(report.rates.minor_fail),
        retreatFail: round4(report.rates.retreat_fail),
        deathFail: round4(report.rates.death_fail),
      },
      avgRetreatLayersWhenRetreat: round4(report.avgRetreatLayersWhenRetreat),
      avgQiDelta: round4(report.avgQiDelta),
      failureWeights: report.sample.rates.failureWeights,
      consumables: report.sample.consumables,
      warnings: report.sample.warnings,
    };
  });

  const payload = {
    generated_at_utc: new Date().toISOString(),
    config: cli,
    reports,
  };

  await writeFile(cli.outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  process.stdout.write(`wrote tribulation trial report -> ${cli.outputPath}\n`);
  for (const row of reports) {
    process.stdout.write(
      [
        `${row.stageNameKo}(diff=${row.difficultyIndex})`,
        `success_rate=${row.sampledRates.success.toFixed(4)}`,
        `death_fail_rate=${row.sampledRates.deathFail.toFixed(4)}`,
        `retreat_fail_rate=${row.sampledRates.retreatFail.toFixed(4)}`,
      ].join(" | "),
    );
    process.stdout.write("\n");
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
