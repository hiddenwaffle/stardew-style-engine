import { log } from 'src/log';
import { onlyFilename } from 'src/utility/file-utility';
import { DEFAULT_FIELD_TILE_SIZE } from 'src/constants';

import player0    from 'src/external/image/DawnLike/Characters/Player0.png';
import player1    from 'src/external/image/DawnLike/Characters/Player1.png';

import scroll     from 'src/external/image/DawnLike/Items/Scroll.png';

import decor0     from 'src/external/image/DawnLike/Objects/Decor0.png';
import decor1     from 'src/external/image/DawnLike/Objects/Decor1.png';
import door0      from 'src/external/image/DawnLike/Objects/Door0.png';
import door1      from 'src/external/image/DawnLike/Objects/Door1.png';
import effect0    from 'src/external/image/DawnLike/Objects/Effect0.png';
import effect1    from 'src/external/image/DawnLike/Objects/Effect1.png';
import fence      from 'src/external/image/DawnLike/Objects/Fence.png';
import floor      from 'src/external/image/DawnLike/Objects/Floor.png';
import ground0    from 'src/external/image/DawnLike/Objects/Ground0.png';
import ground1    from 'src/external/image/DawnLike/Objects/Ground1.png';
import hill0      from 'src/external/image/DawnLike/Objects/Hill0.png';
import hill1      from 'src/external/image/DawnLike/Objects/Hill1.png';
import map0       from 'src/external/image/DawnLike/Objects/Map0.png';
import map1       from 'src/external/image/DawnLike/Objects/Map1.png';
import ore0       from 'src/external/image/DawnLike/Objects/Ore0.png';
import ore1       from 'src/external/image/DawnLike/Objects/Ore1.png';
import pit0       from 'src/external/image/DawnLike/Objects/Pit0.png';
import pit1       from 'src/external/image/DawnLike/Objects/Pit1.png';
import tile       from 'src/external/image/DawnLike/Objects/Tile.png';
import trap0      from 'src/external/image/DawnLike/Objects/Trap0.png';
import trap1      from 'src/external/image/DawnLike/Objects/Trap1.png';
import tree0      from 'src/external/image/DawnLike/Objects/Tree0.png';
import tree1      from 'src/external/image/DawnLike/Objects/Tree1.png';
import wall       from 'src/external/image/DawnLike/Objects/Wall.png';

import antifarea  from 'src/external/image/antifarea_18x20chars.png';

import redshrike  from 'src/external/image/redshrike.png';

import metacolors from 'src/external/image/metacolors.png';

export class SheetConfig {
  readonly path: string;
  readonly tileWidth: number;
  readonly tileHeight: number;

  constructor(path: string, tileWidth: number, tileHeight: number) {
    this.path = path;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }
}

function genConfig(
  path: string,
  tileWidth: number = DEFAULT_FIELD_TILE_SIZE,
  tileHeight: number = DEFAULT_FIELD_TILE_SIZE,
) {
  return new SheetConfig(path, tileWidth, tileHeight);
}

export class Sheet {
  readonly config: SheetConfig;
  readonly image: HTMLImageElement;

  constructor(config: SheetConfig, image: HTMLImageElement) {
    this.config = config;
    this.image = image;
  }
}

class ImageLoader {
  private readonly sheets: Map<string, Sheet>;
  private readonly configs: Map<string, SheetConfig>;

  constructor() {
    this.sheets = new Map();
    this.configs = new Map();

    this.configs.set('Player0.png', genConfig(player0));
    this.configs.set('Player1.png', genConfig(player1));

    this.configs.set('Scroll.png', genConfig(scroll));

    this.configs.set('Decor0.png',  genConfig(decor0));
    this.configs.set('Decor1.png',  genConfig(decor1));
    this.configs.set('Door0.png',   genConfig(door0));
    this.configs.set('Door1.png',   genConfig(door1));
    this.configs.set('Effect0.png', genConfig(effect0));
    this.configs.set('Effect1.png', genConfig(effect1));
    this.configs.set('Fence.png',   genConfig(fence));
    this.configs.set('Floor.png',   genConfig(floor));
    this.configs.set('Ground0.png', genConfig(ground0));
    this.configs.set('Ground1.png', genConfig(ground1));
    this.configs.set('Hill0.png',   genConfig(hill0));
    this.configs.set('Hill1.png',   genConfig(hill1));
    this.configs.set('Map0.png',    genConfig(map0));
    this.configs.set('Map1.png',    genConfig(map1));
    this.configs.set('Ore0.png',    genConfig(ore0));
    this.configs.set('Ore1.png',    genConfig(ore1));
    this.configs.set('Pit0.png',    genConfig(pit0));
    this.configs.set('Pit1.png',    genConfig(pit1));
    this.configs.set('Tile.png',    genConfig(tile));
    this.configs.set('Trap0.png',   genConfig(trap0));
    this.configs.set('Trap1.png',   genConfig(trap1));
    this.configs.set('Tree0.png',   genConfig(tree0));
    this.configs.set('Tree1.png',   genConfig(tree1));
    this.configs.set('Wall.png',    genConfig(wall));

    this.configs.set('antifarea_18x20chars.png',   genConfig(antifarea, 18, 20));

    this.configs.set('redshrike.png', genConfig(redshrike));

    this.configs.set('metacolors.png', genConfig(metacolors));
  }

  // prepare(rawImagePath: string) {
  //   const filename = onlyFilename(rawImagePath);
  //   if (this.sheets.has(filename)) {
  //     // Nothing to do
  //   } else {
  //     const path = this.configs.get(filename);
  //     if (path) {
  //       this.retrieve(filename, path);
  //     } else {
  //       log('info', 'ImageLoader#prepare() path not found for:', filename);
  //     }
  //   }
  // }

  async prepare(rawImagePath: string) {
    const filename = onlyFilename(rawImagePath);
    if (this.sheets.has(filename)) {
      // Nothing to do
    } else {
      const path = this.configs.get(filename);
      if (path) {
        await this.retrieve(filename, path);
      } else {
        log('warn', 'ImageLoader#prepare() path not found for:', filename);
      }
    }
  }

  async prepareAll(rawImagePaths: string[]) {
    const tasks = rawImagePaths.map((rawImagePath) => {
      return this.prepare(rawImagePath);
    });
    await Promise.all(tasks);
  }

  get(rawImagePath: string): Sheet {
    const filename = onlyFilename(rawImagePath);
    return this.sheets.get(filename);
  }

  getConfig(rawImagePath: string): SheetConfig {
    const filename = onlyFilename(rawImagePath);
    return this.configs.get(filename);
  }

  private retrieve(filename: string, config: SheetConfig): Promise<{}> {
    return new Promise((resolve, reject) => {
      const image = <HTMLImageElement> document.createElement('img');
      image.onload = () => {
        const sheet = new Sheet(config, image);
        this.sheets.set(filename, sheet);
        resolve();
      };
      image.onerror = (e) => {
        reject(e);
      };
      image.src = config.path;
    });
  }
}

export const imageLoader = new ImageLoader();
