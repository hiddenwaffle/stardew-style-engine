import {
  SavePlayer
} from 'src/session/save';
import { Direction } from 'src/domain/direction';
import Entity from './entity';

export default class {
  entity: Entity;

  constructor() {
    this.entity = new Entity({
      pushable: true,
      animationGroupName: 'bard-white'
    });
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

  set x(x: number) {
    this.entity.x = x;
  }

  get y() {
    return this.entity.y;
  }

  set y(y: number) {
    this.entity.y = y;
  }
}
