import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError, setEdgeCache } from '../utils/helpers';
import { ValorantApiResponse, ValorantMMRHistoryItem } from '../types/valorant';

export const getHistory = async (req: Request, res: Response) => {
    const { region } = req.params;
    const { puuid } = req;

    try {
        // El historial no depende de MMR directamente pero podemos cachearlo agresivamente en el Edge
        setEdgeCache(res, 300); // 5 minutos de caché en el borde para historial

        const historyData: ValorantApiResponse<ValorantMMRHistoryItem[]> = await valorantService.getMMRHistoryByPUUID(region, puuid as string);

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
        handleRouteError(req, res, error as { status?: number; message?: string; data?: unknown });
    }
};
