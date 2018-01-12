import { World } from 'src/domain/world';
import { WalkResult } from 'src/game-master/walk-result';
import { ScriptCall } from './script-call';
import { Entity } from 'src/domain/entity';
import { OverlapType } from 'src/domain/overlap-type';

/**
 * Warning: O(n^2)
 * Warning: Uses the same bounding box calculation as walk-entity.ts
 */
export function walkEntityToEntities(world: World, entity: Entity): WalkResult {
  const walkResult = new WalkResult(world);
  const collisionOtherEntityIds: number[] = [];
  const [left, right, top, bottom] = entity.calculateBoundingBox();
  for (const other of world.entities) {
    if (entity.id !== other.id) {
      const [leftOther, rightOther, topOther, bottomOther] = other.calculateBoundingBox();
      if (other.overlap(left, right, top, bottom)) {
        // Check if eclipse is required to count as a collision.
        if (other.entityToEntityCollisionOverlapType === OverlapType.Eclipse &&
            !other.eclipse(left, right, top, bottom, 0.75)) { // 75% is the highest recommended.
          continue;
        }

        collisionOtherEntityIds.push(other.id);
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
  }
  entity.clearCallTimersNotInSecondaryEntityIds(collisionOtherEntityIds);
  return walkResult;
}
