import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';

// ── Mock axios ──────────────────────────────────────────────────────────────
jest.mock('axios', () => {
    const mockAxios = {
        create: jest.fn().mockReturnThis(),
        get: jest.fn(),
        defaults: { headers: { common: {} } },
        interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
    };
    return { default: mockAxios, ...mockAxios };
});

jest.mock('../public/js/translations', () => ({
    en: {
        error: 'An error occurred',
        errorUserNotFound: 'User not found',
        errorRateLimit: 'Rate limit reached',
        errorUnauthorized: 'Unauthorized'
    },
    es: {
        error: 'Ocurrió un error',
        errorUserNotFound: 'Usuario no encontrado',
        errorRateLimit: 'Límite de peticiones',
        errorUnauthorized: 'No autorizado'
    },
    pt: {
        error: 'Ocorreu um erro',
        errorUserNotFound: 'Jogador não encontrado',
        errorRateLimit: 'Muitas requisições',
        errorUnauthorized: 'Não autorizado'
    },
    rankNames: {}
}), { virtual: true });

import app from '../api/index';
import axiosInstance from '../src/services/henrikClient';

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

// ── Fixtures ─────────────────────────────────────────────────────────────────
const makeAccount = (name = 'TestPlayer', tag = 'EUW', puuid = 'puuid-1234') => ({
    status: 200,
    data: {
        puuid,
        region: 'eu',
        account_level: 200,
        name,
        tag,
        card: { small: '', large: '', wide: '', id: '' },
        last_update: '',
        last_update_raw: 0
    }
});

const makeMmr = (rank = 'Gold 3', rr = 50, elo = 1550, change = 20) => ({
    status: 200,
    data: {
        current_data: {
            currenttier: 15,
            currenttierpatched: rank,
            images: { small: '', large: 'https://img.valorant-api.com/rank.png', triangle_down: '', triangle_up: '' },
            ranking_in_tier: rr,
            mmr_change_to_last_game: change,
            elo,
            games_needed_for_rating: 0,
            old: false
        }
    }
});

const makeMatch = (puuid = 'puuid-1234', isWin = true) => ({
    status: 200,
    data: [{
        metadata: { map: 'Ascent', matchid: 'match-1', game_start: 1700000000, game_start_patched: '', game_length: 2700000, mode: 'Competitive', mode_id: 'competitive', queue: 'competitive', rounds_played: 25, season_id: '', platform: '', region: 'eu', cluster: '' },
        players: {
            all_players: [{
                puuid,
                name: 'TestPlayer', tag: 'EUW', team: isWin ? 'Blue' : 'Red',
                level: 200, character: 'Jett', currenttier: 15, currenttier_patched: 'Gold 3',
                player_card: '', player_title: '', party_id: '',
                session_playtime: { minutes: 45, seconds: 0, milliseconds: 0 },
                assets: {
                    card: { small: '', large: '', wide: '' },
                    agent: { small: 'jett.png', bust: 'jett_bust.png', full: 'jett_full.png', killfeed: '' }
                },
                behaviour: { afk_rounds: 0, friendly_fire: { incoming: 0, outgoing: 0 }, rounds_in_spawn: 0 },
                platform: { type: 'PC', os: { name: 'Windows', version: '10' } },
                ability_casts: { c_cast: 5, q_cast: 3, e_cast: 8, x_cast: 2 },
                stats: { score: 4200, kills: 20, deaths: 10, assists: 5, bodyshots: 80, headshots: 15, legshots: 5 },
                economy: { spent: { overall: 80000, average: 3200 }, loadout_value: { overall: 90000, average: 3600 } },
                damage_made: 5000,
                damage_received: 3000
            }],
            red: [], blue: []
        },
        teams: {
            red: { has_won: !isWin, rounds_won: isWin ? 11 : 13, rounds_lost: isWin ? 13 : 11, roster: [] },
            blue: { has_won: isWin, rounds_won: isWin ? 13 : 11, rounds_lost: isWin ? 11 : 13, roster: [] }
        },
        rounds: []
    }]
});

const makeHistory = () => ({
    status: 200,
    data: Array.from({ length: 5 }, (_, i) => ({
        currenttier: 15, currenttierpatched: 'Gold 3',
        images: { small: '', large: '', triangle_down: '', triangle_up: '' },
        match_id: `match-${i}`, map: { name: 'Ascent', id: 'uuid' },
        season_id: '', ranking_in_tier: 50 + i * 5,
        mmr_change_to_last_game: i % 2 === 0 ? 15 : -10,
        elo: 1550 + i * 5, date: '2024-01-01', date_raw: 1700000000 + i
    }))
});

// ── /rank Tests ───────────────────────────────────────────────────────────────
describe('GET /api/valorant/rank/:region/:name/:tag', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('returns 200 with rank data', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: makeAccount() }).mockResolvedValueOnce({ data: makeMmr() });
        const res = await request(app).get('/api/valorant/rank/eu/TestPlayer/EUW');
        expect(res.status).toBe(200);
        expect(res.body.data.rank).toBe('Gold 3');
        expect(res.body.data.elo).toBe(1550);
    });

    it('returns 400 for invalid region', async () => {
        const res = await request(app).get('/api/valorant/rank/invalid/TestPlayer/EUW');
        expect(res.status).toBe(400);
    });

    it('returns plain text for ?format=text', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: makeAccount() }).mockResolvedValueOnce({ data: makeMmr() });
        const res = await request(app).get('/api/valorant/rank/eu/TestPlayer/EUW?format=text&type=1');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Gold 3');
    });

    it('returns 404 when account not found', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { status: 404, message: 'Not found' } });
        const res = await request(app).get('/api/valorant/rank/eu/Ghost/EUW');
        expect(res.status).toBe(404);
    });

    it('returns translated rank text in Spanish (?lang=es)', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: makeAccount() }).mockResolvedValueOnce({ data: makeMmr('Gold 3') });
        const res = await request(app).get('/api/valorant/rank/eu/TestPlayer/EUW?format=text&type=1&lang=es');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Oro 3');
    });
});

// ── /match Tests ──────────────────────────────────────────────────────────────
describe('GET /api/valorant/match/:region/:name/:tag', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('returns 200 with last match data', async () => {
        mockedAxios.get
            .mockResolvedValueOnce({ data: makeAccount() })    // account
            .mockResolvedValueOnce({ data: makeMatch() })      // matches
            .mockResolvedValueOnce({ data: makeMmr() });       // mmr
        const res = await request(app).get('/api/valorant/match/eu/TestPlayer/EUW');
        expect(res.status).toBe(200);
        expect(res.body.data.derived.map_name).toBe('Ascent');
        expect(res.body.data.derived.agent_name).toBe('Jett');
    });

    it('returns 400 for invalid region', async () => {
        const res = await request(app).get('/api/valorant/match/invalid/TestPlayer/EUW');
        expect(res.status).toBe(400);
    });

    it('returns match text for ?format=text', async () => {
        mockedAxios.get
            .mockResolvedValueOnce({ data: makeAccount() })
            .mockResolvedValueOnce({ data: makeMatch() })
            .mockResolvedValueOnce({ data: makeMmr() });
        const res = await request(app).get('/api/valorant/match/eu/TestPlayer/EUW?format=text&type=1');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Ascent');
        expect(res.text).toContain('Jett');
    });
});

// ── /history Tests ────────────────────────────────────────────────────────────
describe('GET /api/valorant/history/:region/:name/:tag', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('returns 200 with formatted history array', async () => {
        mockedAxios.get
            .mockResolvedValueOnce({ data: makeAccount() })
            .mockResolvedValueOnce({ data: makeHistory() });
        const res = await request(app).get('/api/valorant/history/eu/TestPlayer/EUW');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toHaveProperty('elo');
        expect(res.body.data[0]).toHaveProperty('change');
        expect(res.body.data[0]).toHaveProperty('map');
    });

    it('returns 400 for invalid region', async () => {
        const res = await request(app).get('/api/valorant/history/invalid/TestPlayer/EUW');
        expect(res.status).toBe(400);
    });
});
