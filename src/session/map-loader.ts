import { GameMap } from 'src/domain/game-map';

import start  from 'src/external/map/start.map.json';
import town   from 'src/external/map/town.map.json';
import cave   from 'src/external/map/cave.map.json';
// TODO: More maps

class MapLoader {
  private readonly maps: Map<string, GameMap>;
  private readonly paths: Map<string, string>;

  constructor() {
    this.maps = new Map();

    this.paths = new Map();
    this.paths.set('start', start);
    this.paths.set('town',  town);
    this.paths.set('cave',  cave);
  }

  fetch(mapId: string): Promise<GameMap> {
    return new Promise((resolve, reject) => {
      const path = this.paths.get(mapId);
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
