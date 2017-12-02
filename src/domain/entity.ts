import { SaveEntity } from 'src/session/save';

export default class {
  name: string;
  x: number;
  y: number;
  dxIntended: number;
  dyIntended: number;
  velocity: number;

  constructor(save?: SaveEntity) {
    if (save) {
      //
    } else {
      //
    }
  }

  extractSave(): SaveEntity {
    return new SaveEntity(this.x, this.y);
  }
}
