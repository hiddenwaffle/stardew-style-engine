/**
 * Allow Tiled JSON files to be loaded by Webpack using import().
 * To delegate non-TS imports: https://stackoverflow.com/a/42702089
 */

interface X {
  height: number;
  width: number;
  layers: Array<any>; // TODO
}

declare module "*.map.json" {
  export = X;
}
