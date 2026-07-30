import { createValorantEndpoint, BOT_CACHE_HEADERS, TEXT_HEADERS, errorResponse } from '../../../../../utils/apiHelpers';
import * as valorantService from '../../../../../services/valorantService';
import * as formatService from '../../../../../services/formatService';
import type { ValorantApiResponse, ValorantAccount } from '../../../../../types/valorant';

export const GET = createValorantEndpoint(async ({ region, name, tag, puuid, accountData, format, lang, type, style, template, api_key }) => {
    // accountData viene siempre de resolvePUUID cuando no hay error
    const accountRes = { status: 200, data: accountData } as ValorantApiResponse<ValorantAccount>;

    // Solo fetch de MMR — account ya resuelto sin doble-fetch
    const mmrData = await valorantService.getMMRByPUUID(region, puuid, api_key ?? undefined);

    if (mmrData.status !== 200) return errorResponse(mmrData.status, mmrData.message || 'MMR data unavailable');

    const rankData = formatService.formatRankData(accountRes, mmrData, name, tag);

    if (format === 'text') {
        return new Response(formatService.formatRankText(rankData, lang, type, style, template), {
            status: 200,
            headers: TEXT_HEADERS
        });
    }

    return new Response(JSON.stringify({ status: 200, data: rankData }), { status: 200, headers: BOT_CACHE_HEADERS });
});
