import { World } from 'src/domain/world';
import { WalkResult } from 'src/game-master/walk-result';
import { ScriptCall } from './script-call';
import { Entity } from 'src/domain/entity';

/**
 * Warning: O(n^2)
 * Warning: Uses the same bounding box calculation as walk-entity.ts
 */
export function walkEntityToEntities(world: World, entity: Entity): WalkResult {
  const walkResult = new WalkResult(world);
  const collisionSecondaryEntityIds: number[] = [];
  const [left, right, top, bottom] = entity.calculateBoundingBox();
  for (const other of world.entities) {
    if (entity.id !== other.id) {
      const [leftOther, rightOther, topOther, bottomOther] = other.calculateBoundingBox();
      if (other.overlap(left, right, top, bottom)) {
        collisionSecondaryEntityIds.push(other.id);
        if (other.entityToEntityCollisionCall) {
          const call = new ScriptCall(
            other.entityToEntityCollisionCall,
            other.id,   // NOTE: "other" is primary because it is "other"'s script that runs.
            entity.id,  //       "entity" is secondary.
          );
          if (other.tryScriptCall(call, other.entityToEntityCollisionCallInterval)) {
            walkResult.addCall(call);
          }
        }
      }
    }
    entity.clearCallTimersNotInSecondaryEntityIds(collisionSecondaryEntityIds);
  }
  return walkResult;
}
