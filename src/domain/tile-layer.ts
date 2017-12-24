import { TARGET_FIELD_TILE_SIZE } from 'src/constants';

export class TileLayer {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly tiles: number[];
  readonly clickCall: string;

  constructor(layer: any) {
    this.name = layer.name;
    this.x = layer.x;
    this.y = layer.y;
    this.width = layer.width;
    this.height = layer.height;
    this.tiles = layer.data;
    if (layer.properties) {
      this.clickCall = layer.properties.clickCall || null;
    }
  }

  /**
   * Checks if the given point is on a non-empty tile.
   */
  containsPoint(x: number, y: number): boolean {
    const xtile = Math.floor(x / TARGET_FIELD_TILE_SIZE);
    const ytile = Math.floor(y / TARGET_FIELD_TILE_SIZE);
    const index = convertXYToIndex(xtile, ytile, this.width);
    const tileValue = this.tiles[index];
    return tileValue > 0;
  }
}

// TODO: Duplicated in walk-entity-to-tiles.ts
function convertXYToIndex(x: number, y: number, width: number): number {
  return x + (y * width);
}
