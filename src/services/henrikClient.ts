import axios, { AxiosInstance } from 'axios';
import https from 'https';
import cache from '../utils/cache';
import { config } from '../config';
import { ValorantApiResponse } from '../types/valorant';

const agent = new https.Agent({
    keepAlive: true,
    maxSockets: 25,
    maxFreeSockets: 5,
    timeout: 30000
});

const axiosInstance: AxiosInstance = axios.create({
    baseURL: config.henrikBaseUrl,
    httpsAgent: agent,
    timeout: 10000,
    headers: {
        'Authorization': config.henrikApiKey || '',
        'accept': 'application/json'
    }
});

type ApiError = {
    response?: {
        status: number;
        data: unknown;
    };
    message?: string;
    status?: number;
};

function handleApiError(error: ApiError): never {
    if (error.response) {
        throw { status: error.response.status, data: error.response.data };
    }
    throw {
        status: error.status || 500,
        message: 'Internal Server Error',
        error: error.message
    };
}


export async function fetchWithCache<T>(
    key: string,
    endpoint: string,
    ttl: number = 60000
): Promise<ValorantApiResponse<T>> {
    const cachedData = cache.get(key) as ValorantApiResponse<T> | undefined;
    if (cachedData) return cachedData;

    try {
        const response = await axiosInstance.get<ValorantApiResponse<T>>(endpoint);
        const data = response.data;

        if (data && data.status === 200) {
            cache.set(key, data, { ttl });
        }
        return data;
    } catch (error) {
        return handleApiError(error as ApiError);
    }
}

export default axiosInstance;
