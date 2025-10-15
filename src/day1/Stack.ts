type Node<T> = {
    value: T
    next?: Node<T>
}

export default class Stack<T> {
    public length: number = 0;
    private head?: Node<T>

    constructor() {
    }

    push(item: T): void {
        // Note: the this.head before !this.head, so they dont collide
        const node: Node<T> = { value: item }
        if (this.head) {
            node.next = this.head
            this.head = node
        }
        if (!this.head) {
            this.head = node
        }
        this.length++
    }

    pop(): T | undefined {
        if (!this.head) return

        const node = this.head
        this.head = node.next

        delete node.next
        // Note: keep at 0 if we keep using .pop()
        this.length = Math.max(this.length - 1, 0)

        return node.value
    }

    peek(): T | undefined {
        return this.head?.value
    }
}