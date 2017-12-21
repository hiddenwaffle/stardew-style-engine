import environment from 'src/session/environment';

/**
 * From https://developer.mozilla.org/en-US/docs/Web/API/Console
 * Entries should match up with the TypeScript typings for Console.
 * (I do not know of a better way to reconcile the two.)
 */
type ConsoleMethod =
  'assert' |
  'clear' |
  'count' |
  'debug' |
  'dir' |
  'dirxml' |
  'error' |
  'group' |
  'groupCollapsed' |
  'groupEnd' |
  'info' |
  'log' |
  'table' |
  'time' |
  'timeEnd' |
  'timeStamp' |
  'trace' |
  'warn';

const allowedInProduction: ConsoleMethod[] = ['warn', 'error'];

/**
 * Assists with preventing non-warn/error statements from displaying in production.
 */
export default (methodName: ConsoleMethod, ...args: any[]) => {
  if (environmentAllows(methodName)) {
    const method = (console as any)[methodName];
    if (method) {
      try {
        method(...args);
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(`Error caught when calling console.${methodName}(${args})`, e);
      }
    }
  }
};

function environmentAllows(methodName: ConsoleMethod): boolean {
  if (environment.production) {
    return allowedInProduction.includes(methodName);
  } else {
    return true;
  }
}
