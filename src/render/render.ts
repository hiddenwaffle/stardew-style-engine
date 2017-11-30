import mapManager from 'src/session/map-manager';
import imageManager from 'src/session/image-manager';
import { ctxBack } from 'src/ui/elements';
import { TILE_SIZE } from 'src/constants';
import { Tileset } from 'src/domain/game-map';

function determineImageAndCoordinate(tilesets: Tileset[], tile: number): [HTMLImageElement, number, number] {
  let img: HTMLImageElement = null;
  let x = 0;
  let y = 0;
  for (const tileset of tilesets) {
    if (tile >= tileset.firstgid && tile < tileset.firstgid + tileset.tilecount) {
      img = imageManager.get(tileset.image);
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
    const { currentMap } = mapManager;
    if (currentMap) {
      for (const tileLayer of currentMap.tileLayers) {
        // TODO: Use player x, y coordinates to determine start and end ranges.
        let currentX = 0;
        let currentY = 0;
        for (const tile of tileLayer.tiles) {
          if (tile !== 0) {
            // TODO: Use tileLayer.x, tileLayer.y (offsets?) in offset calculation.
            // TODO: Use player x, y coordinates in offset calculation.
            const destinationX = currentX * TILE_SIZE;
            const destinationY = currentY * TILE_SIZE;
            // TODO: Check clipping

            const [img, sourceX, sourceY] = determineImageAndCoordinate(
              currentMap.tilesets,
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

export default new Render();
