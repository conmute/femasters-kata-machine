/**
 * Heap — generic array-backed binary heap (aka priority queue).
 *
 * Ordering is entirely controlled by the `compare` function you pass in:
 * `compare(a, b) === true` means "a has priority over b", i.e. a should sit
 * closer to the root. This lets one class cover both min-heap and max-heap,
 * and arbitrary keyed values (tuples, objects) without subclassing.
 *
 *   MinHeap<number>:            (a, b) => a < b
 *   MaxHeap<number>:            (a, b) => a > b
 *   Min-heap by [dist, x, y]:   (a, b) => a[0] < b[0]
 *
 * ## Copy vs in-place seeding
 * By default, seeding from `initial` copies the array (`[...initial]`), so
 * mutating the heap never surprises the caller by reordering their array.
 * Pass `{ inPlace: true }` to skip the copy and heapify the caller's array
 * directly — matches Python's `heapq.heapify(list)` semantics, saves an
 * O(n) allocation, but means the passed-in array WILL be reordered and its
 * `.length` will shrink as items are popped via `delete()`.
 *
 * ## Bounded heaps (top-K pattern)
 * Pass `{ maxSize: k }` to cap the heap at k elements. Once at capacity,
 * `insert()` stops growing the heap and instead only displaces the current
 * root if the new value should outrank it (this is `heapq.heappushpop`
 * behavior, fused into `insert` rather than exposed separately). Construct
 * the comparator INVERTED relative to what you're keeping — e.g. to track
 * the K *largest* values seen, use a min-heap comparator `(a, b) => a < b`,
 * so the weakest of the K survivors sits at the root, ready to be evicted.
 *
 * IMPORTANT: because the ordering is deliberately inverted for this pattern,
 * the eviction check must be `compare(root, value)` (does the *incoming*
 * value beat the root?) — NOT `compare(value, root)`. Getting this backwards
 * is an easy, silent bug: with a min-heap root of `1` and a new value `7`,
 * `compare(value, root)` = `7 < 1` = false (wrongly rejects 7), while
 * `compare(root, value)` = `1 < 7` = true (correctly evicts the root).
 *
 * Complexity (n = current size):
 *   insert()      O(log n) — O(1) amortized-reject case once at capacity
 *   delete()      O(log n)
 *   peek()        O(1)
 *   heapify()     O(n)     — bubble-down from the last non-leaf node
 *                            backward to the root; NOT n * insert, which
 *                            would be O(n log n)
 *   space         O(n), or O(1) extra if `inPlace: true`
 *
 * Common triggers to reach for this: "K largest/smallest", "top K frequent",
 * "merge K sorted lists", "cheapest/shortest path" (Dijkstra), "median of a
 * stream" (pair a max-heap for the lower half with a min-heap for the upper
 * half), "task scheduler" (always process the most/least frequent next).
 */
type Comparator<T> = (a: T, b: T) => boolean
 
export default class Heap<T> {
  public length: number = 0
  private data: T[] = []
  private compare: Comparator<T>
  private maxSize?: number
 
  /**
   * @param compare `(a, b) => true` if `a` outranks `b` (a belongs closer
   *   to the root). Determines min-heap vs max-heap vs custom-key ordering.
   * @param initial Optional array to seed the heap from. Heapified in O(n).
   * @param options.inPlace If true, heapify `initial` directly instead of
   *   copying it first. The caller's array will be mutated/reordered/resized.
   * @param options.maxSize If set, caps the heap at this many elements —
   *   see the "Bounded heaps" note above for how `insert()` behaves once full.
   */
  constructor(
    compare: Comparator<T>,
    initial: T[] = [],
    options: { inPlace?: boolean; maxSize?: number } = {}
  ) {
    this.compare = compare
    this.maxSize = options.maxSize
 
    if (initial.length) {
      this.data = options.inPlace ? initial : [...initial]
      this.length = this.data.length
      this.heapify()
 
      // if a bounded heap is seeded with more than maxSize items,
      // trim down to the maxSize highest-priority ones
      if (this.maxSize !== undefined && this.length > this.maxSize) {
        while (this.length > this.maxSize) this.delete()
      }
    }
  }
 
  /** Returns the highest-priority element (the root) without removing it. O(1). */
  peek(): T | undefined {
    return this.length > 0 ? this.data[0] : undefined
  }
 
  /**
   * Inserts `value`.
   *
   * - Uncapped, or below `maxSize`: normal O(log n) insert; returns `undefined`.
   * - At `maxSize` capacity: only accepted if the current root loses to it,
   *   i.e. `compare(root, value)` is true. If accepted, the old root is
   *   evicted and returned. If rejected, `value` itself is returned
   *   unchanged and the heap is untouched.
   *
   * @returns The displaced/rejected value when capped, otherwise `undefined`.
   */
  insert(value: T): T | undefined {
    // not yet at capacity (or uncapped): normal insert
    if (this.maxSize === undefined || this.length < this.maxSize) {
      this.data[this.length] = value
      this.length++
      this.bubbleUp(this.length - 1)
      return undefined
    }
 
    // at capacity: root is the WEAKEST of the kept items (by construction,
    // e.g. smallest of the "K largest" set), so it's the correct eviction
    // candidate. Ask compare(root, value): does the incoming value beat the
    // root? (NOT compare(value, root) — see the class-level doc comment on
    // why that direction is backwards and silently drops valid candidates.)
    if (this.compare(this.data[0], value)) {
      const evicted = this.data[0]
      this.data[0] = value
      this.bubbleDown(0)
      return evicted
    }
 
    // value doesn't even beat the weakest kept item — reject it, unchanged
    return value
  }
 
  /** Removes and returns the highest-priority element (the root). O(log n). */
  delete(): T | undefined {
    if (this.length <= 0) return undefined
 
    this.length--
    const out = this.data[0]
 
    if (this.length === 0) {
      this.data = []
      return out
    }
 
    this.data[0] = this.data[this.length]
    this.data.length = this.length
    this.bubbleDown(0)
 
    return out
  }
 
  /**
   * Builds heap order from `this.data` in O(n) by bubbling down from the
   * last non-leaf node backward to the root. Called once during
   * construction when seeded with `initial` — not intended to be called
   * standalone against arbitrary unsynced state.
   */
  private heapify(): void {
    const lastParent = Math.floor(this.length / 2) - 1
    for (let i = lastParent; i >= 0; i--) this.bubbleDown(i)
  }
 
  /** Restores heap order upward from `idx` after an insert at the tail. */
  private bubbleUp(idx: number): void {
    if (idx === 0) return
    const parentIdx = getParentIdx(idx)
    if (this.compare(this.data[idx], this.data[parentIdx])) {
      swap(this.data, idx, parentIdx)
      this.bubbleUp(parentIdx)
    }
  }
 
  /** Restores heap order downward from `idx` after the root is replaced. */
  private bubbleDown(idx: number): void {
    const lidx = getLeftChildIDX(idx)
    const ridx = getRightChildIDX(idx)
    let best = idx
 
    if (lidx < this.length && this.compare(this.data[lidx], this.data[best])) best = lidx
    if (ridx < this.length && this.compare(this.data[ridx], this.data[best])) best = ridx
 
    if (best !== idx) {
      swap(this.data, idx, best)
      this.bubbleDown(best)
    }
  }
}
 
function getLeftChildIDX(idx: number) { return 2 * idx + 1 }
function getRightChildIDX(idx: number) { return 2 * idx + 2 }
function getParentIdx(idx: number) { return Math.floor((idx - 1) / 2) }
function swap<T>(arr: T[], a: number, b: number) {
  const tmp = arr[a]; arr[a] = arr[b]; arr[b] = tmp
}
 
