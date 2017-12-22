export class Tileset {
  firstgid: number;
  tilecount: number;
  columns: number;
  image: string;

  constructor(rawTileset: any) {
    this.firstgid = rawTileset.firstgid;
    this.tilecount = rawTileset.tilecount;
    this.columns = rawTileset.columns;
    this.image = rawTileset.image;
  }
}
