export default class {
  x: number;
  y: number;

  constructor() {
    // this.x = 0;
    // this.y = 0;
  }

  applySave(rawObj: any) {
    if (rawObj) {
      this.x = rawObj.x;
      this.y = rawObj.y;
    }
  }

  extractSave(): any {
    // TODO: Do it
    return {
      x: this.x,
      y: this.y
    };
  }
}
