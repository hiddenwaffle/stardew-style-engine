export function convertXYToIndex(x: number, y: number, width: number): number {
  return x + (y * width);
}
