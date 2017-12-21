import { SaveStaticMap } from 'src/session/save';
import log from 'src/log';
import TileLayer from './tile-layer';
import CollisionLayer from './collision-layer';
import Tileset from './tileset';
import Entity from './entity';
import MapEntrance from './map-entrance';
import ObjectHint from './object-hint';

export default class {
  id: string;
  width: number;
  height: number;

  tileLayers: TileLayer[];
  collisionLayers: CollisionLayer[];
  entrances: MapEntrance[];
  objectHints: ObjectHint[];

  tilesets: Tileset[];

  constructor() {
    // The default starting map
    this.id = 'start';
    // Rest of this is placeholder
    this.width = 0;
    this.height = 0;
    this.tileLayers = [];
    this.collisionLayers = [];
    this.entrances = [];
    this.objectHints = [];
    this.tilesets = [];
  }

  applySave(save: SaveStaticMap) {
    this.id = save.mapId;
  }

  fill(mapId: string, rawMap: any) {
    this.id = mapId;
    this.width = rawMap.width;
    this.height = rawMap.height;

    rawMap.layers.forEach((layer: any) => {
      this.parseAndAddLayers(layer);
    });

    rawMap.tilesets.forEach((rawTileset: any) => {
      const tileset = new Tileset(rawTileset);
      this.tilesets.push(tileset);
    });
  }

  extractSave(): SaveStaticMap {
    // These are static so there is not much to save.
    return new SaveStaticMap(this.id);
  }

  private parseAndAddLayers(layer: any) {
    switch (layer.type) {
      case 'tilelayer':
        this.parseAndAddTileLayer(layer);
        break;
      case 'objectgroup':
        this.parseAndAddObjectGroupLayer(layer);
        break;
      case 'group':
        this.parseAndAddGroupLayer(layer);
        break;
      // TODO: Do something else with the other layer types/names
      default:
        log('warn', `Unknown layer type ${layer.type}`);
        break;
    }
  }

  private parseAndAddTileLayer(layer: any) {
    if (layer.name.startsWith('@collision')) {
      this.parseAndAddCollisionLayer(layer);
    } else {
      const tileLayer = new TileLayer(layer);
      this.tileLayers.push(tileLayer);
    }
  }

  private parseAndAddCollisionLayer(layer: any) {
    const collisionLayer = new CollisionLayer(layer);
    this.collisionLayers.push(collisionLayer);
  }

  private parseAndAddObjectGroupLayer(layer: any) {
    switch (layer.name) {
      case '@entrances':
        this.parseAndAddEntrance(layer);
        break;
      default:
        this.parseAndAddObjectHints(layer);
        break;
    }
  }

  private parseAndAddEntrance(layer: any) {
    if (layer.objects) {
      for (const object of layer.objects) {
        const entrance = new MapEntrance(object);
        this.entrances.push(entrance);
      }
    }
  }

  private parseAndAddObjectHints(layer: any) {
    if (layer.objects) {
      for (const object of layer.objects) {
        const hint = new ObjectHint(object);
        this.objectHints.push(hint);
      }
    }
  }

  private parseAndAddGroupLayer(layer: any) {
    layer.layers.forEach((sublayer: any) => {
      this.parseAndAddLayers(sublayer);
    });
  }
}
