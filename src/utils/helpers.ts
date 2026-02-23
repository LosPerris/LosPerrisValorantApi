import path from 'path';
import { Request, Response } from 'express';

const translations = require(path.join(process.cwd(), 'public/js/translations'));

export function getErrorMsg(status: number, lang: string): string {
    const t = translations[lang] || translations['en'];
    switch (status) {
        case 404: return t.errorUserNotFound || t.error;
        case 429: return t.errorRateLimit;
        case 500: return t.errorServer;
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

    if (req.query.format === 'text') {
        return res.send(`Error: ${getErrorMsg(status, lang)}`);
    }

    let errorCode = 'SERVER_ERROR';
    if (status === 404) errorCode = 'USER_NOT_FOUND';
    else if (status === 429) errorCode = 'RATE_LIMIT';

    return res.status(status).json({
        status: status,
        error: errorCode,
        message: getErrorMsg(status, lang),
        details: error.data || error.message
    });
}

export function translateRank(rankName: string, lang: string): string {
    if (lang !== 'es' || !rankName) return rankName;

    for (const [eng, esp] of Object.entries(translations.rankNames)) {
        if (rankName.includes(eng)) {
            return rankName.replace(eng, esp as string);
        }
    }
    return rankName;
}

export function sendResponse<T, TExtra = unknown>(
    req: Request,
    res: Response,
    data: T,
    textFormatter: ((data: T, lang: string, type: string, extraData?: TExtra) => string) | null,
    extraData?: TExtra
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
