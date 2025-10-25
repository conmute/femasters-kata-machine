// Binary Tree Post Order Traversal
// which means the root will be pushed last

function walk(head: BinaryNode<number> | null, path: number[]): number[] {
    if (!head) return path

    walk(head.left, path)
    walk(head.right, path)
    path.push(head.value)

    return path
}

export default function post_order_search(head: BinaryNode<number>): number[] {
    return walk(head, [])
}
