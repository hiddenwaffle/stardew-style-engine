// declare function require(str: string): any; // https://github.com/Microsoft/TypeScript-React-Starter/issues/12

class Main {
  constructor() {
    //
  }

  start() {
    import('./map/test01.json').then((obj) => {
      console.log('MAP LOADED: ', obj);
    });
  }

  step() {
    //
  }

  stop() {
    //
  }
}

export default new Main();
