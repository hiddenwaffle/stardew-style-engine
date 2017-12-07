import TileLayer from './tile-layer';

export default class extends TileLayer {
  readonly once: string;
  private _onceActive: boolean;
  readonly repeatedly: string;
  readonly passthrough: boolean;

  constructor(rawLayer: any) {
    super(rawLayer);
    if (rawLayer.properties) {
      this.once = rawLayer.properties.once;
      this._onceActive = false;

      this.repeatedly = rawLayer.properties.repeatedly;

      this.passthrough = rawLayer.properties.passthrough;
    }
  }
}
