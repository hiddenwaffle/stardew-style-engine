// import '@/sandbox-pixi';
// import '@/sandbox-ioc';
// import '@/sandbox-howler';
// import '@/sandbox-gfx';

// declare function require(str: string): string; // https://github.com/Microsoft/TypeScript-React-Starter/issues/12

const tileSize = 16;
const fieldLogicalWidth = 17 * tileSize;
const fieldLogicalHeight = 14 * tileSize;
const fontBaseSize = 5.25; // Just "looks good" in Chrome on Mac.

const canvasBack = <HTMLCanvasElement> document.getElementById('canvas-back');
canvasBack.width = fieldLogicalWidth;
canvasBack.height = fieldLogicalHeight;
const ctxBack = canvasBack.getContext('2d');
const canvasScaled = <HTMLCanvasElement> document.getElementById('canvas-scaled');
const ctxScaled = canvasScaled.getContext('2d');

// Resize based on: https://codepen.io/anthdeldev/pen/PGPmVm
const dynamicResizeContainer = document.getElementById('dynamic-resize-container');
{
  const containerLogicalWidth = 16; // this is aspect ratio,
  const containerLogicalHeight = 9; // rather than pixels.
  const resizeHandler = () => {
    const scaleFactor = Math.min(
      window.innerWidth / containerLogicalWidth,
      window.innerHeight / containerLogicalHeight
    );
    const newWidth = Math.ceil(containerLogicalWidth * scaleFactor);
    const newHeight = Math.ceil(containerLogicalHeight * scaleFactor);
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
      dynamicResizeContainer.clientWidth / fieldLogicalWidth,
      dynamicResizeContainer.clientHeight / fieldLogicalHeight
    );
    const newWidth = Math.ceil(fieldLogicalWidth * scaleFactor);
    const newHeight = Math.ceil(fieldLogicalHeight * scaleFactor);
    canvasScaled.width = newWidth;
    canvasScaled.height = newHeight;
    ctxScaled.mozImageSmoothingEnabled = false;
    ctxScaled.webkitImageSmoothingEnabled = false;
    // ctxScaled.msImageSmoothingEnabled = false;
    ctxScaled.imageSmoothingEnabled = false;

    // Scale font too.
    const narrationContainer = document.getElementById('narration-container');
    const fontSize = Math.ceil(fontBaseSize * scaleFactor);
    narrationContainer.style.fontSize = `${fontSize}px`;
  };
  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
}

dynamicResizeContainer.style.opacity = '1';
dynamicResizeContainer.style.transition = 'opacity 0.25s ease-in';

function render() {
  ctxScaled.drawImage(canvasBack, 0, 0, canvasScaled.width, canvasScaled.height);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
