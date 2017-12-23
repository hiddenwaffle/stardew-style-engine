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
  start() {
    canvasScaled.addEventListener('click', (event) => {
      const [x, y] = getRelativeCoords(event);
      const xlogical = x * getInverseScale();
      const ylogical = y * getInverseScale();
      console.log('left', xlogical, ylogical);
    });
    canvasScaled.addEventListener('contextmenu', (event) => {
      event.preventDefault();

      const [x, y] = getRelativeCoords(event);
      const xlogical = x * getInverseScale();
      const ylogical = y * getInverseScale();
      console.log('right', xlogical, ylogical);
    });
  }

  step() {
    //
  }

  stop() {
    //
  }

  // private eventToState(event: MouseEvent, state: State) {
  //   //
  // }
}

export const mouse = new Mouse();

/**
 * Relative to the HTML element.
 * https://stackoverflow.com/a/12114213
 */
function getRelativeCoords(event: MouseEvent) {
  return [ event.offsetX || event.layerX, event.offsetY || event.layerY ];
}
