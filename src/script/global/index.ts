import World from 'src/domain/world';
import { ScriptHandler, ScriptNamespace } from 'src/script/script-namespace';

const global = new ScriptNamespace();

global.setHandler('sayOuch', () => {
  console.log('"ouch"');
});

global.setHandler('fire', (val1: string, val2: string, world: World) => {
  const total = parseInt(val1) + parseInt(val2);
  console.log(`fire() val1: ${val1} val2: ${val2} entity count: ${world.entities.size}`);
});

export default global;
