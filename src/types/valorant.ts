export interface ValorantApiResponse<T> {
    status: number;
    data: T;
    errors?: unknown[];
    message?: string;
}

export interface ValorantAccount {
    puuid: string;
    region: string;
    account_level: number;
    name: string;
    tag: string;
    card: {
        small: string;
        large: string;
        wide: string;
        id: string;
    };
    last_update: string;
    last_update_raw: number;
}

export interface ValorantMMR {
    current_data: {
        currenttier: number;
        currenttierpatched: string;
        images: {
            small: string;
            large: string;
            triangle_down: string;
            triangle_up: string;
        };
        ranking_in_tier: number;
        mmr_change_to_last_game: number;
        elo: number;
        games_needed_for_rating: number;
        old: boolean;
    };
    highest_rank?: {
        old: boolean;
        tier: number;
        patched_tier: string;
        season: string;
    };
}

export interface ValorantMatchPlayer {
    puuid: string;
    name: string;
    tag: string;
    team: string;
    level: number;
    character: string;
    currenttier: number;
    currenttier_patched: string;
    player_card: string;
    player_title: string;
    party_id: string;
    session_playtime: {
        minutes: number;
        seconds: number;
        milliseconds: number;
    };
    assets: {
        card: {
            small: string;
            large: string;
            wide: string;
        };
        agent: {
            small: string;
            bust: string;
            full: string;
            killfeed: string;
        };
    };
    behaviour: {
        afk_rounds: number;
        friendly_fire: {
            incoming: number;
            outgoing: number;
        };
        rounds_in_spawn: number;
    };
    platform: {
        type: string;
        os: {
            name: string;
            version: string;
        };
    };
    ability_casts: {
        c_cast: number;
        q_cast: number;
        e_cast: number;
        x_cast: number;
    };
    stats: {
        score: number;
        kills: number;
        deaths: number;
        assists: number;
        bodyshots: number;
        headshots: number;
        legshots: number;
    };
    economy: {
        spent: {
            overall: number;
            average: number;
        };
        loadout_value: {
            overall: number;
            average: number;
        };
    };
    damage_made: number;
    damage_received: number;
}

export interface ValorantMatchTeam {
    has_won: boolean;
    rounds_won: number;
    rounds_lost: number;
    roster: ValorantMatchPlayer[];
}

export interface ValorantMatchMetadata {
    map: string;
    game_version: string;
    game_length: number;
    game_start: number;
    game_start_patched: string;
    rounds_played: number;
    mode: string;
    mode_id: string;
    queue: string;
    season_id: string;
    platform: string;
    matchid: string;
    region: string;
    cluster: string;
}

export interface ValorantMatch {
    metadata: ValorantMatchMetadata;
    players: {
        all_players: ValorantMatchPlayer[];
        red: ValorantMatchPlayer[];
        blue: ValorantMatchPlayer[];
    };
    teams: {
        red: ValorantMatchTeam;
        blue: ValorantMatchTeam;
    };
    rounds: ValorantRound[];
}

export interface ValorantMMRHistoryItem {
    currenttier: number;
    currenttierpatched: string;
    images: {
        small: string;
        large: string;
        triangle_down: string;
        triangle_up: string;
    };
    match_id: string;
    map: {
        name: string;
        id: string;
    };
    season_id: string;
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    date: string;
    date_raw: number;
}

export interface RankTextData {
    name: string;
    tag: string;
    rank: string;
    ranking_in_tier: number;
    elo: number;
}

export interface FormattedRankData extends RankTextData {
    puuid: string;
    region: string;
    rank_image: string;
    mmr_change: number;
    card: ValorantAccount['card'];
}

export interface DerivedMatchData {
    map_name: string;
    is_win: boolean;
    kda: string;
    hs_percent: string | number;
    agent_name: string;
    agent_icon: string;
    agent_image: string;
    map_image: string | null;
}

export interface MatchTextData {
    derived: DerivedMatchData;
}

export interface ValorantRound {
    round_num: number;
    player_stats: ValorantMatchPlayer[];
}

export interface FormattedMatchData extends ValorantMatch, MatchTextData { }

export interface FormattedHistoryMatch {
    date: string;
    elo: number;
    change: number;
    map: string;
}

export interface SummaryResponse {
    account: ValorantAccount;
    rank: FormattedRankData | null;
    match: FormattedMatchData | null;
    history: FormattedHistoryMatch[] | null;
}
