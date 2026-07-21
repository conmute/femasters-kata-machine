import {
    dfs,
    bfs,
    dfsTraversal,
    bfsTraversal,
    findLargestNode,
    hasCycleDirected,
    hasCycleUndirected,
    countEdges,
} from "@code/graphHelpers";
import { AdjacencyList } from "@code/types";

// ------------------------------------------------------------
// Fixtures
// ------------------------------------------------------------

const list0: AdjacencyList = []; // empty graph

const list1: AdjacencyList = [[1], [2], [3], []]; // directed chain 0->1->2->3

/**
 *      0
 *     / \
 *    1   2
 *   / \   \
 *  3   4   5
 *       \ /
 *        5 -> 6
 */
const list2: AdjacencyList = [
    /* 0 */ [1, 2],
    /* 1 */ [3, 4],
    /* 2 */ [5],
    /* 3 */ [],
    /* 4 */ [5],
    /* 5 */ [6],
    /* 6 */ [],
];

const list3Cyclic: AdjacencyList = [[1], [2], [0]]; // directed cycle 0->1->2->0
const list3Acyclic: AdjacencyList = [[1], [2], []]; // same shape, no back edge

const list4UndirectedNoCycle: AdjacencyList = [[1], [0, 2], [1]]; // path 0-1-2
const list4UndirectedCycle: AdjacencyList = [[1, 2], [0, 2], [0, 1]]; // triangle

const list5Disconnected: AdjacencyList = [[1, 2], [], [], [4], []]; // {0,1,2} + {3,4}

// ------------------------------------------------------------
// Pathfinders
// ------------------------------------------------------------

test("dfs - graph", function () {
    expect(dfs(list2, 0, 6)).toEqual([0, 1, 4, 5, 6]);
    expect(dfs(list2, 6, 0)).toEqual(null);
});

test("bfs - graph", function () {
    // BFS finds the SHORTEST path - shorter than the DFS path
    // above for the same start/target, since it goes via node 2.
    expect(bfs(list2, 0, 6)).toEqual([0, 2, 5, 6]);
    expect(bfs(list2, 6, 0)).toEqual(null);
});

// ------------------------------------------------------------
// Traversals
// ------------------------------------------------------------

test("bfsTraversal - simple chain", function () {
    expect(bfsTraversal(list1, 0)).toEqual([0, 1, 2, 3]);
});

test("bfsTraversal - level order", function () {
    expect(bfsTraversal(list2, 0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
});

test("bfsTraversal - only visits the reachable component", function () {
    expect(bfsTraversal(list5Disconnected, 0)).toEqual([0, 1, 2]);
    expect(bfsTraversal(list5Disconnected, 3)).toEqual([3, 4]);
});

test("bfsTraversal - empty graph or out-of-range start", function () {
    expect(bfsTraversal(list0, 0)).toEqual([]);
    expect(bfsTraversal(list1, 99)).toEqual([]);
});

test("dfsTraversal - simple chain", function () {
    expect(dfsTraversal(list1, 0)).toEqual([0, 1, 2, 3]);
});

test("dfsTraversal - depth-first order (first neighbor explored fully first)", function () {
    expect(dfsTraversal(list2, 0)).toEqual([0, 1, 3, 4, 5, 6, 2]);
});

test("dfsTraversal - only visits the reachable component", function () {
    expect(dfsTraversal(list5Disconnected, 0)).toEqual([0, 1, 2]);
    expect(dfsTraversal(list5Disconnected, 3)).toEqual([3, 4]);
});

test("dfsTraversal - empty graph or out-of-range start", function () {
    expect(dfsTraversal(list0, 0)).toEqual([]);
    expect(dfsTraversal(list1, 99)).toEqual([]);
});

// ------------------------------------------------------------
// Core operations
// ------------------------------------------------------------

test("findLargestNode", function () {
    expect(findLargestNode(list2, 0)).toBe(6);
    expect(findLargestNode(list1, 0)).toBe(3);
});

test("findLargestNode - vertex with no outgoing edges returns itself", function () {
    expect(findLargestNode(list2, 6)).toBe(6);
});

test("findLargestNode - out-of-range start returns null", function () {
    expect(findLargestNode(list2, 99)).toBeNull();
});

test("hasCycleDirected", function () {
    expect(hasCycleDirected(list3Cyclic)).toBe(true);
    expect(hasCycleDirected(list3Acyclic)).toBe(false);
    expect(hasCycleDirected(list2)).toBe(false);
});

test("hasCycleUndirected", function () {
    expect(hasCycleUndirected(list4UndirectedCycle)).toBe(true);
    expect(hasCycleUndirected(list4UndirectedNoCycle)).toBe(false);
});

test("countEdges", function () {
    expect(countEdges(list1)).toBe(3); // 0->1, 1->2, 2->3
    expect(countEdges(list2)).toBe(7); // 2+2+1+0+1+1+0
    // undirected triangle: 3 edges stored both ways = 6 entries
    expect(countEdges(list4UndirectedCycle)).toBe(6);
});
