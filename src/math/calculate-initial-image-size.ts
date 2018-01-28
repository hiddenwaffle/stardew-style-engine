import { EntityAnimationGroup } from 'src/domain/entity-animation';
import { UPSCALE } from 'src/constants';
import { imageLoader } from 'src/session/image-loader';

/**
 * This function exists to be a really roundabout way
 * of estimating the image size of an entity.
 *
 * TODO: Maybe use the "defaultTile" if given?
 */
export function calculateInitialImageSize(
  group: EntityAnimationGroup,
): [number, number] {
  if (!group) {
    return [null, null];
  }

  const imagePath = group.imagePaths[0];
  if (!imagePath) {
    return [null, null];
  }

  const config = imageLoader.getConfig(imagePath);
  if (!config) {
    return [null, null];
  }

  return [
    config.tileWidth  * UPSCALE,
    config.tileHeight * UPSCALE,
  ];
}
