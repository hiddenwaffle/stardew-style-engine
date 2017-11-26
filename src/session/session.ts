import uiStructure from 'src/ui/ui-structure';
import world from 'src/domain/world';
import main from 'src/external/main';
import timer from './timer';

class Session {
  /**
   * Reverse order of stop().
   */
  start() {
    world.start();
    uiStructure.start();
    timer.start(this.stepAll.bind(this));
    main.start();
  }

  /**
   * Reverse order of start().
   */
  stop() {
    main.stop();
    timer.stop();
    uiStructure.stop();
    world.stop();
  }

  /**
   * The order here is to perform logic before rendering.
   */
  private stepAll() {
    world.step();
    main.step();
    uiStructure.step();
  }
}

export default new Session();
