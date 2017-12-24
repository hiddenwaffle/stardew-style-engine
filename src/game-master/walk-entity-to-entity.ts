import { World } from 'src/domain/world';
import { ScriptCall } from './script-call';

/**
 * Warning: O(n^2)
 * Warning: Uses the same bounding box calculation as walk-entity.ts
 */
export function walkEntityToEntity(world: World) {
  const collisionSecondaryEntityIds: number[] = [];
  for (const entity of world.entities) {
    // Calculate bounding box -- center x to middle and y to bottom.
    const [left, right, top, bottom] = entity.calculateBoundingBox();

    for (const other of world.entities) {
      if (entity.id !== other.id) {
        const [leftOther, rightOther, topOther, bottomOther] = entity.calculateBoundingBox();
        if (other.overlap(left, right, top, bottom)) {
          collisionSecondaryEntityIds.push(other.id);
          if (entity.entityToEntityCollisionCall) {
            const call = new ScriptCall(
              entity.entityToEntityCollisionCall,
              entity.id,
              other.id,
            );
            if (entity.tryScriptCall(call, entity.entityToEntityCollisionCallInterval)) {
              call.execute(world);
            }
          }
        }
      }
    }
    entity.clearCallTimersNotInSecondaryEntityIds(collisionSecondaryEntityIds);
  }
}
