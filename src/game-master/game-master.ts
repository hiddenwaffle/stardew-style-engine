import { World } from 'src/domain/world';
import { calculateFacing } from 'src/domain/direction';
import { walkEntityToTiles } from './walk-entity-to-tiles';
import { walkEntityToEntities } from './walk-entity-to-entities';
import { calculateDxDyIntended } from './calculate-dx-dy-intended';
import { camera } from 'src/session/camera';
import { tryAnimationSwitch } from './try-animation-switch';

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

  private xmouse: number;
  private ymouse: number;

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

    this.xmouse = -1;
    this.ymouse = -1;

    this.clicked = false;
    this.rightClick = false;
    this.xclick = -1;
    this.yclick = -1;
  }

  advance(world: World) {
    if (!world) {
      return;
    }

    world.step();

    {
      const [x, y] = camera.logicalToWorld(this.xmouse, this.ymouse);
      world.recalculatePointer(x, y);
    }

    // Set the player's intended movement before walking the entities.
    world.player.entity.dxIntended = this.dxIntended;
    world.player.entity.dyIntended = this.dyIntended;

    world.entities.forEach((entity) => {
      // Have entity calcuate where it is going, if anywhere.
      calculateDxDyIntended(world, entity);

      // Clear expired call timers before doing anything that involves calls.
      entity.clearExpiredCallTimers();
      // These have to do with direct movement and collision checks.
      walkEntityToTiles(world, entity).executeCalls();
      walkEntityToEntities(world, entity).executeCalls();

      // Currently just advances animation.
      entity.step();
    });

    world.player.entity.facing = calculateFacing(
      world.player.entity.dxIntended,
      world.player.entity.dyIntended,
      world.player.entity.facing,
      world.player.entity.directionsOfFreedom,
    );

    if (this.clicked) {
      const [x, y] = camera.logicalToWorld(this.xclick, this.yclick);
      world.executeClick(x, y, this.rightClick);
    }

    tryAnimationSwitch(world.player.entity, this.walk);

    camera.setFocus(world.player.x, world.player.y);
  }

  setPlayerIntendedDirection(dxIntended: number, dyIntended: number, walk: boolean) {
    this.dxIntended = dxIntended * (walk ? 0.65 : 1); // TODO: Set constant for walk elsewhere?
    this.dyIntended = dyIntended * (walk ? 0.65 : 1); // TODO: Set constant for walk elsewhere?
    this.walk = walk;
  }

  setLogicalMouseAt(x: number, y: number) {
    this.xmouse = x;
    this.ymouse = y;
  }

  setLogicalClickedAt(x?: number, y?: number, rightClick?: boolean) {
    this.clicked = x && y ? true : false;
    this.rightClick = rightClick || false;
    this.xclick = x || 0;
    this.yclick = y || 0;
  }
}

export const gameMaster = new GameMaster();
