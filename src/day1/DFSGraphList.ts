// // Option: DFS with recursive stack

// function walk(graph: WeightedAdjacencyList, vertixIdx: number, visited: boolean[], path: number[], needle: number) {
//     if (vertixIdx === needle) return true
//     if (visited[vertixIdx]) return false
//     if (!graph[vertixIdx] || !graph[vertixIdx].length) return

//     const edges = graph[vertixIdx]
//     visited[vertixIdx] = true

//     for (let i = 0; i < edges.length; i++) {
//         const edge = edges[i]

//         path.push(edge.to)

//         if (walk(graph, edge.to, visited, path, needle)) {
//             return true
//         }

//         path.pop()
//     }

//     return false
// }

// export default function dfs(graph: WeightedAdjacencyList, source: number, needle: number): number[] | null {
//     const path: number[] = [source]
//     const visited = (new Array(graph.length)).fill(false)

//     walk(graph, source, visited, path, needle)

//     if (!path.includes(needle)) return null

//     return path
// }

import Stack from './Stack'

type Phase = 'pre' | 'post'

export default function dfs(graph: WeightedAdjacencyList, source: number, needle: number): number[] | null {
    const path: number[] = [source]
    const visited = new Array(graph.length).fill(false)
    
    // Stack stores [vertexIdx, edgeIdx, phase]
    const stack = new Stack<[number, number, Phase]>()
    stack.push([source, 0, 'pre'])
    
    while (stack.length) {
        const [vertixIdx, edgeIdx, phase] = stack.pop() || [source, 0, 'pre']
        
        // === ENTRY: First time at this vertex (edgeIdx === 0 and phase === 'pre') ===
        if (edgeIdx === 0 && phase === 'pre') {
            // if (vertixIdx === needle) return true
            if (vertixIdx === needle) {
                return path
            }
            
            // if (visited[vertixIdx]) return false
            if (visited[vertixIdx]) {
                continue
            }
            
            // if (!graph[vertixIdx] || !graph[vertixIdx].length) return false
            if (!graph[vertixIdx] || !graph[vertixIdx].length) {
                continue
            }
            
            // visited[vertixIdx] = true
            visited[vertixIdx] = true
        }
        
        const edges = graph[vertixIdx]
        
        // === Loop exhausted: return false ===
        if (edgeIdx >= edges.length) {
            continue
        }
        
        const edge = edges[edgeIdx]
        
        // === PRE-CALL phase ===
        if (phase === 'pre') {
            // PRE-CALL: path.push(edge.to)
            path.push(edge.to)
            
            // Schedule POST-CALL phase (will execute after child returns)
            stack.push([vertixIdx, edgeIdx, 'post'])
            
            // Recursive call: if (walk(graph, edge.to, ...))
            stack.push([edge.to, 0, 'pre'])
            
        } else { // phase === 'post'
            // POST-CALL: path.pop()
            path.pop()
            
            // Continue to next edge (i++)
            stack.push([vertixIdx, edgeIdx + 1, 'pre'])
        }
    }
    
    return null
}

// function walk(graph: WeightedAdjacencyList, vertixIdx: number, visited: boolean[], path: number[], needle: number): boolean {
//     // Check BEFORE modifying anything
//     if (visited[vertixIdx]) return false

//     path.push(vertixIdx)
    
//     // Check if found
//     if (vertixIdx === needle) return true

//     // // Check if no edges
//     // if (!graph[vertixIdx] || !graph[vertixIdx].length) return false
    
//     const edges = graph[vertixIdx]
//     visited[vertixIdx] = true
    
//     for (let i = 0; i < edges.length; i++) {
//         const edge = edges[i]
        
//         // Just call walk - child will add itself to path
//         if (walk(graph, edge.to, visited, path, needle)) {
//             return true
//         }
//         // Child already popped itself if it failed
//     }
    
//     // Done with all edges, clean up before returning
//     path.pop()
//     return false
// }

// export default function dfs(graph: WeightedAdjacencyList, source: number, needle: number): number[] | null {
//     const path: number[] = []  // Start empty
//     const visited = new Array(graph.length).fill(false)
    
//     walk(graph, source, visited, path, needle)
    
//     if (!path.includes(needle)) return null
    
//     return path
// }

// import Stack from './Stack'

// export default function dfs(graph: WeightedAdjacencyList, source: number, needle: number): number[] | null {
//     const path: number[] = []
//     const visited = new Array(graph.length).fill(false)
    
//     // Stack stores [vertexIdx, edgeIdx]
//     const stack = new Stack<[number, number]>()
//     stack.push([source, 0])
    
//     while (stack.length) {
//         const [vertixIdx, edgeIdx] = stack.pop() || [source, 0]
        
//         // First time visiting this vertex (edgeIdx === 0)
//         if (edgeIdx === 0) {
//             // if (visited[vertixIdx]) return false
//             if (visited[vertixIdx]) {
//                 continue
//             }
            
//             // path.push(vertixIdx)
//             path.push(vertixIdx)
            
//             // if (vertixIdx === needle) return true
//             if (vertixIdx === needle) {
//                 return path
//             }
            
//             // visited[vertixIdx] = true
//             visited[vertixIdx] = true
            
//             // if (!graph[vertixIdx] || !graph[vertixIdx].length)
//             if (!graph[vertixIdx] || !graph[vertixIdx].length) {
//                 path.pop()
//                 continue
//             }
//         }
        
//         const edges = graph[vertixIdx]
        
//         // for loop exhausted: return false
//         if (edgeIdx >= edges.length) {
//             path.pop()
//             continue
//         }
        
//         // Continue loop (i++)
//         stack.push([vertixIdx, edgeIdx + 1])
        
//         const edge = edges[edgeIdx]
        
//         // if (walk(graph, edge.to, ...))
//         stack.push([edge.to, 0])
//     }
    
//     return null
// }

// ---

// import Stack from './Stack'

// export default function dfsIterative(graph: WeightedAdjacencyList, source: number, needle: number): number[] | null {
//     const path: number[] = [source]
//     const visited = (new Array(graph.length)).fill(false)

//     const stack = new Stack<{ vertexIdx: number, edgeIdx: number}>()
//     stack.push({ vertexIdx: source, edgeIdx: 0})

//     while (stack.length) {
//         const { vertexIdx, edgeIdx } = stack.pop() as { vertexIdx: number, edgeIdx: number}

//         if (vertexIdx === needle) break
//         // if (visited[vertexIdx]) continue
//         if (!graph[vertexIdx] || !graph[vertexIdx][edgeIdx]) {
//             path.pop()
//             continue
//         }

//         const edges = graph[vertexIdx]
//         const edge = edges[edgeIdx]
//         visited[vertexIdx] = true

//         stack.push({ vertexIdx, edgeIdx: edgeIdx + 1 })

//         if (visited[edge.to]) continue

//         path.push(edge.to)
//         stack.push({ vertexIdx: edge.to, edgeIdx: 0 })
//     }

//     console.log({ path })

//     if (!path.includes(needle)) return null

//     return path
// }

// -----

// import Stack from './Stack'

// export default function dfs(
//     graph: WeightedAdjacencyList, 
//     source: number, 
//     needle: number
// ): number[] | null {
//     const path: number[] = [source]
//     const visited = new Array(graph.length).fill(false)
    
//     const stack = new Stack<[number, number]>()
//     stack.push([source, 0])
//     visited[source] = true
    
//     while (stack.length) {
//         const [vertixIdx, edgeIdx] = stack.pop() || [source, 0]
        
//         // if (vertixIdx === needle) return true
//         if (vertixIdx === needle) {
//             return path
//         }
        
//         // if (!graph[vertixIdx] || !graph[vertixIdx].length) return
//         if (!graph[vertixIdx] || !graph[vertixIdx].length) {
//             path.pop()  // Pop the vertex with no edges
//             continue
//         }
        
//         const edges = graph[vertixIdx]
        
//         // for loop finished: return false
//         if (edgeIdx >= edges.length) {
//             path.pop()
//             continue
//         }
        
//         const edge = edges[edgeIdx]
        
//         // Push back to continue with next edge
//         stack.push([vertixIdx, edgeIdx + 1])
        
//         // if (visited[edge.to]) skip
//         if (visited[edge.to]) {
//             continue
//         }
        
//         // path.push(edge.to)
//         path.push(edge.to)
        
//         // Mark visited before recursive call
//         visited[edge.to] = true
        
//         // if (walk(graph, edge.to, visited, path, needle))
//         stack.push([edge.to, 0])
//     }
    
//     return null
// }