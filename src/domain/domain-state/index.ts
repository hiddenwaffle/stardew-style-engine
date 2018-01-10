import { SaveState } from 'src/session/save';

export class DomainState {
  constructor(save: SaveState) {
    // TODO: Do something
  }

  extractSave(): SaveState {
    return new SaveState();
  }
}
