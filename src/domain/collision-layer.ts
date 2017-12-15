import TileLayer from './tile-layer';

export default class extends TileLayer {
  readonly call: string;
  readonly callInterval: number;
  readonly passthrough: boolean;

  constructor(rawLayer: any) {
    super(rawLayer);
    if (rawLayer.properties) {
      this.call = rawLayer.properties.call;
      this.callInterval = rawLayer.properties.callInterval;
      this.passthrough = rawLayer.properties.passthrough;
    }
  }
}
