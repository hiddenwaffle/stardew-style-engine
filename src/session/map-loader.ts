import { GameMap } from 'src/domain/game-map';
import { paths } from 'src/external/meta/map-meta';

class MapLoader {
  private readonly maps: Map<string, GameMap>;

  constructor() {
    this.maps = new Map();
  }

  fetch(mapId: string): Promise<GameMap> {
    return new Promise((resolve, reject) => {
      const path = paths.get(mapId);
      const map = this.maps.get(path);
      if (map) {
        resolve(map);
      } else {
        fetch(path).then((response) => {
          return response.json();
        }).then((rawMap) => {
          const newMap = new GameMap(mapId, path, rawMap);
          this.maps.set(path, newMap);
          resolve(newMap);
        }); // TODO: Handle error?
      }
    });
  }
}

export const mapLoader = new MapLoader();
