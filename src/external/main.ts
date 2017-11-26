// declare function require(str: string): any; // https://github.com/Microsoft/TypeScript-React-Starter/issues/12

class Main {
  constructor() {
    //
  }

  start() {
    import('./map/test01.map.json').then((obj) => {
      console.log('MAP LOADED: ', obj);
      console.log(obj.height);
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
