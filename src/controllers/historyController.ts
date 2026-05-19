import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError, setEdgeCache } from '../utils/helpers';
import { ValorantApiResponse, ValorantMMRHistoryItem } from '../types/valorant';

export const getHistory = async (req: Request, res: Response) => {
    const region = req.params.region as string;
    const { puuid } = req;

    if (!puuid) {
        return handleRouteError(req, res, { status: 404, message: 'Account not found' });
    }

    try {
        setEdgeCache(res, 600);

        const historyData: ValorantApiResponse<ValorantMMRHistoryItem[]> = await valorantService.getMMRHistoryByPUUID(region, puuid);

        if (historyData.status === 200) {
            const formattedHistory = formatService.formatHistoryData(historyData);

            return res.json({
                status: 200,
                data: formattedHistory
            });
        } else {
            return res.status(historyData.status).json(historyData);
        }

    } catch (error: unknown) {
        return handleRouteError(req, res, error as { status?: number; message?: string; data?: unknown });
    }
};

