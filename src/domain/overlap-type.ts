export enum OverlapType {
  Eclipse = 1,
  Overlap = 2,
}

export function asOverlapType(value: string): OverlapType {
  // Enum conversion requires using "keyof": https://stackoverflow.com/a/42623905
  return OverlapType[value as keyof typeof OverlapType];
}
