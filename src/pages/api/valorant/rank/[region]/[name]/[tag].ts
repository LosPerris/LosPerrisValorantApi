import type { APIRoute } from 'astro';
import * as valorantService from '../../../../../../services/valorantService';
import * as formatService from '../../../../../../services/formatService';
import { errorResponse, validateRouteParams, resolvePUUID, CACHE_HEADERS, TEXT_HEADERS } from '../../../../../../utils/apiHelpers';

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

        const [accountData, mmrData] = await Promise.all([
            valorantService.getAccount(name, tag),
            valorantService.getMMRByPUUID(region, puuid)
        ]);

        if (accountData.status !== 200) return errorResponse(accountData.status, accountData.message || 'Account error');
        if (mmrData.status !== 200) return errorResponse(mmrData.status, mmrData.message || 'MMR data unavailable');

        const rankData = formatService.formatRankData(accountData, mmrData, name, tag);

        if (format === 'text') {
            return new Response(formatService.formatRankText(rankData, lang, type), { status: 200, headers: TEXT_HEADERS });
        }

        return new Response(JSON.stringify({ status: 200, data: rankData }), { status: 200, headers: CACHE_HEADERS });

    } catch (error: unknown) {
        const e = error as { status?: number; message?: string };
        return errorResponse(e?.status || 500, e?.message || 'Internal Server Error');
    }
};
