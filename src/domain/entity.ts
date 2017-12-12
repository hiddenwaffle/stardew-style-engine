import {
  TARGET_FIELD_TILE_SIZE,
  UPSCALE
} from 'src/constants';
import { SaveEntity } from 'src/session/save';

export default class {
  name: string;
  x: number;
  y: number;
  dxIntended: number;
  dyIntended: number;
  speed: number;
  boundingWidth: number;
  boundingHeight: number;

  constructor() {
    this.x = 100;
    this.y = 100;
    this.dxIntended = 0;
    this.dyIntended = 0;
    this.speed = 90 * UPSCALE; // TODO: Variable speed entities
    this.boundingWidth  = TARGET_FIELD_TILE_SIZE - 4;
    this.boundingHeight = TARGET_FIELD_TILE_SIZE - 4;
  }

  applySave(save: SaveEntity) {
    this.x = save.x;
    this.y = save.y;
  }

  extractSave(): SaveEntity {
    return new SaveEntity(this.x, this.y);
  }
}
