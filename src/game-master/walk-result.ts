import World from 'src/domain/world';
import {
  ScriptCall,
  ScriptCallBatch
} from './script-call';

export default class {
  private readonly calls: ScriptCallBatch;
  readonly collisionTileLayers: string[];

  constructor() {
    this.calls = new ScriptCallBatch();
    this.collisionTileLayers = [];
  }

  addCall(call: ScriptCall) {
    this.calls.add(call);
  }

  executeCalls(world: World) {
    this.calls.execute(world);
  }

  addCollisionTileLayer(tileLayerName: string) {
    this.collisionTileLayers.push(tileLayerName);
  }
}
