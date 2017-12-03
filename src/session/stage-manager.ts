import World from 'src/domain/world';
import StaticMap from 'src/domain/static-map';
import Player from 'src/domain/player';
import gameMaster from 'src/game-master/game-master';
import render from 'src/render/render';
import mapLoader from './map-loader';
import imageLoader from './image-loader';
import {
  SaveWorld,
  SavePlayer
} from './save';
import environment from './environment';
import persistence from './persistence';

const enum State {
  Initializing,
  Ready,
  Stopping
}

class StageManager {
  private world: World;
  private state: State;

  constructor() {
    this.world = null;
    this.state = State.Initializing;
  }

  start() {
    const save = persistence.load();
    if (environment.development) {
      console.log('localstorage => StageManager#start()', JSON.stringify(save));
    }
    this.applySave(save);
    render.start();
  }

  step() {
    gameMaster.advance(this.world);
    render.step(this.world);
  }

  stop() {
    render.stop();
    // CRITICAL: Prevent attempting to save while still initializing.
    if (this.state === State.Ready) {
      const save = this.extractSave();
      if (environment.development) {
        console.log('StageManager#stop() => localStorage', JSON.stringify(save));
      }
      persistence.save(save);
    } else {
      if (environment.development) {
        console.log('StageManager#stop(): World is not initialized; skipping persist.');
      }
    }
  }

  loadMap(mapId: string): Promise<StaticMap> {
    return new Promise<StaticMap>((resolve, reject) => {
      return mapLoader.fetch(mapId).then((rawMap: any) => {
        const staticMap = this.world.staticMap;
        staticMap.fillInDetails(rawMap);
        staticMap.tilesets.forEach((tileset) => {
          imageLoader.prepare(tileset.image);
        });
        resolve(staticMap);
        // TODO: Handle error
      });
    });
  }

  private applySave(save: SaveWorld) {
    this.world = new World();
    this.world.applySave(save);

    this.loadMap(this.world.staticMap.id).then((staticMap) => {
      // Persistent values have been applied and ready for extraction when necessary.
      this.state = State.Ready;
    });
  }

  private extractSave(): SaveWorld {
    const save = this.world.extractSave();
    return save;
  }
}

export default new StageManager();
