export enum Direction {
  None        = 1,
  UpLeft      = 2,
  Up          = 3,
  UpRight     = 4,
  Left        = 5,
  Right       = 6,
  DownLeft    = 7,
  Down        = 8,
  DownRight   = 9,
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

/**
 * Returns [dx, dy]
 */
export function determineDxDy(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.None:
      return [0, 0];
    case Direction.UpLeft:
      return [-1, -1];
    case Direction.Up:
      return [0, -1];
    case Direction.UpRight:
      return [1, -1];
    case Direction.Left:
      return [-1, 0];
    case Direction.Right:
      return [1, 0];
    case Direction.DownLeft:
      return [-1, 1];
    case Direction.Down:
      return [0, 1];
    case Direction.DownRight:
      return [1, 1];
  }
  return [0, 0];
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

export function calculateFacing(
  dx: number,
  dy: number,
  currentFacing: Direction,
  directionsOfFreedom: DirectionsOfFreedom,
): Direction {
  switch (directionsOfFreedom) {
    case DirectionsOfFreedom.One:
      return calculateFacingOneDirection(dx, dy, currentFacing);
    case DirectionsOfFreedom.Two:
      return calculateFacingTwoDirections(dx, currentFacing);
    case DirectionsOfFreedom.Four:
      return calculateFacingFourDirections(dx, dy, currentFacing);
    case DirectionsOfFreedom.Eight:
      // TODO: Account for 8 directions of freedom, when necessary (arrows?).
      break;
  }
  return Direction.None;
}

function calculateFacingOneDirection(
  dx: number,
  dy: number,
  currentFacing: Direction,
): Direction {
  return currentFacing; // TODO: I dunno, doesn't matter does it?
}

function calculateFacingTwoDirections(
  dx: number,
  currentFacing: Direction,
): Direction {
  if (dx < 0) {
    return Direction.Left;
  } else if (dx > 0) {
    return Direction.Right;
  }
  return currentFacing;
}

function calculateFacingFourDirections(
  dx: number,
  dy: number,
  currentFacing: Direction,
): Direction {
  if (dx !== 0 && dy !== 0) { // Diagonal movement
    if (dx < 0 && dy < 0) { // Move up-left
      if (currentFacing === Direction.Left || currentFacing === Direction.Up) {
        return currentFacing;
      } else {
        return Direction.Left; // TODO: Does defaulting to horizontal movement facing work out?
      }
    } else if (dx > 0 && dy < 0) { // Move up-right
      if (currentFacing === Direction.Right || currentFacing === Direction.Up) {
        return currentFacing;
      } else {
        return Direction.Right; // TODO: Does defaulting to horizontal movement facing work out?
      }
    } else if (dx < 0 && dy > 0) { // Move down-left
      if (currentFacing === Direction.Left || currentFacing === Direction.Down) {
        return currentFacing;
      } else {
        return Direction.Left; // TODO: Does defaulting to horizontal movement facing work out?
      }
    } else if (dx > 0 && dy > 0) { // Move down-right
      if (currentFacing === Direction.Right || currentFacing === Direction.Down) {
        return currentFacing;
      } else {
        return Direction.Right; // TODO: Does defaulting to horizontal movement facing work out?
      }
    }
  } else { // Cardinal movement or standing still
    if (dx < 0) {
      return Direction.Left;
    } else if (dx > 0) {
      return Direction.Right;
    } else if (dy < 0) {
      return Direction.Up;
    } else if (dy > 0) {
      return Direction.Down;
    }
  }
  return currentFacing;
}
