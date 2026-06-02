type CacheItem = {
    value: unknown;
    expiry: number;
};

class SimpleCache {
    private cache = new Map<string, CacheItem>();
    private readonly MAX_SIZE = 500;

    set(key: string, value: unknown, options: { ttl: number }): void {
        if (this.cache.size >= this.MAX_SIZE) {
            this.sweep();
        }
        const expiry = Date.now() + options.ttl;
        this.cache.set(key, { value, expiry });
    }

    get(key: string): unknown {
        const item = this.cache.get(key);
        if (!item) return undefined;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return undefined;
        }

        return item.value;
    }

    private sweep(): void {
        const now = Date.now();
        for (const [key, item] of this.cache) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
    }
}

const cache = new SimpleCache();
export default cache;
