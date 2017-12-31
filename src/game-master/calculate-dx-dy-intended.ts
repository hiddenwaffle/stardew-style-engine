import { World } from 'src/domain/world';
import { Entity } from 'src/domain/entity';
import {
  MovementType,
  MovementTarget,
} from 'src/domain/movement';
import { timer } from 'src/session/timer';
import {
  calculateFacing,
  determineDirection,
  Direction,
  DirectionsOfFreedom,
  determineDxDy,
} from 'src/domain/direction';
import { tryAnimationSwitch } from './try-animation-switch';
import { TARGET_FIELD_TILE_SIZE } from 'src/constants';

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
    const xtile = entity.xtile;
    const ytile = entity.ytile;

    // TODO: This is duplicated in walk-entity-to-tiles.ts
    const tilesToCheck = [
      [xtile - 1, ytile - 1], // Top Left       0
      [xtile,     ytile - 1], // Top Middle     1
      [xtile + 1, ytile - 1], // Top Right      2
      [xtile - 1, ytile    ], // Middle Left    3
      [xtile    , ytile    ], // Middle         4
      [xtile + 1, ytile    ], // Middle Right   5
      [xtile - 1, ytile + 1], // Bottom Left    6
      [xtile    , ytile + 1], // Bottom Middle  7
      [xtile + 1, ytile + 1], // Bottom Right   8
    ];

    // TODO: This is duplicated in walk-entity-to-tiles.ts
    const solidTilesAroundEntity = [
      [false, false, false], // [0][0]  [0][1]  [0][2]
      [false, false, false], // [1][0]  [1][1]* [1][2]   *entity is in the center at [1][1]
      [false, false, false], // [2][0]  [2][1]  [2][2]
    ];

    // TODO: This is duplicated in walk-entity-to-tiles.ts
    for (const layer of world.staticMap.collisionLayers) {
      const tileIntersected = false;
      for (const tileToCheck of tilesToCheck) {
        const xTileToCheck = tileToCheck[0];
        const yTileToCheck = tileToCheck[1];

        // Determine if collision is an actual tile, or a map boundary.
        let tileValue = -1;
        if (xTileToCheck < 0 || xTileToCheck >= layer.width ||
            yTileToCheck < 0 || yTileToCheck >= layer.height) {
          tileValue = 1337; // arbitrary
        } else {
          const index = convertXYToIndex(xTileToCheck, yTileToCheck, layer.width);
          tileValue = layer.tiles[index];
        }

        // Collision possible only if the tile value is a positive number.
        if (tileValue <= 0) {
          continue;
        }

        // TODO: Something that allows passthrough layers if specified?
        // if (!layer.passthrough) {
          const staeCol = (xTileToCheck - xtile) + 1;
          const staeRow = (yTileToCheck - ytile) + 1;
          solidTilesAroundEntity[staeRow][staeCol] = true;
        // }
      }
    }

    // console.log(solidTilesAroundEntity.join("\n"));

    // Determine open directions
    const openDirections: Direction[] = [];
    if (!solidTilesAroundEntity[0][0] &&
        !solidTilesAroundEntity[1][0] &&
        !solidTilesAroundEntity[0][1]) { openDirections.push(Direction.UpLeft); }
    if (!solidTilesAroundEntity[0][1]) { openDirections.push(Direction.Up); }
    if (!solidTilesAroundEntity[0][2] &&
        !solidTilesAroundEntity[0][1] &&
        !solidTilesAroundEntity[1][2]) { openDirections.push(Direction.UpRight); }
    if (!solidTilesAroundEntity[1][0]) { openDirections.push(Direction.Left); }
    if (!solidTilesAroundEntity[1][2]) { openDirections.push(Direction.Right); }
    if (!solidTilesAroundEntity[2][0] &&
        !solidTilesAroundEntity[1][0] &&
        !solidTilesAroundEntity[2][1]) { openDirections.push(Direction.DownLeft); }
    if (!solidTilesAroundEntity[2][1]) { openDirections.push(Direction.Down) ; }
    if (!solidTilesAroundEntity[2][2] &&
        !solidTilesAroundEntity[2][1] &&
        !solidTilesAroundEntity[1][2]) { openDirections.push(Direction.DownRight); }

    // TODO: Include "waiting" as an option.
    const actionIndex = Math.floor(Math.random() * openDirections.length);
    const [dxtile, dytile] = determineDxDy(openDirections[actionIndex]);
    const xtileTarget = xtile + dxtile;
    const ytileTarget = ytile + dytile;

    const target = new MovementTarget(
      entity.x,
      entity.y,
      xtileTarget * TARGET_FIELD_TILE_SIZE + (TARGET_FIELD_TILE_SIZE / 2),
      ytileTarget * TARGET_FIELD_TILE_SIZE + (TARGET_FIELD_TILE_SIZE - 2), // -2 to prevent overlap with tiles above and below.
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

/**
 * TODO: This is duplicated in walk-entity-to-tiles.ts
 */
function convertXYToIndex(x: number, y: number, width: number): number {
  return x + (y * width);
}
