import axios from 'axios';
import https from 'https';
import cache from '../utils/cache';
import {
    ValorantAccount,
    ValorantApiResponse,
    ValorantMMR,
    ValorantMatch,
    ValorantMMRHistoryItem
} from '../types/valorant';

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

function getApiKey(): string {
    const apiKey = process.env.HENRIK_API_KEY;
    if (!apiKey) {
        throw new Error('HENRIK_API_KEY is not configured');
    }
    return apiKey;
}

function handleApiError(error: any): never {
    if (error.response) {
        throw { status: error.response.status, data: error.response.data };
    } else {
        throw { status: 500, message: 'Internal Server Error', error: error.message };
    }
}

async function fetchWithCache<T>(key: string, fetchFunction: () => Promise<ValorantApiResponse<T>>, ttl: number = 60000): Promise<ValorantApiResponse<T>> {
    const cachedData = cache.get(key) as ValorantApiResponse<T> | undefined;
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

export async function getAccount(name: string, tag: string): Promise<ValorantApiResponse<ValorantAccount>> {
    return fetchWithCache(`account:${name}:${tag}`, async () => {
        try {
            const response = await axiosInstance.get<ValorantApiResponse<ValorantAccount>>(`${BASE_URL}/v1/account/${name}/${tag}`, {
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

export async function getMMRByPUUID(region: string, puuid: string): Promise<ValorantApiResponse<ValorantMMR>> {
    return fetchWithCache(`mmr:${region}:${puuid}`, async () => {
        try {
            const response = await axiosInstance.get<ValorantApiResponse<ValorantMMR>>(`${BASE_URL}/v2/by-puuid/mmr/${region}/${puuid}`, {
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

export async function getMatchesByPUUID(region: string, puuid: string, mode: string = 'competitive', size: number = 5): Promise<ValorantApiResponse<ValorantMatch[]>> {
    return fetchWithCache(`matches:${region}:${puuid}:${mode}:${size}`, async () => {
        try {
            const response = await axiosInstance.get<ValorantApiResponse<ValorantMatch[]>>(`${BASE_URL}/v3/by-puuid/matches/${region}/${puuid}?mode=${mode}&size=${size}`, {
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

export async function getMMRHistoryByPUUID(region: string, puuid: string): Promise<ValorantApiResponse<ValorantMMRHistoryItem[]>> {
    return fetchWithCache(`history:${region}:${puuid}`, async () => {
        try {
            const response = await axiosInstance.get<ValorantApiResponse<ValorantMMRHistoryItem[]>>(`${BASE_URL}/v1/by-puuid/mmr-history/${region}/${puuid}`, {
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

export async function getPUUID(name: string, tag: string): Promise<ValorantApiResponse<ValorantAccount>> {
    const cacheKey = `puuid:${name.toLowerCase()}:${tag.toLowerCase()}`;
    const cachedPUUID = cache.get(cacheKey) as string | undefined;

    if (cachedPUUID) {
        return getAccount(name, tag);
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

