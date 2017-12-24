import { log } from 'src/log';
import {
  TARGET_FIELD_TILE_SIZE,
  UPSCALE,
} from 'src/constants';
import { SaveEntity } from 'src/session/save';
import { ScriptCall } from 'src/game-master/script-call';
import { timer } from 'src/session/timer';
import {
  EntityAnimationGroup,
  EntityAnimation,
  determineCurrentAnimationCoordinates,
} from 'src/domain/entity-animation';
import { entityAnimationGroupManager } from 'src/session/entity-animation-group-manager';
import {
  Sheet,
  imageLoader,
} from 'src/session/image-loader';
import {
  Direction,
  determineDirection,
  DirectionsOfFreedom,
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

export class Entity {
  private _id: number;
  name: string;
  x: number;
  y: number;
  dxIntended: number;
  dyIntended: number;
  facing: Direction;
  speed: number;
  boundingWidth: number;
  boundingHeight: number;
  pushable: boolean;

  entityToEntityCollisionCall: string;
  entityToEntityCollisionCallInterval: number;
  callTimers: Map<string, CallTimer>;

  hidden: boolean;
  defaultTile: number;
  animationGroup: EntityAnimationGroup;
  animation: EntityAnimation;
  animationFrameIndex: number;
  animationFrameTime: number;

  constructor(args: any) {
    this.calculateId();

    this.name = args.name || 'UNKNOWN';
    this.x = args.x || 100;
    this.y = args.y || 100;
    this.dxIntended = args.dxIntended || 0;
    this.dyIntended = args.dyIntended || 0;
    // Enum conversion requires using "keyof": https://stackoverflow.com/a/42623905
    this.facing = Direction[args.facing as keyof typeof Direction] || Direction.Down;
    this.speed = args.speed || 90 * UPSCALE; // TODO: Variable speed entities
    this.boundingWidth = args.boundingWidth || TARGET_FIELD_TILE_SIZE - 4;
    this.boundingHeight = args.boundingHeight || TARGET_FIELD_TILE_SIZE - 4;
    this.pushable = args.pushable || false;

    this.entityToEntityCollisionCall = args.entityToEntityCollisionCall || null;
    this.entityToEntityCollisionCallInterval = args.entityToEntityCollisionCallInterval || Number.MAX_SAFE_INTEGER;
    this.callTimers = new Map();

    this.hidden = args.hidden || false;
    this.defaultTile = args.defaultTile || 0; // TODO: Any better default value for this?
    if (args.animationGroupName) {
      this.animationGroup = entityAnimationGroupManager.get(args.animationGroupName);
    } else {
      this.animationGroup = null;
    }
    if (this.animationGroup) {
      if (args.initialAnimationName) {
        this.animation = this.animationGroup.get(args.initialAnimationName);
      } else {
        this.animation = this.animationGroup.get();
      }
    } else {
      this.animation = null;
    }
    this.animationFrameIndex = args.animationFrameIndex || 0;
    this.animationFrameTime = args.animationFrameTime || 0;
  }

  step() {
    if (this.animationGroup && this.animation) {
      this.animationFrameTime += timer.elapsed;
      if (this.animationFrameTime >= this.animation.frames[this.animationFrameIndex].delay) {
        this.animationFrameTime = this.animationFrameTime - this.animation.frames[this.animationFrameIndex].delay;
        this.animationFrameIndex += 1;
        if (this.animationFrameIndex >= this.animation.frames.length) {
          this.animationFrameIndex = 0;
          if (this.animation.next) {
            this.animation = this.animationGroup.get(this.animation.next);
          }
        }
      }
    }
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

  switchAnimation(name: string, reset: boolean) {
    if (this.animationGroup) {
      const newAnimation = this.animationGroup.get(name) || this.animationGroup.get();
      if (reset || newAnimation !== this.animation) {
        this.animationFrameIndex = 0;
        this.animationFrameTime = 0;
      }
      this.animation = newAnimation;
    }
  }

  currentAnimationFrame(): [string, number, number, boolean] {
    const [imagePathIndex, x, y, flipped] = determineCurrentAnimationCoordinates(
      this.animation,
      this.animationFrameIndex,
      this.animationFrameTime,
    );
    return [this.animationGroup.imagePaths[imagePathIndex], x, y, flipped];
  }

  calculateBoundingBox(): [number, number, number, number] {
    // Calculate bounding box -- center x to middle and y to bottom.
    const left    = this.x - this.boundingWidth / 2;
    const right   = this.x + this.boundingWidth / 2;
    const top     = this.y - this.boundingHeight;
    const bottom  = this.y + 1; // +1 to prevent entity's y to be on a solid tile directly below the entity.
    return [left, right, top, bottom];
  }

  /**
   * AABB Collision (Without Response)
   * Based on: https://stackoverflow.com/a/2752387
   */
  overlap(
    left1: number, right1: number, top1: number, bottom1: number,
  ): boolean {
    const [left2, right2, top2, bottom2] = this.calculateBoundingBox();
    return (
      left2   < right1  &&
      right2  > left1   &&
      top2    < bottom1 &&
      bottom2 > top1
    );
  }

  extractSave(): SaveEntity {
    return new SaveEntity(this.x, this.y, this.facing);
  }

  get id(): number {
    return this._id;
  }

  get direction(): Direction {
    return determineDirection(this.dxIntended, this.dyIntended);
  }

  get directionsOfFreedom(): DirectionsOfFreedom {
    if (this.animationGroup) {
      return this.animationGroup.directionsOfFreedom;
    } else {
      return DirectionsOfFreedom.One;
    }
  }

  get rawImagePaths(): string[] {
    if (this.animationGroup) {
      return this.animationGroup.imagePaths || [];
    }
    return [];
  }

  get hasAnimation(): boolean {
    return !!this.animationGroup;
  }
}
