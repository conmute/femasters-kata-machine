// Option A: like in the course

type Node<T> = {
    value: T
    next?: Node<T>
}

export default class Queue<T> {
    public length: number = 0;
    private head?: Node<T>;
    private tail?: Node<T>;

    constructor() {}

    enqueue(item: T): void {
        const node = { value: item }
        // Note: this.tail before !this.tail, so they done collide
        if (this.tail) this.tail = this.tail.next = node
        if (!this.tail) this.tail = this.head = node
        this.length++
    }

    deque(): T | undefined {
        if (!this.head) return

        const result = this.head
        this.head = result.next

        // free memory
        delete result.next

        this.length--

        if (this.length <= 1) this.tail = this.head

        return result.value
    }

    peek(): T | undefined {
        return this.head?.value
    }
}

// Option B: using LLNode class

// // Mistakes:
// // 1. Calculating always length, instead of setting it on deque/enqueue
// // 2. we dont need prev and we have to much of a structure code
// interface LinkedListNode<T> {
//     value: T
//     next?: LinkedListNode<T>
//     prev?: LinkedListNode<T>
// }

// class LLNode<T> implements LinkedListNode<T> {
//     constructor(public value: T) {
//         // blank
//     }

//     next?: LinkedListNode<T>
//     prev?: LinkedListNode<T>
// }

// export default class Queue<T> {
//     private head?: LinkedListNode<T>
//     private tail?: LinkedListNode<T>

//     constructor() {
//     }

//     get length(): number {
//         let current = this.head
//         let index = 0
//         do {
//             if (current) index++
//             if (!current) break
//         } while (current = current.next)
//         return index
//     }

//     enqueue(item: T): void {
//         if (!this.head || !this.tail) {
//             this.head = this.tail = new LLNode(item)
//             return
//         }
//         this.tail.next = new LLNode(item)
//         this.tail = this.tail.next
//     }
//     deque(): T | undefined {
//         if (!this.head) return

//         const current = this.head
//         this.head = this.head.next
//         delete current.next
//         return current.value
//     }
//     peek(): T | undefined {
//         return this.head?.value
//     }
// }
