import { log } from 'src/log';
import { World } from 'src/domain/world';
import {
  SAVE_WORLD_KEY,
  SAVE_WORLD_VERSION,
  SAVE_STATE_KEY,
  SAVE_STATE_VERSION,
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
      doSaveWorld(new SaveWorld());
      rawWorld = loadWorld();
    }

    let rawState = loadState();
    if (!rawState) {
      // Persist a pristine state and then load it back in.
      doSaveState(new SaveState());
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
    doSaveWorld(theSaveWorld);
    doSaveState(theSaveState);
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
  return <SaveWorld> rawToObj(raw, SAVE_WORLD_VERSION) || new SaveWorld();
}

function rawToSaveState(raw: string): SaveState {
  return <SaveState> rawToObj(raw, SAVE_STATE_VERSION) || new SaveState();
}

function doSaveWorld(saveWorld: SaveWorld) {
  localStorage.setItem(SAVE_WORLD_KEY, objToRaw(saveWorld, SAVE_WORLD_VERSION));
}

function doSaveState(saveState: SaveState) {
  localStorage.setItem(SAVE_STATE_KEY, objToRaw(saveState, SAVE_STATE_VERSION));
}

/**
 * TODO: Dangerous method because it affects domain-wide storage.
 */
function cleanUnknownKeys() {
  const unknownKeys = Object.keys(localStorage).map((key) => {
    return !ALLOWED_LOCAL_STORAGE_KEYS.includes(key) ? key : null;
  })
  .filter((key) => key !== null)
  .forEach((key) => {
    log('warn', 'Removing from localStorage:', key);
    localStorage.removeItem(key);
  });
}

function objToRaw(obj: any, currentVersion: number): string {
  const headerJson = JSON.stringify({
    version: currentVersion,
  });
  const headerBase64 = btoa(headerJson);
  const payloadJson = JSON.stringify(obj);
  const payloadBase64 = btoa(payloadJson);
  return `${headerBase64}.${payloadBase64}`;
}

function rawToObj(raw: string, currentVersion: number): any {
  let save: any;
  try {
    const [headerBase64, payloadBase64] = raw.split('.');
    const headerJson = atob(headerBase64);
    const header = JSON.parse(headerJson);

    if (header.version !== currentVersion) {
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
