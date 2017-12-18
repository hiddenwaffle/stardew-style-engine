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
  readonly hidden: boolean;
  readonly pushable: boolean;
  readonly animationGroupName: string;

  constructor(object: any) {
    this.name = object.name;
    this.defaultTile = object.gid;

    // (See map-entrance.ts)
    // x needs to be aligned to the center,
    // y is already aligned to the bottom.
    this.x = (object.x + object.width / 2) * UPSCALE;
    this.y = object.y * UPSCALE;
    this.width = object.width * UPSCALE;
    this.height = object.width * UPSCALE;

    if (object.properties) {
      // TODO: This mirrors collision-layer.ts
      this.call = object.properties.call;
      if (object.properties.callInterval) {
        this.callInterval = object.properties.callInterval;
      } else {
        this.callInterval = Number.MAX_SAFE_INTEGER; // It gets called once, in practice.
      }

      this.hidden = object.properties.hidden;
      this.pushable = object.properties.pushable || false;

      this.animationGroupName = object.properties.animationGroupName || null;
    }
  }
}
