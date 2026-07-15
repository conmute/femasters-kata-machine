/**
 * MinHeap — array-backed binary heap, smallest value always at the root.
 *
 * Use this when JS/TS has no native heap (unlike Python's `heapq`) and you
 * need O(log n) insert / extract-min. Common triggers: "K largest/smallest",
 * "top K frequent", "merge K sorted lists", "Dijkstra / cheapest path",
 * "median of a stream" (paired with a MaxHeap).
 *
 * For a MAX-HEAP: negate values on insert/extract (`heap.insert(-v)`,
 * `-heap.extractMin()`), or flip every `<` below to `>`. Don't build a
 * second class in an interview — just note the trick out loud.
 *
 * Indexing (0-based array as a complete binary tree):
 *   parent(i) = floor((i - 1) / 2)
 *   left(i)   = 2i + 1
 *   right(i)  = 2i + 2
 *
 * Complexity:
 *   insert()      O(log n)  — push to end, bubble up
 *   extractMin()  O(log n)  — swap root with last, pop, bubble down
 *   peek()        O(1)
 *   space         O(n)
 *
 * NOT included here (add only if the question needs it):
 *   - heapify(arr): O(n) build from an existing array (bubble-down from
 *     the last non-leaf node backward, NOT n inserts — that'd be O(n log n))
 *   - a capped/bounded variant for top-K problems (insert only displaces
 *     the root if the new value beats it, once at capacity)
 *   - generics / custom comparator — swap `number` for `T` and thread a
 *     `(a: T, b: T) => boolean` compare function through bubbleUp/Down
 */
class MinHeap {
  private data: number[] = []
 
  size(): number {
    return this.data.length
  }
 
  peek(): number | undefined {
    return this.data[0]
  }
 
  insert(val: number): void {
    this.data.push(val)
    this.bubbleUp(this.data.length - 1)
  }
 
  extractMin(): number | undefined {
    if (this.data.length === 0) return undefined
    const min = this.data[0]
    const last = this.data.pop()!
    if (this.data.length > 0) {
      this.data[0] = last
      this.bubbleDown(0)
    }
    return min
  }
 
  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      if (this.data[i] >= this.data[parent]) break
      ;[this.data[i], this.data[parent]] = [this.data[parent], this.data[i]]
      i = parent
    }
  }
 
  private bubbleDown(i: number): void {
    const n = this.data.length
    while (true) {
      const left = 2 * i + 1
      const right = 2 * i + 2
      let smallest = i
 
      if (left < n && this.data[left] < this.data[smallest]) smallest = left
      if (right < n && this.data[right] < this.data[smallest]) smallest = right
      if (smallest === i) break
 
      ;[this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]]
      i = smallest
    }
  }
}


// // Previous code
//
// // Min/Max Heap are O(long n)
// // Also called Priority Queue
// // Note: fibonacci Heap can be even more efficient...
// // smallest value at the top, on pop/delete we always keep smallest value
// // we always order this binnary tree from left to right, using math indexing
// // see: getLeftChildIDX / getRightChildIDX / getParentIdx
// export default class MinHeap {
//   // bookeep length, cause arraylist does not recalculate it
//   public length: number = 0

//   private data: number[] = []

//   constructor() {}

//   // O(log n) time complexity, cause we move through BT height only
//   insert(value: number): void {
//     this.data[this.length] = value
//     this.length++
//     minHeapBubbleUp(this.data, this.length - 1)
//   }

//   // its delets head and returns it
//   // O(log n) time complexity, cause we move through BT heaight only
//   delete(): number {
//     if (this.length <= 0) {
//       return -1
//     }

//     this.length--;

//     const out = this.data[0]
//     if (this.length === 0) {
//       this.data = []
//       return out
//     }

//     // we removed the root, now we take the last item from heap as the new root
//     this.data[0] = this.data[this.length]

//     // in min heap, we have smallest at the root so we bubble down our value
//     minHeapBubbleDown([this.data, this.length], 0)

//     return out
//   }
// }

// function getLeftChildIDX(idx: number) {
//   return 2 * idx + 1
// }

// function getRightChildIDX(idx: number) {
//   return 2 * idx + 2
// }

// function getParentIdx(idx: number) {
//   return Math.floor( ( idx - 1 ) / 2 )
// }

// function swap<T>(arr: Array<T>, lid: number, rid: number) {
//   const tmp = arr[lid]
//   arr[lid] = arr[rid]
//   arr[rid] = tmp
// }

// function minHeapBubbleUp<T>(arr: Array<T>, idx: number) {
//   if (idx === 0) return

//   const value = arr[idx]
//   const parentIdx = getParentIdx(idx)
//   const parentValue = arr[parentIdx]

//   if (value < parentValue) {
//     swap(arr, idx, parentIdx)
//     minHeapBubbleUp(arr, parentIdx)
//   }
// }

// function minHeapBubbleDown<T>([arr, length]: [Array<T>, number], idx: number) {
//   if (idx >= length) return
//   if (getLeftChildIDX(idx) >= length) return

//   // const ridx = getRightChildIDX(idx)
//   // const rV = arr[ridx]
//   //
//   // const lidx = getLeftChildIDX(idx)
//   // const lV = arr[lidx]
//   //
//   // const v = arr[idx]
//   //
//   // if (lV > rV && v > rV) {
//   //   swap(arr, idx, ridx)
//   //   minHeapBubbleDown([arr, length], ridx)
//   // }
//   //
//   // if (lV == rV && v > rV) {
//   //   swap(arr, idx, ridx)
//   //   minHeapBubbleDown([arr, length], ridx)
//   // }
//   //
//   // if (rV > lV && v > lV) {
//   //   swap(arr, idx, lidx)
//   //   minHeapBubbleDown([arr, length], lidx)
//   // }

//   const lidx = getLeftChildIDX(idx)
//   const ridx = getRightChildIDX(idx)

//   const isLidxSide = arr[lidx] < arr[ridx]

//   if ( isLidxSide && arr[idx] > arr[lidx]) {
//     swap(arr, idx, lidx)
//     minHeapBubbleDown([arr, length], lidx)
//   }

//   if ( !isLidxSide && arr[idx] > arr[ridx]) {
//     swap(arr, idx, ridx)
//     minHeapBubbleDown([arr, length], ridx)
//   }
// }
