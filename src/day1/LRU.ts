type Node<T> = {
  value: T
  next?: Node<T>
  prev?: Node<T>
}

function createNode<T>(value: T): Node<T> {
  return { value }
}

export default class LRU<K, V> {
    private length: number;
    private head?: Node<V>
    private tail?: Node<V>

    private lookup: Map<K, Node<V>>;
    private reverseLookup: Map<Node<V>, K>;

    constructor(private capacity: number) {
      this.length = 0;
      this.lookup = new Map<K, Node<V>>()
      this.reverseLookup = new Map<Node<V>, K>()
    }

    update(key: K, value: V): void {
      // check if exists
      //  - if exists update value
      // check if capacity reached
      //  - evict least used (the tail)
      //  - insert value
    
      let node = this.lookup.get(key)
      if (!node) {
        node = createNode(value)
        this.length++
        this.prepend(node)
        this.trimCache()
        this.lookup.set(key, node)
        this.reverseLookup.set(node, key)
      } 

      if (node) {
        this.detach(node)
        this.prepend(node)
      }
    }

    get(key: K): V | undefined {
      // check if exists
      //  - if not return undefined
      //  - if exists, relink connection and reorginize element to be first (make the new head)
      //  - return value 
      const node = this.lookup.get(key)
      if (!node) return undefined

      this.detach(node)
      this.prepend(node)

      return node.value
    }

    private detach(node: Node<V>) {
      
      if (node.prev) {
        node.prev.next = node.next
      }

      if (node.next) {
        node.next.prev = node.prev
      }

      if (this.head === node) {
        this.head = this.head.next
      }

      if (this.tail === node) {
        this.tail = this.tail.prev
      }

      node.next = undefined
      node.prev = undefined
    }

    private prepend(node: Node<V>) {
      if (!this.head) {
        this.head = this.tail = node
        return
      }

      if (this.head) {
        node.next = this.head
        this.head.prev = node
        this.head = node
      }
    }

    private trimCache() {
      if (this.length <= this.capacity) return

      const tail = this.tail
      this.detach(tail as Node<V>)

      const key = this.reverseLookup.get(tail as Node<V>) as K;
      this.lookup.delete(key)
      this.reverseLookup.delete(tail as Node<V>)

      this.length--
    }

}
