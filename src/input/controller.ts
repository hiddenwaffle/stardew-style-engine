import player from 'src/domain/player';
import timer from 'src/session/timer';
import keyboard, { Key } from './keyboard';
import mouse from './mouse';

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

    // console.log('TODO: player.dxIntended = dx');
    // console.log('TODO: player.dyIntended = dy');
  }

  /**
   * Reverse order of start().
   */
  stop() {
    keyboard.stop();
  }
}

export default new Controller();
