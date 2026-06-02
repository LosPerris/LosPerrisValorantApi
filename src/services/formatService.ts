import { translateRank } from '../utils/helpers';
import { MAP_UUIDS } from '../utils/constants';
import {
    ValorantAccount,
    ValorantApiResponse,
    ValorantMMR,
    ValorantMatch,
    ValorantMMRHistoryItem,
    FormattedRankData,
    FormattedMatchData,
    FormattedHistoryMatch,
    DerivedMatchData,
    MatchTextData,
    TodaySummaryData,
    GeneralStatsData
} from '../types/valorant';

export function formatRankData(
    accountData: ValorantApiResponse<ValorantAccount>,
    mmrData: ValorantApiResponse<ValorantMMR>,
    fallbackName?: string,
    fallbackTag?: string
): FormattedRankData {
    const currentData = mmrData.data.current_data;

    return {
        puuid: accountData.data.puuid,
        region: accountData.data.region,
        account_level: accountData.data.account_level,
        name: accountData.data.name || mmrData.data.name || fallbackName || 'Unknown',
        tag: accountData.data.tag || mmrData.data.tag || fallbackTag || 'Unknown',
        card: accountData.data.card,
        last_update: accountData.data.last_update,
        current_tier_patched: currentData.currenttierpatched,
        ranking_in_tier: currentData.ranking_in_tier,
        mmr_change_to_last_game: currentData.mmr_change_to_last_game,
        elo: currentData.elo,
        rank_image: currentData.images.large
    };
}

export function formatMatchData(matchData: ValorantMatch, puuid: string): FormattedMatchData | null {
    const stats = matchData.players.all_players.find((p) => p.puuid === puuid);
    if (!stats) return null;

    const totalShots = (stats.stats.headshots || 0) + (stats.stats.bodyshots || 0) + (stats.stats.legshots || 0);
    const hsPercentage = totalShots > 0 ? ((stats.stats.headshots / totalShots) * 100).toFixed(1) : 0;

    const agentIcon = stats.assets.agent.small;
    const agentImage = stats.assets.agent.bust || stats.assets.agent.full || agentIcon;

    const mapName = matchData.metadata.map;
    const mapUuid = MAP_UUIDS[mapName] || '';
    const mapImage = mapUuid ? `https://media.valorant-api.com/maps/${mapUuid}/splash.png` : null;

    const isWin = matchData.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');
    const kda = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;

    const derived: DerivedMatchData = {
        map_name: mapName,
        is_win: isWin,
        kda,
        hs_percent: hsPercentage,
        agent_name: stats.character,
        agent_icon: agentIcon,
        agent_image: agentImage,
        map_image: mapImage
    };

    return { ...matchData, derived };
}

export function formatHistoryData(historyData: ValorantApiResponse<ValorantMMRHistoryItem[]>): FormattedHistoryMatch[] {
    return historyData.data.map((match) => ({
        date: match.date,
        elo: match.elo,
        change: match.mmr_change_to_last_game,
        map: match.map.name
    })).reverse();
}

export function formatRankText(data: FormattedRankData, lang: string, type: string): string {
    const rank = data.current_tier_patched;
    const rr = data.ranking_in_tier;
    const elo = data.elo;
    const translatedRank = translateRank(rank, lang);
    const isEs = lang === 'es';

    if (type === '1') return isEs ? `Actualmente estoy en ${translatedRank}` : `Currently I am in ${translatedRank}`;
    if (type === '2') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos` : `Currently I am in ${translatedRank} with ${rr} RR`;
    if (type === '3') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos, mi mmr es de ${elo}` : `Currently I am in ${translatedRank} with ${rr} RR, my mmr is ${elo}`;

    // Default fallback
    return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos` : `Currently I am in ${translatedRank} with ${rr} RR`;
}

export function formatMatchText(data: MatchTextData, lang: string, type: string, mmrChange = 0): string {
    const { map_name, is_win, kda, hs_percent, agent_name } = data.derived;
    const isEs = lang === 'es';

    if (isEs) {
        const resultVerb = is_win ? 'gané' : 'perdí';
        const pointsMsg = `${mmrChange} puntos`;
        if (type === '1') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg}`;
        if (type === '2') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}`;
        if (type === '3') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}, mi porcentaje de HS fue de ${hs_percent}% HS`;
        return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} (${kda})`;
    }

    const resultVerb = is_win ? 'won' : 'lost';
    const pointsMsg = `${mmrChange} RR`;
    if (type === '1') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg}`;
    if (type === '2') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} my kda was ${kda}`;
    if (type === '3') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} my kda was ${kda}, my HS percentage was ${hs_percent}%`;
    return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} (${kda})`;
}

export function formatTodayText(data: TodaySummaryData, lang: string, name: string, type = '1'): string {
    const isEs = lang === 'es';

    if (data.matches_played === 0) {
        return isEs
            ? `Hoy ${name} no ha jugado ninguna partida de competitivo.`
            : `Today ${name} hasn't played any competitive matches.`;
    }

    const { matches_played, wins, losses, draws, rr_change } = data;
    const changeSymbol = rr_change > 0 ? '+' : '';
    const winrate = Math.round((wins / matches_played) * 100);

    if (isEs) {
        const empatesMsg = draws > 0 ? ` y ${draws} Empates` : '';
        if (type === '2') return `Hoy ${name} ha jugado ${matches_played} partidas: ${wins} Victorias, ${losses} Derrotas${empatesMsg} (Total: ${changeSymbol}${rr_change} RR).`;
        if (type === '3') return `Hoy ${name} ha jugado ${matches_played} partidas (${winrate}% Winrate): ${wins} Victorias, ${losses} Derrotas${empatesMsg} (Total: ${changeSymbol}${rr_change} RR).`;
        return `Hoy ${name} lleva ${wins} Victorias, ${losses} Derrotas${empatesMsg} (Total: ${changeSymbol}${rr_change} RR).`;
    }

    const drawsMsg = draws > 0 ? ` and ${draws} Draws` : '';
    if (type === '2') return `Today ${name} has played ${matches_played} matches: ${wins} Wins, ${losses} Losses${drawsMsg} (Total: ${changeSymbol}${rr_change} RR).`;
    if (type === '3') return `Today ${name} has played ${matches_played} matches (${winrate}% Winrate): ${wins} Wins, ${losses} Losses${drawsMsg} (Total: ${changeSymbol}${rr_change} RR).`;
    return `Today ${name} has ${wins} Wins, ${losses} Losses${drawsMsg} (Total: ${changeSymbol}${rr_change} RR).`;
}

export function formatStatsText(data: GeneralStatsData, lang: string, name: string, type = '1'): string {
    const isEs = lang === 'es';
    const { winrate, favorite_agent, hs_percent, matches_analyzed } = data;

    if (matches_analyzed === 0) {
        return isEs
            ? `${name} no tiene suficientes partidas recientes para analizar.`
            : `${name} does not have enough recent matches to analyze.`;
    }

    if (isEs) {
        if (type === '2') return `En sus últimas ${matches_analyzed} partidas, ${name} ha jugado principalmente con ${favorite_agent}, logrando un winrate del ${winrate}% y ${hs_percent}% de HS.`;
        if (type === '3') return `Stats de ${name} (${matches_analyzed} partidas): ${winrate}% WR | Agente: ${favorite_agent} | HS: ${hs_percent}%`;
        return `${name} tiene un winrate del ${winrate}% en sus últimas ${matches_analyzed} partidas. Su agente más jugado es ${favorite_agent} (${hs_percent}% HS).`;
    }

    if (type === '2') return `In their last ${matches_analyzed} matches, ${name} has primarily played ${favorite_agent}, achieving a ${winrate}% winrate and ${hs_percent}% HS.`;
    if (type === '3') return `${name}'s Stats (${matches_analyzed} matches): ${winrate}% WR | Agent: ${favorite_agent} | HS: ${hs_percent}%`;
    return `${name} has a ${winrate}% winrate in their last ${matches_analyzed} matches. Most played agent is ${favorite_agent} (${hs_percent}% HS).`;
}
