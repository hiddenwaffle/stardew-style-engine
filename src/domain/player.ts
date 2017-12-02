import { SavePlayer } from 'src/session/save';
import Entity from './entity';

export default class {
  entity: Entity;

  constructor(save: SavePlayer) {
    console.log('TODO: save.x');
    console.log('TODO: save.y');
  }

  get x(): number {
    return 3;
  }

  get y(): number {
    return 7;
  }
}
