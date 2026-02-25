import { Request, Response } from 'express';
import * as valorantService from '../services/valorantService';
import * as formatService from '../services/formatService';
import { handleRouteError, sendResponse, setEdgeCache } from '../utils/helpers';
import { FormattedMatchData } from '../types/valorant';

export const getLastMatch = async (req: Request, res: Response) => {
    const { region } = req.params;
    const { puuid } = req;

    try {
        setEdgeCache(res, 60);
        const [matchesData, mmrData] = await Promise.all([
            valorantService.getMatchesByPUUID(region, puuid as string, 'competitive', 1),
            valorantService.getMMRByPUUID(region, puuid as string)
        ]);

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];
            const formattedData = formatService.formatMatchData(lastMatch, puuid as string);

            if (!formattedData) {
                return res.status(404).json({
                    status: 404,
                    message: 'Player not found in match data'
                });
            }

            const mmrChange = (mmrData.status === 200) ? mmrData.data.current_data.mmr_change_to_last_game : 0;

            sendResponse<FormattedMatchData, number>(req, res, formattedData, formatService.formatMatchText, mmrChange);
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

    } catch (error: unknown) {
        handleRouteError(req, res, error as { status?: number; message?: string; data?: unknown });
    }
};
