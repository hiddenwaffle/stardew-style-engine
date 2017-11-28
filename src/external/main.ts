class Main {
  constructor() {
    //
  }

  start() {
    import('src/external/map/start').then((bob) => {
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
