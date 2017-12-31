import {
  Direction,
  isCardinal,
} from 'src/domain/direction';
import { World } from 'src/domain/world';
import { Entity } from 'src/domain/entity';
import { timer } from 'src/session/timer';
import { TARGET_FIELD_TILE_SIZE } from 'src/constants';
import { ScriptCall } from './script-call';
import { WalkResult } from './walk-result';
import { CollisionLayer } from 'src/domain/collision-layer';
import {
  TileTracker,
} from './tile-tracker';

export function walkEntityToTiles(world: World, entity: Entity): WalkResult {
  const walkResult = new WalkResult(world);
  if (!world || !world.staticMap) {
    return walkResult;
  }

  const secondsPast = timer.elapsed / 1000;
  const speed = entity.speed * secondsPast;

  const xprojected = entity.x + entity.dxIntended * speed;
  const yprojected = entity.y + entity.dyIntended * speed;

  // Calculate bounding box -- center x to middle and y to bottom.
  const left    = xprojected - entity.boundingWidth / 2;
  const right   = xprojected + entity.boundingWidth / 2;
  const top     = yprojected - entity.boundingHeight;
  const bottom  = yprojected + 1; // +1 to prevent entity's y to be on a solid tile directly below the entity.

  let xpush = 0;
  let ypush = 0;

  const collisionTileLayers: string[] = [];

  const tilesToCheck = [
    [entity.xtile - 1, entity.ytile - 1], // Top Left       0
    [entity.xtile,     entity.ytile - 1], // Top Middle     1
    [entity.xtile + 1, entity.ytile - 1], // Top Right      2
    [entity.xtile - 1, entity.ytile    ], // Middle Left    3
    [entity.xtile    , entity.ytile    ], // Middle         4
    [entity.xtile + 1, entity.ytile    ], // Middle Right   5
    [entity.xtile - 1, entity.ytile + 1], // Bottom Left    6
    [entity.xtile    , entity.ytile + 1], // Bottom Middle  7
    [entity.xtile + 1, entity.ytile + 1], // Bottom Right   8
  ];

  const tracker = new TileTracker();

  for (const layer of world.staticMap.collisionLayers) {
    for (const tileToCheck of tilesToCheck) {
      const xtileToCheck = tileToCheck[0];
      const ytileToCheck = tileToCheck[1];

      // Corresponds to indexes in the tracks array.
      const trackRow = (ytileToCheck - entity.ytile) + 1;
      const trackCol = (xtileToCheck - entity.xtile) + 1;

      // Determine if collision is an actual tile, or a map boundary.
      let tileValue = -1;
      if (xtileToCheck < 0 || xtileToCheck >= layer.width ||
          ytileToCheck < 0 || ytileToCheck >= layer.height) {
        tracker.setMapBoundary(trackRow, trackCol, true);
        tileValue = 1337; // arbitrary
      } else {
        const index = convertXYToIndex(xtileToCheck, ytileToCheck, layer.width);
        tileValue = layer.tiles[index];
      }

      // Collision possible only if the tile value is a positive number.
      if (tileValue <= 0) {
        continue;
      }

      if (!layer.passthrough) {
        tracker.setSolid(trackRow, trackCol, true);
      }

      // Convert tile to upscaled pixel space.
      const leftTile   =  xtileToCheck      * TARGET_FIELD_TILE_SIZE;
      const rightTile  = (xtileToCheck + 1) * TARGET_FIELD_TILE_SIZE;
      const topTile    =  ytileToCheck      * TARGET_FIELD_TILE_SIZE;
      const bottomTile = (ytileToCheck + 1) * TARGET_FIELD_TILE_SIZE;

      // Move the entity out of a solid tile.
      const [xExpectedPush, yExpectedPush] = calculatePush(
        left, right, top, bottom,
        leftTile, rightTile, topTile, bottomTile,
      );
      const overlapped = xExpectedPush !== 0 || yExpectedPush !== 0;
      if (overlapped) {
        if (!layer.passthrough && entity.pushable) {
          if (Math.abs(xExpectedPush) > Math.abs(xpush)) {
            xpush = xExpectedPush;
          }
          if (Math.abs(yExpectedPush) > Math.abs(ypush)) {
            ypush = yExpectedPush;
          }
        }
        if (!tracker.isMapBoundary(trackRow, trackCol)) {
          collisionTileLayers.push(layer.name);
          if (layer.collisionCall) {
            const call = new ScriptCall(
              layer.collisionCall,
              entity.id,
              null,
              layer.name,
            );
            tracker.addCall(trackRow, trackCol, call, layer.collisionCallInterval);
          }
        } else {
          let directionCall = determineLayerDirectionCall(entity, layer);
          if (directionCall) {
            const call = new ScriptCall(directionCall, entity.id, null, layer.name);
            if (entity.tryScriptCall(call, layer.collisionCallInterval)) {
              walkResult.addCall(call);
            }
          }
        }
      }
    }
  }

  // Do not run scripts that are on the other side of solid diagonal tile walls.
  // See method for more details.
  tracker.removeCornersBlockedByDiagonalSolid(entity.direction);
  for (const [call, collisionCallInterval] of tracker.calls) {
    if (entity.tryScriptCall(call, collisionCallInterval)) {
      walkResult.addCall(call);
    }
  }

  // If the entity moved out of a layer on which the entity
  // had an active call timer, cancel that timer.
  entity.clearCallTimersNotInLayersNames(collisionTileLayers);

  const solidCollisionOccurred = (xpush !== 0 && ypush === 0) || (xpush === 0 && ypush !== 0);
  if (solidCollisionOccurred && isCardinal(entity.direction)) {
    [xpush, ypush] = attemptAssistedSlide(
      entity.direction,
      entity.x,
      entity.y,
      entity.xtile,
      entity.ytile,
      tracker,
      xpush,
      ypush,
    );
  }

  entity.x = xprojected + xpush;
  entity.y = yprojected + ypush;

  return walkResult;
}

/**
 * AABB Collision Response
 * Based on: https://www.youtube.com/watch?v=l2iCYCLi6MU
 */
function calculatePush(
  left1: number, right1: number, top1: number, bottom1: number,
  left2: number, right2: number, top2: number, bottom2: number,
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
 *
 * The idea and calculations below are to see if the entity's position relative
 * to the tile that is blocking it is leaning one way or another.
 * If so, see if the tiles beyond that direction are free. If they are,
 * "slide" the entity toward that direction.
 *
 * This will cause the entity to "round around the corner" of a solid tile.
 */
function attemptAssistedSlide(
  direction: Direction,
  x: number,
  y: number,
  xTile: number,
  yTile: number,
  tracker: TileTracker,
  xpushOriginal: number,
  ypushOriginal: number,
): [number, number] {
  let xpush = xpushOriginal;
  let ypush = ypushOriginal;

  const xPercentOnCurrentTile = (x - xTile * TARGET_FIELD_TILE_SIZE) / TARGET_FIELD_TILE_SIZE;
  const yPercentOnCurrentTile = (y - yTile * TARGET_FIELD_TILE_SIZE) / TARGET_FIELD_TILE_SIZE;

  // console.log('---------------');
  // console.log(solidTilesAroundEntity[0]);
  // console.log(solidTilesAroundEntity[1]);
  // console.log(solidTilesAroundEntity[2]);
  // console.log('xTile, yTile', xTile, yTile);
  // console.log(x, xTile * TARGET_FIELD_TILE_SIZE, (xTile + 1) * TARGET_FIELD_TILE_SIZE);
  // console.log(y, yTile * TARGET_FIELD_TILE_SIZE, (yTile + 1) * TARGET_FIELD_TILE_SIZE);
  // console.log('xpct, ypct', xPercentOnCurrentTile, yPercentOnCurrentTile);

  if (direction === Direction.Up) {
    if (tracker.isSolid(0, 1) === false) {
      if (xPercentOnCurrentTile < 0.5) {
        xpush =  Math.abs(ypush);
      } else {
        xpush = -Math.abs(ypush);
      }
    } else if (tracker.isSolid(0, 0) === false && xPercentOnCurrentTile < 0.4) {
      xpush = -Math.abs(ypush);
    } else if (tracker.isSolid(0, 2) === false && xPercentOnCurrentTile > 0.6) {
      xpush =  Math.abs(ypush);
    }
  } else if (direction === Direction.Down) {
    if (tracker.isSolid(2, 1) === false) {
      if (xPercentOnCurrentTile < 0.5) {
        xpush =  Math.abs(ypush);
      } else {
        xpush = -Math.abs(ypush);
      }
    } else if (tracker.isSolid(2, 0) === false && xPercentOnCurrentTile < 0.4) {
      xpush = -Math.abs(ypush);
    } else if (tracker.isSolid(2, 2) === false && xPercentOnCurrentTile > 0.6) {
      xpush =  Math.abs(ypush);
    }
  } else if (direction === Direction.Left) {
    if (tracker.isSolid(0, 0) === false && yPercentOnCurrentTile < 0.85) {
      ypush = -Math.abs(xpush);
    } else if (tracker.isSolid(1, 0) === false && yPercentOnCurrentTile > 0.15) {
      ypush =  Math.abs(xpush);
    }
  } else if (direction === Direction.Right) {
    if (tracker.isSolid(0, 2) === false && yPercentOnCurrentTile < 0.85) {
      ypush = -Math.abs(xpush);
    } else if (tracker.isSolid(1, 2) === false && yPercentOnCurrentTile > 0.15) {
      ypush =  Math.abs(xpush);
    }
  }

  return [xpush, ypush];
}

function determineLayerDirectionCall(entity: Entity, layer: CollisionLayer): string {
  let directionCall;
  switch(entity.direction) {
    case Direction.Up:
      directionCall = layer.upCall || null;
      break;
    case Direction.Down:
      directionCall = layer.downCall || null;
      break;
    case Direction.Left:
      directionCall = layer.leftCall || null;
      break;
    case Direction.Right:
      directionCall = layer.rightCall || null;
      break;
    default:
      directionCall = null;
      break;
  }
  return directionCall;
}