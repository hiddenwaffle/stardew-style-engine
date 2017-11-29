import Avatar from './avatar';

export default class {
  readonly avatar: Avatar;

  constructor(obj?: any) {
    console.log('game-state#constructor - before', JSON.stringify(obj));
    if (obj) {
      this.avatar = new Avatar(obj.avatar);
    } else {
      this.avatar = new Avatar();
    }
    console.log('game-state#constructor - after', JSON.stringify(this));
  }
}
