import Entity from 'src/domain/entity';
import World from 'src/domain/world';
import CollisionLayer from 'src/domain/collision-layer';
import timer from 'src/session/timer';
import {
  TARGET_FIELD_TILE_SIZE,
  UPSCALE
} from 'src/constants';

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
    let solidCollisionLayer = null;
    const xprojected = entity.x + dx;
    const yprojected = entity.y + dy;
    const xprojectedTile = Math.floor(xprojected / TARGET_FIELD_TILE_SIZE);
    const yprojectedTile = Math.floor(yprojected / TARGET_FIELD_TILE_SIZE);

    for (const layer of world.staticMap.collisionLayers) {
      const index = xprojectedTile + (yprojectedTile * layer.width);
      const value = layer.tiles[index];
      if (value !== 0) {
        if (layer.passthrough) {
          console.log('i do not block you');
        } else {
          console.log('i block you');
          solidCollision = true;
          solidCollisionLayer = layer;
          break;
        }
      }
    };
    if (solidCollision) {
      // Allow the entity to "slide" against the collision tile (when attmpting to move diagonally).
      const xcurrentTile = Math.floor(entity.x / TARGET_FIELD_TILE_SIZE);
      const ycurrentTile = Math.floor(entity.y / TARGET_FIELD_TILE_SIZE);
      if (dx !== 0) {
        const index = xprojectedTile + (ycurrentTile * solidCollisionLayer.width);
        const value = solidCollisionLayer.tiles[index];
        if (value === 0) {
          entity.x = xprojected;
        }
      }
      if (dy !== 0) {
        const index = xcurrentTile + (yprojectedTile * solidCollisionLayer.width);
        const value = solidCollisionLayer.tiles[index];
        if (value === 0) {
          entity.y = yprojected;
        }
      }
    } else {
      entity.x = xprojected;
      entity.y = yprojected;
    }
  }
}

export default new GameMaster();
