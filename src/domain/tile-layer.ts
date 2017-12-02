export default class {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tiles: number[];

  constructor(rawLayer: any) {
    this.name = rawLayer.name;
    this.x = rawLayer.x;
    this.y = rawLayer.y;
    this.width = rawLayer.width;
    this.height = rawLayer.height;
    this.tiles = rawLayer.data;
  }
}
