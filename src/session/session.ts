import uiStructure from 'src/ui/ui-structure';
import render from 'src/render/render';
import controller from 'src/input/controller';
import timer from './timer';
import persistence from './persistence';

class Session {
  /**
   * Reverse order of stop().
   */
  start() {
    uiStructure.start();
    timer.start(this.stepAll.bind(this));
    render.start();
    controller.start();
    persistence.start();
  }

  /**
   * Reverse order of start().
   */
  stop() {
    persistence.stop();
    controller.stop();
    render.stop();
    timer.stop();
    uiStructure.stop();
  }

  /**
   * The order here is to perform logic before rendering.
   */
  private stepAll() {
    controller.step();
    uiStructure.step();
    render.step();
  }
}

export default new Session();
