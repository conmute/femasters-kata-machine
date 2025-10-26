// So WeightedAdjacencyMatrix as stated in number[][] matrix, has a one-2-one relation of the nodes numbered from 0-to-N
// Our goal here is to return path from source node (given number of it) to a destination node, we need a path

// Option: implement based on Q and check on needle in the while condition

import Queue from './Queue'

export default function bfs(graph: WeightedAdjacencyMatrix, source: number, needle: number): number[] | null {
    // a visited list, so we dont end ourselves in a loop, we fill 
    const visited: boolean[] = ( new Array(graph.length) ).fill(false)
    // a path, where we collected how we get to the needle
    // fill with -1 so we know that there no record of the connection
    const path: number[] = ( new Array(graph.length) ).fill(-1)

    const q = new Queue<number>()

    q.enqueue(source)

    // we have a difference here, cause we implicitly check if we got a needle
    // exit early...
    while (q.peek() !== needle && q.length) {
        const vertixIdx = q.deque() as number

        visited[vertixIdx] = true
        const edges = graph[vertixIdx]
        
        for (let edgeToIdx = 0; edgeToIdx <= edges.length; edgeToIdx++) {
            const edgeWeight = edges[edgeToIdx]

            if (!edgeWeight) continue
            if (visited[edgeToIdx]) continue

            path[edgeToIdx] = vertixIdx
            q.enqueue(edgeToIdx)
        }
    }

    // Check B (recomended): if needle had no connection
    if (path[needle] === -1) return null

    // // check A: if last was a needle we were seeking
    // if (q.peek() !== needle && !q.length) return null

    const out: number[] = []

    let nextVertixIdx = needle
    while (nextVertixIdx !== source && !!nextVertixIdx) {
        out.push(nextVertixIdx)
        nextVertixIdx = path[nextVertixIdx]
    }

    return [source].concat(out.reverse())
}

// // Option: implement based on array Q and check if needle had a prev
// export default function bfs(graph: WeightedAdjacencyMatrix, source: number, needle: number): number[] | null {

//     const seen = new Array(graph.length).fill(false);
//     const prev = new Array(graph.length).fill(-1);

//     seen[source] = true;
//     const q: number[] = [source];

//     do {
//         const curr = q. shift() as number;
//         if (curr === needle) break;

//         const adjs = graph[curr]
//         for (let i = 0; i < adjs.length; i++) {
//             if (adjs[i] === 0) continue
//             if (seen[i]) continue

//             seen[i] = true
//             prev[i] = curr
//             q.push(i)
//         }
//         seen[curr] = true;
//     } while (q.length);

//     if (prev[needle] === -1) return null

//     let curr = needle
//     const out: number[] = [];

//     while (prev[curr] !== -1) {
//         out.push(curr)
//         curr = prev[curr]
//     }

//     return [source].concat(out.reverse())
// }
