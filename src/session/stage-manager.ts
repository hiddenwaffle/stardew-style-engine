import { log } from 'src/log';
import { World } from 'src/domain/world';
import { State, gameState } from 'src/session/game-state';
import { StaticMap } from 'src/domain/static-map';
import { Player } from 'src/domain/player';
import { gameMaster } from 'src/game-master/game-master';
import { render } from 'src/render/render';
import {
  SaveWorld,
  SavePlayer,
} from './save';
import { persistence } from './persistence';

class StageManager {
  private world: World;

  constructor() {
    this.world = null;
  }

  async start() {
    const save = persistence.load();
    log('info', 'localstorage => StageManager#start()', JSON.stringify(save, null, 2));
    await this.applySave(save);
    render.start();
  }

  step() {
    if (gameState.state === State.Ready) {
      gameMaster.advance(this.world);
    }
    render.step(this.world);
  }

  stop() {
    render.stop();
    // CRITICAL: Prevent attempting to save while still initializing.
    if (gameState.state === State.Ready) {
      const save = this.extractSave();
      log('info', 'StageManager#stop() => localStorage', JSON.stringify(save));
      persistence.save(save);
    } else {
      log('info', 'StageManager#stop(): World is not initialized; skipping persist.');
    }
  }

  private async applySave(save: SaveWorld) {
    this.world = new World(save);
    await this.world.start();
  }

  private extractSave(): SaveWorld {
    const save = this.world.extractSave();
    return save;
  }
}

export const stageManager = new StageManager();
