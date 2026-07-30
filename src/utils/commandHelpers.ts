import {
    formatRankText,
    formatMatchText,
    formatTodayText,
    formatStatsText,
    type TextStyle,
    RANK_TEMPLATE_VARS,
    MATCH_TEMPLATE_VARS,
    TODAY_TEMPLATE_VARS,
    STATS_TEMPLATE_VARS
} from '../services/formatService';
import type {
    SummaryResponse,
    TodaySummaryData,
    GeneralStatsData
} from '../types/valorant';

export { RANK_TEMPLATE_VARS, MATCH_TEMPLATE_VARS, TODAY_TEMPLATE_VARS, STATS_TEMPLATE_VARS };

export type CommandFormats = {
    rankF: string;
    matchF: string;
    todayF: string;
    statsF: string;
};

export type CommandStyleConfig = {
    style: TextStyle;
    templates: {
        rank: string;
        match: string;
        today: string;
        stats: string;
    };
};

const DEFAULT_TEMPLATES = {
    rank: '{rank}',
    match: '{map} · {agent} · {rr}',
    today: '{wins}W {losses}L · {rr} RR',
    stats: '{winrate}% WR · {agent} · {hs}% HS'
};

export const generateBotCommand = (
    endpoint: string,
    type: string,
    platform: string,
    config: CommandFormats,
    lang: string,
    account: { name: string; tag: string; region: string } | null,
    /** Región elegida en la búsqueda (prioridad sobre account.region de Henrik) */
    searchRegion?: string,
    styleConfig?: CommandStyleConfig,
    copyFormat?: 'full' | 'variable' | 'url',
    apiKey?: string
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

    const style = styleConfig?.style || 'default';

    // type solo aplica a default/clean; custom usa plantilla
    if (style !== 'custom' && typeVal !== '1') {
        formatStr += `&type=${typeVal}`;
    }

    if (style !== 'default') {
        formatStr += `&style=${style}`;
    }

    if (style === 'custom' && styleConfig) {
        const tpl =
            type === 'rank'
                ? styleConfig.templates.rank
                : type === 'match'
                  ? styleConfig.templates.match
                  : type === 'today'
                    ? styleConfig.templates.today
                    : styleConfig.templates.stats;
        if (tpl?.trim()) {
            formatStr += `&template=${encodeURIComponent(tpl.trim())}`;
        }
    }

    if (lang !== 'es') {
        formatStr += `&lang=${lang}`;
    }

    if (apiKey?.trim()) {
        formatStr += `&api_key=${encodeURIComponent(apiKey.trim())}`;
    }

    const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : 'https://vlr.losperris.dev';
    const url = `${baseUrl}/api/${endpoint}/${region}/${name}/${tag}${formatStr}`;

    if (copyFormat === 'url') {
        return url;
    }

    if (platform === 'nightbot') {
        return copyFormat === 'variable' ? `$(urlfetch ${url})` : `!addcom !${type} $(urlfetch ${url})`;
    }
    
    if (platform === 'fossabot') {
        return copyFormat === 'variable' ? `$(customapi ${url})` : `!addcmd !${type} $(customapi ${url})`;
    }
    
    // Fallback
    return `$(urlfetch ${url})`;
};

/** Ejemplo de respuesta usando los datos reales del jugador buscado. */
export const getCommandExample = (
    type: string,
    config: CommandFormats,
    lang: string,
    data: SummaryResponse | null,
    styleConfig?: CommandStyleConfig
): string => {
    if (!data?.account) return '';

    const name = data.account.name || data.rank?.name || 'Player';
    const style = styleConfig?.style || 'default';
    const templates = styleConfig?.templates || DEFAULT_TEMPLATES;

    if (type === 'rank' && data.rank) {
        return formatRankText(data.rank, lang, config.rankF, style, templates.rank);
    }

    if (type === 'match' && data.match?.derived) {
        return formatMatchText(
            data.match,
            lang,
            config.matchF,
            data.rank?.mmr_change_to_last_game ?? 0,
            style,
            templates.match
        );
    }

    if (type === 'today') {
        const today = deriveTodayFromHistory(data);
        return formatTodayText(today, lang, name, config.todayF, style, templates.today);
    }

    if (type === 'stats') {
        const stats = deriveStatsFromMatch(data, name);
        return formatStatsText(stats, lang, name, config.statsF, style, templates.stats);
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
