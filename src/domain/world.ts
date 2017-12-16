import { SaveWorld } from 'src/session/save';
import Player from './player';
import Entity from './entity';
import StaticMap from './static-map';

export default class {
  player: Player;
  private readonly _entities: Map<number, Entity>;
  staticMap: StaticMap;

  constructor() {
    this.player = new Player();
    this._entities = new Map();
    this.staticMap = new StaticMap();
  }

  clearEntities() {
    this._entities.clear();
  }

  /**
   * Ensures that the entity added to the map has a unique ID.
   */
  addEntity(entity: Entity) {
    while (true) {
      if (this._entities.has(entity.id)) {
        entity.calculateId();
      } else {
        break;
      }
    }
    this._entities.set(entity.id, entity);
  }

  entitiesSortedByY(): Entity[] {
    return Array.from(this._entities.values()).sort((a, b) => {
      return a.y - b.y;
    });
  }

  applySave(save: SaveWorld) {
    this.player.applySave(save.player);
    this.staticMap.applySave(save.staticMap);
  }

  extractSave(): SaveWorld {
    return new SaveWorld(
      this.staticMap.extractSave(),
      this.player.extractSave()
    );
  }

  get entities(): Entity[] {
    return Array.from(this._entities.values());
  }
}
