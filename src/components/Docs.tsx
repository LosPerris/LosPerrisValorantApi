import { useState, useEffect } from 'react';

export default function Docs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRankTab, setActiveRankTab] = useState('curl');
  const [activeMatchTab, setActiveMatchTab] = useState('curl');
  const [activeTodayTab, setActiveTodayTab] = useState('curl');
  const [activeStatsTab, setActiveStatsTab] = useState('curl');
  const [siteUrl, setSiteUrl] = useState('https://valorant-api.losperris.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-bg-color text-text-color font-main bg-[radial-gradient(circle_at_50%_0%,rgba(255,70,85,0.05)_0%,transparent_50%)] bg-fixed">
      <button 
        className="lg:hidden fixed top-5 right-5 z-[1000] bg-accent-color text-white border-none w-[45px] h-[45px] rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,70,85,0.4)] flex items-center justify-center text-[1.2rem]"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <aside className={`fixed top-0 left-0 h-screen w-[280px] bg-[#0e0e11]/80 backdrop-blur-[12px] border-r border-card-border p-[30px_20px] flex flex-col z-[100] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSidebarOpen ? 'translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-[12px] mb-[40px]">
          <img src="/api/valorant/imgs/LosPerris-minimal.svg" alt="Logo" className="w-[32px] h-[32px]" />
          <h2 className="text-[1.2rem] font-[800] tracking-[1px] m-0">Docs API</h2>
        </div>
        <nav className="flex flex-col gap-[5px] flex-1 overflow-y-auto">
          <a href="#intro" className="flex items-center gap-[12px] p-[10px_15px] no-underline text-text-muted rounded-[8px] text-[0.95rem] font-medium transition-all hover:bg-white/5 hover:text-text-color group active:bg-accent-color/10 active:text-accent-color">
            <i className="fa-solid fa-house text-[1.1rem] w-[20px] text-center opacity-70 group-hover:opacity-100 group-hover:text-accent-color transition-opacity"></i> Introducción
          </a>

          <div className="mt-[25px] flex flex-col gap-[5px]">
            <span className="text-[0.75rem] uppercase text-text-muted tracking-[1.5px] ml-[15px] mb-[10px] font-bold opacity-50">Endpoints</span>
            <a href="#rank" className="flex items-center gap-[12px] p-[10px_15px] no-underline text-text-muted rounded-[8px] text-[0.95rem] font-medium transition-all hover:bg-white/5 hover:text-text-color group">
              <i className="fa-solid fa-medal text-[1.1rem] w-[20px] text-center opacity-70 group-hover:opacity-100 group-hover:text-accent-color transition-opacity"></i> Rank
            </a>
            <a href="#match" className="flex items-center gap-[12px] p-[10px_15px] no-underline text-text-muted rounded-[8px] text-[0.95rem] font-medium transition-all hover:bg-white/5 hover:text-text-color group">
              <i className="fa-solid fa-gamepad text-[1.1rem] w-[20px] text-center opacity-70 group-hover:opacity-100 group-hover:text-accent-color transition-opacity"></i> Última Partida
            </a>
            <a href="#today" className="flex items-center gap-[12px] p-[10px_15px] no-underline text-text-muted rounded-[8px] text-[0.95rem] font-medium transition-all hover:bg-white/5 hover:text-text-color group">
              <i className="fa-solid fa-calendar-day text-[1.1rem] w-[20px] text-center opacity-70 group-hover:opacity-100 group-hover:text-accent-color transition-opacity"></i> Sesión de Hoy
            </a>
            <a href="#stats" className="flex items-center gap-[12px] p-[10px_15px] no-underline text-text-muted rounded-[8px] text-[0.95rem] font-medium transition-all hover:bg-white/5 hover:text-text-color group">
              <i className="fa-solid fa-chart-pie text-[1.1rem] w-[20px] text-center opacity-70 group-hover:opacity-100 group-hover:text-accent-color transition-opacity"></i> Estadísticas
            </a>
          </div>

          <div className="mt-[25px] flex flex-col gap-[5px]">
            <span className="text-[0.75rem] uppercase text-text-muted tracking-[1.5px] ml-[15px] mb-[10px] font-bold opacity-50">Soporte</span>
            <a href="#errors" className="flex items-center gap-[12px] p-[10px_15px] no-underline text-text-muted rounded-[8px] text-[0.95rem] font-medium transition-all hover:bg-white/5 hover:text-text-color group">
              <i className="fa-solid fa-triangle-exclamation text-[1.1rem] w-[20px] text-center opacity-70 group-hover:opacity-100 group-hover:text-accent-color transition-opacity"></i> Errores
            </a>
          </div>

          <a href="./" className="mt-auto border border-card-border bg-card-bg justify-center flex items-center gap-[12px] p-[10px_15px] no-underline text-text-muted rounded-[8px] text-[0.95rem] font-medium transition-all hover:bg-white/5 hover:text-text-color group">
            <i className="fa-solid fa-arrow-left text-[1.1rem] w-[20px] text-center opacity-70 group-hover:opacity-100 group-hover:text-accent-color transition-opacity"></i> Volver al Panel
          </a>
        </nav>
      </aside>

      <div className="lg:ml-[280px] w-full lg:w-[calc(100%-280px)] flex justify-center relative">
        <main className="w-full max-w-[1100px] p-[60px_20px] lg:p-[60px_40px] flex flex-col gap-[40px]">
          
          <section id="intro" className="bg-gradient-to-b from-[#131316]/80 to-[#0e0e11]/90 border border-card-border rounded-[16px] p-[30px] lg:p-[50px] scroll-mt-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-[10px] animate-[fadeInUp_0.6s_ease-out_forwards] border-t-2 border-t-accent-color">
            <h1 className="text-[2.5rem] lg:text-[3.5rem] font-[800] mb-[20px] tracking-[-1.5px] leading-[1.1]">Documentación <span className="bg-gradient-to-br from-accent-color to-[#ff8f99] bg-clip-text text-transparent">Valorant API</span></h1>
            <p className="text-[1.1rem] lg:text-[1.25rem] text-text-muted mb-[20px] leading-[1.8]">
              Bienvenido a la documentación oficial de <strong className="text-white">LosPerris Valorant API</strong>.
              Integra datos de rangos, historial de partidas y estadísticas detalladas en tus aplicaciones o bots
              de chat (Nightbot, StreamElements).
            </p>
          </section>

          <section id="rank" className="bg-gradient-to-b from-[#131316]/80 to-[#0e0e11]/90 border border-card-border rounded-[16px] p-[30px] lg:p-[50px] scroll-mt-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-[10px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-100 opacity-0 fill-mode-forwards">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <i className="fa-solid fa-medal text-accent-color text-[1.5rem] bg-accent-color/10 p-[10px] rounded-[8px] shadow-[inset_0_0_10px_rgba(255,70,85,0.05)]"></i> Obtener Rango (MMR)
            </h2>
            <p className="mb-[20px] text-text-muted text-[1.05rem]">Devuelve el rango actual, ELO y puntuación de un jugador. Ideal para comandos <code className="bg-white/10 px-[8px] py-[3px] rounded-[6px] text-[#ff8f99] font-mono text-[0.9em]">!rank</code>.</p>

            <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-[35px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
              <span className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px] bg-blue-500/15 text-blue-400 border border-blue-500/30">GET</span>
              <span className="text-text-color">/api/valorant/rank/:region/:name/:tag</span>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Parámetros</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse m-[25px_0] bg-[#09090b]/60 rounded-[12px] border border-card-border overflow-hidden">
                <thead className="bg-white/5 text-text-color font-[600] uppercase text-[0.8rem] tracking-[1px] text-left">
                    <tr>
                    <th className="p-[18px_24px] border-b border-card-border">Parámetro</th>
                    <th className="p-[18px_24px] border-b border-card-border">Tipo</th>
                    <th className="p-[18px_24px] border-b border-card-border">Descripción</th>
                    </tr>
                </thead>
                <tbody className="text-text-muted text-[1.05rem]">
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px] border-b border-card-border"><code className="bg-white/10 px-[8px] py-[3px] rounded-[6px] text-[#ff8f99] font-mono text-[0.9em]">region</code></td>
                    <td className="p-[18px_24px] border-b border-card-border">String</td>
                    <td className="p-[18px_24px] border-b border-card-border">na, eu, ap, kr, latam, br</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px] border-b border-card-border"><code className="bg-white/10 px-[8px] py-[3px] rounded-[6px] text-[#ff8f99] font-mono text-[0.9em]">name</code></td>
                    <td className="p-[18px_24px] border-b border-card-border">String</td>
                    <td className="p-[18px_24px] border-b border-card-border">Riot ID del jugador</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px] border-b border-card-border"><code className="bg-white/10 px-[8px] py-[3px] rounded-[6px] text-[#ff8f99] font-mono text-[0.9em]">tag</code></td>
                    <td className="p-[18px_24px] border-b border-card-border">String</td>
                    <td className="p-[18px_24px] border-b border-card-border">Tagline del jugador</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px]"> <code className="bg-white/10 px-[8px] py-[3px] rounded-[6px] text-[#ff8f99] font-mono text-[0.9em]">type</code></td>
                    <td className="p-[18px_24px]">Number</td>
                    <td className="p-[18px_24px]">(Opcional) 1: Solo Rango, 2: +Puntos, 3: +ELO</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Ejemplos de Uso</h3>
            <div className="flex gap-[8px] mb-0 overflow-x-auto pb-1">
              {['curl', 'js', 'py', 'bots'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveRankTab(tab)}
                  className={`p-[10px_20px] font-[500] text-[0.9rem] rounded-t-[8px] transition-all cursor-pointer whitespace-nowrap relative top-[1px] ${activeRankTab === tab ? 'bg-[#111113] text-white border-card-border border border-b-transparent after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-color after:rounded-t-[8px]' : 'bg-[#0e0e11]/80 text-text-muted border border-card-border border-b-transparent hover:text-white hover:bg-[#111113]'}`}
                >
                  {tab === 'curl' && 'cURL'}
                  {tab === 'js' && 'JavaScript'}
                  {tab === 'py' && 'Python'}
                  {tab === 'bots' && 'Comandos Bots'}
                </button>
              ))}
            </div>

            <div className="bg-[#111113] border border-card-border rounded-tr-[8px] rounded-b-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
                <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
                </div>
                <div className="p-[25px] font-mono text-[0.9rem] text-[#e2e8f0] leading-[1.6] overflow-x-auto whitespace-pre-wrap break-all">
                    {activeRankTab === 'curl' && `curl -X GET "${siteUrl}/api/valorant/rank/na/PonssLoveless/8882"`}
                    {activeRankTab === 'js' && `fetch("${siteUrl}/api/valorant/rank/na/PonssLoveless/8882")\n  .then(res => res.json())\n  .then(data => console.log(data));`}
                    {activeRankTab === 'py' && `import requests\nres = requests.get("${siteUrl}/api/valorant/rank/na/PonssLoveless/8882")\nprint(res.json())`}
                    {activeRankTab === 'bots' && (
                        <>
                            <p className="text-[#888] mb-[10px] font-main text-[0.9rem]">Copia esto en tu Nightbot o StreamElements:</p>
                            {`$(urlfetch ${siteUrl}/api/valorant/rank/na/PonssLoveless/8882?format=text)`}
                        </>
                    )}
                </div>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Respuesta</h3>
            <div className="bg-[#111113] border border-card-border rounded-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
                <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
                </div>
                <div className="p-[25px] font-mono text-[0.9rem] text-[#a5b3ce] leading-[1.6] overflow-x-auto whitespace-pre-wrap">
{`{
  "status": 200,
  "data": {
    "puuid": "a1b2c3d4-...",
    "region": "na",
    "account_level": 250,
    "name": "PonssLoveless",
    "tag": "8882",
    "card": {
      "small": "https://media.valorant-api.com/playercards/.../smallart.png",
      "large": "https://media.valorant-api.com/playercards/.../largeart.png",
      "wide": "https://media.valorant-api.com/playercards/.../wideart.png"
    },
    "last_update": "Less than a minute ago",
    "current_tier_patched": "Ascendant 2",
    "ranking_in_tier": 50,
    "mmr_change_to_last_game": 18,
    "elo": 1650,
    "rank_image": "https://media.valorant-api.com/competitivetiers/.../largeicon.png"
  }
}`}
                </div>
            </div>
          </section>


          <section id="match" className="bg-gradient-to-b from-[#131316]/80 to-[#0e0e11]/90 border border-card-border rounded-[16px] p-[30px] lg:p-[50px] scroll-mt-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-[10px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-200 opacity-0 fill-mode-forwards">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <i className="fa-solid fa-gamepad text-accent-color text-[1.5rem] bg-accent-color/10 p-[10px] rounded-[8px] shadow-[inset_0_0_10px_rgba(255,70,85,0.05)]"></i> Última Partida
            </h2>
            <p className="mb-[20px] text-text-muted text-[1.05rem]">Obtiene estadísticas detalladas de la última partida competitiva jugada.</p>

            <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-[35px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
              <span className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px] bg-blue-500/15 text-blue-400 border border-blue-500/30">GET</span>
              <span className="text-text-color">/api/valorant/match/last/:region/:name/:tag</span>
            </div>

            <div className="flex gap-[8px] mb-0 overflow-x-auto pb-1">
              {['curl', 'bots'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveMatchTab(tab)}
                  className={`p-[10px_20px] font-[500] text-[0.9rem] rounded-t-[8px] transition-all cursor-pointer whitespace-nowrap relative top-[1px] ${activeMatchTab === tab ? 'bg-[#111113] text-white border-card-border border border-b-transparent after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-color after:rounded-t-[8px]' : 'bg-[#0e0e11]/80 text-text-muted border border-card-border border-b-transparent hover:text-white hover:bg-[#111113]'}`}
                >
                  {tab === 'curl' && 'cURL'}
                  {tab === 'bots' && 'Bots'}
                </button>
              ))}
            </div>

            <div className="bg-[#111113] border border-card-border rounded-tr-[8px] rounded-b-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
                <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
                </div>
                <div className="p-[25px] font-mono text-[0.9rem] text-[#e2e8f0] leading-[1.6] overflow-x-auto whitespace-pre-wrap break-all">
                    {activeMatchTab === 'curl' && `curl -X GET "${siteUrl}/api/valorant/match/last/na/PonssLoveless/8882"`}
                    {activeMatchTab === 'bots' && `$(urlfetch ${siteUrl}/api/valorant/match/last/na/PonssLoveless/8882?format=text)`}
                </div>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Respuesta</h3>
            <div className="bg-[#111113] border border-card-border rounded-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
                <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
                </div>
                <div className="p-[25px] font-mono text-[0.9rem] text-[#a5b3ce] leading-[1.6] overflow-x-auto whitespace-pre-wrap">
{`{
  "status": 200,
  "data": {
    "metadata": {
      "map": "Ascent",
      "mode": "Competitive",
      "matchid": "a1b2-...",
      "region": "na"
    },
    "players": {
      "all_players": [
        {
          "name": "PonssLoveless",
          "character": "Jett",
          "stats": {
            "kills": 24,
            "deaths": 12,
            "assists": 5
          }
        }
      ]
    },
    "teams": {
      "blue": { "has_won": true, "rounds_won": 13 }
    },
    "derived": {
      "hs_percent": 25.5
    }
  }
}`}
                </div>
            </div>
          </section>

          <section id="today" className="bg-gradient-to-b from-[#131316]/80 to-[#0e0e11]/90 border border-card-border rounded-[16px] p-[30px] lg:p-[50px] scroll-mt-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-[10px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-300 opacity-0 fill-mode-forwards">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <i className="fa-solid fa-calendar-day text-accent-color text-[1.5rem] bg-accent-color/10 p-[10px] rounded-[8px] shadow-[inset_0_0_10px_rgba(255,70,85,0.05)]"></i> Sesión de Hoy
            </h2>
            <p className="mb-[20px] text-text-muted text-[1.05rem]">Obtiene el resumen de las partidas competitivas jugadas en las últimas 24 horas.</p>

            <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-[35px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
              <span className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px] bg-blue-500/15 text-blue-400 border border-blue-500/30">GET</span>
              <span className="text-text-color">/api/valorant/today/:region/:name/:tag</span>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Parámetros</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse m-[25px_0] bg-[#09090b]/60 rounded-[12px] border border-card-border overflow-hidden">
                <thead className="bg-white/5 text-text-color font-[600] uppercase text-[0.8rem] tracking-[1px] text-left">
                    <tr>
                    <th className="p-[18px_24px] border-b border-card-border">Parámetro</th>
                    <th className="p-[18px_24px] border-b border-card-border">Tipo</th>
                    <th className="p-[18px_24px] border-b border-card-border">Descripción</th>
                    </tr>
                </thead>
                <tbody className="text-text-muted text-[1.05rem]">
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px]"> <code className="bg-white/10 px-[8px] py-[3px] rounded-[6px] text-[#ff8f99] font-mono text-[0.9em]">type</code></td>
                    <td className="p-[18px_24px]">Number</td>
                    <td className="p-[18px_24px]">(Opcional) 1: Básico, 2: +Partidas Jugadas, 3: +Winrate</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Ejemplos de Uso</h3>
            <div className="flex gap-[8px] mb-0 overflow-x-auto pb-1">
              {['curl', 'bots'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTodayTab(tab)}
                  className={`p-[10px_20px] font-[500] text-[0.9rem] rounded-t-[8px] transition-all cursor-pointer whitespace-nowrap relative top-[1px] ${activeTodayTab === tab ? 'bg-[#111113] text-white border-card-border border border-b-transparent after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-color after:rounded-t-[8px]' : 'bg-[#0e0e11]/80 text-text-muted border border-card-border border-b-transparent hover:text-white hover:bg-[#111113]'}`}
                >
                  {tab === 'curl' && 'cURL'}
                  {tab === 'bots' && 'Bots'}
                </button>
              ))}
            </div>

            <div className="bg-[#111113] border border-card-border rounded-tr-[8px] rounded-b-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
                <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
                </div>
                <div className="p-[25px] font-mono text-[0.9rem] text-[#e2e8f0] leading-[1.6] overflow-x-auto whitespace-pre-wrap break-all">
                    {activeTodayTab === 'curl' && `curl -X GET "${siteUrl}/api/valorant/today/na/PonssLoveless/8882"`}
                    {activeTodayTab === 'bots' && `$(urlfetch ${siteUrl}/api/valorant/today/na/PonssLoveless/8882?format=text&type=1)`}
                </div>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Respuesta</h3>
            <div className="bg-[#111113] border border-card-border rounded-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
                <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
                </div>
                <div className="p-[25px] font-mono text-[0.9rem] text-[#a5b3ce] leading-[1.6] overflow-x-auto whitespace-pre-wrap">
{`{
  "status": 200,
  "data": {
    "matches_played": 4,
    "wins": 3,
    "losses": 1,
    "draws": 0,
    "rr_change": 42
  }
}`}
                </div>
            </div>
          </section>

          <section id="stats" className="bg-gradient-to-b from-[#131316]/80 to-[#0e0e11]/90 border border-card-border rounded-[16px] p-[30px] lg:p-[50px] scroll-mt-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-[10px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-400 opacity-0 fill-mode-forwards">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <i className="fa-solid fa-chart-pie text-accent-color text-[1.5rem] bg-accent-color/10 p-[10px] rounded-[8px] shadow-[inset_0_0_10px_rgba(255,70,85,0.05)]"></i> Estadísticas Generales
            </h2>
            <p className="mb-[20px] text-text-muted text-[1.05rem]">Obtiene las estadísticas de rendimiento de las últimas 10 partidas competitivas (Winrate, Agente favorito, HS%).</p>

            <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-[35px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
              <span className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px] bg-blue-500/15 text-blue-400 border border-blue-500/30">GET</span>
              <span className="text-text-color">/api/valorant/stats/:region/:name/:tag</span>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Parámetros</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse m-[25px_0] bg-[#09090b]/60 rounded-[12px] border border-card-border overflow-hidden">
                <thead className="bg-white/5 text-text-color font-[600] uppercase text-[0.8rem] tracking-[1px] text-left">
                    <tr>
                    <th className="p-[18px_24px] border-b border-card-border">Parámetro</th>
                    <th className="p-[18px_24px] border-b border-card-border">Tipo</th>
                    <th className="p-[18px_24px] border-b border-card-border">Descripción</th>
                    </tr>
                </thead>
                <tbody className="text-text-muted text-[1.05rem]">
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px]"> <code className="bg-white/10 px-[8px] py-[3px] rounded-[6px] text-[#ff8f99] font-mono text-[0.9em]">type</code></td>
                    <td className="p-[18px_24px]">Number</td>
                    <td className="p-[18px_24px]">(Opcional) 1: Básico, 2: Descriptivo, 3: Compacto</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Ejemplos de Uso</h3>
            <div className="flex gap-[8px] mb-0 overflow-x-auto pb-1">
              {['curl', 'bots'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveStatsTab(tab)}
                  className={`p-[10px_20px] font-[500] text-[0.9rem] rounded-t-[8px] transition-all cursor-pointer whitespace-nowrap relative top-[1px] ${activeStatsTab === tab ? 'bg-[#111113] text-white border-card-border border border-b-transparent after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-color after:rounded-t-[8px]' : 'bg-[#0e0e11]/80 text-text-muted border border-card-border border-b-transparent hover:text-white hover:bg-[#111113]'}`}
                >
                  {tab === 'curl' && 'cURL'}
                  {tab === 'bots' && 'Bots'}
                </button>
              ))}
            </div>

            <div className="bg-[#111113] border border-card-border rounded-tr-[8px] rounded-b-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
                <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
                </div>
                <div className="p-[25px] font-mono text-[0.9rem] text-[#e2e8f0] leading-[1.6] overflow-x-auto whitespace-pre-wrap break-all">
                    {activeStatsTab === 'curl' && `curl -X GET "${siteUrl}/api/valorant/stats/na/PonssLoveless/8882"`}
                    {activeStatsTab === 'bots' && `$(urlfetch ${siteUrl}/api/valorant/stats/na/PonssLoveless/8882?format=text&type=1)`}
                </div>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Respuesta</h3>
            <div className="bg-[#111113] border border-card-border rounded-[8px] overflow-hidden mb-[25px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
                <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
                </div>
                <div className="p-[25px] font-mono text-[0.9rem] text-[#a5b3ce] leading-[1.6] overflow-x-auto whitespace-pre-wrap">
{`{
  "status": 200,
  "data": {
    "matches_analyzed": 10,
    "winrate": 58,
    "favorite_agent": "Jett",
    "hs_percent": "25.5"
  }
}`}
                </div>
            </div>
          </section>

          <section id="errors" className="bg-gradient-to-b from-[#131316]/80 to-[#0e0e11]/90 border border-card-border rounded-[16px] p-[30px] lg:p-[50px] scroll-mt-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-[10px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-300 opacity-0 fill-mode-forwards">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <i className="fa-solid fa-triangle-exclamation text-accent-color text-[1.5rem] bg-accent-color/10 p-[10px] rounded-[8px] shadow-[inset_0_0_10px_rgba(255,70,85,0.05)]"></i> Códigos de Error
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse m-[25px_0] bg-[#09090b]/60 rounded-[12px] border border-card-border overflow-hidden">
                <thead className="bg-white/5 text-text-color font-[600] uppercase text-[0.8rem] tracking-[1px] text-left">
                    <tr>
                    <th className="p-[18px_24px] border-b border-card-border">Código</th>
                    <th className="p-[18px_24px] border-b border-card-border">Significado</th>
                    <th className="p-[18px_24px] border-b border-card-border">Descripción</th>
                    </tr>
                </thead>
                <tbody className="text-text-muted text-[1.05rem]">
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px] border-b border-card-border"><span className="text-yellow-500 font-bold">400</span></td>
                    <td className="p-[18px_24px] border-b border-card-border">Bad Request</td>
                    <td className="p-[18px_24px] border-b border-card-border">Faltan parámetros o la región es inválida.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px] border-b border-card-border"><span className="text-slate-500 font-bold">404</span></td>
                    <td className="p-[18px_24px] border-b border-card-border">Not Found</td>
                    <td className="p-[18px_24px] border-b border-card-border">El jugador no existe o perfil privado.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-[18px_24px]"><span className="text-red-500 font-bold">500</span></td>
                    <td className="p-[18px_24px]">Server Error</td>
                    <td className="p-[18px_24px]">Error del servidor o de Riot API.</td>
                    </tr>
                </tbody>
                </table>
            </div>
          </section>

          <footer className="mt-[60px] border-t border-card-border pt-[40px] text-center text-[0.9rem] text-text-muted w-full">
            <p>&copy; {new Date().getFullYear()} LosPerris Valorant API. Todos los derechos reservados.</p>
            <p className="m-[10px_auto] opacity-60 text-[11px] max-w-[600px]">La API de Valorant de LosPerris no cuenta con el respaldo de Riot Games y no refleja sus opiniones.</p>
          </footer>
        </main>
      </div>

      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
