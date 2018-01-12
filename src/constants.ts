/**
 * Field tiles are 16x16.
 */
export const DEFAULT_FIELD_TILE_SIZE = 16;

/**
 * Upscaling x4 to allow for smoother scrolling.
 */
export const UPSCALE = 4;

export const TARGET_FIELD_TILE_SIZE = DEFAULT_FIELD_TILE_SIZE * UPSCALE;

export const FIELD_WIDTH = 17;
export const FIELD_HEIGHT = 13;
export const FIELD_TARGET_WIDTH = FIELD_WIDTH * TARGET_FIELD_TILE_SIZE;
export const FIELD_TARGET_HEIGHT = (FIELD_HEIGHT + 1) * TARGET_FIELD_TILE_SIZE;

export const CONTAINER_ASPECT_WIDTH = 16;
export const CONTAINER_ASPECT_HEIGHT = 9;

/**
 * Just "looks good" in Chrome on Mac.
 */
export const FONT_BASE_SIZE = 5.25 * UPSCALE;

/**
 * This (and the constnats defined below it) must be in sync.
 */
export const SAVE_VERSION = 4;
export const SAVE_WORLD_KEY = 'simplicity-world';
export const SAVE_STATE_KEY = 'simplicity-state';
export const ALLOWED_LOCAL_STORAGE_KEYS = [
  SAVE_WORLD_KEY,
  SAVE_STATE_KEY,
  'loglevel:webpack-dev-server',  // Webpack
];

export const PLAYER_ENTITY_NAME = '@player';
