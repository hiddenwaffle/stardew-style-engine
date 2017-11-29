import GameMap from 'src/domain/map';

import start from 'src/external/map/start.map.json';
// TODO: More maps

class MapManager {
  currentMap: GameMap;
  private readonly cache: Map<string, GameMap>;
  private readonly locationMap: Map<string, string>;

  constructor() {
    this.currentMap = null;
    this.cache = new Map();

    this.locationMap = new Map();
    this.locationMap.set('start', start);
  }

  set(mapPath: string, map: GameMap) {
    this.cache.set(mapPath, map);
  }

  switchTo(mapId: string) {
    const location = this.locationMap.get(mapId);
    const cachedMap = this.cache.get(location);
    if (cachedMap) {
      this.currentMap = cachedMap;
    } else {
      fetch(location).then((response) => {
        return response.json();
      }).then((obj) => {
        const loadedMap = new GameMap(location, obj);
        this.set(location, loadedMap);
        this.currentMap = loadedMap;
      });
      // TODO: Handle errors
    }
  }
}

export default new MapManager();
