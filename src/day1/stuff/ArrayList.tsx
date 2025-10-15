// Note: Arrays (true, not javascript Array object) cannot grow!
interface ArrayList<T> {
    // operation O(1), we just peek at the address
    get(index: number): T | undefined
    // operation O(1), if excedes length, new array is created twice bigger, copied and then pushed
    // push to the tail
    push(item: T): void
    // operation O(1), return undefined if all used
    // pop from the tail
    pop(): T | undefined
    // moves item before the head item
    // operation O(n), we shift all items by 1, then add the item as the first element
    shift(item: T): void
    // moves item from head, and returns if any
    // operation O(n), we get head value, we shift all next items closer to the start of the array
    unshift(): T | undefined
    // just holding count of items, should update on all methods above
    length: number
}
