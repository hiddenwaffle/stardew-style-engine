import { Save } from 'src/session/save';
import Player from './player';
import GameMap from './game-map';

export default class {
  player: Player;
  gameMap: GameMap;

  constructor(gameMap: GameMap, save: Save) {
    this.gameMap = gameMap;
    this.player = new Player(save.player);
  }
}
