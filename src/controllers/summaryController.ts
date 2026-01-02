import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError } from '../utils/helpers';

export const getSummary = async (req: Request, res: Response) => {
    const { region, name, tag } = req.params;

    try {
        const accountData = await valorantService.getPUUID(name, tag);

        if (accountData.status !== 200) {
            return res.status(accountData.status).json(accountData);
        }

        const puuid = accountData.data.puuid;

        const [mmrData, matchesData, historyData] = await Promise.all([
            valorantService.getMMRByPUUID(region, puuid),
            valorantService.getMatchesByPUUID(region, puuid, 'competitive'),
            valorantService.getMMRHistoryByPUUID(region, puuid)
        ]);

        const responseData: any = {
            account: accountData.data,
            rank: null,
            match: null,
            history: null
        };

        if (mmrData.status === 200) {
            responseData.rank = formatService.formatRankData(accountData, mmrData);
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

    } catch (error: any) {
        return handleRouteError(req, res, error);
    }
};
