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
   * it must be the handler's name so find and call it.
   * Otherwise, delegate the rest of the path to a sub-namespace.
   */
  execute(path: string[]) {
    if (path) {
      if (path.length === 1) {
        const handlerName = path.shift();
        const handler = this.handlers.get(handlerName);
        if (handler) {
          handler();
        }
      } else if (path.length > 1) {
        const namespaceName = path.shift();
        const namespace = this.namespaces.get(namespaceName);
        if (namespace) {
          namespace.execute(path);
        }
      }
    }
  }
}
