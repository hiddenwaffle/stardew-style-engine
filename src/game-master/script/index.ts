import { ScriptHandler, ScriptNamespace } from './script-namespace';

class Script {
  private readonly root: ScriptNamespace;

  constructor() {
    this.root = new ScriptNamespace();

    const global = new ScriptNamespace();
    global.addHandler('sayOuch', () => {
      console.log('"ouch"');
    });
    global.addHandler('fire', () => {
      console.log('The fire burns you for 50 damage.');
    });
    this.root.addNamespace('global', global);
  }

  execute(name: string) {
    if (name) {
      const path = name.split('.');
      this.root.execute(path);
    }
  }
}

export default new Script();
