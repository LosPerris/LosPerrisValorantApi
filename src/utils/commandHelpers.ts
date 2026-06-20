export const generateBotCommand = (
  endpoint: string,
  type: string,
  platform: string,
  config: { rankF: string; matchF: string; todayF: string; statsF: string },
  lang: string,
  account: { name: string; tag: string; region: string } | null
): string => {
  if (!account) return '';
  const name = encodeURIComponent(account.name);
  const tag = encodeURIComponent(account.tag);
  const region = account.region || 'na';
  
  let formatStr = '?format=text';
  
  let typeVal = '1';
  if (type === 'rank' && config.rankF !== '1') typeVal = config.rankF;
  if (type === 'match' && config.matchF !== '1') typeVal = config.matchF;
  if (type === 'today' && config.todayF !== '1') typeVal = config.todayF;
  if (type === 'stats' && config.statsF !== '1') typeVal = config.statsF;

  if (typeVal !== '1') {
    formatStr += `&type=${typeVal}`;
  }

  if (lang !== 'es') {
    formatStr += `&lang=${lang}`;
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.losperris.dev';
  const url = `${baseUrl}/api/valorant/${endpoint}/${region}/${name}/${tag}${formatStr}`;
  
  if (platform === 'nightbot') {
    return `!addcom !${type} $(urlfetch ${url})`;
  } else {
    return `!addcmd !${type} $(customapi ${url})`;
  }
};

export const getCommandExample = (
  type: string,
  config: { rankF: string; matchF: string; todayF: string; statsF: string },
  lang: string
): string => {
  const isEs = lang === 'es';

  if (type === 'rank') {
    if (config.rankF === '2') return isEs ? 'Actualmente estoy en Oro 3' : 'I am currently Gold 3';
    if (config.rankF === '3') return isEs ? 'Actualmente estoy en Oro 3 con 47 puntos, mi mmr es de 1147' : 'I am currently Gold 3 with 47 points, my mmr is 1147';
    if (config.rankF === '4') return 'Oro 3';
    return isEs ? 'Actualmente estoy en Oro 3 con 47 puntos' : 'I am currently Gold 3 with 47 points';
  }

  if (type === 'match') {
    if (config.matchF === '2') return isEs ? 'PonssLoveless Jugó Pearl y Ganó la última partida.' : 'PonssLoveless played Pearl and Won the last match.';
    if (config.matchF === '3') return '12/4/3';
    return isEs ? 'En la última partida, Jugó Pearl y Ganó sacando 12/4/3' : 'In the last match, played Pearl and Won getting 12/4/3';
  }

  if (type === 'today') {
    if (config.todayF === '2') return isEs ? 'Hoy he jugado 4 partidas, y he ganado 2.' : 'Today I played 4 matches, and won 2.';
    if (config.todayF === '3') return isEs ? 'Partidas jugadas hoy: 4' : 'Matches played today: 4';
    if (config.todayF === '4') return isEs ? 'He ganado 2 partidas hoy.' : 'I won 2 matches today.';
    return isEs ? 'Hoy he jugado 4 partidas, he ganado 2 y mi mmr ha subido en +25 puntos.' : 'Today I played 4 matches, won 2 and my mmr changed by +25 points.';
  }

  // stats
  return 'K/D: 1.2 · Headshots: 24% · WR: 52%';
};
