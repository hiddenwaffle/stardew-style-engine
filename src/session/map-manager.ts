import GameMap from 'src/domain/map';
import tileManager from './tile-manager';

class MapManager {
  private readonly cache: Map<string, GameMap>;

  constructor() {
    this.cache = new Map();
  }

  // get(mapPath: string): GameMap {
  //   return this.cache.get(mapPath);
  // }

  set(mapPath: string, map: GameMap) {
    this.cache.set(mapPath, map);
  }

  switchTo(mapPath: string) {
    fetch(mapPath).then((response) => {
      return response.json();
    }).then((obj) => {
      const loadedMap = new GameMap(mapPath, obj);
      this.set(mapPath, loadedMap);
      console.log('loadedMap', loadedMap);
    });
  }
}

export default new MapManager();
