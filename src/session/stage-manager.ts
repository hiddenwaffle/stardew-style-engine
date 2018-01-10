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
  SaveState,
} from './save';
import { persistence } from './persistence';

class StageManager {
  private world: World;

  constructor() {
    this.world = null;
  }

  async start() {
    const [saveWorld, saveState] = persistence.loadAndClean();
    log('info', 'saveWorld', JSON.stringify(saveWorld, null, 2));
    log('info', 'saveState', JSON.stringify(saveState, null, 2));
    await this.applySave(saveWorld, saveState);
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
      const [saveWorld, saveState] = this.extractSave();
      persistence.save(saveWorld, saveState);
    } else {
      log('info', 'StageManager#stop(): World is not initialized; skipping persist.');
    }
  }

  private async applySave(saveWorld: SaveWorld, saveState: SaveState) {
    this.world = new World(saveWorld);
    console.log('TODO: use saveState'); // TODO: Yeah do that
    await this.world.start();
  }

  private extractSave(): [SaveWorld, SaveState] {
    const saveWorld = this.world.extractSave();
    console.log('TODO: use saveState'); // TODO: Yeah do that
    const saveState = new SaveState(); // TODO: <--------------------- extract
    return [saveWorld, saveState];
  }
}

export const stageManager = new StageManager();
