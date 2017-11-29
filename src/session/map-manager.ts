import GameMap from 'src/domain/map';
import world from 'src/domain/world';

import start from 'src/external/map/start.map.json';
// TODO: More maps

class MapManager {
  private readonly cache: Map<string, GameMap>;
  private readonly locationMap: Map<string, string>;

  constructor() {
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
      world.currentMap = cachedMap; // TODO: Move elsewhere, encapsulate
    } else {
      fetch(location).then((response) => {
        return response.json();
      }).then((obj) => {
        const loadedMap = new GameMap(location, obj);
        this.set(location, loadedMap);
        world.currentMap = loadedMap; // TODO: Move elsewhere, encapsulate
    });
      // TODO: Handle errors
    }
  }
}

export default new MapManager();
