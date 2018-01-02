import {
  SavePlayer,
} from 'src/session/save';
import { Direction } from 'src/domain/direction';
import { Entity } from './entity';

export class Player {
  entity: Entity;

  constructor(save: SavePlayer) {
    this.entity = new Entity({
      animationGroupName: 'af-pirate-red',
      facing: save.entity.facing,
      pushable: true,
      x: save.entity.x,
      y: save.entity.y,
    });
  }

  extractSave(): SavePlayer {
    return new SavePlayer(
      this.entity.extractSave(),
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
