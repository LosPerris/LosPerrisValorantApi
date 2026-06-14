import { createValorantEndpoint, CACHE_HEADERS, TEXT_HEADERS, errorResponse } from '../../../../../../utils/apiHelpers';
import * as valorantService from '../../../../../../services/valorantService';
import * as formatService from '../../../../../../services/formatService';

export const GET = createValorantEndpoint(async ({ region, name, puuid, format, lang, type }) => {
    const statsData = await valorantService.getGeneralStats(region, puuid);
    if (!statsData) return errorResponse(404, 'No match data available');

    if (format === 'text') {
        return new Response(formatService.formatStatsText(statsData, lang, name, type), { status: 200, headers: TEXT_HEADERS });
    }

    return new Response(JSON.stringify({ status: 200, data: statsData }), { status: 200, headers: CACHE_HEADERS });
});
