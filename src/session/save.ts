import World from 'src/domain/world';
import Player from 'src/domain/player';

export class SavePlayer {
  x: number;
  y: number;

  constructor(player: Player) {
    console.log('TODO: this.x = player.x;');
    console.log('TODO: this.y = player.y;');
  }
}

export class Save {
  mapId: string;
  player: SavePlayer;

  constructor(world: World) {
    if (world) {
      this.mapId = world.gameMap.id;
      this.player = new SavePlayer(world.player);
    }
  }
}
