import { EntityAnimationGroup } from 'src/domain/entity-animation';

export default (): Map<string, EntityAnimationGroup> => {
  // The Antifarea spritesheet has two groups per row.
  const left = 0;
  const right = 12;

  // The Antifarea spritesheet has 3 rows per group.
  const groupHeight = 3;

  const groups: Map<string, EntityAnimationGroup> = new Map();

  groups.set('af-monk-1',            genGroup(genAntifareaRawGroup(left,    0 * groupHeight)));
  groups.set('af-monk-2',            genGroup(genAntifareaRawGroup(right,   0 * groupHeight)));

  groups.set('af-fighter-silver',    genGroup(genAntifareaRawGroup(left,    1 * groupHeight)));
  groups.set('af-fighter-pink',      genGroup(genAntifareaRawGroup(right,   1 * groupHeight)));

  groups.set('af-vagrant-blue',      genGroup(genAntifareaRawGroup(left,    2 * groupHeight)));
  groups.set('af-vagrant-purple',    genGroup(genAntifareaRawGroup(right,   2 * groupHeight)));

  groups.set('af-holy-blue',         genGroup(genAntifareaRawGroup(left,    3 * groupHeight)));
  groups.set('af-holy-white',        genGroup(genAntifareaRawGroup(right,   3 * groupHeight)));

  groups.set('af-ninja-dark',        genGroup(genAntifareaRawGroup(left,    4 * groupHeight)));
  groups.set('af-ninja-light',       genGroup(genAntifareaRawGroup(right,   4 * groupHeight)));

  groups.set('af-forester-blonde',   genGroup(genAntifareaRawGroup(left,    5 * groupHeight)));
  groups.set('af-forester-red',      genGroup(genAntifareaRawGroup(right,   5 * groupHeight)));

  groups.set('af-sage-bald',         genGroup(genAntifareaRawGroup(left,    6 * groupHeight)));
  groups.set('af-sage-gray',         genGroup(genAntifareaRawGroup(right,   6 * groupHeight)));

  groups.set('af-caveman-messy',     genGroup(genAntifareaRawGroup(left,    7 * groupHeight)));
  groups.set('af-caveman-bun',       genGroup(genAntifareaRawGroup(right,   7 * groupHeight)));

  groups.set('af-caveman-short',     genGroup(genAntifareaRawGroup(left,    8 * groupHeight)));
  groups.set('af-caveman-long',      genGroup(genAntifareaRawGroup(right,   8 * groupHeight)));

  groups.set('af-dark-knight-black', genGroup(genAntifareaRawGroup(left,    9 * groupHeight)));
  groups.set('af-dark-knight-green', genGroup(genAntifareaRawGroup(right,   9 * groupHeight)));

  groups.set('af-soldier-green',     genGroup(genAntifareaRawGroup(left,   10 * groupHeight)));
  groups.set('af-soldier-blue',      genGroup(genAntifareaRawGroup(right,  10 * groupHeight)));

  groups.set('af-villager-pants',    genGroup(genAntifareaRawGroup(left,   11 * groupHeight)));
  groups.set('af-villager-dress',    genGroup(genAntifareaRawGroup(right,  11 * groupHeight)));

  groups.set('af-villager-bieber',   genGroup(genAntifareaRawGroup(left,   12 * groupHeight)));
  groups.set('af-villager-bows',     genGroup(genAntifareaRawGroup(right,  12 * groupHeight)));

  groups.set('af-clergy-hat',        genGroup(genAntifareaRawGroup(left,   13 * groupHeight)));
  groups.set('af-clergy-nun',        genGroup(genAntifareaRawGroup(right,  13 * groupHeight)));

  groups.set('af-pirate-red',        genGroup(genAntifareaRawGroup(left,   14 * groupHeight)));
  groups.set('af-pirate-hat',        genGroup(genAntifareaRawGroup(right,  14 * groupHeight)));

  groups.set('af-samurai-helm',      genGroup(genAntifareaRawGroup(left,   15 * groupHeight)));
  groups.set('af-samurai-crown',     genGroup(genAntifareaRawGroup(right,  15 * groupHeight)));

  groups.set('af-royalty-crown',     genGroup(genAntifareaRawGroup(left,   16 * groupHeight)));
  groups.set('af-royalty-dress',     genGroup(genAntifareaRawGroup(right,  16 * groupHeight)));

  groups.set('af-turban',            genGroup(genAntifareaRawGroup(left,   17 * groupHeight)));
  groups.set('af-bunny',             genGroup(genAntifareaRawGroup(right,  17 * groupHeight)));

  groups.set('af-bard',              genGroup(genAntifareaRawGroup(left,   18 * groupHeight)));
  groups.set('af-dancer',            genGroup(genAntifareaRawGroup(right,  18 * groupHeight)));

  groups.set('af-sage-beard',        genGroup(genAntifareaRawGroup(left,   19 * groupHeight)));
  groups.set('af-sage-white',        genGroup(genAntifareaRawGroup(right,  19 * groupHeight)));

  groups.set('af-villager-orange',   genGroup(genAntifareaRawGroup(left,   20 * groupHeight)));
  groups.set('af-villager-pink',     genGroup(genAntifareaRawGroup(right,  20 * groupHeight)));

  groups.set('af-vampire',           genGroup(genAntifareaRawGroup(left,   21 * groupHeight)));
  groups.set('af-nurse',             genGroup(genAntifareaRawGroup(right,  21 * groupHeight)));

  groups.set('af-shrouded-1',        genGroup(genAntifareaRawGroup(left,   22 * groupHeight)));
  groups.set('af-shrouded-2',        genGroup(genAntifareaRawGroup(right,  22 * groupHeight)));

  groups.set('af-elemental-fire',    genGroup(genAntifareaRawGroup(left,   23 * groupHeight)));
  groups.set('af-elemental-ice',     genGroup(genAntifareaRawGroup(right,  23 * groupHeight)));

  groups.set('af-elemental-earth',   genGroup(genAntifareaRawGroup(left,   24 * groupHeight)));
  groups.set('af-elemental-plant',   genGroup(genAntifareaRawGroup(right,  24 * groupHeight)));

  groups.set('af-elemental-light',   genGroup(genAntifareaRawGroup(left,   25 * groupHeight)));
  groups.set('af-elemental-shadow',  genGroup(genAntifareaRawGroup(right,  25 * groupHeight)));

  return groups;
};

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
  const walkDelay = 100 / 0.65;

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
        genRawFrame(xoff + 2, yoff, runDelay),
        genRawFrame(xoff + 1, yoff, runDelay),
        genRawFrame(xoff,     yoff, runDelay),
        genRawFrame(xoff + 1, yoff, runDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-up', 'walk-up',
      [
        genRawFrame(xoff + 2, yoff, walkDelay),
        genRawFrame(xoff + 1, yoff, walkDelay),
        genRawFrame(xoff,     yoff, walkDelay),
        genRawFrame(xoff + 1, yoff, walkDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-down', 'run-down',
      [
        genRawFrame(xoff + 2, yoff + 2, runDelay),
        genRawFrame(xoff + 1, yoff + 2, runDelay),
        genRawFrame(xoff,     yoff + 2, runDelay),
        genRawFrame(xoff + 1, yoff + 2, runDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-down', 'walk-down',
      [
        genRawFrame(xoff + 2, yoff + 2, walkDelay),
        genRawFrame(xoff + 1, yoff + 2, walkDelay),
        genRawFrame(xoff,     yoff + 2, walkDelay),
        genRawFrame(xoff + 1, yoff + 2, walkDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-left', 'run-left',
      [
        genRawFrame(xoff + 2, yoff + 1, runDelay, true),
        genRawFrame(xoff + 1, yoff + 1, runDelay, true),
        genRawFrame(xoff,     yoff + 1, runDelay, true),
        genRawFrame(xoff + 1, yoff + 1, runDelay, true)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-left', 'walk-left',
      [
        genRawFrame(xoff + 2, yoff + 1, walkDelay, true),
        genRawFrame(xoff + 1, yoff + 1, walkDelay, true),
        genRawFrame(xoff,     yoff + 1, walkDelay, true),
        genRawFrame(xoff + 1, yoff + 1, walkDelay, true)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'run-right', 'run-right',
      [
        genRawFrame(xoff + 2, yoff + 1, runDelay),
        genRawFrame(xoff + 1, yoff + 1, runDelay),
        genRawFrame(xoff,     yoff + 1, runDelay),
        genRawFrame(xoff + 1, yoff + 1, runDelay)
      ]
    )
  );
  rawAnimations.push(
    genRawAnimation(
      'walk-right', 'walk-right',
      [
        genRawFrame(xoff + 2, yoff + 1, walkDelay),
        genRawFrame(xoff + 1, yoff + 1, walkDelay),
        genRawFrame(xoff,     yoff + 1, walkDelay),
        genRawFrame(xoff + 1, yoff + 1, walkDelay)
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
