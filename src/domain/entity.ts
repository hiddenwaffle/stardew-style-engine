import {
  TARGET_FIELD_TILE_SIZE,
  UPSCALE
} from 'src/constants';
import { SaveEntity } from 'src/session/save';
import { ScriptCall } from 'src/game-master/script-call';
import timer from 'src/session/timer';
import { EntityAnimationGroup } from 'src/domain/entity-animation';
import { Sheet, default as imageLoader } from 'src/session/image-loader';
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

  get tileLayerName(): string {
    return this.call && this.call.tileLayerName || null;
  }

  get secondaryEntityId(): number {
     return this.call && this.call.secondaryEntityId || null;
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
  entityToEntityCollisionCall: string;
  entityToEntityCollisionCallInterval: number;
  callTimers: Map<string, CallTimer>;
  defaultTile: number;
  hidden: boolean;
  pushable: boolean;

  animationGroupName: string;
  animationGroup: EntityAnimationGroup;

  constructor() {
    this.calculateId();
    this.x = 100;
    this.y = 100;
    this.dxIntended = 0;
    this.dyIntended = 0;
    this.speed = 90 * UPSCALE; // TODO: Variable speed entities
    this.boundingWidth  = TARGET_FIELD_TILE_SIZE - 4;
    this.boundingHeight = TARGET_FIELD_TILE_SIZE - 4;
    this.entityToEntityCollisionCall = null;
    this.entityToEntityCollisionCallInterval = Number.MAX_SAFE_INTEGER; // Default to 'once'.
    this.callTimers = new Map();
    this.defaultTile = 2000; // TODO: Set this back to zero once player animations are set.
    this.hidden = false;
    this.pushable = false;

    this.animationGroupName = null;
    this.animationGroup = null;
  }

  clearExpiredCallTimers() {
    const keys: string[] = [];
    for (const [key, callTimer] of Array.from(this.callTimers)) {
      const expired = callTimer.advance();
      if (expired) {
        keys.push(key);
      }
    }
    for (const key of keys) {
      this.callTimers.delete(key);
    }
  }

  clearCallTimersNotInLayersNames(layerNames: string[]) {
    const keys: string[] = [];
    for (const [key, callTimer] of Array.from(this.callTimers)) {
      if (callTimer.tileLayerName) {
        const notFound = !layerNames.includes(callTimer.tileLayerName);
        if (notFound) {
          keys.push(key);
        }
      }
    }
    for (const key of keys) {
      this.callTimers.delete(key);
    }
  }

  clearCallTimersNotInSecondaryEntityIds(collisionSecondaryEntityIds: number[]) {
    const keys: string[] = [];
    for (const [key, callTimer] of Array.from(this.callTimers)) {
      if (callTimer.secondaryEntityId) {
        const notFound = !collisionSecondaryEntityIds.includes(callTimer.secondaryEntityId);
        if (notFound) {
          keys.push(key);
        }
      }
    }
    for (const key of keys) {
      this.callTimers.delete(key);
    }
  }

  /**
   * Rather than running the call right away, this uses the call's
   * key to see if the entity is already in the process of running
   * the given script with parameters and context.
   */
  tryScriptCall(call: ScriptCall, interval: number): boolean {
    let alreadyScheduledToBeCalled = false;
    if (!this.callTimers.has(call.key)) {
      this.callTimers.set(call.key, new CallTimer(call, interval));
      alreadyScheduledToBeCalled = true;
    }
    return alreadyScheduledToBeCalled;
  }

  /**
   * If called outside of this class, it should be only in the
   * unlikely event that the ID was already taken.
   */
  calculateId() {
    this._id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  currentAnimationFrame(): [string, number, number] {
    // TODO: Get the real x and ys
    let x = 12;
    let y = 11;
    return [this.animationGroup.imagePath, x, y];
  }

  applySave(save: SaveEntity) {
    this.x = save.x;
    this.y = save.y;
  }

  extractSave(): SaveEntity {
    return new SaveEntity(this.x, this.y);
  }

  get id(): number {
    return this._id;
  }

  get direction(): Direction {
    return determineDirection(this.dxIntended, this.dyIntended);
  }

  get hasAnimation(): boolean {
    return !!this.animationGroup;
  }
}
