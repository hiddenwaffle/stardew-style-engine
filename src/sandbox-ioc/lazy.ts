import { Inject, Container, AutoWired, Singleton } from 'typescript-ioc';
import { Cheeseburger } from './index';
declare function require(str: string): string; // https://github.com/Microsoft/TypeScript-React-Starter/issues/12

require('./shared-lazy.js');

@Singleton
@AutoWired
class Bob {
  y: string;

  constructor() {
    this.y = 'bob is my name';
  }
}

class BobCar {
  @Inject
  bob: Bob;

  doIt() {
    console.log('driving ', this.bob);
  }
}

export default () => {
  console.log('in lazy');
  const bobCar = Container.get(BobCar);
  bobCar.doIt();
  bobCar.bob.y = 'changed to this?';

  const wow = new Cheeseburger();
  console.log('cheeseburger: ', wow.x);
};
