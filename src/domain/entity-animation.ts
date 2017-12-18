export class EntityAnimationFrame {
  private readonly x: number;
  private readonly y: number;
  private readonly delay: number;

  constructor(rawFrame: any) {
    this.x = rawFrame.x;
    this.y = rawFrame.y;
    this.delay = rawFrame.delay;
  }
}

export class EntityAnimation {
  readonly name: string;
  private readonly frames: EntityAnimationFrame[];
  private readonly next: EntityAnimation;

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

  get(name: string):EntityAnimation {
    return this.animations.get(name);
  }
}
