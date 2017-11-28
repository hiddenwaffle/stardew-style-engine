import GameMap from 'src/domain/map';
import mapManager from 'src/session/map-manager';
import mapPath from './start.map.json';

export default () => {
  mapManager.switchTo(mapPath);
}
