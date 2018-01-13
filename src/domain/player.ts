import {
  SavePlayer,
} from 'src/session/save';
import { Direction } from 'src/domain/direction';
import { Entity } from './entity';
import { PLAYER_ENTITY_NAME } from 'src/constants';

export class Player {
  entity: Entity;

  constructor(save: SavePlayer) {
    this.entity = new Entity({
      name: PLAYER_ENTITY_NAME,
      properties: {
        pushable: true,
        animationGroupName: 'af-pirate-red',
      }
    });
  }

  extractSave(): SavePlayer {
    return new SavePlayer(
      this.entity.animationGroupName,
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
