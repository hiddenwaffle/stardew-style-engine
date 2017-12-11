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
  entity.x += entity.dxIntended * speed;
  entity.y += entity.dyIntended * speed;

  // // Skip if entity is not even attempting to move.
  // if (dxAttempted === 0 && dyAttempted === 0) {
  //   return;
  // }

  const xTile = Math.floor(entity.x / TARGET_FIELD_TILE_SIZE);
  const yTile = Math.floor(entity.y / TARGET_FIELD_TILE_SIZE);

  const tilesToCheck = [
    [xTile - 1, yTile - 1], // Top Left
    [xTile,     yTile - 1], // Top Middle
    [xTile + 1, yTile - 1], // Top Right
    [xTile - 1, yTile    ], // Middle Left
    [xTile    , yTile    ], // Middle
    [xTile + 1, yTile    ], // Middle Right
    [xTile - 1, yTile + 1], // Bottom Left
    [xTile    , yTile + 1], // Bottom Middle
    [xTile + 1, yTile + 1]  // Bottom Right
  ];

  // TODO: Handle map boundaries
  // // For map boundaries, consider tile coordinates of < 0 or === width/length to be solid.
  // if (xtileToCheck < 0 || xtileToCheck >= layer.width ||
  //     ytileToCheck < 0 || ytileToCheck >= layer.height) {
  // value = 1337;

  for (const layer of world.staticMap.collisionLayers) {
    const tileIntersected = false;
    for (const tileToCheck of tilesToCheck) {
      const xTileToCheck = tileToCheck[0];
      const yTileToCheck = tileToCheck[1];

      // TODO: Adjust for layers with offsets.

      // Ignore map boundaries because they are handled elsewhere.
      if (xTileToCheck < 0 || xTileToCheck >= layer.width ||
          yTileToCheck < 0 || yTileToCheck >= layer.height) {
        continue;
      }

      const index = convertXYToIndex(xTileToCheck, yTileToCheck, layer.width);
      const value = layer.tiles[index];

      // Collision possible only if the tile value is a positive number.
      if (!value) {
        continue;
      }

      // Calculate bounding box -- center x to middle and y to bottom.
      const left    = entity.x - entity.boundingWidth / 2;
      const right   = entity.x + entity.boundingWidth / 2;
      const top     = entity.y - entity.boundingHeight;
      const bottom  = entity.y;

      // Convert tile to upscaled pixel space.
      const leftTile   =  xTileToCheck      * TARGET_FIELD_TILE_SIZE;
      const rightTile  = (xTileToCheck + 1) * TARGET_FIELD_TILE_SIZE;
      const topTile    =  yTileToCheck      * TARGET_FIELD_TILE_SIZE;
      const bottomTile = (yTileToCheck + 1) * TARGET_FIELD_TILE_SIZE;

      const intersected = intersect(
        left, right, top, bottom,
        leftTile, rightTile, topTile, bottomTile
      );

      if (intersected) {
        // TODO: Queue scripts, if any.
        // console.log(layer.name);

        // Move the entity out of a solid tile.
        if (!layer.passthrough) {
          const [xpush, ypush] = calculatePush(
            left, right, top, bottom,
            leftTile, rightTile, topTile, bottomTile
          );
          entity.x += xpush;
          entity.y += ypush;
        }
      }
    }
  }

  // TODO: If solid collision and moving non-diagonal and if 'sliding' should be applied.
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

/**
 * AABB Collision Response
 * Based on: https://www.youtube.com/watch?v=l2iCYCLi6MU
 */
function calculatePush(
  left1: number, right1: number, top1: number, bottom1: number,
  left2: number, right2: number, top2: number, bottom2: number
): [number, number] {
  const xhalfsize1 = (right1  - left1) / 2;
  const yhalfsize1 = (bottom1 - top1)  / 2;
  const xhalfsize2 = (right2  - left2) / 2;
  const yhalfsize2 = (bottom2 - top2)  / 2;

  const xmidpoint1 = left1 + xhalfsize1;
  const ymidpoint1 = top1  + yhalfsize1;
  const xmidpoint2 = left2 + xhalfsize2;
  const ymidpoint2 = top2  + yhalfsize2;

  const xdelta = Math.abs(xmidpoint1 - xmidpoint2);
  const ydelta = Math.abs(ymidpoint1 - ymidpoint2);

  const xintersect = xdelta - (xhalfsize1 + xhalfsize2);
  const yintersect = ydelta - (yhalfsize1 + yhalfsize2);

  let xoff = 0;
  let yoff = 0;

  // Yet another intersection check (TODO: Refactor so this is the only one?)
  if (xintersect < 0 && yintersect < 0) {
    if (xintersect > yintersect) {
      xoff = xdelta > 0 ? xintersect : -xintersect;
    } else {
      yoff = ydelta > 0 ? -yintersect : yintersect;
    }
  }

  return [xoff, yoff];
}

function convertXYToIndex(x: number, y: number, width: number) {
  return x + (y * width);
}
