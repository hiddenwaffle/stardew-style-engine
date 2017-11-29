import persistence from 'src/session/persistence';
import GameState from './game-state/game-state';

class World {
  constructor(
    readonly gameState: GameState
  ) {
    //
  }

  start() {
    //
  }

  step() {
    //
  }

  stop() {
    persistence.save(this.gameState);
  }
}

export default new World(persistence.load());
