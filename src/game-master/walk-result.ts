import World from 'src/domain/world';
import {
  ScriptCall,
  ScriptCallBatch
} from './script-call';

export default class {
  private readonly calls: ScriptCallBatch;

  constructor() {
    this.calls = new ScriptCallBatch();
  }

  addCall(call: ScriptCall) {
    this.calls.add(call);
  }

  executeCalls(world: World) {
    this.calls.execute(world);
  }
}
