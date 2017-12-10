import { Sheet, default as imageLoader } from 'src/session/image-loader';
import {
  ctxBack,
  canvasBack
} from 'src/ui/elements';
import {
  TARGET_FIELD_TILE_SIZE,
  FIELD_TARGET_WIDTH,
  FIELD_TARGET_HEIGHT,
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
                const originalTileWidth = sheet.config.tileWidth;
                const originalTileHeight = sheet.config.tileHeight;
                const targetTileWidth = originalTileWidth * UPSCALE;
                const targetTileHeight = originalTileHeight * UPSCALE;

                // Offset all by the size of tiles
                let destinationX = currentX * TARGET_FIELD_TILE_SIZE;
                let destinationY = currentY * TARGET_FIELD_TILE_SIZE;

                // Offset by the position of the player, scaled by the size of field tiles
                destinationX -= player.x;
                destinationY -= player.y;

                // Offset so that the player is in the center of the screen
                destinationX += FIELD_TARGET_WIDTH / 2;
                destinationY += FIELD_TARGET_HEIGHT / 2;

                ctxBack.drawImage(
                  sheet.image,
                  sourceX,
                  sourceY,
                  originalTileWidth,
                  originalTileHeight,
                  destinationX,
                  destinationY,
                  targetTileWidth,
                  targetTileHeight
                );

                // TODO: Remove this debug
                ctxBack.strokeStyle = 'pink';
                ctxBack.strokeRect(destinationX, destinationY, TARGET_FIELD_TILE_SIZE, TARGET_FIELD_TILE_SIZE);
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

        // TODO: Use insertion sort instead of default sort?
        world.entities.sort((a, b) => {
          return a.y - b.y;
        });

        // Entity coordinates are already upscaled
        world.entities.forEach((entity) => {
          const sheet = imageLoader.get('antifarea');
          if (sheet) {
            const originalTileWidth = sheet.config.tileWidth;
            const originalTileHeight = sheet.config.tileHeight;
            const targetTileWidth = originalTileWidth * UPSCALE;
            const targetTileHeight = originalTileHeight * UPSCALE;

            const destinationX = entity.x - player.x;
            const destinationY = entity.y - player.y;

            // Offset so that it centers horizontally and aligns to the bottom
            const destination2X = destinationX - targetTileWidth / 2;
            const destination2Y = destinationY - targetTileHeight;

            // Offset so that the player is in the center of the screen
            const destination3X = destination2X + FIELD_TARGET_WIDTH  / 2;
            const destination3Y = destination2Y + FIELD_TARGET_HEIGHT / 2;

            ctxBack.drawImage(
              sheet.image,
              0 * originalTileWidth,
              44 * originalTileHeight,
              originalTileWidth,
              originalTileHeight,
              destination3X,
              destination3Y,
              targetTileWidth,
              targetTileHeight
            );

            // TODO: Remove this debug
            ctxBack.strokeStyle = 'yellow';
            ctxBack.strokeRect(destination3X, destination3Y, targetTileWidth, targetTileHeight);

            // TODO: Remove this debug
            ctxBack.strokeStyle = 'cyan';
            const destinationX4 = destinationX - entity.boundingWidth  / 2;
            const destinationY4 = destinationY - entity.boundingHeight;
            const destination5X = destinationX4 + FIELD_TARGET_WIDTH  / 2;
            const destination5Y = destinationY4 + FIELD_TARGET_HEIGHT / 2;
            ctxBack.strokeRect(destination5X, destination5Y, entity.boundingWidth, entity.boundingHeight);
          }
        });
      }
    }
  }
}

export default new Render();
