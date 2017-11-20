declare function require(str: string): string; // https://github.com/Microsoft/TypeScript-React-Starter/issues/12
require('./shared-lazy.js');

export class Thing {
  x: string;

  constructor() {
    console.log('in Thing#constructor');
    this.x = 'hi';
  }

  doIt() {
    setTimeout(() => {
      import('./lazy').then(lazy => {
        lazy.default();
      });
    }, 500);
  }
}
