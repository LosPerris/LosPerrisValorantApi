export const config = {
    henrikApiKey: import.meta.env.HENRIK_API_KEY,
    // TTLs en segundos (compatible directo con Redis/Vercel KV)
    cacheTtl: {
        account:  24 * 60 * 60, // 24 horas — el PUUID/nombre rara vez cambia
        mmr:      10 * 60,      // 10 minutos — un partido competitivo dura ~40 min
        matches:   8 * 60,      // 8 minutos — el historial no cambia en ese tiempo
        history:  10 * 60,      // 10 minutos
    },
    henrikBaseUrl: 'https://api.henrikdev.xyz/valorant',
};

if (!config.henrikApiKey) {
    console.warn('WARNING: HENRIK_API_KEY is not configured in environment variables');
}
