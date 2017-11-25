import { AutoWired, Singleton, Inject } from "typescript-ioc";
import Timer from "./timer";

@Singleton
@AutoWired
export default class {
  private readonly timer: Timer;

  constructor(@Inject timer: Timer) {
    this.timer = timer;
  }

  start() {
    this.timer.start(() => {
      this.step();
    });
  }

  private step() {
    // TODO: Call step() on everything else
  }
}
