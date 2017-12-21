import { Direction } from 'src/domain/direction';

export class SaveEntity {
  x: number;
  y: number;
  facing: string;

  constructor(x: number, y: number, facing: Direction) {
    this.x = x;
    this.y = y;
    this.facing = Direction[facing];
  }
}

export class SaveStaticMap {
  mapId: string;

  constructor(mapId: string) {
    this.mapId = mapId;
  }
}

export class SavePlayer {
  entity: SaveEntity;

  constructor(entity: SaveEntity) {
    this.entity = entity;
  }
}

export class SaveWorld {
  staticMap: SaveStaticMap;
  player: SavePlayer;

  constructor(staticMap: SaveStaticMap, player: SavePlayer) {
    this.staticMap = staticMap;
    this.player = player;
  }
}
