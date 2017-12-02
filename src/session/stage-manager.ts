import World from 'src/domain/world';
import GameMap from 'src/domain/game-map';
import Player from 'src/domain/player';
import mapLoader from './map-loader';
import imageLoader from './image-loader';
import {
  Save,
  SavePlayer
} from './save';

class StageManager {
  private _world: World;

  applySave(save: Save) {
    console.log('localstorage => StageManager#applySave()', JSON.stringify(save));

    // TODO: Remove this
    if (!save.mapId) {
      save.mapId = 'start';
    }

    mapLoader.fetch(save.mapId).then((rawMap: any) => {
      const gameMap = new GameMap(rawMap);
      gameMap.tilesets.forEach((tileset) => {
        imageLoader.prepare(tileset.image);
      })
      this._world = new World(gameMap, save);
    });
  }

  extractSave(): Save {
    const save = new Save(this._world);
    console.log('StageManager#extractSave() => localStorage', JSON.stringify(save));
    return save;
  }

  get world() {
    return this._world;
  }
}

export default new StageManager();
