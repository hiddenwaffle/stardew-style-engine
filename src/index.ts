// import '@/sandbox';

declare function require(str: string): string; // https://github.com/Microsoft/TypeScript-React-Starter/issues/12

import { Inject, Singleton, Container, AutoWired } from 'typescript-ioc';
import { Thing } from './temp';

require('./shared-lazy.js');

@Singleton
@AutoWired
class Person {
  @Inject
  thing: Thing;
}

{
  const person = Container.get(Person);
  // console.log(person);
  // console.log(person.thing);
  // console.log(person.thing.x);
  person.thing.x = 'bye';
  person.thing.doIt();
}

{
  const person = Container.get(Person);
  // console.log(person);
  // console.log(person.thing);
  // console.log(person.thing.x);
  person.thing.doIt();
}

export class Cheeseburger {
  x: string;
  meatPatty: string;

  constructor() {
    this.x = 'cheese';
  }
}
