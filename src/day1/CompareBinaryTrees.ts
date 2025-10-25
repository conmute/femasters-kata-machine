// Stack option is preferrable 
// for manual control and strategy adaptation if necessary
// for control and debuggability

import Queue from './Queue'
import Stack from './Stack'

function baseCheck(a: BinaryNode<number> | null, b: BinaryNode<number> | null): boolean {
    // structural check
    if (a === null && b === null) return true
    // structural check
    if (a === null || b === null) return false
    // value check
    return a.value === b.value
}

// Option using Stack
// Uses O(h) space where h = tree height
// Balanced tree will have O(log n), skewed O(n), for the memory
// immidiately exit, no unwinding needed as in recursive example
export default function compare(a: BinaryNode<number> | null, b: BinaryNode<number> | null): boolean {
    const stack = new Stack<[BinaryNode<number> | null, BinaryNode<number> | null]>()
    stack.push([a, b])
    while(stack.length) {
        let [aside, bside] = stack.pop() || [null, null]
        if (!baseCheck(aside, bside)) return false
        if (aside && bside) stack.push([aside.right, bside.right]);
        if (aside && bside) stack.push([aside.left, bside.left]); // we want to push left side last, so stack will make it check from left to right
    }

    return true
}

// // Option using Queue
// // Uses O(w) space where w = max width, for the memory
// // Always O(n/2) ≈ O(n) for the last level of a complete tree
// // Finds shallow differences faster, but no guarantees
// export default function compare(a: BinaryNode<number> | null, b: BinaryNode<number> | null): boolean {
//     const queue = new Queue<[BinaryNode<number> | null, BinaryNode<number> | null]>()
//     queue.enqueue([a, b])
//     while(queue.length) {
//         let [aside, bside] = queue.deque() || [null, null]
//         if (!baseCheck(aside, bside)) return false
//         if (aside && bside) queue.enqueue([aside.left, bside.left]);
//         if (aside && bside) queue.enqueue([aside.right, bside.right]);
//     }

//     return true
// }

// // Recursion is elegant and simple, but requires unwinding the call stack 
// // even after finding a mismatch. Iterative approaches can exit immediately.
// export default function compare(a: BinaryNode<number> | null, b: BinaryNode<number> | null): boolean {
//     // Base case for node comparisson
//     // structural check
//     if (a === null && b === null) return true
//     // structural check
//     if (a === null || b === null) return false
//     // value check
//     if (a.value !== b.value) return false

//     // recursive checks
//     return compare(a.left, b.left) && compare(a.right, b.right)
// }
