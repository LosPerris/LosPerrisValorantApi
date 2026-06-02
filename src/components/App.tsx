import { useState, useEffect } from 'react';
import { translateRank } from '../utils/helpers';

const translations: Record<string, Record<string, string>> = {
  es: {
    subtitle: "Rango, Historial y Comandos para Streamers",
    searchTitle: "Buscar Jugador",
    region: "Región",
    riotId: "Riot ID",
    playerPlaceholder: "Jugador",
    tag: "Tag",
    searchBtn: "BUSCAR ESTADÍSTICAS",
    loading: "CARGANDO...",
    errorNotFound: "Jugador no encontrado o ID/Tag inválidos.",
    lastMatch: "Última Partida",
    botConfig: "Configuración del Bot",
    rank: "RANGO",
    match: "PARTIDA",
    today: "HOY",
    stats: "STATS",
    platform: "Plataforma",
    formatRank: "Formato de Rango",
    formatRank1: "Básico (Solo Rango)",
    formatRank2: "Rango + Puntos",
    formatRank3: "Completo (Rango + Puntos + MMR)",
    formatMatch: "Formato de Partida",
    formatMatch1: "Mapa + Resultado",
    formatMatch2: "Mapa + Resultado + KDA",
    formatMatch3: "Mapa + Resultado + KDA + HS%",
    formatToday: "Formato de Hoy",
    formatToday1: "Básico (Ganadas/Perdidas)",
    formatToday2: "Medio (Partidas jugadas)",
    formatToday3: "Detallado (Incluye Winrate)",
    formatStats: "Formato de Stats",
    formatStats1: "Básico (Winrate + Agente + HS)",
    formatStats2: "Descriptivo",
    formatStats3: "Compacto",
    botCmds: "Comandos del Bot",
    example: "Ejemplo:",
    docsTitle: "Documentación de la API",
    docsDesc: "Hemos mejorado nuestra documentación. Ahora puedes ver y probar todos los endpoints de forma interactiva.",
    docsBtn: "VER DOCUMENTACIÓN COMPLETA",
    recent: "Búsquedas Recientes",
    footerBy: "Por",
    footerExt: "Extensión de",
    footerDisclaimer: "La API de Valorant de LosPerris no cuenta con el respaldo de Riot Games y no refleja sus opiniones."
  },
  en: {
    subtitle: "Rank, Match History and Streamer Commands",
    searchTitle: "Search Player",
    region: "Region",
    riotId: "Riot ID",
    playerPlaceholder: "Player",
    tag: "Tag",
    searchBtn: "SEARCH STATISTICS",
    loading: "LOADING...",
    errorNotFound: "Player not found or invalid ID/Tag.",
    lastMatch: "Last Match",
    botConfig: "Bot Configuration",
    rank: "RANK",
    match: "MATCH",
    today: "TODAY",
    stats: "STATS",
    platform: "Platform",
    formatRank: "Rank Format",
    formatRank1: "Basic (Rank Only)",
    formatRank2: "Rank + RR",
    formatRank3: "Full (Rank + RR + MMR)",
    formatMatch: "Match Format",
    formatMatch1: "Map + Result",
    formatMatch2: "Map + Result + KDA",
    formatMatch3: "Map + Result + KDA + HS%",
    formatToday: "Today Format",
    formatToday1: "Basic (Wins/Losses)",
    formatToday2: "Medium (Matches played)",
    formatToday3: "Detailed (Includes Winrate)",
    formatStats: "Stats Format",
    formatStats1: "Basic (Winrate + Agent + HS)",
    formatStats2: "Descriptive",
    formatStats3: "Compact",
    botCmds: "Bot Commands",
    example: "Example:",
    docsTitle: "API Documentation",
    docsDesc: "We have improved our documentation. You can now view and test all endpoints interactively.",
    docsBtn: "VIEW FULL DOCUMENTATION",
    recent: "Recent Searches",
    footerBy: "By",
    footerExt: "Extension of",
    footerDisclaimer: "The LosPerris Valorant API is not endorsed by Riot Games and does not reflect their views."
  }
};

interface RecentSearch {
  region: string;
  riotId: string;
  tag: string;
}

export default function App() {
  const [hasSearched, setHasSearched] = useState(false);
  const [configMode, setConfigMode] = useState('rank');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [playerData, setPlayerData] = useState<any>(null);
  
  const [region, setRegion] = useState('na');
  const [riotId, setRiotId] = useState('');
  const [tag, setTag] = useState('');

  const [platform, setPlatform] = useState('nightbot');
  const [lang, setLang] = useState('es');
  const [formatRank, setFormatRank] = useState('3');
  const [formatMatch, setFormatMatch] = useState('3');
  const [formatToday, setFormatToday] = useState('1');
  const [formatStats, setFormatStats] = useState('1');

  const [siteUrl, setSiteUrl] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try { setRecentSearches(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  const t = (key: string) => translations[lang][key] || key;

  const performSearch = async (searchRegion: string, searchRiotId: string, searchTag: string) => {
    if (!searchRiotId || !searchTag) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/valorant/summary/${searchRegion}/${encodeURIComponent(searchRiotId)}/${encodeURIComponent(searchTag)}`);
      const data = await res.json();
      
      if (!res.ok || data.status !== 200) {
        throw new Error(data.error || data.message || "Player not found");
      }
      
      setPlayerData(data.data);
      setHasSearched(true);

      const newSearch = { region: searchRegion, riotId: searchRiotId, tag: searchTag };
      setRecentSearches(prev => {
        const filtered = prev.filter(s => s.riotId.toLowerCase() !== searchRiotId.toLowerCase() || s.tag.toLowerCase() !== searchTag.toLowerCase());
        const updated = [newSearch, ...filtered].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      setError(err.message);
      setHasSearched(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await performSearch(region, riotId, tag);
  };

  const generateCommand = (endpoint: string, type: string) => {
    const url = `${siteUrl}/api/valorant/${endpoint}/${region}/${encodeURIComponent(riotId)}/${encodeURIComponent(tag)}?format=text&lang=${lang}&type=${type}`;
    if (platform === 'fossabot') return `$(customapi ${url})`;
    if (platform === 'streamlabs') return `{readapi.${url}}`;
    return `$(urlfetch ${url})`;
  };


  const getRankExample = () => {
    if (!playerData?.rank) return '';
    const translatedRank = translateRank(playerData.rank.current_tier_patched, lang);
    const rr = playerData.rank.ranking_in_tier;
    const elo = playerData.rank.elo;
    
    if (lang === 'es') {
        if (formatRank === '1') return `Actualmente estoy en ${translatedRank}`;
        if (formatRank === '2') return `Actualmente estoy en ${translatedRank} con ${rr} puntos`;
        return `Actualmente estoy en ${translatedRank} con ${rr} puntos, mi mmr es de ${elo}`;
    } else {
        if (formatRank === '1') return `Currently I am in ${translatedRank}`;
        if (formatRank === '2') return `Currently I am in ${translatedRank} with ${rr} RR`;
        return `Currently I am in ${translatedRank} with ${rr} RR, my mmr is ${elo}`;
    }
  };

  const getMatchExample = () => {
    if (!playerData?.match) return '';
    const map = playerData.match.metadata?.map;
    const isWin = playerData.match.derived?.is_win;
    const kda = playerData.match.derived?.kda;
    const hs = playerData.match.derived?.hs_percent;
    const agent = playerData.match.derived?.agent_name;
    const change = playerData.rank?.mmr_change_to_last_game || 0; 

    if (lang === 'es') {
        const verb = isWin ? 'gané' : 'perdí';
        if (formatMatch === '1') return `Mi última partida fue en ${map} con ${agent} ${verb} ${change} puntos`;
        if (formatMatch === '2') return `Mi última partida fue en ${map} con ${agent} ${verb} ${change} puntos mi kda fue de ${kda}`;
        return `Mi última partida fue en ${map} con ${agent} ${verb} ${change} puntos mi kda fue de ${kda}, mi porcentaje de HS fue de ${hs}% HS`;
    } else {
        const verb = isWin ? 'won' : 'lost';
        if (formatMatch === '1') return `My last match was on ${map} with ${agent} ${verb} ${change} RR`;
        if (formatMatch === '2') return `My last match was on ${map} with ${agent} ${verb} ${change} RR my kda was ${kda}`;
        return `My last match was on ${map} with ${agent} ${verb} ${change} RR my kda was ${kda}, my HS percentage was ${hs}%`;
    }
  };

  const getTodayExample = () => {
    if (lang === 'es') {
        if (formatToday === '1') return `Hoy PonssLoveless lleva 3 Victorias, 1 Derrotas (Total: +42 RR).`;
        if (formatToday === '2') return `Hoy PonssLoveless ha jugado 4 partidas: 3 Victorias, 1 Derrotas (Total: +42 RR).`;
        return `Hoy PonssLoveless ha jugado 4 partidas (75% Winrate): 3 Victorias, 1 Derrotas (Total: +42 RR).`;
    }
    if (formatToday === '1') return `Today PonssLoveless has 3 Wins, 1 Losses (Total: +42 RR).`;
    if (formatToday === '2') return `Today PonssLoveless has played 4 matches: 3 Wins, 1 Losses (Total: +42 RR).`;
    return `Today PonssLoveless has played 4 matches (75% Winrate): 3 Wins, 1 Losses (Total: +42 RR).`;
  };

  const getStatsExample = () => {
    if (lang === 'es') {
        if (formatStats === '1') return `PonssLoveless tiene un winrate del 58% en sus últimas 10 partidas. Su agente más jugado es Jett (25.5% HS).`;
        if (formatStats === '2') return `En sus últimas 10 partidas, PonssLoveless ha jugado principalmente con Jett, logrando un winrate del 58% y 25.5% de HS.`;
        return `Stats de PonssLoveless (10 partidas): 58% WR | Agente: Jett | HS: 25.5%`;
    }
    if (formatStats === '1') return `PonssLoveless has a 58% winrate in their last 10 matches. Most played agent is Jett (25.5% HS).`;
    if (formatStats === '2') return `In their last 10 matches, PonssLoveless has primarily played Jett, achieving a 58% winrate and 25.5% HS.`;
    return `PonssLoveless's Stats (10 matches): 58% WR | Agent: Jett | HS: 25.5%`;
  };

  return (
    <div className="flex flex-col items-center p-[20px] md:p-[40px] min-h-screen w-full">
      <div className="w-full max-w-[800px] flex flex-col gap-[20px] relative z-10">
      
      {/* Global Language Selector */}
      <div className="fixed top-[20px] right-[20px] md:right-[40px] flex bg-card-bg border border-card-border p-[4px] rounded-[8px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <button onClick={() => setLang('es')} className={`px-[12px] py-[6px] rounded-[6px] font-bold text-[0.8rem] transition-colors ${lang === 'es' ? 'bg-accent-color text-white' : 'text-text-muted hover:text-white'}`}>ES</button>
        <button onClick={() => setLang('en')} className={`px-[12px] py-[6px] rounded-[6px] font-bold text-[0.8rem] transition-colors ${lang === 'en' ? 'bg-accent-color text-white' : 'text-text-muted hover:text-white'}`}>EN</button>
      </div>

      <header className="text-center mb-[30px] flex flex-col items-center gap-[10px] mt-[20px]">
        <div className="flex items-center justify-center gap-[15px] mb-[5px]">
          <img 
            src="/api/valorant/imgs/LosPerris-minimal.svg" 
            alt="LosPerris Logo" 
            className="w-[75px] h-[75px] rounded-[60px] object-contain drop-shadow-[0_0_15px_rgba(255,70,85,0.4)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_15px_#ff4655] cursor-pointer" 
          />
          <h1 className="font-header text-[3rem] font-bold tracking-[-1px] bg-gradient-to-r from-white to-[#a1a1aa] bg-clip-text text-transparent mb-[0.5rem] drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] leading-none m-0 uppercase">
            LosPerris <span className="text-accent-color">Valorant API</span>
          </h1>
        </div>
        <p className="text-[1.2rem] text-text-muted font-main">{t('subtitle')}</p>
      </header>

      {/* Search Section */}
      <section className="bg-card-bg border border-card-border p-[30px] rounded-[12px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[2px] hover:border-accent-color hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05),0_0_20px_-5px_rgba(255,70,85,0.4)]">
        <h3 className="font-header font-semibold text-[1.25rem] mb-[20px] pb-[15px] border-b border-card-border text-text-color tracking-[-0.5px] flex items-center gap-[10px]">
          {t('searchTitle')}
        </h3>
        
        <form className="flex flex-col gap-[15px]" onSubmit={handleSearch}>
          <div className="flex gap-[15px]">
            <div className="flex flex-col gap-[5px] w-1/4">
              <label htmlFor="region" className="text-[0.8rem] font-bold text-text-muted uppercase">{t('region')}</label>
              <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className="border border-card-border bg-[rgba(24,24,27,0.8)] p-[12px_16px] text-text-color font-main text-[0.95rem] outline-none transition-all duration-200 rounded-[8px] w-full focus:border-accent-color focus:shadow-[0_0_0_2px_rgba(255,70,85,0.4)] focus:bg-[#18181b]">
                <option value="latam" className="bg-[#18181b] text-text-color">LATAM</option>
                <option value="na" className="bg-[#18181b] text-text-color">NA</option>
                <option value="eu" className="bg-[#18181b] text-text-color">EU</option>
                <option value="ap" className="bg-[#18181b] text-text-color">AP</option>
                <option value="kr" className="bg-[#18181b] text-text-color">KR</option>
                <option value="br" className="bg-[#18181b] text-text-color">BR</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-[5px] flex-1">
              <label htmlFor="riotId" className="text-[0.8rem] font-bold text-text-muted uppercase">{t('riotId')}</label>
              <input id="riotId" type="text" value={riotId} onChange={(e) => setRiotId(e.target.value)} required placeholder={t('playerPlaceholder')} className="border border-card-border bg-[rgba(24,24,27,0.8)] p-[12px_16px] text-text-color font-main text-[0.95rem] outline-none transition-all duration-200 rounded-[8px] w-full focus:border-accent-color focus:shadow-[0_0_0_2px_rgba(255,70,85,0.4)] focus:bg-[#18181b]" />
            </div>
            
            <div className="flex flex-col gap-[5px] w-1/4">
              <label htmlFor="tag" className="text-[0.8rem] font-bold text-text-muted uppercase">{t('tag')}</label>
              <input id="tag" type="text" value={tag} onChange={(e) => setTag(e.target.value)} required placeholder="LAN" className="border border-card-border bg-[rgba(24,24,27,0.8)] p-[12px_16px] text-text-color font-main text-[0.95rem] outline-none transition-all duration-200 rounded-[8px] w-full focus:border-accent-color focus:shadow-[0_0_0_2px_rgba(255,70,85,0.4)] focus:bg-[#18181b]" />
            </div>
          </div>
          
          <button disabled={isLoading} type="submit" className={`w-full bg-accent-color text-white border-none font-main text-[1rem] cursor-pointer transition-all duration-200 mt-[10px] rounded-[8px] font-semibold shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] flex items-center justify-center hover:bg-[#e03e4b] hover:-translate-y-[1px] hover:shadow-[0_10px_15px_-3px_rgba(255,70,85,0.2),0_4px_6px_-2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed ${isLoading ? 'p-[9px] opacity-90' : 'p-[14px]'}`}>
            {isLoading ? (
              <img src="/api/valorant/imgs/buscando_jugador.svg" alt="Buscando..." className="h-[30px] w-auto brightness-0 invert" />
            ) : (
              t('searchBtn')
            )}
          </button>

          {recentSearches.length > 0 && (
            <div className="mt-[10px] flex flex-wrap gap-[8px] items-center">
              <span className="text-[0.75rem] text-text-muted font-bold uppercase mr-[4px]">{t('recent')}:</span>
              {recentSearches.map((search, idx) => (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRegion(search.region);
                    setRiotId(search.riotId);
                    setTag(search.tag);
                    performSearch(search.region, search.riotId, search.tag);
                  }}
                  className="text-[0.8rem] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-text-color px-[12px] py-[4px] rounded-[15px] hover:bg-accent-color hover:border-accent-color hover:text-white transition-all duration-200 flex items-center gap-[5px] cursor-pointer"
                >
                  {search.riotId}<span className="opacity-50">#{search.tag}</span>
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="text-danger text-sm mt-2 text-center p-2 bg-danger/10 border border-danger/30 rounded-lg">
                {error === 'Player not found' ? t('errorNotFound') : error}
            </div>
          )}
        </form>
      </section>

      {/* Results Section */}
      {hasSearched && playerData && (
        <div className="flex flex-col gap-5 animate-[fadeIn_0.5s_ease-out]">
          {/* Rank Card */}
          {playerData.rank && (
          <section 
            className="bg-card-bg border border-card-border p-0 min-h-[200px] rounded-[12px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all duration-300 relative overflow-hidden group hover:-translate-y-[2px] hover:border-accent-color hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_20px_-5px_rgba(255,70,85,0.4)]"
            style={{ backgroundImage: playerData.account?.card?.wide ? `url('${playerData.account.card.wide}')` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[rgba(19,19,22,0.6)] to-[rgba(19,19,22,0.95)] z-[1]"></div>
            <div className="relative z-[2] p-[25px] flex flex-col gap-[20px]">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[15px]">
                  <img src={playerData.rank.rank_image} alt="Rank" className="w-[60px] h-[60px] object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                  <div>
                    <h2 className="font-header text-[2rem] font-bold mb-[5px] drop-shadow-md">{playerData.rank.name}#{playerData.rank.tag}</h2>
                    <div className="bg-accent-color text-white px-[8px] py-[2px] text-[0.9rem] font-bold uppercase inline-block">{translateRank(playerData.rank.current_tier_patched, lang)}</div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-center gap-[15px] text-[1.1rem] mb-[10px]">
                  <span><i className="inline-block w-[10px] h-[10px] bg-success rounded-full mr-2"></i> {playerData.rank.elo} ELO</span>
                  <span className={`font-bold ${playerData.rank.mmr_change_to_last_game >= 0 ? 'text-success' : 'text-danger'}`}>
                      {playerData.rank.mmr_change_to_last_game > 0 ? '+' : ''}{playerData.rank.mmr_change_to_last_game}
                  </span>
                </div>
                <div className="w-full h-[6px] bg-[rgba(255,255,255,0.1)] rounded-[3px] overflow-hidden">
                  <div className="h-full bg-accent-color transition-all duration-1000 ease-out" style={{ width: `${playerData.rank.ranking_in_tier || 0}%` }}></div>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* Match Card */}
          {playerData.match && (
            <section 
                className="bg-card-bg border border-card-border p-0 min-h-[120px] rounded-[12px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all duration-300 relative overflow-hidden group hover:-translate-y-[2px] hover:border-accent-color hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_20px_-5px_rgba(255,70,85,0.4)]"
                style={{ backgroundImage: playerData.match.derived?.map_image ? `url('${playerData.match.derived.map_image}')` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[rgba(19,19,22,0.95)] via-[rgba(19,19,22,0.85)] to-[rgba(19,19,22,0.4)] z-[1]"></div>
                <div className="relative z-[2] p-[25px]">
                    <h3 className="font-header font-semibold text-[1.1rem] mb-[15px] pb-[10px] border-b border-[rgba(255,255,255,0.1)] text-text-color tracking-[-0.5px] drop-shadow-md">{t('lastMatch')}</h3>
                    <div className="flex items-center gap-[20px]">
                        <img src={playerData.match.derived?.agent_icon} alt="Agent Icon" className="w-[60px] h-[60px] object-cover rounded-full border-2 border-accent-color drop-shadow-[0_0_10px_rgba(255,70,85,0.4)]" />
                        <div className="flex flex-col gap-1 drop-shadow-md">
                            <div className="text-[1.2rem] font-bold text-white leading-none">{playerData.match.metadata?.map}</div>
                            <div className={`text-[0.9rem] font-bold uppercase tracking-wide ${playerData.match.derived?.is_win ? 'text-success' : 'text-danger'}`}>
                                {playerData.match.derived?.is_win ? (lang === 'en' ? 'VICTORY' : 'VICTORIA') : (lang === 'en' ? 'DEFEAT' : 'DERROTA')}
                            </div>
                            <div className="text-[rgba(255,255,255,0.7)] font-mono text-[0.95rem]">{playerData.match.derived?.kda}</div>
                        </div>
                    </div>
                </div>
            </section>
          )}

          {/* Bot Config */}
          <section className="bg-card-bg border border-card-border p-[30px] rounded-[12px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[2px] hover:border-accent-color hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_20px_-5px_rgba(255,70,85,0.4)]">
            <h3 className="font-header font-semibold text-[1.25rem] mb-[20px] pb-[15px] border-b border-card-border text-text-color tracking-[-0.5px]">{t('botConfig')}</h3>
            <div className="flex gap-[10px] mb-[20px]">
              <button 
                className={`flex-1 p-[10px] font-bold border transition-all duration-300 ${configMode === 'rank' ? 'bg-accent-color text-white border-accent-color' : 'bg-[rgba(255,255,255,0.05)] text-text-muted border-card-border hover:bg-[rgba(255,255,255,0.1)]'}`}
                onClick={() => setConfigMode('rank')}
              >
                {t('rank')}
              </button>
              <button 
                className={`flex-1 p-[10px] font-bold border transition-all duration-300 ${configMode === 'match' ? 'bg-accent-color text-white border-accent-color' : 'bg-[rgba(255,255,255,0.05)] text-text-muted border-card-border hover:bg-[rgba(255,255,255,0.1)]'}`}
                onClick={() => setConfigMode('match')}
              >
                {t('match')}
              </button>
              <button 
                className={`flex-1 p-[10px] font-bold border transition-all duration-300 ${configMode === 'today' ? 'bg-accent-color text-white border-accent-color' : 'bg-[rgba(255,255,255,0.05)] text-text-muted border-card-border hover:bg-[rgba(255,255,255,0.1)]'}`}
                onClick={() => setConfigMode('today')}
              >
                {t('today')}
              </button>
              <button 
                className={`flex-1 p-[10px] font-bold border transition-all duration-300 ${configMode === 'stats' ? 'bg-accent-color text-white border-accent-color' : 'bg-[rgba(255,255,255,0.05)] text-text-muted border-card-border hover:bg-[rgba(255,255,255,0.1)]'}`}
                onClick={() => setConfigMode('stats')}
              >
                {t('stats')}
              </button>
            </div>
            
            <div className="flex flex-col gap-[15px]">
              <div className="flex gap-[15px]">
                <div className="flex flex-col gap-[5px] flex-1">
                  <label htmlFor="platform" className="text-[0.8rem] font-bold text-text-muted uppercase">{t('platform')}</label>
                  <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className="border border-card-border bg-[rgba(24,24,27,0.8)] p-[12px_16px] text-text-color font-main text-[0.95rem] outline-none rounded-[8px] w-full focus:border-accent-color focus:shadow-[0_0_0_2px_rgba(255,70,85,0.4)] focus:bg-[#18181b]">
                    <option value="nightbot" className="bg-[#18181b] text-text-color">Nightbot / StreamElements</option>
                    <option value="fossabot" className="bg-[#18181b] text-text-color">Fossabot</option>
                    <option value="streamlabs" className="bg-[#18181b] text-text-color">Streamlabs Cloudbot</option>
                  </select>
                </div>
                {configMode === 'rank' && (
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label htmlFor="formatRank" className="text-[0.8rem] font-bold text-text-muted uppercase">{t('formatRank')}</label>
                    <select id="formatRank" value={formatRank} onChange={(e) => setFormatRank(e.target.value)} className="border border-card-border bg-[rgba(24,24,27,0.8)] p-[12px_16px] text-text-color font-main text-[0.95rem] outline-none rounded-[8px] w-full focus:border-accent-color focus:shadow-[0_0_0_2px_rgba(255,70,85,0.4)] focus:bg-[#18181b]">
                      <option value="1" className="bg-[#18181b] text-text-color">{t('formatRank1')}</option>
                      <option value="2" className="bg-[#18181b] text-text-color">{t('formatRank2')}</option>
                      <option value="3" className="bg-[#18181b] text-text-color">{t('formatRank3')}</option>
                    </select>
                  </div>
                )}
                {configMode === 'match' && (
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label htmlFor="formatMatch" className="text-[0.8rem] font-bold text-text-muted uppercase">{t('formatMatch')}</label>
                    <select id="formatMatch" value={formatMatch} onChange={(e) => setFormatMatch(e.target.value)} className="border border-card-border bg-[rgba(24,24,27,0.8)] p-[12px_16px] text-text-color font-main text-[0.95rem] outline-none rounded-[8px] w-full focus:border-accent-color focus:shadow-[0_0_0_2px_rgba(255,70,85,0.4)] focus:bg-[#18181b]">
                      <option value="1" className="bg-[#18181b] text-text-color">{t('formatMatch1')}</option>
                      <option value="2" className="bg-[#18181b] text-text-color">{t('formatMatch2')}</option>
                      <option value="3" className="bg-[#18181b] text-text-color">{t('formatMatch3')}</option>
                    </select>
                  </div>
                )}
                {configMode === 'today' && (
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label htmlFor="formatToday" className="text-[0.8rem] font-bold text-text-muted uppercase">{t('formatToday')}</label>
                    <select id="formatToday" value={formatToday} onChange={(e) => setFormatToday(e.target.value)} className="border border-card-border bg-[rgba(24,24,27,0.8)] p-[12px_16px] text-text-color font-main text-[0.95rem] outline-none rounded-[8px] w-full focus:border-accent-color focus:shadow-[0_0_0_2px_rgba(255,70,85,0.4)] focus:bg-[#18181b]">
                      <option value="1" className="bg-[#18181b] text-text-color">{t('formatToday1')}</option>
                      <option value="2" className="bg-[#18181b] text-text-color">{t('formatToday2')}</option>
                      <option value="3" className="bg-[#18181b] text-text-color">{t('formatToday3')}</option>
                    </select>
                  </div>
                )}
                {configMode === 'stats' && (
                  <div className="flex flex-col gap-[5px] flex-1">
                    <label htmlFor="formatStats" className="text-[0.8rem] font-bold text-text-muted uppercase">{t('formatStats')}</label>
                    <select id="formatStats" value={formatStats} onChange={(e) => setFormatStats(e.target.value)} className="border border-card-border bg-[rgba(24,24,27,0.8)] p-[12px_16px] text-text-color font-main text-[0.95rem] outline-none rounded-[8px] w-full focus:border-accent-color focus:shadow-[0_0_0_2px_rgba(255,70,85,0.4)] focus:bg-[#18181b]">
                      <option value="1" className="bg-[#18181b] text-text-color">{t('formatStats1')}</option>
                      <option value="2" className="bg-[#18181b] text-text-color">{t('formatStats2')}</option>
                      <option value="3" className="bg-[#18181b] text-text-color">{t('formatStats3')}</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </section>
          
          {/* Bot Commands */}
          <section className="bg-card-bg border border-card-border p-[30px] rounded-[12px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[2px] hover:border-accent-color hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_20px_-5px_rgba(255,70,85,0.4)]">
            <h3 className="font-header font-semibold text-[1.25rem] mb-[20px] pb-[15px] border-b border-card-border text-text-color tracking-[-0.5px]">{t('botCmds')}</h3>
            
            {configMode === 'rank' && (
            <div className="mb-[20px] animate-[fadeIn_0.3s_ease]">
                <label htmlFor="cmdRank" className="block mb-[8px] text-accent-color font-bold text-[0.85rem] uppercase">!rango</label>
                <div className="flex bg-[rgba(0,0,0,0.3)] border border-card-border rounded overflow-hidden">
                    <input id="cmdRank" type="text" readOnly className="flex-1 bg-transparent border-none font-mono text-text-muted p-[10px] outline-none w-full" value={`!addcom !rango ${generateCommand('rank', formatRank)}`} />
                    <button className="bg-[rgba(255,255,255,0.1)] text-white border-none px-[20px] cursor-pointer font-bold text-[0.8rem] transition-colors hover:bg-accent-color" onClick={(e) => {
                        navigator.clipboard.writeText(`!addcom !rango ${generateCommand('rank', formatRank)}`);
                        (e.target as HTMLButtonElement).innerText = 'COPIED!';
                        setTimeout(() => (e.target as HTMLButtonElement).innerText = 'COPY', 2000);
                    }}>COPY</button>
                </div>
                <div className="mt-[10px] p-[10px] bg-[rgba(255,255,255,0.05)] border-l-[3px] border-success text-[0.9rem] text-text-muted flex gap-[10px] items-center">
                    <span className="font-bold text-success uppercase text-[0.8rem] whitespace-nowrap">{t('example')}</span>
                    <span className="font-mono text-white break-words">{getRankExample()}</span>
                </div>
            </div>
            )}

            {configMode === 'match' && (
            <div className="animate-[fadeIn_0.3s_ease]">
                <label htmlFor="cmdMatch" className="block mb-[8px] text-accent-color font-bold text-[0.85rem] uppercase">!partida</label>
                <div className="flex bg-[rgba(0,0,0,0.3)] border border-card-border rounded overflow-hidden">
                    <input id="cmdMatch" type="text" readOnly className="flex-1 bg-transparent border-none font-mono text-text-muted p-[10px] outline-none w-full" value={`!addcom !partida ${generateCommand('match/last', formatMatch)}`} />
                    <button className="bg-[rgba(255,255,255,0.1)] text-white border-none px-[20px] cursor-pointer font-bold text-[0.8rem] transition-colors hover:bg-accent-color" onClick={(e) => {
                        navigator.clipboard.writeText(`!addcom !partida ${generateCommand('match/last', formatMatch)}`);
                        (e.target as HTMLButtonElement).innerText = 'COPIED!';
                        setTimeout(() => (e.target as HTMLButtonElement).innerText = 'COPY', 2000);
                    }}>COPY</button>
                </div>
                <div className="mt-[10px] p-[10px] bg-[rgba(255,255,255,0.05)] border-l-[3px] border-success text-[0.9rem] text-text-muted flex gap-[10px] items-center">
                    <span className="font-bold text-success uppercase text-[0.8rem] whitespace-nowrap">{t('example')}</span>
                    <span className="font-mono text-white break-words">{getMatchExample()}</span>
                </div>
            </div>
            )}

            {configMode === 'today' && (
            <div className="animate-[fadeIn_0.3s_ease]">
                <label htmlFor="cmdToday" className="block mb-[8px] text-accent-color font-bold text-[0.85rem] uppercase">!hoy</label>
                <div className="flex bg-[rgba(0,0,0,0.3)] border border-card-border rounded overflow-hidden">
                    <input id="cmdToday" type="text" readOnly className="flex-1 bg-transparent border-none font-mono text-text-muted p-[10px] outline-none w-full" value={`!addcom !hoy ${generateCommand('today', formatToday)}`} />
                    <button className="bg-[rgba(255,255,255,0.1)] text-white border-none px-[20px] cursor-pointer font-bold text-[0.8rem] transition-colors hover:bg-accent-color" onClick={(e) => {
                        navigator.clipboard.writeText(`!addcom !hoy ${generateCommand('today', formatToday)}`);
                        (e.target as HTMLButtonElement).innerText = 'COPIED!';
                        setTimeout(() => (e.target as HTMLButtonElement).innerText = 'COPY', 2000);
                    }}>COPY</button>
                </div>
                <div className="mt-[10px] p-[10px] bg-[rgba(255,255,255,0.05)] border-l-[3px] border-success text-[0.9rem] text-text-muted flex gap-[10px] items-center">
                    <span className="font-bold text-success uppercase text-[0.8rem] whitespace-nowrap">{t('example')}</span>
                    <span className="font-mono text-white break-words">{getTodayExample()}</span>
                </div>
            </div>
            )}

            {configMode === 'stats' && (
            <div className="animate-[fadeIn_0.3s_ease]">
                <label htmlFor="cmdStats" className="block mb-[8px] text-accent-color font-bold text-[0.85rem] uppercase">!stats</label>
                <div className="flex bg-[rgba(0,0,0,0.3)] border border-card-border rounded overflow-hidden">
                    <input id="cmdStats" type="text" readOnly className="flex-1 bg-transparent border-none font-mono text-text-muted p-[10px] outline-none w-full" value={`!addcom !stats ${generateCommand('stats', formatStats)}`} />
                    <button className="bg-[rgba(255,255,255,0.1)] text-white border-none px-[20px] cursor-pointer font-bold text-[0.8rem] transition-colors hover:bg-accent-color" onClick={(e) => {
                        navigator.clipboard.writeText(`!addcom !stats ${generateCommand('stats', formatStats)}`);
                        (e.target as HTMLButtonElement).innerText = 'COPIED!';
                        setTimeout(() => (e.target as HTMLButtonElement).innerText = 'COPY', 2000);
                    }}>COPY</button>
                </div>
                <div className="mt-[10px] p-[10px] bg-[rgba(255,255,255,0.05)] border-l-[3px] border-success text-[0.9rem] text-text-muted flex gap-[10px] items-center">
                    <span className="font-bold text-success uppercase text-[0.8rem] whitespace-nowrap">{t('example')}</span>
                    <span className="font-mono text-white break-words">{getStatsExample()}</span>
                </div>
            </div>
            )}
          </section>
        </div>
      )}

      {/* Docs Section */}
      <section className="bg-card-bg border border-card-border p-[30px] rounded-[12px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[2px] hover:border-accent-color animate-[fadeIn_0.5s_ease-out] mt-[10px]">
          <h3 className="font-header font-semibold text-[1.25rem] mb-[20px] pb-[15px] border-b border-card-border text-text-color tracking-[-0.5px]">{t('docsTitle')}</h3>
          <div className="bg-[rgba(0,0,0,0.3)] p-[20px] mb-[15px] border-l-[3px] border-accent-color flex flex-col gap-[8px]">
              <p className="text-text-muted text-[0.9rem]">{t('docsDesc')}</p>
          </div>
          <div className="text-center text-text-muted italic mt-[20px]">
              <a href="/docs" className="bg-accent-color text-white no-underline py-[10px] px-[20px] inline-block rounded-[8px] font-semibold transition-all hover:bg-[#e03e4b] hover:-translate-y-[1px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] not-italic">
                  {t('docsBtn')}
              </a>
          </div>
      </section>

      {/* Footer */}
      <footer className="text-center mt-auto pt-[30px] w-full flex flex-col items-center gap-[15px] pb-[20px]">
        <div className="text-text-muted text-[0.9rem]">
          &copy; {new Date().getFullYear()} LosPerris • {t('footerBy')} <a href="https://github.com/Ponss17" target="_blank" className="text-accent-color no-underline font-semibold hover:text-white transition-colors">Ponss17</a> • {t('footerExt')} <a href="https://docs.henrikdev.xyz/" target="_blank" className="text-accent-color no-underline font-semibold hover:text-white transition-colors">HenrikDev API</a>
        </div>
        <p className="text-[#a1a1aa] text-[0.7rem] max-w-[600px] leading-relaxed mx-auto italic opacity-70">
          {t('footerDisclaimer')}
        </p>
      </footer>
      </div>
    </div>
  );
}
