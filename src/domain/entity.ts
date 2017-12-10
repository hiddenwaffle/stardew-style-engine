import { DEFAULT_FIELD_TILE_SIZE, UPSCALE } from 'src/constants';
import { SaveEntity } from 'src/session/save';

export default class {
  name: string;
  x: number;
  y: number;
  dxIntended: number;
  dyIntended: number;
  velocity: number;
  boundingWidth: number;
  boundingHeight: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.dxIntended = 0;
    this.dyIntended = 0;
    this.velocity = 0;
    this.boundingWidth  = (DEFAULT_FIELD_TILE_SIZE - 1) * UPSCALE;
    this.boundingHeight = (DEFAULT_FIELD_TILE_SIZE - 1) * UPSCALE;
  }

  applySave(save: SaveEntity) {
    this.x = save.x;
    this.y = save.y;
  }

  extractSave(): SaveEntity {
    return new SaveEntity(this.x, this.y);
  }
}
