import GameMap from 'src/domain/map';
import mapManager from 'src/session/map-manager';
import mapPath from './test01.map.json';

export default () => {
  const map = mapManager.get(mapPath);
  if (map) {
    console.log('cheese?');
  } else {
    const request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onload = () => {
      const map = new GameMap(mapPath, request.response);
      mapManager.set(mapPath, map);
    };
    request.open('GET', mapPath);
    request.send();
  }
};
