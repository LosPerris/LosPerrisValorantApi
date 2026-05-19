import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError, sendResponse, setEdgeCache } from '../utils/helpers';
import { ValorantApiResponse, ValorantMMR } from '../types/valorant';

export const getRank = async (req: Request, res: Response) => {
    const region = req.params.region as string;
    const { accountData, puuid } = req;

    // Cacheamos la respuesta en el borde por 5 minutos
    setEdgeCache(res, 300);

    if (!accountData || !puuid) {
        return handleRouteError(req, res, { status: 404, message: 'Account not found' });
    }

    try {
        const mmrData: ValorantApiResponse<ValorantMMR> = await valorantService.getMMRByPUUID(region, puuid);

        if (mmrData.status === 200) {
            const formattedData = formatService.formatRankData(accountData, mmrData);
            sendResponse(req, res, formattedData, formatService.formatRankText, undefined, 300);
        } else {
            if (req.query.format === 'text') {
                return res.send(`Error: ${mmrData.message || 'Could not fetch rank'}`);
            }
            return res.status(mmrData.status).json(mmrData);
        }

    } catch (error: unknown) {
        return handleRouteError(req, res, error as { status?: number; message?: string; data?: unknown });
    }
};

