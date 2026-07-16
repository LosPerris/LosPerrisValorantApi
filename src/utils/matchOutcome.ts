export type MatchOutcome = 'win' | 'loss' | 'draw';

type TeamResult = { has_won: boolean };

/**
 * Resultado del mapa según has_won de cada equipo.
 * Empate: ninguno ganó (o ambos, caso anómalo). El RR puede subir o bajar igual.
 */
export function getMatchOutcome(
    teams: { red: TeamResult; blue: TeamResult },
    playerTeam: string
): MatchOutcome {
    const redWon = teams.red.has_won;
    const blueWon = teams.blue.has_won;

    if (redWon === blueWon) return 'draw';

    const playerWon = playerTeam === 'Red' ? redWon : blueWon;
    return playerWon ? 'win' : 'loss';
}
