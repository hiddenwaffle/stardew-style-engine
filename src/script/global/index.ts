import { ScriptHandler, ScriptNamespace } from 'src/script/script-namespace';

const global = new ScriptNamespace();

global.setHandler('sayOuch', () => {
  console.log('"ouch"');
});

global.setHandler('fire', (val1: string, val2: string) => {
  const total = parseInt(val1) + parseInt(val2);
  console.log(`The fire burns you for ${val1} + ${val2} = ${total} damage.`);
});

export default global;
