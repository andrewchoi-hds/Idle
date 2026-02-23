import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface RealmProgressionRow {
  difficulty_index: number;
  world: "mortal" | "immortal" | "true";
  world_index: number;
  major_stage_index: number;
  major_stage_name: string;
  sub_stage_index: number;
  sub_stage_name: string;
  phase: "early" | "mid" | "late" | "perfect" | "transcendent";
  is_tribulation: 0 | 1;
  qi_required: number;
  base_breakthrough_success_pct: number;
  base_death_pct: number;
  fail_retreat_min: number;
  fail_retreat_max: number;
  rebirth_score_weight: number;
  drop_rate_multiplier: number;
  offline_reward_multiplier: number;
}

export interface RealmLocaleKoRow {
  world: "mortal" | "immortal" | "true";
  world_ko: string;
  major_stage_name: string;
  major_stage_ko: string;
  sub_stage_name: string;
  sub_stage_ko: string;
  phase: "early" | "mid" | "late" | "perfect" | "transcendent";
  phase_ko: string;
  display_name_ko: string;
}

export interface RebirthUpgradeRow {
  branch:
    | "cultivation_speed"
    | "breakthrough_bonus"
    | "tribulation_guard"
    | "potion_mastery"
    | "offline_efficiency";
  level: number;
  cost_rebirth_essence: number;
  effect_type: "mul_pct" | "flat_pct";
  effect_value: number;
}

export interface CombatConstantRow {
  key: string;
  value: string;
  note: string;
}

export interface PotionTalismanRow {
  item_id: string;
  item_type: "potion" | "talisman";
  name_ko: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  effect_type: string;
  effect_value: string;
  duration_sec: string;
  consumption_timing: string;
  stack_limit: string;
  craft_tier: string;
  main_materials: string;
  note: string;
}

export interface SkillRow {
  skill_id: string;
  category: "active" | "passive" | "ultimate" | "tribulation";
  name_ko: string;
  grade: "common" | "rare" | "epic" | "legendary";
  world_unlock: "mortal" | "immortal" | "true";
  unlock_difficulty_index: string;
  cost_mp: string;
  cooldown_sec: string;
  targeting: string;
  damage_coeff: string;
  scaling_stat: string;
  element: string;
  status_effect: string;
  status_chance_pct: string;
  status_duration_sec: string;
  defense_ignore_pct: string;
  shield_coeff: string;
  heal_coeff: string;
  note: string;
}

export interface MonsterRow {
  monster_id: string;
  name_ko: string;
  world: "mortal" | "immortal" | "true";
  zone: string;
  type: "normal" | "elite" | "boss";
  element: string;
  tier: string;
  hp_mult: string;
  atk_mult: string;
  def_mult: string;
  speed_mult: string;
  crit_rate: string;
  evasion: string;
  drop_group: string;
  rebirth_essence_drop: string;
  ai_pattern: string;
  special_mechanic: string;
  note: string;
}

export interface MapNodeRow {
  node_id: string;
  world: "mortal" | "immortal" | "true";
  zone_id: string;
  zone_name_ko: string;
  node_type: "hunt" | "elite" | "boss" | "event" | "gather" | "tribulation";
  node_name_ko: string;
  recommended_difficulty_min: string;
  recommended_difficulty_max: string;
  stamina_cost: string;
  encounter_weight: string;
  unlock_condition: string;
  drop_group: string;
  event_table: string;
  boss_id: string;
  special_rule: string;
}

export interface MapEventRow {
  event_id: string;
  event_table: string;
  world: "mortal" | "immortal" | "true";
  event_name_ko: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  trigger_weight: string;
  effect_type: string;
  effect_value: string;
  duration_sec: string;
  risk_type: string;
  risk_value: string;
  reward_group: string;
  note: string;
}

export interface DropPoolRow {
  drop_group: string;
  item_ref: string;
  item_type: "material" | "item" | "currency";
  weight: string;
  min_qty: string;
  max_qty: string;
  unlock_condition: string;
  note: string;
}

export interface StatGrowthCoeffRow {
  stat_id: string;
  base_value: string;
  per_player_level: string;
  per_major_stage: string;
  per_sub_stage: string;
  equipment_scale_pct: string;
  rebirth_scale_pct: string;
  buff_scale_pct: string;
  hard_cap: string;
  soft_cap_start: string;
  soft_cap_slope: string;
  note: string;
}

export interface OptionUnlockRow {
  option_id: string;
  name_ko: string;
  category: "automation" | "qol" | "accessibility" | "safety";
  default_state: "on" | "off";
  unlock_condition_type: string;
  unlock_condition_value: string;
  requires_resource: "yes" | "no";
  cost_value: string;
  safe_guard: "low" | "medium" | "high" | "critical";
  description: string;
}

export interface QuestRow {
  quest_id: string;
  quest_type: "main" | "daily" | "weekly" | "side";
  name_ko: string;
  world: "mortal" | "immortal" | "true" | "daily" | "weekly";
  recommended_difficulty_min: string;
  recommended_difficulty_max: string;
  objective_type: string;
  objective_value: string;
  reward_primary_type: string;
  reward_primary_value: string;
  reward_secondary_type: string;
  reward_secondary_value: string;
  reward_item_ref: string;
  repeatable: "yes" | "no";
  unlock_condition: string;
  note: string;
}

export interface AchievementRow {
  achievement_id: string;
  category: "realm" | "battle" | "growth" | "hidden";
  name_ko: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "mythic" | "legend";
  condition_type: string;
  condition_value: string;
  reward_type: string;
  reward_value: string;
  reward_item_ref: string;
  is_hidden: "yes" | "no";
  note: string;
}

export interface MilestoneRow {
  milestone_id: string;
  track: "progress" | "rebirth" | "tribulation" | "collection" | "economy";
  name_ko: string;
  trigger_type: string;
  trigger_value: string;
  reward_type: string;
  reward_value: string;
  reward_item_ref: string;
  persistent: "yes" | "no";
  unlock_condition: string;
  note: string;
}

export interface ShopCatalogRow {
  shop_id: string;
  shop_name_ko: string;
  tab: "consumable" | "material" | "currency" | "upgrade" | "service";
  item_ref: string;
  item_type: "item" | "material" | "pack" | "service";
  currency_type: "spirit_coin" | "rebirth_essence";
  price: string;
  stock_type: "daily" | "weekly" | "unlimited";
  stock_value: string;
  refresh_rule: string;
  unlock_condition: string;
  note: string;
}

export interface CurrencySinkRow {
  sink_id: string;
  sink_name_ko: string;
  feature: string;
  currency_type: "spirit_coin" | "rebirth_essence";
  base_cost: string;
  cost_growth_formula: string;
  max_level: string;
  expected_weekly_spend: string;
  unlock_condition: string;
  priority: "low" | "medium" | "high" | "critical";
  note: string;
}

export interface EquipmentBaseRow {
  base_id: string;
  name_ko: string;
  slot: "weapon" | "armor" | "accessory" | "relic";
  rarity: "common" | "rare" | "epic" | "legendary";
  world: "mortal" | "immortal" | "true";
  tier: string;
  recommended_difficulty_min: string;
  recommended_difficulty_max: string;
  base_hp: string;
  base_mp: string;
  base_atk: string;
  base_def: string;
  base_speed: string;
  socket_count: string;
  salvage_value: string;
  unlock_condition: string;
  note: string;
}

export interface EquipmentAffixRow {
  affix_id: string;
  name_ko: string;
  affix_type: "prefix" | "suffix";
  rarity: "common" | "rare" | "epic" | "legendary";
  target_slots: string;
  stat_key: string;
  roll_min: string;
  roll_max: string;
  weight: string;
  unlock_condition: string;
  exclusive_group: string;
  note: string;
}

export interface EquipmentRollRuleRow {
  rule_id: string;
  rule_name_ko: string;
  target_rarity: string;
  max_prefix: string;
  max_suffix: string;
  allow_duplicate_exclusive: "yes" | "no";
  roll_value_distribution: string;
  lock_cost_currency: string;
  lock_cost_base: string;
  reroll_cost_currency: string;
  reroll_cost_base: string;
  pity_rule: string;
  note: string;
}

export interface EquipmentBasePoolRow {
  pool_id: string;
  world: "mortal" | "immortal" | "true";
  group_name: string;
  target_slot: "weapon" | "armor" | "accessory" | "relic";
  base_ids: string;
  weight_mode: string;
  unlock_condition: string;
  note: string;
}

export interface EquipmentAffixPoolRow {
  profile_id: string;
  world: "mortal" | "immortal" | "true";
  node_type_group: "hunt" | "elite" | "boss" | "event" | "tribulation";
  rarity_floor: "common" | "rare" | "epic" | "legendary";
  rarity_ceiling: "common" | "rare" | "epic" | "legendary";
  prefix_affix_ids: string;
  suffix_affix_ids: string;
  prefix_count_min: string;
  prefix_count_max: string;
  suffix_count_min: string;
  suffix_count_max: string;
  roll_rule_id: string;
  unlock_condition: string;
  note: string;
}

export interface EquipmentDropLinkRow {
  link_id: string;
  node_id: string;
  world: "mortal" | "immortal" | "true";
  node_type: "hunt" | "elite" | "boss" | "event" | "tribulation";
  weapon_pool: string;
  armor_pool: string;
  accessory_pool: string;
  relic_pool: string;
  affix_profile_id: string;
  equip_drop_chance_pct: string;
  min_equip_qty: string;
  max_equip_qty: string;
  guaranteed_rarity_floor: "common" | "rare" | "epic" | "legendary";
  unlock_condition: string;
  note: string;
}

export interface TribulationFailureWeightRow {
  difficulty_index: number;
  world: "mortal" | "immortal" | "true";
  major_stage_name: string;
  sub_stage_name: string;
  phase: "early" | "mid" | "late" | "perfect" | "transcendent";
  weight_minor_fail: number;
  weight_retreat_fail: number;
  weight_death_fail: number;
  sum_weight: number;
  retreat_min_layers: number;
  retreat_max_layers: number;
}

export interface BalanceExportManifestV1 {
  generator: string;
  version: string;
  generated_at_utc: string;
  economy_profile: "base" | "tuned";
  economy_sources: {
    shop_catalog_csv: string;
    currency_sinks_csv: string;
  };
}

export type EconomyProfile = "base" | "tuned";
export type EconomyProfileState = EconomyProfile | "unknown";

export interface EconomyProfileInfo {
  profile: EconomyProfileState;
  generatedAtUtc: string | null;
  shopCatalogSource: string | null;
  currencySinksSource: string | null;
}

export interface EconomyProfileGuardOptions {
  allowUnknown?: boolean;
  context?: string;
}

export interface BalanceTables {
  progression: RealmProgressionRow[];
  localeKo: RealmLocaleKoRow[];
  rebirthUpgrades: RebirthUpgradeRow[];
  combatConstants: CombatConstantRow[];
  potionTalismans: PotionTalismanRow[];
  skills: SkillRow[];
  monsters: MonsterRow[];
  mapNodes: MapNodeRow[];
  mapEvents: MapEventRow[];
  dropPools: DropPoolRow[];
  statGrowthCoeffs: StatGrowthCoeffRow[];
  optionUnlocks: OptionUnlockRow[];
  quests: QuestRow[];
  achievements: AchievementRow[];
  milestones: MilestoneRow[];
  shopCatalog: ShopCatalogRow[];
  currencySinks: CurrencySinkRow[];
  equipmentBases: EquipmentBaseRow[];
  equipmentAffixes: EquipmentAffixRow[];
  equipmentRollRules: EquipmentRollRuleRow[];
  equipmentBasePools: EquipmentBasePoolRow[];
  equipmentAffixPools: EquipmentAffixPoolRow[];
  equipmentDropLinks: EquipmentDropLinkRow[];
  tribulationFailureWeights: TribulationFailureWeightRow[];
  manifest: BalanceExportManifestV1 | null;
}

export interface BalanceIndexes {
  progressionByDifficulty: Map<number, RealmProgressionRow>;
  localeKoByStageKey: Map<string, RealmLocaleKoRow>;
  rebirthUpgradeByBranchLevel: Map<string, RebirthUpgradeRow>;
  combatConstantByKey: Map<string, CombatConstantRow>;
  potionTalismanById: Map<string, PotionTalismanRow>;
  skillById: Map<string, SkillRow>;
  monsterById: Map<string, MonsterRow>;
  mapNodeById: Map<string, MapNodeRow>;
  mapEventsByTable: Map<string, MapEventRow[]>;
  dropPoolByGroup: Map<string, DropPoolRow[]>;
  statGrowthByStatId: Map<string, StatGrowthCoeffRow>;
  optionUnlockById: Map<string, OptionUnlockRow>;
  questById: Map<string, QuestRow>;
  achievementById: Map<string, AchievementRow>;
  milestoneById: Map<string, MilestoneRow>;
  shopById: Map<string, ShopCatalogRow[]>;
  currencySinkById: Map<string, CurrencySinkRow>;
  equipmentBaseById: Map<string, EquipmentBaseRow>;
  equipmentAffixById: Map<string, EquipmentAffixRow>;
  equipmentAffixesBySlot: Map<string, EquipmentAffixRow[]>;
  equipmentRollRuleById: Map<string, EquipmentRollRuleRow>;
  equipmentBasePoolById: Map<string, EquipmentBasePoolRow>;
  equipmentAffixPoolById: Map<string, EquipmentAffixPoolRow>;
  equipmentDropLinkByNodeId: Map<string, EquipmentDropLinkRow>;
  tribulationFailureByDifficulty: Map<number, TribulationFailureWeightRow>;
}

export function stageKey(
  world: RealmProgressionRow["world"],
  majorStageName: string,
  subStageName: string,
): string {
  return `${world}:${majorStageName}:${subStageName}`;
}

export function branchLevelKey(branch: string, level: number): string {
  return `${branch}:${level}`;
}

async function readJsonFile<T>(path: string): Promise<T> {
  const raw = await readFile(path, "utf-8");
  return JSON.parse(raw) as T;
}

async function readJsonFileOrNull<T>(path: string): Promise<T | null> {
  try {
    return await readJsonFile<T>(path);
  } catch (err) {
    const maybeErr = err as { code?: string };
    if (maybeErr.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

export async function loadBalanceTables(
  exportDir = resolve(process.cwd(), "data/export"),
): Promise<BalanceTables> {
  const [
    progression,
    localeKo,
    rebirthUpgrades,
    combatConstants,
    potionTalismans,
    skills,
    monsters,
    mapNodes,
    mapEvents,
    dropPools,
    statGrowthCoeffs,
    optionUnlocks,
    quests,
    achievements,
    milestones,
    shopCatalog,
    currencySinks,
    equipmentBases,
    equipmentAffixes,
    equipmentRollRules,
    equipmentBasePools,
    equipmentAffixPools,
    equipmentDropLinks,
    tribulationFailureWeights,
    manifest,
  ] = await Promise.all([
    readJsonFile<RealmProgressionRow[]>(
      resolve(exportDir, "realm_progression_v1.json"),
    ),
    readJsonFile<RealmLocaleKoRow[]>(resolve(exportDir, "realm_locale_ko_v1.json")),
    readJsonFile<RebirthUpgradeRow[]>(
      resolve(exportDir, "rebirth_upgrades_v1.json"),
    ),
    readJsonFile<CombatConstantRow[]>(
      resolve(exportDir, "combat_constants_v1.json"),
    ),
    readJsonFile<PotionTalismanRow[]>(
      resolve(exportDir, "potions_talismans_v1.json"),
    ),
    readJsonFile<SkillRow[]>(resolve(exportDir, "skills_v1.json")),
    readJsonFile<MonsterRow[]>(resolve(exportDir, "monsters_v1.json")),
    readJsonFile<MapNodeRow[]>(resolve(exportDir, "map_nodes_v1.json")),
    readJsonFile<MapEventRow[]>(resolve(exportDir, "map_events_v1.json")),
    readJsonFile<DropPoolRow[]>(resolve(exportDir, "drop_pools_v1.json")),
    readJsonFile<StatGrowthCoeffRow[]>(
      resolve(exportDir, "stat_growth_coeffs_v1.json"),
    ),
    readJsonFile<OptionUnlockRow[]>(resolve(exportDir, "options_unlocks_v1.json")),
    readJsonFile<QuestRow[]>(resolve(exportDir, "quests_v1.json")),
    readJsonFile<AchievementRow[]>(resolve(exportDir, "achievements_v1.json")),
    readJsonFile<MilestoneRow[]>(resolve(exportDir, "milestones_v1.json")),
    readJsonFile<ShopCatalogRow[]>(resolve(exportDir, "shop_catalog_v1.json")),
    readJsonFile<CurrencySinkRow[]>(resolve(exportDir, "currency_sinks_v1.json")),
    readJsonFile<EquipmentBaseRow[]>(resolve(exportDir, "equipment_bases_v1.json")),
    readJsonFile<EquipmentAffixRow[]>(resolve(exportDir, "equipment_affixes_v1.json")),
    readJsonFile<EquipmentRollRuleRow[]>(
      resolve(exportDir, "equipment_roll_rules_v1.json"),
    ),
    readJsonFile<EquipmentBasePoolRow[]>(
      resolve(exportDir, "equipment_base_pools_v1.json"),
    ),
    readJsonFile<EquipmentAffixPoolRow[]>(
      resolve(exportDir, "equipment_affix_pools_v1.json"),
    ),
    readJsonFile<EquipmentDropLinkRow[]>(
      resolve(exportDir, "equipment_drop_links_v1.json"),
    ),
    readJsonFile<TribulationFailureWeightRow[]>(
      resolve(exportDir, "tribulation_failure_weights_v1.json"),
    ),
    readJsonFileOrNull<BalanceExportManifestV1>(
      resolve(exportDir, "balance_manifest_v1.json"),
    ),
  ]);

  return {
    progression,
    localeKo,
    rebirthUpgrades,
    combatConstants,
    potionTalismans,
    skills,
    monsters,
    mapNodes,
    mapEvents,
    dropPools,
    statGrowthCoeffs,
    optionUnlocks,
    quests,
    achievements,
    milestones,
    shopCatalog,
    currencySinks,
    equipmentBases,
    equipmentAffixes,
    equipmentRollRules,
    equipmentBasePools,
    equipmentAffixPools,
    equipmentDropLinks,
    tribulationFailureWeights,
    manifest,
  };
}

export function buildBalanceIndexes(tables: BalanceTables): BalanceIndexes {
  const progressionByDifficulty = new Map<number, RealmProgressionRow>();
  const localeKoByStageKey = new Map<string, RealmLocaleKoRow>();
  const rebirthUpgradeByBranchLevel = new Map<string, RebirthUpgradeRow>();
  const combatConstantByKey = new Map<string, CombatConstantRow>();
  const potionTalismanById = new Map<string, PotionTalismanRow>();
  const skillById = new Map<string, SkillRow>();
  const monsterById = new Map<string, MonsterRow>();
  const mapNodeById = new Map<string, MapNodeRow>();
  const mapEventsByTable = new Map<string, MapEventRow[]>();
  const dropPoolByGroup = new Map<string, DropPoolRow[]>();
  const statGrowthByStatId = new Map<string, StatGrowthCoeffRow>();
  const optionUnlockById = new Map<string, OptionUnlockRow>();
  const questById = new Map<string, QuestRow>();
  const achievementById = new Map<string, AchievementRow>();
  const milestoneById = new Map<string, MilestoneRow>();
  const shopById = new Map<string, ShopCatalogRow[]>();
  const currencySinkById = new Map<string, CurrencySinkRow>();
  const equipmentBaseById = new Map<string, EquipmentBaseRow>();
  const equipmentAffixById = new Map<string, EquipmentAffixRow>();
  const equipmentAffixesBySlot = new Map<string, EquipmentAffixRow[]>();
  const equipmentRollRuleById = new Map<string, EquipmentRollRuleRow>();
  const equipmentBasePoolById = new Map<string, EquipmentBasePoolRow>();
  const equipmentAffixPoolById = new Map<string, EquipmentAffixPoolRow>();
  const equipmentDropLinkByNodeId = new Map<string, EquipmentDropLinkRow>();
  const tribulationFailureByDifficulty = new Map<number, TribulationFailureWeightRow>();

  for (const row of tables.progression) {
    progressionByDifficulty.set(row.difficulty_index, row);
  }
  for (const row of tables.localeKo) {
    localeKoByStageKey.set(stageKey(row.world, row.major_stage_name, row.sub_stage_name), row);
  }
  for (const row of tables.rebirthUpgrades) {
    rebirthUpgradeByBranchLevel.set(branchLevelKey(row.branch, row.level), row);
  }
  for (const row of tables.combatConstants) {
    combatConstantByKey.set(row.key, row);
  }
  for (const row of tables.potionTalismans) {
    potionTalismanById.set(row.item_id, row);
  }
  for (const row of tables.skills) {
    skillById.set(row.skill_id, row);
  }
  for (const row of tables.monsters) {
    monsterById.set(row.monster_id, row);
  }
  for (const row of tables.mapNodes) {
    mapNodeById.set(row.node_id, row);
  }
  for (const row of tables.mapEvents) {
    const bucket = mapEventsByTable.get(row.event_table) ?? [];
    bucket.push(row);
    mapEventsByTable.set(row.event_table, bucket);
  }
  for (const row of tables.dropPools) {
    const bucket = dropPoolByGroup.get(row.drop_group) ?? [];
    bucket.push(row);
    dropPoolByGroup.set(row.drop_group, bucket);
  }
  for (const row of tables.statGrowthCoeffs) {
    statGrowthByStatId.set(row.stat_id, row);
  }
  for (const row of tables.optionUnlocks) {
    optionUnlockById.set(row.option_id, row);
  }
  for (const row of tables.quests) {
    questById.set(row.quest_id, row);
  }
  for (const row of tables.achievements) {
    achievementById.set(row.achievement_id, row);
  }
  for (const row of tables.milestones) {
    milestoneById.set(row.milestone_id, row);
  }
  for (const row of tables.shopCatalog) {
    const bucket = shopById.get(row.shop_id) ?? [];
    bucket.push(row);
    shopById.set(row.shop_id, bucket);
  }
  for (const row of tables.currencySinks) {
    currencySinkById.set(row.sink_id, row);
  }
  for (const row of tables.equipmentBases) {
    equipmentBaseById.set(row.base_id, row);
  }
  for (const row of tables.equipmentAffixes) {
    equipmentAffixById.set(row.affix_id, row);
    const slots = row.target_slots.split(";").map((v) => v.trim());
    for (const slot of slots) {
      const bucket = equipmentAffixesBySlot.get(slot) ?? [];
      bucket.push(row);
      equipmentAffixesBySlot.set(slot, bucket);
    }
  }
  for (const row of tables.equipmentRollRules) {
    equipmentRollRuleById.set(row.rule_id, row);
  }
  for (const row of tables.equipmentBasePools) {
    equipmentBasePoolById.set(row.pool_id, row);
  }
  for (const row of tables.equipmentAffixPools) {
    equipmentAffixPoolById.set(row.profile_id, row);
  }
  for (const row of tables.equipmentDropLinks) {
    equipmentDropLinkByNodeId.set(row.node_id, row);
  }
  for (const row of tables.tribulationFailureWeights) {
    tribulationFailureByDifficulty.set(row.difficulty_index, row);
  }

  return {
    progressionByDifficulty,
    localeKoByStageKey,
    rebirthUpgradeByBranchLevel,
    combatConstantByKey,
    potionTalismanById,
    skillById,
    monsterById,
    mapNodeById,
    mapEventsByTable,
    dropPoolByGroup,
    statGrowthByStatId,
    optionUnlockById,
    questById,
    achievementById,
    milestoneById,
    shopById,
    currencySinkById,
    equipmentBaseById,
    equipmentAffixById,
    equipmentAffixesBySlot,
    equipmentRollRuleById,
    equipmentBasePoolById,
    equipmentAffixPoolById,
    equipmentDropLinkByNodeId,
    tribulationFailureByDifficulty,
  };
}

export function getCombatConstantNumber(
  indexes: BalanceIndexes,
  key: string,
  fallback?: number,
): number {
  const row = indexes.combatConstantByKey.get(key);
  if (!row) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing combat constant: ${key}`);
  }
  const value = Number(row.value);
  if (!Number.isFinite(value)) {
    throw new Error(`Combat constant is not numeric: ${key}=${row.value}`);
  }
  return value;
}

export function getStageDisplayNameKo(
  indexes: BalanceIndexes,
  world: RealmProgressionRow["world"],
  majorStageName: string,
  subStageName: string,
): string {
  const row = indexes.localeKoByStageKey.get(
    stageKey(world, majorStageName, subStageName),
  );
  return row ? row.display_name_ko : `${world}:${majorStageName}:${subStageName}`;
}

function isEconomyProfile(value: unknown): value is EconomyProfile {
  return value === "base" || value === "tuned";
}

export function getEconomyProfileState(
  tables: Pick<BalanceTables, "manifest">,
): EconomyProfileState {
  const raw = tables.manifest?.economy_profile;
  return isEconomyProfile(raw) ? raw : "unknown";
}

export function getEconomyProfileInfo(
  tables: Pick<BalanceTables, "manifest">,
): EconomyProfileInfo {
  const profile = getEconomyProfileState(tables);
  const manifest = tables.manifest;
  return {
    profile,
    generatedAtUtc: manifest?.generated_at_utc ?? null,
    shopCatalogSource: manifest?.economy_sources.shop_catalog_csv ?? null,
    currencySinksSource: manifest?.economy_sources.currency_sinks_csv ?? null,
  };
}

export function getEconomyProfileSummary(
  tables: Pick<BalanceTables, "manifest">,
): string {
  const info = getEconomyProfileInfo(tables);
  if (info.profile === "unknown") {
    return "economy_profile=unknown (balance_manifest_v1.json missing)";
  }

  return [
    `economy_profile=${info.profile}`,
    `generated_at_utc=${info.generatedAtUtc ?? "unknown"}`,
    `shop_source=${info.shopCatalogSource ?? "unknown"}`,
    `sink_source=${info.currencySinksSource ?? "unknown"}`,
  ].join(" | ");
}

export function assertEconomyProfile(
  tables: Pick<BalanceTables, "manifest">,
  expected: EconomyProfile,
  options: EconomyProfileGuardOptions = {},
): void {
  const actual = getEconomyProfileState(tables);
  if (actual === expected) {
    return;
  }
  if (actual === "unknown" && options.allowUnknown) {
    return;
  }

  const context = options.context ?? "balance export";
  const actualLabel = actual === "unknown" ? "unknown(no manifest)" : actual;
  throw new Error(
    [
      `Economy profile mismatch`,
      `context=${context}`,
      `expected=${expected}`,
      `actual=${actualLabel}`,
      "regenerate with scripts/generate_balance_tables.py --economy-profile base|tuned",
    ].join(" | "),
  );
}
