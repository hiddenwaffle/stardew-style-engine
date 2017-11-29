import { AvatarState } from 'src/session/save-state';

export default class {
  x: number;
  y: number;

  constructor(obj?: any) {
    if (obj) {
      this.x = Number.parseInt(obj.x, 10);
      this.y = Number.parseInt(obj.y, 10)
    } else {
      this.x = 1234;
      this.y = 4321;
    }
  }

  applySave(avatarState: AvatarState) {
    // TODO: Do it
  }

  extractSave(): AvatarState {
    // TODO: Do it
    return new AvatarState();
  }
}
