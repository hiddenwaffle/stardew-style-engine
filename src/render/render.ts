import imageLoader from 'src/session/image-loader';
import {
  ctxBack,
  canvasBack
} from 'src/ui/elements';
import {
  ORIGINAL_FIELD_TILE_SIZE,
  TARGET_FIELD_TILE_SIZE,
  FIELD_WIDTH,
  FIELD_HEIGHT,
  UPSCALE
} from 'src/constants';
import Tileset from 'src/domain/tileset';
import World from 'src/domain/world';

function determineImageAndCoordinate(tilesets: Tileset[], tile: number): [HTMLImageElement, number, number] {
  let img: HTMLImageElement = null;
  let x = 0;
  let y = 0;
  for (const tileset of tilesets) {
    if (tile >= tileset.firstgid && tile < tileset.firstgid + tileset.tilecount) {
      img = imageLoader.get(tileset.image);
      x = ORIGINAL_FIELD_TILE_SIZE * ((tile - tileset.firstgid) % tileset.columns);
      y = ORIGINAL_FIELD_TILE_SIZE * (Math.floor((tile - tileset.firstgid) / tileset.columns));
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
              const [img, sourceX, sourceY] = determineImageAndCoordinate(
                staticMap.tilesets,
                tile
              );
              // Scale by the size of tiles
              let destinationX = currentX * TARGET_FIELD_TILE_SIZE;
              let destinationY = currentY * TARGET_FIELD_TILE_SIZE;

              // Offset by the position of the player, scaled by the size of field tiles
              destinationX -= player.x * TARGET_FIELD_TILE_SIZE;
              destinationY -= player.y * TARGET_FIELD_TILE_SIZE;

              // Offset so that the player is in the center of the screen
              destinationX += (FIELD_WIDTH * TARGET_FIELD_TILE_SIZE) / 2;
              destinationY += (FIELD_HEIGHT * TARGET_FIELD_TILE_SIZE) / 2;

              // Convert to integers
              destinationX = Math.floor(destinationX);
              destinationY = Math.floor(destinationY);

              if (img) {
                ctxBack.drawImage(
                  img,
                  sourceX,
                  sourceY,
                  ORIGINAL_FIELD_TILE_SIZE,
                  ORIGINAL_FIELD_TILE_SIZE,
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
          const img = imageLoader.get('antifarea');

          const originalTileWidth = 18
          const originalTileHeight = 20
          const targetTileWidth = originalTileWidth * UPSCALE;
          const targetTileHeight = originalTileHeight * UPSCALE;

          if (img) {
            // Scale by the size of tiles
            let destinationX = entity.x * TARGET_FIELD_TILE_SIZE;
            let destinationY = entity.y * TARGET_FIELD_TILE_SIZE;

            // Offset by the position of the player, scaled by the size of field tiles
            destinationX -= (player.x * TARGET_FIELD_TILE_SIZE);
            destinationY -= (player.y * TARGET_FIELD_TILE_SIZE);

            // Offset so that the player is in the center of the screen
            destinationX += (FIELD_WIDTH * TARGET_FIELD_TILE_SIZE) / 2;
            destinationY += (FIELD_HEIGHT * TARGET_FIELD_TILE_SIZE) / 2;

            // Convert to integers
            destinationX = Math.floor(destinationX);
            destinationY = Math.floor(destinationY);

            ctxBack.drawImage(
              img,
              0 * 18,
              44 * 20,
              originalTileWidth,
              originalTileHeight,
              destinationX,
              destinationY,
              targetTileWidth,
              TARGET_FIELD_TILE_SIZE + 16
            );
          }
        });
      }
    }
  }
}

export default new Render();
