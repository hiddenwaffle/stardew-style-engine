import World from 'src/domain/world';
import Entity from 'src/domain/entity';
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
      // These have to do with movement and collision checks.
      entity.clearExpiredCallTimers();
      const walkResult = walkEntityToTiles(world, entity);
      walkResult.executeCalls(world);

      // Currently just advances animation.
      entity.step();
    });

    walkEntityToEntity(world);

    world.player.entity.facing = calculateFacing(
      world.player.entity.dxIntended,
      world.player.entity.dyIntended,
      world.player.entity.facing
    );

    tryAnimationSwitch(world.player.entity);
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

function tryAnimationSwitch(entity: Entity) {
  const action = entity.dxIntended === 0 && entity.dyIntended === 0 ? 'stand' : 'run';
  const direction = Direction[entity.facing].toLowerCase();
  const animationName = `${action}-${direction}`;
  entity.switchAnimation(animationName, false);
}
