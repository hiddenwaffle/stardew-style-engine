import uiStructure from 'src/ui/ui-structure';
import world from 'src/domain/world';
import render from 'src/render/render';
import main from 'src/external/main';
import controller from 'src/input/controller';
import timer from './timer';
import persistence from './persistence';

class Session {
  /**
   * Reverse order of stop().
   */
  start() {
    world.start();
    uiStructure.start();
    timer.start(this.stepAll.bind(this));
    main.start();
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
    main.stop();
    timer.stop();
    uiStructure.stop();
    world.stop();
  }

  /**
   * The order here is to perform logic before rendering.
   */
  private stepAll() {
    controller.step();
    world.step();
    main.step();
    uiStructure.step();
    render.step();
  }
}

export default new Session();
