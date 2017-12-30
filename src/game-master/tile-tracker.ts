const NON_ZERO_DEFAULT = false;
const SOLID_DEFAULT = false;
const MAP_BOUNDARY_DEFAULT = false;

class TileTrack {
  nonZero: boolean;
  solid: boolean;
  mapBoundary: boolean;

  constructor() {
    this.reset();
  }

  reset() {
    this.nonZero = NON_ZERO_DEFAULT;
    this.solid = SOLID_DEFAULT;
    this.mapBoundary = MAP_BOUNDARY_DEFAULT;
  }
}

/**
 * Keeps track of the properties of a 3x3 tile grid.
 *
 * Example of solid property:
 *  [false, false, false], // [0][0]  [0][1]  [0][2]
 *  [false, false, false], // [1][0]  [1][1]* [1][2]   *entity is in the center at [1][1]
 *  [false, false, false], // [2][0]  [2][1]  [2][2]
 */
export class TileTracker {
  private tracks: TileTrack[][];

  constructor() {
    this.tracks = [];
    this.tracks.push([new TileTrack(), new TileTrack(), new TileTrack()]);
    this.tracks.push([new TileTrack(), new TileTrack(), new TileTrack()]);
    this.tracks.push([new TileTrack(), new TileTrack(), new TileTrack()]);
  }

  isNonZero(row: number, col: number): boolean {
    const track = this.trackAt(row, col);
    if (track) {
      return track.nonZero;
    }
    return NON_ZERO_DEFAULT;
  }

  setNonZero(row: number, col: number, nonZero: boolean) {
    const track = this.trackAt(row, col);
    if (track) {
      track.nonZero = nonZero;
    }
  }

  isSolid(row: number, col: number): boolean {
    const track = this.trackAt(row, col);
    if (track) {
      return track.solid;
    }
    return SOLID_DEFAULT;
  }

  setSolid(row: number, col: number, solid: boolean) {
    const track = this.trackAt(row, col);
    if (track) {
      track.solid = solid;
    }
  }

  isMapBoundary(row: number, col: number): boolean {
    const track = this.trackAt(row, col);
    if (track) {
      return track.mapBoundary;
    }
    return MAP_BOUNDARY_DEFAULT;
  }

  setMapBoundary(row: number, col: number, mapBoundary: boolean) {
    const track = this.trackAt(row, col);
    if (track) {
      track.mapBoundary = mapBoundary;
    }
  }

  reset() {
    for (const row of this.tracks) {
      for (const track of row) {
        track.reset();
      }
    }
  }

  /**
   * For safe 2D array access.
   */
  private trackAt(rowIndex: number, colIndex: number): TileTrack {
    const row = this.tracks[rowIndex];
    if (row) {
      const track = row[colIndex];
      if (track) {
        return track;
      }
    }
    return null;
  }
}

export function calculateTilesToCheck(xtile: number, ytile: number): number[][] {
  return [
    [xtile - 1, ytile - 1], // Top Left       0
    [xtile,     ytile - 1], // Top Middle     1
    [xtile + 1, ytile - 1], // Top Right      2
    [xtile - 1, ytile    ], // Middle Left    3
    [xtile    , ytile    ], // Middle         4 (The anchor tile)
    [xtile + 1, ytile    ], // Middle Right   5
    [xtile - 1, ytile + 1], // Bottom Left    6
    [xtile    , ytile + 1], // Bottom Middle  7
    [xtile + 1, ytile + 1], // Bottom Right   8
  ];
}

export function convertXYToIndex(x: number, y: number, width: number): number {
  return x + (y * width);
}
