import { config } from '../config';
import { fetchWithCache } from './henrikClient';
import cache from '../utils/cache';
import {
    ValorantAccount,
    ValorantApiResponse,
    ValorantMMR,
    ValorantMatch,
    ValorantMMRHistoryItem,
    TodaySummaryData,
    GeneralStatsData
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
    const cacheKey = `account_obj:${name.toLowerCase()}:${tag.toLowerCase()}`;
    const cachedAccount = await cache.get<ValorantApiResponse<ValorantAccount>>(cacheKey);

    if (cachedAccount) {
        return cachedAccount;
    }

    const accountData = await getAccount(name, tag);
    if (accountData.status === 200) {
        // Guardamos el perfil completo por 1 hora para evitar re-consultas de perfil
        await cache.set(cacheKey, accountData, { ttl: 60 * 60 });

        // También guardamos el PUUID por separado (opcional por compatibilidad)
        const puuidKey = `puuid:${name.toLowerCase()}:${tag.toLowerCase()}`;
        await cache.set(puuidKey, accountData.data.puuid, { ttl: 24 * 60 * 60 });
    }
    return accountData;
}

export async function getCachedPUUID(name: string, tag: string): Promise<string | null> {
    const cacheKey = `puuid:${name.toLowerCase()}:${tag.toLowerCase()}`;
    return await cache.get<string>(cacheKey);
}

export async function getTodaySummary(region: string, puuid: string): Promise<TodaySummaryData | null> {
    const historyRes = await getMMRHistoryByPUUID(region, puuid);
    if (historyRes.status !== 200 || !historyRes.data) return null;

    const nowSecs = Math.floor(Date.now() / 1000);
    const ONE_DAY = 86400; // 24 hours

    const todayMatches = historyRes.data.filter(m => (nowSecs - m.date_raw) <= ONE_DAY);

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let rr_change = 0;

    for (const match of todayMatches) {
        if (match.mmr_change_to_last_game > 0) wins++;
        else if (match.mmr_change_to_last_game < 0) losses++;
        else draws++;
        
        rr_change += match.mmr_change_to_last_game;
    }

    return {
        matches_played: todayMatches.length,
        wins,
        losses,
        draws,
        rr_change
    };
}

export async function getGeneralStats(region: string, puuid: string): Promise<GeneralStatsData | null> {
    const matchesRes = await getMatchesByPUUID(region, puuid, 'competitive', 10);
    if (matchesRes.status !== 200 || !matchesRes.data || matchesRes.data.length === 0) return null;

    let totalWins = 0;
    let totalHeadshots = 0;
    let totalShots = 0;
    const agentCounts: Record<string, number> = {};

    for (const match of matchesRes.data) {
        const stats = match.players.all_players.find((p) => p.puuid === puuid);
        if (!stats) continue;

        const isWin = match.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');
        if (isWin) totalWins++;

        const matchShots = (stats.stats.headshots || 0) + (stats.stats.bodyshots || 0) + (stats.stats.legshots || 0);
        totalHeadshots += (stats.stats.headshots || 0);
        totalShots += matchShots;

        const agentName = stats.character;
        agentCounts[agentName] = (agentCounts[agentName] || 0) + 1;
    }

    const matchesAnalyzed = matchesRes.data.length;
    const winrate = matchesAnalyzed > 0 ? (totalWins / matchesAnalyzed) * 100 : 0;
    const hsPercent = totalShots > 0 ? ((totalHeadshots / totalShots) * 100).toFixed(1) : "0.0";

    let favoriteAgent = "Unknown";
    let maxCount = 0;
    for (const [agent, count] of Object.entries(agentCounts)) {
        if (count > maxCount) {
            maxCount = count;
            favoriteAgent = agent;
        }
    }

    return {
        matches_analyzed: matchesAnalyzed,
        winrate: Math.round(winrate),
        favorite_agent: favoriteAgent,
        hs_percent: hsPercent
    };
}
