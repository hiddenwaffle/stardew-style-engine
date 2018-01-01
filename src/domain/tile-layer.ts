import { TARGET_FIELD_TILE_SIZE } from 'src/constants';
import { parseClickProperties } from './parse-click-properties';
import { PointerType } from 'src/ui/pointer';
import { convertXYToIndex } from 'src/math';

export class TileLayer {
  readonly name: string;

  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  readonly tiles: number[];

  readonly clickCall: string;
  readonly mouseoverPointerType: PointerType;

  readonly blinkGroup: string;
  readonly blinkWait: number;

  constructor(layer: any) {
    this.name = layer.name;
    this.x = layer.x;
    this.y = layer.y;
    this.width = layer.width;
    this.height = layer.height;
    this.tiles = layer.data;

    // Read properties
    {
      // Prevent null pointer errors
      const properties = layer.properties || {};
      [this.clickCall, this.mouseoverPointerType] = parseClickProperties(properties);

      this.blinkGroup = properties.blinkGroup || null;
      this.blinkWait = properties.blinkWait || 0;
    }
  }

  /**
   * Checks if the given point is on a non-empty tile.
   */
  containsPoint(x: number, y: number): boolean {
    const xtile = Math.floor(x / TARGET_FIELD_TILE_SIZE);
    const ytile = Math.floor(y / TARGET_FIELD_TILE_SIZE);
    if (xtile < 0 || xtile >= this.width ||
        ytile < 0 || ytile >= this.height) {
      return false;
    } else {
      const index = convertXYToIndex(xtile, ytile, this.width);
      const tileValue = this.tiles[index];
      return tileValue > 0;
    }
  }
}
