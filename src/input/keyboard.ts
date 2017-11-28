export const enum Key {
  Left,
  Up,
  Down,
  Right,
  Pause,
  // Rest of these are special directives
  Other,
  Ignore,
  Prevent
}

const enum State {
  Down,
  Up,
  Handling
}

class Keyboard {
  private keyState: Map<Key, State>;

  constructor() {
    // See onblur handler below for more comments.
    this.keyState = new Map<Key, State>();
  }

  start() {
    window.addEventListener('keydown', (event) => {
      this.eventToState(event, State.Down);
    });
    window.addEventListener('keyup', (event) => {
      this.eventToState(event, State.Up);
    });
    // Prevent "stuck" key if held down and window loses focus.
    window.onblur = () => {
      // Just re-initailize everything like the constructor
      this.keyState = new Map<Key, State>();
    };
  }

  stop() {
    //
  }

  step() {
    // Currently nothing to do.
  }

  /**
   * Return if given key is 'Down'.
   */
  isDown(key: Key): boolean {
    return this.keyState.get(key) === State.Down;
  }

  /**
   * Return if given key is 'down'. Also sets the key from 'Down' to 'Handling'.
   */
  isDownAndUnhandled(key: Key): boolean {
    if (this.isDown(key)) {
      this.keyState.set(key, State.Handling);
      return true;
    } else {
      return false; // TODO: This wasn't set in mazing; need to see why.
    }
  }

  /**
   * Returns if any key is 'down'. Also set all 'Down' keys to 'Handling'.
   */
  isAnyKeyDownAndUnhandled() {
    let anyKeyDown = false;
    this.keyState.forEach((state: State, key: Key) => {
      if (state === State.Down) {
        this.keyState.set(key, State.Handling);
        anyKeyDown = true;
      }
    });
    return anyKeyDown;
  }

  private eventToState(event: KeyboardEvent, state: State) {
    let key = this.keyCodeToKey(event.keyCode);
    this.keyToState(key, state, event);
  }

  private keyCodeToKey(keyCode: number): Key {
    let key = Key.Other;

    switch (keyCode) {
      // Directionals --------------------------------------------------
      case 65: // 'a'
      case 37: // left
        key = Key.Left;
        break;
      case 87: // 'w'
      case 38: // up
        key = Key.Up;
        break;
      case 68: // 'd'
      case 39: // right
        key = Key.Right;
        break;
      case 83: // 's'
      case 40: // down
        key = Key.Down;
        break;

      // Pause ---------------------------------------------------------
      case 80: // 'p'
      case 27: // esc
      case 13: // enter key
        key = Key.Pause;
        break;

      // Ignore certain keys -------------------------------------------
      case 82:    // 'r'
      case 18:    // alt
      case 224:   // apple command (firefox)
      case 17:    // apple command (opera)
      case 91:    // apple command, left (safari/chrome)
      case 93:    // apple command, right (safari/chrome)
      case 84:    // 't' (i.e., open a new tab)
      case 78:    // 'n' (i.e., open a new window)
      case 219:   // left brackets
      case 221:   // right brackets
        key = Key.Ignore;
        break;

      // Prevent some unwanted behaviors -------------------------------
      case 191:   // forward slash (page find)
      case 9:     // tab (can lose focus)
      case 16:    // shift
        key = Key.Prevent;
        break;

      // All other keys ------------------------------------------------
      default:
        key = Key.Other;
    }

    return key;
  }

  private keyToState(key: Key, state: State, event: KeyboardEvent) {
    let preventDefault = false;

    switch (key) {
      case Key.Left:
        this.setState(Key.Left, state);
        preventDefault = true;
        break;
      case Key.Up:
        this.setState(Key.Up, state);
        // event.preventDefault() - commented for if the user wants to cmd+w or ctrl+w
        break;
      case Key.Right:
        this.setState(Key.Right, state);
        preventDefault = true;
        break;
      case Key.Down:
        this.setState(Key.Down, state);
        preventDefault = true;
        break;
      case Key.Pause:
        this.setState(Key.Pause, state);
        preventDefault = true;
        break;
      // TODO: Maybe add a debug key here ('f')
      case Key.Ignore:
        break;
      case Key.Prevent:
        preventDefault = true;
        break;
      case Key.Other:
      default:
        this.setState(Key.Other, state);
        break;
    }

    if (event != null && preventDefault === true) {
      event.preventDefault();
    }
  }

  private setState(key: Key, state: State, force = false) {
    // Always set 'up'
    if (state === State.Up) {
      this.keyState.set(key, state);
      // Only set 'down' if it is not already handled
    } else if (state === State.Down) {
      if (this.keyState.get(key) !== State.Handling || force === true) {
        this.keyState.set(key, state);
      }
    }
  }
}

export default new Keyboard();
