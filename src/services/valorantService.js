const axios = require('axios');
const https = require('https');
const cache = require('../utils/cache');
const BASE_URL = 'https://api.henrikdev.xyz/valorant';
const agent = new https.Agent({
    keepAlive: true,
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000
});

const axiosInstance = axios.create({
    httpsAgent: agent,
    timeout: 10000
});

function getApiKey() {
    const apiKey = process.env.HENRIK_API_KEY;
    if (!apiKey) {
        throw new Error('HENRIK_API_KEY is not configured');
    }
    return apiKey;
}

function handleApiError(error) {
    if (error.response) {
        throw { status: error.response.status, data: error.response.data };
    } else {
        throw { status: 500, message: 'Internal Server Error', error: error.message };
    }
}

async function fetchWithCache(key, fetchFunction, ttl = 60000) {
    const cachedData = cache.get(key);
    if (cachedData) {
        return cachedData;
    }

    try {
        const data = await fetchFunction();
        if (data && data.status === 200) {
            cache.set(key, data, { ttl });
        }
        return data;
    } catch (error) {
        throw error;
    }
}

async function getAccount(name, tag) {
    return fetchWithCache(`account:${name}:${tag}`, async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/v1/account/${name}/${tag}`, {
                headers: {
                    'Authorization': getApiKey(),
                    'accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    }, 24 * 60 * 60 * 1000);
}

async function getMMRByPUUID(region, puuid) {
    return fetchWithCache(`mmr:${region}:${puuid}`, async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/v2/by-puuid/mmr/${region}/${puuid}`, {
                headers: {
                    'Authorization': getApiKey(),
                    'accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    }, 60000);
}

async function getMatchesByPUUID(region, puuid, mode = 'competitive') {
    return fetchWithCache(`matches:${region}:${puuid}:${mode}`, async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/v3/by-puuid/matches/${region}/${puuid}?mode=${mode}`, {
                headers: {
                    'Authorization': getApiKey(),
                    'accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    }, 120000);
}

async function getMMRHistoryByPUUID(region, puuid) {
    return fetchWithCache(`history:${region}:${puuid}`, async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/v1/by-puuid/mmr-history/${region}/${puuid}`, {
                headers: {
                    'Authorization': getApiKey(),
                    'accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    }, 300000);
}

async function getPUUID(name, tag) {
    const cacheKey = `puuid:${name.toLowerCase()}:${tag.toLowerCase()}`;
    const cachedPUUID = cache.get(cacheKey);

    if (cachedPUUID) {
        return { status: 200, data: { puuid: cachedPUUID, name, tag } };
    }

    try {
        const accountData = await getAccount(name, tag);
        if (accountData.status === 200) {
            cache.set(cacheKey, accountData.data.puuid, { ttl: 24 * 60 * 60 * 1000 });
            return accountData;
        }
        return accountData;
    } catch (error) {
        throw error;
    }
}

module.exports = { getAccount, getMMRByPUUID, getMatchesByPUUID, getPUUID, getMMRHistoryByPUUID };
