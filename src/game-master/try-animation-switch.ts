import { Entity } from 'src/domain/entity';
import { Direction } from 'src/domain/direction';

/**
 * Helps switch walking animations for player and NPC entities.
 */
export function tryAnimationSwitch(entity: Entity, walk: boolean) {
  const action = entity.dxIntended === 0 && entity.dyIntended === 0 ? 'stand' : (walk ? 'walk' : 'run');
  const direction = Direction[entity.facing].toLowerCase();
  const animationName = `${action}-${direction}`;
  entity.switchAnimation(animationName, false);
}
