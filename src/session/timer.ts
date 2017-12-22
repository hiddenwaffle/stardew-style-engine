class Timer {
  private lastStep: number;
  private _elapsed: number;
  private currentRequest: number;

  constructor() {
    this.lastStep = Date.now();
    this._elapsed = 1;
    this.currentRequest = 0;
  }

  start(runEachFrame: () => void) {
    this.lastStep = Date.now();
    const step = (now: number) => {
      this.currentRequest = requestAnimationFrame(step);
      [this.lastStep, this._elapsed] = calculateElapsed(now, this.lastStep);
      runEachFrame();
    };
    requestAnimationFrame(step);
  }

  stop() {
    cancelAnimationFrame(this.currentRequest);
  }

  get elapsed() {
    return this._elapsed;
  }
}

export const timer = new Timer();

function calculateElapsed(now: number, lastStep: number): [number, number] {
  let elapsed = now - lastStep;
  if (elapsed > 100) {
    elapsed = 100; // Enforce speed limit.
  }
  return [now, elapsed];
}
