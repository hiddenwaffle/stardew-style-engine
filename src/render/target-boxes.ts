import { UPSCALE } from "src/constants";

// import { timer } from 'src/session/timer';
// TODO: Use easing functions for the first time here.

export enum TargetBoxColor {
  Cyan = 1,
  Yellow = 2,
}

export class TargetBoxes {
  readonly overTargetBox: TargetBox;
  readonly selectedTargetBox: TargetBox;

  constructor() {
    this.overTargetBox = new TargetBox(TargetBoxColor.Cyan, 1.5);
    this.selectedTargetBox = new TargetBox(TargetBoxColor.Yellow, 1.25);
  }

  reset() {
    this.overTargetBox.reset();
    this.selectedTargetBox.reset();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.overTargetBox.draw(ctx);
    this.selectedTargetBox.draw(ctx);
  }
}

class TargetBox {
  private visible: boolean;
  private readonly color: TargetBoxColor;
  private readonly padding: number;
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  /**
   * x, y should already be upscaled.
   * Other values will be upscaled on draw.
   */
  constructor(
    color: TargetBoxColor,
    padding: number,
  ) {
    this.visible = false;
    this.color = color;
    this.padding = padding;
  }

  reset() {
    this.visible = false;
  }

  show(x: number, y: number, width: number, height: number) {
    this.visible = true;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * TODO: Make better and animated?
   */
  draw(ctx: CanvasRenderingContext2D) {
    if (this.visible) {
      drawTargetBox(
        ctx,
        this.color,
        this.x,
        this.y,
        this.width,
        this.height,
        this.padding,
      );
    }
  }
}

/**
 * x, y are upper-left coordinates of the box.
 */
function drawTargetBox(
  ctx: CanvasRenderingContext2D,
  color: TargetBoxColor,
  x: number,
  y: number,
  width: number,
  height: number,
  padding: number,
) {
  ctx.fillStyle = toRGBA(color);

  const boxPadding = padding * UPSCALE;
  const lineWidth = 1 * UPSCALE;
  const lineLength = 4 * UPSCALE;

  const leftEdge = x - boxPadding;
  const rightEdge = x + width + boxPadding;
  const topEdge = y - boxPadding;
  const bottomEdge = y + height + boxPadding;

  // Top Left
  ctx.fillRect(leftEdge, topEdge, lineLength, lineWidth); // Top
  ctx.fillRect(leftEdge, topEdge, lineWidth,  lineLength); // Left

  // Top Right
  ctx.fillRect(rightEdge - lineWidth, topEdge, -lineLength + lineWidth, lineWidth); // Top
  ctx.fillRect(rightEdge - lineWidth, topEdge,  lineWidth,              lineLength); // Right

  // Bottom Left
  ctx.fillRect(leftEdge, bottomEdge,             lineLength,  lineWidth); // Bottom
  ctx.fillRect(leftEdge, bottomEdge + lineWidth, lineWidth,  -lineLength); // Left

  // Bottom Right
  ctx.fillRect(rightEdge - lineWidth, bottomEdge,              -lineLength + lineWidth,  lineWidth); // Bottom
  ctx.fillRect(rightEdge - lineWidth, bottomEdge + lineWidth,   lineWidth,              -lineLength); // Right
}

function toRGBA(color: TargetBoxColor) {
  let red = 0;
  let green = 0;
  let blue = 0;
  const alpha = 0.8;

  if (color === TargetBoxColor.Cyan) {
    green = 255;
    blue = 255;
  } else if (color === TargetBoxColor.Yellow) {
    red = 255;
    green = 255;
  }
  // TODO: Other colors

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
