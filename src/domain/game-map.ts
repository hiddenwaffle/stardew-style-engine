import TileLayer from './tile-layer';
import Tileset from './tileset';
import Entity from './entity';

export default class {
  id: string;
  width: number;
  height: number;
  tileLayers: TileLayer[];
  tilesets: Tileset[];
  entities: Entity[];

  constructor(rawMap: any) {
    this.id = rawMap.id;
    this.width = rawMap.width;
    this.height = rawMap.height;
    this.tileLayers = [];
    this.tilesets = [];
    this.entities = [];

    rawMap.layers.forEach((layer: any) => {
      if (layer.type === 'tilelayer' && layer.name !== 'collision') {
        const tileLayer = new TileLayer(layer);
        this.tileLayers.push(tileLayer);
      }
      // TODO: Do something else with the other layer types/names
    });

    rawMap.tilesets.forEach((rawTileset: any) => {
      const tileset = new Tileset(rawTileset);
      this.tilesets.push(tileset);
    });
  }
}
