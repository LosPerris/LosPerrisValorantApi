import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
    max: 2000, // Aumentamos capacidad aprovechando la RAM disponible
    ttl: 5 * 60 * 1000, // TTL por defecto de 5 minutos (más razonable para datos de juego)
    updateAgeOnGet: true
});

export default cache;
