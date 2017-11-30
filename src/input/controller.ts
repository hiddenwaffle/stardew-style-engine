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

    if (keyboard.isDown(Key.Up)) {
      avatar.y -= speed;
    }
    if (keyboard.isDown(Key.Down)) {
      avatar.y += speed;
    }
    if (keyboard.isDown(Key.Left)) {
      avatar.x -= speed;
    }
    if (keyboard.isDown(Key.Right)) {
      avatar.x += speed;
    }

    if (mouse.isDownAndUnhandled(Button.Left)) {
      console.log('left mouse button down');
    }
    if (mouse.isDownAndUnhandled(Button.Right)) {
      console.log('right mouse button down');
    }

    if (mouse.areBothButtonsDownOrHandled()) {
      console.log('double');
    }
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
