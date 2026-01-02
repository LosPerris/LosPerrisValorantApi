import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError } from '../utils/helpers';

export const getHistory = async (req: Request, res: Response) => {
    const { region } = req.params;
    const { puuid } = req;

    try {
        const historyData = await valorantService.getMMRHistoryByPUUID(region, puuid as string);

        if (historyData.status === 200) {
            const formattedHistory = formatService.formatHistoryData(historyData);

            return res.json({
                status: 200,
                data: formattedHistory
            });
        } else {
            return res.status(historyData.status).json(historyData);
        }

    } catch (error) {
        handleRouteError(req, res, error);
    }
};
