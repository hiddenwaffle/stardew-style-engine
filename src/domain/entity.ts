import {
  TARGET_FIELD_TILE_SIZE,
  UPSCALE
} from 'src/constants';
import { SaveEntity } from 'src/session/save';
import { ScriptCall } from 'src/game-master/script-call';
import timer from 'src/session/timer';
import {
  Direction,
  determineDirection
} from './direction';

class CallTimer {
  private readonly call: ScriptCall;
  private readonly interval: number;
  private currentInterval: number;

  constructor(call: ScriptCall, interval: number) {
    this.call = call;
    this.currentInterval = this.interval = interval;
  }

  advance(): boolean {
    let expired;
    this.currentInterval -= timer.elapsed;
    if (this.currentInterval <= 0) {
      this.currentInterval = this.interval + this.currentInterval;
      expired = true;
    } else {
      expired = false;
    }
    return expired;
  }
}

export default class {
  private _id: number;
  name: string;
  x: number;
  y: number;
  dxIntended: number;
  dyIntended: number;
  speed: number;
  boundingWidth: number;
  boundingHeight: number;
  callTimers: Map<string, CallTimer>;

  constructor() {
    this.calculateId();
    this.x = 100;
    this.y = 100;
    this.dxIntended = 0;
    this.dyIntended = 0;
    this.speed = 90 * UPSCALE; // TODO: Variable speed entities
    this.boundingWidth  = TARGET_FIELD_TILE_SIZE - 4;
    this.boundingHeight = TARGET_FIELD_TILE_SIZE - 4;
    this.callTimers = new Map();
  }

  clearExpiredCallTimers() {
    const expiredCalls: string[] = [];
    for (const [call, callTimer] of Array.from(this.callTimers)) {
      const expired = callTimer.advance();
      if (expired) {
        expiredCalls.push(call);
      }
    }
    for (const expiredCall of expiredCalls) {
      this.callTimers.delete(expiredCall);
    }
  }

  /**
   * Rather than running the call right away, this uses the call's
   * key to see if the entity is already in the process of running
   * the given script with parameters and context.
   */
  tryScriptCall(call: ScriptCall, interval: number): boolean {
    let allowCall = false;
    if (!this.callTimers.has(call.key)) {
      this.callTimers.set(call.key, new CallTimer(call, interval));
      allowCall = true;
    }
    return allowCall;
  }

  get id(): number {
    return this._id;
  }

  /**
   * If called outside of this class, it should be only in the
   * unlikely event that the ID was already taken.
   */
  calculateId() {
    this._id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  get direction(): Direction {
    return determineDirection(this.dxIntended, this.dyIntended);
  }

  applySave(save: SaveEntity) {
    this.x = save.x;
    this.y = save.y;
  }

  extractSave(): SaveEntity {
    return new SaveEntity(this.x, this.y);
  }
}
