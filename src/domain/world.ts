import { SaveWorld } from 'src/session/save';
import Player from './player';
import Entity from './entity';
import StaticMap from './static-map';

export default class {
  player: Player;
  entities: Map<number, Entity>;
  staticMap: StaticMap;

  constructor() {
    this.player = new Player();
    this.entities = new Map();
    this.staticMap = new StaticMap();
  }

  applySave(save: SaveWorld) {
    this.player.applySave(save.player);
    this.staticMap.applySave(save.staticMap);

    // TODO: Remove this?
    this.addEntity(this.player.entity);

    // TODO: Remove this
    const other = new Entity();
    other.x = 350;
    other.y = 375;
    other.name = 'other';
    this.addEntity(other);
  }

  extractSave(): SaveWorld {
    return new SaveWorld(
      this.staticMap.extractSave(),
      this.player.extractSave()
    );
  }

  /**
   * Ensures that the entity added to the map has a unique ID.
   */
  private addEntity(entity: Entity) {
    while (true) {
      if (this.entities.has(entity.id)) {
        entity.calculateId();
      } else {
        break;
      }
    }
    this.entities.set(entity.id, entity);
  }
}
