import { log } from 'src/log';
import { onlyFilename } from 'src/utility/file-utility';
import {
  Sheet,
  SheetConfig,
} from 'src/render/sheet';
import { configs } from 'src/external/meta/image-meta';

class ImageLoader {
  private readonly sheets: Map<string, Sheet>;

  constructor() {
    this.sheets = new Map();
  }

  async prepare(rawImagePath: string) {
    const filename = onlyFilename(rawImagePath);
    if (this.sheets.has(filename)) {
      // Nothing to do
    } else {
      const path = configs.get(filename);
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
    return configs.get(filename);
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
