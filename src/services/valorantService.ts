import { config } from '../config';
import { fetchWithCache } from './henrikClient';
import cache from '../utils/cache';
import { mapHenrikHistoryRegion, mapHenrikShardRegion } from '../utils/regions';
import { getMatchOutcome } from '../utils/matchOutcome';
import {
    ValorantAccount,
    ValorantApiResponse,
    ValorantMMR,
    ValorantMatch,
    ValorantMMRHistoryItem,
    TodaySummaryData,
    GeneralStatsData
} from '../types/valorant';

async function getAccount(name: string, tag: string): Promise<ValorantApiResponse<ValorantAccount>> {
    const encodedName = encodeURIComponent(name);
    const encodedTag = encodeURIComponent(tag);
    return fetchWithCache(`account:${name.toLowerCase()}:${tag.toLowerCase()}`, `/v2/account/${encodedName}/${encodedTag}`, config.cacheTtl.account);
}

export async function getMMRByPUUID(region: string, puuid: string): Promise<ValorantApiResponse<ValorantMMR>> {
    const shard = mapHenrikShardRegion(region);
    return fetchWithCache(`mmr:${shard}:${puuid}`, `/v2/by-puuid/mmr/${shard}/${puuid}`, config.cacheTtl.mmr);
}

export async function getMatchesByPUUID(region: string, puuid: string, mode: string = 'competitive', size: number = 5): Promise<ValorantApiResponse<ValorantMatch[]>> {
    const shard = mapHenrikShardRegion(region);
    return fetchWithCache(`matches:${shard}:${puuid}:${mode}:${size}`, `/v3/by-puuid/matches/${shard}/${puuid}?mode=${mode}&size=${size}`, config.cacheTtl.matches);
}

export async function getMMRHistoryByPUUID(region: string, puuid: string): Promise<ValorantApiResponse<ValorantMMRHistoryItem[]>> {
    const mappedRegion = mapHenrikHistoryRegion(region);
    return fetchWithCache(`history:${mappedRegion}:${puuid}`, `/v1/by-puuid/mmr-history/${mappedRegion}/${puuid}`, config.cacheTtl.history);
}

export async function getPUUID(name: string, tag: string): Promise<ValorantApiResponse<ValorantAccount>> {
    // getAccount ya usa fetchWithCache que cachea la respuesta completa bajo 'account:name:tag' en minúsculas
    const accountData = await getAccount(name, tag);
    if (accountData.status === 200) {
        // puuid: caché ligero solo del ID (24h, para compatibilidad con getCachedPUUID)
        await cache.set(`puuid:${name.toLowerCase()}:${tag.toLowerCase()}`, accountData.data.puuid, { ttl: 24 * 60 * 60 });
    }
    return accountData;
}



// Retorna el objeto ValorantAccount completo desde caché (sin hacer fetch).
// Usado por resolvePUUID para evitar double-fetch en los endpoints.
export async function getCachedAccount(name: string, tag: string): Promise<ValorantAccount | null> {
    const cacheKey = `account:${name.toLowerCase()}:${tag.toLowerCase()}`;
    const cachedApiResponse = await cache.get<ValorantApiResponse<ValorantAccount>>(cacheKey);
    return cachedApiResponse?.data || null;
}

export async function getTodaySummary(region: string, puuid: string): Promise<TodaySummaryData | null> {
    const [historyRes, matchesRes] = await Promise.all([
        getMMRHistoryByPUUID(region, puuid),
        getMatchesByPUUID(region, puuid, 'competitive', 15),
    ]);
    if (historyRes.status !== 200 || !historyRes.data) return null;

    const nowSecs = Math.floor(Date.now() / 1000);
    const ONE_DAY = 86400;

    const todayHistory = historyRes.data.filter(m => (nowSecs - m.date_raw) <= ONE_DAY);

    const matchById = new Map<string, ValorantMatch>();
    if (matchesRes.status === 200 && matchesRes.data) {
        for (const match of matchesRes.data) {
            matchById.set(match.metadata.matchid, match);
        }
    }

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let rr_change = 0;

    for (const hist of todayHistory) {
        rr_change += hist.mmr_change_to_last_game;

        const match = matchById.get(hist.match_id);
        const stats = match?.players.all_players.find((p) => p.puuid === puuid);
        if (match && stats) {
            const outcome = getMatchOutcome(match.teams, stats.team);
            if (outcome === 'win') wins++;
            else if (outcome === 'loss') losses++;
            else draws++;
            continue;
        }

        // Sin detalle de partida: RR=0 ≈ empate; si no, victoria/derrota por signo.
        if (hist.mmr_change_to_last_game > 0) wins++;
        else if (hist.mmr_change_to_last_game < 0) losses++;
        else draws++;
    }

    return {
        matches_played: todayHistory.length,
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

        if (getMatchOutcome(match.teams, stats.team) === 'win') totalWins++;

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
