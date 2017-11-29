import { SAVE_KEY } from 'src/constants';
import GameState from 'src/domain/game-state/game-state';

class Persistence {
  load(): GameState {
    const base64 = localStorage.getItem(SAVE_KEY);
    let gameState: GameState;
    if (base64) {
      const json = atob(base64);
      const obj = JSON.parse(json);
      gameState = new GameState(obj);
    } else {
      gameState = new GameState();
    }
    return gameState;
  }

  save(gameState: GameState) {
    const json = JSON.stringify(gameState);
    const base64 = btoa(json);
    localStorage.setItem(SAVE_KEY, base64);
  }
}

export default new Persistence();
