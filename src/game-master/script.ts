class Script {
  private readonly functions: Map<string, () => void>;

  constructor() {
    this.functions = new Map();
    this.functions.set('global#sayOuch',  this.sayOuch);
    this.functions.set('global#fire',     this.fire);
  }

  call(name: string) {
    if (name) {
      const fn = this.functions.get(name);
      if (fn) {
        fn();
      } else {
        console.error(`Could not find function ${name}`);
      }
    }
  }

  private sayOuch() {
    console.log('"ouch"');
  }

  private fire() {
    console.log('Fire burns you for 50 damage');
  }
}

export default new Script();
