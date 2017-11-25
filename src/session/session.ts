import uiStructure from 'src/ui/ui-structure';
import timer from './timer';

class Session {
  start() {
    this.startAll();
    timer.start(this.stepAll.bind(this));
  }

  private startAll() {
    uiStructure.start();
    // TODO: Call start() on everything
  }

  private stepAll() {
    uiStructure.step();
    // TODO: Call step() on everything else
  }
}

export default new Session();;
