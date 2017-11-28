import { ctxBack } from 'src/ui/elements';
import { TILE_SIZE } from 'src/constants';

// TODO: Remove these two images.
import grass from './grass.png';
import townfolkF from './townfolk-f.png';

class Render {
  private tmp1: HTMLImageElement;
  private tmp1Loaded: boolean;
  private tmp2: HTMLImageElement;
  private tmp2Loaded: boolean;

  constructor() {
    this.tmp1Loaded = false;
    this.tmp2Loaded = false;
  }

  start() {
    {
      this.tmp1 = new Image();
      this.tmp1.onload = () => {
        console.log('loaded tmp1');
        this.tmp1Loaded = true;
      };
      console.log('grass: ', grass);
      this.tmp1.src = grass;
    }
    {
      this.tmp2 = new Image();
      this.tmp2.onload = () => {
        console.log('loaded tmp2');
        this.tmp2Loaded = true;
      };
      console.log('townfolkF: ', townfolkF);
      this.tmp2.src = townfolkF;
    }
  }

  stop() {
    //
  }

  step() {
    if (this.tmp1Loaded) {
      for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 17; x++) {
          ctxBack.drawImage(this.tmp1, x * TILE_SIZE, y * TILE_SIZE);
        }
      }
    }
    if (this.tmp2Loaded) {
      ctxBack.drawImage(this.tmp2, 8 * TILE_SIZE, 6 * TILE_SIZE);
    }
  }
}

export default new Render();
