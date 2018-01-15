import {
  TARGET_FIELD_TILE_SIZE,
  UPSCALE,
} from 'src/constants';
import { ScriptCall } from 'src/game-master/script-call';
import { timer } from 'src/session/timer';
import {
  EntityAnimationGroup,
  EntityAnimation,
  determineCurrentAnimationCoordinates,
} from 'src/domain/entity-animation';
import { entityAnimationGroupManager } from 'src/session/entity-animation-group-manager';
import {
  Direction,
  asDirection,
  determineDirection,
  DirectionsOfFreedom,
} from './direction';
import { nextId } from 'src/session/id-generator';
import { PointerType } from 'src/ui/pointer';
import { MovementPlan, asMovementType, MovementType } from 'src/domain/movement';
import { SaveEntity } from 'src/session/save';
import {
  asOverlapType,
  OverlapType,
} from 'src/domain/overlap-type';
import { parseClickProperties } from './parse-click-properties';
import { mergeMixins } from 'src/external/mixin';
import { imageLoader } from 'src/session/image-loader';
import { calculateInitialImageSize } from 'src/math/calculate-initial-image-size';

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

  saveable: boolean;

  entityToEntityCollisionOverlapType: OverlapType;
  entityToEntityCollisionCall: string;
  entityToEntityCollisionCallInterval: number;
  clickCall: string;
  mouseoverPointerType: PointerType;
  private callTimers: Map<string, CallTimer>;

  hidden: boolean;
  defaultTile: number;
  animationGroup: EntityAnimationGroup;
  animation: EntityAnimation;
  animationFrameIndex: number;
  animationFrameTime: number;

  // These are determined by either the first animation groups frame or the bounding box.
  initialImageWidth: number;
  initialImageHeight: number;

  private _movementPlan: MovementPlan;

  constructor(object: any) {
    this._id = object.id || nextId();
    this.name = object.name || 'UNKNOWN_' + this._id; // TODO: UNKNOWN_* cannot be saved and restored.

    // (See map-entrance.ts)
    // x needs to be aligned to the center,
    // y is already aligned to the bottom.
    this.x = ((object.x + object.width / 2) * UPSCALE) || 100;
    this.y = (object.y * UPSCALE) || 100;

    this.dxIntended = object.dxIntended || 0;
    this.dyIntended = object.dyIntended || 0;

    {
      // Parse mixins, if any.
      const properties = mergeMixins(object.properties);

      this.facing = asDirection(properties.facing) || Direction.Down;
      this.speed = properties.speed || 90 * UPSCALE; // TODO: Variable speed entities
      this.boundingWidth = TARGET_FIELD_TILE_SIZE - 4;
      this.boundingHeight = TARGET_FIELD_TILE_SIZE - 4;
      this.pushable = properties.pushable || false;

      this.saveable = properties.saveable || false;

      // TODO: This mirrors collision-layer.ts
      this.entityToEntityCollisionOverlapType = asOverlapType(properties.collisionOverlapType) || OverlapType.Overlap;
      this.entityToEntityCollisionCall = properties.collisionCall || null;
      // Use of 'MAX_SAFE_INTEGER' here means that it gets called only once, in practice.
      this.entityToEntityCollisionCallInterval = properties.collisionCallInterval || Number.MAX_SAFE_INTEGER;
      [this.clickCall, this.mouseoverPointerType] = parseClickProperties(properties);
      this.callTimers = new Map();

      this.hidden = properties.hidden || false;
      this.defaultTile = properties.defaultTile || 0; // TODO: Any better default value for this?
      if (properties.animationGroupName) {
        this.animationGroup = entityAnimationGroupManager.get(properties.animationGroupName);
      } else {
        this.animationGroup = null;
      }
      if (this.animationGroup) {
        if (properties.initialAnimationName) {
          this.animation = this.animationGroup.get(properties.initialAnimationName);
        } else {
          this.animation = this.animationGroup.get();
        }
      } else {
        this.animation = null;
      }
      this.animationFrameIndex = properties.animationFrameIndex || 0;
      this.animationFrameTime = properties.animationFrameTime || 0;

      const movementType = asMovementType(properties.movementType) || MovementType.Stationary;
      this._movementPlan = new MovementPlan(movementType);

      // "Guess" the image size from the animationGroup.
      [this.initialImageWidth, this.initialImageHeight] = calculateInitialImageSize(this.animationGroup);
      this.initialImageWidth = this.initialImageWidth || this.boundingWidth;
      this.initialImageHeight = this.initialImageHeight || this.boundingHeight;
    }
  }

  start(save: SaveEntity) {
    this.x = save.x || this.x;
    this.y = save.y || this.y;
    this.facing = asDirection(save.facing) || this.facing;
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
    // Center x to middle and y to bottom.
    const left    = this.x - this.boundingWidth / 2;
    const right   = this.x + this.boundingWidth / 2;
    const top     = this.y - this.boundingHeight;
    const bottom  = this.y + 1; // +1 to prevent entity's y to be on a solid tile directly below the entity.
    return [left, right, top, bottom];
  }

  calculateImageBox(): [number, number, number, number] {
    // Center x to middle and y to bottom.
    const left    = this.x - this.initialImageWidth / 2;
    const right   = this.x + this.initialImageWidth / 2;
    const top     = this.y - this.initialImageHeight;
    const bottom  = this.y;
    return [left, right, top, bottom];
  }

  overlapBoundingBox(
    left1: number, right1: number, top1: number, bottom1: number,
  ): boolean {
    const [left2, right2, top2, bottom2] = this.calculateBoundingBox();
    return this.overlap(
      left1, right1, top1, bottom1,
      left2, right2, top2, bottom2,
    )
  }

  overlapImage(
    left1: number, right1: number, top1: number, bottom1: number,
  ): boolean {
    const [left2, right2, top2, bottom2] = this.calculateImageBox();
    return this.overlap(
      left1, right1, top1, bottom1,
      left2, right2, top2, bottom2,
    )
  }

  /**
   * TODO: Duplicated in tile-layer.ts
   *
   * AABB Collision (Without Response)
   * Based on: https://stackoverflow.com/a/2752387
   */
  overlap(
    left1: number, right1: number, top1: number, bottom1: number,
    left2: number, right2: number, top2: number, bottom2: number,
  ): boolean {
    return (
      left2   < right1  &&
      right2  > left1   &&
      top2    < bottom1 &&
      bottom2 > top1
    );
  }

  /**
   * https://stackoverflow.com/a/21220004
   * Like overlap() but returns true if the entities are overlapping by a percentage.
   */
  eclipse(
    left1: number, right1: number, top1: number, bottom1: number, pct: number,
  ): boolean {
    const [left2, right2, top2, bottom2] = this.calculateBoundingBox();
    const otherArea = (right1 - left1) * (bottom1 - top1);
    const thisArea  = (right2 - left2) * (bottom2 - top2);
    const intersectionArea =
      Math.max(0, Math.min( right1,  right2) - Math.max(left1, left2)) *
      Math.max(0, Math.min(bottom1, bottom2) - Math.max( top1,  top2));
    const denominator = otherArea + thisArea - intersectionArea;
    return (intersectionArea / (denominator || 0.001)) > pct;
  }

  extractSave(): SaveEntity {
    return new SaveEntity(
      this.name,
      this.x,
      this.y,
      this.facing,
    );
  }

  get id(): number {
    return this._id;
  }

  get xtile(): number {
    return Math.floor(this.x / TARGET_FIELD_TILE_SIZE);
  }

  get ytile(): number {
    return Math.floor(this.y / TARGET_FIELD_TILE_SIZE);
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

  get animationGroupName(): string {
    return this.animationGroup && this.animationGroup.name || 'none'; // TODO: Something other than 'none'?
  }

  get movementPlan(): MovementPlan {
    return this._movementPlan;
  }
}
