import { World } from 'src/domain/world';
import { Entity } from 'src/domain/entity';
import { MovementType } from 'src/domain/movement';

export function calculateDxDyIntended(world: World, entity: Entity) {
  const plan = entity.movementPlan;
  if (plan.type === MovementType.Player || plan.type === MovementType.Stationary) {
    return;
  }

  if (plan.type === MovementType.Wander) {
    advanceWander(world, entity);
  }
}

function advanceWander(world: World, entity: Entity) {
  // console.log(entity.name, entity.dxIntended, entity.dyIntended);
}
