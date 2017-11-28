import { expect } from 'chai';
import 'mocha';

class HelloWorld {
  getBobX(): number {
    return 10;
  }
}

const helloWorld = new HelloWorld();

describe('HelloWorld', () => {
  it('should have a standard Bob', () => {
    expect(helloWorld.getBobX()).to.equal(10);
  });
});
