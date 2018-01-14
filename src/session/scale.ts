import { log } from 'src/log';

let inverseScale = 1;

export function setScale(newScale: number) {
  if (newScale === 0) {
    log('warn', `Received zero as scaleFactor. Preventing division by zero.`);
    newScale = 0.01;
  }
  inverseScale = 1 / newScale;
}

/**
 * Multiplying by this = front buffer xy -> back buffer xy
 */
export function getInverseScale(): number {
  return inverseScale;
}
