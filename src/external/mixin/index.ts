import { log } from 'src/log';

import {
  exit,
} from './global';

import {
  dragon,
  roomResident,
} from './testing';

/**
 * Should match order with the imports.
 */
const mixins: Map<string, EntityMixin> = [
  // global
  exit,
  // testing
  dragon,
  roomResident,
].reduce((map, mixin) => {
  map.set(mixin.mixinId, mixin);
  return map;
}, new Map<string, EntityMixin>());

interface EntityMixin {
  mixinId: string;
  properties: object;
}

/**
 * Merge each mixin, in order, then merge with entity properties.
 */
export function mergeMixins(givenProperties: any = {}): any {
  const combinedProperties = parseMixinNames(givenProperties.mixins).reduce((target, mixinName) => {
    const mixin = mixins.get(mixinName);
    if (mixin && mixin.properties) {
      return Object.assign(target, mixin.properties);
    }
    log('warn', `EntityMixin properties not found: ${mixinName}`);
    return target;
  }, {});
  return Object.assign(combinedProperties, givenProperties);
}

/**
 * Convert a string of space-delimited mixin names to an array.
 */
function parseMixinNames(raw: string): string[] {
  if (raw) {
    return raw.split(/ +/).map((name) => name.trim());
  } else {
    return [];
  }
}
