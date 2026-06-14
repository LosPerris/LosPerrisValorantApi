import { Redis } from '@upstash/redis';

export const kv = new Redis({
  url: import.meta.env.REDIS_URL || import.meta.env.KV_REST_API_URL!,
  token: import.meta.env.REDIS_TOKEN || import.meta.env.KV_REST_API_TOKEN!,
});

const PREFIX = 'vlr_cache:';

const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            return await kv.get<T>(`${PREFIX}${key}`);
        } catch (e) {
            console.error('Redis GET Error:', e);
            return null; // Fallback to fetching normally if Redis fails
        }
    },
    
    async set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void> {
        try {
            // TTL en segundos (el config ya los define en segundos)
            const ttlSeconds = options?.ttl ?? 300; // Default: 5 minutos
            await kv.set(`${PREFIX}${key}`, value, { ex: ttlSeconds });
        } catch (e) {
            console.error('Redis SET Error:', e);
        }
    }
};

export default cache;
