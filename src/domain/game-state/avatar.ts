export default class {
  mapId: string;
  x: number;
  y: number;

  constructor(obj?: any) {
    if (obj) {
      this.mapId = obj.mapId;
      this.x = Number.parseInt(obj.x, 10);
      this.y = Number.parseInt(obj.y, 10)
    } else {
      this.mapId = "start";
      this.x = 1234;
      this.y = 4321;
    }
  }
}
