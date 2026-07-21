import { AdjacencyList } from "@code/types";

/**
 * Graph BFS/DFS helpers for index-based adjacency-list graphs
 * (AdjacencyList = number[][], each index is a vertex, each entry
 * is a list of neighbor indices).
 *
 * Two categories of function here, don't confuse them:
 *  - Pathfinders (dfs, bfs): start -> target, return the path or
 *    null if target is unreachable.
 *  - Traversals (dfsTraversal, bfsTraversal): visit everything
 *    reachable from start, no target, return visit order.
 *
 * All operations below are O(V + E) time, O(V) space unless noted
 * otherwise - V = vertices, E = edges, each visited/processed once.
 */

// ------------------------------------------------------------
// Pathfinders
// ------------------------------------------------------------

/**
 * Depth-first search for a path from `start` to `target`.
 * Returns *a* path, not necessarily the shortest - depends on
 * neighbor order in each vertex's list. Use bfs for shortest path.
 */
export function dfs(
  list: AdjacencyList,
  start: number,
  target: number
): number[] | null {
  if (start < 0 || start >= list.length) return null;

  const visited = new Set<number>();
  const path: number[] = [];

  function explore(node: number): boolean {
    visited.add(node);
    path.push(node);

    if (node === target) return true;

    for (const neighbor of list[node] ?? []) {
      if (!visited.has(neighbor) && explore(neighbor)) {
        return true;
      }
    }

    path.pop(); // backtrack - this node doesn't lead to target
    return false;
  }

  return explore(start) ? path : null;
}

/**
 * Breadth-first search for a path from `start` to `target`.
 * Returns the SHORTEST path (fewest edges), or null if unreachable.
 */
export function bfs(
  list: AdjacencyList,
  start: number,
  target: number
): number[] | null {
  if (start < 0 || start >= list.length) return null;

  const queue: number[] = [start];
  const visited = new Set<number>([start]);
  const parent = new Map<number, number>();

  while (queue.length) {
    const node = queue.shift()!;

    if (node === target) {
      return reconstructPath(parent, start, target);
    }

    for (const neighbor of list[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, node);
        queue.push(neighbor);
      }
    }
  }

  return null;
}

function reconstructPath(
  parent: Map<number, number>,
  start: number,
  target: number
): number[] {
  const path: number[] = [target];
  let current = target;

  while (current !== start) {
    current = parent.get(current)!;
    path.push(current);
  }

  return path.reverse();
}

// ------------------------------------------------------------
// Traversals (no target - visit everything reachable from start)
// ------------------------------------------------------------

/** Breadth-first traversal - visit order is level by level. */
export function bfsTraversal(list: AdjacencyList, start: number): number[] {
  if (start < 0 || start >= list.length) return [];

  const queue: number[] = [start];
  const visited = new Set<number>([start]);
  const traversal: number[] = [];

  while (queue.length) {
    const node = queue.shift()!;
    traversal.push(node);

    for (const neighbor of list[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return traversal;
}

/**
 * Depth-first traversal - iterative (stack-based), so it can't blow
 * the call stack on a large/degenerate graph. Neighbors are pushed
 * in reverse so the FIRST neighbor in each vertex's list is still
 * explored first, matching what recursive DFS would visit.
 */
export function dfsTraversal(list: AdjacencyList, start: number): number[] {
  if (start < 0 || start >= list.length) return [];

  const stack: number[] = [start];
  const visited = new Set<number>();
  const traversal: number[] = [];

  while (stack.length) {
    const node = stack.pop()!;

    if (visited.has(node)) continue;
    visited.add(node);
    traversal.push(node);

    const neighbors = list[node] ?? [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited.has(neighbors[i])) {
        stack.push(neighbors[i]);
      }
    }
  }

  return traversal;
}

// ------------------------------------------------------------
// Core operations
// ------------------------------------------------------------

/**
 * Find the largest vertex value reachable from `start` (BFS).
 * Returns `start` itself if nothing bigger is reachable.
 */
export function findLargestNode(list: AdjacencyList, start: number): number | null {
  if (start < 0 || start >= list.length) return null;

  const queue: number[] = [start];
  const visited = new Set<number>([start]);
  let largest = start;

  while (queue.length) {
    const node = queue.shift()!;
    if (node > largest) largest = node;

    for (const neighbor of list[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return largest;
}

/**
 * Detect a cycle in a DIRECTED graph using DFS + a "currently on
 * the recursion stack" set. A back-edge to a node still on the
 * stack means a cycle; a back-edge to a node that's fully finished
 * (visited but off the stack) is just a re-converging path.
 */
export function hasCycleDirected(list: AdjacencyList): boolean {
  const visited = new Set<number>();
  const onStack = new Set<number>();

  function visit(node: number): boolean {
    visited.add(node);
    onStack.add(node);

    for (const neighbor of list[node] ?? []) {
      if (!visited.has(neighbor)) {
        if (visit(neighbor)) return true;
      } else if (onStack.has(neighbor)) {
        return true;
      }
    }

    onStack.delete(node);
    return false;
  }

  for (let vertex = 0; vertex < list.length; vertex++) {
    if (!visited.has(vertex) && visit(vertex)) return true;
  }

  return false;
}

/**
 * Detect a cycle in an UNDIRECTED graph (edges present both ways
 * in the list). Needs a parent check, unlike the directed version -
 * otherwise walking straight back along the edge you just arrived
 * on would be flagged as a false cycle.
 */
export function hasCycleUndirected(list: AdjacencyList): boolean {
  const visited = new Set<number>();

  function visit(node: number, parent: number): boolean {
    visited.add(node);

    for (const neighbor of list[node] ?? []) {
      if (!visited.has(neighbor)) {
        if (visit(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        return true;
      }
    }

    return false;
  }

  for (let vertex = 0; vertex < list.length; vertex++) {
    if (!visited.has(vertex) && visit(vertex, -1)) return true;
  }

  return false;
}

/**
 * Count total edges by summing adjacency list lengths.
 * For a DIRECTED graph this is the true edge count. For an
 * UNDIRECTED graph (edges stored both ways) this counts each edge
 * twice - divide by 2 if you need the undirected count.
 */
export function countEdges(list: AdjacencyList): number {
  let edgeCount = 0;
  for (const neighbors of list) {
    edgeCount += neighbors.length;
  }
  return edgeCount;
}
