/**
 * Array-based heap ops — operate directly on a plain array, no wrapper class.
 * arr[0] is always the peek. Fastest to type from memory in an interview.
 *
 * Default comparator is min-heap: `(a, b) => a < b`.
 * For a max-heap, pass `(a, b) => a > b` (or negate values and stay min-heap).
 */
 
function siftDown(arr, i, cmp) {
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let best = i;
 
    if (l < arr.length && cmp(arr[l], arr[best])) best = l;
    if (r < arr.length && cmp(arr[r], arr[best])) best = r;
    if (best === i) break;
 
    [arr[i], arr[best]] = [arr[best], arr[i]];
    i = best;
  }
}
 
/**
 * Inserts `val`. O(log n).
 */
function heapInsert(arr, val, cmp = (a, b) => a < b) {
  arr.push(val);
  let i = arr.length - 1;
 
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (!cmp(arr[i], arr[p])) break;
    [arr[i], arr[p]] = [arr[p], arr[i]];
    i = p;
  }
}
 
function heapDelete(arr, cmp = (a, b) => a < b) {
  if (arr.length === 0) return undefined;
 
  const top = arr[0];
  const last = arr.pop();
 
  if (arr.length > 0) {
    arr[0] = last;
    siftDown(arr, 0, cmp);
  }
 
  return top;
}
 
// O(n) bulk build — bubble down from the last non-leaf node backward.
// NOT n * heapInsert (that'd be O(n log n)).
function heapify(arr, cmp = (a, b) => a < b) {
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, cmp);
  }
}
 
export { heapInsert, heapDelete, heapify };
