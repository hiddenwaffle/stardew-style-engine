import { log } from 'src/log';
import { ScriptCall } from 'src/game-master/script-call';
import { Direction } from 'src/domain/direction';

const SOLID_DEFAULT = false;
const MAP_BOUNDARY_DEFAULT = false;
const CALLS_DEFAULT: () => TileTrackerCall[] = () => {
  return [];
};

class TileTrackerCall {
  readonly call: ScriptCall;
  readonly collisionCallInterval: number;

  constructor(call: ScriptCall, collisionCallInterval: number) {
    this.call = call;
    this.collisionCallInterval = collisionCallInterval;
  }
}

class TileTrack {
  readonly x: number;
  readonly y: number;
  solid: boolean;
  mapBoundary: boolean;
  calls: TileTrackerCall[];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.solid = SOLID_DEFAULT;
    this.mapBoundary = MAP_BOUNDARY_DEFAULT;
    this.calls = CALLS_DEFAULT();
  }
}

export class TileTracker {
  readonly xcenter: number;
  readonly ycenter: number;
  readonly tracks: TileTrack[][];

  constructor(x: number, y: number) {
    this.xcenter = x;
    this.ycenter = y;
    this.tracks = [
      [new TileTrack(x - 1, y - 1), new TileTrack(x    , y - 1), new TileTrack(x + 1, y - 1)], // [0][0]  [0][1]  [0][2]
      [new TileTrack(x - 1, y    ), new TileTrack(x    , y    ), new TileTrack(x + 1, y    )], // [1][0]  [1][1]* [1][2]
      [new TileTrack(x - 1, y + 1), new TileTrack(x    , y + 1), new TileTrack(x + 1, y + 1)], // [2][0]  [2][1]  [2][2]
    ];
  }

  isSolid(row: number, col: number): boolean {
    const track = this.getTrack(row, col);
    if (track) {
      return track.solid;
    }
    return SOLID_DEFAULT;
  }

  setSolid(row: number, col: number, solid: boolean) {
    const track = this.getTrack(row, col);
    if (track) {
      track.solid = solid;
    }
  }

  isMapBoundary(row: number, col: number): boolean {
    const track = this.getTrack(row, col);
    if (track) {
      return track.mapBoundary;
    }
    return MAP_BOUNDARY_DEFAULT;
  }

  setMapBoundary(row: number, col: number, mapBoundary: boolean) {
    const track = this.getTrack(row, col);
    if (track) {
      track.mapBoundary = mapBoundary;
    }
  }

  addCall(row: number, col: number, call: ScriptCall, collisionCallInterval: number) {
    const track = this.getTrack(row, col);
    if (track) {
      const trackerCall = new TileTrackerCall(call, collisionCallInterval);
      track.calls.push(trackerCall);
    }
  }

  /**
   * Disallow script calls due to diagonal blocking of two tiles.
   *
   * Example where player is X, moving down right, O is a tile with
   * a collision script, and # are solid tiles:
   *                     X#
   *                     #O
   * This check would prevent the O scripts from running
   */
  removeCornersBlockedByDiagonalSolid(direction: Direction) {
    if (direction === Direction.DownRight) {
      if (this.tracks[1][2].solid && this.tracks[2][1].solid) {
        this.tracks[2][2].calls = [];
      }
    } else if (direction === Direction.DownLeft) {
      if (this.tracks[1][0].solid && this.tracks[2][1].solid) {
        this.tracks[2][0].calls = [];
      }
    } else if (direction === Direction.UpLeft) {
      if (this.tracks[1][0].solid && this.tracks[0][1].solid) {
        this.tracks[0][0].calls = [];
      }
    } else if (direction === Direction.UpRight) {
      if (this.tracks[1][2].solid && this.tracks[0][1].solid) {
        this.tracks[0][2].calls = [];
      }
    }
  }

  // debug() {
  //   console.log('-----');
  //   console.log(this.tracks[0][0].solid, this.tracks[0][1].solid, this.tracks[0][2].solid);
  //   console.log(this.tracks[1][0].solid, this.tracks[1][1].solid, this.tracks[1][2].solid);
  //   console.log(this.tracks[2][0].solid, this.tracks[2][1].solid, this.tracks[2][2].solid);
  // }

  get allXY(): [number, number][] {
    const coordinates: [number, number][] = [];
    for (const row of this.tracks) {
      for (const track of row) {
        coordinates.push([track.x, track.y]);
      }
    }
    return coordinates;
  }

  get calls(): [ScriptCall, number][] {
    const calls: [ScriptCall, number][] = [];
    for (const row of this.tracks) {
      for (const track of row) {
        for (const trackerCall of track.calls) {
          calls.push([
            trackerCall.call,
            trackerCall.collisionCallInterval
          ]);
        }
      }
    }
    return calls;
  }

  private getTrack(rowIndex: number, colIndex: number): TileTrack {
    const row = this.tracks[rowIndex];
    if (row) {
      return row[colIndex] || null;
    }
    return null;
  }
}
