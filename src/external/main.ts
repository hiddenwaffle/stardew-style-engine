class Main {
  constructor() {
    //
  }

  start() {
    import('src/external/map/test01').then((bob) => {
      bob.default();
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
