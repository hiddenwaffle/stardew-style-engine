// To delegate non-TS imports: https://stackoverflow.com/a/42702089

// Allow JSON files to be loaded by Webpack using import().
declare module '*.json' {
  const content: any;
  export default content;
}

// Allow PNG files to be loaded by Webpack using import().
declare module '*.png' {
  const content: any;
  export default content;
}

// Allow WebM files to be loaded by Webpack using import().
declare module '*.webm' {
  const content: any;
  export default content;
}
