import { log } from 'src/log';
import { ScriptCallContext } from 'src/game-master/script-call';

export type ScriptHandler = (...args: any[]) => void;

export class ScriptNamespace {
  private readonly handlers: Map<string, ScriptHandler>;
  private readonly namespaces: Map<string, ScriptNamespace>;

  constructor() {
    this.handlers = new Map();
    this.namespaces = new Map();
  }

  setHandler(name: string, handler: ScriptHandler) {
    if (name && name.length > 0 && handler) {
      this.handlers.set(name, handler);
    }
  }

  setNamespace(name: string, namespace: ScriptNamespace) {
    if (name && name.length > 0 && namespace) {
      this.namespaces.set(name, namespace);
    }
  }

  /**
   * If there is only one remaining element in the given path,
   * it must be the actual call.
   * Otherwise, delegate the rest of the path to a sub-namespace.
   */
  execute(path: string[], args: string[], ctx: ScriptCallContext) {
    if (path) {
      if (path.length === 1) {
        const handlerName = path.shift();
        const handler = this.handlers.get(handlerName);
        if (handler) {
          handler.apply(handler, [ctx, ...args]);
        } else {
          log('warn', `Handler not found: ${handler}. Args: ${args}`);
        }
      } else if (path.length > 1) {
        const namespaceName = path.shift();
        const namespace = this.namespaces.get(namespaceName);
        if (namespace) {
          namespace.execute(path, args, ctx);
        } else {
          log('warn', `Namespace not found: ${namespaceName}`);
        }
      }
    }
  }
}
