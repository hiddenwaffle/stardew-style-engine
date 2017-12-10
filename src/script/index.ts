import { ScriptHandler, ScriptNamespace } from './script-namespace';
import global from './global';

class Script {
  private readonly root: ScriptNamespace;

  constructor() {
    this.root = new ScriptNamespace();
    this.root.setNamespace('global', global);
  }

  execute(name: string) {
    if (name) {
      const path = name.split('.');
      this.root.execute(path);
    }
  }
}

export default new Script();
