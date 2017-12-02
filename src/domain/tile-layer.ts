export default class {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly tiles: number[];

  constructor(rawLayer: any) {
    this.name = rawLayer.name;
    this.x = rawLayer.x;
    this.y = rawLayer.y;
    this.width = rawLayer.width;
    this.height = rawLayer.height;
    this.tiles = rawLayer.data;
  }
}
