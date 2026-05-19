import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    henrikApiKey: process.env.HENRIK_API_KEY,
    cacheTtl: {
        account: 24 * 60 * 60 * 1000,
        mmr: 5 * 60 * 1000,          // 5 minutos
        matches: 5 * 60 * 1000,      // 5 minutos
        history: 10 * 60 * 1000,     // 10 minutos
    },
    henrikBaseUrl: 'https://api.henrikdev.xyz/valorant',
};

if (!config.henrikApiKey) {
    console.warn('WARNING: HENRIK_API_KEY is not configured in environment variables');
}
