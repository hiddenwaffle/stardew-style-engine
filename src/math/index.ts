import { TileLayer } from 'src/domain/tile-layer';

export function convertXYToIndex(x: number, y: number, width: number): number {
  return x + (y * width);
}

/**
 * Determine if given tile coordinate is an actual tile or a map boundary.
 */
export function determineTileValueOrMapBoundary(
  x: number,
  y: number,
  layer: TileLayer,
): [number, boolean] {
  const index = convertXYToIndex(x, y, layer.width);
  let mapBoundary = (x < 0 || x >= layer.width || y < 0 || y >= layer.height);
  let tileValue = mapBoundary ? 777 : layer.tiles[index]; // 777 is an arbitrary number
  return [tileValue, mapBoundary];
}
