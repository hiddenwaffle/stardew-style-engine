import { log } from 'src/log';
import { World } from 'src/domain/world';
import {
  SAVE_WORLD_KEY,
  SAVE_STATE_KEY,
  SAVE_VERSION,
  ALLOWED_LOCAL_STORAGE_KEYS,
} from 'src/constants';
import { SaveWorld, SaveState } from './save';

class Persistence {
  /**
   * Reverse steps of save(), but also ensures save file exists.
   */
  loadAndClean(): [SaveWorld, SaveState] {
    let rawWorld = loadWorld();
    if (!rawWorld) {
      // Persist a pristine world and then load it back in.
      saveWorld(new SaveWorld());
      rawWorld = loadWorld();
    }

    let rawState = loadState();
    if (!rawState) {
      // Persist a pristine state and then load it back in.
      saveState(new SaveState());
      rawState = loadState();
    }

    // Clean after load because migrations might rename keys.
    cleanUnknownKeys();

    return [
      rawToSaveWorld(rawWorld),
      rawToSaveState(rawState),
    ];
  }

  save(theSaveWorld: SaveWorld, theSaveState: SaveState) {
    saveWorld(theSaveWorld);
    saveState(theSaveState);
  }
}

export const persistence = new Persistence();

function loadWorld(): string {
  return localStorage.getItem(SAVE_WORLD_KEY);
}

function loadState(): string {
  return localStorage.getItem(SAVE_STATE_KEY);
}

function rawToSaveWorld(raw: string): SaveWorld {
  return <SaveWorld> rawToObj(raw) || new SaveWorld();
}

function rawToSaveState(raw: string): SaveState {
  return <SaveState> rawToObj(raw) || new SaveState();
}

function saveWorld(saveWorld: SaveWorld) {
  localStorage.setItem(SAVE_WORLD_KEY, objToRaw(saveWorld));
}

function saveState(saveState: SaveState) {
  localStorage.setItem(SAVE_STATE_KEY, objToRaw(saveState));
}

/**
 * TODO: Dangerous method because it affects domain-wide storage.
 */
function cleanUnknownKeys() {
  const unknownKeys = Object.keys(localStorage).map((key) => {
    return !ALLOWED_LOCAL_STORAGE_KEYS.includes(key) ? key : null;
  })
  .filter(key => key !== null)
  .forEach((key) => {
    console.log('Removing from localStorage:', key);
    localStorage.removeItem(key);
  });
}

function objToRaw(obj: any): string {
  const headerJson = JSON.stringify({
    version: SAVE_VERSION,
  });
  const headerBase64 = btoa(headerJson);
  const payloadJson = JSON.stringify(obj);
  const payloadBase64 = btoa(payloadJson);
  return `${headerBase64}.${payloadBase64}`;
}

function rawToObj(raw: string): any {
  let save: any;
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
    save = JSON.parse(payloadJson);
  } catch (e) {
    log('warn', 'Unable to unmarshal JSON save, returning null', e, raw);
    save = null;
  }

  return save;
}
