import { createValorantEndpoint, CACHE_HEADERS, TEXT_HEADERS, errorResponse } from '../../../../../../utils/apiHelpers';
import * as valorantService from '../../../../../../services/valorantService';
import * as formatService from '../../../../../../services/formatService';

export const GET = createValorantEndpoint(async ({ region, name, puuid, format, lang, type }) => {
    const todayData = await valorantService.getTodaySummary(region, puuid);
    if (!todayData) return errorResponse(404, 'No match history available');

    if (format === 'text') {
        return new Response(formatService.formatTodayText(todayData, lang, name, type), { status: 200, headers: TEXT_HEADERS });
    }

    return new Response(JSON.stringify({ status: 200, data: todayData }), { status: 200, headers: CACHE_HEADERS });
});
