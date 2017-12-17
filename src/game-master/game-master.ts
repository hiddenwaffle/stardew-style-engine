import World from 'src/domain/world';
import walkEntityToTiles from './walk-entity-to-tiles';
import walkEntityToEntity from './walk-entity-to-entity';

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

    // Set the player's intended movement before walking the entities.
    world.player.entity.dxIntended = this.dxIntended;
    world.player.entity.dyIntended = this.dyIntended;

    world.entities.forEach((entity) => {
      entity.clearExpiredCallTimers();
      const walkResult = walkEntityToTiles(world, entity);
      walkResult.executeCalls(world);
    });

    walkEntityToEntity(world);
  }

  setPlayerIntendedDirection(dxIntended: number, dyIntended: number) {
    this.dxIntended = dxIntended;
    this.dyIntended = dyIntended;
  }
}

export default new GameMaster();
