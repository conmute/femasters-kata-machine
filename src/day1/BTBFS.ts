// Binary Tree Breadth First Search

import Queue from './Queue'

// Option, by reusing Queue, which always gives us O(N) and BFS is also O(N) so we are at O(2N) ~ O(N)
export default function bfs(head: BinaryNode<number>, needle: number): boolean {
    const q = new Queue<BinaryNode<number>>()
    q.enqueue(head)
    do {
        let curr = q.deque()

        if (needle === curr?.value) return true

        if (curr?.left) q.enqueue(curr.left)
        if (curr?.right) q.enqueue(curr.right)
    } while (q.length > 0)

    return false
}

// // Using javascript ArrayList "[]", where essentially on unshift we are doing O(N^2) complexiy instead of O(n)
// // because unshift forces to move the whole list to 1st position on each deque

// export default function bfs(head: BinaryNode<number>, needle: number): boolean {
//     const q: Array<BinaryNode<number>> = []
//     q.push(head)
//     do {
//         let curr = q.shift()

//         if (!curr) continue;

//         if (needle === curr?.value) return true

//         if (curr?.left) q.push(curr.left)
//         if (curr?.right) q.push(curr.right)
//     } while (q.length > 0)

//     return false
// }
