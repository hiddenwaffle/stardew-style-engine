import { UPSCALE } from 'src/constants';

export default class {
  readonly name: string;
  readonly x: number;
  readonly y: number;

  /**
   * x needs to be aligned to the center,
   * y is already aligned to the bottom.
   */
  constructor(object: any) {
    this.name = object.name;
    this.x = (object.x + object.width / 2) * UPSCALE;
    this.y = object.y * UPSCALE;
  }
}