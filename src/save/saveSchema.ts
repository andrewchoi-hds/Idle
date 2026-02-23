export type SaveWorld = "mortal" | "immortal" | "true";
export type EquipmentSlot = "weapon" | "armor" | "accessory" | "relic";

export interface SavePlayer {
  id: string;
  name: string;
  created_at: string;
}

export interface SaveProgression {
  difficulty_index: number;
  world: SaveWorld;
  major_stage_name: string;
  sub_stage_name: string;
  rebirth_count: number;
  unlocked_nodes: string[];
}

export interface SaveCurrencies {
  spirit_coin: number;
  rebirth_essence: number;
  qi: number;
}

export interface SaveInventoryItem {
  item_id: string;
  quantity: number;
  locked?: boolean;
}

export interface SaveMaterialItem {
  material_id: string;
  quantity: number;
}

export interface SaveInventory {
  items: SaveInventoryItem[];
  materials: SaveMaterialItem[];
}

export interface SaveEquipmentAffix {
  affix_id: string;
  value: number;
}

export interface SaveEquipmentInstance {
  instance_id: string;
  base_id: string;
  level: number;
  affixes: SaveEquipmentAffix[];
  locked_affix_indexes: number[];
}

export type SaveEquipmentSlotValue = SaveEquipmentInstance | null;

export interface SaveEquipment {
  slots: Record<EquipmentSlot, SaveEquipmentSlotValue>;
}

export interface SaveSettings {
  auto_battle: boolean;
  auto_skill: boolean;
  auto_breakthrough: boolean;
  auto_tribulation: boolean;
  battle_speed: 1 | 2 | 3;
}

export interface SaveMeta {
  quests_completed: string[];
  achievements_unlocked: string[];
  milestones_unlocked: string[];
}

export interface SaveTimestamps {
  last_login_epoch_ms: number;
  save_epoch_ms: number;
}

export interface SaveV1 {
  version: 1;
  player: SavePlayer;
  progression: SaveProgression;
  currencies: SaveCurrencies;
  inventory: SaveInventory;
  equipment: SaveEquipment;
  settings: SaveSettings;
  meta: SaveMeta;
  timestamps: SaveTimestamps;
}

export const SAVE_V1_VERSION = 1 as const;
export const SAVE_EQUIPMENT_SLOTS: EquipmentSlot[] = ["weapon", "armor", "accessory", "relic"];
