import { createValorantEndpoint, CACHE_HEADERS, errorResponse } from '../../../../../utils/apiHelpers';
import * as valorantService from '../../../../../services/valorantService';
import * as formatService from '../../../../../services/formatService';
import type { SummaryResponse, ValorantApiResponse, ValorantAccount } from '../../../../../types/valorant';
import cache from '../../../../../utils/cache';

export const GET = createValorantEndpoint(async ({ region, name, tag, puuid, accountData }) => {
    // ── Caché de nivel superior: sirve el summary completo sin tocar la API ──
    const summaryCacheKey = `summary:${region}:${name.toLowerCase()}:${tag.toLowerCase()}`;
    const cachedSummary = await cache.get<SummaryResponse>(summaryCacheKey);
    if (cachedSummary) {
        return new Response(JSON.stringify({ status: 200, data: cachedSummary }), { status: 200, headers: CACHE_HEADERS });
    }

    const accountRes = { status: 200, data: accountData } as ValorantApiResponse<ValorantAccount>;

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

    // Cachear resultado completo por 10 minutos (alineado con CDN y polling del overlay)
    await cache.set(summaryCacheKey, responseData, { ttl: 600 });

    return new Response(JSON.stringify({ status: 200, data: responseData }), { status: 200, headers: CACHE_HEADERS });
});
