
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

export default class {
  private readonly width: number;
  private readonly height: number;
  private readonly tileLayers: TileLayer[];
  private readonly objectLayers: ObjectLayer[];

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

    console.log(this.mapPath, this.width, this.height, this.tileLayers, this.objectLayers);
  }
}
