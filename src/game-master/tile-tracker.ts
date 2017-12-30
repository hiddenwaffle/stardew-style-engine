class TileTrack {
  solid: boolean;

  constructor() {
    this.solid = false;
  }
}

export class TileTracker {
  tracks: TileTrack[][];
  constructor() {
    this.tracks = [
      [new TileTrack(), new TileTrack(), new TileTrack()], // [0][0]  [0][1]  [0][2]
      [new TileTrack(), new TileTrack(), new TileTrack()], // [1][0]  [1][1]* [1][2]   *entity is in the center at [1][1]
      [new TileTrack(), new TileTrack(), new TileTrack()], // [2][0]  [2][1]  [2][2]
    ];
  }

  isSolid(row: number, col: number): boolean {
    const track = this.getTrack(row, col);
    if (track) {
      return track.solid;
    }
    return false; // TODO: Make a default value here.
  }

  setSolid(row: number, col: number, solid: boolean) {
    const track = this.getTrack(row, col);
    if (track) {
      track.solid = solid;
    }
  }

  private getTrack(rowIndex: number, colIndex: number): TileTrack {
    const row = this.tracks[rowIndex];
    if (row) {
      return row[colIndex];
    }
    return null;
  }
}
