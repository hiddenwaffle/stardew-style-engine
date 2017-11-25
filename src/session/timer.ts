class Timer {
  private lastStep: number;
  private _elapsed: number;

  constructor() {
    this.lastStep = Date.now();
    this._elapsed = 1;
  }

  start(runEachFrame: () => void) {
    this.lastStep = Date.now();
    const step = () => {
      requestAnimationFrame(step);
      [this.lastStep, this._elapsed] = calculateElapsed(this.lastStep);
      runEachFrame();
    };
    step();
  }

  get elapsed() {
    return this._elapsed;
  }
}

export default new Timer();

function calculateElapsed(lastStep: number): [number, number] {
  const now = Date.now();
  let elapsed = now - lastStep;
  if (elapsed > 100) {
    elapsed = 100; // Enforce speed limit.
  }
  return [now, elapsed];
}
