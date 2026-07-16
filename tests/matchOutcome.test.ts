import { getMatchOutcome } from '../src/utils/matchOutcome';

describe('getMatchOutcome', () => {
  it('marca victoria del equipo del jugador', () => {
    expect(
      getMatchOutcome({ red: { has_won: false }, blue: { has_won: true } }, 'Blue'),
    ).toBe('win');
    expect(
      getMatchOutcome({ red: { has_won: true }, blue: { has_won: false } }, 'Red'),
    ).toBe('win');
  });

  it('marca derrota del equipo del jugador', () => {
    expect(
      getMatchOutcome({ red: { has_won: false }, blue: { has_won: true } }, 'Red'),
    ).toBe('loss');
  });

  it('marca empate cuando nadie ganó (aunque el RR pueda cambiar aparte)', () => {
    expect(
      getMatchOutcome({ red: { has_won: false }, blue: { has_won: false } }, 'Blue'),
    ).toBe('draw');
    expect(
      getMatchOutcome({ red: { has_won: false }, blue: { has_won: false } }, 'Red'),
    ).toBe('draw');
  });
});
