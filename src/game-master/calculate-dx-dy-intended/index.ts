import { World } from 'src/domain/world';
import { Entity } from 'src/domain/entity';
import {
  MovementType,
} from 'src/domain/movement';
import { wander } from './wander';
import { patrol } from './patrol';

export function calculateDxDyIntended(world: World, entity: Entity) {
  switch (entity.movementPlan.type) {
    case MovementType.Wander:
      wander(world, entity);
      break;
    case MovementType.Patrol:
      patrol(world, entity);
      break;
    case MovementType.Player:
    case MovementType.Stationary:
    default:
      // Do nothing
  }
}
