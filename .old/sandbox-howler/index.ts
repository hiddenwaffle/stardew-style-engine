declare function require(str: string): string; // https://github.com/Microsoft/TypeScript-React-Starter/issues/12

import { Howl } from 'howler';

const blastData = require('./blast.wav');
const blast = new Howl({
  src: [blastData]
});
blast.once('load', () => {
  blast.play();
});

setTimeout(() => {
  const jumpData = require('./jump.wav');
  const jump = new Howl({
    src: [jumpData]
  });
  jump.once('load', () => {
    jump.play();
  });
}, 1000);
