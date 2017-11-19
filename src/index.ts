declare function require(str: string): string;

require('./main.css');

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

document.body.appendChild(renderer.view);
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

const logicalWidth = 320;
const logicalHeight = 240;

const resizeHandler = () => {
  const scaleFactor = Math.min(
    window.innerWidth / logicalWidth,
    window.innerHeight / logicalHeight
  );
  const newWidth = Math.ceil(logicalWidth * scaleFactor);
  const newHeight = Math.ceil(logicalHeight * scaleFactor);

  renderer.view.style.width = `${newWidth}px`;
  renderer.view.style.height = `${newHeight}px`;

  renderer.resize(newWidth, newHeight);
  mainContainer.scale.set(scaleFactor);
};

window.addEventListener('resize', resizeHandler, false);

resizeHandler();

setTimeout(() => {
  import('./another').then((someModule) => {
    someModule.default();
  });
}, 500);
