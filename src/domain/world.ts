import persistence from 'src/session/persistence';
import GameState from './game-state';
// import Avatar from './avatar';

class World {
  constructor(
    readonly gameState: GameState
  ) {
    //
  }

  start() {
    // this.avatar.start();
  }

  step() {
    // this.avatar.step();
  }

  stop() {
    persistence.save(this.gameState);
  }
}

export default new World(persistence.load());
