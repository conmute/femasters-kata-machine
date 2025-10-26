// Loopup more for ../MinHeap
// this is the same, but different base type

type GraphDistanceValue = {
    vertixIdx: number
    distance: number
}

export default class MinHeapGraphDistance {
  // bookeep length, cause arraylist does not recalculate it
  public length: number = 0

  private data: Array<GraphDistanceValue> = []

  constructor() {}

  // O(log n) time complexity, cause we move through BT height only
  insert(value: GraphDistanceValue): void {
    this.data[this.length] = value
    this.length++
    minHeapBubbleUp(this.data, this.length - 1)
    console.log(this.data)
  }

  // // its delets head and returns it
  // // O(log n) time complexity, cause we move through BT heaight only
  // delete(): GraphDistanceValue | undefined {
  //   if (this.length <= 0) {
  //     return undefined
  //   }

  //   this.length--;

  //   const out = this.data[0]
  //   if (this.length === 0) {
  //     this.data = []
  //     return out
  //   }

  //   // we removed the root, now we take the last item from heap as the new root
  //   this.data[0] = this.data[this.length]

  //   // in min heap, we have smallest at the root so we bubble down our value
  //   minHeapBubbleDown([this.data, this.length], 0)

  //   return out
  // }

  delete(): GraphDistanceValue | undefined {
    if (this.length <= 0) {
      return undefined
    }

    const out = this.data[0]
    this.length--
    
    if (this.length === 0) {
      this.data = []
      return out
    }

    // Move last element to root
    this.data[0] = this.data[this.length]
    
    // Bubble down the new root
    minHeapBubbleDown(this.data, this.length, 0)

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

function minHeapBubbleUp<T extends GraphDistanceValue>(arr: Array<T>, idx: number) {
  if (idx === 0) return

  const value = arr[idx]
  const parentIdx = getParentIdx(idx)
  const parentValue = arr[parentIdx]

  if (value.distance < parentValue.distance) {
    swap(arr, idx, parentIdx)
    minHeapBubbleUp(arr, parentIdx)
  }
}

function minHeapBubbleDown<T extends GraphDistanceValue>(arr: Array<T>, length: number, idx: number) {
  if (idx >= length) return
  if (getLeftChildIDX(idx) >= length) return

  const lidx = getLeftChildIDX(idx)
  const ridx = getRightChildIDX(idx)

  // const isLidxSide = arr[lidx].distance < arr[ridx].distance
  const isLidxSide = ridx >= length && arr[lidx].distance < arr[ridx].distance

  if ( isLidxSide && arr[idx].distance > arr[lidx].distance) {
    swap(arr, idx, lidx)
    minHeapBubbleDown(arr, length, lidx)
  }

  if ( !isLidxSide && arr[idx].distance > arr[ridx].distance) {
    swap(arr, idx, ridx)
    minHeapBubbleDown(arr, length, ridx)
  }
}

// function minHeapBubbleDown<T extends GraphDistanceValue>(arr: Array<T>, length: number, idx: number) {
//   if (idx >= length) return
  
//   const lidx = getLeftChildIDX(idx)
//   const ridx = getRightChildIDX(idx)
  
//   if (lidx >= length) return  // No children
  
//   let smallestIdx = idx
  
//   // Check left child
//   if (arr[lidx].distance < arr[smallestIdx].distance) {
//     smallestIdx = lidx
//   }
  
//   // Check right child (only if it exists)
//   if (ridx < length && arr[ridx].distance < arr[smallestIdx].distance) {
//     smallestIdx = ridx
//   }
  
//   // If smallest is not current node, swap and recurse
//   if (smallestIdx !== idx) {
//     swap(arr, idx, smallestIdx)
//     minHeapBubbleDown(arr, length, smallestIdx)
//   }
// }
