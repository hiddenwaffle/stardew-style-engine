import { UPSCALE } from 'src/constants';
import { Direction } from './direction';
import { PointerType } from 'src/ui/pointer';
import { parseClickProperties } from './parse-click-properties';
import {
  MovementType,
  asMovementType,
} from 'src/domain/movement';
import {
  asOverlapType,
  OverlapType,
} from 'src/domain/overlap-type';

export class ObjectHint {
  readonly name: string;

  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  readonly collisionOverlapType: OverlapType;
  readonly collisionCall: string;
  readonly collisionCallInterval: number;

  readonly clickCall: string;
  readonly mouseoverPointerType: PointerType;
  readonly defaultTile: number;
  readonly hidden: boolean;
  readonly pushable: boolean;
  readonly animationGroupName: string;
  readonly facing: string;
  readonly movementType: MovementType;

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
      this.collisionOverlapType = asOverlapType(properties.collisionOverlapType) || OverlapType.Overlap;
      this.collisionCall = properties.collisionCall || null;
      if (properties.collisionCallInterval) {
        this.collisionCallInterval = properties.collisionCallInterval;
      } else {
        this.collisionCallInterval = Number.MAX_SAFE_INTEGER; // It gets called once, in practice.
      }

      [this.clickCall, this.mouseoverPointerType] = parseClickProperties(properties);

      this.hidden = properties.hidden;
      this.pushable = properties.pushable || false;
      this.facing = properties.facing || Direction.Down;

      this.animationGroupName = properties.animationGroupName || null;

      this.movementType = asMovementType(properties.movementType) || MovementType.Stationary;
    }
  }
}
