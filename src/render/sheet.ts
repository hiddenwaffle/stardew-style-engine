import { DEFAULT_FIELD_TILE_SIZE } from 'src/constants';

export class SheetConfig {
  readonly path: string;
  readonly tileWidth: number;
  readonly tileHeight: number;

  constructor(path: string, tileWidth: number, tileHeight: number) {
    this.path = path;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }
}

export function genConfig(
  path: string,
  tileWidth: number = DEFAULT_FIELD_TILE_SIZE,
  tileHeight: number = DEFAULT_FIELD_TILE_SIZE,
) {
  return new SheetConfig(path, tileWidth, tileHeight);
}

export class Sheet {
  readonly config: SheetConfig;
  readonly image: HTMLImageElement;

  constructor(config: SheetConfig, image: HTMLImageElement) {
    this.config = config;
    this.image = image;
  }
}
