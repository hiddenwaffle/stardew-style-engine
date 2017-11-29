import world from 'src/domain/world';
import SaveState from './save-state';
import { SAVE_KEY } from 'src/constants';

class Persistence {
  start() {
    this.load();
  }

  stop() {
    this.save();
  }

  load() {
    const base64 = localStorage.getItem(SAVE_KEY);
    if (base64) {
      const json = atob(base64);
      const obj = JSON.parse(json);
      const saveState = new SaveState(obj);
      world.applySave(saveState);
    } else {
      const saveState = new SaveState({});
      world.applySave(saveState);
    }
  }

  save() {
    const saveState = world.extractSave();
    const json = JSON.stringify(saveState);
    const base64 = btoa(json);
    localStorage.setItem(SAVE_KEY, base64);
  }
}

export default new Persistence();
