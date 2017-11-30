import avatar from 'src/domain/avatar';
import timer from 'src/session/timer';
import keyboard, { Key } from './keyboard';

const pixelsPerSecond = 100 / 1000;

class Controller {
  start() {
    keyboard.start();
  }

  step() {
    keyboard.step();

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
  }

  stop() {
    keyboard.stop();
  }
}

export default new Controller();
