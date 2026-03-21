import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as formatService from '../services/formatService';
import { RankTextData, MatchTextData } from '../types/valorant';

export const validatePreview = [
    body('type').isIn(['rank', 'match']).withMessage('type must be "rank" or "match"'),
    body('data').isObject().withMessage('data must be an object'),
    body('lang').optional().isIn(['en', 'es']).withMessage('lang must be "en" or "es"'),
];

export const generatePreview = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, errors: errors.array() });
    }

    const { type, data, lang = 'en', botType = '1', botMatchType = '1' } = req.body;

    try {
        if (type === 'rank') {
            const { rank, rr, elo, name, tag } = data;

            if (!rank || rr === undefined || !name || !tag) {
                return res.status(400).json({ status: 400, error: 'Missing rank fields: rank, rr, name, tag' });
            }

            const rankData: RankTextData = { name, tag, rank, ranking_in_tier: Number(rr), elo: Number(elo) || 0 };
            const text = formatService.formatRankText(rankData, lang, botType);
            return res.json({ text });
        }

        if (type === 'match') {
            const { map, isWin, kda, hs, agent, mmrChange } = data;

            if (!map || !agent) {
                return res.status(400).json({ status: 400, error: 'Missing match fields: map, agent' });
            }

            const matchData: MatchTextData = {
                derived: {
                    map_name: map,
                    is_win: Boolean(isWin),
                    kda: kda || '0/0/0',
                    hs_percent: hs || 0,
                    agent_name: agent,
                    agent_icon: '',
                    agent_image: '',
                    map_image: null
                }
            };
            const text = formatService.formatMatchText(matchData, lang, botMatchType, Number(mmrChange) || 0);
            return res.json({ text });
        }

    } catch (error) {
        console.error('Preview Error:', error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

