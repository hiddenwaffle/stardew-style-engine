import World from 'src/domain/world';
import { Direction } from 'src/domain/direction';
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

    world.player.facing = calculateFacing(
      world.player.entity.dxIntended,
      world.player.entity.dyIntended,
      world.player.facing
    );
  }

  setPlayerIntendedDirection(dxIntended: number, dyIntended: number) {
    this.dxIntended = dxIntended;
    this.dyIntended = dyIntended;
  }
}

export default new GameMaster();

function calculateFacing(
  dx: number,
  dy: number,
  currentFacing: Direction
): Direction {
  if (dx !== 0 && dy !== 0) { // Diagonal movement
    if (dx < 0 && dy < 0) { // Move up-left
      if (currentFacing === Direction.Left || currentFacing === Direction.Up) {
        return currentFacing;
      } else {
        return Direction.Left; // TODO: Does defaulting to horizontal movement facing work out?
      }
    } else if (dx > 0 && dy < 0) { // Move up-right
      if (currentFacing === Direction.Right || currentFacing === Direction.Up) {
        return currentFacing;
      } else {
        return Direction.Right; // TODO: Does defaulting to horizontal movement facing work out?
      }
    } else if (dx < 0 && dy > 0) { // Move down-left
      if (currentFacing === Direction.Left || currentFacing === Direction.Down) {
        return currentFacing;
      } else {
        return Direction.Left; // TODO: Does defaulting to horizontal movement facing work out?
      }
    } else if (dx > 0 && dy > 0) { // Move down-right
      if (currentFacing === Direction.Right || currentFacing === Direction.Down) {
        return currentFacing;
      } else {
        return Direction.Right; // TODO: Does defaulting to horizontal movement facing work out?
      }
    }
  } else { // Cardinal movement or standing still
    if (dx < 0) {
      return Direction.Left;
    } else if (dx > 0) {
      return Direction.Right;
    } else if (dy < 0) {
      return Direction.Up;
    } else if (dy > 0) {
      return Direction.Down;
    }
  }
  return currentFacing;
}
