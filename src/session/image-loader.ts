import decor0   from 'src/external/DawnLike/Objects/Decor0.png';
import decor1   from 'src/external/DawnLike/Objects/Decor1.png';
import door0    from 'src/external/DawnLike/Objects/Door0.png';
import door1    from 'src/external/DawnLike/Objects/Door1.png';
import effect0  from 'src/external/DawnLike/Objects/Effect0.png';
import effect1  from 'src/external/DawnLike/Objects/Effect1.png';
import fence    from 'src/external/DawnLike/Objects/Fence.png';
import floor    from 'src/external/DawnLike/Objects/Floor.png';
import ground0  from 'src/external/DawnLike/Objects/Ground0.png';
import ground1  from 'src/external/DawnLike/Objects/Ground1.png';
import hill0    from 'src/external/DawnLike/Objects/Hill0.png';
import hill1    from 'src/external/DawnLike/Objects/Hill1.png';
import map0     from 'src/external/DawnLike/Objects/Map0.png';
import map1     from 'src/external/DawnLike/Objects/Map1.png';
import ore0     from 'src/external/DawnLike/Objects/Ore0.png';
import ore1     from 'src/external/DawnLike/Objects/Ore1.png';
import pit0     from 'src/external/DawnLike/Objects/Pit0.png';
import pit1     from 'src/external/DawnLike/Objects/Pit1.png';
import tile     from 'src/external/DawnLike/Objects/Tile.png';
import trap0    from 'src/external/DawnLike/Objects/Trap0.png';
import trap1    from 'src/external/DawnLike/Objects/Trap1.png';
import tree0    from 'src/external/DawnLike/Objects/Tree0.png';
import tree1    from 'src/external/DawnLike/Objects/Tree1.png';
import wall     from 'src/external/DawnLike/Objects/Wall.png';

function onlyFilename(path: string) {
  return path.replace(/.*\//, '');
}

class TileManager {
  private readonly cache: Map<string, HTMLImageElement>;
  private readonly paths: Map<string, string>;

  constructor() {
    this.cache = new Map();

    this.paths = new Map();
    this.paths.set('Decor0.png',  decor0);
    this.paths.set('Decor1.png',  decor1);
    this.paths.set('Door0.png',   door0);
    this.paths.set('Door1.png',   door1);
    this.paths.set('Effect0.png', effect0);
    this.paths.set('Effect1.png', effect1);
    this.paths.set('Fence.png',   fence);
    this.paths.set('Floor.png',   floor);
    this.paths.set('Ground0.png', ground0);
    this.paths.set('Ground1.png', ground1);
    this.paths.set('Hill0.png',   hill0);
    this.paths.set('Hill1.png',   hill1);
    this.paths.set('Map0.png',    map0);
    this.paths.set('Map1.png',    map1);
    this.paths.set('Ore0.png',    ore0);
    this.paths.set('Ore1.png',    ore1);
    this.paths.set('Pit0.png',    pit0);
    this.paths.set('Pit1.png',    pit1);
    this.paths.set('Tile.png',    tile);
    this.paths.set('Trap0.png',   trap0);
    this.paths.set('Trap1.png',   trap1);
    this.paths.set('Tree0.png',   tree0);
    this.paths.set('Tree1.png',   tree1);
    this.paths.set('Wall.png',    wall);
  }

  prepare(rawImagePath: string) {
    const filename = onlyFilename(rawImagePath);
    if (this.cache.has(filename)) {
      // Nothing to do
    } else {
      const path = this.paths.get(filename);
      if (path) {
        this.retrieve(filename, path);
      } else {
        console.log('TileManager#constructor() path not found for:', filename);
      }
    }
  }

  get(rawImagePath: string): HTMLImageElement {
    const filename = onlyFilename(rawImagePath);
    return this.cache.get(filename);
  }

  private retrieve(filename: string, path: string) {
    const img = <HTMLImageElement> document.createElement('img');
    img.onload = () => {
      this.cache.set(filename, img);
    };
    // TODO: Handle errors
    img.src = path;
  }
}

export default new TileManager();
