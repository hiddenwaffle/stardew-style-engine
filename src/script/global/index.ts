import { log } from 'src/log';
import { ScriptCallContext } from 'src/game-master/script-call';
import { ScriptHandler, ScriptNamespace } from 'src/script/script-namespace';
import { switchMap } from './switch-map';

export const global = new ScriptNamespace();

global.setHandler('sayOuch', () => {
  log('info', '"ouch"', '"that hurts"');
});

global.setHandler('fire', (val1: string, val2: string, ctx: ScriptCallContext) => {
  const total = parseInt(val1, 10) + parseInt(val2, 10);
  log(
    'info',
    `fire() val1: ${val1} val2: ${val2} = ${total}, ` +
    `entity count: ${ctx.world.entities.length}, ` +
    `Primary: ${ctx.primaryEntityId}, Secondary: ${ctx.secondaryEntityId}, ` +
    `Tile Layer: ${ctx.tileLayerName}`,
  );
});

global.setHandler('switchMap', (mapName: string, entrance: string, ctx: ScriptCallContext) => {
  switchMap(mapName, entrance, ctx.world);
});

global.setHandler('narrate', (line: string[], ctx: ScriptCallContext) => {
  console.log(line, ctx);
});
