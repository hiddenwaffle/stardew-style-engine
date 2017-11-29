import GameMap from 'src/domain/map';
import imageManager from './image-manager';

class MapManager {
  currentMap: GameMap;
  private readonly cache: Map<string, GameMap>;

  constructor() {
    this.currentMap = null;
    this.cache = new Map();
  }

  set(mapPath: string, map: GameMap) {
    this.cache.set(mapPath, map);
  }

  switchTo(mapPath: string) {
    const cachedMap = this.cache.get(mapPath);
    if (cachedMap) {
      this.currentMap = cachedMap;
    } else {
      fetch(mapPath).then((response) => {
        return response.json();
      }).then((obj) => {
        const loadedMap = new GameMap(mapPath, obj);
        this.set(mapPath, loadedMap);
        this.currentMap = loadedMap;
      });
    }
  }
}

export default new MapManager();
