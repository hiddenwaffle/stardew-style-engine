export class SaveEntity {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class SaveStaticMap {
  mapId: string

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

export class Save {
  staticMap: SaveStaticMap;
  player: SavePlayer;

  constructor(staticMap: SaveStaticMap, player: SavePlayer) {
    this.staticMap = staticMap;
    this.player = player;
  }
}
