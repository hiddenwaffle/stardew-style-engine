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
} from 'src/domain/direction';
import { tryAnimationSwitch } from './try-animation-switch';

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
    // Determine a new target
    const target = new MovementTarget(
      entity.x,
      entity.y,
      entity.x + 64 * (Math.random() < 0.5 ? 1 : -1), // TODO: Make a real target
      entity.y + 64 * (Math.random() < 0.5 ? 1 : -1), // TODO: Make a real target
    );
    plan.targets.push(target);
  } else {
    const target = plan.targets[0];

    const dxstart = to1(target.x - target.xstart);
    const dystart = to1(target.y - target.ystart);

    const dxprogress = to1(target.x - entity.x);
    const dyprogress = to1(target.y - entity.y);

    const dx = dxstart !== dxprogress ? 0 : dxprogress;
    const dy = dystart !== dyprogress ? 0 : dyprogress;

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
 * Convert the given number to 1 or -1.
 */
function to1(value: number): number {
  if (value === 0) {
    return 0;
  } else {
    return value / Math.abs(value);
  }
}
