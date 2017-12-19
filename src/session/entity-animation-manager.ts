import { EntityAnimationGroup } from 'src/domain/entity-animation';
import imageLoader from './image-loader';

class EntityAnimationManager {
  private readonly groups: Map<string, EntityAnimationGroup>;

  constructor() {
    this.groups = new Map();
    this.groups.set('bard-white', genGroup(genAntifareaRawGroup(13, 9)));
  }

  get(animationGroupName: string) {
    const group = this.groups.get(animationGroupName);
    if (group) {
      imageLoader.prepare(group.imagePath);
    } else {
      console.warn(`Unknown animationGroupName: ${animationGroupName}`);
    }
    return group;
  }
}

export default new EntityAnimationManager();

function genGroup(raw: any): EntityAnimationGroup {
  return new EntityAnimationGroup(raw);
}

/**
 * Should match the structure of *.json files.
 */
function genAntifareaRawGroup(xoff: number, yoff: number): any {
  return {
    filename: 'antifarea_18x20chars.png',
    animations: genAntifareaRawAnimations(xoff, yoff)
  };
}

/**
 * Should match the structure of the *.json files.
 */
function genAntifareaRawAnimations(xoff: number, yoff: number): any[] {
  const rawAnimations: any[] = [];
  const runDelay = 100;

  rawAnimations.push(
    genRawAnimation(
      'default', 'default',
      [
        genRawFrame(xoff + 1, yoff + 2) // Same as stand-down.
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-up', 'stand-up',
      [
        genRawFrame(xoff + 1, yoff)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-down', 'stand-down',
      [
        genRawFrame(xoff + 1, yoff + 2)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-left', 'stand-left',
      [
        genRawFrame(xoff + 1, yoff + 1, null, true)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-right', 'stand-right',
      [
        genRawFrame(xoff + 1, yoff + 1)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-up', 'run-up',
      [
        genRawFrame(xoff + 1, yoff, runDelay),
        genRawFrame(xoff,     yoff, runDelay),
        genRawFrame(xoff + 1, yoff, runDelay),
        genRawFrame(xoff,     yoff, runDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-down', 'run-down',
      [
        genRawFrame(xoff + 1, yoff + 2, runDelay),
        genRawFrame(xoff,     yoff + 2, runDelay),
        genRawFrame(xoff + 1, yoff + 2, runDelay),
        genRawFrame(xoff,     yoff + 2, runDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-left', 'run-left',
      [
        genRawFrame(xoff + 1, yoff + 1, runDelay, true),
        genRawFrame(xoff,     yoff + 1, runDelay, true),
        genRawFrame(xoff + 1, yoff + 1, runDelay, true),
        genRawFrame(xoff,     yoff + 1, runDelay, true)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-right', 'run-right',
      [
        genRawFrame(xoff + 1, yoff + 1, runDelay),
        genRawFrame(xoff,     yoff + 1, runDelay),
        genRawFrame(xoff + 1, yoff + 1, runDelay),
        genRawFrame(xoff,     yoff + 1, runDelay)
      ]
    )
  );

  return rawAnimations;
}

/**
 * Should match the structure of the *.json files.
 */
function genRawAnimation(name: string, next: string, rawFrames: any[]) {
  return {
    name,
    next,
    frames: rawFrames
  };
}

/**
 * Should match the structure of the *.json files.
 */
function genRawFrame(
  x: number,
  y: number,
  delay?: number,
  flipped?: boolean
): any {
  const rawFrame: any = { x, y };
  if (delay) {
    rawFrame.delay = delay;
  }
  if (flipped) {
    rawFrame.flipped = flipped;
  }
  return rawFrame;
}
