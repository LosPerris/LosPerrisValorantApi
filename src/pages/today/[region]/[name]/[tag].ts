import type { APIRoute } from 'astro';
import * as valorantService from '../../../../services/valorantService';
import * as formatService from '../../../../services/formatService';

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const CACHE_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };
const TEXT_HEADERS = { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

function errorResponse(status: number, message: string): Response {
    return new Response(JSON.stringify({ status, error: message }), { status, headers: JSON_HEADERS });
}

export const GET: APIRoute = async ({ params, request }) => {
    const region = params.region as string;
    const name = params.name as string;
    const tag = params.tag as string;

    if (!region || !name || !tag) return errorResponse(400, 'Missing parameters');

    const url = new URL(request.url);
    const format = url.searchParams.get('format');
    const lang = url.searchParams.get('lang') || 'es';
    const type = url.searchParams.get('type') || '1';

    try {
        // Resolve PUUID through the service (handles caching internally)
        let puuid = valorantService.getCachedPUUID(name, tag);
        if (!puuid) {
            const accountRes = await valorantService.getPUUID(name, tag);
            if (accountRes.status !== 200) return errorResponse(accountRes.status, accountRes.message || 'Player not found');
            puuid = accountRes.data?.puuid;
        }
        if (!puuid) return errorResponse(404, 'Player not found');

        const todayData = await valorantService.getTodaySummary(region, puuid);
        if (!todayData) return errorResponse(404, 'No match history available');

        if (format === 'text') {
            return new Response(formatService.formatTodayText(todayData, lang, name, type), { status: 200, headers: TEXT_HEADERS });
        }

        return new Response(JSON.stringify({ status: 200, data: todayData }), { status: 200, headers: CACHE_HEADERS });

    } catch (error: unknown) {
        const e = error as { status?: number; message?: string };
        return errorResponse(e?.status || 500, e?.message || 'Internal Server Error');
    }
};
