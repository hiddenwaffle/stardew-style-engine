import { ScriptCallContext } from 'src/game-master/script-call';
import { ScriptHandler, ScriptNamespace } from 'src/script/script-namespace';
import switchMap from './switch-map';

const global = new ScriptNamespace();

global.setHandler('sayOuch', () => {
  console.log('"ouch"');
});

global.setHandler('fire', (val1: string, val2: string, ctx: ScriptCallContext) => {
  const total = parseInt(val1, 10) + parseInt(val2, 10);
  console.log(
    `fire() val1: ${val1} val2: ${val2} = ${total}, ` +
    `entity count: ${ctx.world.entities.length}, ` +
    `Primary: ${ctx.primaryEntityId}, Secondary: ${ctx.secondaryEntityId}, ` +
    `Tile Layer: ${ctx.tileLayerName}`
  );
});

global.setHandler('switchMap', (mapName: string, entrance: string, ctx: ScriptCallContext) => {
  switchMap(mapName, entrance, ctx.world);
});

export default global;
