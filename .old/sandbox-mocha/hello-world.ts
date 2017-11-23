import { Inject } from 'typescript-ioc';

export class Bob {
  x = 10;
}

export default class HelloWorld {
  private bob: Bob;

  constructor(@Inject bob: Bob) {
    this.bob = bob;
  }

  getBobX() {
    return this.bob.x;
  }
};
