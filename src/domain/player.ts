import {
  SavePlayer
} from 'src/session/save';
import Entity from './entity';

export default class {
  entity: Entity;

  constructor() {
    this.entity = new Entity();
  }

  applySave(save: SavePlayer) {
    //
  }

  extractSave(): SavePlayer {
    return new SavePlayer(
      this.entity.extractSave()
    );
  }

  // TODO: Remove these
  get x() { return 10; }
  get y() { return 5; }
}
