import GameMap from 'src/domain/map';

import start from 'src/external/map/start.map.json';
// TODO: More maps

/**
 * Where a new avatar is set down.
 */
const START_MAP_ID = 'start';

class MapManager {
  private readonly cache: Map<string, GameMap>;
  private readonly locationMap: Map<string, string>;
  _currentMap: GameMap;

  constructor() {
    this.cache = new Map();

    this.locationMap = new Map();
    this.locationMap.set('start', start);

    this._currentMap = null;
  }

  set(mapPath: string, map: GameMap) {
    this.cache.set(mapPath, map);
  }

  /**
   * Homie's first promise. TODO: Clean this up.
   */
  switchTo(mapId: string) {
    const location = this.locationMap.get(mapId);
    const cachedMap = this.cache.get(location);
    if (cachedMap) {
      this._currentMap = cachedMap;
    } else {
      fetch(location).then((response) => {
        return response.json();
      }).then((obj) => {
        const loadedMap = new GameMap(mapId, location, obj);
        this.set(location, loadedMap);
        this._currentMap = loadedMap;
      }); // TODO: Handle error?
    }
  }

  get currentMap(): GameMap {
    return this._currentMap;
  }

  get currentMapId(): string {
    return this._currentMap ? this._currentMap.id : START_MAP_ID;
  }
}

export default new MapManager();
