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
    this.entity.applySave(save.entity);
  }

  extractSave(): SavePlayer {
    return new SavePlayer(
      this.entity.extractSave()
    );
  }

  get x() {
    return this.entity.x;
  }

  get y() {
    return this.entity.y;
  }
}