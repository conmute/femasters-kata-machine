// So in quick sort we weak sort by selected pivot element.
// everything on the left is less and equalt to the pivot and the everything on the right is bigger then pivot
// then we select the part of the left and right, and make the same. 
// Select pivot, set all then less and equal to the left, and all thet is more to the right
// we do so, until we end up having only one item of the left, the pivot and the right

function qs(arr: number[], lo: number, hi: number): void {
    // we might hit out the low to be slightly above the hi
    if (lo >= hi) return

    // partition the current range
    const pivotIdx = partition(arr, lo, hi)

    // partition the low range
    qs(arr, lo, pivotIdx - 1)
    // partition the high range
    qs(arr, pivotIdx + 1, hi)
}

// return number - pivot index
function partition(arr: number[], lo: number, hi: number): number {
    const pivot = arr[hi]

    // we start from low, cause the books... there is a reason for that
    let idx = lo - 1

    for (let i = lo; i < hi; i++) {
        if (arr[i] <= pivot) {
            idx++ // we started at 0 position!
            
            // // swap old way
            // const tmp = arr[i]
            // arr[i] = arr[idx]
            // arr[idx] = tmp
            
            // OR... swap with new way
            [arr[i], arr[idx]] = [arr[idx], arr[i]]
        }
    }

    idx++
    
    // arr[hi] = arr[idx]
    // arr[idx] = pivot // arr[hi]

    // OR! use destructor!
    [arr[hi], arr[idx]] = [arr[idx], pivot] // same as = [arr[idx], arr[hi]]

    return idx
}

export default function quick_sort(arr: number[]): void {
    qs(arr, 0, arr.length - 1)
}
