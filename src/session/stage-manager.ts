import { log } from 'src/log';
import { World } from 'src/domain/world';
import { StaticMap } from 'src/domain/static-map';
import { Player } from 'src/domain/player';
import { gameMaster } from 'src/game-master/game-master';
import { render } from 'src/render/render';
import {
  SaveWorld,
  SavePlayer,
} from './save';
import { environment } from './environment';
import { persistence } from './persistence';

const enum State {
  Initializing,
  Ready,
  Stopping,
}

class StageManager {
  private world: World;
  private state: State;

  constructor() {
    this.world = null;
    this.state = State.Initializing;
  }

  async start() {
    const save = persistence.load();
    if (environment.development) {
      log('info', 'localstorage => StageManager#start()', JSON.stringify(save));
    }
    await this.applySave(save);
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
        log('info', 'StageManager#stop() => localStorage', JSON.stringify(save));
      }
      persistence.save(save);
    } else {
      if (environment.development) {
        log('info', 'StageManager#stop(): World is not initialized; skipping persist.');
      }
    }
  }

  private async applySave(save: SaveWorld) {
    this.world = new World(save);
    await this.world.start();
    this.state = State.Ready;
  }

  private extractSave(): SaveWorld {
    const save = this.world.extractSave();
    return save;
  }
}

export const stageManager = new StageManager();
