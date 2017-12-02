import stageManager from 'src/session/stage-manager';
import imageLoader from 'src/session/image-loader';
import {
  ctxBack,
  canvasBack
} from 'src/ui/elements';
import {
  TILE_SIZE,
  FIELD_WIDTH,
  FIELD_HEIGHT
} from 'src/constants';
import Tileset from 'src/domain/tileset';

function determineImageAndCoordinate(tilesets: Tileset[], tile: number): [HTMLImageElement, number, number] {
  let img: HTMLImageElement = null;
  let x = 0;
  let y = 0;
  for (const tileset of tilesets) {
    if (tile >= tileset.firstgid && tile < tileset.firstgid + tileset.tilecount) {
      img = imageLoader.get(tileset.image);
      x = TILE_SIZE * ((tile - tileset.firstgid) % tileset.columns);
      y = TILE_SIZE * (Math.floor((tile - tileset.firstgid) / tileset.columns));
      break;
    }
  }
  return [img, x, y];
}

class Render {
  start() {
    //
  }

  stop() {
    //
  }

  step() {
    ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
    const { world } = stageManager;
    if (world) {
      const { staticMap, player } = world;
      if (staticMap) {
        for (const tileLayer of staticMap.tileLayers) {
          // TODO: Use player x, y coordinates to determine start and end ranges.
          let currentX = 0;
          let currentY = 0;
          for (const tile of tileLayer.tiles) {
            if (tile !== 0) {
              // TODO: Use tileLayer.x, tileLayer.y (offsets?) in offset calculation.

              // Use player x, y coordinates in offset calculation.
              // TODO: LOL organize these equations better.
              const offsetAvatarAtCenterX = Math.ceil(FIELD_WIDTH * TILE_SIZE) / 2 - player.x;
              const offsetAvatarAtCenterY = Math.ceil(FIELD_HEIGHT * TILE_SIZE) / 2 - player.y;

              const destinationX = currentX * TILE_SIZE + offsetAvatarAtCenterX;
              const destinationY = currentY * TILE_SIZE + offsetAvatarAtCenterY;
              // TODO: Check clipping

              const [img, sourceX, sourceY] = determineImageAndCoordinate(
                staticMap.tilesets,
                tile
              );

              if (img) {
                ctxBack.drawImage(
                  img,
                  sourceX,
                  sourceY,
                  TILE_SIZE,
                  TILE_SIZE,
                  destinationX,
                  destinationY,
                  TILE_SIZE,
                  TILE_SIZE
                );
              }
            }

            // Advance to next tile position
            currentX += 1;
            if (currentX >= tileLayer.width) {
              currentX = 0;
              currentY += 1;
            }
          }
        }
      }
    }
  }
}

export default new Render();
