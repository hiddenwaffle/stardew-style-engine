import {
  canvasScaled,
} from 'src/ui/elements';
import { getInverseScale } from 'src/session/scale';

export const enum Button {
  Left  = 1,
  Right = 2,
}

class Mouse {
  private _xclient: number;
  private _yclient: number;
  private _leftClick: boolean;

  constructor() {
    this._xclient = 0;
    this._yclient = 0;
    this._leftClick = false;
  }

  start() {
    canvasScaled.addEventListener('mousemove', (event) => {
      this._xclient = event.clientX;
      this._yclient = event.clientY;
    });
    canvasScaled.addEventListener('click', (event) => {
      this._leftClick = true;
    });
  }

  handleClick(): boolean {
    const leftClick = this._leftClick;
    this._leftClick = false;
    return leftClick;
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
