export const enum Button {
  Left,
  Right
}

const enum State {
  Down,
  Up,
  Handling
}

/**
 * https://stackoverflow.com/a/12114213
 */
function getRelativeCoords(event: MouseEvent) {
  return [ event.offsetX || event.layerX, event.offsetY || event.layerY ];
}

class Mouse {
  private buttonState: Map<Button, State>;
  private _canvasX: number;
  private _canvasY: number;

  constructor() {
    this.buttonState = new Map();
    this._canvasX = 0;
    this._canvasY = 0;
  }

  start() {
    window.addEventListener('mousedown', (event) => {
      this.eventToState(event, State.Down);
    });
    window.addEventListener('mouseup', (event) => {
      this.eventToState(event, State.Up);
    });
    window.addEventListener('mousemove', (event) => {
      [this._canvasX, this._canvasY] = getRelativeCoords(event);
    });
    // Prevent "stuck" button if held down and window loses focus.
    window.onblur = () => {
      // Just re-initailize everything like the constructor
      this.buttonState = new Map();
    };
  }

  step() {
    //
  }

  stop() {
    //
  }

  /**
   * Return if given button is 'Down'.
   */
  isDown(button: Button): boolean {
    return this.buttonState.get(button) === State.Down;
  }

  /**
   * Return if given button is 'down'. Also sets the button from 'Down' to 'Handling'.
   */
  isDownAndUnhandled(button: Button): boolean {
    if (this.isDown(button)) {
      this.buttonState.set(button, State.Handling);
      return true;
    } else {
      return false;
    }
  }

  areBothButtonsDownOrHandled(): boolean {
    return ([State.Down, State.Handling].indexOf(this.buttonState.get(Button.Left)) > -1) &&
           ([State.Down, State.Handling].indexOf(this.buttonState.get(Button.Right)) > -1);
  }

  /**
   * Returns if any button is 'down'. Also set all 'Down' buttons to 'Handling'.
   */
  isAnyButtonDownAndUnhandled() {
    let anyKeyDown = false;
    this.buttonState.forEach((state: State, button: Button) => {
      if (state === State.Down) {
        this.buttonState.set(button, State.Handling);
        anyKeyDown = true;
      }
    });
    return anyKeyDown;
  }

  private eventToState(event: MouseEvent, state: State) {
    const button = this.determineButton(event.button);
    this.buttonToState(button, state);
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

  private buttonToState(button: Button, state: State) {
    switch (button) {
      case Button.Left:
        this.setState(Button.Left, state);
        break;
      case Button.Right:
        this.setState(Button.Right, state);
        break;
    }
  }

  private setState(button: Button, state: State, force = false) {
    // Always set 'up'
    if (state === State.Up) {
      this.buttonState.set(button, state);
      // Only set 'down' if it is not already handled
    } else if (state === State.Down) {
      if (this.buttonState.get(button) !== State.Handling || force === true) {
        this.buttonState.set(button, state);
      }
    }
  }
}

export default new Mouse();
