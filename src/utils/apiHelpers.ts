import * as valorantService from '../services/valorantService';
import type { ValorantAccount } from '../types/valorant';

// ─── Constantes de Headers compartidas por todos los endpoints ──────────────
export const JSON_HEADERS = { 'Content-Type': 'application/json' };
export const CACHE_HEADERS = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
};
export const TEXT_HEADERS = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
};

import { z } from 'zod';

const RouteParamsSchema = z.object({
    region: z.enum(['eu', 'na', 'ap', 'kr', 'latam', 'br'], {
        message: 'Invalid region. Valid values: eu, na, ap, kr, latam, br'
    }),
    name: z.string().min(1, 'Name is required'),
    tag: z.string().min(1, 'Tag is required')
});

const QueryParamsSchema = z.object({
    format: z.string().nullable().optional(),
    lang: z.string().default('es'),
    type: z.string().default('1')
});

import { kv } from './cache';

// Rate Limiter distribuido (Redis)
// Permite 1 petición por segundo por clave
export async function checkRateLimit(key: string): Promise<boolean> {
    const rateLimitKey = `rate_limit:${key}`;
    try {
        const count = await kv.incr(rateLimitKey);
        if (count === 1) {
            await kv.expire(rateLimitKey, 1); // ventana de 1 segundo
        }
        return count <= 1;
    } catch(e) {
        console.warn('Redis rate limit check failed, failing open:', e);
        return true; // fail-open si redis falla
    }
}

// ─── Estadísticas Globales ──────────────────────────────────────────────────
export async function incrementRequestCount() {
    try {
        await kv.incr('vlr_requests_total');
    } catch(e) {
        console.warn('Failed to increment request count:', e);
    }
}

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
    const result = RouteParamsSchema.safeParse({ region: region?.toLowerCase(), name, tag });
    if (!result.success) {
        return errorResponse(400, result.error.issues[0].message);
    }
    return null;
}

export function validateQueryParams(
    format: string | null,
    lang: string | null,
    type: string | null
): { success: false, error: Response } | { success: true, data: { format?: string | null, lang: string, type: string } } {
    const result = QueryParamsSchema.safeParse({ format, lang: lang || undefined, type: type || undefined });
    if (!result.success) {
        return { success: false, error: errorResponse(400, result.error.issues[0].message) };
    }
    return { success: true, data: result.data as { format?: string | null, lang: string, type: string } };
}

// ─── Resolución de PUUID con caché ──────────────────────────────────────────
// Centraliza la lógica que antes estaba copiada en los 5 endpoints.
export async function resolvePUUID(
    name: string,
    tag: string
): Promise<{ puuid: string; accountData: ValorantAccount; error?: never } | { puuid?: never; accountData?: never; error: Response }> {
    let accountData = await valorantService.getCachedAccount(name, tag);

    if (!accountData) {
        const accountRes = await valorantService.getPUUID(name, tag);
        if (accountRes.status !== 200) {
            return { error: errorResponse(accountRes.status, accountRes.message || 'Player not found') };
        }
        accountData = accountRes.data;
    }

    if (!accountData || !accountData.puuid) return { error: errorResponse(404, 'Player not found') };
    return { puuid: accountData.puuid, accountData };
}

// ─── Wrapper para Endpoints ─────────────────────────────────────────────────
import type { APIRoute, APIContext } from 'astro';

export type ValorantEndpointHandler = (params: {
    region: string;
    name: string;
    tag: string;
    puuid: string;
    accountData: ValorantAccount;
    format: string | null;
    lang: string;
    type: string;
    url: URL;
}, context: APIContext) => Promise<Response>;

export function createValorantEndpoint(handler: ValorantEndpointHandler): APIRoute {
    return async (context: APIContext) => {
        const { params, request, clientAddress } = context;
        const region = params.region as string;
        const name = params.name as string;
        const tag = params.tag as string;

        const paramError = validateRouteParams(region, name, tag);
        if (paramError) return paramError;

        // Rate Limit usando Astro clientAddress (seguro frente a spoofing de X-Forwarded-For)
        const ip = clientAddress || '127.0.0.1';
        const isAllowed = await checkRateLimit(`ip:${ip}`);
        if (!isAllowed) {
            return errorResponse(429, 'Rate limit exceeded. Please try again later.');
        }

        incrementRequestCount().catch(() => {});

        const url = new URL(request.url);
        const formatParam = url.searchParams.get('format');
        const langParam = url.searchParams.get('lang');
        const typeParam = url.searchParams.get('type');

        const queryValidation = validateQueryParams(formatParam, langParam, typeParam);
        if (!queryValidation.success) return queryValidation.error;
        
        const { format, lang, type } = queryValidation.data;

        try {
            const resolved = await resolvePUUID(name, tag);
            if (resolved.error) return resolved.error;

            return await handler({
                region, name, tag,
                puuid: resolved.puuid,
                accountData: resolved.accountData,
                format: format || null, 
                lang, 
                type, 
                url
            }, context);
        } catch (error: unknown) {
            console.error(`[API Error] ${request.url}:`, error);
            const errObj = error as Record<string, unknown>;
            const status = typeof errObj?.status === 'number' ? errObj.status : 500;
            const message = typeof errObj?.message === 'string' ? errObj.message : 'Internal Server Error';
            return errorResponse(status, message);
        }
    };
}

