import cache from '../utils/cache';
import { config } from '../config';
import { ValorantApiResponse } from '../types/valorant';


function handleApiError(status: number, data: unknown): never {
    throw { status, data, message: 'API Error' };
}

export async function fetchWithCache<T>(
    key: string,
    endpoint: string,
    ttl: number = 60000
): Promise<ValorantApiResponse<T>> {
    const cachedData = cache.get(key) as ValorantApiResponse<T> | undefined;
    if (cachedData) return cachedData;

    try {
        const response = await fetch(`${config.henrikBaseUrl}${endpoint}`, {
            headers: {
                'Authorization': config.henrikApiKey || '',
                'accept': 'application/json'
            }
        });
        
        const data = await response.json();

        if (!response.ok) {
            return handleApiError(response.status, data);
        }

        if (data && data.status === 200) {
            cache.set(key, data, { ttl });
        }
        return data;
    } catch (error: any) {
        if (error.status) throw error;
        throw {
            status: 500,
            message: 'Internal Server Error',
            error: error.message
        };
    }
}
