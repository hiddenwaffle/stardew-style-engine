import { log } from 'src/log';
import {
  determineDirection,
  Direction,
} from './direction';

export enum MovementType {
  Stationary,
  Player,
  Wander,
}

export function asMovementType(value: string): MovementType {
  // Enum conversion requires using "keyof": https://stackoverflow.com/a/42623905
  return MovementType[value as keyof typeof MovementType];
}

export class MovementTarget {
  readonly xstart: number;
  readonly ystart: number;
  readonly x: number;
  readonly y: number;
  wait: boolean;
  ttl: number;

  constructor(xstart: number, ystart: number, x: number, y: number, wait?: boolean) {
    this.xstart = xstart;
    this.ystart = ystart;
    this.x = x;
    this.y = y;
    this.wait = wait || false;
  }
}

export class MovementPlan {
  type: MovementType;
  targets: MovementTarget[];
  finishedCall: string;

  constructor(type?: MovementType, finishedCall?: string) {
    this.type = type || MovementType.Stationary;
    this.targets = [];
    this.finishedCall = finishedCall || null;
  }
}
