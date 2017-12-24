import { World } from 'src/domain/world';
import { Entity } from 'src/domain/entity';
import { Direction, DirectionsOfFreedom } from 'src/domain/direction';
import { walkEntityToTiles } from './walk-entity-to-tiles';
import { walkEntityToEntity } from './walk-entity-to-entity';
import { translateScreenToWorld } from 'src/session/camera';

class GameMaster {
  /**
   * Horizontal direction that the player wants to move.
   */
  private dxIntended: number;
  /**
   * Vertical direction that the player wants to move.
   */
  private dyIntended: number;
  /**
   * If the player is trying to walk.
   */
  private walk: boolean;

  /**
   * If the mouse was clicked, and where.
   */
  private clicked: boolean;
  private rightClick: boolean;
  private xclick: number;
  private yclick: number;

  constructor() {
    this.dxIntended = 0;
    this.dyIntended = 0;
    this.walk = false;

    this.clicked = false;
    this.rightClick = false;
    this.xclick = 0;
    this.yclick = 0;
  }

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
      world.player.entity.facing,
      world.player.entity.directionsOfFreedom,
    );

    if (this.clicked) {
      const [x, y] = translateScreenToWorld(this.xclick, this.yclick);
      world.executeClick(x, y, this.rightClick);
    }

    tryAnimationSwitch(world.player.entity, this.walk);
  }

  setPlayerIntendedDirection(dxIntended: number, dyIntended: number, walk: boolean) {
    this.dxIntended = dxIntended * (walk ? 0.65 : 1); // TODO: Set constant for walk elsewhere?
    this.dyIntended = dyIntended * (walk ? 0.65 : 1); // TODO: Set constant for walk elsewhere?
    this.walk = walk;
  }

  setLogicalClickedAt(x?: number, y?: number, rightClick?: boolean) {
    this.clicked = x && y ? true : false;
    this.rightClick = rightClick || false;
    this.xclick = x || 0;
    this.yclick = y || 0;
  }
}

export const gameMaster = new GameMaster();

function calculateFacing(
  dx: number,
  dy: number,
  currentFacing: Direction,
  directionsOfFreedom: DirectionsOfFreedom,
): Direction {
  switch (directionsOfFreedom) {
    case DirectionsOfFreedom.One:
      return calculateFacingOneDirection(dx, dy, currentFacing);
    case DirectionsOfFreedom.Two:
      return calculateFacingTwoDirections(dx, currentFacing);
    case DirectionsOfFreedom.Four:
      return calculateFacingFourDirections(dx, dy, currentFacing);
    case DirectionsOfFreedom.Eight:
      // TODO: Account for 8 directions of freedom, when necessary (arrows?).
      break;
  }
  return Direction.None;
}

function calculateFacingOneDirection(
  dx: number,
  dy: number,
  currentFacing: Direction,
): Direction {
  return currentFacing; // TODO: I dunno, doesn't matter does it?
}

function calculateFacingTwoDirections(
  dx: number,
  currentFacing: Direction,
): Direction {
  if (dx < 0) {
    return Direction.Left;
  } else if (dx > 0) {
    return Direction.Right;
  }
  return currentFacing;
}

function calculateFacingFourDirections(
  dx: number,
  dy: number,
  currentFacing: Direction,
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

function tryAnimationSwitch(entity: Entity, walk: boolean) {
  const action = entity.dxIntended === 0 && entity.dyIntended === 0 ? 'stand' : (walk ? 'walk' : 'run');
  const direction = Direction[entity.facing].toLowerCase();
  const animationName = `${action}-${direction}`;
  entity.switchAnimation(animationName, false);
}
