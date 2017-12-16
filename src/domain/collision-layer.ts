import TileLayer from './tile-layer';

export default class extends TileLayer {
  readonly call: string;
  readonly callInterval: number;
  readonly passthrough: boolean;

  constructor(rawLayer: any) {
    super(rawLayer);
    if (rawLayer.properties) {
      // TODO: This mirrors object-hint.ts
      this.call = rawLayer.properties.call;
      if (rawLayer.properties.callInterval) {
        this.callInterval = rawLayer.properties.callInterval;
      } else {
        this.callInterval = Number.MAX_SAFE_INTEGER; // It gets called once, in practice.
      }
      this.passthrough = rawLayer.properties.passthrough || false;
    }
  }
}
