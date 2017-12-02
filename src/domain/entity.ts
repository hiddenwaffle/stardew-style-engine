import { SaveEntity } from 'src/session/save';

export default class {
  name: string;
  x: number;
  y: number;
  dxIntended: number;
  dyIntended: number;
  velocity: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.dxIntended = 0;
    this.dyIntended = 0;
    this.velocity = 0;
  }

  setIntendedDirection(dxIntended: number, dyIntended: number) {
    this.dxIntended = dxIntended;
    this.dyIntended = dyIntended;
  }

  applySave(save: SaveEntity) {
    this.x = save.x;
    this.y = save.y;
  }

  extractSave(): SaveEntity {
    return new SaveEntity(this.x, this.y);
  }
}
