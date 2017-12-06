import { Sheet, default as imageLoader } from 'src/session/image-loader';
import {
  ctxBack,
  canvasBack
} from 'src/ui/elements';
import {
  DEFAULT_FIELD_TILE_SIZE,
  TARGET_FIELD_TILE_SIZE,
  FIELD_WIDTH,
  FIELD_HEIGHT,
  UPSCALE
} from 'src/constants';
import Tileset from 'src/domain/tileset';
import World from 'src/domain/world';

function determineImageAndCoordinate(tilesets: Tileset[], tile: number): [Sheet, number, number] {
  let sheet: Sheet = null;
  let x = 0;
  let y = 0;
  for (const tileset of tilesets) {
    if (tile >= tileset.firstgid && tile < tileset.firstgid + tileset.tilecount) {
      sheet = imageLoader.get(tileset.image);
      if (sheet) {
        x = sheet.config.tileWidth * ((tile - tileset.firstgid) % tileset.columns);
        y = sheet.config.tileHeight * (Math.floor((tile - tileset.firstgid) / tileset.columns));
      }
      break;
    }
  }
  return [sheet, x, y];
}

class Render {
  start() {
    //
  }

  stop() {
    //
  }

  step(world: World) {
    ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
    if (world) {
      const { staticMap, player } = world;
      if (staticMap) {
        for (const tileLayer of staticMap.tileLayers) {
          // TODO: Use player x, y coordinates to determine start and end ranges.
          let currentX = 0;
          let currentY = 0;
          for (const tile of tileLayer.tiles) {
            if (tile !== 0) {
              const [sheet, sourceX, sourceY] = determineImageAndCoordinate(
                staticMap.tilesets,
                tile
              );
              if (sheet) {
                const originalTileWidth = DEFAULT_FIELD_TILE_SIZE;
                const originalTileHeight = DEFAULT_FIELD_TILE_SIZE;

                // Offset all by the size of tiles
                let destinationX = currentX * TARGET_FIELD_TILE_SIZE;
                let destinationY = currentY * TARGET_FIELD_TILE_SIZE;

                // Offset by the position of the player, scaled by the size of field tiles
                destinationX -= player.x;
                destinationY -= player.y;

                // Offset so that the player is in the center of the screen
                destinationX += (FIELD_WIDTH * TARGET_FIELD_TILE_SIZE) / 2;
                destinationY += (FIELD_HEIGHT * TARGET_FIELD_TILE_SIZE) / 2;

                ctxBack.drawImage(
                  sheet.image,
                  sourceX,
                  sourceY,
                  originalTileWidth,
                  originalTileHeight,
                  destinationX,
                  destinationY,
                  TARGET_FIELD_TILE_SIZE,
                  TARGET_FIELD_TILE_SIZE
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

        world.entities.forEach((entity) => {
          const sheet = imageLoader.get('antifarea');
          if (sheet) {
            const originalTileWidth = sheet.config.tileWidth;
            const originalTileHeight = sheet.config.tileHeight;
            const targetTileWidth = originalTileWidth * UPSCALE;
            const targetTileHeight = originalTileHeight * UPSCALE;

            let destinationX = entity.x - player.x;
            let destinationY = entity.y - player.y;

            // Offset so that the player is in the center of the screen
            destinationX += (FIELD_WIDTH * TARGET_FIELD_TILE_SIZE) / 2;
            destinationY += (FIELD_HEIGHT * TARGET_FIELD_TILE_SIZE) / 2;

            ctxBack.drawImage(
              sheet.image,
              0 * originalTileWidth,
              44 * originalTileHeight,
              originalTileWidth,
              originalTileHeight,
              destinationX,
              destinationY,
              targetTileWidth,
              targetTileHeight
            );
          }
        });
      }
    }
  }
}

export default new Render();
