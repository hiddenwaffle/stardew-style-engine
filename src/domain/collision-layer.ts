import { TileLayer } from './tile-layer';

export class CollisionLayer extends TileLayer {
  readonly collisionCall: string;
  readonly collisionCallInterval: number;
  readonly passthrough: boolean;

  readonly upCall: string;
  readonly downCall: string;
  readonly leftCall: string;
  readonly rightCall: string;

  constructor(rawLayer: any) {
    super(rawLayer);

    // Read properties
    {
      // Prevent null pointer errors
      const properties = rawLayer.properties || {};

      // TODO: This mirrors object-hint.ts
      this.collisionCall = properties.collisionCall;
      if (properties.collisionCallInterval) {
        this.collisionCallInterval = properties.collisionCallInterval;
      } else {
        this.collisionCallInterval = Number.MAX_SAFE_INTEGER; // It gets called once, in practice.
      }
      this.passthrough = properties.passthrough || false;

      this.upCall = properties.upCall;
      this.downCall = properties.downCall;
      this.leftCall = properties.leftCall;
      this.rightCall = properties.rightCall;
    }
  }
}
