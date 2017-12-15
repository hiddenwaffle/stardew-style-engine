import { SaveStaticMap } from 'src/session/save';
import TileLayer from './tile-layer';
import CollisionLayer from './collision-layer';
import Tileset from './tileset';
import Entity from './entity';

export default class {
  id: string;
  width: number;
  height: number;
  tileLayers: TileLayer[];
  collisionLayers: CollisionLayer[];
  tilesets: Tileset[];

  constructor() {
    // The default starting map
    this.id = 'start';
    // Rest of this is placeholder
    this.width = 0;
    this.height = 0;
    this.tileLayers = [];
    this.collisionLayers = [];
    this.tilesets = [];
  }

  fillInDetails(rawMap: any) {
    this.width = rawMap.width;
    this.height = rawMap.height;
    this.tileLayers = [];
    this.tilesets = [];

    rawMap.layers.forEach((layer: any) => {
      this.parseAndAddLayers(layer);
    });

    rawMap.tilesets.forEach((rawTileset: any) => {
      const tileset = new Tileset(rawTileset);
      this.tilesets.push(tileset);
    });
  }

  applySave(save: SaveStaticMap) {
    this.id = save.mapId;
  }

  extractSave(): SaveStaticMap {
    // These are static so there is not much to save.
    return new SaveStaticMap(this.id);
  }

  private parseAndAddLayers(layer: any) {
    if (layer.type === 'tilelayer' && !layer.name.startsWith('@')) {
      const tileLayer = new TileLayer(layer);
      this.tileLayers.push(tileLayer);
    } else if (layer.type === 'group') {
      layer.layers.forEach((sublayer: any) => {
        this.parseAndAddLayers(sublayer);
      });
    } else if (layer.name.startsWith('@entity')) {
      //
    } else if (layer.name.startsWith('@collision'))  {
      const collisionLayer = new CollisionLayer(layer);
      this.collisionLayers.push(collisionLayer);
    }
    // TODO: Do something else with the other layer types/names
  };
}
