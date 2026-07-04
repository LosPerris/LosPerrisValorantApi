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

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vlr.losperris.dev';
  const url = `${baseUrl}/api/${endpoint}/${region}/${name}/${tag}${formatStr}`;
  
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
    if (config.rankF === '2') return isEs ? 'Actualmente estoy en Oro 3' : 'Currently I am in Gold 3';
    if (config.rankF === '3') return isEs ? 'Actualmente estoy en Oro 3 con 47 puntos, mi mmr es de 1147' : 'Currently I am in Gold 3 with 47 RR, my mmr is 1147';
    return isEs ? 'Actualmente estoy en Oro 3 con 47 puntos' : 'Currently I am in Gold 3 with 47 RR';
  }

  if (type === 'match') {
    if (config.matchF === '2') return isEs ? 'Mi última partida fue en Pearl con Jett gané 25 puntos mi kda fue de 12/4/3' : 'My last match was on Pearl with Jett won 25 RR my kda was 12/4/3';
    if (config.matchF === '3') return isEs ? 'Mi última partida fue en Pearl con Jett gané 25 puntos mi kda fue de 12/4/3, mi porcentaje de HS fue de 24% HS' : 'My last match was on Pearl with Jett won 25 RR my kda was 12/4/3, my HS percentage was 24%';
    return isEs ? 'Mi última partida fue en Pearl con Jett gané 25 puntos' : 'My last match was on Pearl with Jett won 25 RR';
  }

  if (type === 'today') {
    if (config.todayF === '2') return isEs ? 'Hoy Ponss ha jugado 3 partidas: 2 Victorias, 1 Derrotas (Total: +15 RR).' : 'Today Ponss has played 3 matches: 2 Wins, 1 Losses (Total: +15 RR).';
    if (config.todayF === '3') return isEs ? 'Hoy Ponss ha jugado 3 partidas (66% Winrate): 2 Victorias, 1 Derrotas (Total: +15 RR).' : 'Today Ponss has played 3 matches (66% Winrate): 2 Wins, 1 Losses (Total: +15 RR).';
    return isEs ? 'Hoy Ponss lleva 2 Victorias, 1 Derrotas (Total: +15 RR).' : 'Today Ponss has 2 Wins, 1 Losses (Total: +15 RR).';
  }

  // stats
  if (config.statsF === '2') return isEs ? 'En sus últimas 5 partidas, Ponss ha jugado principalmente con Jett, logrando un winrate del 50% y 24% de HS.' : 'In their last 5 matches, Ponss has primarily played Jett, achieving a 50% winrate and 24% HS.';
  if (config.statsF === '3') return isEs ? 'Stats de Ponss (5 partidas): 50% WR | Agente: Jett | HS: 24%' : 'Ponss\'s Stats (5 matches): 50% WR | Agent: Jett | HS: 24%';
  return isEs ? 'Ponss tiene un winrate del 50% en sus últimas 5 partidas. Su agente más jugado es Jett (24% HS).' : 'Ponss has a 50% winrate in their last 5 matches. Most played agent is Jett (24% HS).';
};
