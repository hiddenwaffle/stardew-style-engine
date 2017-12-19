import { EntityAnimationGroup } from 'src/domain/entity-animation';
import imageLoader from './image-loader';

import pirate     from 'src/external/entity-animation-group/pirate.json';
import bard       from 'src/external/entity-animation-group/bard.json';
import bardWhite  from 'src/external/entity-animation-group/bard-white.json';

class EntityAnimationManager {
  private readonly groups: Map<string, EntityAnimationGroup>;

  constructor() {
    this.groups = new Map();
    this.groups.set('pirate',     genGroup(pirate));
    this.groups.set('bard',       genGroup(bard));
    this.groups.set('bard-white', genGroup(bardWhite));
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
