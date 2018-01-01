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
import { convertXYToIndex } from 'src/math';

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
  const leftProjected    = xprojected - entity.boundingWidth / 2;
  const rightProjected   = xprojected + entity.boundingWidth / 2;
  const topProjected     = yprojected - entity.boundingHeight;
  const bottomProjected  = yprojected + 1; // +1 to prevent entity's y to be on a solid tile directly below the entity.

  let xpush = 0;
  let ypush = 0;

  const collisionTileLayers: string[] = [];

  const tracker = new TileTracker(entity.xtile, entity.ytile);

  for (const track of tracker.allTracks) {
    for (const layer of world.staticMap.collisionLayers) {
      let mapBoundary = false;

      // Determine if collision is an actual tile, or a map boundary.
      let tileValue = -1;
      if (track.x < 0 || track.x >= layer.width ||
          track.y < 0 || track.y >= layer.height) {
        mapBoundary = true;
        tileValue = 1337; // arbitrary
      } else {
        const index = convertXYToIndex(track.x, track.y, layer.width);
        tileValue = layer.tiles[index];
      }

      // Collision possible only if the tile value is a positive number.
      if (tileValue <= 0) {
        continue;
      }

      if (!layer.passthrough) {
        track.solid = true;
      }

      // Convert tile to upscaled pixel space.
      const leftTile   =  track.x      * TARGET_FIELD_TILE_SIZE;
      const rightTile  = (track.x + 1) * TARGET_FIELD_TILE_SIZE;
      const topTile    =  track.y      * TARGET_FIELD_TILE_SIZE;
      const bottomTile = (track.y + 1) * TARGET_FIELD_TILE_SIZE;

      // Move the entity out of a solid tile.
      const [xExpectedPush, yExpectedPush] = calculatePush(
        leftProjected, rightProjected, topProjected, bottomProjected,
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
        if (!mapBoundary) {
          collisionTileLayers.push(layer.name);
          if (layer.collisionCall) {
            const call = new ScriptCall(
              layer.collisionCall,
              entity.id,
              null,
              layer.name,
            );
            track.addCall(call, layer.collisionCallInterval);
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

  if (direction === Direction.Up) {
    if (tracker.getTrack(Direction.Up).solid === false) {
      if (xPercentOnCurrentTile < 0.5) {
        xpush =  Math.abs(ypush);
      } else {
        xpush = -Math.abs(ypush);
      }
    } else if (tracker.getTrack(Direction.UpLeft).solid === false && xPercentOnCurrentTile < 0.4) {
      xpush = -Math.abs(ypush);
    } else if (tracker.getTrack(Direction.UpRight).solid === false && xPercentOnCurrentTile > 0.6) {
      xpush =  Math.abs(ypush);
    }
  } else if (direction === Direction.Down) {
    if (tracker.getTrack(Direction.Down).solid === false) {
      if (xPercentOnCurrentTile < 0.5) {
        xpush =  Math.abs(ypush);
      } else {
        xpush = -Math.abs(ypush);
      }
    } else if (tracker.getTrack(Direction.DownLeft).solid === false && xPercentOnCurrentTile < 0.4) {
      xpush = -Math.abs(ypush);
    } else if (tracker.getTrack(Direction.DownRight).solid === false && xPercentOnCurrentTile > 0.6) {
      xpush =  Math.abs(ypush);
    }
  } else if (direction === Direction.Left) {
    if (tracker.getTrack(Direction.UpLeft).solid === false && yPercentOnCurrentTile < 0.85) {
      ypush = -Math.abs(xpush);
    } else if (tracker.getTrack(Direction.Left).solid === false && yPercentOnCurrentTile > 0.15) {
      ypush =  Math.abs(xpush);
    }
  } else if (direction === Direction.Right) {
    if (tracker.getTrack(Direction.UpRight).solid === false && yPercentOnCurrentTile < 0.85) {
      ypush = -Math.abs(xpush);
    } else if (tracker.getTrack(Direction.Right).solid === false && yPercentOnCurrentTile > 0.15) {
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
