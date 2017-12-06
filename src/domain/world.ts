import { SaveWorld } from 'src/session/save';
import Player from './player';
import Entity from './entity';
import StaticMap from './static-map';

export default class {
  player: Player;
  entities: Entity[];
  staticMap: StaticMap;

  constructor() {
    this.player = new Player();
    this.entities = [];
    this.staticMap = new StaticMap();
  }

  applySave(save: SaveWorld) {
    this.player.applySave(save.player);
    this.staticMap.applySave(save.staticMap);

    // TODO: Remove this?
    this.entities.push(this.player.entity);

    // TODO: Remove this
    const other = new Entity();
    other.x = 350;
    other.y = 375;
    other.name = 'other';
    this.entities.push(other);
  }

  extractSave(): SaveWorld {
    return new SaveWorld(
      this.staticMap.extractSave(),
      this.player.extractSave()
    );
  }
}
