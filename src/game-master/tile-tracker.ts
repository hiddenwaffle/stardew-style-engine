import { log } from 'src/log';
import { ScriptCall } from 'src/game-master/script-call';
import { Direction } from 'src/domain/direction';

const SOLID_DEFAULT = false;
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
  solid: boolean;
  calls: TileTrackerCall[];

  constructor() {
    this.solid = SOLID_DEFAULT;
    this.calls = CALLS_DEFAULT();
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
    return SOLID_DEFAULT;
  }

  setSolid(row: number, col: number, solid: boolean) {
    const track = this.getTrack(row, col);
    if (track) {
      track.solid = solid;
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
