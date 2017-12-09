import { ScriptHandler, ScriptNamespace } from 'src/game-master/script/script-namespace';

const global = new ScriptNamespace();

global.addHandler('sayOuch', () => {
  console.log('"ouch"');
});

global.addHandler('fire', () => {
  console.log('The fire burns you for 50 damage.');
});

export default global;
