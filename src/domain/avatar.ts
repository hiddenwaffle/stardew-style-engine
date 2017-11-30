class Avatar {
  x: number;
  y: number;

  applySave(rawObj: any) {
    if (rawObj) {
      this.x = rawObj.x;
      this.y = rawObj.y;
    }
  }

  extractSave(): any {
    // Default position is (0, 0):
    return {
      x: this.x ? this.x : 0,
      y: this.y ? this.y : 0
    };
  }
}

export default new Avatar();
