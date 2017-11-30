import avatar from './avatar';
import GameMap from './game-map';
import mapManager from 'src/session/map-manager';

class World {
  start() {
    //
  }

  step() {
    //
  }

  stop() {
    //
  }

  applySave(rawObj: any) {
    console.log('localstorage => world.applySave()', JSON.stringify(rawObj));
    if (rawObj) {
      mapManager.switchTo(rawObj.currentMapId);
      avatar.applySave(rawObj.avatarState);
    }
  }

  extractSave(): any {
    const rawObj = {
      currentMapId: mapManager.currentMapId,
      avatarState: avatar.extractSave()
    };
    console.log('world.extractSave() => localStorage', JSON.stringify(rawObj));
    return rawObj;
  }
}

export default new World();
