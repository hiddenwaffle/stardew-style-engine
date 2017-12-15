import script from 'src/script';

export default class {
  private readonly scriptNames: Set<string>;

  constructor() {
    this.scriptNames = new Set();
  }

  execute() {
    for (let stringName of Array.from(this.scriptNames)) {
      script.execute(stringName);
    }
  }

  addOnce(scriptName: string) {
    this.scriptNames.add(scriptName);
  }

  addRepeatedly(scriptName: string) {
    this.scriptNames.add(scriptName);
  }
}
