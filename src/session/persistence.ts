import World from 'src/domain/world';
import { SAVE_KEY } from 'src/constants';
import { SaveWorld } from './save';

function loadFromLocalStorage(): string {
  return localStorage.getItem(SAVE_KEY);
}

class Persistence {
  /**
   * Reverse steps of save(), but also ensures save file exists.
   */
  load(): SaveWorld {
    let base64 = loadFromLocalStorage();
    if (!base64) {
      // Persist a pristine world and then load it back in.
      const world = new World();
      this.save(world.extractSave());
      base64 = loadFromLocalStorage();
    }
    const json = atob(base64);
    return <SaveWorld> JSON.parse(json);
  }

  /**
   * Reverse steps of load().
   */
  save(save: SaveWorld) {
    let base64: string;
    if (save) {
      const json = JSON.stringify(save);
      base64 = btoa(json);
    } else {
      const json = JSON.stringify({});
      base64 = btoa(json);
    }
    localStorage.setItem(SAVE_KEY, base64);
  }
}

export default new Persistence();
