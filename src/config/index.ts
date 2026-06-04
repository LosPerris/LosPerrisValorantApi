export const config = {
    henrikApiKey: process.env.HENRIK_API_KEY,
    // TTLs en segundos (compatible directo con Redis/Vercel KV)
    cacheTtl: {
        account:  24 * 60 * 60, // 24 horas
        mmr:       5 * 60,      // 5 minutos
        matches:   5 * 60,      // 5 minutos
        history:  10 * 60,      // 10 minutos
    },
    henrikBaseUrl: 'https://api.henrikdev.xyz/valorant',
};

if (!config.henrikApiKey) {
    console.warn('WARNING: HENRIK_API_KEY is not configured in environment variables');
}
