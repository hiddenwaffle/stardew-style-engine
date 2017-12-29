import { World } from 'src/domain/world';
import { Entity } from 'src/domain/entity';
import { MovementType } from 'src/domain/movement';
import { timer } from 'src/session/timer';

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
  // console.log(entity.name, entity.dxIntended, entity.dyIntended);
}
