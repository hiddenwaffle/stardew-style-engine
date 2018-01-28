import { log } from 'src/log';
import { TARGET_FIELD_TILE_SIZE } from 'src/constants';

export enum MovementType {
  Stationary = 1,
  Player     = 2,
  Wander     = 3,
  Patrol     = 4,
}

export function asMovementType(value: string): MovementType {
  // Enum conversion requires using "keyof": https://stackoverflow.com/a/42623905
  return MovementType[value as keyof typeof MovementType];
}

/**
 * Expects string to have a format like, "10 2, 3 11, 24 24"
 * but can also have other optional values (see MovementTarget).
 */
export function parseMovementTileXYs(raw: string): MovementTarget[] {
  if (!raw) {
    return [];
  }
  return raw.trim().split(',').map((rawPair) => {
    const arr = rawPair.trim().split(/ +/);
    if (arr.length >= 2 || arr.length <= 4) { // 2 and 4 are the min/max param count for MovementTarget()
      // TODO: Add parsing error handling?
      const x = parseInt(arr[0], 10) * TARGET_FIELD_TILE_SIZE;
      const y = parseInt(arr[1], 10) * TARGET_FIELD_TILE_SIZE;
      const wait = arr[2] ? arr[2].toUpperCase() === 'TRUE' : false;
      const ttl = parseInt(arr[3], 10) || null;
      return new MovementTarget(x, y, wait, ttl);
    } else {
      log('warn', 'Received an unexpected number of X, Y arguments', raw);
      return null;
    }
  }).filter((value) => value !== null);
}

export class MovementTarget {
  readonly x: number;
  readonly y: number;
  wait: boolean;
  ttl: number;

  _xstart: number;
  _ystart: number;
  initialized: boolean;

  constructor(
    x: number,
    y: number,
    wait?: boolean,
    ttl?: number,
  ) {
    this.x = x;
    this.y = y;
    this.wait = wait || false;
    this.ttl = ttl || 0;
    this._xstart = -1;
    this._ystart = -1;
    this.initialized = false;
  }

  initialize(xstart: number, ystart: number) {
    this._xstart = xstart;
    this._ystart = ystart;
    this.initialized = true;
  }

  get xstart(): number {
    if (!this.initialized) {
      log('error', 'Using xstart before initialization');
    }
    return this._xstart;
  }

  get ystart(): number {
    if (!this.initialized) {
      log('error', 'Using ystart before initialization');
    }
    return this._ystart;
  }
}

export class MovementPlan {
  readonly type: MovementType;
  private readonly targets: MovementTarget[];
  readonly finishedCall: string;

  constructor(
    type: MovementType,
    targets: MovementTarget[],
    finishedCall?: string,
  ) {
    this.type = type || MovementType.Stationary;
    this.targets = targets;
    this.finishedCall = finishedCall || null;
  }

  addTarget(target: MovementTarget) {
    this.targets.push(target);
  }

  setCurrentTargetComplete() {
    this.targets.shift();
  }

  get currentTarget(): MovementTarget {
    return this.targets[0];
  }
}
