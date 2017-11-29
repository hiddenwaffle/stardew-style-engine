import GameMap from 'src/domain/map';
import mapManager from 'src/session/map-manager';

class Main {
  constructor() {
    //
  }

  start() {
    mapManager.switchTo('start');
  }

  step() {
    //
  }

  stop() {
    //
  }
}

export default new Main();
