import type { APIRoute } from 'astro';
import * as valorantService from '../../../../../../services/valorantService';
import * as formatService from '../../../../../../services/formatService';
import { errorResponse, validateRouteParams, resolvePUUID, CACHE_HEADERS } from '../../../../../../utils/apiHelpers';
import type { SummaryResponse, ValorantApiResponse, ValorantAccount } from '../../../../../../types/valorant';
import cache from '../../../../../../utils/cache';

export const GET: APIRoute = async ({ params }) => {
    const region = params.region as string;
    const name = params.name as string;
    const tag = params.tag as string;

    const paramError = validateRouteParams(region, name, tag);
    if (paramError) return paramError;

    try {
        // ── Caché de nivel superior: sirve el summary completo sin tocar la API ──
        const summaryCacheKey = `summary:${region}:${name.toLowerCase()}:${tag.toLowerCase()}`;
        const cachedSummary = await cache.get<SummaryResponse>(summaryCacheKey);
        if (cachedSummary) {
            return new Response(JSON.stringify({ status: 200, data: cachedSummary }), { status: 200, headers: CACHE_HEADERS });
        }

        const resolved = await resolvePUUID(name, tag);
        if (resolved.error) return resolved.error;

        const { puuid, accountData: resolvedAccountData } = resolved;

        // Si accountData ya viene de resolvePUUID (caché), lo reutilizamos; si no, fetcheamos
        let accountRes: ValorantApiResponse<ValorantAccount>;
        if (resolvedAccountData) {
            accountRes = { status: 200, data: resolvedAccountData } as ValorantApiResponse<ValorantAccount>;
        } else {
            accountRes = await valorantService.getAccount(name, tag);
        }

        // Las 3 peticiones restantes en paralelo (sin account)
        const [mmrData, matchesData, historyData] = await Promise.all([
            valorantService.getMMRByPUUID(region, puuid),
            valorantService.getMatchesByPUUID(region, puuid, 'competitive', 1),
            valorantService.getMMRHistoryByPUUID(region, puuid)
        ]);

        if (accountRes.status !== 200) return errorResponse(accountRes.status, accountRes.message || 'Account error');

        const responseData: SummaryResponse = {
            account: accountRes.data,
            rank: null,
            match: null,
            history: null
        };

        if (mmrData.status === 200) {
            responseData.rank = formatService.formatRankData(accountRes, mmrData, name, tag);
        }

        if (matchesData.status === 200 && matchesData.data && matchesData.data.length > 0) {
            responseData.match = formatService.formatMatchData(matchesData.data[0], puuid);
        }

        if (historyData.status === 200) {
            responseData.history = formatService.formatHistoryData(historyData);
        }

        // Cachear resultado completo por 2 minutos
        await cache.set(summaryCacheKey, responseData, { ttl: 120 });

        return new Response(JSON.stringify({ status: 200, data: responseData }), { status: 200, headers: CACHE_HEADERS });

    } catch (error: unknown) {
        const e = error as { status?: number; message?: string };
        return errorResponse(e?.status || 500, e?.message || 'Internal Server Error');
    }
};
