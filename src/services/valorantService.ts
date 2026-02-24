import { config } from '../config';
import { fetchWithCache } from './henrikClient';
import cache from '../utils/cache';
import {
    ValorantAccount,
    ValorantApiResponse,
    ValorantMMR,
    ValorantMatch,
    ValorantMMRHistoryItem
} from '../types/valorant';

export async function getAccount(name: string, tag: string): Promise<ValorantApiResponse<ValorantAccount>> {
    return fetchWithCache(`account:${name}:${tag}`, `/v1/account/${name}/${tag}`, config.cacheTtl.account);
}

export async function getMMRByPUUID(region: string, puuid: string): Promise<ValorantApiResponse<ValorantMMR>> {
    return fetchWithCache(`mmr:${region}:${puuid}`, `/v2/by-puuid/mmr/${region}/${puuid}`, config.cacheTtl.mmr);
}

export async function getMatchesByPUUID(region: string, puuid: string, mode: string = 'competitive', size: number = 5): Promise<ValorantApiResponse<ValorantMatch[]>> {
    return fetchWithCache(`matches:${region}:${puuid}:${mode}:${size}`, `/v3/by-puuid/matches/${region}/${puuid}?mode=${mode}&size=${size}`, config.cacheTtl.matches);
}

export async function getMMRHistoryByPUUID(region: string, puuid: string): Promise<ValorantApiResponse<ValorantMMRHistoryItem[]>> {
    return fetchWithCache(`history:${region}:${puuid}`, `/v1/by-puuid/mmr-history/${region}/${puuid}`, config.cacheTtl.history);
}

export async function getPUUID(name: string, tag: string): Promise<ValorantApiResponse<ValorantAccount>> {
    const cacheKey = `puuid:${name.toLowerCase()}:${tag.toLowerCase()}`;
    const cachedPUUID = cache.get(cacheKey) as string | undefined;

    if (cachedPUUID) {
        return getAccount(name, tag);
    }

    const accountData = await getAccount(name, tag);
    if (accountData.status === 200) {
        // El PUUID nunca cambia, lo guardamos por 24 horas (máximo posible en esta caché)
        cache.set(cacheKey, accountData.data.puuid, { ttl: 24 * 60 * 60 * 1000 });
    }
    return accountData;
}

export function getCachedPUUID(name: string, tag: string): string | null {
    const cacheKey = `puuid:${name.toLowerCase()}:${tag.toLowerCase()}`;
    return cache.get(cacheKey) as string | null;
}

