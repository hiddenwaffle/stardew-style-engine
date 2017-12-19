export enum Direction {
  None,
  UpLeft,
  Up,
  UpRight,
  Left,
  Right,
  DownLeft,
  Down,
  DownRight
}

export function determineDirection(dx: number, dy: number): Direction {
  if (dx < 0) {
    if (dy < 0) {
      return Direction.UpLeft;
    } else if (dy > 0) {
      return Direction.DownLeft;
    } else {
      return Direction.Left;
    }
  } else if (dx > 0) {
    if (dy < 0) {
      return Direction.UpRight;
    } else if (dy > 0) {
      return Direction.DownRight;
    } else {
      return Direction.Right;
    }
  } else {
    if (dy < 0) {
      return Direction.Up;
    } else if (dy > 0) {
      return Direction.Down;
    } else {
      return Direction.None;
    }
  }
}

export function isCardinal(direction: Direction) {
  return [Direction.Up,
          Direction.Down,
          Direction.Left,
          Direction.Right].includes(direction);
}
