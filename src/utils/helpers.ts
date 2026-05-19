import path from 'path';
import { Request, Response } from 'express';

const translations = require(path.join(process.cwd(), 'public/js/translations'));

const LANG_RANK_MAPS: Record<string, Map<string, string>> = {
    es: new Map([
        ['Iron', 'Hierro'], ['Bronze', 'Bronce'], ['Silver', 'Plata'],
        ['Gold', 'Oro'], ['Platinum', 'Platino'], ['Diamond', 'Diamante'],
        ['Ascendant', 'Ascendente'], ['Immortal', 'Inmortal'], ['Radiant', 'Radiante']
    ]),
    pt: new Map([
        ['Iron', 'Ferro'], ['Bronze', 'Bronze'], ['Silver', 'Prata'],
        ['Gold', 'Ouro'], ['Platinum', 'Platina'], ['Diamond', 'Diamante'],
        ['Ascendant', 'Ascendente'], ['Immortal', 'Imortal'], ['Radiant', 'Radiante']
    ])
};

export function getErrorMsg(status: number, lang: string): string {
    const t = translations[lang] || translations['en'];
    switch (status) {
        case 404: return t.errorUserNotFound || t.error;
        case 429: return t.errorRateLimit;
        case 401: return t.errorUnauthorized || 'Unauthorized (Invalid API Key)';
        default: return t.error;
    }
}

type RouteError = {
    status?: number;
    data?: unknown;
    message?: string;
};

export function handleRouteError(req: Request, res: Response, error: RouteError): void | Response {
    const status = error.status || 500;
    const lang = (req.query.lang as string) || 'en';

    // Evitamos que Vercel guarde en caché respuestas de error
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.query.format === 'text') {
        return res.send(`Error: ${getErrorMsg(status, lang)}`);
    }

    let errorCode = 'SERVER_ERROR';
    if (status === 404) errorCode = 'USER_NOT_FOUND';
    else if (status === 429) errorCode = 'RATE_LIMIT';
    else if (status === 401) errorCode = 'UNAUTHORIZED';

    return res.status(status).json({
        status: status,
        error: errorCode,
        message: getErrorMsg(status, lang),
        details: error.data || error.message
    });
}

export function translateRank(rankName: string, lang: string): string {
    if (lang === 'en' || !rankName) return rankName;

    const map = LANG_RANK_MAPS[lang];
    if (!map) return rankName;

    for (const [eng, translated] of map) {
        if (rankName.includes(eng)) {
            return rankName.replace(eng, translated);
        }
    }
    return rankName;
}


export function setEdgeCache(res: Response, seconds: number = 60): void {
    res.setHeader('Cache-Control', `s-maxage=${seconds}, stale-while-revalidate=${seconds}`);
}

export function sendResponse<T, TExtra = unknown>(
    req: Request,
    res: Response,
    data: T,
    textFormatter: ((data: T, lang: string, type: string, extraData?: TExtra) => string) | null,
    extraData?: TExtra,
    cacheSeconds: number = 300
): Response {
    setEdgeCache(res, cacheSeconds);

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
