import GameMap from 'src/domain/map';

class MapManager {
  private readonly cache: Map<string, GameMap>;

  constructor() {
    this.cache = new Map();
  }

  get(mapPath: string): GameMap {
    return this.cache.get(mapPath);
  }

  set(mapPath: string, map: GameMap) {
    this.cache.set(mapPath, map);
  }
}

export default new MapManager();
