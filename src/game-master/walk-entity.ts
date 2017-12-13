import {
  Direction,
  isCardinal
} from 'src/domain/direction';
import World from 'src/domain/world';
import Entity from 'src/domain/entity';
import timer from 'src/session/timer';
import script from 'src/script';
import {
  TARGET_FIELD_TILE_SIZE
} from 'src/constants';

export default (world: World, entity: Entity) => {
  const secondsPast = timer.elapsed / 1000;
  const speed = entity.speed * secondsPast;

  const xprojected = entity.x + entity.dxIntended * speed;
  const yprojected = entity.y + entity.dyIntended * speed;

  const xTile = Math.floor(entity.x / TARGET_FIELD_TILE_SIZE);
  const yTile = Math.floor(entity.y / TARGET_FIELD_TILE_SIZE);

  const tilesToCheck = [
    [xTile - 1, yTile - 1], // Top Left       0
    [xTile,     yTile - 1], // Top Middle     1
    [xTile + 1, yTile - 1], // Top Right      2
    [xTile - 1, yTile    ], // Middle Left    3
    [xTile    , yTile    ], // Middle         4
    [xTile + 1, yTile    ], // Middle Right   5
    [xTile - 1, yTile + 1], // Bottom Left    6
    [xTile    , yTile + 1], // Bottom Middle  7
    [xTile + 1, yTile + 1]  // Bottom Right   8
  ];

  const solidTilesAroundEntity = [
    [false, false, false], // [0][0]  [0][1]  [0][2]
    [false, false, false], // [1][0]  [1][1]* [1][2]   *entity is in the center at [1][1]
    [false, false, false]  // [2][0]  [2][1]  [2][2]
  ];

  let xpush = 0;
  let ypush = 0;

  for (const layer of world.staticMap.collisionLayers) {
    const tileIntersected = false;
    for (const tileToCheck of tilesToCheck) {
      const xTileToCheck = tileToCheck[0];
      const yTileToCheck = tileToCheck[1];

      // TODO: Adjust for layers with offsets.

      // Determine if tile is a collision tile, and if that tile is a tile or a wall.
      let isAWallTile;
      let tileValue = -1;
      if (xTileToCheck < 0 || xTileToCheck >= world.staticMap.width ||
          yTileToCheck < 0 || yTileToCheck >= world.staticMap.height) {
        isAWallTile = true;
        tileValue = 1337; // arbitrary
      } else {
        const index = convertXYToIndex(xTileToCheck, yTileToCheck, layer.width);
        isAWallTile = false;
        tileValue = layer.tiles[index];
      }

      // Collision possible only if the tile value is a positive number.
      if (tileValue <= 0) {
        continue;
      }

      if (!layer.passthrough) {
        /// STAE = Solid Tiles Around Entity
        const staeCol = (xTileToCheck - xTile) + 1;
        const staeRow = (yTileToCheck - yTile) + 1;
        solidTilesAroundEntity[staeRow][staeCol] = true;
      }

      // Calculate bounding box -- center x to middle and y to bottom.
      const left    = xprojected - entity.boundingWidth / 2;
      const right   = xprojected + entity.boundingWidth / 2;
      const top     = yprojected - entity.boundingHeight;
      const bottom  = yprojected + 1; // +1 to prevent entity's y to be on a solid tile directly below the entity.

      // Convert tile to upscaled pixel space.
      const leftTile   =  xTileToCheck      * TARGET_FIELD_TILE_SIZE;
      const rightTile  = (xTileToCheck + 1) * TARGET_FIELD_TILE_SIZE;
      const topTile    =  yTileToCheck      * TARGET_FIELD_TILE_SIZE;
      const bottomTile = (yTileToCheck + 1) * TARGET_FIELD_TILE_SIZE;

      // Move the entity out of a solid tile.
      const [xExpectedPush, yExpectedPush] = calculatePush(
        left, right, top, bottom,
        leftTile, rightTile, topTile, bottomTile
      );
      const overlapped = xExpectedPush !== 0 || yExpectedPush !== 0;
      if (overlapped) {
        if (!isAWallTile) {
          // TODO: Queue scripts, if any.
          // console.log(layer.name);
        }
        if (!layer.passthrough) {
          if (Math.abs(xExpectedPush) > Math.abs(xpush)) {
            xpush = xExpectedPush;
          }
          if (Math.abs(yExpectedPush) > Math.abs(ypush)) {
            ypush = yExpectedPush;
          }
        }
      }
    }
  }

  const solidCollisionOccurred = (xpush !== 0 && ypush === 0) || (xpush === 0 && ypush !== 0);

  if (solidCollisionOccurred && isCardinal(entity.direction)) {
    [xpush, ypush] = attemptAssistedSlide(
      entity.direction,
      entity.x,
      entity.y,
      xTile,
      yTile,
      solidTilesAroundEntity,
      xpush,
      ypush
    );
  }

  entity.x = xprojected + xpush;
  entity.y = yprojected + ypush;
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

  const xcenter1 = left1 + xhalfsize1;
  const ycenter1 = top1  + yhalfsize1;
  const xcenter2 = left2 + xhalfsize2;
  const ycenter2 = top2  + yhalfsize2;

  const xdelta = xcenter1 - xcenter2;
  const ydelta = ycenter1 - ycenter2;

  const xintersect = Math.abs(xdelta) - (xhalfsize1 + xhalfsize2);
  const yintersect = Math.abs(ydelta) - (yhalfsize1 + yhalfsize2);

  let xpush = 0;
  let ypush = 0;

  if (xintersect < 0 && yintersect < 0) {
    if (xintersect > yintersect) {
      xpush = xdelta > 0 ? -xintersect : xintersect;
    } else if (xintersect < yintersect) {
      ypush = ydelta > 0 ? -yintersect : yintersect;
    } else { // Remaining case is: xintersect === yinteresect.
      // NOTE: Needed to catch this case to prevent getting stuck on
      // two rectangles right next to each other (like how the tiles are)
    }
  }

  return [xpush, ypush];
}

function convertXYToIndex(x: number, y: number, width: number): number {
  return x + (y * width);
}

/**
 * Attempt assisted-slide, if entity is towards the edge of an "end tile".
 */
function attemptAssistedSlide(
  direction: Direction,
  x: number,
  y: number,
  xTile: number,
  yTile: number,
  solidTilesAroundEntity: boolean[][],
  xpushOriginal: number,
  ypushOriginal: number
): [number, number] {
  let xpush = xpushOriginal;
  let ypush = ypushOriginal;

  const xPercentOnCurrentTile = (x - xTile * TARGET_FIELD_TILE_SIZE) / TARGET_FIELD_TILE_SIZE;
  const yPercentOnCurrentTile = (y - yTile * TARGET_FIELD_TILE_SIZE) / TARGET_FIELD_TILE_SIZE;

  // console.log('---------------');
  // console.log(solidTilesAroundEntity[0]);
  // console.log(solidTilesAroundEntity[1]);
  // console.log(solidTilesAroundEntity[2]);
  // console.log(xTile, yTile);
  // console.log(entity.x, xTile * TARGET_FIELD_TILE_SIZE, (xTile + 1) * TARGET_FIELD_TILE_SIZE);
  // console.log(xPercentOnCurrentTile, yPercentOnCurrentTile);

  if (direction === Direction.Up) {
    if (solidTilesAroundEntity[0][1] === false) {
      if (xPercentOnCurrentTile < 0.5) {
        xpush =  Math.abs(ypush);
      } else {
        xpush = -Math.abs(ypush);
      }
    } else if (solidTilesAroundEntity[0][0] === false && xPercentOnCurrentTile < 0.4) {
      xpush = -Math.abs(ypush);
    } else if (solidTilesAroundEntity[0][2] === false && xPercentOnCurrentTile > 0.6) {
      xpush =  Math.abs(ypush);
    }
  } else if (direction === Direction.Down) {
    if (solidTilesAroundEntity[2][1] === false) {
      if (xPercentOnCurrentTile < 0.5) {
        xpush =  Math.abs(ypush);
      } else {
        xpush = -Math.abs(ypush);
      }
    } else if (solidTilesAroundEntity[2][0] === false && xPercentOnCurrentTile < 0.4) {
      xpush = -Math.abs(ypush);
    } else if (solidTilesAroundEntity[2][2] === false && xPercentOnCurrentTile > 0.6) {
      xpush =  Math.abs(ypush);
    }
  } else if (direction === Direction.Left) {
    if (solidTilesAroundEntity[0][0] === false && yPercentOnCurrentTile < 0.65) {
      ypush = -Math.abs(xpush);
    } else if (solidTilesAroundEntity[1][0] === false && yPercentOnCurrentTile > 0.35) {
      ypush =  Math.abs(xpush);
    }
  } else if (direction === Direction.Right) {
    if (solidTilesAroundEntity[0][2] === false && yPercentOnCurrentTile < 0.65) {
      ypush = -Math.abs(xpush);
    } else if (solidTilesAroundEntity[1][2] === false && yPercentOnCurrentTile > 0.35) {
      ypush =  Math.abs(xpush);
    }
  }

  return [xpush, ypush];
}
