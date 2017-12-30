import { World } from 'src/domain/world';
import {
  ScriptCall,
  ScriptCallBatch,
} from './script-call';

export class WalkResult {
  private readonly world: World;
  private readonly calls: ScriptCallBatch;
  readonly collisionTileLayers: string[];

  constructor(world: World) {
    this.world = world;
    this.calls = new ScriptCallBatch();
    this.collisionTileLayers = [];
  }

  addCall(call: ScriptCall) {
    this.calls.add(call);
  }

  executeCalls() {
    this.calls.execute(this.world);
  }

  addCollisionTileLayer(tileLayerName: string) {
    this.collisionTileLayers.push(tileLayerName);
  }
}
