import World from 'src/domain/world';
import timer from 'src/session/timer';

class GameMaster {
  /**
   * Horizontal direction that the player wants to move.
   */
  private dxIntended: number;
  /**
   * Vertical direction that the player wants to move.
   */
  private dyIntended: number;

  advance(world: World) {
    if (!world) {
      return;
    }

    world.player.entity.dxIntended = this.dxIntended;
    world.player.entity.dyIntended = this.dyIntended;

    world.entities.forEach((entity) => {
      const speed = 5; // pixels per millisecond? shrug
      const secondsPast = timer.elapsed / 1000;
      const final = speed * secondsPast;
      entity.x += entity.dxIntended * final;
      entity.y += entity.dyIntended * final;
    })
  }

  setPlayerIntendedDirection(dxIntended: number, dyIntended: number) {
    this.dxIntended = dxIntended;
    this.dyIntended = dyIntended;
  }
}

export default new GameMaster();
