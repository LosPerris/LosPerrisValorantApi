import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError, sendResponse } from '../utils/helpers';
import { ValorantApiResponse, ValorantMMR } from '../types/valorant';

export const getRank = async (req: Request, res: Response) => {
    const { region } = req.params;
    const { accountData, puuid } = req;

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

    } catch (error) {
        handleRouteError(req, res, error);
    }
};
