import { Save } from 'src/session/save';
import Player from './player';
import Entity from './entity';
import StaticMap from './static-map';
import timer from 'src/session/timer';

export default class {
  player: Player;
  entities: Entity[];
  staticMap: StaticMap;

  constructor() {
    this.player = new Player();
    this.entities = [];
    this.staticMap = new StaticMap();
  }

  step() {
    this.entities.forEach((entity) => {
      // entity.x += Math.floor((entity.dxIntended * timer.elapsed) / 11);
      // entity.y += Math.floor((entity.dyIntended * timer.elapsed) / 11);
      const speed = 300; // Pixels per second
      const secondsPast = timer.elapsed / 1000;
      const final = speed * secondsPast;
      entity.x += entity.dxIntended * final;
      entity.y += entity.dyIntended * final;
      // entity.x += Math.floor(entity.dxIntended * timer.elapsed);
      // entity.y += Math.floor(entity.dyIntended * timer.elapsed);
    })
  }

  setIntendedDirection(dx: number, dy: number) {
    this.player.setIntendedDirection(dx, dy);
  }

  applySave(save: Save) {
    this.player.applySave(save.player);
    this.staticMap.applySave(save.staticMap);
    this.entities.push(this.player.entity);
  }

  extractSave(): Save {
    return new Save(
      this.staticMap.extractSave(),
      this.player.extractSave()
    );
  }
}
