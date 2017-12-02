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
    this.entities.push(this.player.entity);
  }

  extractSave(): SaveWorld {
    return new SaveWorld(
      this.staticMap.extractSave(),
      this.player.extractSave()
    );
  }
}
