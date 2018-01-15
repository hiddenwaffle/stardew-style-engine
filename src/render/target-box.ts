import { UPSCALE } from "src/constants";

// import { timer } from 'src/session/timer';
// TODO: Use easing functions for the first time here.

export enum TargetBoxColor {
  Cyan = 1,
  Yellow = 2,
}

/**
 * x, y are upper-left coordinates of the box.
 */
export function drawTargetBox(
  color: TargetBoxColor,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  givenPadding: number,
) {
  ctx.fillStyle = toRGBA(color);

  const padding = givenPadding * UPSCALE;
  const lineWidth = 1 * UPSCALE;
  const lineLength = 4 * UPSCALE;

  const leftEdge = x - padding;
  const rightEdge = x + width + padding;
  const topEdge = y - padding;
  const bottomEdge = y + height + padding;

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
  let alpha = 0.8;

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
