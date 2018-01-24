import { World } from 'src/domain/world';
import { Entity } from 'src/domain/entity';
import {
  MovementTarget,
} from 'src/domain/movement';
import { timer } from 'src/session/timer';
import {
  calculateFacing,
  Direction,
  determineDxDy,
} from 'src/domain/direction';
import { tryAnimationSwitch } from 'src/game-master/try-animation-switch';
import { TARGET_FIELD_TILE_SIZE } from 'src/constants';
import { TileTracker } from 'src/game-master/tile-tracker';
import { determineTileValueOrMapBoundary } from 'src/math';

export function patrol(world: World, entity: Entity) {
  // const plan = entity.movementPlan;
  headTowardsTarget(world, entity);
}

// import { js as EasyStar } from 'easystarjs';
// const star = new EasyStar();
// const grid = [[0,0,1,0,0],
//               [0,0,1,0,0],
//               [0,0,1,0,0],
//               [0,0,1,0,0],
//               [0,0,0,0,0]];
// star.setGrid(grid);
// star.setAcceptableTiles([0]);
// star.enableDiagonals();
// star.disableCornerCutting();
// star.findPath(0, 0, 4, 0, function (path) {
//   if (path === null) {
//     console.log('Path was not found.');
//   } else {
//     path.forEach((point) => {
//       grid[point.y][point.x] = 2;
//     });
//   }
//   grid.forEach((row) => {
//     let buf = '';
//     row.forEach((elem) => {
//       buf += elem + ',';
//     });
//     console.log(buf + '                    ' + Math.random());
//   });
// });
// star.calculate();

function headTowardsTarget(world: World, entity: Entity) {
  const plan = entity.movementPlan;
  const target = plan.targets[0];
  if (!target) {
    return;
  }

  if (!target.initialized) {
    target.initialize(entity.x, entity.y);
  }

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
    entity.directionsOfFreedom,
  );
  tryAnimationSwitch(entity, false); // TODO: Wandering = walk animation, right?

  // Already at destination
  if (dx === 0 && dy === 0) {
    if (target.wait) {
     target.ttl -= timer.elapsed;
     if (target.ttl <= 0) {
       target.wait = false;
     }
    } else {
      plan.targets.shift();
    }
  }
}

/**
 * Convert the given number to 1 or -1, or 0 if given 0.
 */
function to1(value: number): number {
  if (value < 0) {
    return -1;
  } else if (value > 0) {
    return 1;
  } else {
    return 0;
  }
}
