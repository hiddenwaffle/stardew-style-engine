import { UPSCALE } from 'src/constants';

export default class {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly call: string;
  readonly callInterval: number;
  readonly defaultTile: number;

  constructor(object: any) {
    this.name = object.name;

    // (See map-entrance.ts)
    // x needs to be aligned to the center,
    // y is already aligned to the bottom.
    this.x = (object.x + object.width / 2) * UPSCALE;
    this.y = object.y * UPSCALE;
    this.width * UPSCALE;
    this.height * UPSCALE;

    if (object.properties) {
      // TODO: This mirrors collision-layer.ts
      this.call = object.properties.call;
      if (object.properties.callInterval) {
        this.callInterval = object.properties.callInterval;
      } else {
        this.callInterval = Number.MAX_SAFE_INTEGER; // It gets called once, in practice.
      }

      this.defaultTile = object.gid;
    }
  }
}
