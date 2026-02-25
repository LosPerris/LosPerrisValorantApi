import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError, sendResponse, setEdgeCache } from '../utils/helpers';
import { ValorantApiResponse, ValorantMMR } from '../types/valorant';

export const getRank = async (req: Request, res: Response) => {
    const { region } = req.params;
    const { accountData, puuid } = req;

    // Cacheamos la respuesta en el borde por 1 minuto
    setEdgeCache(res, 60);

    if (!accountData) {
        return handleRouteError(req, res, { status: 404, message: 'Account not found' });
    }

    try {
        const mmrData: ValorantApiResponse<ValorantMMR> = await valorantService.getMMRByPUUID(region, puuid as string);

        if (mmrData.status === 200) {
            const formattedData = formatService.formatRankData(accountData, mmrData);
            sendResponse(req, res, formattedData, formatService.formatRankText);
        } else {
            if (req.query.format === 'text') {
                return res.send(`Error: ${mmrData.message || 'Could not fetch rank'}`);
            }
            return res.status(mmrData.status).json(mmrData);
        }

    } catch (error: unknown) {
        handleRouteError(req, res, error as { status?: number; message?: string; data?: unknown });
    }
};
