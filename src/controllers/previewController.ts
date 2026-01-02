import { Request, Response } from 'express';
import * as formatService from '../services/formatService';
import { RankTextData, MatchTextData } from '../types/valorant';

export const generatePreview = (req: Request, res: Response) => {
    const { type, data, lang, botType, botMatchType } = req.body;

    if (!data) {
        return res.status(400).json({ error: 'Missing data' });
    }

    try {
        if (type === 'rank') {
            const { rank, rr, elo, name, tag } = data;
            const rankData: RankTextData = {
                name,
                tag,
                rank,
                ranking_in_tier: rr,
                elo
            };
            const text = formatService.formatRankText(rankData, lang, botType);
            return res.json({ text });
        }

        if (type === 'match') {
            const { map, isWin, kda, hs, agent, mmrChange } = data;
            const matchData: MatchTextData = {
                derived: {
                    map_name: map,
                    is_win: isWin,
                    kda: kda,
                    hs_percent: hs,
                    agent_name: agent,
                    agent_icon: '',
                    agent_image: '',
                    map_image: null
                }
            };
            const text = formatService.formatMatchText(matchData, lang, botMatchType, mmrChange);
            return res.json({ text });
        }

        return res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
        console.error('Preview Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
