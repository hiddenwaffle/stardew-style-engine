let lastId = 0;

export function nextId(): number {
  return ++lastId;
}
