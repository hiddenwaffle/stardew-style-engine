import uiStructure from 'src/ui/ui-structure';
import render from 'src/render/render';
import controller from 'src/input/controller';
import timer from './timer';
import stageManager from './stage-manager';

class Session {
  /**
   * Reverse order of stop().
   */
  start() {
    uiStructure.start();
    timer.start(this.stepAll.bind(this));
    render.start();
    controller.start();
    stageManager.start();
  }

  /**
   * Reverse order of start().
   */
  stop() {
    stageManager.stop();
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
