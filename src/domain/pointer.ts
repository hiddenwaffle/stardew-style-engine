export enum PointerType {
  Default,
  Talk,
  Use,
  Glass
}

/**
 * Coordiantes are in world coordinates.
 */
class Pointer {
  private _x: number;
  private _y: number;

  constructor() {
    this.reset(-1, -1);
  }

  reset(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }
}

export const pointer = new Pointer();
