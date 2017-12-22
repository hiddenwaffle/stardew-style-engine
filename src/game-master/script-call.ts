import { script } from 'src/script';
import { World } from 'src/domain/world';

export class ScriptCallContext {
  readonly world: World;
  readonly primaryEntityId: number;
  readonly secondaryEntityId: number;
  readonly tileLayerName: string;

  constructor(
    world: World,
    primaryEntityId: number,
    secondaryEntityId: number,
    tileLayerName: string,
  ) {
    this.world = world;
    this.primaryEntityId = primaryEntityId;
    this.secondaryEntityId = secondaryEntityId;
    this.tileLayerName = tileLayerName;
  }
}

export class ScriptCall {
  private readonly name: string;
  private readonly primaryEntityId: number;
  readonly secondaryEntityId: number;
  readonly tileLayerName: string;

  constructor(
    name: string,
    primaryEntityId?: number,
    secondaryEntityId?: number,
    tileLayerName?: string,
  ) {
    this.name = name;
    this.primaryEntityId = primaryEntityId || null;
    this.secondaryEntityId = secondaryEntityId || null;
    this.tileLayerName = tileLayerName || null;
  }

  execute(world: World) {
    const ctx = new ScriptCallContext(
      world,
      this.primaryEntityId,
      this.secondaryEntityId,
      this.tileLayerName,
    );
    script.execute(this.name, ctx);
  }

  /**
   * A composite key that allows script batches to contain only one
   * instance of a call between an entity and zero to one other entity or tile layer.
   *
   * Notice that it does not use xtile and ytile because a collision layer
   * is supposed to represent a single "thing" rather than tiles of "things".
   */
  get key() {
    return `${this.name}|${this.primaryEntityId}|${this.secondaryEntityId}` +
           `${this.tileLayerName}`;
  }
}

export class ScriptCallBatch {
  private readonly scriptCalls: Map<string, ScriptCall>;

  constructor() {
    this.scriptCalls = new Map();
  }

  execute(world: World) {
    for (const [key, scriptCall] of Array.from(this.scriptCalls)) {
      scriptCall.execute(world);
    }
  }

  add(scriptCall: ScriptCall) {
    this.scriptCalls.set(scriptCall.key, scriptCall);
  }
}
