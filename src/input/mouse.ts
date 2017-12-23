import {
  canvasScaled,
  narrationContainer,
} from 'src/ui/elements';

export const enum Button {
  Left,
  Right,
}

class Mouse {
  private _x: number;
  private _y: number;
  private _leftClick: boolean;
  private _rightClick: boolean;

  constructor() {
    this._x = 0;
    this._y = 0;
    this._leftClick = false;
    this._rightClick = false;
  }

  start() {
    canvasScaled.addEventListener('mousemove', (event) => {
      [this._x, this._y] = getRelativeCoords(event);
    });
    canvasScaled.addEventListener('click', (event) => {
      // [this._x, this._y] = getRelativeCoords(event); // TODO: Uncomment this?
      this._leftClick = true;
    });
    canvasScaled.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      // [this._x, this._y] = getRelativeCoords(event); // TODO: Uncomment this?
      this._rightClick = true;
    });
  }

  handleLeftClick(): boolean {
    const result = this._leftClick;
    this._leftClick = false;
    return result;
  }

  handleRightClick(): boolean {
    const result = this._rightClick;
    this._rightClick = false;
    return result;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }
}

export const mouse = new Mouse();

/**
 * Relative to the HTML element.
 * https://stackoverflow.com/a/12114213
 * TODO: What is layerX/Y ?
 */
function getRelativeCoords(event: MouseEvent) {
  return [ event.offsetX || event.layerX, event.offsetY || event.layerY ];
}
