import { Direction } from 'src/domain/direction';

// TODO: Maybe extract the defaults out to better comprehend the initial state.

export class SaveEntity {
  name: string;
  x: number;
  y: number;
  facing: string;

  /**
   * floor() improves the readability of the save file.
   */
  constructor(name: string, x?: number, y?: number, facing?: Direction) {
    this.name = name;
    this.x = Math.floor(x) || 100; // TODO: Default is an arbitary number
    this.y = Math.floor(y) || 100; // TODO: Default is an arbitrary number
    this.facing = Direction[facing] || Direction[Direction.Left];
  }
}

export class SaveStaticMap {
  mapId: string;

  constructor(mapId?: string) {
    this.mapId = mapId || 'start'; // Start map should be named 'start'.
  }
}

export class SavePlayer {
    animationGroupName: string;

    constructor(animationGroupName?: string) {
      this.animationGroupName = animationGroupName || 'af-pirate-red'; // TODO: Default is pirate
    }
}

export class SaveWorld {
  player: SavePlayer;
  staticMap: SaveStaticMap;
  entities: SaveEntity[];

  constructor(
    player?: SavePlayer,
    staticMap?: SaveStaticMap,
    entities?: SaveEntity[]
  ) {
    this.player = player || new SavePlayer();
    this.staticMap = staticMap || new SaveStaticMap();
    this.entities = entities || [];
  }
}
