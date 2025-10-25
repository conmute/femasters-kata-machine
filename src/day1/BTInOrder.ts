// Binary Tree In Order traversal
// which means the root will be pushed in the middle

// Traversing is recursion
// Depth first traversion is here
// Recursion is all about how we follow the stack, and when when we put value into a stack

function walk(head: BinaryNode<number> | null, path: number[]): number[] {
    // base case
    if (!head) return path

    // recursion: traverse left
    walk(head.left, path)
    // in order call of the traversal
    path.push(head.value)
    // recursion: traverse right
    walk(head.right, path)

    return path
}

export default function in_order_search(head: BinaryNode<number>): number[] {
    return walk(head, [])
}
