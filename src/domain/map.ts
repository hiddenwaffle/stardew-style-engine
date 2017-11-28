
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
  private readonly tileLayers: Array<TileLayer>;
  private readonly objectLayers: Array<ObjectLayer>;

  constructor(
    private mapPath: string,
    raw: any
  ) {
    this.width = raw.width;
    this.height = raw.height;

    this.tileLayers = [];
    this.objectLayers = [];
    raw.layers.forEach((raw: any) => {
      if (raw.type === 'tilelayer') {
        const tileLayer = new TileLayer(raw);
        this.tileLayers.push(tileLayer);
      } else if (raw.type === 'objectgroup') {
        const objectLayer = new ObjectLayer(raw);
        this.objectLayers.push(objectLayer);
      } else {
        throw new Error(`Unknown layer type: ${raw.type}`); // TODO: Something else.
      }
    });

    console.log(this.mapPath, this.width, this.height, this.tileLayers, this.objectLayers);
  }
}
