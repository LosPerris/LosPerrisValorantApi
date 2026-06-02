import type { APIRoute } from 'astro';
import * as valorantService from '../../../../services/valorantService';
import * as formatService from '../../../../services/formatService';
import { SummaryResponse } from '../../../../types/valorant';

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const CACHE_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

function errorResponse(status: number, message: string): Response {
    return new Response(JSON.stringify({ status, error: message }), { status, headers: JSON_HEADERS });
}

export const GET: APIRoute = async ({ params }) => {
    const region = params.region as string;
    const name = params.name as string;
    const tag = params.tag as string;

    if (!region || !name || !tag) return errorResponse(400, 'Missing parameters');

    try {
        // Resolve PUUID through the service (handles caching internally)
        let puuid = valorantService.getCachedPUUID(name, tag);
        if (!puuid) {
            const accountRes = await valorantService.getPUUID(name, tag);
            if (accountRes.status !== 200) return errorResponse(accountRes.status, accountRes.message || 'Player not found');
            puuid = accountRes.data?.puuid;
        }
        if (!puuid) return errorResponse(404, 'Player not found');

        // Fetch all data in parallel
        const [accountData, mmrData, matchesData, historyData] = await Promise.all([
            valorantService.getAccount(name, tag),
            valorantService.getMMRByPUUID(region, puuid),
            valorantService.getMatchesByPUUID(region, puuid, 'competitive', 1),
            valorantService.getMMRHistoryByPUUID(region, puuid)
        ]);

        if (accountData.status !== 200) return errorResponse(accountData.status, accountData.message || 'Account error');

        const responseData: SummaryResponse = {
            account: accountData.data,
            rank: null,
            match: null,
            history: null
        };

        if (mmrData.status === 200) {
            responseData.rank = formatService.formatRankData(accountData, mmrData, name, tag);
        }

        if (matchesData.status === 200 && matchesData.data && matchesData.data.length > 0) {
            responseData.match = formatService.formatMatchData(matchesData.data[0], puuid);
        }

        if (historyData.status === 200) {
            responseData.history = formatService.formatHistoryData(historyData);
        }

        return new Response(JSON.stringify({ status: 200, data: responseData }), { status: 200, headers: CACHE_HEADERS });

    } catch (error: unknown) {
        const e = error as { status?: number; message?: string };
        return errorResponse(e?.status || 500, e?.message || 'Internal Server Error');
    }
};
