import { log } from 'src/log';
import { SaveWorld } from 'src/session/save';
import { Player } from './player';
import { Entity } from './entity';
import { StaticMap } from './static-map';
import { imageLoader } from 'src/session/image-loader';
import { mapLoader } from 'src/session/map-loader';
import { worldPlaceEntities } from './world-place-entities';

export class World {
  private readonly initialMapId: string;
  private readonly _entities: Map<number, Entity>;
  player: Player;
  staticMap: StaticMap;

  constructor(save: SaveWorld) {
    this._entities = new Map();
    // TODO: Fill the entities from save file?
    this.initialMapId = save.staticMap.mapId;
    this.player = new Player(save.player);
    this.staticMap = null;
  }

  async start() {
    this.switchMap(this.initialMapId);
  }

  async switchMap(mapId: string, entranceName?: string) {
    this.staticMap = await fetchMap(mapId);
    await imageLoader.prepareAll(this.staticMap.tilesets.map(tileset => tileset.image));
    this._entities.clear(); // TODO: Best place for this?
    worldPlaceEntities(this);

    if (entranceName) {
      const entrance = this.staticMap.entrances.find((entranceCandidate) => {
        return entranceCandidate.name === entranceName;
      });
      if (entrance) {
        this.player.x = entrance.x;
        this.player.y = entrance.y;
      } else {
        log('warn', `Entrance not found ${entranceName}`);
      }
    }
  }

  /**
   * Ensures that the entity added to the map has a unique ID.
   */
  addEntity(entity: Entity) {
    while (true) {
      if (this._entities.has(entity.id)) {
        entity.calculateId();
      } else {
        break;
      }
    }
    this._entities.set(entity.id, entity);
  }

  entitiesSortedByY(): Entity[] {
    return Array.from(this._entities.values()).sort((a, b) => {
      return a.y - b.y;
    });
  }

  extractSave(): SaveWorld {
    return new SaveWorld(
      this.staticMap.extractSave(),
      this.player.extractSave(),
    );
  }

  get entities(): Entity[] {
    return Array.from(this._entities.values());
  }
}

async function fetchMap(mapId: string): Promise<StaticMap> {
  return new Promise<StaticMap>((resolve, reject) => {
    mapLoader.fetch(mapId).then((rawMap: any) => {
      resolve(new StaticMap(mapId, rawMap));
    });
    // TODO: Handle error?
  });
}