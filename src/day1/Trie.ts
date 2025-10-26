type Node<T> = {
  value: number                         // Character this node represents (0-25)
  children: (Node<T> | undefined)[]     // Array of 26 slots for 'a'-'z'
  parent: Node<T> | null                // Direct reference to parent
  isWord?: boolean
}

const charOffset = 'a'.charCodeAt(0)

function charIdx(char: string): number {
  return char.charCodeAt(0) - charOffset
}

export default class Trie {
  private root: (Node<string> | undefined)[]  // Array of 26 slots at root level

  constructor() {
    this.root = new Array(26)
  }

  /**
   * Insert a word into the Trie
   * 
   * Time Complexity: O(m) where m is the length of the word
   *   - We traverse each character once: O(m)
   *   - Each character lookup in children array: O(1)
   *   - Node creation (if needed): O(1)
   * 
   * Space Complexity: O(m) in worst case
   *   - Creates at most m new nodes (one per character)
   *   - Each node has fixed size array of 26: O(1) per node
   *   - Total: O(m) new nodes created
   */
  insert(item: string): void {
    if (!item || item.length === 0) return
    
    const word = item.toLowerCase()  // O(m) - string conversion
    let currentChildren = this.root
    let parentNode: Node<string> | null = null

    // O(m) - iterate through each character
    for (let i = 0; i < word.length; i++) {
      const idx = charIdx(word[i])  // O(1) - arithmetic operation
      
      // Check if child exists at this index
      // O(1) - array access
      let childNode = currentChildren[idx]
      
      if (!childNode) {
        // O(1) - create new node with fixed-size array
        childNode = {
          value: idx,
          children: new Array(26),  // O(1) - fixed size allocation
          parent: parentNode
        }
        currentChildren[idx] = childNode  // O(1) - array assignment
      }
      
      parentNode = childNode
      currentChildren = childNode.children
    }
    
    // O(1) - mark as word
    if (parentNode) {
      parentNode.isWord = true
    }

    // console.log(this.debugTree())

  }

  /**
   * Delete a word from the Trie
   * 
   * Time Complexity: O(m) where m is the length of the word
   *   - Traverse to word end: O(m)
   *   - Traverse back up cleaning nodes: O(m) worst case
   *   - hasChildren check per node: O(26) = O(1) constant
   *   - Total: O(m)
   * 
   * Space Complexity: O(1)
   *   - Only uses constant extra space for variables
   *   - No new allocations, only deletions
   */
  delete(item: string): void {
    if (!item || item.length === 0) return
    
    const word = item.toLowerCase()  // O(m)
    let currentChildren = this.root
    let targetNode: Node<string> | null = null

    // O(m) - traverse to end of word
    for (let i = 0; i < word.length; i++) {
      const idx = charIdx(word[i])  // O(1)
      const childNode = currentChildren[idx]  // O(1)
      
      if (!childNode) {
        return  // Word doesn't exist
      }
      
      targetNode = childNode
      currentChildren = childNode.children
    }

    if (!targetNode || !targetNode.isWord) {
      return  // Not a complete word
    }

    // O(1) - unmark as word
    targetNode.isWord = false

    // O(m) - traverse back up, at most m nodes to check
    let nodeToDelete: Node<string> | null = targetNode
    
    while (nodeToDelete) {
      // O(26) = O(1) - check fixed-size array
      const hasChildren = nodeToDelete.children.some(child => child !== undefined)
      
      // If this node has children or is a word, stop deletion
      if (hasChildren || nodeToDelete.isWord) {
        break
      }
      
      const parent: Node<string> | null = nodeToDelete.parent
      const charValue = nodeToDelete.value
      
      // O(1) - remove node from parent
      if (parent) {
        parent.children[charValue] = undefined
      } else {
        // Parent is root
        this.root[charValue] = undefined
      }
      
      // Move up to parent
      nodeToDelete = parent
    }
  }

  /**
   * Find all words with given prefix (autocomplete)
   * 
   * Time Complexity: O(p + n) where:
   *   - p = length of prefix
   *   - n = total number of nodes in subtree
   *   
   *   - Navigate to prefix: O(p)
   *   - DFS traversal of subtree: O(n)
   *     - Visit each node once: O(n)
   *     - Check 26 children per node: O(26) = O(1) per node
   *   - Total: O(p + n)
   * 
   * Space Complexity: O(k * m) where:
   *   - k = number of matching words
   *   - m = average length of matching words
   *   
   *   - Results array stores k words: O(k * m)
   *   - Recursion depth: O(m) worst case (longest word)
   *   - Total: O(k * m + m) = O(k * m)
   */
  find(partial: string): string[] {
    if (!partial || partial.length === 0) {
      return this.getAllWords()
    }
    
    const prefix = partial.toLowerCase()  // O(p)
    let currentChildren = this.root
    let currentNode: Node<string> | undefined = undefined

    // O(p) - navigate to prefix node
    for (let i = 0; i < prefix.length; i++) {
      const idx = charIdx(prefix[i])  // O(1)
      const childNode = currentChildren[idx]  // O(1)
      
      if (!childNode) {
        return []  // Prefix doesn't exist
      }
      
      currentNode = childNode
      currentChildren = childNode.children
    }

    const results: string[] = []
    
    // O(1) - check if prefix is a word
    if (currentNode && currentNode.isWord) {
      results.push(prefix)
    }
    
    // O(n) - DFS collect all words from subtree
    this.collectWords(currentChildren, prefix, results)
    
    return results
  }

  /**
   * Recursively collect all words from a subtree
   * 
   * Time Complexity: O(n) where n is number of nodes in subtree
   *   - Visit each node exactly once
   *   - For each node, check 26 children: O(26) = O(1)
   *   - String concatenation per node: O(m) where m is current depth
   *   - Amortized: O(n)
   * 
   * Space Complexity: O(m) for recursion stack
   *   - Maximum recursion depth = longest word length
   */
  private collectWords(children: (Node<string> | undefined)[], prefix: string, results: string[]): void {
    // O(26) = O(1) - iterate through fixed-size array
    for (let i = 0; i < 26; i++) {
      const node = children[i]
      
      if (node) {
        const char = String.fromCharCode(i + charOffset)  // O(1)
        const currentWord = prefix + char  // O(m) - string concatenation
        
        if (node.isWord) {
          results.push(currentWord)  // O(1) amortized
        }
        
        // O(subtree_size) - recursive call
        this.collectWords(node.children, currentWord, results)
      }
    }
  }

  /**
   * Get all words in the Trie
   * 
   * Time Complexity: O(n) where n is total number of nodes
   *   - Same as collectWords with empty prefix
   * 
   * Space Complexity: O(k * m) where:
   *   - k = total number of words
   *   - m = average word length
   */
  private getAllWords(): string[] {
    const results: string[] = []
    this.collectWords(this.root, '', results)
    return results
  }


  /**
   * Debug helper to visualize tree structure (avoid circular refs)
   * 
   * Time Complexity: O(n) where n is number of nodes
   *   - Visit each node once to serialize
   * 
   * Space Complexity: O(n)
   *   - Creates serialized representation of entire tree
   */
  private debugTree(): string {
    const seen = new WeakSet<Node<string>>()
    
    const serializeNode = (node: Node<string> | undefined, depth: number = 0): any => {
      if (!node) return undefined
      if (seen.has(node)) return '[Circular]'
      
      seen.add(node)
      
      const result: any = {
        value: String.fromCharCode(node.value + charOffset), // Show as letter
        isWord: node.isWord || false,
        children: {}
      }
      
      // Serialize children
      for (let i = 0; i < 26; i++) {
        if (node.children[i]) {
          const char = String.fromCharCode(i + charOffset)
          result.children[char] = serializeNode(node.children[i], depth + 1)
        }
      }
      
      // Remove empty children object
      if (Object.keys(result.children).length === 0) {
        delete result.children
      }
      
      return result
    }
    
    const rootObj: any = { root: {} }
    
    for (let i = 0; i < 26; i++) {
      if (this.root[i]) {
        const char = String.fromCharCode(i + charOffset)
        rootObj.root[char] = serializeNode(this.root[i])
      }
    }
    
    return JSON.stringify(rootObj, null, 2)
  }

}
