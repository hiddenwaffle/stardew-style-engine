import { log } from 'src/log';
import { World } from 'src/domain/world';
import { State, gameState } from 'src/session/game-state';
import { GameMap } from 'src/domain/game-map';
import { Player } from 'src/domain/player';
import { gameMaster } from 'src/game-master/game-master';
import { render } from 'src/render/render';
import {
  SaveWorld,
  SavePlayer,
  SaveState,
} from './save';
import { persistence } from './persistence';
import { DomainState } from 'src/domain/domain-state';

class StageManager {
  private world: World;
  private state: DomainState;

  constructor() {
    this.world = null;
    this.state = null;
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
    this.world = new World(saveWorld.player);
    this.state = new DomainState(saveState); // TODO: Ordering is not intuitive - this must come before world.start()?
    await this.world.start(saveWorld.gameMap);
  }

  private extractSave(): [SaveWorld, SaveState] {
    const saveWorld = this.world.extractSave();
    const saveState = this.state.extractSave();
    return [saveWorld, saveState];
  }
}

export const stageManager = new StageManager();
