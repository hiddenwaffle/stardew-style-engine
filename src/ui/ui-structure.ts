import { AutoWired, Singleton } from "typescript-ioc";

@Singleton
@AutoWired
export default class {
  private readonly x: number;
  constructor() {
    this.x = 10;
  }
}
