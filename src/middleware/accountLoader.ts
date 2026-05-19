import { Request, Response, NextFunction } from 'express';
import * as valorantService from '../services/valorantService';
import { handleRouteError, getErrorMsg } from '../utils/helpers';

export async function withAccountData(req: Request, res: Response, next: NextFunction) {
    const name = req.params.name as string;
    const tag = req.params.tag as string;

    try {
        const accountData = await valorantService.getPUUID(name, tag);

        if (accountData.status !== 200) {
            const lang = (req.query.lang as string) || 'en';
            if (req.query.format === 'text') {
                return res.send(`Error: ${getErrorMsg(accountData.status, lang)}`);
            }
            return res.status(accountData.status).json(accountData);
        }

        req.accountData = accountData;
        req.puuid = accountData.data.puuid;
        next();
    } catch (error: unknown) {
        handleRouteError(req, res, error as { status?: number; message?: string; data?: unknown });
    }
}
