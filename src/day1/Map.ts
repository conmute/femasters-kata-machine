type Entry<T, V> = {
    key: T;
    value: V;
};

export default class Map<T extends (string | number), V> {
    private buckets: Array<Array<Entry<T, V>>>;
    private capacity: number;
    private count: number;
    private loadFactor: number;

    constructor(initialCapacity: number = 10, loadFactor: number = 0.7) {
        this.capacity = initialCapacity;
        this.loadFactor = loadFactor;
        this.count = 0;
        this.buckets = new Array(this.capacity);
        
        // Initialize each bucket as an empty array
        for (let i = 0; i < this.capacity; i++) {
            this.buckets[i] = [];
        }
    }

    private hash(key: T): number {
        let hash = 0;
        const str = String(key);
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);

            // // Option original idea: Use math with prime number to increase high distriburion rate
            // hash = (hash * 31 + char) | 0;

            // Option bit manipulation: be a smartass, and use quicker way of myltiplying by moving digits
            hash = ((hash << 5) - hash) + char;
            hash = hash >>> 0; // Convert to 32-bit integer
        }
        
        return Math.abs(hash) % this.capacity;
    }

    private resize(): void {
        const oldBuckets = this.buckets;
        this.capacity *= 2;
        this.buckets = new Array(this.capacity);
        this.count = 0;
        
        // Initialize new buckets
        for (let i = 0; i < this.capacity; i++) {
            this.buckets[i] = [];
        }
        
        // Rehash all existing entries
        for (const bucket of oldBuckets) {
            for (const entry of bucket) {
                this.set(entry.key, entry.value);
            }
        }
    }

    get(key: T): V | undefined {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        for (const entry of bucket) {
            if (entry.key === key) {
                return entry.value;
            }
        }
        
        return undefined;
    }

    set(key: T, value: V): void {
        // Check if we need to resize before inserting
        if (this.count / this.capacity >= this.loadFactor) {
            this.resize();
        }
        
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        // Check if key already exists, update if so
        for (const entry of bucket) {
            if (entry.key === key) {
                entry.value = value;
                return;
            }
        }
        
        // Key doesn't exist, add new entry
        bucket.push({ key, value });
        this.count++;
    }

    delete(key: T): V | undefined {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                const value = bucket[i].value;
                bucket.splice(i, 1);
                this.count--;
                return value;
            }
        }
        
        return undefined;
    }

    size(): number {
        return this.count;
    }
}
