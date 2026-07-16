import {
    formatRankText,
    formatMatchText,
    formatTodayText,
    formatStatsText
} from '../services/formatService';
import type {
    SummaryResponse,
    TodaySummaryData,
    GeneralStatsData
} from '../types/valorant';

export const generateBotCommand = (
    endpoint: string,
    type: string,
    platform: string,
    config: { rankF: string; matchF: string; todayF: string; statsF: string },
    lang: string,
    account: { name: string; tag: string; region: string } | null,
    /** Región elegida en la búsqueda (prioridad sobre account.region de Henrik) */
    searchRegion?: string,
): string => {
    if (!account) return '';
    const name = encodeURIComponent(account.name);
    const tag = encodeURIComponent(account.tag);
    // Henrik suele devolver "na" para LATAM/BR; usamos la región buscada
    const region = (searchRegion || account.region || 'na').toLowerCase();

    let formatStr = '?format=text';

    let typeVal = '1';
    if (type === 'rank') typeVal = config.rankF;
    if (type === 'match') typeVal = config.matchF;
    if (type === 'today') typeVal = config.todayF;
    if (type === 'stats') typeVal = config.statsF;

    if (typeVal !== '1') {
        formatStr += `&type=${typeVal}`;
    }

    if (lang !== 'es') {
        formatStr += `&lang=${lang}`;
    }

    const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : 'https://vlr.losperris.dev';
    const url = `${baseUrl}/api/${endpoint}/${region}/${name}/${tag}${formatStr}`;

    if (platform === 'nightbot') {
        return `!addcom !${type} $(urlfetch ${url})`;
    }
    return `!addcmd !${type} $(customapi ${url})`;
};

/** Ejemplo de respuesta usando los datos reales del jugador buscado. */
export const getCommandExample = (
    type: string,
    config: { rankF: string; matchF: string; todayF: string; statsF: string },
    lang: string,
    data: SummaryResponse | null
): string => {
    if (!data?.account) return '';

    const name = data.account.name || data.rank?.name || 'Player';

    if (type === 'rank' && data.rank) {
        return formatRankText(data.rank, lang, config.rankF);
    }

    if (type === 'match' && data.match?.derived) {
        return formatMatchText(
            data.match,
            lang,
            config.matchF,
            data.rank?.mmr_change_to_last_game ?? 0
        );
    }

    if (type === 'today') {
        const today = deriveTodayFromHistory(data);
        return formatTodayText(today, lang, name, config.todayF);
    }

    if (type === 'stats') {
        const stats = deriveStatsFromMatch(data, name);
        return formatStatsText(stats, lang, name, config.statsF);
    }

    return '';
};

function deriveTodayFromHistory(data: SummaryResponse): TodaySummaryData {
    const history = data.history ?? [];
    if (history.length === 0) {
        return { matches_played: 0, wins: 0, losses: 0, draws: 0, rr_change: 0 };
    }

    // Usa el historial reciente como preview (no es “hoy” real, pero refleja al jugador)
    const sample = history.slice(-5);
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let rr_change = 0;

    for (const m of sample) {
        rr_change += m.change;
        if (m.change > 0) wins++;
        else if (m.change < 0) losses++;
        else draws++;
    }

    return {
        matches_played: sample.length,
        wins,
        losses,
        draws,
        rr_change
    };
}

function deriveStatsFromMatch(data: SummaryResponse, _name: string): GeneralStatsData {
    const match = data.match;
    if (!match?.derived) {
        return {
            matches_analyzed: 0,
            winrate: 0,
            favorite_agent: '—',
            hs_percent: '0'
        };
    }

    const history = data.history ?? [];
    const wins = history.filter((m) => m.change > 0).length;
    const total = history.length || 1;
    const winrate = Math.round((wins / total) * 100);

    return {
        matches_analyzed: history.length || 1,
        winrate,
        favorite_agent: match.derived.agent_name,
        hs_percent: String(match.derived.hs_percent)
    };
}
