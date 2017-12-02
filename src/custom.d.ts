/**
 * Allow files to be loaded by Webpack using import().
 * To delegate non-TS imports: https://stackoverflow.com/a/42702089
 */

declare module '*.json' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.webm' {
  const content: any;
  export default content;
}
