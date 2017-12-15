import TileLayer from './tile-layer';

export default class extends TileLayer {
  readonly once: string;
  readonly repeatedly: string;
  readonly repeatedlyDelay: number;
  readonly passthrough: boolean;

  constructor(rawLayer: any) {
    super(rawLayer);
    if (rawLayer.properties) {
      this.once = rawLayer.properties.once;

      this.repeatedly = rawLayer.properties.repeatedly;
      this.repeatedlyDelay = rawLayer.properties.releatedlyDelay;

      this.passthrough = rawLayer.properties.passthrough;
    }
  }
}
