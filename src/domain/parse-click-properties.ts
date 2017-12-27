import { PointerType } from 'src/ui/pointer';

/**
 * Helps parse click-related properties of Entities and TileLayers.
 */
export function parseClickProperties(properties: any): [string, PointerType] {
  const use = properties['clickCall'] || properties['clickCall-use'] || null;
  if (use) {
    return [use, PointerType.Use];
  }

  const talk = properties['clickCall-talk'] || null;
  if (talk) {
    return [talk, PointerType.Talk];
  }

  const examine = properties['clickCall-examine'] || null;
  if (examine) {
    return [examine, PointerType.Examine];
  }

  return [null, PointerType.Default];
}
