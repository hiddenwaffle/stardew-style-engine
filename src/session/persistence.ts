import { log } from 'src/log';
import { World } from 'src/domain/world';
import {
  SAVE_KEY,
  SAVE_VERSION,
} from 'src/constants';
import { SaveWorld } from './save';

function loadFromLocalStorage(): string {
  return localStorage.getItem(SAVE_KEY);
}

class Persistence {
  /**
   * Reverse steps of save(), but also ensures save file exists.
   */
  load(): SaveWorld {
    let raw = loadFromLocalStorage();
    if (!raw) {
      // Persist a pristine world and then load it back in.
      this.save(new SaveWorld());
      raw = loadFromLocalStorage();
    }
    return rawToSaveWorld(raw);
  }

  /**
   * Reverse steps of load().
   */
  save(save: SaveWorld) {
    const raw = saveWorldToRaw(save);
    localStorage.setItem(SAVE_KEY, raw);
  }
}

export const persistence = new Persistence();

function rawToSaveWorld(raw: string): SaveWorld {
  let save;
  try {
    const [headerBase64, payloadBase64] = raw.split('.');
    const headerJson = atob(headerBase64);
    const header = JSON.parse(headerJson);

    if (header.version !== SAVE_VERSION) {
      // TODO: This is where version migrations might occur.
      // TODO: Instead, for now, just throw an error so it resets the world.
      throw Error('Does not match');
    }

    const payloadJson = atob(payloadBase64);
    save = <SaveWorld> JSON.parse(payloadJson);
  } catch (e) {
    log('warn', 'Unable to unmarshal save, using defaults', e, raw);
    save = new SaveWorld();
  }

  return save;
}

function saveWorldToRaw(save: SaveWorld): string {
  const headerJson = JSON.stringify({
    version: SAVE_VERSION,
  });
  const headerBase64 = btoa(headerJson);
  const payloadJson = JSON.stringify(save);
  const payloadBase64 = btoa(payloadJson);
  return `${headerBase64}.${payloadBase64}`;
}
