import { UPSCALE } from 'src/constants';

export class MapEntrance {
  readonly name: string;
  readonly x: number;
  readonly y: number;

  /**
   * (See object-hint.ts)
   * x needs to be aligned to the center,
   * y is already aligned to the bottom.
   */
  constructor(object: any) {
    this.name = object.name;
    this.x = (object.x + object.width / 2) * UPSCALE;
    this.y = object.y * UPSCALE;
  }
}
