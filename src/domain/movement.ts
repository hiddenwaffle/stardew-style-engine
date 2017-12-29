import { log } from 'src/log';

export enum MovementType {
  Stationary,
  Player,
  Wander,
}

export function asMovementType(value: string): MovementType {
  // Enum conversion requires using "keyof": https://stackoverflow.com/a/42623905
  return MovementType[value as keyof typeof MovementType];
}

export class MovementPlan {
  private _type: MovementType;

  constructor(type?: MovementType) {
    this._type = type || MovementType.Stationary;
  }

  get type(): MovementType {
    return this._type;
  }
}
