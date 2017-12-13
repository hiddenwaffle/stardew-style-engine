import { Direction } from 'src/domain/direction';
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

  entity.x += entity.dxIntended * speed;
  entity.y += entity.dyIntended * speed;

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

      // Move the entity out of a solid tile.
      const [xExpectedPush, yExpectedPush] = calculatePush(
        left, right, top, bottom,
        leftTile, rightTile, topTile, bottomTile
      );
      const overlapped = xExpectedPush !== 0 || yExpectedPush !== 0;
      if (overlapped) {
        if (!isAWallTile) {
          // TODO: Queue scripts, if any.
          console.log(layer.name);
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

  if (entity.direction !== Direction.None) {
    console.log(entity.direction);
  }

  entity.x += xpush;
  entity.y += ypush;
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

function convertXYToIndex(x: number, y: number, width: number) {
  return x + (y * width);
}
