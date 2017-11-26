import uiStructure from 'src/ui/ui-structure';
import world from 'src/domain/world';
import timer from './timer';

class Session {
  /**
   * Reverse order of stop().
   */
  start() {
    world.start()
    uiStructure.start();
    timer.start(this.stepAll.bind(this));
  }

  /**
   * Reverse order of start().
   */
  stop() {
    timer.stop();
    uiStructure.stop();
    world.stop();
  }

  /**
   * Same order as start(), except for the timer because
   * that is what calls thie method in the first place.
   */
  private stepAll() {
    world.step();
    uiStructure.step();
  }
}

export default new Session();
