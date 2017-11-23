import { expect } from 'chai';
import 'mocha';

import { Container } from 'typescript-ioc';

import HelloWorld, { Bob } from './hello-world';

describe('HelloWorld', () => {
  it('should have a standard Bob', () => {
    const helloWorld = <HelloWorld> Container.get(HelloWorld);
    expect(helloWorld.getBobX()).to.equal(10);
  });

  it('should allow Bob to change', () => {
    const bob = new Bob();
    bob.x = 777;
    const helloWorld = new HelloWorld(bob);
    expect(helloWorld.getBobX()).to.equal(777);
  });
});
