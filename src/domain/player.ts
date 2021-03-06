import {
  SavePlayer,
} from 'src/session/save';
import { Entity } from './entity';
import { PLAYER_ENTITY_NAME } from 'src/constants';

export class Player {
  entity: Entity;

  constructor(save: SavePlayer) {
    this.entity = new Entity({
      name: PLAYER_ENTITY_NAME,
      properties: {
        animationGroupName: 'af-pirate-red',
        pushable: true,
        saveable: true,
        targetable: true,
      },
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
