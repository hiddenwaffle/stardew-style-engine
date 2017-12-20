import { EntityAnimationGroup } from 'src/domain/entity-animation';
import imageLoader from 'src/session/image-loader';
import antifarea from './antifarea';
import dawnLike from './dawn-like';

class EntityAnimationManager {
  private readonly groups: Map<string, EntityAnimationGroup>;

  constructor() {
    this.groups = new Map([
      ...antifarea(),
      ...dawnLike()
    ]);
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
