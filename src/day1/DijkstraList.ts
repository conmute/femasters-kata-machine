import MinHeap from './stuff/MinHeapGraphDistance'

export default function dijkstra_list(
    source: number,
    sink: number,
    arr: WeightedAdjacencyList
): number[] {
    // const seen: boolean[] = new Array(arr.length).fill(false)
    const prev: number[] = new Array(arr.length).fill(-1)
    const dists: number[] = new Array(arr.length).fill(Infinity)
    
    dists[source] = 0
    
    const heap = new MinHeap()
    heap.insert({ vertixIdx: source, distance: 0 })
    
    while (heap.length > 0) {
        const current = heap.delete()
        if (!current) break
        
        const vertixIdx = current.vertixIdx
        
        // if (seen[vertixIdx]) continue
        // but instead we skip stale entries!
        if (current.distance > dists[vertixIdx]) continue
        
        // seen[vertixIdx] = true
        
        const edges = arr[vertixIdx]
        
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i]
            
            // if (seen[edge.to]) continue
            
            const newDist = current.distance + edge.weight
            
            if (newDist < dists[edge.to]) {
                dists[edge.to] = newDist
                prev[edge.to] = vertixIdx
                heap.insert({ vertixIdx: edge.to, distance: newDist })
            }
        }
    }
    
    // Build path from sink to source
    const out: number[] = []
    let curr = sink
    
    // Walk backwards from sink to source
    while (prev[curr] !== -1) {
        out.push(curr)
        curr = prev[curr]
    }
    
    // Add the source (which has prev[source] === -1)
    out.push(curr)
    
    // If the last element isn't the source, no path exists
    if (curr !== source) return []
    
    return out.reverse()
}

// // time complexity O(V + V ^ 2 + 2E + V) => O(V ^ 2)
// export default function dijkstra_list(
//     source: number,
//     sink: number,
//     arr: WeightedAdjacencyList
// ): number[] {
//     // space/time complexity O(V)
//     const seen: boolean[] = new Array(arr.length).fill(false)
//     const prev: number[] = new Array(arr.length).fill(-1)
//     const dists: number[] = new Array(arr.length).fill(Infinity)

//     const minDistsHeap = new MinHeap()
//     minDistsHeap.insert({ vertixIdx: 0, distance: 0 })
//     dists[source] = 0

//     // time complexity O(V) of loop
//     while(minDistsHeap.length > 0) { // time complexity O(x * V) ~ O(V ^ 2) for loop
//         // time complexity O(x * V) ~ O(V ^ 2) for loop
//         const current = minDistsHeap.delete()
//         if (!current) continue

//         const { vertixIdx, distance } = current
//         // const vertixIdx = getLowestUnvisited(dists, seen)

//         if (seen[vertixIdx]) continue

//         seen[vertixIdx] = true
//         const edges = arr[vertixIdx]
//         // TODO: we dont need it, because we popped from heap!
//         // seen[vertixIdx] = true

//         // time complexity O(x + 2E), we check each edge twice!
//         // its not O(V * E), but instead it is actually checks 2E times per whole loop run!
//         for (let i = 0; i < edges.length; i++) {
//             const edge = edges[i]
//             const newDist = dists[vertixIdx] + edge.weight
//             if (newDist < dists[edge.to]) {
//                 minDistsHeap.insert({ vertixIdx: edge.to, distance: newDist })
//                 dists[edge.to] = newDist
//                 prev[edge.to] = vertixIdx
//             }
//         }
//     }

//     let curr = sink
//     const out: number[] = []

//     // time complexity O(x + V)
//     while (prev[curr] !== -1) {
//         out.push(curr)
//         curr = prev[curr]
//     }

//     out.push(curr)

//     if (out[out.length - 1] !== source) {
//         return []
//     }

//     return out.reverse()
// }


// // Option: O(V ^ 2) because we use check arrays

// // Time compleixty O(V)
// function hasUnseen(arr: WeightedAdjacencyList, seen: boolean[]) {
//     // TODO: implement check of seen against arr
//     return arr.some((_, index) => !seen[index])
// }

// // Time complexity O(V)
// function getLowestUnvisited(dists: number[], seen: boolean[]) {
//     let currId = -1
//     let currWeight = Infinity

//     // time complexity O(V)
//     for (let i = 0; i < dists.length; i++) {
//         if (seen[i]) continue 
//         if (dists[i] < currWeight) {
//             currId = i
//             currWeight = dists[i]
//         }
//     }

//     return currId
// }

// // time complexity O(V + V ^ 2 + 2E + V) => O(V ^ 2)
// export default function dijkstra_list(
//     source: number,
//     sink: number,
//     arr: WeightedAdjacencyList
// ): number[] {
//     // space/time complexity O(V)
//     const seen: boolean[] = new Array(arr.length).fill(false)
//     const prev: number[] = new Array(arr.length).fill(-1)
//     const dists: number[] = new Array(arr.length).fill(Infinity)

//     dists[source] = 0

//     // time complexity O(V) of loop
//     while(hasUnseen(arr, seen)) { // time complexity O(x * V) ~ O(V ^ 2) for loop
//         // time complexity O(x * V) ~ O(V ^ 2) for loop
//         const vertixIdx = getLowestUnvisited(dists, seen)

//         const edges = arr[vertixIdx]
//         seen[vertixIdx] = true

//         // time complexity O(x + 2E), we check each edge twice!
//         // its not O(V * E), but instead it is actually checks 2E times per whole loop run!
//         for (let i = 0; i < edges.length; i++) {
//             const edge = edges[i]
//             if (dists[vertixIdx] + edge.weight < dists[edge.to]) {
//                 dists[edge.to] = dists[vertixIdx] + edge.weight
//                 prev[edge.to] = vertixIdx
//             }
//         }
//     }

//     let curr = sink
//     const out: number[] = []

//     // time complexity O(x + V)
//     while (prev[curr] !== -1) {
//         out.push(curr)
//         curr = prev[curr]
//     }

//     return [source].concat(out.reverse())
// }
