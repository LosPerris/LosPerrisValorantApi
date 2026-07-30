import { createValorantEndpoint, BOT_CACHE_HEADERS, TEXT_HEADERS, errorResponse } from '../../../../../../utils/apiHelpers';
import * as valorantService from '../../../../../../services/valorantService';
import * as formatService from '../../../../../../services/formatService';

export const GET = createValorantEndpoint(async ({ region, puuid, format, lang, type, style, template, api_key }) => {
    // Obtenemos matches y MMR en paralelo para evitar llamadas secuenciales
    const [matchesData, mmrData] = await Promise.all([
        valorantService.getMatchesByPUUID(region, puuid, 'competitive', 1, api_key ?? undefined),
        valorantService.getMMRByPUUID(region, puuid, api_key ?? undefined)
    ]);

    if (!matchesData.data || matchesData.data.length === 0) {
        return errorResponse(404, 'No matches found');
    }

    const matchData = formatService.formatMatchData(matchesData.data[0], puuid);
    if (!matchData) return errorResponse(404, 'Player not found in match data');

    if (format === 'text') {
        const mmrChange = mmrData.status === 200 ? (mmrData.data?.current_data?.mmr_change_to_last_game ?? 0) : 0;
        return new Response(
            formatService.formatMatchText(matchData, lang, type, mmrChange, style, template),
            { status: 200, headers: TEXT_HEADERS }
        );
    }

    return new Response(JSON.stringify({ status: 200, data: matchData }), { status: 200, headers: BOT_CACHE_HEADERS });
});
