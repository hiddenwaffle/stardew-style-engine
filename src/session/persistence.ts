import world from 'src/domain/world';
import { SAVE_KEY } from 'src/constants';

function loadFromLocalStorage(): string {
  return localStorage.getItem(SAVE_KEY);
}

class Persistence {
  start() {
    this.load();
  }

  stop() {
    this.save();
  }

  /**
   * Reverse steps of save(), but also ensures save file exists.
   */
  load() {
    let base64 = loadFromLocalStorage();
    if (!base64) {
      // Create a save with the pristine world, then load it.
      this.save();
      base64 = loadFromLocalStorage();
    }
    const json = atob(base64);
    const rawObj = JSON.parse(json);
    world.applySave(rawObj);
  }

  /**
   * Reverse steps of load().
   */
  save() {
    const rawObj = world.extractSave();
    const json = JSON.stringify(rawObj);
    const base64 = btoa(json);
    localStorage.setItem(SAVE_KEY, base64);
  }
}

export default new Persistence();
