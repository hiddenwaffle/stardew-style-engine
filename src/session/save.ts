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

export class SaveGameMap {
  mapId: string;
  filename: string;
  entities: SaveEntity[];

  constructor(mapId?: string, filename?: string, entities?: SaveEntity[]) {
    this.mapId = mapId || 'start'; // Start map should be named 'start'.
    this.filename = filename || '__unknown__'; // TODO: Does default value matter?
    this.entities = entities || [];
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
  gameMap: SaveGameMap;

  constructor(
    player?: SavePlayer,
    gameMap?: SaveGameMap,
  ) {
    this.player = player || new SavePlayer();
    this.gameMap = gameMap || new SaveGameMap();
  }
}

export class SaveState {
  //
}
