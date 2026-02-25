import { Request, Response, NextFunction } from 'express';
import * as valorantService from '../services/valorantService';
import { getErrorMsg } from '../utils/helpers';

export async function withAccountData(req: Request, res: Response, next: NextFunction) {
    const { name, tag } = req.params;

    try {
        // Primero intentamos recuperar el PUUID de la caché para evitar una petición a Henrik
        const cachedPuuid = valorantService.getCachedPUUID(name, tag);

        if (cachedPuuid) {
            req.puuid = cachedPuuid;
        }

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
        console.error('Account Loader Error:', error);
        const typedError = error as { status?: number; message?: string };
        const status = typedError.status || 500;
        res.status(status).json({ message: typedError.message || 'Internal Server Error' });
    }
}
