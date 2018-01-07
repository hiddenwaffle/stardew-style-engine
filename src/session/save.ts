import { Direction } from 'src/domain/direction';

export class SaveEntity {
  name: string;
  x: number;
  y: number;
  facing: string;

  constructor(name: string, x?: number, y?: number, facing?: Direction) {
    this.name = name;
    this.x = x || 100; // TODO: Default is an arbitary number
    this.y = y || 100; // TODO: Default is an arbitrary number
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
    x: number;
    y: number;
    facing: string;

    constructor(x?: number, y?: number, facing?: Direction) {
      this.x = x || 100; // TODO: Default is an arbitary number
      this.y = y || 100; // TODO: Default is an arbitrary number
      this.facing = Direction[facing] || Direction[Direction.Left];
    }
}

export class SaveWorld {
  staticMap: SaveStaticMap;
  player: SavePlayer;
  entities: SaveEntity[];

  constructor(
    staticMap?: SaveStaticMap,
    player?: SavePlayer,
    entities?: SaveEntity[]
  ) {
    this.staticMap = staticMap || new SaveStaticMap();
    this.player = player || new SavePlayer();
    this.entities = entities || [];
  }
}
