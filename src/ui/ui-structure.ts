import {
  body,
  dynamicResizeContainer,
  canvasBack,
  ctxBack,
  canvasScaled,
  ctxScaled,
  narrationContainer
} from './elements';
import {
  CONTAINER_ASPECT_HEIGHT,
  CONTAINER_ASPECT_WIDTH,
  FIELD_TARGET_HEIGHT,
  FIELD_TARGET_WIDTH,
  FONT_BASE_SIZE
} from 'src/constants';

class UiStructure {
  constructor() {
    canvasBack.width = FIELD_TARGET_WIDTH;
    canvasBack.height = FIELD_TARGET_HEIGHT;
  }

  start() {
    body.oncontextmenu = (event) => {
      event.preventDefault();
    };

    window.addEventListener('resize', this.resizeHandler.bind(this), false);
    this.resizeHandler();

    // UI is set up; allow it to be displayed
    dynamicResizeContainer.style.opacity = '1';
    dynamicResizeContainer.style.transition = 'opacity 0.25s ease-in';
  }

  step() {
    ctxScaled.clearRect(
      0,
      0,
      canvasScaled.width,
      canvasScaled.height
    );
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
      FIELD_TARGET_WIDTH,
      FIELD_TARGET_HEIGHT
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
    const newWidth = Math.ceil(FIELD_TARGET_WIDTH * scaleFactor);
    const newHeight = Math.ceil(FIELD_TARGET_HEIGHT * scaleFactor);
    canvasScaled.width = newWidth;
    canvasScaled.height = newHeight;
    // Must reset after resize: https://stackoverflow.com/a/29564875
    // Setting for backbuffer too just because we need to at some point.
    [ctxBack, ctxScaled].forEach((ctx) => {
      ctx.webkitImageSmoothingEnabled = false;
      ctx.oImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
    });

    const fontSize = Math.ceil(FONT_BASE_SIZE * scaleFactor);
    narrationContainer.style.fontSize = `${fontSize}px`;
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
