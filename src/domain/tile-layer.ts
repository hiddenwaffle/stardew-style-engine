export class TileLayer {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly tiles: number[];

  constructor(layer: any) {
    this.name = layer.name;
    this.x = layer.x;
    this.y = layer.y;
    this.width = layer.width;
    this.height = layer.height;
    this.tiles = layer.data;
  }
}
