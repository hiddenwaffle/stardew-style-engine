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

class MovementTarget {
  x: number;
  y: number;
  ttl: number;
  call: string;
}

export class MovementPlan {
  private _type: MovementType;

  previousDirection: Direction;
  currentDirection: Direction;
  targets: MovementTarget[];

  constructor(type?: MovementType) {
    this._type = type || MovementType.Stationary;
    this.previousDirection = Direction.None;
    this.currentDirection = Direction.None;
    this.targets = [];
  }

  get type(): MovementType {
    return this._type;
  }
}
