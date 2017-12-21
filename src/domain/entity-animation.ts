import {
  DirectionsOfFreedom,
  deriveDirectionsOfFreedom,
} from 'src/domain/direction';

export class EntityAnimationFrame {
  readonly imageIndex: number;
  readonly x: number;
  readonly y: number;
  readonly delay: number;
  readonly flipped: boolean;

  constructor(rawFrame: any) {
    this.imageIndex = rawFrame.imageIndex || 0;
    this.x = rawFrame.x;
    this.y = rawFrame.y;
    this.delay = rawFrame.delay;
    this.flipped = rawFrame.flipped || false;
  }
}

export class EntityAnimation {
  readonly name: string;
  readonly frames: EntityAnimationFrame[];
  readonly next: string;

  constructor(rawAnimation: any) {
    this.name = rawAnimation.name;
    this.frames = [];
    for (const rawFrame of rawAnimation.frames) {
      const frame = new EntityAnimationFrame(rawFrame);
      this.frames.push(frame);
    }
    this.next = rawAnimation.next || null;
  }
}

export class EntityAnimationGroup {
  readonly imagePaths: string[];
  private readonly animations: Map<string, EntityAnimation>;
  private readonly _directionsOfFreedom: DirectionsOfFreedom;

  constructor(rawFile: any) {
    this.imagePaths = rawFile.filenames;
    this.animations = new Map();
    for (const rawAnimation of rawFile.animations) {
      const animation = new EntityAnimation(rawAnimation);
      this.animations.set(rawAnimation.name, animation);
    }
    this._directionsOfFreedom = deriveDirectionsOfFreedom(
      Array.from(this.animations.keys()),
    );
  }

  add(animation: EntityAnimation) {
    if (animation) {
      this.animations.set(animation.name, animation);
    }
  }

  get(name?: string): EntityAnimation {
    if (name) {
      return this.animations.get(name);
    } else {
      return this.animations.get('default');
    }
  }

  get directionsOfFreedom(): DirectionsOfFreedom {
    return this._directionsOfFreedom;
  }
}

export function determineCurrentAnimationCoordinates(
  animation: EntityAnimation,
  frameIndex: number,
  elapsedInFrame: number,
): [number, number, number, boolean] {
  let imageIndex = 0;
  let x = 0;
  let y = 0;
  let flipped = false;

  if (animation && frameIndex >= 0 && frameIndex < animation.frames.length) {
    // Defaults to 0 (first sheet) if unspecified.
    imageIndex = animation.frames[frameIndex].imageIndex || 0;

    x = animation.frames[frameIndex].x;
    y = animation.frames[frameIndex].y;

    // Default to false (unflipped) if unspecified.
    flipped = animation.frames[frameIndex].flipped || false;
  }

  return [imageIndex, x, y, flipped];
}
