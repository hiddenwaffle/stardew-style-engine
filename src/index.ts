declare function require(str: string): string; // https://github.com/Microsoft/TypeScript-React-Starter/issues/12

import * as PIXI from 'pixi.js';

const tileSize = 16;
const fontBaseSize = 5.25; // Just "looks good" in Chrome on Mac.
const logicalWidth = 17 * tileSize;
const logicalHeight = 14 * tileSize;

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

// Render some tiles
{
  const grass = require('./grass01.png');
  const texture = PIXI.Texture.from(grass);
  PIXI.Texture.addToCache(texture, 'grass01');
  for (let y = 0; y < (13 * 16); y += 16) {
    for (let x = 0; x < (17 * 16); x += 16) {
      const sprite = PIXI.Sprite.fromFrame('grass01');
      sprite.position.x = x;
      sprite.position.y = y;
      mainContainer.addChild(sprite);
    }
  }
}
// Render some water
{
  const water = require('./water3x3.png');
  const texture = PIXI.Texture.from(water);
  PIXI.Texture.addToCache(texture, 'water3x3');
  const sprite = PIXI.Sprite.fromFrame('water3x3');
  sprite.position.x = 4 * 16;
  sprite.position.y = 4 * 16;
  mainContainer.addChild(sprite);
}
// Render a character
{
  const player = require('./player_25.png');
  const texture = PIXI.Texture.from(player);
  PIXI.Texture.addToCache(texture, 'player_25');
  const sprite = PIXI.Sprite.fromFrame('player_25');
  sprite.position.x = 9 * 16;
  sprite.position.y = 6 * 16;
  mainContainer.addChild(sprite);
}
// Render some other characters
{
  const fighter = require('./fighter.png');
  const texture = PIXI.Texture.from(fighter);
  PIXI.Texture.addToCache(texture, 'fighter');
  const sprite = PIXI.Sprite.fromFrame('fighter');
  sprite.position.x = 12 * 16;
  sprite.position.y = 3 * 16;
  mainContainer.addChild(sprite);
}

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
    const fontSize = Math.ceil(fontBaseSize * scaleFactor);
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
