import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    henrikApiKey: process.env.HENRIK_API_KEY,
    cacheTtl: {
        account: 24 * 60 * 60 * 1000,
        mmr: 60 * 1000,
        matches: 120 * 1000,
        history: 300 * 1000,
    },
    henrikBaseUrl: 'https://api.henrikdev.xyz/valorant',
};

if (!config.henrikApiKey) {
    console.warn('WARNING: HENRIK_API_KEY is not configured in environment variables');
}
