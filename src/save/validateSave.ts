import { SAVE_EQUIPMENT_SLOTS, type SaveV1, type SaveWorld } from "./saveSchema";

export interface SaveValidationError {
  path: string;
  message: string;
}

export interface SaveValidationResult {
  ok: boolean;
  errors: SaveValidationError[];
  value?: SaveV1;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function isBool(v: unknown): v is boolean {
  return typeof v === "boolean";
}

function pushError(errors: SaveValidationError[], path: string, message: string): void {
  errors.push({ path, message });
}

function validateStringArray(
  errors: SaveValidationError[],
  path: string,
  value: unknown,
): value is string[] {
  if (!Array.isArray(value)) {
    pushError(errors, path, "must be an array");
    return false;
  }
  let ok = true;
  for (let i = 0; i < value.length; i += 1) {
    if (!isString(value[i]) || value[i].length === 0) {
      pushError(errors, `${path}[${i}]`, "must be a non-empty string");
      ok = false;
    }
  }
  return ok;
}

function validateWorld(value: unknown): value is SaveWorld {
  return value === "mortal" || value === "immortal" || value === "true";
}

export function validateSaveV1(input: unknown): SaveValidationResult {
  const errors: SaveValidationError[] = [];

  if (!isObject(input)) {
    pushError(errors, "$", "save payload must be an object");
    return { ok: false, errors };
  }

  const root = input;

  if (root.version !== 1) {
    pushError(errors, "version", "must be 1");
  }

  if (!isObject(root.player)) {
    pushError(errors, "player", "must be an object");
  } else {
    const player = root.player;
    if (!isString(player.id) || player.id.length === 0) {
      pushError(errors, "player.id", "must be a non-empty string");
    }
    if (!isString(player.name) || player.name.length === 0 || player.name.length > 24) {
      pushError(errors, "player.name", "must be a non-empty string up to 24 chars");
    }
    if (!isString(player.created_at) || Number.isNaN(Date.parse(player.created_at))) {
      pushError(errors, "player.created_at", "must be an ISO date-time string");
    }
  }

  if (!isObject(root.progression)) {
    pushError(errors, "progression", "must be an object");
  } else {
    const p = root.progression;
    if (!Number.isInteger(p.difficulty_index) || (p.difficulty_index as number) < 1 || (p.difficulty_index as number) > 198) {
      pushError(errors, "progression.difficulty_index", "must be an integer in [1,198]");
    }
    if (!validateWorld(p.world)) {
      pushError(errors, "progression.world", "must be one of mortal|immortal|true");
    }
    if (!isString(p.major_stage_name) || p.major_stage_name.length === 0) {
      pushError(errors, "progression.major_stage_name", "must be a non-empty string");
    }
    if (!isString(p.sub_stage_name) || p.sub_stage_name.length === 0) {
      pushError(errors, "progression.sub_stage_name", "must be a non-empty string");
    }
    if (!Number.isInteger(p.rebirth_count) || (p.rebirth_count as number) < 0) {
      pushError(errors, "progression.rebirth_count", "must be a non-negative integer");
    }
    validateStringArray(errors, "progression.unlocked_nodes", p.unlocked_nodes);
  }

  if (!isObject(root.currencies)) {
    pushError(errors, "currencies", "must be an object");
  } else {
    const c = root.currencies;
    for (const key of ["spirit_coin", "rebirth_essence", "qi"] as const) {
      if (!isFiniteNumber(c[key]) || c[key] < 0) {
        pushError(errors, `currencies.${key}`, "must be a non-negative number");
      }
    }
  }

  if (!isObject(root.inventory)) {
    pushError(errors, "inventory", "must be an object");
  } else {
    const inv = root.inventory;

    if (!Array.isArray(inv.items)) {
      pushError(errors, "inventory.items", "must be an array");
    } else {
      for (let i = 0; i < inv.items.length; i += 1) {
        const item = inv.items[i];
        const path = `inventory.items[${i}]`;
        if (!isObject(item)) {
          pushError(errors, path, "must be an object");
          continue;
        }
        if (!isString(item.item_id) || item.item_id.length === 0) {
          pushError(errors, `${path}.item_id`, "must be a non-empty string");
        }
        if (!Number.isInteger(item.quantity) || (item.quantity as number) < 0) {
          pushError(errors, `${path}.quantity`, "must be a non-negative integer");
        }
        if (item.locked !== undefined && !isBool(item.locked)) {
          pushError(errors, `${path}.locked`, "must be a boolean if present");
        }
      }
    }

    if (!Array.isArray(inv.materials)) {
      pushError(errors, "inventory.materials", "must be an array");
    } else {
      for (let i = 0; i < inv.materials.length; i += 1) {
        const mat = inv.materials[i];
        const path = `inventory.materials[${i}]`;
        if (!isObject(mat)) {
          pushError(errors, path, "must be an object");
          continue;
        }
        if (!isString(mat.material_id) || mat.material_id.length === 0) {
          pushError(errors, `${path}.material_id`, "must be a non-empty string");
        }
        if (!Number.isInteger(mat.quantity) || (mat.quantity as number) < 0) {
          pushError(errors, `${path}.quantity`, "must be a non-negative integer");
        }
      }
    }
  }

  if (!isObject(root.equipment) || !isObject(root.equipment.slots)) {
    pushError(errors, "equipment.slots", "must be an object");
  } else {
    const slots = root.equipment.slots;
    for (const slot of SAVE_EQUIPMENT_SLOTS) {
      const value = slots[slot];
      const path = `equipment.slots.${slot}`;

      if (value === null) {
        continue;
      }
      if (!isObject(value)) {
        pushError(errors, path, "must be null or an object");
        continue;
      }
      if (!isString(value.instance_id) || value.instance_id.length === 0) {
        pushError(errors, `${path}.instance_id`, "must be a non-empty string");
      }
      if (!isString(value.base_id) || value.base_id.length === 0) {
        pushError(errors, `${path}.base_id`, "must be a non-empty string");
      }
      if (!Number.isInteger(value.level) || (value.level as number) < 1) {
        pushError(errors, `${path}.level`, "must be an integer >= 1");
      }

      if (!Array.isArray(value.affixes)) {
        pushError(errors, `${path}.affixes`, "must be an array");
      } else {
        if (value.affixes.length > 6) {
          pushError(errors, `${path}.affixes`, "must have at most 6 entries");
        }
        for (let i = 0; i < value.affixes.length; i += 1) {
          const aff = value.affixes[i];
          const affPath = `${path}.affixes[${i}]`;
          if (!isObject(aff)) {
            pushError(errors, affPath, "must be an object");
            continue;
          }
          if (!isString(aff.affix_id) || aff.affix_id.length === 0) {
            pushError(errors, `${affPath}.affix_id`, "must be a non-empty string");
          }
          if (!isFiniteNumber(aff.value)) {
            pushError(errors, `${affPath}.value`, "must be a finite number");
          }
        }
      }

      if (!Array.isArray(value.locked_affix_indexes)) {
        pushError(errors, `${path}.locked_affix_indexes`, "must be an array");
      } else {
        if (value.locked_affix_indexes.length > 3) {
          pushError(errors, `${path}.locked_affix_indexes`, "must have at most 3 entries");
        }
        for (let i = 0; i < value.locked_affix_indexes.length; i += 1) {
          const n = value.locked_affix_indexes[i];
          if (!Number.isInteger(n) || n < 0 || n > 5) {
            pushError(errors, `${path}.locked_affix_indexes[${i}]`, "must be integer in [0,5]");
          }
        }
      }
    }
  }

  if (!isObject(root.settings)) {
    pushError(errors, "settings", "must be an object");
  } else {
    const s = root.settings;
    for (const key of ["auto_battle", "auto_skill", "auto_breakthrough", "auto_tribulation"] as const) {
      if (!isBool(s[key])) {
        pushError(errors, `settings.${key}`, "must be a boolean");
      }
    }
    if (s.battle_speed !== 1 && s.battle_speed !== 2 && s.battle_speed !== 3) {
      pushError(errors, "settings.battle_speed", "must be 1, 2, or 3");
    }
  }

  if (!isObject(root.meta)) {
    pushError(errors, "meta", "must be an object");
  } else {
    validateStringArray(errors, "meta.quests_completed", root.meta.quests_completed);
    validateStringArray(errors, "meta.achievements_unlocked", root.meta.achievements_unlocked);
    validateStringArray(errors, "meta.milestones_unlocked", root.meta.milestones_unlocked);
  }

  if (!isObject(root.timestamps)) {
    pushError(errors, "timestamps", "must be an object");
  } else {
    for (const key of ["last_login_epoch_ms", "save_epoch_ms"] as const) {
      if (!Number.isInteger(root.timestamps[key]) || (root.timestamps[key] as number) < 0) {
        pushError(errors, `timestamps.${key}`, "must be a non-negative integer");
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors,
    value: root as unknown as SaveV1,
  };
}

export function assertValidSaveV1(input: unknown): SaveV1 {
  const result = validateSaveV1(input);
  if (!result.ok || !result.value) {
    const msg = result.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Invalid save payload: ${msg}`);
  }
  return result.value;
}
