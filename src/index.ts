declare function require(str: string): string;

import temp from './temp';
import * as PIXI from 'pixi.js';
const ryu = require('./ryu.png'); // https://github.com/Microsoft/TypeScript-React-Starter/issues/12

console.log('addition1: ' + temp(1, 2));
console.log('addition2: ' + temp(3, 4));
console.log('addition3: ' + temp(5, 6));

const renderer = PIXI.autoDetectRenderer(96, 96, {
  roundPixels: true,
  resolution: window.devicePixelRatio || 1
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const canvasContainer = document.querySelector('#canvas-container');
canvasContainer.appendChild(renderer.view); // TODO: Prevent display of entire page until this is appended.

const stage = new PIXI.Container();

const mainContainer = new PIXI.Container();
stage.addChild(mainContainer);

const texture = PIXI.Texture.from(ryu);
PIXI.Texture.addToCache(texture, 'cheeseburger-ryu');
const sprite = PIXI.Sprite.fromFrame('cheeseburger-ryu');
sprite.position.x = 320 / 2;
sprite.position.y = 240 / 2;
sprite.anchor.set(0.5);
mainContainer.addChild(sprite);

function bob() {
  renderer.render(stage);
  requestAnimationFrame(bob);
}
requestAnimationFrame(bob);

// Resize based on: https://codepen.io/anthdeldev/pen/PGPmVm
const dynamicResizeContainer = document.getElementById('dynamic-resize-container');
{
  const logicalWidth = 16;
  const logicalHeight = 9;
  const resizeHandler = () => {
    const scaleFactor = Math.min(
      window.innerWidth / logicalWidth,
      window.innerHeight / logicalHeight
    );
    const newWidth = Math.ceil(logicalWidth * scaleFactor);
    const newHeight = Math.ceil(logicalHeight * scaleFactor);
    dynamicResizeContainer.style.width = `${newWidth}px`;
    dynamicResizeContainer.style.height = `${newHeight}px`;
  }
  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
}
// Resize based on: https://codepen.io/anthdeldev/pen/PGPmVm
{
  const logicalWidth = 17 * 32;
  const logicalHeight = 13 * 32;
  const resizeHandler = () => {
    const scaleFactor = Math.min(
      dynamicResizeContainer.clientWidth / logicalWidth,
      dynamicResizeContainer.clientHeight / logicalHeight
    );
    const newWidth = Math.ceil(logicalWidth * scaleFactor);
    const newHeight = Math.ceil(logicalHeight * scaleFactor);
    renderer.view.style.width = `${newWidth}px`;
    renderer.view.style.height = `${newHeight}px`;
    renderer.resize(newWidth, newHeight);
    mainContainer.scale.set(scaleFactor);

    // Scale font too.
    const narrationContainer = document.getElementById('narration-container');
    const fontSize = Math.ceil(8.5 * scaleFactor); // 8.5. just "looked good" in Chrome on Mac.
    console.log('scaleFactor', scaleFactor);
    console.log('fontSize', fontSize);
    narrationContainer.style.fontSize = `${fontSize}px`;
  };
  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
}

// TODO: Make better
setTimeout(() => {
  const dynamicResizeContainer = document.getElementById('dynamic-resize-container');
  dynamicResizeContainer.style.visibility = 'visible';
}, 1);

setTimeout(() => {
  import('./another').then((someModule) => {
    someModule.default();
  });
  const narrationContainer = document.getElementById('narration-container');
  const section = document.createElement('div');
  section.innerText = 'Lorem ipsum yadda yadda yadda';
  narrationContainer.appendChild(section);
}, 500);
