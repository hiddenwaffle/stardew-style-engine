import World from 'src/domain/world';
import walkEntity from './walk-entity';
import {
  ScriptCall
} from './script-call';

class GameMaster {
  /**
   * Horizontal direction that the player wants to move.
   */
  private dxIntended: number;
  /**
   * Vertical direction that the player wants to move.
   */
  private dyIntended: number;

  advance(world: World) {
    if (!world) {
      return;
    }

    // Set the player's intended movement before walking the entities.
    world.player.entity.dxIntended = this.dxIntended;
    world.player.entity.dyIntended = this.dyIntended;

    world.entities.forEach((entity) => {
      entity.clearExpiredCallTimers();
      const walkResult = walkEntity(world, entity);
      walkResult.executeCalls(world);
    });

    checkEntityToEntityOverlap(world);
  }

  setPlayerIntendedDirection(dxIntended: number, dyIntended: number) {
    this.dxIntended = dxIntended;
    this.dyIntended = dyIntended;
  }
}

export default new GameMaster();

/**
 * Warning: O(n^2)
 * Warning: Uses the same bounding box calculation as walk-entity.ts
 */
function checkEntityToEntityOverlap(world: World) {
  for (const entity of world.entities) {
    // Calculate bounding box -- center x to middle and y to bottom.
    const left    = entity.x - entity.boundingWidth / 2;
    const right   = entity.x + entity.boundingWidth / 2;
    const top     = entity.y - entity.boundingHeight;
    const bottom  = entity.y + 1; // +1 to prevent entity's y to be on a solid tile directly below the entity.

    for (const other of world.entities) {
      if (entity.id !== other.id) {
        // NOTE: Should be similar to calculation above for the subject entity.
        // Calculate bounding box -- center x to middle and y to bottom.
        const leftOther   = other.x - other.boundingWidth / 2;
        const rightOther  = other.x + other.boundingWidth / 2;
        const topOther    = other.y - other.boundingHeight;
        const bottomOther = other.y + 1; // +1 to prevent entity's y to be on a solid tile directly below the entity.

        if (intersect(
          left, right, top, bottom,
          leftOther, rightOther, topOther, bottomOther)
        ) {
          if (entity.entityToEntityCollisionCall) {
            const call = new ScriptCall(
              entity.entityToEntityCollisionCall,
              entity.id,
              other.id
            );
            if (entity.tryScriptCall(call, entity.entityToEntityCollisionCallInterval)) {
              call.execute(world);
            }
          }
        }
      }
    }
  }
}

/**
 * AABB Collision (Without Response)
 * Based on: https://stackoverflow.com/a/2752387
 */
function intersect(
  left1: number, right1: number, top1: number, bottom1: number,
  left2: number, right2: number, top2: number, bottom2: number
): boolean {
  return (
    left2   < right1  &&
    right2  > left1   &&
    top2    < bottom1 &&
    bottom2 > top1
  );
}
