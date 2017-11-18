declare function require(str: string): string;

export default function (): void {
  const yeah = require('./bob.json');
  console.log(yeah);
};
