export class EntityAnimationFrame {
  readonly x: number;
  readonly y: number;
  readonly delay: number;
  readonly flipped: boolean;

  constructor(rawFrame: any) {
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
  readonly imagePath: string;
  private readonly animations: Map<string, EntityAnimation>;

  constructor(rawFile: any) {
    this.imagePath = rawFile.filename;
    this.animations = new Map();
    for (const rawAnimation of rawFile.animations) {
      const animation = new EntityAnimation(rawAnimation);
      this.animations.set(rawAnimation.name, animation);
    }
  }

  add(animation: EntityAnimation) {
    if (animation) {
      this.animations.set(animation.name, animation);
    }
  }

  get(name?: string):EntityAnimation {
    if (name) {
      return this.animations.get(name);
    } else {
      return this.animations.get('default');
    }
  }
}

export function determineCurrentAnimationCoordinates(
  animation: EntityAnimation,
  frameIndex: number,
  elapsedInFrame: number
): [number, number, boolean] {
  let x = 0;
  let y = 0;
  let flipped = false;

  if (animation && frameIndex >= 0 && frameIndex < animation.frames.length) {
    x = animation.frames[frameIndex].x;
    y = animation.frames[frameIndex].y;
    flipped = animation.frames[frameIndex].flipped;
  }

  return [x, y, flipped];
}
