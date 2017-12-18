import { EntityAnimationGroup } from 'src/domain/entity-animation';
import imageLoader from './image-loader';

import pirate from 'src/external/entity-animation-group/pirate.json';
import bard from   'src/external/entity-animation-group/bard.json';

const ANTIFAREA_IMAGE_FILENAME = 'antifarea_18x20chars.png';

class EntityAnimationManager {
  private readonly groups: Map<string, EntityAnimationGroup>;

  constructor() {
    this.groups = new Map();
    this.groups.set('pirate', genConfig(pirate));
    this.groups.set('bard',   genConfig(bard));
  }

  prepare(animationGroupName: string) {
    const group = this.groups.get(animationGroupName);
    if (group) {
      imageLoader.prepare(group.imagePath);
    } else {
      console.warn(`Unknown animationGroupName: ${animationGroupName}`);
    }
  }
}

export default new EntityAnimationManager();

function genConfig(configFile: any): EntityAnimationGroup {
  return new EntityAnimationGroup(ANTIFAREA_IMAGE_FILENAME, configFile);
}
