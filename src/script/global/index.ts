import { log } from 'src/log';
import { ScriptCallContext } from 'src/game-master/script-call';
import { ScriptHandler, ScriptNamespace } from 'src/script/script-namespace';
import { switchMap } from './switch-map';
import { narrator } from 'src/text/narrator';

export const global = new ScriptNamespace();

global.setHandler('sayOuch', (ctx: ScriptCallContext) => {
  if (ctx.primaryOrSecondaryEntityIsPlayer()) {
    narrator.write('You bump into a dragon');
  }
});

global.setHandler('fire', (ctx: ScriptCallContext, val1: string, val2: string) => {
  if (ctx.primaryOrSecondaryEntityIsPlayer()) {
    const total = parseInt(val1, 10) + parseInt(val2, 10);
    narrator.write(`Fire burns you for X amount ${total}`);
  }
});

/**
 * Switch the map only if it the player entity is involved.
 */
global.setHandler('switchMap', (ctx: ScriptCallContext, mapName: string, entrance: string) => {
  if (ctx.primaryOrSecondaryEntityIsPlayer()) {
    switchMap(mapName, entrance, ctx.world);
  }
});

global.setHandler('narrate', (ctx: ScriptCallContext, ...line: string[]) => {
  if (ctx.primaryOrSecondaryEntityIsPlayer()) {
    const text = line.join(' ');
    narrator.write(text);
  }
});
