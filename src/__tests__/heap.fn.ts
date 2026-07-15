import { heapInsert, heapDelete, heapify } from "@code/heap-fns";
 
test("min-heap (default cmp): insert then delete in ascending order", function () {
  const heap = [];
 
  expect(heap.length).toEqual(0);
 
  heapInsert(heap, 5);
  heapInsert(heap, 3);
  heapInsert(heap, 69);
  heapInsert(heap, 420);
  heapInsert(heap, 4);
  heapInsert(heap, 1);
  heapInsert(heap, 8);
  heapInsert(heap, 7);
 
  expect(heap.length).toEqual(8);
  expect(heap[0]).toEqual(1); // peek is just arr[0]
 
  expect(heapDelete(heap)).toEqual(1);
  expect(heapDelete(heap)).toEqual(3);
  expect(heapDelete(heap)).toEqual(4);
  expect(heapDelete(heap)).toEqual(5);
  expect(heap.length).toEqual(4);
  expect(heapDelete(heap)).toEqual(7);
  expect(heapDelete(heap)).toEqual(8);
  expect(heapDelete(heap)).toEqual(69);
  expect(heapDelete(heap)).toEqual(420);
  expect(heap.length).toEqual(0);
});
 
test("max-heap (custom cmp): insert then delete in descending order", function () {
  const heap = [];
  const cmp = (a, b) => a > b;
 
  heapInsert(heap, 5, cmp);
  heapInsert(heap, 3, cmp);
  heapInsert(heap, 69, cmp);
  heapInsert(heap, 420, cmp);
  heapInsert(heap, 4, cmp);
  heapInsert(heap, 1, cmp);
  heapInsert(heap, 8, cmp);
  heapInsert(heap, 7, cmp);
 
  expect(heap[0]).toEqual(420);
 
  expect(heapDelete(heap, cmp)).toEqual(420);
  expect(heapDelete(heap, cmp)).toEqual(69);
  expect(heapDelete(heap, cmp)).toEqual(8);
  expect(heapDelete(heap, cmp)).toEqual(7);
  expect(heapDelete(heap, cmp)).toEqual(5);
  expect(heapDelete(heap, cmp)).toEqual(4);
  expect(heapDelete(heap, cmp)).toEqual(3);
  expect(heapDelete(heap, cmp)).toEqual(1);
  expect(heap.length).toEqual(0);
});
 
test("heapDelete on an empty array returns undefined and does not throw", function () {
  const heap = [];
 
  expect(heapDelete(heap)).toBeUndefined();
  expect(heap.length).toEqual(0);
 
  heapInsert(heap, 1);
  heapDelete(heap);
 
  // draining exactly to empty, then deleting again, should still be safe
  expect(heapDelete(heap)).toBeUndefined();
  expect(heap.length).toEqual(0);
});
 
test("heapDelete on a single-element array empties it correctly", function () {
  const heap = [];
  heapInsert(heap, 42);
 
  expect(heapDelete(heap)).toEqual(42);
  expect(heap.length).toEqual(0);
  expect(heap).toEqual([]);
});
 
test("peek via arr[0] does not mutate the array", function () {
  const heap = [];
  heapInsert(heap, 5);
  heapInsert(heap, 1);
  heapInsert(heap, 3);
 
  expect(heap[0]).toEqual(1);
  expect(heap.length).toEqual(3);
  expect(heap[0]).toEqual(1); // reading twice is still non-destructive
});
 
test("heapify builds correct min-heap order in place, O(n)", function () {
  const arr = [5, 3, 69, 420, 4, 1, 8, 7];
  heapify(arr);
 
  expect(arr[0]).toEqual(1); // smallest bubbles to the root
  expect(arr.length).toEqual(8); // same elements, just reordered
 
  const drained = [];
  while (arr.length) drained.push(heapDelete(arr));
  expect(drained).toEqual([1, 3, 4, 5, 7, 8, 69, 420]);
});
 
test("heapify builds correct max-heap order in place with a custom cmp", function () {
  const arr = [5, 3, 69, 420, 4, 1, 8, 7];
  const cmp = (a, b) => a > b;
  heapify(arr, cmp);
 
  expect(arr[0]).toEqual(420);
 
  const drained = [];
  while (arr.length) drained.push(heapDelete(arr, cmp));
  expect(drained).toEqual([420, 69, 8, 7, 5, 4, 3, 1]);
});
 
test("heapify matches the result of inserting the same values one by one", function () {
  const values = [9, 4, 7, 1, 8, 2, 6, 3, 5];
 
  const viaHeapify = [...values];
  heapify(viaHeapify);
 
  const viaInserts = [];
  for (const v of values) heapInsert(viaInserts, v);
 
  const drainedA = [];
  while (viaHeapify.length) drainedA.push(heapDelete(viaHeapify));
 
  const drainedB = [];
  while (viaInserts.length) drainedB.push(heapDelete(viaInserts));
 
  expect(drainedA).toEqual(drainedB);
});
 
test("works with duplicate values", function () {
  const heap = [];
  [5, 5, 1, 1, 3, 3].forEach((v) => heapInsert(heap, v));
 
  const drained = [];
  while (heap.length) drained.push(heapDelete(heap));
  expect(drained).toEqual([1, 1, 3, 3, 5, 5]);
});
 
test("custom comparator on tuples (e.g. [distance, x, y] from a k-closest-points style problem)", function () {
  const heap = [];
  const byDistance = (a, b) => a[0] < b[0];
 
  heapInsert(heap, [5, 1, 2], byDistance);
  heapInsert(heap, [1, 0, 1], byDistance);
  heapInsert(heap, [3, 2, -1], byDistance);
 
  expect(heapDelete(heap, byDistance)).toEqual([1, 0, 1]);
  expect(heapDelete(heap, byDistance)).toEqual([3, 2, -1]);
  expect(heapDelete(heap, byDistance)).toEqual([5, 1, 2]);
});
 
test("top-K pattern (maxSize) done inline: keep the K largest values seen", function () {
  // No library support needed for this — just cap the array at k, and once
  // full, only insert if the new value beats the current root (arr[0]).
  // Use a MIN-heap comparator to track the K *largest* values: the weakest
  // of the K survivors then sits at the root, ready to be evicted.
  const k = 3;
  const cmp = (a, b) => a < b;
  const heap = [];
 
  for (const v of [4, 1, 9, 7, 2, 8]) {
    if (heap.length < k) {
      heapInsert(heap, v, cmp);
    } else if (cmp(heap[0], v)) {
      // v beats the current weakest kept item — evict root, insert v
      heapDelete(heap, cmp);
      heapInsert(heap, v, cmp);
    }
    // else: v is worse than everything already kept — skip it
  }
 
  expect(heap.length).toEqual(k);
 
  const kept = [];
  while (heap.length) kept.push(heapDelete(heap, cmp));
  expect(kept).toEqual([7, 8, 9]); // ascending, min-heap internally
});
