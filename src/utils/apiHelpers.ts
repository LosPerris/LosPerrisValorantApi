import * as valorantService from '../services/valorantService';

// ─── Constantes de Headers compartidas por todos los endpoints ──────────────
export const JSON_HEADERS = { 'Content-Type': 'application/json' };
export const CACHE_HEADERS = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
};
export const TEXT_HEADERS = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
};

// Regiones válidas de Valorant
const VALID_REGIONS = new Set(['eu', 'na', 'ap', 'kr', 'latam', 'br']);

// ─── Respuesta de error estandarizada ───────────────────────────────────────
export function errorResponse(status: number, message: string): Response {
    return new Response(JSON.stringify({ status, error: message }), {
        status,
        headers: JSON_HEADERS
    });
}

// ─── Validación de parámetros de ruta ───────────────────────────────────────
export function validateRouteParams(
    region: string,
    name: string,
    tag: string
): Response | null {
    if (!region || !name || !tag) return errorResponse(400, 'Missing parameters');
    if (!VALID_REGIONS.has(region.toLowerCase())) {
        return errorResponse(400, `Invalid region. Valid values: ${[...VALID_REGIONS].join(', ')}`);
    }
    return null;
}

// ─── Resolución de PUUID con caché ──────────────────────────────────────────
// Centraliza la lógica que antes estaba copiada en los 5 endpoints.
export async function resolvePUUID(
    name: string,
    tag: string
): Promise<{ puuid: string; error?: never } | { puuid?: never; error: Response }> {
    let puuid = await valorantService.getCachedPUUID(name, tag);

    if (!puuid) {
        const accountRes = await valorantService.getPUUID(name, tag);
        if (accountRes.status !== 200) {
            return { error: errorResponse(accountRes.status, accountRes.message || 'Player not found') };
        }
        puuid = accountRes.data?.puuid;
    }

    if (!puuid) return { error: errorResponse(404, 'Player not found') };
    return { puuid };
}
