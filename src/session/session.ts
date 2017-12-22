import { uiStructure } from 'src/ui/ui-structure';
import { controller } from 'src/input/controller';
import { timer } from './timer';
import { stageManager } from './stage-manager';

class Session {
  /**
   * Reverse order of stop().
   */
  async start() {
    uiStructure.start();
    timer.start(this.stepAll.bind(this));
    controller.start();
    await stageManager.start();
  }

  /**
   * Reverse order of start().
   */
  stop() {
    stageManager.stop();
    controller.stop();
    timer.stop();
    uiStructure.stop();
  }

  /**
   * The order here is to perform logic before rendering.
   */
  private stepAll() {
    controller.step();
    stageManager.step();
    uiStructure.step();
  }
}

export const session = new Session();
