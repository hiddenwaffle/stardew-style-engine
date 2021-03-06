import {
  Direction,
} from 'src/domain/direction';

/**
 * General purpose object for keeping track of the properties
 * of a 3x3 tile grid, with the given (x, y) being the center
 * tile.
 *
 * Different methods use it for different things.
 */
class TileTrack {
  readonly x: number;
  readonly y: number;
  solid: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.solid = false;
  }
}

export class TileTracker {
  readonly xcenter: number;
  readonly ycenter: number;
  private readonly tracks: Map<Direction, TileTrack>;

  constructor(x: number, y: number) {
    this.xcenter = x;
    this.ycenter = y;
    {
      this.tracks = new Map();
      this.tracks.set(Direction.UpLeft,     new TileTrack(x - 1, y - 1));
      this.tracks.set(Direction.Up,         new TileTrack(x    , y - 1));
      this.tracks.set(Direction.UpRight,    new TileTrack(x + 1, y - 1));
      this.tracks.set(Direction.Left,       new TileTrack(x - 1, y    ));
      this.tracks.set(Direction.None,       new TileTrack(x    , y    ));
      this.tracks.set(Direction.Right,      new TileTrack(x + 1, y    ));
      this.tracks.set(Direction.DownLeft,   new TileTrack(x - 1, y + 1));
      this.tracks.set(Direction.Down,       new TileTrack(x    , y + 1));
      this.tracks.set(Direction.DownRight,  new TileTrack(x + 1, y + 1));
    }
  }

  getTrack(direction: Direction): TileTrack {
    return this.tracks.get(direction);
  }

  /**
   * Returns an array of directions an entity could travel if
   * they started from the center and moved outward.
   */
  determineOpenDirections(): Direction[] {
    const openDirections: Direction[] = [];

    if (!this.getTrack(Direction.Up).solid)     { openDirections.push(Direction.Up); }
    if (!this.getTrack(Direction.Down).solid)   { openDirections.push(Direction.Down) ; }
    if (!this.getTrack(Direction.Left).solid)   { openDirections.push(Direction.Left); }
    if (!this.getTrack(Direction.Right).solid)  { openDirections.push(Direction.Right); }

    if (!this.getTrack(Direction.UpLeft).solid &&
        !this.getTrack(Direction.Left).solid &&
        !this.getTrack(Direction.Up).solid)     { openDirections.push(Direction.UpLeft); }

    if (!this.getTrack(Direction.UpRight).solid &&
        !this.getTrack(Direction.Up).solid &&
        !this.getTrack(Direction.Right).solid)  { openDirections.push(Direction.UpRight); }

    if (!this.getTrack(Direction.DownLeft).solid &&
        !this.getTrack(Direction.Left).solid &&
        !this.getTrack(Direction.Down).solid)   { openDirections.push(Direction.DownLeft); }

    if (!this.getTrack(Direction.DownRight).solid &&
        !this.getTrack(Direction.Down).solid &&
        !this.getTrack(Direction.Right).solid)  { openDirections.push(Direction.DownRight); }

    return openDirections;
  }

  get allXY(): [number, number][] {
    const coordinates: [number, number][] = [];
    for (const track of Array.from(this.tracks.values())) {
      coordinates.push([track.x, track.y]);
    }
    return coordinates;
  }

  get allTracks(): TileTrack[] {
    const tracks: TileTrack[] = [];
    for (const track of Array.from(this.tracks.values())) {
      tracks.push(track);
    }
    return tracks;
  }
}
