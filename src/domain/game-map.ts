import imageManager from 'src/session/image-manager';

class TileLayer {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly tiles: number[];

  constructor(rawTileLayer: any) {
    this.name = rawTileLayer.name;
    this.x = rawTileLayer.x;
    this.y = rawTileLayer.y;
    this.width = rawTileLayer.width;
    this.height = rawTileLayer.height;
    this.tiles = rawTileLayer.data;
  }
}

class ObjectLayer {
  readonly name: string;

  constructor(rawObjectLayer: any) {
    this.name = rawObjectLayer.name;
  }
}

export class Tileset {
  readonly firstgid: number;
  readonly tilecount: number;
  readonly columns: number;
  readonly image: string;

  constructor(rawTileset: any) {
    this.firstgid = rawTileset.firstgid;
    this.tilecount = rawTileset.tilecount;
    this.columns = rawTileset.columns;
    this.image = rawTileset.image;
  }
}

export default class {
  readonly width: number;
  readonly height: number;
  readonly tileLayers: TileLayer[];
  readonly objectLayers: ObjectLayer[];
  readonly tilesets: Tileset[];

  constructor(
    readonly id: string,
    private mapPath: string,
    rawMap: any
  ) {
    this.width = rawMap.width;
    this.height = rawMap.height;

    this.tileLayers = [];
    this.objectLayers = [];
    rawMap.layers.forEach((rawLayer: any) => {
      if (rawLayer.type === 'tilelayer') {
        if (rawLayer.name === 'collision') {
          // TODO: Something with the collision layer.
        } else {
          const tileLayer = new TileLayer(rawLayer);
          this.tileLayers.push(tileLayer);
        }
      } else if (rawLayer.type === 'objectgroup') {
        const objectLayer = new ObjectLayer(rawLayer);
        this.objectLayers.push(objectLayer);
      } else {
        throw new Error(`Unknown layer type: ${rawLayer.type}`); // TODO: Something else.
      }
    });

    this.tilesets = [];
    rawMap.tilesets.forEach((rawTileset: any) => {
      const tileset = new Tileset(rawTileset);
      this.tilesets.push(tileset);
      imageManager.prepare(tileset.image);
    });
  }
}
