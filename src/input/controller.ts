import { gameMaster } from 'src/game-master/game-master';
import { keyboard, Key } from './keyboard';
import { mouse } from './mouse';
import {
  eventBus,
} from 'src/event/event-bus';
import { CancelEvent } from 'src/event/cancel-event';

class Controller {
  /**
   * Reverse order of stop().
   */
  start() {
    keyboard.start();
    mouse.start();
  }

  step() {
    handleKeyboard();
    handleMouse();
  }

  /**
   * Reverse order of start().
   */
  stop() {
    keyboard.stop();
  }
}

export const controller = new Controller();

function handleKeyboard() {
  keyboard.step();

  let dx = 0;
  let dy = 0;

  if (keyboard.isDown(Key.Up)) {
    dy -= 1;
  }
  if (keyboard.isDown(Key.Down)) {
    dy += 1;
  }
  if (keyboard.isDown(Key.Left)) {
    dx -= 1;
  }
  if (keyboard.isDown(Key.Right)) {
    dx += 1;
  }

  const walk = keyboard.isDown(Key.Walk);
  gameMaster.setPlayerIntendedDirection(dx, dy, walk);

  if (keyboard.isDownAndUnhandled(Key.Cancel)) {
    eventBus.fire(new CancelEvent());
  }
}

function handleMouse() {
  const [xlogical, ylogical] = mouse.xy;
  gameMaster.setLogicalMouseAt(xlogical, ylogical);

  const click = mouse.handleClick();
  if (click) {
    gameMaster.setLogicalClickedAt(xlogical, ylogical);
  } else {
    // "Clears" click if there was one in the previous step() iteration.
    gameMaster.setLogicalClickedAt();
  }
}
