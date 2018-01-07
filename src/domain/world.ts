import { log } from 'src/log';
import { SaveWorld, SaveEntity } from 'src/session/save';
import { Player } from './player';
import { Entity } from './entity';
import { StaticMap } from './static-map';
import { imageLoader } from 'src/session/image-loader';
import { mapLoader } from 'src/session/map-loader';
import { State, gameState } from 'src/session/game-state';
import { ScriptCall } from 'src/game-master/script-call';
import { TileLayer } from './tile-layer';
import {
  PointerType,
  pointer,
} from 'src/ui/pointer';
import { ObjectHint } from 'src/domain/object-hint';
import { Tileset } from 'src/domain/tileset';
import { tokenize } from 'src/script';

export class World {
  player: Player;

  private readonly _entities: Map<number, Entity>;
  private readonly initialEntityStates: SaveEntity[];

  staticMap: StaticMap;
  private readonly initialMapId: string;

  constructor(save: SaveWorld) {
    this.player = new Player(save.player);

    this._entities = new Map();
    this.initialEntityStates = save.entities;

    this.staticMap = null;
    this.initialMapId = save.staticMap.mapId;
  }

  async start() {
    await this.switchMap(this.initialMapId);
    for (const save of this.initialEntityStates) {
      const entity = Array.from(this._entities.values()).find((entityCandidate) => {
        return entityCandidate.name === save.name;
      });
      if (entity) {
        entity.start(save);
      }
    }
    // Array.from(this._entities.values()).forEach((entity) => {
    //   entity.start(this)
    // });
  }

  step() {
    if (this.staticMap) {
      this.staticMap.step();
    }
  }

  async switchMap(mapId: string, entranceName?: string) {
    gameState.switch(State.SwitchingMap);

    const [staticMap, entities] = await fetchMapEntitiesAndPrepareImages(
      mapId,
      this.player,
    );

    // Replace the map.
    this.staticMap = staticMap;

    // Replace the entities.
    this._entities.clear();
    for (const entity of entities) {
      this._entities.set(entity.id, entity);
    }

    // Replace the location of the player.
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

    backgroundLoadKnownMapTransitions(staticMap, entities);

    if (this.staticMap.startCall) {
      new ScriptCall(this.staticMap.startCall).execute(this);
    }
  }

  /**
   * Ensures that the entity added to the map has a unique ID.
   */
  addEntity(entity: Entity) {
    this._entities.set(entity.id, entity);
  }

  getEntity(id: number) {
    return this._entities.get(id);
  }

  entitiesSortedByY(): Entity[] {
    return Array.from(this._entities.values()).sort((a, b) => {
      return a.y - b.y;
    });
  }

  recalculatePointer(x: number, y: number) {
    pointer.overEntityId = null;
    const [entity, tileLayer] = this.calculateTopMostFromPoint(x, y);
    if (entity) {
      pointer.overEntityId = entity.id;
      pointer.setType(entity.mouseoverPointerType);
    } else if (tileLayer) {
      pointer.setType(tileLayer.mouseoverPointerType);
    } else {
      // Otherwise use a [default] cursor.
      pointer.setType(PointerType.Default);
    }
  }

  /**
   * Determine which entity or tile layer, if any, receives the click.
   * TODO: Use alt for something?
   */
  executeClick(x: number, y: number, alt: boolean) {
    const [entity, tileLayer] = this.calculateTopMostFromPoint(x, y);
    if (entity && entity.clickCall) {
      new ScriptCall(
        entity.clickCall,
        this.player.entity.id,
        entity.id,
      ).execute(this);
    } else if (tileLayer && tileLayer.clickCall) {
      new ScriptCall(
        tileLayer.clickCall,
        this.player.entity.id,
      ).execute(this);
    }
  }

  extractSave(): SaveWorld {
    const entityStates = Array.from(this._entities.values()).map((entity) => {
      return entity.extractSave();
    });

    return new SaveWorld(
      this.staticMap.extractSave(),
      this.player.extractSave(),
      entityStates,
    );
  }

  get entities(): Entity[] {
    return Array.from(this._entities.values());
  }

  /**
   * At least one of the return values will be null, and possibly both.
   */
  private calculateTopMostFromPoint(x: number, y: number): [Entity, TileLayer] {
    const overlapEntity = this.calculateTopMostEntityFromPoint(x, y);
    const overlapTileLayer = overlapEntity ? null : this.calculateTopMostTileLayerFromPoint(x, y);
    return [overlapEntity, overlapTileLayer];
  }

  /**
   * Start with the entity with highest y-coordinate (i.e., on top).
   */
  private calculateTopMostEntityFromPoint(x: number, y: number): Entity {
    const entities = this.entitiesSortedByY().reverse();
    const overlapEntity = entities.find((entity) => {
      return entity.overlap(x, x, y, y);
    });
    return overlapEntity || null;
  }

  /**
   * Start with top-most tile layer.
   */
  private calculateTopMostTileLayerFromPoint(x: number, y: number): TileLayer {
    const tileLayers = !this.staticMap ? null : Array.from(this.staticMap.tileLayers).reverse();
    const overlapTileLayer = !tileLayers ? null : tileLayers.find((tileLayer) => {
      return tileLayer.containsPoint(x, y);
    });
    return overlapTileLayer || null;
  }
}

async function fetchMapEntitiesAndPrepareImages(
  mapId: string,
  player?: Player,
): Promise<[StaticMap, Entity[]]> {
  const [staticMap, entities] = await fetchMapAndEntities(mapId);
  if (player) {
    // TODO: Is this a good place for this?
    entities.push(player.entity); // Do not forget the player, if given.
  }
  await prepareImages(staticMap.tilesets, entities);
  return [staticMap, entities];
}

async function fetchMapAndEntities(mapId: string): Promise<[StaticMap, Entity[]]> {
  const staticMap = await fetchMap(mapId);
  const entities = objectHintsToEntities(staticMap.objectHints);
  return [staticMap, entities];
}

async function fetchMap(mapId: string): Promise<StaticMap> {
  return new Promise<StaticMap>((resolve, reject) => {
    mapLoader.fetch(mapId).then((rawMap: any) => {
      resolve(new StaticMap(mapId, rawMap));
    });
    // TODO: Handle error?
  });
}

async function prepareImages(tilesets: Tileset[], entities: Entity[]) {
  // Prepare the images for tiles AND entities.
  const tilesetRawImagePaths = tilesets.map((tileset) => tileset.image);
  const entitiesRawImagePaths = new Set();
  entities.forEach((entity) => {
    entity.rawImagePaths.forEach((rawImagePath) => {
      entitiesRawImagePaths.add(rawImagePath);
    });
  });
  const rawImagePaths = [].concat(
    tilesetRawImagePaths,
    Array.from(entitiesRawImagePaths),
  );
  await imageLoader.prepareAll(rawImagePaths);
}

function objectHintsToEntities(hints: ObjectHint[]): Entity[] {
  const entities: Entity[] = [];
  for (const hint of hints) {
    entities.push(objectHintToEntity(hint));
  }
  return entities;
}

function objectHintToEntity(hint: ObjectHint): Entity {
  const entity = new Entity({
    animationGroupName: hint.animationGroupName,
    clickCall: hint.clickCall,
    defaultTile: hint.defaultTile,
    entityToEntityCollisionCall: hint.collisionCall,
    entityToEntityCollisionCallInterval: hint.collisionCallInterval,
    hidden: hint.hidden,
    mouseoverPointerType: hint.mouseoverPointerType,
    movementType: hint.movementType,
    name: hint.name,
    pushable: hint.pushable,
    x: hint.x,
    y: hint.y,
  });
  return entity;
}

/**
 * Based on: https://stackoverflow.com/a/41791149
 * TODO: Add type annotations? Factor out to utility file?
 *
 * @param items An array of items.
 * @param fn A function that accepts an item from the array and returns a promise.
 * @returns {Promise}
 */
function forEachPromise(items: any, fn: any) {
  return items.reduce(function (promise: any, item: any) {
    return promise.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
}

/**
 * This should find many, but not all, places where switchMap()
 * could be called by examining certain properties.
 *
 * Notice that this calls async functions without using await.
 *
 * There is a very small chance that image loads could be duplicated
 * if the game initiates a switchMap() while image loads are occurring
 * in the async calls in this function.
 */
function backgroundLoadKnownMapTransitions(staticMap: StaticMap, entities: Entity[]) {
  const mapIds: Set<string> = new Set();

  findMapId(staticMap.startCall, mapIds); // Unlikely, but here for completeness.

  for (const layer of staticMap.collisionLayers) {
    findMapId(layer.clickCall, mapIds);
    findMapId(layer.upCall, mapIds);
    findMapId(layer.downCall, mapIds);
    findMapId(layer.leftCall, mapIds);
    findMapId(layer.rightCall, mapIds);
    findMapId(layer.collisionCall, mapIds);
  }

  for (const entity of entities) {
    findMapId(entity.clickCall, mapIds);
    findMapId(entity.entityToEntityCollisionCall, mapIds);
  }

  // Sequential because the image cache will prevent duplicate requests.
  // log('info', 'Map transition precaching started', Date.now());
  forEachPromise(Array.from(mapIds.values()), fetchMapEntitiesAndPrepareImages).then(() => {
    // log('info', 'Map transition precaching completed', Date.now());
  });
}

function findMapId(call: string, mapNames: Set<string>) {
  if (call) {
    const tokens = tokenize(call);
    if (tokens.length >= 2) {
      const scriptName = tokens[0];
      if (scriptName === 'global.switchMap') {
        const firstParameter = tokens[1]; // Should be map name
        if (firstParameter) {
          mapNames.add(firstParameter);
        }
      }
    }
  }
}
