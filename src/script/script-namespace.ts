import World from 'src/domain/world';

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
  execute(path: string[], world: World) {
    if (path) {
      if (path.length === 1) {
        const callStr = path.shift();
        const [handlerName, args] = parseCallStr(callStr);
        const handler = this.handlers.get(handlerName);
        if (handler) {
          handler.apply(handler, [...args, world]);
        } else {
          console.warn(`Handler not found: ${handler}. Args: ${args}`);
        }
      } else if (path.length > 1) {
        const namespaceName = path.shift();
        const namespace = this.namespaces.get(namespaceName);
        if (namespace) {
          namespace.execute(path, world);
        } else {
          console.warn(`Namespace not found: ${namespaceName}`);
        }
      }
    }
  }
}

/**
 * Expects calls to be formatted like:
 * fire 100 50
 * Where "fire" is the handler name, 100 is the first argument,
 * and 50 is the second argument.
 */
function parseCallStr(call: string): [string, string[]] {
  const args = call.split(' ');
  if (args.length >= 1) {
    const handlerName = args.shift();
    return [handlerName, args];
  } else {
    return ['', []];
  }
}
