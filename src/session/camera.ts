import {
  FIELD_TARGET_WIDTH,
  FIELD_TARGET_HEIGHT,
} from 'src/constants';

// "Camera" is the idea that 0, 0 on the canvas = xcam, ycam on the current map.

// export function translateScreenToWorld(xlogical: number, ylogical: number): [number, number] {
//   // TODO: Do it
//   const xworld =
//   return [xworld, yworld];
// }

class Camera {
  xfocus: number;
  yfocus: number;

  constructor() {
    this.xfocus = 0;
    this.yfocus = 0;
  }

  /**
   * Converts logical screen coordinates to world coordinates.
   */
  logicalToWorld(xlogical: number, ylogical: number): [number, number] {
    return [
      xlogical + (this.xfocus - FIELD_TARGET_WIDTH / 2),
      ylogical + (this.yfocus - FIELD_TARGET_HEIGHT / 2)
    ];
  }

  /**
   * The arguments to this method are normally the player's world coordinates.
   */
  setFocus(xfocus: number, yfocus: number) {
    this.xfocus = xfocus;
    this.yfocus = yfocus;
  }
}

export const camera = new Camera();
