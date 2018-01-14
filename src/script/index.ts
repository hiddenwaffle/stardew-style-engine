import { log } from 'src/log';
import { ScriptCallContext } from 'src/game-master/script-call';
import { ScriptNamespace } from './script-namespace';
import { global } from './global';

class Script {
  private readonly root: ScriptNamespace;

  constructor() {
    this.root = new ScriptNamespace();
    this.root.setNamespace('global', global);
  }

  execute(name: string, ctx: ScriptCallContext) {
    if (name) {
      const tokens = tokenize(name);
      if (tokens.length >= 1) {
        const path = tokens.shift().split('.');
        this.root.execute(path, tokens, ctx);
      } else {
        log('warn', `Could not parse: ${name}`);
      }
    }
  }
}

export const script = new Script();

export function tokenize(name: string): string[] {
  return name ? name.split(' ') : [];
}
