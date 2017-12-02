import { Save } from 'src/session/save';
import Player from './player';
import StaticMap from './static-map';

export default class {
  player: Player;
  staticMap: StaticMap;

  constructor() {
    this.player = new Player();
    this.staticMap = new StaticMap();
  }

  applySave(save: Save) {
    this.player.applySave(save.player);
    this.staticMap.applySave(save.staticMap);
  }

  extractSave(): Save {
    return new Save(
      this.staticMap.extractSave(),
      this.player.extractSave()
    );
  }
}
