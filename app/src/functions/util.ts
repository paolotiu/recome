export function multiply100(num: number) {
  return Math.round(num * 100);
}

export function convertToPositiveRange(x: number) {
  const oldr = 0 - -60;
  const newr = 100;
  const newval = ((x - -60) * newr) / oldr - 0;
  return Math.floor(newval);
}

export function toObjArray(obj: { [key: string]: number }) {
  const arr = [];
  for (const [key, value] of Object.entries(obj)) {
    arr.push({ key, value });
  }
  return arr;
}
export function getTopFive(arr: { key: string; value: number }[]) {
  //sorting to top 3 function
  arr.sort(function (a, b) {
    return b.value - a.value;
  });
  return arr.slice(0, 5);
}
