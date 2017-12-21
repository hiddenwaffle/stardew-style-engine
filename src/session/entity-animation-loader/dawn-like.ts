import { EntityAnimationGroup } from 'src/domain/entity-animation';

export default (): Map<string, EntityAnimationGroup> => {
  const groups: Map<string, EntityAnimationGroup> = new Map();

  const playerFilenames = ['Player0.png', 'Player1.png'];
  // Row 0
  groups.set('dl-player-0-0', genGroup(0, 0, playerFilenames));
  groups.set('dl-player-1-0', genGroup(1, 0, playerFilenames));
  groups.set('dl-player-2-0', genGroup(2, 0, playerFilenames));
  groups.set('dl-player-3-0', genGroup(3, 0, playerFilenames));
  groups.set('dl-player-4-0', genGroup(4, 0, playerFilenames));
  groups.set('dl-player-5-0', genGroup(5, 0, playerFilenames));
  groups.set('dl-player-6-0', genGroup(6, 0, playerFilenames));
  groups.set('dl-player-7-0', genGroup(7, 0, playerFilenames));
  // Row 1
  groups.set('dl-player-0-1', genGroup(0, 1, playerFilenames));
  groups.set('dl-player-1-1', genGroup(1, 1, playerFilenames));
  groups.set('dl-player-2-1', genGroup(2, 1, playerFilenames));
  groups.set('dl-player-3-1', genGroup(3, 1, playerFilenames));
  groups.set('dl-player-4-1', genGroup(4, 1, playerFilenames));
  groups.set('dl-player-5-1', genGroup(5, 1, playerFilenames));
  groups.set('dl-player-6-1', genGroup(6, 1, playerFilenames));
  groups.set('dl-player-7-1', genGroup(7, 1, playerFilenames));
  // Row 2 (blank)
  // Row 3
  groups.set('dl-player-0-3', genGroup(0, 3, playerFilenames));
  groups.set('dl-player-1-3', genGroup(1, 3, playerFilenames));
  groups.set('dl-player-2-3', genGroup(2, 3, playerFilenames));
  groups.set('dl-player-3-3', genGroup(3, 3, playerFilenames));
  groups.set('dl-player-4-3', genGroup(4, 3, playerFilenames));
  groups.set('dl-player-5-3', genGroup(5, 3, playerFilenames));
  groups.set('dl-player-6-3', genGroup(6, 3, playerFilenames));
  groups.set('dl-player-7-3', genGroup(7, 3, playerFilenames));
  // Row 4
  groups.set('dl-player-0-4', genGroup(0, 4, playerFilenames));
  groups.set('dl-player-1-4', genGroup(1, 4, playerFilenames));
  groups.set('dl-player-2-4', genGroup(2, 4, playerFilenames));
  groups.set('dl-player-3-4', genGroup(3, 4, playerFilenames));
  groups.set('dl-player-4-4', genGroup(4, 4, playerFilenames));
  groups.set('dl-player-5-4', genGroup(5, 4, playerFilenames));
  groups.set('dl-player-6-4', genGroup(6, 4, playerFilenames));
  groups.set('dl-player-7-4', genGroup(7, 4, playerFilenames));
  // Row 5
  groups.set('dl-player-0-5', genGroup(0, 5, playerFilenames));
  groups.set('dl-player-1-5', genGroup(1, 5, playerFilenames));
  groups.set('dl-player-2-5', genGroup(2, 5, playerFilenames));
  // Row 6 (blank)
  // Row 7
  groups.set('dl-player-0-7', genGroup(0, 7, playerFilenames));
  groups.set('dl-player-1-7', genGroup(1, 7, playerFilenames));
  groups.set('dl-player-2-7', genGroup(2, 7, playerFilenames));
  groups.set('dl-player-3-7', genGroup(3, 7, playerFilenames));
  groups.set('dl-player-4-7', genGroup(4, 7, playerFilenames));
  groups.set('dl-player-5-7', genGroup(5, 7, playerFilenames));
  groups.set('dl-player-6-7', genGroup(6, 7, playerFilenames));
  groups.set('dl-player-7-7', genGroup(7, 7, playerFilenames));
  // Row 8
  groups.set('dl-player-0-8', genGroup(0, 8, playerFilenames));
  groups.set('dl-player-1-8', genGroup(1, 8, playerFilenames));
  groups.set('dl-player-2-8', genGroup(2, 8, playerFilenames));
  groups.set('dl-player-3-8', genGroup(3, 8, playerFilenames));
  groups.set('dl-player-4-8', genGroup(4, 8, playerFilenames));
  groups.set('dl-player-5-8', genGroup(5, 8, playerFilenames));
  groups.set('dl-player-6-8', genGroup(6, 8, playerFilenames));
  groups.set('dl-player-7-8', genGroup(7, 8, playerFilenames));
  // Row 9  (blank)
  // Row 10 (blank)
  // Row 11
  groups.set('dl-player-0-11', genGroup(0, 11, playerFilenames));
  groups.set('dl-player-1-11', genGroup(1, 11, playerFilenames));
  groups.set('dl-player-2-11', genGroup(2, 11, playerFilenames));
  groups.set('dl-player-3-11', genGroup(3, 11, playerFilenames));
  groups.set('dl-player-4-11', genGroup(4, 11, playerFilenames));
  groups.set('dl-player-5-11', genGroup(5, 11, playerFilenames));
  groups.set('dl-player-6-11', genGroup(6, 11, playerFilenames));
  groups.set('dl-player-7-11', genGroup(7, 11, playerFilenames));
  // Row 12
  groups.set('dl-player-0-12', genGroup(0, 12, playerFilenames));
  groups.set('dl-player-1-12', genGroup(1, 12, playerFilenames));
  groups.set('dl-player-2-12', genGroup(2, 12, playerFilenames));
  groups.set('dl-player-3-12', genGroup(3, 12, playerFilenames));
  groups.set('dl-player-4-12', genGroup(4, 12, playerFilenames));
  groups.set('dl-player-5-12', genGroup(5, 12, playerFilenames));
  groups.set('dl-player-6-12', genGroup(6, 12, playerFilenames));
  groups.set('dl-player-7-12', genGroup(7, 12, playerFilenames));
  // Row 13
  groups.set('dl-player-0-13', genGroup(0, 13, playerFilenames));
  groups.set('dl-player-1-13', genGroup(1, 13, playerFilenames));
  // Row 14
  groups.set('dl-player-0-12', genGroup(0, 14, playerFilenames));
  groups.set('dl-player-1-12', genGroup(1, 14, playerFilenames));
  groups.set('dl-player-2-12', genGroup(2, 14, playerFilenames));
  groups.set('dl-player-3-12', genGroup(3, 14, playerFilenames));
  groups.set('dl-player-4-12', genGroup(4, 14, playerFilenames));
  groups.set('dl-player-5-12', genGroup(5, 14, playerFilenames));
  groups.set('dl-player-6-12', genGroup(6, 14, playerFilenames));
  groups.set('dl-player-7-12', genGroup(7, 14, playerFilenames));

  return groups;
};

/**
 * Should match the structure of *.json files.
 */
function genGroup(xoff: number, yoff: number, filenames: string[]): EntityAnimationGroup {
  return new EntityAnimationGroup({
    animations: genRawAnimations(xoff, yoff),
    filenames
  });
}

/**
 * Should match the structure of the *.json files.
 */
function genRawAnimations(xoff: number, yoff: number): any[] {
  const walkDelay = 250;
  const runDelay  = 125;

  const rawAnimations: any[] = [];

  rawAnimations.push(
    genRawAnimation(
      'default', 'default',
      [
        genRawFrame(0, xoff, yoff) // Same as stand-left.
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-left', 'stand-left',
      [
        genRawFrame(0, xoff, yoff)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-right', 'stand-right',
      [
        genRawFrame(0, xoff, yoff, null, true)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-left', 'walk-left',
      [
        genRawFrame(0, xoff, yoff, walkDelay),
        genRawFrame(1, xoff, yoff, walkDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-right', 'walk-right',
      [
        genRawFrame(0, xoff, yoff, walkDelay, true),
        genRawFrame(1, xoff, yoff, walkDelay, true)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-left', 'run-left',
      [
        genRawFrame(0, xoff, yoff, runDelay),
        genRawFrame(1, xoff, yoff, runDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-right', 'run-right',
      [
        genRawFrame(0, xoff, yoff, runDelay, true),
        genRawFrame(1, xoff, yoff, runDelay, true)
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
    frames: rawFrames,
    name,
    next
  };
}

/**
 * Should match the structure of the *.json files.
 */
function genRawFrame(
  imageIndex: number,
  x: number,
  y: number,
  delay?: number,
  flipped?: boolean
): any {
  const rawFrame: any = { imageIndex, x, y };
  if (delay) {
    rawFrame.delay = delay;
  }
  if (flipped) {
    rawFrame.flipped = flipped;
  }
  return rawFrame;
}
