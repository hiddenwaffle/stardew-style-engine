import { log } from 'src/log';
import { SaveWorld } from 'src/session/save';
import { Player } from './player';
import { Entity } from './entity';
import { StaticMap } from './static-map';
import { imageLoader } from 'src/session/image-loader';
import { mapLoader } from 'src/session/map-loader';
import { State, gameState } from 'src/session/game-state';
import { ScriptCall } from 'src/game-master/script-call';

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
    const tilesetRawImagePaths = this.staticMap.tilesets.map((tileset) => tileset.image);
    const entitiesRawImagePaths = new Set();
    this._entities.forEach((entity) => {
      entity.rawImagePaths.forEach((rawImagePath) => {
        entitiesRawImagePaths.add(rawImagePath);
      });
    });
    const rawImagePaths = [].concat(
      tilesetRawImagePaths,
      Array.from(entitiesRawImagePaths),
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
    this._entities.set(entity.id, entity);
  }

  entitiesSortedByY(): Entity[] {
    return Array.from(this._entities.values()).sort((a, b) => {
      return a.y - b.y;
    });
  }

  setMouseOverPosition(x: number, y: number) {
    // console.log(x, y);
  }

  /**
   * Determine which entity or tile layer, if any, receives the click.
   * Start with the entity with highest y-coordinate (i.e., on top).
   * Then start with top-most tile layer.
   */
  executeClick(x: number, y: number, alt: boolean) {
    const entities = this.entitiesSortedByY().reverse();
    const activatedEntity = entities.find((entity) => {
      return entity.overlap(x, x, y, y);
    });
    if (activatedEntity) {
      if (activatedEntity.clickCall) {
        const call = new ScriptCall(
          activatedEntity.clickCall,
          this.player.entity.id,
          activatedEntity.id,
        );
        call.execute(this);
      }
    } else if (this.staticMap) {
      const tileLayers = Array.from(this.staticMap.tileLayers).reverse();
      const activatedTileLayer = tileLayers.find((tileLayer) => {
        if (tileLayer.clickCall) {
          return tileLayer.containsPoint(x, y);
        };
      });
      if (activatedTileLayer) {
        const call = new ScriptCall(
          activatedTileLayer.clickCall,
          this.player.entity.id,
        );
        call.execute(this);
      }
    }
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
        boundingHeight: objectHint.height,
        boundingWidth: objectHint.width,
        clickCall: objectHint.clickCall,
        defaultTile: objectHint.defaultTile,
        entityToEntityCollisionCall: objectHint.call,
        entityToEntityCollisionCallInterval: objectHint.callInterval,
        hidden: objectHint.hidden,
        name: objectHint.name,
        pushable: objectHint.pushable,
        x: objectHint.x,
        y: objectHint.y,
      });
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
