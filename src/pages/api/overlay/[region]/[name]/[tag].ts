import { validateRouteParams, resolvePUUID, errorResponse, checkRateLimit } from '../../../../../utils/apiHelpers';
import * as valorantService from '../../../../../services/valorantService';
import * as formatService from '../../../../../services/formatService';
import { translateRank } from '../../../../../services/formatService';
import cache from '../../../../../utils/cache';
import type { APIRoute } from 'astro';

const OVERLAY_TTL = 900;

const OVERLAY_CACHE_HEADERS = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=900',
};

export const GET: APIRoute = async (context) => {
    const { params, url } = context;
    const rawRegion = params.region as string;
    const name = params.name as string;
    const tag = params.tag as string;
    const lang = url.searchParams.get('lang') || 'en';

    const paramValidation = validateRouteParams(rawRegion, name, tag);
    if (!paramValidation.ok) return paramValidation.error;
    const { region } = paramValidation.data;

    const cacheKey = `overlay:${region}:${name.toLowerCase()}:${tag.toLowerCase()}`;
    const cached = await cache.get<any>(cacheKey);
    if (cached) {
        const data = { ...cached };
        if (data.tierNameRaw) {
            data.tierName = translateRank(data.tierNameRaw, lang);
        }
        return new Response(JSON.stringify({ status: 200, data }), {
            status: 200,
            headers: OVERLAY_CACHE_HEADERS,
        });
    }

    // Rate limit solo en cache miss — la CDN absorbe la mayoría de peticiones
    const ip = context.clientAddress || '127.0.0.1';
    const { allowed, retryAfter } = await checkRateLimit(`overlay:ip:${ip}`);
    if (!allowed) {
        return errorResponse(429, 'Rate limit exceeded. Please try again later.', { 'Retry-After': String(retryAfter) });
    }

    const resolved = await resolvePUUID(name, tag);
    if (resolved.error) return resolved.error;

    const { puuid, accountData } = resolved;

    const mmrData = await valorantService.getMMRByPUUID(region, puuid);
    if (mmrData.status !== 200) {
        return errorResponse(mmrData.status, mmrData.message || 'Error fetching MMR');
    }

    const accountRes = { status: 200 as const, data: accountData };
    const rankData = formatService.formatRankData(accountRes as any, mmrData, name, tag);

    const rawTierName = rankData.current_tier_patched || 'Unranked';
    const responseData = {
        name: rankData.name,
        tag: rankData.tag,
        tier: rankData.current_tier || 0,
        tierNameRaw: rawTierName,
        tierName: translateRank(rawTierName, lang),
        rr: rankData.ranking_in_tier || 0,
        iconUrl: rankData.rank_image || 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png',
        lastChange: rankData.mmr_change_to_last_game || 0,
    };

    await cache.set(cacheKey, responseData, { ttl: OVERLAY_TTL });

    return new Response(JSON.stringify({ status: 200, data: responseData }), {
        status: 200,
        headers: OVERLAY_CACHE_HEADERS,
    });
};