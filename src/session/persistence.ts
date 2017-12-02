import world from 'src/domain/world';
import { SAVE_KEY } from 'src/constants';
import stageManager from './stage-manager';
import { Save } from './save';

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
    const save = <Save> JSON.parse(json);
    stageManager.applySave(save);
  }

  /**
   * Reverse steps of load().
   */
  save() {
    const save = stageManager.extractSave();
    const json = JSON.stringify(save);
    const base64 = btoa(json);
    localStorage.setItem(SAVE_KEY, base64);
  }
}

export default new Persistence();
