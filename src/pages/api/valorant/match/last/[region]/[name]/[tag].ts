import type { APIRoute } from 'astro';
import * as valorantService from '../../../../../../../services/valorantService';
import * as formatService from '../../../../../../../services/formatService';
import { errorResponse, validateRouteParams, resolvePUUID, CACHE_HEADERS, TEXT_HEADERS } from '../../../../../../../utils/apiHelpers';

export const GET: APIRoute = async ({ params, request }) => {
    const region = params.region as string;
    const name = params.name as string;
    const tag = params.tag as string;

    const paramError = validateRouteParams(region, name, tag);
    if (paramError) return paramError;

    const url = new URL(request.url);
    const format = url.searchParams.get('format');
    const lang = url.searchParams.get('lang') || 'es';
    const type = url.searchParams.get('type') || '1';

    try {
        const { puuid, error } = await resolvePUUID(name, tag);
        if (error) return error;

        // Obtenemos matches y MMR en paralelo para evitar llamadas secuenciales
        const [matchesData, mmrData] = await Promise.all([
            valorantService.getMatchesByPUUID(region, puuid, 'competitive', 1),
            valorantService.getMMRByPUUID(region, puuid)
        ]);

        if (!matchesData.data || matchesData.data.length === 0) {
            return errorResponse(404, 'No matches found');
        }

        const matchData = formatService.formatMatchData(matchesData.data[0], puuid);
        if (!matchData) return errorResponse(404, 'Player not found in match data');

        if (format === 'text') {
            const mmrChange = mmrData.status === 200 ? (mmrData.data?.current_data?.mmr_change_to_last_game ?? 0) : 0;
            return new Response(formatService.formatMatchText(matchData, lang, type, mmrChange), { status: 200, headers: TEXT_HEADERS });
        }

        return new Response(JSON.stringify({ status: 200, data: matchData }), { status: 200, headers: CACHE_HEADERS });

    } catch (error: unknown) {
        const e = error as { status?: number; message?: string };
        return errorResponse(e?.status || 500, e?.message || 'Internal Server Error');
    }
};
