import { EntityAnimationGroup } from 'src/domain/entity-animation';
import imageLoader from 'src/session/image-loader';
import antifarea from './antifarea';
import dawnLike from './dawn-like';

class EntityAnimationManager {
  private readonly groups: Map<string, EntityAnimationGroup>;

  constructor() {
    // TODO: Someday switch it to this:
    // this.groups = new Map([
    //   ...antifarea(),
    //   ...dawnLike(),
    //   ...etc...
    // ]);
    this.groups = new Map();
    for (const [key, value] of Array.from(antifarea().entries())) {
      this.groups.set(key, value);
    }
    for (const [key, value] of Array.from(dawnLike().entries())) {
      this.groups.set(key, value);
    }
  }

  get(animationGroupName: string) {
    const group = this.groups.get(animationGroupName);
    if (group) {
      group.imagePaths.forEach((imagePath) => {
        imageLoader.prepare(imagePath);
      });
    } else {
      console.warn(`Unknown animationGroupName: ${animationGroupName}`);
    }
    return group;
  }
}

export default new EntityAnimationManager();
