// Note: instead of
`
node.next = this.head
this.head.prev = node
this.head = node
`;
// we use for simplicity, which does the same
`[node.next, this.head.prev, this.head] = [this.head, node, node]`

interface Node<T> {
    value: T
    prev?: Node<T>
    next?: Node<T>
}

export default class DoublyLinkedList<T> {
    public length: number = 0;
    
    private head?: Node<T>
    private tail?: Node<T>

    constructor() {}

    prepend(item: T): void {
        const node: Node<T> = { value: item }

        this.length++;

        if (!this.head) {
            this.head = this.tail = node;
            return
        }

        [node.next, this.head.prev, this.head] = [this.head, node, node]
    }

    insertAt(item: T, idx: number): void {
        // guard clauses goes first for base cases
        if (idx > this.length) {
            throw new Error("Idx out of bounds")
        }
        if (idx === this.length) {
            this.append(item)
            return
        }
        if (idx === 0) {
            this.prepend(item)
            return;
        }

        // we select next, until the final next which should be at idx position
        const curr = this.getAt(idx)

        // ex: a <=> b, we are inserting x on position b which has idx positioning
        const node: Node<T> = { value: item };

        // setup new node references
        [node.next, node.prev] = [curr, curr?.prev]

        // setup the preposition to the current to link to our node instead, ex: a.next = x
        if (curr && curr.prev) curr.prev.next = node

        // setup current to link back to our node, ex:
        if (curr) curr.prev = node

        this.length++
    }

    append(item: T): void {
        this.length++
        const node: Node<T> = { value: item }
        if (!this.head || !this.tail) {
            this.head = this.tail = node
            return
        }

        [node.prev, this.tail.next, this.tail] = [this.tail, node, node]
    }

    remove(item: T): T | undefined {
        let curr = this.head
        for (let i = 0; curr && i < this.length; i++) {
            if (curr.value === item) break;
            curr = curr.next
        }
        if (!curr) return

        this.removeNode(curr)

        return curr?.value
    }

    get(idx: number): T | undefined {
        return this.getAt(idx)?.value
    }

    removeAt(idx: number): T | undefined {
        if (idx >= this.length) throw new Error("idx is out of bounds")

        const curr = this.getAt(idx)

        if (curr) this.removeNode(curr)

        return curr?.value
    }
    
    private getAt(idx: number): Node<T> | undefined {
        if (idx >= this.length) throw new Error("idx is out of bounds!")
        if (idx === 0) return this.head
        if (idx === this.length - 1) return this.tail

        let curr = this.head
        for (let i = 0; curr && i < idx; i++) {
            curr = curr.next
        }

        return curr
    }

    private removeNode(node: Node<T>): void {
        this.length--
        if (this.length === 0) this.head = this.tail = undefined

        if (node.prev) node.prev.next = node.next
        if (node.next) node.next.prev = node.prev

        if (node === this.head) this.head = node.next
        if (node === this.tail) this.tail = node.prev

        delete node.next
        delete node.prev

        node.value
    }
}
