const LANG_RANK_MAPS: Record<string, Map<string, string>> = {
    es: new Map([
        ['Iron', 'Hierro'], ['Bronze', 'Bronce'], ['Silver', 'Plata'],
        ['Gold', 'Oro'], ['Platinum', 'Platino'], ['Diamond', 'Diamante'],
        ['Ascendant', 'Ascendente'], ['Immortal', 'Inmortal'], ['Radiant', 'Radiante']
    ]),
    pt: new Map([
        ['Iron', 'Ferro'], ['Bronze', 'Bronze'], ['Silver', 'Prata'],
        ['Gold', 'Ouro'], ['Platinum', 'Platina'], ['Diamond', 'Diamante'],
        ['Ascendant', 'Ascendente'], ['Immortal', 'Imortal'], ['Radiant', 'Radiante']
    ])
};

export function translateRank(rankName: string, lang: string): string {
    if (lang === 'en' || !rankName) return rankName;

    const map = LANG_RANK_MAPS[lang];
    if (!map) return rankName;

    const baseName = rankName.split(' ')[0];
    const translation = map.get(baseName);
    return translation ? rankName.replace(baseName, translation) : rankName;
}
import { MAP_UUIDS } from '../utils/constants';
import { getMatchOutcome } from '../utils/matchOutcome';
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

/** Estilo de respuesta para bots: frase, limpio o plantilla editable. */
export type TextStyle = 'default' | 'clean' | 'custom';

export interface TextFormatOptions {
    lang: string;
    type?: string;
    style?: TextStyle;
    template?: string | null;
}

export const RANK_TEMPLATE_VARS = ['rank', 'rr', 'mmr', 'name', 'tag', 'level'] as const;
export const MATCH_TEMPLATE_VARS = ['map', 'agent', 'result', 'rr', 'kda', 'hs', 'name'] as const;
export const TODAY_TEMPLATE_VARS = ['name', 'wins', 'losses', 'draws', 'rr', 'matches', 'winrate'] as const;
export const STATS_TEMPLATE_VARS = ['name', 'winrate', 'agent', 'hs', 'matches'] as const;

function applyTemplate(template: string, vars: Record<string, string | number>): string {
    return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key: string) => {
        const value = vars[key];
        return value !== undefined && value !== null ? String(value) : match;
    });
}

function normalizeStyle(style?: string | null): TextStyle {
    if (style === 'clean' || style === 'custom') return style;
    return 'default';
}

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
        current_tier: currentData.currenttier,
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

    const outcome = getMatchOutcome(matchData.teams, stats.team);
    const kda = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;

    const derived: DerivedMatchData = {
        map_name: mapName,
        is_win: outcome === 'win',
        is_draw: outcome === 'draw',
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

function rankVars(data: FormattedRankData, lang: string): Record<string, string | number> {
    return {
        rank: translateRank(data.current_tier_patched, lang),
        rr: data.ranking_in_tier,
        mmr: data.elo,
        name: data.name,
        tag: data.tag,
        level: data.account_level
    };
}

export function formatRankText(
    data: FormattedRankData,
    lang: string,
    type: string,
    style: TextStyle | string = 'default',
    template?: string | null
): string {
    const vars = rankVars(data, lang);
    const mode = normalizeStyle(style);
    const isEs = lang === 'es';
    const rank = String(vars.rank);
    const rr = vars.rr;
    const elo = vars.mmr;

    if (mode === 'custom') {
        const tpl = (template && template.trim()) || '{rank}';
        return applyTemplate(tpl, vars);
    }

    if (mode === 'clean') {
        if (type === '2') return `${rank} · ${rr} RR`;
        if (type === '3') return `${rank} · ${rr} RR · MMR ${elo}`;
        return rank;
    }

    // default — frases
    if (type === '1') return isEs ? `Actualmente estoy en ${rank}` : `Currently I am in ${rank}`;
    if (type === '2') return isEs ? `Actualmente estoy en ${rank} con ${rr} puntos` : `Currently I am in ${rank} with ${rr} RR`;
    if (type === '3') return isEs ? `Actualmente estoy en ${rank} con ${rr} puntos, mi mmr es de ${elo}` : `Currently I am in ${rank} with ${rr} RR, my mmr is ${elo}`;
    return isEs ? `Actualmente estoy en ${rank}` : `Currently I am in ${rank}`;
}

function matchResultVerb(data: MatchTextData, lang: string): string {
    const { is_win, is_draw } = data.derived;
    if (lang === 'es') return is_draw ? 'empaté' : is_win ? 'gané' : 'perdí';
    return is_draw ? 'drew' : is_win ? 'won' : 'lost';
}

function matchRrSigned(mmrChange: number): string {
    return mmrChange > 0 ? `+${mmrChange}` : String(mmrChange);
}

function matchVars(data: MatchTextData, lang: string, mmrChange: number): Record<string, string | number> {
    return {
        map: data.derived.map_name,
        agent: data.derived.agent_name,
        result: matchResultVerb(data, lang),
        rr: matchRrSigned(mmrChange),
        kda: data.derived.kda,
        hs: data.derived.hs_percent,
        name: ''
    };
}

export function formatMatchText(
    data: MatchTextData,
    lang: string,
    type: string,
    mmrChange = 0,
    style: TextStyle | string = 'default',
    template?: string | null
): string {
    const { map_name, kda, hs_percent, agent_name } = data.derived;
    const isEs = lang === 'es';
    const mode = normalizeStyle(style);
    const vars = matchVars(data, lang, mmrChange);
    const resultVerb = String(vars.result);
    const rrSigned = String(vars.rr);

    if (mode === 'custom') {
        const tpl = (template && template.trim()) || '{map} · {agent} · {rr}';
        return applyTemplate(tpl, vars);
    }

    if (mode === 'clean') {
        if (type === '2') return `${map_name} · ${agent_name} · ${rrSigned} · ${kda}`;
        if (type === '3') return `${map_name} · ${agent_name} · ${rrSigned} · ${kda} · ${hs_percent}% HS`;
        return `${map_name} · ${agent_name} · ${rrSigned}`;
    }

    if (isEs) {
        const pointsMsg = `${mmrChange} puntos`;
        if (type === '1') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg}`;
        if (type === '2') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}`;
        if (type === '3') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}, mi porcentaje de HS fue de ${hs_percent}% HS`;
        return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} (${kda})`;
    }

    const pointsMsg = `${mmrChange} RR`;
    if (type === '1') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg}`;
    if (type === '2') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} my kda was ${kda}`;
    if (type === '3') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} my kda was ${kda}, my HS percentage was ${hs_percent}%`;
    return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} (${kda})`;
}

function todayVars(data: TodaySummaryData, name: string): Record<string, string | number> {
    const { matches_played, wins, losses, draws, rr_change } = data;
    const winrate = matches_played > 0 ? Math.round((wins / matches_played) * 100) : 0;
    const changeSymbol = rr_change > 0 ? '+' : '';
    return {
        name,
        wins,
        losses,
        draws,
        rr: `${changeSymbol}${rr_change}`,
        matches: matches_played,
        winrate
    };
}

export function formatTodayText(
    data: TodaySummaryData,
    lang: string,
    name: string,
    type = '1',
    style: TextStyle | string = 'default',
    template?: string | null
): string {
    const isEs = lang === 'es';
    const mode = normalizeStyle(style);
    const vars = todayVars(data, name);

    if (data.matches_played === 0) {
        if (mode === 'custom') {
            const tpl = (template && template.trim()) || (isEs ? '{name}: 0 partidas' : '{name}: 0 matches');
            return applyTemplate(tpl, vars);
        }
        if (mode === 'clean') return isEs ? '0 partidas' : '0 matches';
        return isEs
            ? `Hoy ${name} no ha jugado ninguna partida de competitivo.`
            : `Today ${name} hasn't played any competitive matches.`;
    }

    const { matches_played, wins, losses, draws, rr_change } = data;
    const changeSymbol = rr_change > 0 ? '+' : '';
    const winrate = Math.round((wins / matches_played) * 100);

    if (mode === 'custom') {
        const tpl = (template && template.trim()) || '{wins}W {losses}L · {rr} RR';
        return applyTemplate(tpl, vars);
    }

    if (mode === 'clean') {
        const drawsPart = draws > 0 ? ` ${draws}D` : '';
        if (type === '2') return `${matches_played} · ${wins}W ${losses}L${drawsPart} · ${changeSymbol}${rr_change} RR`;
        if (type === '3') return `${matches_played} · ${wins}W ${losses}L${drawsPart} · ${winrate}% WR · ${changeSymbol}${rr_change} RR`;
        return `${wins}W ${losses}L${drawsPart} · ${changeSymbol}${rr_change} RR`;
    }

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

function statsVars(data: GeneralStatsData, name: string): Record<string, string | number> {
    return {
        name,
        winrate: data.winrate,
        agent: data.favorite_agent,
        hs: data.hs_percent,
        matches: data.matches_analyzed
    };
}

export function formatStatsText(
    data: GeneralStatsData,
    lang: string,
    name: string,
    type = '1',
    style: TextStyle | string = 'default',
    template?: string | null
): string {
    const isEs = lang === 'es';
    const mode = normalizeStyle(style);
    const vars = statsVars(data, name);
    const { winrate, favorite_agent, hs_percent, matches_analyzed } = data;

    if (matches_analyzed === 0) {
        if (mode === 'custom') {
            const tpl = (template && template.trim()) || (isEs ? '{name}: sin datos' : '{name}: no data');
            return applyTemplate(tpl, vars);
        }
        if (mode === 'clean') return isEs ? 'Sin datos' : 'No data';
        return isEs
            ? `${name} no tiene suficientes partidas recientes para analizar.`
            : `${name} does not have enough recent matches to analyze.`;
    }

    if (mode === 'custom') {
        const tpl = (template && template.trim()) || '{winrate}% WR · {agent} · {hs}% HS';
        return applyTemplate(tpl, vars);
    }

    if (mode === 'clean') {
        if (type === '2' || type === '3') return `${matches_analyzed}p · ${winrate}% WR · ${favorite_agent} · ${hs_percent}% HS`;
        return `${winrate}% WR · ${favorite_agent} · ${hs_percent}% HS`;
    }

    if (isEs) {
        if (type === '1') return `Stats de ${name} (${matches_analyzed} partidas): ${winrate}% WR | Agente: ${favorite_agent} | HS: ${hs_percent}%`;
        if (type === '2') return `${name} tiene un winrate del ${winrate}% en sus últimas ${matches_analyzed} partidas. Su agente más jugado es ${favorite_agent} (${hs_percent}% HS).`;
        if (type === '3') return `En sus últimas ${matches_analyzed} partidas, ${name} ha jugado principalmente con ${favorite_agent}, logrando un winrate del ${winrate}% y ${hs_percent}% de HS.`;
        return `Stats de ${name} (${matches_analyzed} partidas): ${winrate}% WR | Agente: ${favorite_agent} | HS: ${hs_percent}%`;
    }

    if (type === '1') return `${name}'s Stats (${matches_analyzed} matches): ${winrate}% WR | Agent: ${favorite_agent} | HS: ${hs_percent}%`;
    if (type === '2') return `${name} has a ${winrate}% winrate in their last ${matches_analyzed} matches. Most played agent is ${favorite_agent} (${hs_percent}% HS).`;
    if (type === '3') return `In their last ${matches_analyzed} matches, ${name} has primarily played ${favorite_agent}, achieving a ${winrate}% winrate and ${hs_percent}% HS.`;
    return `${name}'s Stats (${matches_analyzed} matches): ${winrate}% WR | Agent: ${favorite_agent} | HS: ${hs_percent}%`;
}
