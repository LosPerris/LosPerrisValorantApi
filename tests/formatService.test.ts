import {
  translateRank,
  formatRankText,
  formatMatchText,
  formatTodayText,
  formatStatsText,
  formatMatchData,
  formatHistoryData,
} from '../src/services/formatService';
import type {
  FormattedRankData,
  MatchTextData,
  ValorantApiResponse,
  ValorantMMRHistoryItem,
  ValorantMatch,
} from '../src/types/valorant';

const rankData: FormattedRankData = {
  puuid: 'puuid-1',
  region: 'na',
  account_level: 100,
  name: 'Player',
  tag: 'TAG',
  card: '',
  last_update: '',
  current_tier: 14,
  current_tier_patched: 'Gold 3',
  ranking_in_tier: 45,
  mmr_change_to_last_game: 12,
  elo: 1550,
  rank_image: 'https://img.valorant-api.com/rank.png',
};

const matchTextData: MatchTextData = {
  derived: {
    map_name: 'Ascent',
    is_win: true,
    is_draw: false,
    kda: '20/10/5',
    hs_percent: '15.0',
    agent_name: 'Jett',
    agent_icon: 'jett.png',
    agent_image: 'jett_bust.png',
    map_image: null,
  },
};

describe('translateRank', () => {
  it('traduce rangos al español', () => {
    expect(translateRank('Gold 3', 'es')).toBe('Oro 3');
    expect(translateRank('Diamond 1', 'es')).toBe('Diamante 1');
  });

  it('devuelve el rango sin cambios en inglés', () => {
    expect(translateRank('Gold 3', 'en')).toBe('Gold 3');
  });
});

describe('formatRankText', () => {
  it('genera texto según el tipo en español', () => {
    expect(formatRankText(rankData, 'es', '1')).toContain('Oro 3');
    expect(formatRankText(rankData, 'es', '2')).toContain('45 puntos');
    expect(formatRankText(rankData, 'es', '3')).toContain('1550');
  });

  it('genera texto según el tipo en inglés', () => {
    expect(formatRankText(rankData, 'en', '2')).toContain('45 RR');
  });

  it('style=clean solo devuelve el dato', () => {
    expect(formatRankText(rankData, 'es', '1', 'clean')).toBe('Oro 3');
    expect(formatRankText(rankData, 'es', '2', 'clean')).toBe('Oro 3 · 45 RR');
    expect(formatRankText(rankData, 'es', '3', 'clean')).toBe('Oro 3 · 45 RR · MMR 1550');
  });

  it('style=custom aplica plantilla con variables', () => {
    expect(formatRankText(rankData, 'es', '1', 'custom', 'Rango: {rank} ({rr})')).toBe('Rango: Oro 3 (45)');
  });
});

describe('formatMatchText', () => {
  it('incluye mapa, agente y resultado en español', () => {
    const text = formatMatchText(matchTextData, 'es', '1', 15);
    expect(text).toContain('Ascent');
    expect(text).toContain('Jett');
    expect(text).toContain('gané');
    expect(text).toContain('15 puntos');
  });

  it('añade KDA y HS en tipos más detallados', () => {
    const lossData: MatchTextData = {
      ...matchTextData,
      derived: { ...matchTextData.derived, is_win: false, is_draw: false },
    };
    const text = formatMatchText(lossData, 'es', '3', -10);
    expect(text).toContain('20/10/5');
    expect(text).toContain('15.0% HS');
    expect(text).toContain('perdí');
  });

  it('usa empaté en empates y conserva el RR (puede ser distinto de 0)', () => {
    const drawData: MatchTextData = {
      ...matchTextData,
      derived: { ...matchTextData.derived, is_win: false, is_draw: true },
    };
    const text = formatMatchText(drawData, 'es', '1', 3);
    expect(text).toContain('empaté');
    expect(text).toContain('3 puntos');
    expect(text).not.toContain('gané');
    expect(text).not.toContain('perdí');
  });
});

describe('formatTodayText', () => {
  it('informa cuando no hay partidas hoy', () => {
    expect(formatTodayText({ matches_played: 0, wins: 0, losses: 0, draws: 0, rr_change: 0 }, 'es', 'Jean'))
      .toContain('no ha jugado');
  });

  it('resume victorias, derrotas y RR', () => {
    const text = formatTodayText(
      { matches_played: 3, wins: 2, losses: 1, draws: 0, rr_change: 25 },
      'es',
      'Jean',
      '2',
    );
    expect(text).toContain('3 partidas');
    expect(text).toContain('+25 RR');
  });
});

describe('formatStatsText', () => {
  it('avisa si no hay partidas para analizar', () => {
    expect(
      formatStatsText(
        { matches_analyzed: 0, winrate: 0, favorite_agent: '—', hs_percent: '0' },
        'es',
        'Jean',
      ),
    ).toContain('no tiene suficientes partidas');
  });

  it('formatea stats con winrate y agente favorito', () => {
    const text = formatStatsText(
      { matches_analyzed: 10, winrate: 60, favorite_agent: 'Jett', hs_percent: '22' },
      'es',
      'Jean',
      '1',
    );
    expect(text).toContain('60% WR');
    expect(text).toContain('Jett');
  });
});

describe('formatMatchData', () => {
  const puuid = 'player-uuid';

  const makeMatch = (outcome: 'win' | 'loss' | 'draw'): ValorantMatch => {
    const onBlue = outcome !== 'loss';
    const redWon = outcome === 'loss';
    const blueWon = outcome === 'win';
    return {
      metadata: {
        map: 'Ascent',
        matchid: 'm1',
        game_start: 0,
        game_start_patched: '',
        game_length: 0,
        game_version: '9.0',
        mode: 'Competitive',
        mode_id: 'competitive',
        queue: 'competitive',
        rounds_played: 24,
        season_id: '',
        platform: '',
        region: 'na',
        cluster: '',
      },
      players: {
        all_players: [
          {
            puuid,
            name: 'Player',
            tag: 'TAG',
            team: onBlue ? 'Blue' : 'Red',
            level: 100,
            character: 'Jett',
            currenttier: 15,
            currenttier_patched: 'Gold 3',
            player_card: '',
            player_title: '',
            party_id: '',
            session_playtime: { minutes: 0, seconds: 0, milliseconds: 0 },
            assets: {
              card: { small: '', large: '', wide: '' },
              agent: { small: 'jett.png', bust: 'jett_bust.png', full: 'jett_full.png', killfeed: '' },
            },
            behaviour: { afk_rounds: 0, friendly_fire: { incoming: 0, outgoing: 0 }, rounds_in_spawn: 0 },
            platform: { type: 'PC', os: { name: 'Windows', version: '10' } },
            ability_casts: { c_cast: 0, q_cast: 0, e_cast: 0, x_cast: 0 },
            stats: { score: 0, kills: 18, deaths: 9, assists: 4, bodyshots: 80, headshots: 20, legshots: 5 },
            economy: { spent: { overall: 0, average: 0 }, loadout_value: { overall: 0, average: 0 } },
            damage_made: 0,
            damage_received: 0,
          },
        ],
        red: [],
        blue: [],
      },
      teams: {
        red: { has_won: redWon, rounds_won: redWon ? 13 : 12, rounds_lost: redWon ? 11 : 12, roster: [] },
        blue: { has_won: blueWon, rounds_won: blueWon ? 13 : 12, rounds_lost: blueWon ? 11 : 12, roster: [] },
      },
      rounds: [],
    };
  };

  it('deriva KDA, HS y victoria correctamente', () => {
    const result = formatMatchData(makeMatch('win'), puuid);
    expect(result?.derived.kda).toBe('18/9/4');
    expect(result?.derived.is_win).toBe(true);
    expect(result?.derived.is_draw).toBe(false);
    expect(result?.derived.hs_percent).toBe('19.0');
  });

  it('marca empate cuando ningún equipo ganó', () => {
    const result = formatMatchData(makeMatch('draw'), puuid);
    expect(result?.derived.is_win).toBe(false);
    expect(result?.derived.is_draw).toBe(true);
  });

  it('devuelve null si el jugador no está en la partida', () => {
    expect(formatMatchData(makeMatch('win'), 'otro-uuid')).toBeNull();
  });
});

describe('formatHistoryData', () => {
  it('invierte el orden para mostrar la partida más reciente primero', () => {
    const history: ValorantApiResponse<ValorantMMRHistoryItem[]> = {
      status: 200,
      data: [
        {
          currenttier: 15,
          currenttierpatched: 'Gold 3',
          images: { small: '', large: '', triangle_down: '', triangle_up: '' },
          match_id: 'm1',
          map: { name: 'Ascent', id: 'map-1' },
          season_id: '',
          ranking_in_tier: 50,
          mmr_change_to_last_game: 10,
          elo: 1500,
          date: '2024-01-01',
          date_raw: 1,
        },
        {
          currenttier: 15,
          currenttierpatched: 'Gold 3',
          images: { small: '', large: '', triangle_down: '', triangle_up: '' },
          match_id: 'm2',
          map: { name: 'Bind', id: 'map-2' },
          season_id: '',
          ranking_in_tier: 55,
          mmr_change_to_last_game: -8,
          elo: 1492,
          date: '2024-01-02',
          date_raw: 2,
        },
      ],
    };

    const formatted = formatHistoryData(history);
    expect(formatted[0].map).toBe('Bind');
    expect(formatted[1].map).toBe('Ascent');
  });
});
