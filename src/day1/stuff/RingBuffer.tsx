// Ring, as a circle, where we put can have head after the tail or vice versa.
// Point is that all elements are riding like wagons of a train
// if circle does not fit, we create a biffer one!
// so tecnhically its a array, but head can be in any position as the tail.
// but under one condition, sequence of elements should be equal or less then the whole array

interface RingBuffer<T> {
    // operation O(1), we move tail making array content smaller, to the left
    pop(): T | undefined
    // operation O(1), we move tail making array content biggger, to the right
    // if the push causes length be bigger then allocated space, we create a bigger buffer and move it there to continue
    push(item: T): void
    // operation O(1), we move head making array content bigger, to the left
    // if the shift causes length be bigger then allocated space, we create a bigger buffer and move it there to continue
    shift(item: T): void
    // operation O(1), we move head making array content smaller, to the right
    unshift(): T | undefined
    // the most complicated part
    // operation O(1), we do .head + index
    // if .head + index more then length, then we go from start of a list as (.head + index - .length)
    // or (.head + index) % ,length
    // where we get an index of element we search for
    get(index: number): T | undefined
    length: number

    // // when implementing we keep track of:
    // head: number
    // tail: number
}

// the trick is that we keep array, but we connect start with end, 
// and manipulate head/tail to be at suitable position
// so we avoid shift/unshift moving whole array to fix the index count
// here we track index ourselves!