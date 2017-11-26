import {
  canvasBack,
  canvasScaled,
  ctxBack,
  ctxScaled,
  dynamicResizeContainer
} from './elements';
import {
  CONTAINER_ASPECT_HEIGHT,
  CONTAINER_ASPECT_WIDTH,
  FIELD_LOGICAL_HEIGHT,
  FIELD_LOGICAL_WIDTH,
  FONT_BASE_SIZE,
  TILE_SIZE
} from 'src/constants';

// TODO: Remove these two images.
import grass from './grass.png';
import townfolkF from './townfolk-f.png';

class UiStructure {
  constructor() {
    canvasBack.width = FIELD_LOGICAL_WIDTH;
    canvasBack.height = FIELD_LOGICAL_HEIGHT;
  }

  start() {
    this.factorStuffOutOfThis(); // TODO: Move this to the the renderer's source.

    window.addEventListener('resize', this.resizeHandler.bind(this), false);
    this.resizeHandler();

    // UI is set up; allow it to be displayed
    dynamicResizeContainer.style.opacity = '1';
    dynamicResizeContainer.style.transition = 'opacity 0.25s ease-in';
  }

  step() {
    ctxScaled.drawImage(
      canvasBack,
      0,
      0,
      canvasScaled.width,
      canvasScaled.height
    );
  }

  stop() {
    // Currently does nothing.
  }

  /**
   * First scale the container, then the container's contents.
   */
  private resizeHandler() {
    const containerScaleFactor = calculateScaleFactor(
      window.innerWidth,
      window.innerHeight,
      CONTAINER_ASPECT_WIDTH,
      CONTAINER_ASPECT_HEIGHT
    );
    this.scaleContainer(containerScaleFactor);

    const containerContentsScaleFactor = calculateScaleFactor(
      dynamicResizeContainer.clientWidth,
      dynamicResizeContainer.clientHeight,
      FIELD_LOGICAL_WIDTH,
      FIELD_LOGICAL_HEIGHT
    );
    this.scaleContainerContents(containerContentsScaleFactor);
  }

  private scaleContainer(scaleFactor: number) {
    const newWidth = Math.ceil(CONTAINER_ASPECT_WIDTH * scaleFactor);
    const newHeight = Math.ceil(CONTAINER_ASPECT_HEIGHT * scaleFactor);
    dynamicResizeContainer.style.width = `${newWidth}px`;
    dynamicResizeContainer.style.height = `${newHeight}px`;
  }

  /**
   * Currently the contents are the render field and narration.
   */
  private scaleContainerContents(scaleFactor: number) {
    const newWidth = Math.ceil(FIELD_LOGICAL_WIDTH * scaleFactor);
    const newHeight = Math.ceil(FIELD_LOGICAL_HEIGHT * scaleFactor);
    canvasScaled.width = newWidth;
    canvasScaled.height = newHeight;
    // Must reset these after resize: https://stackoverflow.com/a/29564875
    ctxScaled.mozImageSmoothingEnabled = false;
    ctxScaled.webkitImageSmoothingEnabled = false;
    ctxScaled.oImageSmoothingEnabled = false;
    ctxScaled.imageSmoothingEnabled = false;

    const narrationContainer = document.getElementById('narration-container');
    const fontSize = Math.ceil(FONT_BASE_SIZE * scaleFactor);
    narrationContainer.style.fontSize = `${fontSize}px`;
  }

  private factorStuffOutOfThis() {
    {
      const img = new Image();
      img.onload = () => {
        for (let y = 0; y < 13; y++) {
          for (let x = 0; x < 17; x++) {
            ctxBack.drawImage(img, x * TILE_SIZE, y * TILE_SIZE);
          }
        }
      };
      img.src = grass;
    }
    {
      const img = new Image();
      img.onload = () => {
        ctxBack.drawImage(img, 8 * TILE_SIZE, 6 * TILE_SIZE);
      };
      img.src = townfolkF;
    }
  }
}

export default new UiStructure();

/**
 * Determine how much to scale the given logical rectangle
 * into the actual rectangle, while preserving the logical
 * rectangle's aspect ratio.
 *
 * Credit to: https://codepen.io/anthdeldev/pen/PGPmVm
 */
function calculateScaleFactor(
  actualWidth: number, actualHeight: number,
  logicalWidth: number, logicalHeight: number
): number {
  const scaleFactor = Math.min(
    actualWidth / logicalWidth,
    actualHeight / logicalHeight
  );
  return scaleFactor;
}
