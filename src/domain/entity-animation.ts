export class EntityAnimationFrame {
  readonly x: number;
  readonly y: number;
  readonly delay: number;
}

export class EntityAnimation {
  readonly name: string;
  readonly frames: EntityAnimationFrame[];
  readonly next: EntityAnimation;

  constructor(frames: EntityAnimationFrame[], next?: EntityAnimation) {
    this.frames = frames;
    this.next = next || null;
  }
}

export class EntityAnimationGroup {
  readonly imagePath: string;
  private readonly animations: Map<string, EntityAnimation>;

  constructor(imagePath: string, raw: any) {
    this.imagePath = imagePath;
    this.animations = new Map();
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
