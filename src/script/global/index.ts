import { ScriptHandler, ScriptNamespace } from 'src/script/script-namespace';

const global = new ScriptNamespace();

global.setHandler('sayOuch', () => {
  console.log('"ouch"');
});

global.setHandler('fire', () => {
  console.log('The fire burns you for 50 damage.');
});

export default global;
