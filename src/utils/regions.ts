/**
 * Regiones públicas de la API (path) vs cluster Henrik.
 * LATAM/BR usan shard propio en MMR/matches; el historial MMR v1
 * solo entiende clusters globales (na/eu/ap/kr).
 */
type PublicRegion = 'eu' | 'na' | 'ap' | 'kr' | 'latam' | 'br';

function normalizeRegion(region: string): PublicRegion {
  return region.toLowerCase() as PublicRegion;
}

/** Región para endpoints by-puuid de MMR y matches. */
export function mapHenrikShardRegion(region: string): string {
  return normalizeRegion(region);
}

/**
 * Región para mmr-history v1 (clusters).
 * latam/br → na según comportamiento de Henrik.
 */
export function mapHenrikHistoryRegion(region: string): string {
  const r = normalizeRegion(region);
  if (r === 'latam' || r === 'br') return 'na';
  return r;
}
