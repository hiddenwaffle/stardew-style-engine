import { gameMaster } from 'src/game-master/game-master';
import { timer } from 'src/session/timer';
import { keyboard, Key } from './keyboard';
import { mouse } from './mouse';
import { getInverseScale } from 'src/session/scale';

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
}

function handleMouse() {
  const leftClick = mouse.handleLeftClick();
  const rightClick = mouse.handleRightClick();
  if (leftClick || rightClick) {
    const xlogical = Math.floor(mouse.x * getInverseScale());
    const ylogical = Math.floor(mouse.y * getInverseScale());
    console.log(leftClick, rightClick, xlogical, ylogical);
    // TODO: Translate into map coordinates, somehow?
    // TODO: Probably need shared variables with render()
  }
}
