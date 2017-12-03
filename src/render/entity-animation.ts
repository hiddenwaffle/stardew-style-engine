export class EntityAnimationFrame {
  //
}

export class EntityAnimation {
  private readonly frames: EntityAnimationFrame[];

  constructor(frames: EntityAnimationFrame[]) {
    this.frames = frames;
  }
}
