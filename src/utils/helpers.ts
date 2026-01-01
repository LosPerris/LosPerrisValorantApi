const translations = require('../../public/js/translations');
import { Request, Response } from 'express';

export function getErrorMsg(status: number, lang: string): string {
    const isEs = lang === 'es';
    switch (status) {
        case 404: return isEs ? 'Jugador no encontrado' : 'Player not found';
        case 429: return isEs ? 'Demasiadas peticiones' : 'Rate limit exceeded';
        case 500: return isEs ? 'Error del servidor' : 'Server error';
        default: return isEs ? 'Error desconocido' : 'Unknown error';
    }
}

export function handleRouteError(req: Request, res: Response, error: any): void | Response {
    console.error('API Error:', error);
    const status = error.status || 500;
    const lang = (req.query.lang as string) || 'en';

    if (req.query.format === 'text') {
        return res.send(`Error: ${getErrorMsg(status, lang)}`);
    }
    return res.status(status).json(error.data || { message: error.message });
}

export function translateRank(rankName: string, lang: string): string {
    if (lang !== 'es' || !rankName) return rankName;

    const parts = rankName.split(' ');
    const name = parts[0];
    const tier = parts[1] || '';

    const translatedName = translations.rankNames[name] || name;
    return tier ? `${translatedName} ${tier}` : translatedName;
}

export function sendResponse(
    req: Request,
    res: Response,
    data: any,
    textFormatter: ((data: any, lang: string, type: string, extraData?: any) => string) | null,
    extraData: any = null
): Response {
    if (req.query.format === 'text') {
        const lang = (req.query.lang as string) || 'en';
        const type = (req.query.type as string) || '1';

        if (!textFormatter) {
            return res.status(400).send('Text format not supported for this endpoint');
        }

        return res.send(textFormatter(data, lang, type, extraData));
    }

    return res.json({
        status: 200,
        data: data
    });
}
