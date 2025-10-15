// Note: we can just use { value, prev?, next? } objects
// Note: We can just name Node and use it in the list
// Note: This has no tests and lives for sake of a drill only

interface  LinkedList<T> {
    get length(): number;
    insertAt(item: LinkedListNode<T>, index: number): void;
    remove(item: LinkedListNode<T>): LinkedListNode<T> | undefined;
    removeAt(index: number): LinkedListNode<T> | undefined;
    append(item: LinkedListNode<T>): void;
    prepend (item: LinkedListNode<T>): void;
    get(index: number): LinkedListNode<T> | undefined;
}

interface LinkedListNode<T> {
    value: T
    next?: LinkedListNode<T>
    prev?: LinkedListNode<T>
}

class LLNode<T> implements LinkedListNode<T> {
    constructor(public value: T) {
        // blank
    }

    next?: LinkedListNode<T>
    prev?: LinkedListNode<T>
}

class LL<T> implements LinkedList<T> {
    head?: LinkedListNode<T>
    tail?: LinkedListNode<T>
    get length (): number {
        let pointer = this.head
        let index = 0
        while (pointer) {
            pointer = pointer.next
            index++
        }
        return index
    }
    insertAt(item: LinkedListNode<T>, index: number): void {
        const current = this.get(index)
        if (!current) return
        const prev = current.prev
        if (prev) prev.next = item
        item.next = current
        item.prev = prev
    }
    remove (item: LinkedListNode<T>): LinkedListNode<T> | undefined {
        const prev = item.prev
        const next = item.next
        item.prev = item.next = undefined
        if (prev) prev.next = next
        if (next) next.prev = prev
        return item
    }
    removeAt (index: number): LinkedListNode<T> | undefined {
        const current = this.get(index)
        if (current) this.remove(current)
        return current
    }

    append (item: LinkedListNode<T>): void {
        if (this.tail) {
            this.tail.next = item
            this.tail = item
        }
        if (!this.head) {
            this.head = item
        }
        if (!this.tail) {
            this.tail = item
        }
    }
    
    prepend (item: LinkedListNode<T>): void {
        if (this.head) {
            this.head.prev = item
            item.next = this.head
            this.head = item
        }
        if (!this.head) {
            this.head = item
        }
        if (!this.tail) {
            this.tail = item
        }
    }

    get (index: number): LinkedListNode<T> | undefined {
        if (!this.head) return
        let current = this.head
        for (let i = 0; i + 1 < index; i++) {
            if (!current || !current.next) break;
            current = current.next
        }
        return current
    }
}
