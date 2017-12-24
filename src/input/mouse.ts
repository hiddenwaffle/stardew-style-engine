import {
  canvasScaled,
  narrationContainer,
} from 'src/ui/elements';
import { getInverseScale } from 'src/session/scale';

export const enum Button {
  Left,
  Right,
}

class Mouse {
  private _xclient: number;
  private _yclient: number;
  private _leftClick: boolean;
  private _rightClick: boolean;

  constructor() {
    this._xclient = 0;
    this._yclient = 0;
    this._leftClick = false;
    this._rightClick = false;
  }

  start() {
    canvasScaled.addEventListener('mousemove', (event) => {
      this._xclient = event.clientX;
      this._yclient = event.clientY;
    });
    canvasScaled.addEventListener('click', (event) => {
      this._leftClick = true;
    });
    canvasScaled.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this._rightClick = true;
    });
  }

  handleClick(): [boolean, boolean] {
    const leftClick = this._leftClick;
    const rightClick = this._rightClick;
    this._leftClick = false;
    this._rightClick = false;
    return [leftClick, rightClick];
  }

  /**
   * Translate the current mouse event coordinate into its location on the backbuffer.
   * https://stackoverflow.com/a/18053642
   */
  get xy(): [number, number] {
    const rect = canvasScaled.getBoundingClientRect();
    const xscaled = this._xclient - rect.left;
    const yscaled = this._yclient - rect.top;
    const xback = Math.floor(xscaled * getInverseScale());
    const yback = Math.floor(yscaled * getInverseScale());
    return [xback, yback];
  }
}

export const mouse = new Mouse();
