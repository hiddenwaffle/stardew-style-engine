import { ScriptCallContext } from 'src/game-master/script-call';
import { ScriptHandler, ScriptNamespace } from 'src/script/script-namespace';

const global = new ScriptNamespace();

global.setHandler('sayOuch', () => {
  console.log('"ouch"');
});

global.setHandler('fire', (val1: string, val2: string, ctx: ScriptCallContext) => {
  const total = parseInt(val1) + parseInt(val2);
  console.log(
    `fire() val1: ${val1} val2: ${val2} ` +
    `entity count: ${ctx.world.entities.size} ` +
    `Entity IDs ${ctx.primaryEntityId} ${ctx.secondaryEntityId}` +
    `Tile: ${ctx.tileLayerName} ${ctx.xtile}, ${ctx.ytile}`
  );
});

export default global;
