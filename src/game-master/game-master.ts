import Entity from 'src/domain/entity';
import World from 'src/domain/world';
import CollisionLayer from 'src/domain/collision-layer';
import timer from 'src/session/timer';
import {
  TARGET_FIELD_TILE_SIZE,
  UPSCALE
} from 'src/constants';
import script from 'src/script';

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

    world.player.entity.dxIntended = this.dxIntended;
    world.player.entity.dyIntended = this.dyIntended;

    world.entities.forEach((entity) => {
      const speed = 90 * UPSCALE; // pixels per millisecond?
      const secondsPast = timer.elapsed / 1000;
      const final = speed * secondsPast;
      walk(world, entity, final);
    })
  }

  setPlayerIntendedDirection(dxIntended: number, dyIntended: number) {
    this.dxIntended = dxIntended;
    this.dyIntended = dyIntended;
  }

  // private checkCollision(world: World, entity: Entity, dx: number, dy: number) {
  //   let solidCollision = false;
  //   let solidCollisionXValue = 0;
  //   let solidCollisionYValue = 0;

  //   const xprojected = entity.x + dx;
  //   const yprojected = entity.y + dy;
  //   const xprojectedTile = Math.floor(xprojected / TARGET_FIELD_TILE_SIZE);
  //   const yprojectedTile = Math.floor(yprojected / TARGET_FIELD_TILE_SIZE);

  //   const pushingAgainstLeftOrRightOfMap = xprojectedTile < 0 || xprojectedTile >= world.staticMap.width;
  //   const pushingAgainstTopOrBottomOfMap = yprojectedTile < 0 || yprojectedTile >= world.staticMap.height;

  //   if (pushingAgainstLeftOrRightOfMap || pushingAgainstTopOrBottomOfMap) {
  //     solidCollision = true;
  //     if (pushingAgainstLeftOrRightOfMap) {
  //       solidCollisionXValue = 1;
  //     }
  //     if (pushingAgainstTopOrBottomOfMap) {
  //       solidCollisionYValue = 1;
  //     }
  //   } else {
  //     for (const layer of world.staticMap.collisionLayers) {
  //       const index = xprojectedTile + (yprojectedTile * layer.width);
  //       const value = layer.tiles[index];
  //       if (value !== 0) {
  //         script.execute(layer.once);
  //         script.execute(layer.repeatedly);
  //         if (layer.passthrough) {
  //           //
  //         } else {
  //           solidCollision = true;

  //           // Allow the entity to "slide" against the collision tile (when attmpting to move diagonally).
  //           const xcurrentTile = Math.floor(entity.x / TARGET_FIELD_TILE_SIZE);
  //           const ycurrentTile = Math.floor(entity.y / TARGET_FIELD_TILE_SIZE);
  //           if (dx !== 0) {
  //             const index = xprojectedTile + (ycurrentTile * layer.width);
  //             solidCollisionXValue = layer.tiles[index];
  //           }
  //           if (dy !== 0) {
  //             const index = xcurrentTile + (yprojectedTile * layer.width);
  //             solidCollisionYValue = layer.tiles[index];
  //           }

  //           break;
  //         }
  //       }
  //     };
  //   }

  //   if (solidCollision) {
  //     if (solidCollisionXValue === 0) {
  //       entity.x = xprojected;
  //     }
  //     if (solidCollisionYValue === 0) {
  //       entity.y = yprojected;
  //     }
  //   } else {
  //     // TODO: Align sides together so the entity doesn't pass through
  //     entity.x = xprojected;
  //     entity.y = yprojected;
  //   }
  // }
}

export default new GameMaster();

function walk(world: World, entity: Entity, speed: number) {
  const dxAttempted = entity.dxIntended * speed;
  const dyAttempted = entity.dyIntended * speed;

  // // Skip if entity is not even attempting to move.
  // if (dxAttempted === 0 && dyAttempted === 0) {
  //   return;
  // }

  // Calculate bounding box -- center x to middle and y to bottom.
  const left    = entity.x - entity.boundingWidth / 2;
  const right   = entity.x + entity.boundingWidth / 2;
  const top     = entity.y - entity.boundingHeight;
  const bottom  = entity.y;

  const xcurrentTile = Math.floor(entity.x / TARGET_FIELD_TILE_SIZE);
  const ycurrentTile = Math.floor(entity.y / TARGET_FIELD_TILE_SIZE);
  // const xprojected = entity.x + dxAttempted;
  // const yprojected = entity.y + dyAttempted;
  // const xprojectedTile = Math.floor(xprojected / TARGET_FIELD_TILE_SIZE);
  // const yprojectedTile = Math.floor(yprojected / TARGET_FIELD_TILE_SIZE);

  const tilesToCheck = [
    [xcurrentTile - 1, ycurrentTile - 1], // Top Left
    [xcurrentTile,     ycurrentTile - 1], // Top Middle
    [xcurrentTile + 1, ycurrentTile - 1], // Top Right
    [xcurrentTile - 1, ycurrentTile    ], // Middle Left
    [xcurrentTile    , ycurrentTile    ], // Middle
    [xcurrentTile + 1, ycurrentTile    ], // Middle Right
    [xcurrentTile - 1, ycurrentTile + 1], // Bottom Left
    [xcurrentTile    , ycurrentTile + 1], // Bottom Middle
    [xcurrentTile + 1, ycurrentTile + 1]  // Bottom Right
  ];

  // TODO: Handle map boundaries
  // // For map boundaries, consider tile coordinates of < 0 or === width/length to be solid.
  // if (xtileToCheck < 0 || xtileToCheck >= layer.width ||
  //     ytileToCheck < 0 || ytileToCheck >= layer.height) {
  // value = 1337;

  for (const layer of world.staticMap.collisionLayers) {
    const tileIntersected = false;
    for (const tileToCheck of tilesToCheck) {
      const xtileToCheck = tileToCheck[0];
      const ytileToCheck = tileToCheck[1];

      // TODO: Adjust for layers with offsets.

      // Ignore map boundaries because they are handled elsewhere.
      if (xtileToCheck < 0 || xtileToCheck >= layer.width ||
          ytileToCheck < 0 || ytileToCheck >= layer.height) {
        continue;
      }

      const index = convertXYToIndex(xtileToCheck, ytileToCheck, layer.width);
      const value = layer.tiles[index];

      // Collision possible only if the tile value is a positive number.
      if (!value) {
        continue;
      }

      // Convert tile to upscaled pixel space.
      const leftTile   =  xtileToCheck      * TARGET_FIELD_TILE_SIZE;
      const rightTile  = (xtileToCheck + 1) * TARGET_FIELD_TILE_SIZE;
      const topTile    =  ytileToCheck      * TARGET_FIELD_TILE_SIZE;
      const bottomTile = (ytileToCheck + 1) * TARGET_FIELD_TILE_SIZE;

      const intersected = intersect(
        left, right, top, bottom,
        leftTile, rightTile, topTile, bottomTile
      );

      if (intersected) {
        console.log(layer.name);
      }
    }
  }

  // TODO: If solid collision and moving non-diagonal and if 'sliding' should be applied.

  // TODO: Do it.
  const dxFinal = dxAttempted;
  const dyFinal = dyAttempted;

  // Apply the final values.
  entity.x += dxFinal;
  entity.y += dyFinal;
}

/**
 * https://stackoverflow.com/a/2752387
 */
function intersect(
  left1: number, right1: number, top1: number, bottom1: number,
  left2: number, right2: number, top2: number, bottom2: number
) {
  return !(
    left2   > right1  ||
    right2  < left1   ||
    top2    > bottom1 ||
    bottom2 < top1
  );
}

function convertXYToIndex(x: number, y: number, width: number) {
  return x + (y * width);
}
