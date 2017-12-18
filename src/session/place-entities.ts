import World from 'src/domain/world';
import Entity from 'src/domain/entity';
import entityAnimationManger from './entity-animation-manager';
import entityAnimationManager from './entity-animation-manager';

export default (world: World) => {
  // TODO: Is this the right place for it?
  world.addEntity(world.player.entity);

  for (const objectHint of world.staticMap.objectHints) {
    const entity = new Entity();

    entity.name = objectHint.name;
    entity.x = objectHint.x;
    entity.y = objectHint.y;
    entity.boundingWidth = objectHint.width;
    entity.boundingHeight = objectHint.height;
    entity.entityToEntityCollisionCall = objectHint.call;
    entity.entityToEntityCollisionCallInterval = objectHint.callInterval;
    entity.defaultTile = objectHint.defaultTile;
    entity.hidden = objectHint.hidden;
    entity.pushable = objectHint.pushable;
    entity.animationGroupName = objectHint.animationGroupName;

    world.addEntity(entity);
  }

  for (const entity of world.entities) {
    if (entity.animationGroupName) {
      entityAnimationManager.prepare(entity.animationGroupName);
    }
  }
}
