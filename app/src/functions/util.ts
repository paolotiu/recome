export function multiply100(num: number) {
  return Math.round(num * 100);
}

export function convertToPositiveRange(x: number) {
  const oldr = 0 - -60;
  const newr = 100;
  const newval = ((x - -60) * newr) / oldr - 0;
  return Math.floor(newval);
}
