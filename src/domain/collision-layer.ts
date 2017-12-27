import { TileLayer } from './tile-layer';

export class CollisionLayer extends TileLayer {
  readonly call: string;
  readonly callInterval: number;
  readonly passthrough: boolean;

  constructor(rawLayer: any) {
    super(rawLayer);

    // Read properties
    {
      // Prevent null pointer errors
      const properties = rawLayer.properties || {};

      // TODO: This mirrors object-hint.ts
      this.call = properties.call;
      if (properties.callInterval) {
        this.callInterval = properties.callInterval;
      } else {
        this.callInterval = Number.MAX_SAFE_INTEGER; // It gets called once, in practice.
      }
      this.passthrough = properties.passthrough || false;
    }
  }
}
