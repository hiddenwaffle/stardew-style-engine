import Entity from 'src/domain/entity';
import World from 'src/domain/world';
import timer from 'src/session/timer';
import { UPSCALE } from 'src/constants';

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
      const speed = 90 * UPSCALE; // pixels per millisecond?
      const secondsPast = timer.elapsed / 1000;
      const final = speed * secondsPast;
      // entity.x += entity.dxIntended * final;
      // entity.y += entity.dyIntended * final;
      if (!entity.name) {
        this.checkCollision(world, entity, entity.dxIntended * final, entity.dyIntended * final);
      }
    })
  }

  setPlayerIntendedDirection(dxIntended: number, dyIntended: number) {
    this.dxIntended = dxIntended;
    this.dyIntended = dyIntended;
  }

  private checkCollision(world: World, entity: Entity, dx: number, dy: number) {
    let solidCollision = false;
    let xprojected = entity.x + dx;
    let yprojected = entity.y + dy;

    world.staticMap.collisionLayers.forEach((layer) => {
      const xtile = Math.floor(xprojected / 64);
      const ytile = Math.floor(yprojected / 64);
      const index = xtile + (ytile * layer.width);
      const value = layer.tiles[index];
      if (value !== 0) {
        if (!layer.passthrough) {
          solidCollision = true;
        }
      }
    });
    if (solidCollision) {
      console.log('i block you');
    } else {
      entity.x = xprojected;
      entity.y = yprojected;
    }
  }
}

export default new GameMaster();
