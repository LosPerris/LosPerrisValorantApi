import * as valorantService from '../services/valorantService';
import type { ValorantAccount } from '../types/valorant';

// ─── Constantes de Headers compartidas por todos los endpoints ──────────────
export const JSON_HEADERS = { 'Content-Type': 'application/json' };
export const CACHE_HEADERS = {
    'Content-Type': 'application/json',
    // Alineado con TTL Redis de datos de jugador (~5–10 min)
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
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
    format: z
        .string()
        .nullable()
        .optional()
        .transform((v) => (v ? v.toLowerCase() : v)),
    lang: z
        .string()
        .default('es')
        .transform((v) => v.toLowerCase())
        .pipe(z.enum(['es', 'en', 'pt']).catch('es')),
    type: z
        .string()
        .default('1')
        .pipe(z.enum(['1', '2', '3']).catch('1')),
    style: z
        .string()
        .default('default')
        .transform((v) => v.toLowerCase())
        .pipe(z.enum(['default', 'clean', 'custom']).catch('default')),
    template: z.string().nullable().optional(),
});

import { kv } from './cache';

// Rate limit pensado para bots (IPs compartidas Nightbot/SE): 60 req/min por IP.
// TTL fijo: EXPIRE solo si falta (evita claves eternas y bans que se alargan).
const RL_WINDOW_SECONDS = 60;
const RL_LIMIT = 60;

export async function checkRateLimit(
    key: string,
): Promise<{ allowed: boolean; retryAfter: number }> {
    const rateLimitKey = `rate_limit:${key}`;
    try {
        const count = Number(await kv.incr(rateLimitKey)) || 0;
        let ttl = Number(await kv.ttl(rateLimitKey));
        if (ttl < 0) {
            await kv.expire(rateLimitKey, RL_WINDOW_SECONDS);
            ttl = RL_WINDOW_SECONDS;
        }
        return {
            allowed: count <= RL_LIMIT,
            retryAfter: Math.max(1, ttl),
        };
    } catch (e) {
        console.warn('Redis rate limit check failed, failing open:', e);
        return { allowed: true, retryAfter: 1 };
    }
}

// ─── Estadísticas Globales (Redis) ──────────────────────────────────────────
// Coste bajo: 1 pipeline (1 RTT) por petición — total, suma de ms y muestras para la media.
const REQUESTS_KEY = 'vlr_requests_total';
const LATENCY_SUM_KEY = 'vlr_latency_sum';
const LATENCY_SAMPLES_KEY = 'vlr_latency_samples';

/** Cuenta la petición y acumula latencia para la media (un solo round-trip a Redis). */
export async function recordRequestMetrics(durationMs: number) {
    try {
        const safeMs = Math.max(0, Math.round(durationMs));
        await kv
            .pipeline()
            .incr(REQUESTS_KEY)
            .incrby(LATENCY_SUM_KEY, safeMs)
            .incr(LATENCY_SAMPLES_KEY)
            .exec();
    } catch (e) {
        console.warn('Failed to record request metrics:', e);
    }
}

export async function getRequestMetrics(): Promise<{ requests: number; latency: number }> {
    try {
        const [requests, sum, samples] = await Promise.all([
            kv.get<number>(REQUESTS_KEY),
            kv.get<number>(LATENCY_SUM_KEY),
            kv.get<number>(LATENCY_SAMPLES_KEY)
        ]);
        const total = Number(requests) || 0;
        const sampleCount = Number(samples) || 0;
        const latencySum = Number(sum) || 0;
        return {
            requests: total,
            latency: sampleCount > 0 ? Math.round(latencySum / sampleCount) : 0
        };
    } catch (e) {
        console.warn('Failed to read request metrics:', e);
        return { requests: 0, latency: 0 };
    }
}

// ─── Respuesta de error estandarizada ───────────────────────────────────────
export function errorResponse(
    status: number,
    message: string,
    extraHeaders: Record<string, string> = {},
): Response {
    return new Response(JSON.stringify({ status, error: message }), {
        status,
        headers: { ...JSON_HEADERS, ...extraHeaders },
    });
}

// ─── Validación de parámetros de ruta ───────────────────────────────────────
export function validateRouteParams(
    region: string,
    name: string,
    tag: string,
):
    | { ok: true; data: { region: string; name: string; tag: string } }
    | { ok: false; error: Response } {
    const result = RouteParamsSchema.safeParse({
        region: region?.toLowerCase(),
        name,
        tag,
    });
    if (!result.success) {
        return { ok: false, error: errorResponse(400, result.error.issues[0].message) };
    }
    return { ok: true, data: result.data };
}

export function validateQueryParams(
    format: string | null,
    lang: string | null,
    type: string | null,
    style: string | null = null,
    template: string | null = null
):
    | { success: false; error: Response }
    | {
          success: true;
          data: {
              format?: string | null;
              lang: string;
              type: string;
              style: 'default' | 'clean' | 'custom';
              template?: string | null;
          };
      } {
    const result = QueryParamsSchema.safeParse({
        format,
        lang: lang || undefined,
        type: type || undefined,
        style: style || undefined,
        template: template ?? undefined
    });
    if (!result.success) {
        return { success: false, error: errorResponse(400, result.error.issues[0].message) };
    }
    return {
        success: true,
        data: result.data as {
            format?: string | null;
            lang: string;
            type: string;
            style: 'default' | 'clean' | 'custom';
            template?: string | null;
        }
    };
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
    style: 'default' | 'clean' | 'custom';
    template: string | null;
    url: URL;
}, context: APIContext) => Promise<Response>;

export function createValorantEndpoint(handler: ValorantEndpointHandler): APIRoute {
    return async (context: APIContext) => {
        const started = Date.now();
        const { params, request, clientAddress } = context;
        const rawRegion = params.region as string;
        const name = params.name as string;
        const tag = params.tag as string;

        const paramValidation = validateRouteParams(rawRegion, name, tag);
        if (!paramValidation.ok) return paramValidation.error;
        const { region } = paramValidation.data;

        // Rate Limit usando Astro clientAddress (seguro frente a spoofing de X-Forwarded-For)
        const ip = clientAddress || '127.0.0.1';
        const { allowed, retryAfter } = await checkRateLimit(`ip:${ip}`);
        if (!allowed) {
            return errorResponse(
                429,
                'Rate limit exceeded. Please try again later.',
                { 'Retry-After': String(retryAfter) },
            );
        }

        const url = new URL(request.url);
        const formatParam = url.searchParams.get('format');
        const langParam = url.searchParams.get('lang');
        const typeParam = url.searchParams.get('type');
        const styleParam = url.searchParams.get('style');
        const templateParam = url.searchParams.get('template');

        const queryValidation = validateQueryParams(
            formatParam,
            langParam,
            typeParam,
            styleParam,
            templateParam
        );
        if (!queryValidation.success) return queryValidation.error;

        const { format, lang, type, style, template } = queryValidation.data;

        try {
            const resolved = await resolvePUUID(name, tag);
            if (resolved.error) {
                // await: en Vercel el proceso se congela al responder y un void no llega a Redis
                await recordRequestMetrics(Date.now() - started);
                return resolved.error;
            }

            const response = await handler(
                {
                    region,
                    name,
                    tag,
                    puuid: resolved.puuid,
                    accountData: resolved.accountData,
                    format: format || null,
                    lang,
                    type,
                    style,
                    template: template ?? null,
                    url
                },
                context
            );
            await recordRequestMetrics(Date.now() - started);
            return response;
        } catch (error: unknown) {
            await recordRequestMetrics(Date.now() - started);
            console.error(`[API Error] ${request.url}:`, error);
            const errObj = error as Record<string, unknown>;
            const status = typeof errObj?.status === 'number' ? errObj.status : 500;
            const message = typeof errObj?.message === 'string' ? errObj.message : 'Internal Server Error';
            return errorResponse(status, message);
        }
    };
}

