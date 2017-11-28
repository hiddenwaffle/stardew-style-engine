import GameMap from 'src/domain/map';
import mapManager from 'src/session/map-manager';
import mapPath from './start.map.json';

export default () => {
  fetch(mapPath).then((response) => {
    return response.json();
  }).then((obj) => {
    const loadedMap = new GameMap(mapPath, obj);
    mapManager.set(mapPath, loadedMap);
  });
}
