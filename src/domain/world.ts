import Avatar from './avatar';
import GameMap from 'src/domain/map';
import SaveState from 'src/session/save-state';

class World {
  currentMap: GameMap;
  private readonly avatar: Avatar;

  constructor() {
    this.currentMap = null;
    this.avatar = new Avatar();
  }

  start() {
    //
  }

  step() {
    //
  }

  stop() {
    //
  }

  applySave(saveState: SaveState) {
    this.avatar.applySave(saveState.avatar);
  }

  extractSave(): SaveState {
    const saveState = new SaveState({
      avatar: this.avatar.extractSave()
    });
    return saveState;
  }
}

export default new World();
