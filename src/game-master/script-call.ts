import script from 'src/script';

export class ScriptCall {
  private readonly name: string;
  private readonly primaryEntityId: number;
  private readonly secondaryEntityId: number;

  constructor(name: string, primaryEntityId?: number, secondaryEntityId?: number) {
    this.name = name;
    this.primaryEntityId = primaryEntityId;
    this.secondaryEntityId = secondaryEntityId;
  }

  execute() {
    // TODO: Use primaryEntityId and secondaryEntityId
    script.execute(this.name);
  }

  /**
   * A composite key that allows script batches to contain only one
   * instance of a call between an entity and zero to one other entity.
   */
  get key() {
    return `${this.name}|${this.primaryEntityId}|${this.secondaryEntityId}`;
  }
}

export class ScriptCallBatch {
  private readonly scriptCalls: Map<string, ScriptCall>;

  constructor() {
    this.scriptCalls = new Map();
  }

  execute() {
    for (const [ key, scriptCall ] of Array.from(this.scriptCalls)) {
      scriptCall.execute();
    }
  }

  add(scriptCall: ScriptCall) {
    this.scriptCalls.set(scriptCall.key, scriptCall);
  }
}
