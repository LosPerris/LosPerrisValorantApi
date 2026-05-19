import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError, setEdgeCache } from '../utils/helpers';
import cache from '../utils/cache';
import { config } from '../config';
import {
    ValorantAccount,
    ValorantApiResponse,
    ValorantMMR,
    ValorantMatch,
    ValorantMMRHistoryItem,
    SummaryResponse
} from '../types/valorant';

export const getSummary = async (req: Request, res: Response) => {
    const region = req.params.region as string;
    const name = req.params.name as string;
    const tag = req.params.tag as string;

    try {
        setEdgeCache(res, 300);
        const cachedPuuid = valorantService.getCachedPUUID(name, tag);

        let accountData: ValorantApiResponse<ValorantAccount>;
        let mmrData: ValorantApiResponse<ValorantMMR>;
        let matchesData: ValorantApiResponse<ValorantMatch[]>;
        let historyData: ValorantApiResponse<ValorantMMRHistoryItem[]>;

        if (cachedPuuid) {
            [accountData, mmrData, matchesData, historyData] = await Promise.all([
                valorantService.getAccount(name, tag),
                valorantService.getMMRByPUUID(region, cachedPuuid),
                valorantService.getMatchesByPUUID(region, cachedPuuid, 'competitive', 1),
                valorantService.getMMRHistoryByPUUID(region, cachedPuuid)
            ]);
        } else {
            accountData = await valorantService.getAccount(name, tag);

            if (accountData.status !== 200) {
                return res.status(accountData.status).json(accountData);
            }

            const puuid = accountData.data.puuid;
            const cacheKey = `puuid:${name.toLowerCase()}:${tag.toLowerCase()}`;
            cache.set(cacheKey, puuid, { ttl: config.cacheTtl.account });

            [mmrData, matchesData, historyData] = await Promise.all([
                valorantService.getMMRByPUUID(region, puuid),
                valorantService.getMatchesByPUUID(region, puuid, 'competitive', 1),
                valorantService.getMMRHistoryByPUUID(region, puuid)
            ]);
        }

        if (accountData.status !== 200) {
            return res.status(accountData.status).json(accountData);
        }

        const puuid = accountData.data.puuid;
        const responseData: SummaryResponse = {
            account: accountData.data,
            rank: null,
            match: null,
            history: null
        };

        if (mmrData.status === 200) {
            responseData.rank = formatService.formatRankData(accountData, mmrData, name, tag);
        }

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];
            responseData.match = formatService.formatMatchData(lastMatch, puuid);
        }

        if (historyData.status === 200) {
            responseData.history = formatService.formatHistoryData(historyData);
        }

        return res.json({
            status: 200,
            data: responseData
        });

    } catch (error: unknown) {
        return handleRouteError(req, res, error as { status?: number; message?: string; data?: unknown });
    }
};
