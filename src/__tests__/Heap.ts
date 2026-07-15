import Heap from "@code/Heap";
 
test("min heap: insert then delete in ascending order", function () {
  const heap = new Heap<number>((a, b) => a < b);
 
  expect(heap.length).toEqual(0);
 
  heap.insert(5);
  heap.insert(3);
  heap.insert(69);
  heap.insert(420);
  heap.insert(4);
  heap.insert(1);
  heap.insert(8);
  heap.insert(7);
 
  expect(heap.length).toEqual(8);
  expect(heap.delete()).toEqual(1);
  expect(heap.delete()).toEqual(3);
  expect(heap.delete()).toEqual(4);
  expect(heap.delete()).toEqual(5);
  expect(heap.length).toEqual(4);
  expect(heap.delete()).toEqual(7);
  expect(heap.delete()).toEqual(8);
  expect(heap.delete()).toEqual(69);
  expect(heap.delete()).toEqual(420);
  expect(heap.length).toEqual(0);
});
 
test("max heap: insert then delete in descending order", function () {
  const heap = new Heap<number>((a, b) => a > b);
 
  heap.insert(5);
  heap.insert(3);
  heap.insert(69);
  heap.insert(420);
  heap.insert(4);
  heap.insert(1);
  heap.insert(8);
  heap.insert(7);
 
  expect(heap.length).toEqual(8);
  expect(heap.delete()).toEqual(420);
  expect(heap.delete()).toEqual(69);
  expect(heap.delete()).toEqual(8);
  expect(heap.delete()).toEqual(7);
  expect(heap.delete()).toEqual(5);
  expect(heap.delete()).toEqual(4);
  expect(heap.delete()).toEqual(3);
  expect(heap.delete()).toEqual(1);
  expect(heap.length).toEqual(0);
});
 
test("delete on an empty heap returns undefined and does not throw", function () {
  const heap = new Heap<number>((a, b) => a < b);
 
  expect(heap.delete()).toBeUndefined();
  expect(heap.length).toEqual(0);
 
  heap.insert(1);
  heap.delete();
 
  // draining exactly to empty, then deleting again, should still be safe
  expect(heap.delete()).toBeUndefined();
  expect(heap.length).toEqual(0);
});
 
test("peek returns the root without removing it", function () {
  const heap = new Heap<number>((a, b) => a < b);
 
  expect(heap.peek()).toBeUndefined();
 
  heap.insert(5);
  heap.insert(1);
  heap.insert(3);
 
  expect(heap.peek()).toEqual(1);
  expect(heap.length).toEqual(3); // peek is non-destructive
  expect(heap.delete()).toEqual(1);
  expect(heap.peek()).toEqual(3);
});
 
test("uncapped insert returns undefined", function () {
  const heap = new Heap<number>((a, b) => a < b);
 
  expect(heap.insert(5)).toBeUndefined();
  expect(heap.insert(1)).toBeUndefined();
});
 
test("seeding from an initial array heapifies correctly (min)", function () {
  const heap = new Heap<number>((a, b) => a < b, [5, 3, 69, 420, 4, 1, 8, 7]);
 
  expect(heap.length).toEqual(8);
  expect(heap.delete()).toEqual(1);
  expect(heap.delete()).toEqual(3);
  expect(heap.delete()).toEqual(4);
  expect(heap.delete()).toEqual(5);
  expect(heap.delete()).toEqual(7);
  expect(heap.delete()).toEqual(8);
  expect(heap.delete()).toEqual(69);
  expect(heap.delete()).toEqual(420);
});
 
test("seeding from an initial array heapifies correctly (max)", function () {
  const heap = new Heap<number>((a, b) => a > b, [5, 3, 69, 420, 4, 1, 8, 7]);
 
  expect(heap.length).toEqual(8);
  expect(heap.delete()).toEqual(420);
  expect(heap.delete()).toEqual(69);
  expect(heap.delete()).toEqual(8);
  expect(heap.delete()).toEqual(7);
  expect(heap.delete()).toEqual(5);
  expect(heap.delete()).toEqual(4);
  expect(heap.delete()).toEqual(3);
  expect(heap.delete()).toEqual(1);
});
 
test("default seeding copies the input array (caller's array untouched)", function () {
  const src = [5, 3, 8, 1];
  const heap = new Heap<number>((a, b) => a < b, src);
 
  expect(src).toEqual([5, 3, 8, 1]);
  expect(heap.delete()).toEqual(1); // heap itself is still correctly ordered
});
 
test("inPlace seeding mutates and heap-orders the caller's array", function () {
  const src = [5, 3, 8, 1];
  const heap = new Heap<number>((a, b) => a < b, src, { inPlace: true });
 
  expect(src).not.toEqual([5, 3, 8, 1]); // reordered into heap shape
  expect(src[0]).toEqual(1); // root of a min-heap is always the smallest
 
  // draining the heap shrinks the shared backing array's length
  heap.delete();
  expect(src.length).toEqual(3);
  heap.delete();
  heap.delete();
  expect(src.length).toEqual(1);
});
 
test("bounded heap (maxSize): keeps the K largest values via a min-heap comparator", function () {
  const heap = new Heap<number>((a, b) => a < b, [], { maxSize: 3 });
 
  [4, 1, 9, 7, 2, 8].forEach((v) => heap.insert(v));
 
  expect(heap.length).toEqual(3);
 
  const kept: number[] = [];
  while (heap.length > 0) kept.push(heap.delete()!);
 
  expect(kept).toEqual([7, 8, 9]); // ascending, since it's a min-heap internally
});
 
test("bounded heap (maxSize): keeps the K smallest values via a max-heap comparator", function () {
  const heap = new Heap<number>((a, b) => a > b, [], { maxSize: 3 });
 
  [4, 1, 9, 7, 2, 8].forEach((v) => heap.insert(v));
 
  const kept: number[] = [];
  while (heap.length > 0) kept.push(heap.delete()!);
 
  expect(kept).toEqual([4, 2, 1]); // descending, since it's a max-heap internally
});
 
test("bounded heap: insert return value distinguishes grow / evict / reject", function () {
  const heap = new Heap<number>((a, b) => a < b, [10, 20, 30], { maxSize: 3 });
 
  // already at capacity from seeding — next inserts are all capacity-branch
 
  // rejected: 5 does not beat the current root (10)
  expect(heap.insert(5)).toEqual(5);
  expect(heap.length).toEqual(3);
  expect(heap.peek()).toEqual(10); // unchanged
 
  // accepted: 25 beats the current root (10), which gets evicted
  expect(heap.insert(25)).toEqual(10);
  expect(heap.length).toEqual(3);
  expect(heap.peek()).toEqual(20); // new weakest of the kept set
 
  const kept: number[] = [];
  while (heap.length > 0) kept.push(heap.delete()!);
  expect(kept).toEqual([20, 25, 30]);
});
 
test("bounded heap: growing inserts return undefined until capacity is hit", function () {
  const heap = new Heap<number>((a, b) => a < b, [], { maxSize: 2 });
 
  expect(heap.insert(1)).toBeUndefined();
  expect(heap.insert(2)).toBeUndefined();
  // now at capacity — subsequent calls hit the capacity branch
  expect(heap.insert(0)).toEqual(0); // rejected, weaker than both kept
  expect(heap.insert(5)).toEqual(1); // accepted, evicts the old root
});
 
test("bounded heap: seeding with more items than maxSize trims down to the K best", function () {
  const heap = new Heap<number>((a, b) => a < b, [4, 1, 9, 7, 2, 8], {
    maxSize: 3,
  });
 
  expect(heap.length).toEqual(3);
 
  const kept: number[] = [];
  while (heap.length > 0) kept.push(heap.delete()!);
  expect(kept).toEqual([7, 8, 9]);
});
 
test("custom comparator on tuples (e.g. [distance, x, y] from a k-closest-points style problem)", function () {
  type Point = [number, number, number]; // [distance, x, y]
  const heap = new Heap<Point>((a, b) => a[0] < b[0]);
 
  heap.insert([5, 1, 2]);
  heap.insert([1, 0, 1]);
  heap.insert([3, 2, -1]);
 
  expect(heap.delete()).toEqual([1, 0, 1]);
  expect(heap.delete()).toEqual([3, 2, -1]);
  expect(heap.delete()).toEqual([5, 1, 2]);
});
 
