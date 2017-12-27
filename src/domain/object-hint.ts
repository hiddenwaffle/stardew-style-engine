import { UPSCALE } from 'src/constants';
import { Direction } from './direction';
import { PointerType } from 'src/ui/pointer';
import { parseClickProperties } from './parse-click-properties';

export class ObjectHint {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly call: string;
  readonly callInterval: number;
  readonly clickCall: string;
  readonly mouseoverPointerType: PointerType;
  readonly defaultTile: number;
  readonly hidden: boolean;
  readonly pushable: boolean;
  readonly animationGroupName: string;
  readonly facing: string;

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

    // Read properties
    {
      // Prevent null pointer errors.
      const properties = object.properties || {};

      // TODO: This mirrors collision-layer.ts
      this.call = properties.call || null;
      if (properties.callInterval) {
        this.callInterval = properties.callInterval;
      } else {
        this.callInterval = Number.MAX_SAFE_INTEGER; // It gets called once, in practice.
      }

      [this.clickCall, this.mouseoverPointerType] = parseClickProperties(properties);

      this.hidden = properties.hidden;
      this.pushable = properties.pushable || false;
      this.facing = properties.facing || Direction.Down;

      this.animationGroupName = properties.animationGroupName || null;
    }
  }
}
