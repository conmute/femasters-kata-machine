// Min/Max Heap are O(long n)
// Also called Priority Queue
// Note: fibonacci Heap can be even more efficient...
// smallest value at the top, on pop/delete we always keep smallest value
// we always order this binnary tree from left to right, using math indexing
// see: getLeftChildIDX / getRightChildIDX / getParentIdx
export default class MinHeap {
  // bookeep length, cause arraylist does not recalculate it
  public length: number = 0

  private data: number[] = []

  constructor() {}

  // O(log n) time complexity, cause we move through BT height only
  insert(value: number): void {
    this.data[this.length] = value
    this.length++
    minHeapBubbleUp(this.data, this.length - 1)
  }

  // its delets head and returns it
  // O(log n) time complexity, cause we move through BT heaight only
  delete(): number {
    if (this.length <= 0) {
      return -1
    }

    this.length--;

    const out = this.data[0]
    if (this.length === 0) {
      this.data = []
      return out
    }

    // we removed the root, now we take the last item from heap as the new root
    this.data[0] = this.data[this.length]

    // in min heap, we have smallest at the root so we bubble down our value
    minHeapBubbleDown([this.data, this.length], 0)

    return out
  }
}

function getLeftChildIDX(idx: number) {
  return 2 * idx + 1
}

function getRightChildIDX(idx: number) {
  return 2 * idx + 2
}

function getParentIdx(idx: number) {
  return Math.floor( ( idx - 1 ) / 2 )
}

function swap<T>(arr: Array<T>, lid: number, rid: number) {
  const tmp = arr[lid]
  arr[lid] = arr[rid]
  arr[rid] = tmp
}

function minHeapBubbleUp<T>(arr: Array<T>, idx: number) {
  if (idx === 0) return

  const value = arr[idx]
  const parentIdx = getParentIdx(idx)
  const parentValue = arr[parentIdx]

  if (value < parentValue) {
    swap(arr, idx, parentIdx)
    minHeapBubbleUp(arr, parentIdx)
  }
}

function minHeapBubbleDown<T>([arr, length]: [Array<T>, number], idx: number) {
  if (idx >= length) return
  if (getLeftChildIDX(idx) >= length) return

  // const ridx = getRightChildIDX(idx)
  // const rV = arr[ridx]
  //
  // const lidx = getLeftChildIDX(idx)
  // const lV = arr[lidx]
  //
  // const v = arr[idx]
  //
  // if (lV > rV && v > rV) {
  //   swap(arr, idx, ridx)
  //   minHeapBubbleDown([arr, length], ridx)
  // }
  //
  // if (lV == rV && v > rV) {
  //   swap(arr, idx, ridx)
  //   minHeapBubbleDown([arr, length], ridx)
  // }
  //
  // if (rV > lV && v > lV) {
  //   swap(arr, idx, lidx)
  //   minHeapBubbleDown([arr, length], lidx)
  // }

  const lidx = getLeftChildIDX(idx)
  const ridx = getRightChildIDX(idx)

  const isLidxSide = arr[lidx] < arr[ridx]

  if ( isLidxSide && arr[idx] > arr[lidx]) {
    swap(arr, idx, lidx)
    minHeapBubbleDown([arr, length], lidx)
  }

  if ( !isLidxSide && arr[idx] > arr[ridx]) {
    swap(arr, idx, ridx)
    minHeapBubbleDown([arr, length], ridx)
  }
}
