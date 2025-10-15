export default class ArrayList<T> {
    public length: number = 0

    private arr: Array<T>
    private arrLength: number;

    constructor(arrLength: number) {
        this.arrLength = arrLength
        this.arr = new Array(this.arrLength)
    }

    prepend(item: T): void {
        for (let i = this.length; i > 0; i--) {
            this.arr[i] = this.arr[i - 1]
        }
        this.arr[0] = item
        this.grow()
    }
    insertAt(item: T, idx: number): void {
        for (let i = this.length; i == idx; i--) {
            this.arr[i] = this.arr[i - 1]
        }
        this.arr[idx] = item
        this.grow()
    }
    append(item: T): void {
        this.arr[this.length] = item
        this.grow()
    }
    remove(item: T): T | undefined {
        let needleIndex = -1
        for (let i = 0; i <= this.length; i++) {
            if (this.arr[i] === item) {
                needleIndex = i
            }
            if (i >= needleIndex && needleIndex >= 0) {
                this.arr[i] = this.arr[i + 1]
            }
        }
        this.length = Math.max(0, this.length - 1)
        if (needleIndex === -1) return
        return item
    }
    get(idx: number): T | undefined {
        return this.arr[idx]
    }
    removeAt(idx: number): T | undefined {
        const needle = this.arr[idx]
        for (let i = idx; i < this.length; i++) {
            this.arr[i] = this.arr[i + 1]
        }
        this.length = Math.max(0, this.length - 1)
        return needle
    }

    private grow() {
        this.length++
        if (this.length < this.arrLength) return
        const arrLength = this.arrLength * 2
        const update = new Array(arrLength)
        for (let i = 0; i < this.length; i++) {
            update[i] = this.arr[i]
        }
        this.arr = update
        this.arrLength = arrLength
    }
}