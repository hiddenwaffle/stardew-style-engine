import {
  TARGET_FIELD_TILE_SIZE,
  UPSCALE
} from 'src/constants';
import { SaveEntity } from 'src/session/save';
import {
  Direction,
  determineDirection
} from './direction';

export default class {
  private _id: number;
  name: string;
  x: number;
  y: number;
  dxIntended: number;
  dyIntended: number;
  speed: number;
  boundingWidth: number;
  boundingHeight: number;

  constructor() {
    this.calculateId();
    this.x = 100;
    this.y = 100;
    this.dxIntended = 0;
    this.dyIntended = 0;
    this.speed = 90 * UPSCALE; // TODO: Variable speed entities
    this.boundingWidth  = TARGET_FIELD_TILE_SIZE - 4;
    this.boundingHeight = TARGET_FIELD_TILE_SIZE - 4;
  }

  /**
   * If called outside of this class, it should be only in the
   * unlikely event that the ID was already taken.
   */
  calculateId() {
    this._id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  get id(): number {
    return this._id;
  }

  get direction(): Direction {
    return determineDirection(this.dxIntended, this.dyIntended);
  }

  applySave(save: SaveEntity) {
    this.x = save.x;
    this.y = save.y;
  }

  extractSave(): SaveEntity {
    return new SaveEntity(this.x, this.y);
  }
}
