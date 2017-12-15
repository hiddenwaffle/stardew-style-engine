import { ScriptCallContext } from 'src/game-master/script-call';
import { ScriptHandler, ScriptNamespace } from './script-namespace';
import global from './global';

class Script {
  private readonly root: ScriptNamespace;

  constructor() {
    this.root = new ScriptNamespace();
    this.root.setNamespace('global', global);
  }

  execute(name: string, ctx: ScriptCallContext) {
    if (name) {
      const path = name.split('.');
      this.root.execute(path, ctx);
    }
  }
}

export default new Script();
