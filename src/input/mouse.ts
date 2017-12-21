import {
  canvasScaled,
  narrationContainer,
} from 'src/ui/elements';

export const enum Button {
  Left,
  Right,
}

/**
 * https://stackoverflow.com/a/12114213
 */
function getRelativeCoords(event: MouseEvent) {
  return [ event.offsetX || event.layerX, event.offsetY || event.layerY ];
}

class Mouse {
  start() {
    canvasScaled.addEventListener('mousedown', (event) => {
      // this.eventToState(event, State.Down);
    });
    canvasScaled.addEventListener('mouseup', (event) => {
      // this.eventToState(event, State.Up);
    });
    // canvasScaled.addEventListener('mousemove', (event) => {
    // });

    narrationContainer.addEventListener('mousewheel', (event) => {
      // TODO: Fire narration mousewheel event
      // To get back to most recent: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    });

    // Prevent "stuck" button if held down and canvas loses focus.
    window.onblur = () => {
      // TODO: Fire mouse up event if mouse was down?
    };
  }

  step() {
    //
  }

  stop() {
    //
  }

  private determineButton(button: number): Button {
    let type;
    if (button === 0) {
      type = Button.Left;
    } else if (button === 2) {
      type = Button.Right;
    }
    return type;
  }
}

export default new Mouse();
