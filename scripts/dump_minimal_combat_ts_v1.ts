#!/usr/bin/env -S npx tsx
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  buildBalanceIndexes,
  loadBalanceTables,
} from "../src/balance/balanceLoader";
import {
  type MinimalCombatConfig,
  runMinimalCombatLoop,
} from "../src/combat/minimalCombatLoop";

interface CliConfig {
  outputPath: string;
  includeActionLogs: boolean;
  config: MinimalCombatConfig;
}

function parseIntArg(raw: string, fallback: number): number {
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseArgs(argv: string[]): CliConfig {
  const config: MinimalCombatConfig = {};
  let outputPath = resolve(process.cwd(), "data/sim/minimal_combat_report_ts_v1.json");
  let includeActionLogs = true;
  const skillIds: string[] = [];
  const monsterIds: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--difficulty-index" && next) {
      config.difficultyIndex = parseIntArg(next, 20);
      i += 1;
      continue;
    }
    if (arg === "--player-level" && next) {
      config.playerLevel = parseIntArg(next, 30);
      i += 1;
      continue;
    }
    if (arg === "--rebirth-count" && next) {
      config.rebirthCount = parseIntArg(next, 2);
      i += 1;
      continue;
    }
    if (arg === "--seed" && next) {
      config.rngSeed = parseIntArg(next, 20260223);
      i += 1;
      continue;
    }
    if (arg === "--max-turns" && next) {
      config.maxTurnsPerBattle = parseIntArg(next, 180);
      i += 1;
      continue;
    }
    if (arg === "--skill-id" && next) {
      skillIds.push(next);
      i += 1;
      continue;
    }
    if (arg === "--monster-id" && next) {
      monsterIds.push(next);
      i += 1;
      continue;
    }
    if (arg === "--output" && next) {
      outputPath = resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (arg === "--no-action-log") {
      includeActionLogs = false;
      continue;
    }
  }

  if (skillIds.length > 0) {
    config.skillIds = skillIds;
  }
  if (monsterIds.length > 0) {
    config.monsterIds = monsterIds;
  }
  config.includeActionLogs = includeActionLogs;

  return {
    outputPath,
    includeActionLogs,
    config,
  };
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));
  const tables = await loadBalanceTables();
  const indexes = buildBalanceIndexes(tables);
  const report = runMinimalCombatLoop(tables, indexes, parsed.config);
  await writeFile(parsed.outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf-8");
  process.stdout.write(`wrote combat report json -> ${parsed.outputPath}\n`);
  process.stdout.write(
    `summary: win_rate=${report.summary.winRate.toFixed(4)}, avg_turns=${report.summary.avgTurns}, avg_elapsed_sec=${report.summary.avgElapsedSec}\n`,
  );
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
