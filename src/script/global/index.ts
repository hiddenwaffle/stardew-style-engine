import { log } from 'src/log';
import { ScriptCallContext } from 'src/game-master/script-call';
import { ScriptHandler, ScriptNamespace } from 'src/script/script-namespace';
import { switchMap } from './switch-map';

export const global = new ScriptNamespace();

global.setHandler('sayOuch', () => {
  log('info', '"ouch"', '"that hurts"');
});

global.setHandler('fire', (ctx: ScriptCallContext, val1: string, val2: string) => {
  const total = parseInt(val1, 10) + parseInt(val2, 10);
  log(
    'info',
    `fire() val1: ${val1} val2: ${val2} = ${total}, ` +
    `entity count: ${ctx.world.entities.length}, ` +
    `Primary: ${ctx.primaryEntityId}, Secondary: ${ctx.secondaryEntityId}, ` +
    `Tile Layer: ${ctx.tileLayerName}`,
  );
});

global.setHandler('switchMap', (ctx: ScriptCallContext, mapName: string, entrance: string) => {
  switchMap(mapName, entrance, ctx.world);
});

global.setHandler('narrate', (ctx: ScriptCallContext, ...line: string[]) => {
  log('info', ctx.primaryEntityId, line.join(' '));
});
