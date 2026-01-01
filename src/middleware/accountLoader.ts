import { Request, Response, NextFunction } from 'express';
import * as valorantService from '../services/valorantService';

function getErrorMsg(status: number, lang: string): string {
    const isEs = lang === 'es';
    switch (status) {
        case 404: return isEs ? 'Jugador no encontrado' : 'Player not found';
        case 429: return isEs ? 'Demasiadas peticiones' : 'Rate limit exceeded';
        case 500: return isEs ? 'Error del servidor' : 'Server error';
        default: return isEs ? 'Error desconocido' : 'Unknown error';
    }
}

export async function withAccountData(req: Request, res: Response, next: NextFunction) {
    const { name, tag } = req.params;

    try {
        const accountData = await valorantService.getPUUID(name, tag);

        if (accountData.status !== 200) {
            const lang = (req.query.lang as string) || 'en';
            if (req.query.format === 'text') {
                return res.send(`Error: ${getErrorMsg(accountData.status, lang)}`);
            }
            return res.status(accountData.status).json(accountData);
        }

        (req as any).accountData = accountData;
        (req as any).puuid = accountData.data.puuid;
        next();
    } catch (error: any) {
        console.error('Account Loader Error:', error);
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Internal Server Error' });
    }
}
