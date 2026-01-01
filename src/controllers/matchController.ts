import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError, sendResponse } from '../utils/helpers';

export const getLastMatch = async (req: Request, res: Response) => {
    const { region } = req.params;
    const { accountData, puuid } = req as any;

    try {
        const [matchesData, mmrData] = await Promise.all([
            valorantService.getMatchesByPUUID(region, puuid, 'competitive'),
            valorantService.getMMRByPUUID(region, puuid)
        ]);

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];
            const formattedData = formatService.formatMatchData(lastMatch, puuid);

            const mmrChange = (mmrData.status === 200) ? mmrData.data.current_data.mmr_change_to_last_game : 0;

            sendResponse(req, res, formattedData, formatService.formatMatchText, mmrChange);
        } else {
            if (req.query.format === 'text') {
                return res.send('No matches found');
            }
            return res.status(matchesData.status).json({
                status: matchesData.status,
                message: 'No matches found or error fetching matches',
                data: matchesData.data
            });
        }

    } catch (error) {
        handleRouteError(req, res, error);
    }
};
