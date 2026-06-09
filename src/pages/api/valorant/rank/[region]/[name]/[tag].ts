import type { APIRoute } from 'astro';
import * as valorantService from '../../../../../../services/valorantService';
import * as formatService from '../../../../../../services/formatService';
import { errorResponse, validateRouteParams, resolvePUUID, CACHE_HEADERS, TEXT_HEADERS } from '../../../../../../utils/apiHelpers';
import type { ValorantApiResponse, ValorantAccount } from '../../../../../../types/valorant';

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
        const resolved = await resolvePUUID(name, tag);
        if (resolved.error) return resolved.error;

        const { puuid, accountData } = resolved;

        // accountData viene siempre de resolvePUUID cuando no hay error
        const accountRes = { status: 200, data: accountData } as ValorantApiResponse<ValorantAccount>;

        // Solo fetch de MMR — account ya resuelto sin doble-fetch
        const mmrData = await valorantService.getMMRByPUUID(region, puuid);

        if (mmrData.status !== 200) return errorResponse(mmrData.status, mmrData.message || 'MMR data unavailable');

        const rankData = formatService.formatRankData(accountRes, mmrData, name, tag);

        if (format === 'text') {
            return new Response(formatService.formatRankText(rankData, lang, type), { status: 200, headers: TEXT_HEADERS });
        }

        return new Response(JSON.stringify({ status: 200, data: rankData }), { status: 200, headers: CACHE_HEADERS });

    } catch (error: unknown) {
        const e = error as { status?: number; message?: string };
        return errorResponse(e?.status || 500, e?.message || 'Internal Server Error');
    }
};
