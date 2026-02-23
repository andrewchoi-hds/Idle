#!/usr/bin/env -S npx tsx
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  buildBalanceIndexes,
  loadBalanceTables,
} from "../src/balance/balanceLoader";
import { runSaveAutoProgressLoop } from "../src/progression/saveAutoProgressLoop";
import { validateSaveV2 } from "../src/save/validateSaveV2";

interface CliConfig {
  inputPath: string;
  outputPath: string;
  durationSec: number;
  tickSec: number;
  seed: number;
  battleIntervalSec: number;
  breakthroughCheckIntervalSec: number;
  maxEventLogs: number;
  statusPenaltyPct: number;
  defensiveSkillGuardPct: number;
  overrideDifficultyIndex: number | null;
  overrideQi: number | null;
  enableAutoBreakthrough: boolean;
  enableAutoTribulation: boolean;
  disableAutoBattle: boolean;
  breakthroughConsumableItemIds: string[];
  tribulationConsumableItemIds: string[];
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
  let outputPath = resolve(process.cwd(), "data/sim/save_v2_auto_progress_tick_ts_v1.json");
  let durationSec = 600;
  let tickSec = 1;
  let seed = 20260223;
  let battleIntervalSec = 18;
  let breakthroughCheckIntervalSec = 3;
  let maxEventLogs = 500;
  let statusPenaltyPct = 0;
  let defensiveSkillGuardPct = 0;
  let overrideDifficultyIndex: number | null = null;
  let overrideQi: number | null = null;
  let enableAutoBreakthrough = false;
  let enableAutoTribulation = false;
  let disableAutoBattle = false;
  const breakthroughConsumableItemIds: string[] = [];
  const tribulationConsumableItemIds: string[] = [];

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
    if (arg === "--duration-sec" && next) {
      durationSec = Math.max(1, parseIntArg(next, 600));
      i += 1;
      continue;
    }
    if (arg === "--tick-sec" && next) {
      tickSec = Math.max(1, parseIntArg(next, 1));
      i += 1;
      continue;
    }
    if (arg === "--seed" && next) {
      seed = parseIntArg(next, 20260223);
      i += 1;
      continue;
    }
    if (arg === "--battle-interval-sec" && next) {
      battleIntervalSec = Math.max(1, parseIntArg(next, 18));
      i += 1;
      continue;
    }
    if (arg === "--breakthrough-check-interval-sec" && next) {
      breakthroughCheckIntervalSec = Math.max(1, parseIntArg(next, 3));
      i += 1;
      continue;
    }
    if (arg === "--max-event-logs" && next) {
      maxEventLogs = Math.max(0, parseIntArg(next, 500));
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
    if (arg === "--override-difficulty-index" && next) {
      overrideDifficultyIndex = Math.max(1, parseIntArg(next, 1));
      i += 1;
      continue;
    }
    if (arg === "--override-qi" && next) {
      overrideQi = Math.max(0, parseIntArg(next, 0));
      i += 1;
      continue;
    }
    if (arg === "--enable-auto-breakthrough") {
      enableAutoBreakthrough = true;
      continue;
    }
    if (arg === "--enable-auto-tribulation") {
      enableAutoTribulation = true;
      continue;
    }
    if (arg === "--disable-auto-battle") {
      disableAutoBattle = true;
      continue;
    }
    if (arg === "--breakthrough-consumable" && next) {
      breakthroughConsumableItemIds.push(next);
      i += 1;
      continue;
    }
    if (arg === "--tribulation-consumable" && next) {
      tribulationConsumableItemIds.push(next);
      i += 1;
      continue;
    }
  }

  return {
    inputPath,
    outputPath,
    durationSec,
    tickSec,
    seed,
    battleIntervalSec,
    breakthroughCheckIntervalSec,
    maxEventLogs,
    statusPenaltyPct,
    defensiveSkillGuardPct,
    overrideDifficultyIndex,
    overrideQi,
    enableAutoBreakthrough,
    enableAutoTribulation,
    disableAutoBattle,
    breakthroughConsumableItemIds,
    tribulationConsumableItemIds,
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
  const validated = validateSaveV2(parsed);
  if (!validated.ok || !validated.value) {
    const msg = validated.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`invalid input save_v2 payload: ${msg}`);
  }

  const saveBefore = structuredClone(validated.value);
  if (cli.overrideDifficultyIndex !== null) {
    const row = indexes.progressionByDifficulty.get(cli.overrideDifficultyIndex);
    if (!row) {
      throw new Error(`invalid --override-difficulty-index: ${cli.overrideDifficultyIndex}`);
    }
    saveBefore.progression.difficulty_index = row.difficulty_index;
    saveBefore.progression.world = row.world;
    saveBefore.progression.major_stage_name = row.major_stage_name;
    saveBefore.progression.sub_stage_name = row.sub_stage_name;
    if (cli.overrideQi === null) {
      saveBefore.currencies.qi = row.qi_required;
    }
  }
  if (cli.overrideQi !== null) {
    saveBefore.currencies.qi = cli.overrideQi;
  }

  if (cli.enableAutoBreakthrough) {
    saveBefore.settings.auto_breakthrough = true;
  }
  if (cli.enableAutoTribulation) {
    saveBefore.settings.auto_tribulation = true;
  }
  if (cli.disableAutoBattle) {
    saveBefore.settings.auto_battle = false;
  }

  const result = runSaveAutoProgressLoop(tables, indexes, saveBefore, {
    durationSec: cli.durationSec,
    tickSec: cli.tickSec,
    rngSeed: cli.seed,
    battleIntervalSec: cli.battleIntervalSec,
    breakthroughCheckIntervalSec: cli.breakthroughCheckIntervalSec,
    maxEventLogs: cli.maxEventLogs,
    statusPenaltyPct: cli.statusPenaltyPct,
    defensiveSkillGuardPct: cli.defensiveSkillGuardPct,
    breakthroughConsumableItemIds: cli.breakthroughConsumableItemIds,
    tribulationConsumableItemIds: cli.tribulationConsumableItemIds,
  });

  const payload = {
    generated_at_utc: new Date().toISOString(),
    config: cli,
    summary: result.summary,
    warning_count: result.warnings.length,
    warnings: result.warnings,
    event_count: result.eventLogs.length,
    event_logs: result.eventLogs,
    save_after: result.save,
  };

  await writeFile(cli.outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  process.stdout.write(`wrote save auto progress report -> ${cli.outputPath}\n`);
  process.stdout.write(
    [
      `duration=${result.summary.durationSec}s`,
      `stage=${result.summary.finalDifficultyIndex}`,
      `qi_delta=${result.summary.qiDelta}`,
      `spirit_delta=${result.summary.spiritCoinDelta}`,
      `rebirth_delta=${result.summary.rebirthCountDelta}`,
      `break_attempts=${result.summary.breakthroughs.attempts}`,
    ].join(" | "),
  );
  process.stdout.write("\n");
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
