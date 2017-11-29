import GameMap from 'src/domain/map';
import mapManager from 'src/session/map-manager';
import startMapPath from './map/start.map.json';

class Main {
  constructor() {
    //
  }

  start() {
    mapManager.switchTo(startMapPath);
  }

  step() {
    //
  }

  stop() {
    //
  }
}

export default new Main();
