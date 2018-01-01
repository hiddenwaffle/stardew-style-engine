import { World } from 'src/domain/world';
import { Entity } from 'src/domain/entity';
import {
  MovementType,
  MovementTarget,
} from 'src/domain/movement';
import { timer } from 'src/session/timer';
import {
  calculateFacing,
  Direction,
  DirectionsOfFreedom,
  determineDxDy,
} from 'src/domain/direction';
import { tryAnimationSwitch } from './try-animation-switch';
import { TARGET_FIELD_TILE_SIZE } from 'src/constants';
import { TileTracker } from 'src/game-master/tile-tracker';
import { convertXYToIndex, determineTileValueOrMapBoundary } from 'src/math';

export function calculateDxDyIntended(world: World, entity: Entity) {
  switch (entity.movementPlan.type) {
    case MovementType.Wander:
      advanceWander(world, entity);
      break;
    case MovementType.Player:
    case MovementType.Stationary:
    default:
      // Do nothing
  }
}

function advanceWander(world: World, entity: Entity) {
  const plan = entity.movementPlan;
  if (plan.targets.length === 0) {
    const tracker = new TileTracker(entity.xtile, entity.ytile);

    for (const track of tracker.allTracks) {
      for (const layer of world.staticMap.collisionLayers) {
        // Determine if collision is an actual tile, or a map boundary.
        const [tileValue, _mapBoundary] = determineTileValueOrMapBoundary(track.x, track.y, layer);

        // Collision possible only if the tile value is a positive number.
        // TODO: Something that allows passthrough layers if specified?
        if (tileValue > 0) {
          track.solid = true; // TODO: Not necessarily solid; it is non-zero.
        }
      }
    }

    // console.log(solidTilesAroundEntity.join("\n"));

    // Determine open directions
    const openDirections = tracker.determineOpenDirections();

    // TODO: Include "waiting" as an option.
    const actionIndex = Math.floor(Math.random() * openDirections.length);
    const [dxtile, dytile] = determineDxDy(openDirections[actionIndex]);
    const xtileTarget = entity.xtile + dxtile;
    const ytileTarget = entity.ytile + dytile;

    const target = new MovementTarget(
      entity.x,
      entity.y,
      xtileTarget * TARGET_FIELD_TILE_SIZE + (TARGET_FIELD_TILE_SIZE / 2),
      // The -2 is to prevent overlap with adjacent tiles: -1 (above) + -1 (below) = -2.
      // Otherwise, xtile/ytile can end up pointed to a solid tile even
      // though the entity is only next to it, and get stuck.
      ytileTarget * TARGET_FIELD_TILE_SIZE + (TARGET_FIELD_TILE_SIZE - 2),
    );
    plan.targets.push(target);
  } else {
    const target = plan.targets[0];

    // TODO: Handle ttl if waiting

    // Determine the direction needed to travel from point A to point B.
    const dxstart = to1(target.x - target.xstart);
    const dystart = to1(target.y - target.ystart);

    // Determine the direction needed to travel from current point to point B.
    const dxprogress = to1(target.x - entity.x);
    const dyprogress = to1(target.y - entity.y);

    // Determine if x and/or y has gotten to the target value.
    const dx = dxstart !== dxprogress ? 0 : dxprogress;
    const dy = dystart !== dyprogress ? 0 : dyprogress;

    // Continue moving if either value has not been reached; otherwise snap to point B.
    entity.x = dx === 0 ? target.x : entity.x;
    entity.y = dy === 0 ? target.y : entity.y;
    entity.dxIntended = dx * 0.25; // TODO: Remove multiplier
    entity.dyIntended = dy * 0.25; // TODO: Remove multiplier

    entity.facing = calculateFacing(
      entity.dxIntended,
      entity.dyIntended,
      entity.facing,
      entity.directionsOfFreedom
    );
    tryAnimationSwitch(entity, true); // TODO: Wandering = walk animation, right?

    if (dx === 0 && dy === 0) {
      plan.targets.shift();
    }
  }
}

/**
 * Convert the given number to 1 or -1, or 0 if given 0.
 */
function to1(value: number): number {
  if (value === 0) {
    return 0;
  } else {
    return value / Math.abs(value);
  }
}
