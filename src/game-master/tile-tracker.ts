import { log } from 'src/log';
import { ScriptCall } from 'src/game-master/script-call';
import {
  determineDxDy,
  Direction,
} from 'src/domain/direction';

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

  addCall(call: ScriptCall, collisionCallInterval: number) {
    const trackerCall = new TileTrackerCall(call, collisionCallInterval);
    this.calls.push(trackerCall);
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

  /**
   * TODO: Replace this with something else. Use a Direction from center?
   */
  isSolid(row: number, col: number): boolean {
    const track = this.getTrackOld(row, col);
    if (track) {
      return track.solid;
    }
    return SOLID_DEFAULT;
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

  determineOpenDirections(): Direction[] {
    const openDirections: Direction[] = [];
    if (!this.getTrackOld(0, 0).solid &&
        !this.getTrackOld(1, 0).solid &&
        !this.getTrackOld(0, 1).solid) { openDirections.push(Direction.UpLeft); }
    if (!this.getTrackOld(0, 1).solid) { openDirections.push(Direction.Up); }
    if (!this.getTrackOld(0, 2).solid &&
        !this.getTrackOld(0, 1).solid &&
        !this.getTrackOld(1, 2).solid) { openDirections.push(Direction.UpRight); }
    if (!this.getTrackOld(1, 0).solid) { openDirections.push(Direction.Left); }
    if (!this.getTrackOld(1, 2).solid) { openDirections.push(Direction.Right); }
    if (!this.getTrackOld(2, 0).solid &&
        !this.getTrackOld(1, 0).solid &&
        !this.getTrackOld(2, 1).solid) { openDirections.push(Direction.DownLeft); }
    if (!this.getTrackOld(2, 1).solid) { openDirections.push(Direction.Down) ; }
    if (!this.getTrackOld(2, 2).solid &&
        !this.getTrackOld(2, 1).solid &&
        !this.getTrackOld(1, 2).solid) { openDirections.push(Direction.DownRight); }
    return openDirections;
  }

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

  get allTracks(): TileTrack[] {
    const tracks: TileTrack[] = [];
    for (const row of this.tracks) {
      for (const track of row) {
        tracks.push(track);
      }
    }
    return tracks;
  }

  /**
   * @deprecated
   */
  private getTrackOld(rowIndex: number, colIndex: number): TileTrack {
    const row = this.tracks[rowIndex];
    if (row) {
      return row[colIndex] || null;
    }
    return null;
  }

  private getTrack(direction: Direction): TileTrack {
    const [dx, dy] = determineDxDy(direction);
    const rowIndex = dy + 1;
    const colIndex = dx + 1;
    const row = this.tracks[rowIndex];
    if (row) {
      return row[colIndex] || null;
    }
    return null;
  }
}
