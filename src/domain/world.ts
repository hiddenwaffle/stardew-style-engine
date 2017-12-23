import { log } from 'src/log';
import { SaveWorld } from 'src/session/save';
import { Player } from './player';
import { Entity } from './entity';
import { StaticMap } from './static-map';
import { imageLoader } from 'src/session/image-loader';
import { mapLoader } from 'src/session/map-loader';
import { State, gameState } from 'src/session/game-state';

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
    await this.switchMap(this.initialMapId);
  }

  async switchMap(mapId: string, entranceName?: string) {
    gameState.switch(State.Loading);
    this.staticMap = await fetchMap(mapId);
    this._entities.clear(); // TODO: Best place for this?
    this.placeEntities();

    // Prepare the images for tiles AND entities.
    const tilesetRawImagePaths = this.staticMap.tilesets.map(tileset => tileset.image);
    const entitiesRawImagePaths = new Set();
    this._entities.forEach((entity) => {
      entity.rawImagePaths.forEach((rawImagePath) => {
        entitiesRawImagePaths.add(rawImagePath);
      });
    });
    const rawImagePaths = [].concat(
      tilesetRawImagePaths,
      Array.from(entitiesRawImagePaths)
    );
    await imageLoader.prepareAll(rawImagePaths);

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
    gameState.switch(State.Ready);
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

  private placeEntities() {
    // TODO: Is this the right place for it?
    this.addEntity(this.player.entity);

    for (const objectHint of this.staticMap.objectHints) {
      const entity = new Entity({
        animationGroupName: objectHint.animationGroupName,
        pushable: objectHint.pushable,
      });

      entity.name = objectHint.name;
      entity.x = objectHint.x;
      entity.y = objectHint.y;
      entity.boundingWidth = objectHint.width;
      entity.boundingHeight = objectHint.height;
      entity.entityToEntityCollisionCall = objectHint.call;
      entity.entityToEntityCollisionCallInterval = objectHint.callInterval;
      entity.defaultTile = objectHint.defaultTile;
      entity.hidden = objectHint.hidden;

      this.addEntity(entity);
    }
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