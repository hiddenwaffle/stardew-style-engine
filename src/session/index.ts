export default class Session {
  start() {
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => {
      this.loop();
    });
  }
}
