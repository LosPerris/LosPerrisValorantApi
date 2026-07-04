import { generateBotCommand } from '../src/utils/commandHelpers';

const account = { name: 'Jean Cast', tag: 'PONSS', region: 'latam' };
const config = { rankF: '2', matchF: '1', todayF: '3', statsF: '1' };

describe('generateBotCommand', () => {
  it('devuelve cadena vacía sin cuenta', () => {
    expect(generateBotCommand('rank', 'rank', 'nightbot', config, 'es', null)).toBe('');
  });

  it('genera comando Nightbot con format=text y type', () => {
    const cmd = generateBotCommand('rank', 'rank', 'nightbot', config, 'es', account);
    expect(cmd).toBe(
      '!addcom !rank $(urlfetch https://vlr.losperris.dev/api/rank/latam/Jean%20Cast/PONSS?format=text&type=2)',
    );
  });

  it('genera comando StreamElements con lang distinto de es', () => {
    const cmd = generateBotCommand('match', 'match', 'streamelements', config, 'en', account);
    expect(cmd).toContain('$(customapi ');
    expect(cmd).toContain('&lang=en');
    expect(cmd).not.toContain('&type=');
  });

  it('codifica nombre y tag en la URL', () => {
    const cmd = generateBotCommand('stats', 'stats', 'nightbot', config, 'pt', {
      name: 'Player #1',
      tag: 'EU/W',
      region: 'eu',
    });
    expect(cmd).toContain('Player%20%231');
    expect(cmd).toContain('EU%2FW');
  });
});
