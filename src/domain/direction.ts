export enum Direction {
  None,
  UpLeft,
  Up,
  UpRight,
  Left,
  Right,
  DownLeft,
  Down,
  DownRight,
}

export enum DirectionsOfFreedom {
  One   = 1,
  Two   = 2,
  Four  = 4,
  Eight = 8, // Arrows?
}

export function asDirection(value: string): Direction {
  // Enum conversion requires using "keyof": https://stackoverflow.com/a/42623905
  return Direction[value as keyof typeof Direction];
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

export function deriveDirectionsOfFreedom(animationNames: string[]): DirectionsOfFreedom {
  let up, down, left, right = false;
  let upLeft, upRight, downLeft, downRight = false;

  Array.from(animationNames).forEach((key) => {
    if (key.endsWith('up'))         { up        = true; }
    if (key.endsWith('down'))       { down      = true; }
    if (key.endsWith('left'))       { left      = true; }
    if (key.endsWith('right'))      { right     = true; }
    if (key.endsWith('up-left'))    { upLeft    = true; }
    if (key.endsWith('up-right'))   { upRight   = true; }
    if (key.endsWith('down-left'))  { downLeft  = true; }
    if (key.endsWith('down-right')) { downRight = true; }
  });

  let found = 0;
  if (up)         { found++; }
  if (down)       { found++; }
  if (left)       { found++; }
  if (right)      { found++; }
  if (upLeft)     { found++; }
  if (upRight)    { found++; }
  if (downLeft)   { found++; }
  if (downRight)  { found++; }

  let directionsOfFreedom = DirectionsOfFreedom.One;
  if (found >= 2 && found <= 3) {
    directionsOfFreedom = DirectionsOfFreedom.Two;
  } else if (found >= 4 && found <= 7) {
    directionsOfFreedom = DirectionsOfFreedom.Four;
  } else if (found >= 8) {
    directionsOfFreedom = DirectionsOfFreedom.Eight;
  }

  return directionsOfFreedom;
}
