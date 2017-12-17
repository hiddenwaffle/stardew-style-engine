import World from 'src/domain/world';
import Entity from 'src/domain/entity';

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
    entity.defaultTile = objectHint.defaultTile;
    world.addEntity(entity);
  }
}
