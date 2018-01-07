import { EntityAnimationGroup } from 'src/domain/entity-animation';

export function antifarea(): Map<string, EntityAnimationGroup> {
  // The Antifarea spritesheet has two groups per row.
  const left = 0;
  const right = 12;

  // The Antifarea spritesheet has 3 rows per group.
  const groupHeight = 3;

  const groups: Map<string, EntityAnimationGroup> = new Map();

  groups.set('af-monk-1',            genGroup(left,    0 * groupHeight, 'af-monk-1'));
  groups.set('af-monk-2',            genGroup(right,   0 * groupHeight, 'af-monk-2'));

  groups.set('af-fighter-silver',    genGroup(left,    1 * groupHeight, 'af-fighter-silver'));
  groups.set('af-fighter-pink',      genGroup(right,   1 * groupHeight, 'af-fighter-pink'));

  groups.set('af-vagrant-blue',      genGroup(left,    2 * groupHeight, 'af-vagrant-blue'));
  groups.set('af-vagrant-purple',    genGroup(right,   2 * groupHeight, 'af-vagrant-purple'));

  groups.set('af-holy-blue',         genGroup(left,    3 * groupHeight, 'af-holy-blue'));
  groups.set('af-holy-white',        genGroup(right,   3 * groupHeight, 'af-holy-white'));

  groups.set('af-ninja-dark',        genGroup(left,    4 * groupHeight, 'af-ninja-dark'));
  groups.set('af-ninja-light',       genGroup(right,   4 * groupHeight, 'af-ninja-light'));

  groups.set('af-forester-blonde',   genGroup(left,    5 * groupHeight, 'af-forester-blonde'));
  groups.set('af-forester-red',      genGroup(right,   5 * groupHeight, 'af-forester-red'));

  groups.set('af-sage-bald',         genGroup(left,    6 * groupHeight, 'af-sage-bald'));
  groups.set('af-sage-gray',         genGroup(right,   6 * groupHeight, 'af-sage-gray'));

  groups.set('af-caveman-messy',     genGroup(left,    7 * groupHeight, 'af-caveman-messy'));
  groups.set('af-caveman-bun',       genGroup(right,   7 * groupHeight, 'af-caveman-bun'));

  groups.set('af-caveman-short',     genGroup(left,    8 * groupHeight, 'af-caveman-short'));
  groups.set('af-caveman-long',      genGroup(right,   8 * groupHeight, 'af-caveman-long'));

  groups.set('af-dark-knight-black', genGroup(left,    9 * groupHeight, 'af-dark-knight-black'));
  groups.set('af-dark-knight-green', genGroup(right,   9 * groupHeight, 'af-dark-knight-green'));

  groups.set('af-soldier-green',     genGroup(left,   10 * groupHeight, 'af-soldier-green'));
  groups.set('af-soldier-blue',      genGroup(right,  10 * groupHeight, 'af-soldier-blue'));

  groups.set('af-villager-pants',    genGroup(left,   11 * groupHeight, 'af-villager-pants'));
  groups.set('af-villager-dress',    genGroup(right,  11 * groupHeight, 'af-villager-dress'));

  groups.set('af-villager-bieber',   genGroup(left,   12 * groupHeight, 'af-villager-bieber'));
  groups.set('af-villager-bows',     genGroup(right,  12 * groupHeight, 'af-villager-bows'));

  groups.set('af-clergy-hat',        genGroup(left,   13 * groupHeight, 'af-clergy-hat'));
  groups.set('af-clergy-nun',        genGroup(right,  13 * groupHeight, 'af-clergy-nun'));

  groups.set('af-pirate-red',        genGroup(left,   14 * groupHeight, 'af-pirate-red'));
  groups.set('af-pirate-hat',        genGroup(right,  14 * groupHeight, 'af-pirate-hat'));

  groups.set('af-samurai-helm',      genGroup(left,   15 * groupHeight, 'af-samurai-helm'));
  groups.set('af-samurai-crown',     genGroup(right,  15 * groupHeight, 'af-samurai-crown'));

  groups.set('af-royalty-crown',     genGroup(left,   16 * groupHeight, 'af-royalty-crown'));
  groups.set('af-royalty-dress',     genGroup(right,  16 * groupHeight, 'af-royalty-dress'));

  groups.set('af-turban',            genGroup(left,   17 * groupHeight, 'af-turban'));
  groups.set('af-bunny',             genGroup(right,  17 * groupHeight, 'af-bunny'));

  groups.set('af-bard',              genGroup(left,   18 * groupHeight, 'af-bard'));
  groups.set('af-dancer',            genGroup(right,  18 * groupHeight, 'af-dancer'));

  groups.set('af-sage-beard',        genGroup(left,   19 * groupHeight, 'af-sage-beard'));
  groups.set('af-sage-white',        genGroup(right,  19 * groupHeight, 'af-sage-white'));

  groups.set('af-villager-orange',   genGroup(left,   20 * groupHeight, 'af-villager-orange'));
  groups.set('af-villager-pink',     genGroup(right,  20 * groupHeight, 'af-villager-pink'));

  groups.set('af-vampire',           genGroup(left,   21 * groupHeight, 'af-vampire'));
  groups.set('af-nurse',             genGroup(right,  21 * groupHeight, 'af-nurse'));

  groups.set('af-shrouded-1',        genGroup(left,   22 * groupHeight, 'af-shrouded-1'));
  groups.set('af-shrouded-2',        genGroup(right,  22 * groupHeight, 'af-shrouded-2'));

  groups.set('af-elemental-fire',    genGroup(left,   23 * groupHeight, 'af-elemental-fire'));
  groups.set('af-elemental-ice',     genGroup(right,  23 * groupHeight, 'af-elemental-ice'));

  groups.set('af-elemental-earth',   genGroup(left,   24 * groupHeight, 'af-elemental-earth'));
  groups.set('af-elemental-plant',   genGroup(right,  24 * groupHeight, 'af-elemental-plant'));

  groups.set('af-elemental-light',   genGroup(left,   25 * groupHeight, 'af-elemental-light'));
  groups.set('af-elemental-shadow',  genGroup(right,  25 * groupHeight, 'af-elemental-shadow'));

  return groups;
}

/**
 * Should match the structure of *.json files.
 */
function genGroup(xoff: number, yoff: number, name: string): EntityAnimationGroup {
  return new EntityAnimationGroup(name, {
    animations: genRawAnimations(xoff, yoff),
    filenames: ['antifarea_18x20chars.png'],
  });
}

/**
 * Should match the structure of the *.json files.
 */
function genRawAnimations(xoff: number, yoff: number): any[] {
  const rawAnimations: any[] = [];
  const runDelay = 100;
  const walkDelay = 100 / 0.65;

  rawAnimations.push(
    genRawAnimation(
      'default', 'default',
      [
        genRawFrame(xoff + 1, yoff + 2), // Same as stand-down.
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-up', 'stand-up',
      [
        genRawFrame(xoff + 1, yoff),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-down', 'stand-down',
      [
        genRawFrame(xoff + 1, yoff + 2),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-left', 'stand-left',
      [
        genRawFrame(xoff + 1, yoff + 1, null, true),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'stand-right', 'stand-right',
      [
        genRawFrame(xoff + 1, yoff + 1),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'run-up', 'run-up',
      [
        genRawFrame(xoff + 2, yoff, runDelay),
        genRawFrame(xoff + 1, yoff, runDelay),
        genRawFrame(xoff,     yoff, runDelay),
        genRawFrame(xoff + 1, yoff, runDelay),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-up', 'walk-up',
      [
        genRawFrame(xoff + 2, yoff, walkDelay),
        genRawFrame(xoff + 1, yoff, walkDelay),
        genRawFrame(xoff,     yoff, walkDelay),
        genRawFrame(xoff + 1, yoff, walkDelay),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'run-down', 'run-down',
      [
        genRawFrame(xoff + 2, yoff + 2, runDelay),
        genRawFrame(xoff + 1, yoff + 2, runDelay),
        genRawFrame(xoff,     yoff + 2, runDelay),
        genRawFrame(xoff + 1, yoff + 2, runDelay),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-down', 'walk-down',
      [
        genRawFrame(xoff + 2, yoff + 2, walkDelay),
        genRawFrame(xoff + 1, yoff + 2, walkDelay),
        genRawFrame(xoff,     yoff + 2, walkDelay),
        genRawFrame(xoff + 1, yoff + 2, walkDelay),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'run-left', 'run-left',
      [
        genRawFrame(xoff + 2, yoff + 1, runDelay, true),
        genRawFrame(xoff + 1, yoff + 1, runDelay, true),
        genRawFrame(xoff,     yoff + 1, runDelay, true),
        genRawFrame(xoff + 1, yoff + 1, runDelay, true),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-left', 'walk-left',
      [
        genRawFrame(xoff + 2, yoff + 1, walkDelay, true),
        genRawFrame(xoff + 1, yoff + 1, walkDelay, true),
        genRawFrame(xoff,     yoff + 1, walkDelay, true),
        genRawFrame(xoff + 1, yoff + 1, walkDelay, true),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'run-right', 'run-right',
      [
        genRawFrame(xoff + 2, yoff + 1, runDelay),
        genRawFrame(xoff + 1, yoff + 1, runDelay),
        genRawFrame(xoff,     yoff + 1, runDelay),
        genRawFrame(xoff + 1, yoff + 1, runDelay),
      ],
    ),
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-right', 'walk-right',
      [
        genRawFrame(xoff + 2, yoff + 1, walkDelay),
        genRawFrame(xoff + 1, yoff + 1, walkDelay),
        genRawFrame(xoff,     yoff + 1, walkDelay),
        genRawFrame(xoff + 1, yoff + 1, walkDelay),
      ],
    ),
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
    next,
  };
}

/**
 * Should match the structure of the *.json files.
 */
function genRawFrame(
  x: number,
  y: number,
  delay?: number,
  flipped?: boolean,
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
