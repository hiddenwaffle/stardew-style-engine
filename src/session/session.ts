import { AutoWired, Inject, Singleton } from 'typescript-ioc';
import UiStructure from 'src/ui/ui-structure';
import Timer from './timer';

@Singleton
@AutoWired
export default class {
  constructor(
    @Inject private timer: Timer,
    @Inject private uiStructure: UiStructure
  ) {
    //
  }

  start() {
    this.startAll();
    this.timer.start(this.stepAll.bind(this));
  }

  private startAll() {
    this.uiStructure.start();
    // TODO: Call start() on everything
  }

  private stepAll() {
    this.uiStructure.step();
    // TODO: Call step() on everything else
  }
}
