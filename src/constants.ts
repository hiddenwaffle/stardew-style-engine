/**
 * Most tiles are 16x16.
 */
export const ORIGINAL_TILE_SIZE = 16;
/**
 * Upscaling x4 to allow for smoother scrolling.
 */
export const TARGET_TILE_SIZE = 64;

export const FIELD_WIDTH = 17;
export const FIELD_HEIGHT = 13;
export const FIELD_LOGICAL_WIDTH = FIELD_WIDTH * TARGET_TILE_SIZE;
export const FIELD_LOGICAL_HEIGHT = (FIELD_HEIGHT + 1) * TARGET_TILE_SIZE;

export const CONTAINER_ASPECT_WIDTH = 16;
export const CONTAINER_ASPECT_HEIGHT = 9;

/**
 * Just "looks good" in Chrome on Mac.
 */
export const FONT_BASE_SIZE = 21;

export const SAVE_KEY = 'simplicity';
