
class TileLayer {
  readonly name: string;

  constructor(raw: any) {
    this.name = raw.name;
  }
}

class ObjectLayer {
  readonly name: string;

  constructor(raw: any) {
    this.name = raw.name;
  }
}

class Tileset {
  readonly firstgid: number;
  readonly image: string;

  constructor(firstgid: number, image: string) {
    this.firstgid = firstgid;
    this.image = image;
  }
}

export default class {
  private readonly width: number;
  private readonly height: number;
  private readonly tileLayers: TileLayer[];
  private readonly objectLayers: ObjectLayer[];
  private readonly tilesets: Tileset[];

  constructor(
    private mapPath: string,
    rawMap: any
  ) {
    this.width = rawMap.width;
    this.height = rawMap.height;

    this.tileLayers = [];
    this.objectLayers = [];
    rawMap.layers.forEach((rawLayer: any) => {
      if (rawLayer.type === 'tilelayer') {
        const tileLayer = new TileLayer(rawLayer);
        this.tileLayers.push(tileLayer);
      } else if (rawLayer.type === 'objectgroup') {
        const objectLayer = new ObjectLayer(rawLayer);
        this.objectLayers.push(objectLayer);
      } else {
        throw new Error(`Unknown layer type: ${rawLayer.type}`); // TODO: Something else.
      }
    });

    this.tilesets = [];
    rawMap.tilesets.forEach((rawTileset: any) => {
      const tileset = new Tileset(rawTileset.firstgid, rawTileset.image);
      this.tilesets.push(tileset);
    });
  }
}
