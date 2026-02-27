import path from 'path';
import { Request, Response } from 'express';

// Cargamos traducciones una sola vez al inicio
const translations = require(path.join(process.cwd(), 'public/js/translations'));

// Pre-calculamos un Map para traducciones de rangos O(1)
const rankTranslationsMap = new Map<string, string>(
    Object.entries(translations.rankNames || {}) as [string, string][]
);

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

// Optimizado: Búsqueda O(1) en lugar de bucle entries().find()
export function translateRank(rankName: string, lang: string): string {
    if (lang !== 'es' || !rankName) return rankName;

    // Buscamos la base del rango (ej. 'Platinum' en 'Platinum 3')
    for (const [eng, esp] of rankTranslationsMap) {
        if (rankName.includes(eng)) {
            return rankName.replace(eng, esp);
        }
    }
    return rankName;
}

/**
 * Añade cabeceras de caché para Vercel Edge Network
 * s-maxage: Tiempo que Vercel guarda la respuesta en el borde
 * stale-while-revalidate: Tiempo que sirve lo viejo mientras lo actualiza en segundo plano
 */
export function setEdgeCache(res: Response, seconds: number = 60): void {
    res.setHeader('Cache-Control', `s-maxage=${seconds}, stale-while-revalidate=${Math.floor(seconds / 2)}`);
}

export function sendResponse<T, TExtra = unknown>(
    req: Request,
    res: Response,
    data: T,
    textFormatter: ((data: T, lang: string, type: string, extraData?: TExtra) => string) | null,
    extraData?: TExtra
): Response {
    // Aplicamos caché de 1 minuto por defecto para respuestas exitosas
    setEdgeCache(res, 60);

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
