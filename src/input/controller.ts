import avatar from 'src/domain/avatar';
import timer from 'src/session/timer';
import keyboard, { Key } from './keyboard';
import mouse, { Button } from './mouse';

const pixelsPerSecond = 100 / 1000;

class Controller {
  /**
   * Reverse order of stop().
   */
  start() {
    keyboard.start();
    mouse.start();
  }

  step() {
    keyboard.step();
    mouse.step();

    const speed = Math.floor(timer.elapsed * pixelsPerSecond);

    let dx = 0;
    let dy = 0;

    if (keyboard.isDown(Key.Up)) {
      dy -= speed;
    }
    if (keyboard.isDown(Key.Down)) {
      dy += speed;
    }
    if (keyboard.isDown(Key.Left)) {
      dx -= speed;
    }
    if (keyboard.isDown(Key.Right)) {
      dx += speed;
    }

    if (mouse.isDownAndUnhandled(Button.Left)) {
      console.log('left mouse button down', mouse.canvasX, mouse.canvasY);
    }
    if (mouse.isDownAndUnhandled(Button.Right)) {
      console.log('right mouse button down', mouse.canvasX, mouse.canvasY);
    }

    if (mouse.areBothButtonsDownOrHandled()) {
      console.log('double', mouse.canvasX, mouse.canvasY);
    }

    avatar.x += dx;
    avatar.y += dy;
  }

  /**
   * Reverse order of start().
   */
  stop() {
    mouse.stop();
    keyboard.stop();
  }
}

export default new Controller();
