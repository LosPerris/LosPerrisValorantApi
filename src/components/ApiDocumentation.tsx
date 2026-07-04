import { useState, useEffect } from 'react';
import CodeTabs from './ui/CodeTabs';

export default function ApiDocumentation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState('https://vlr.losperris.dev');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="flex min-h-screen text-text-color font-main relative">
      {/* Ambiente multicolor como el landing */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% -10%, rgba(255,70,85,0.2), transparent 50%), radial-gradient(circle at 92% 88%, rgba(169,112,255,0.14), transparent 46%), radial-gradient(circle at 8% 55%, rgba(34,197,94,0.08), transparent 42%), radial-gradient(circle at 70% 30%, rgba(255,212,121,0.06), transparent 40%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          maskImage: 'radial-gradient(circle at 50% 20%, black, transparent 75%)',
        }}
        aria-hidden
      />

      <button
        className="lg:hidden fixed top-5 right-5 z-[1000] text-white border-none w-[45px] h-[45px] rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,70,85,0.4)] flex items-center justify-center text-[1.2rem]"
        style={{ background: 'linear-gradient(135deg,#ff4655,#b81f2c)' }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <iconify-icon icon="solar:hamburger-menu-linear" width="20"></iconify-icon>
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] bg-[#0a0a0d]/75 backdrop-blur-2xl border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] p-[30px_20px] flex flex-col z-[100] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSidebarOpen ? 'translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-[12px] mb-[40px]">
          <img
            src="/imgs/LosPerris-minimal.svg"
            alt="Logo"
            className="w-[32px] h-[32px] drop-shadow-[0_0_8px_rgba(255,70,85,0.6)]"
          />
          <h2 className="text-[1.2rem] font-[800] tracking-[1px] m-0 text-white">
            Docs <span className="text-[#ff4655]">API</span>
          </h2>
        </div>
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2">
          <a
            href="#intro"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.95rem] font-medium text-neutral-400 transition-all duration-300 hover:bg-[#1a1a24] hover:text-white border border-transparent hover:border-[#ff4655]/25 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a24] text-neutral-400 group-hover:bg-[#ff4655]/15 group-hover:text-[#ff4655] group-hover:border group-hover:border-[#ff4655]/30 transition-all duration-300">
              <iconify-icon icon="solar:home-2-linear" width="20"></iconify-icon>
            </span>
            Introducción
          </a>

          <div className="mt-6 flex flex-col gap-2">
            <span className="text-[10px] uppercase text-neutral-500 tracking-[0.2em] ml-4 mb-2 font-bold">
              Endpoints
            </span>
            <a
              href="#rank"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.95rem] font-medium text-neutral-400 transition-all duration-300 hover:bg-[#1a1a24] hover:text-white border border-transparent hover:border-[#ffd479]/30 group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a24] text-neutral-400 group-hover:bg-[#ffd479]/15 group-hover:text-[#ffd479] group-hover:border group-hover:border-[#ffd479]/30 transition-all duration-300">
                <iconify-icon icon="solar:medal-ribbon-linear" width="20"></iconify-icon>
              </span>
              Rank
            </a>
            <a
              href="#match"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.95rem] font-medium text-neutral-400 transition-all duration-300 hover:bg-[#1a1a24] hover:text-white border border-transparent hover:border-[#a970ff]/30 group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a24] text-neutral-400 group-hover:bg-[#a970ff]/15 group-hover:text-[#a970ff] group-hover:border group-hover:border-[#a970ff]/30 transition-all duration-300">
                <iconify-icon icon="solar:gamepad-linear" width="20"></iconify-icon>
              </span>
              Última Partida
            </a>
            <a
              href="#today"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.95rem] font-medium text-neutral-400 transition-all duration-300 hover:bg-[#1a1a24] hover:text-white border border-transparent hover:border-[#22c55e]/30 group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a24] text-neutral-400 group-hover:bg-[#22c55e]/15 group-hover:text-[#22c55e] group-hover:border group-hover:border-[#22c55e]/30 transition-all duration-300">
                <iconify-icon icon="solar:calendar-mark-linear" width="20"></iconify-icon>
              </span>
              Sesión de Hoy
            </a>
            <a
              href="#stats"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.95rem] font-medium text-neutral-400 transition-all duration-300 hover:bg-[#1a1a24] hover:text-white border border-transparent hover:border-[#3b82f6]/30 group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a24] text-neutral-400 group-hover:bg-[#3b82f6]/15 group-hover:text-[#3b82f6] group-hover:border group-hover:border-[#3b82f6]/30 transition-all duration-300">
                <iconify-icon icon="solar:pie-chart-2-linear" width="20"></iconify-icon>
              </span>
              Estadísticas
            </a>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <span className="text-[10px] uppercase text-neutral-500 tracking-[0.2em] ml-4 mb-2 font-bold">
              Soporte
            </span>
            <a
              href="#errors"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.95rem] font-medium text-neutral-400 transition-all duration-300 hover:bg-[#1a1a24] hover:text-white border border-transparent hover:border-amber-500/30 group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a24] text-neutral-400 group-hover:bg-amber-500/10 group-hover:text-amber-500 group-hover:border group-hover:border-amber-500/30 transition-all duration-300">
                <iconify-icon icon="solar:danger-triangle-linear" width="20"></iconify-icon>
              </span>
              Errores
            </a>
          </div>

          <a
            href="/"
            className="mt-auto justify-center flex items-center gap-3 px-4 py-2.5 text-neutral-300 rounded-xl text-[0.95rem] font-medium transition-all hover:text-white group"
            style={{
              background: 'linear-gradient(135deg, rgba(255,70,85,0.12), rgba(169,112,255,0.1))',
              border: '1px solid rgba(255,70,85,0.25)',
            }}
          >
            <iconify-icon icon="solar:alt-arrow-left-linear" width="20"></iconify-icon> Volver al Panel
          </a>
        </nav>
      </aside>

      <div className="lg:ml-[280px] w-full lg:w-auto flex-1 flex justify-center relative z-10">
        <main className="w-full max-w-[1100px] p-[60px_20px] lg:p-[60px_40px] flex flex-col gap-[40px]">
          {/* INTRO */}
          <section
            id="intro"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] shadow-[0_20px_50px_-20px_rgba(255,70,85,0.35)]"
            style={{
              background: 'linear-gradient(135deg,#ff4655,#16161b 36%,#16161b 64%,#ffd479)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-5"
                style={{
                  background: 'rgba(255,70,85,0.12)',
                  border: '1px solid rgba(255,70,85,0.35)',
                  color: '#ff8a93',
                }}
              >
                Referencia API
              </span>
              <h1 className="text-[2.5rem] lg:text-[3.5rem] font-[800] mb-[20px] tracking-[-1.5px] leading-[1.1] text-white">
                Documentación{' '}
                <span className="bg-gradient-to-br from-[#ff4655] via-[#ff8a93] to-[#ffd479] bg-clip-text text-transparent">
                  Valorant API
                </span>
              </h1>
              <p className="text-[1.1rem] lg:text-[1.25rem] text-neutral-400 mb-[24px] leading-[1.8]">
                Bienvenido a la documentación de <strong className="text-white">LosPerris Valorant API</strong>.
                Integra rangos, partidas y estadísticas en tus apps o bots de chat (Nightbot, StreamElements,
                Fossabot).
              </p>
              <div
                className="rounded-[12px] p-[1px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,70,85,0.5), rgba(169,112,255,0.35), rgba(34,197,94,0.35))',
                }}
              >
                <div className="rounded-[11px] bg-[#09090b]/90 px-5 py-4 font-mono text-[0.95rem] text-white break-all">
                  <span className="text-[#ff8a93] text-[10px] uppercase tracking-[0.18em] font-bold block mb-1.5">
                    Base URL
                  </span>
                  {siteUrl}
                </div>
              </div>
            </div>
          </section>

          {/* RANK — rojo / oro */}
          <section
            id="rank"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-100 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(255,212,121,0.35)]"
            style={{
              background: 'linear-gradient(135deg,#ff4655,#16161b 38%,#16161b 62%,#ffd479)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-xl text-[#ffd479]"
                style={{
                  background: 'rgba(255,212,121,0.12)',
                  border: '1px solid rgba(255,212,121,0.3)',
                }}
              >
                <iconify-icon icon="solar:medal-ribbon-linear" width="24"></iconify-icon>
              </span>{' '}
              Obtener Rango (MMR)
            </h2>
            <p className="mb-[20px] text-text-muted text-[1.05rem]">Devuelve el rango actual, ELO y puntuación de un jugador. Ideal para comandos <code className="bg-white/10 px-[8px] py-[3px] rounded-[6px] text-[#ff8f99] font-mono text-[0.9em]">!rank</code>.</p>

            <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-[35px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
              <span className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px] bg-[#ff4655]/15 text-[#ff8a93] border border-[#ff4655]/30">GET</span>
              <span className="text-text-color">/api/rank/:region/:name/:tag</span>
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
            <CodeTabs 
              siteUrl={siteUrl}
              endpoint="/api/rank/na/PonssLoveless/8882"
              botQuery="?format=text"
            />

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
            </div>
          </section>

          {/* MATCH — morado */}
          <section
            id="match"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-200 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(169,112,255,0.35)]"
            style={{
              background: 'linear-gradient(135deg,#a970ff,#16161b 38%,#16161b 62%,#c4a3ff)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-xl text-[#c4a3ff]"
                style={{
                  background: 'rgba(169,112,255,0.12)',
                  border: '1px solid rgba(169,112,255,0.3)',
                }}
              >
                <iconify-icon icon="solar:gamepad-linear" width="24"></iconify-icon>
              </span>{' '}
              Última Partida
            </h2>
            <p className="mb-[20px] text-text-muted text-[1.05rem]">Obtiene estadísticas detalladas de la última partida competitiva jugada.</p>

            <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-[35px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
              <span className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px] bg-[#a970ff]/15 text-[#c4a3ff] border border-[#a970ff]/30">GET</span>
              <span className="text-text-color">/api/match/last/:region/:name/:tag</span>
            </div>

            <CodeTabs 
              siteUrl={siteUrl}
              endpoint="/api/match/last/na/PonssLoveless/8882"
              botQuery="?format=text"
            />

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
            </div>
          </section>

          {/* TODAY — verde */}
          <section
            id="today"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-300 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(34,197,94,0.3)]"
            style={{
              background: 'linear-gradient(135deg,#22c55e,#16161b 38%,#16161b 62%,#4ade80)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-xl text-[#4ade80]"
                style={{
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.3)',
                }}
              >
                <iconify-icon icon="solar:calendar-mark-linear" width="24"></iconify-icon>
              </span>{' '}
              Sesión de Hoy
            </h2>
            <p className="mb-[20px] text-text-muted text-[1.05rem]">Obtiene el resumen de las partidas competitivas jugadas en las últimas 24 horas.</p>

            <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-[35px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
              <span className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px] bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">GET</span>
              <span className="text-text-color">/api/today/:region/:name/:tag</span>
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
            <CodeTabs 
              siteUrl={siteUrl}
              endpoint="/api/today/na/PonssLoveless/8882"
              botQuery="?format=text&type=1"
            />

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
            </div>
          </section>

          {/* STATS — azul */}
          <section
            id="stats"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-400 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(59,130,246,0.35)]"
            style={{
              background: 'linear-gradient(135deg,#3b82f6,#16161b 38%,#16161b 62%,#60a5fa)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-xl text-[#60a5fa]"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.3)',
                }}
              >
                <iconify-icon icon="solar:pie-chart-2-linear" width="24"></iconify-icon>
              </span>{' '}
              Estadísticas Generales
            </h2>
            <p className="mb-[20px] text-text-muted text-[1.05rem]">Obtiene las estadísticas de rendimiento de las últimas 10 partidas competitivas (Winrate, Agente favorito, HS%).</p>

            <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-[35px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
              <span className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px] bg-blue-500/15 text-blue-400 border border-blue-500/30">GET</span>
              <span className="text-text-color">/api/stats/:region/:name/:tag</span>
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
                    <td className="p-[18px_24px]">(Opcional) 1: Compacto, 2: Básico, 3: Descriptivo</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <h3 className="text-[1.3rem] m-[35px_0_15px_0] text-white font-[600]">Ejemplos de Uso</h3>
            <CodeTabs 
              siteUrl={siteUrl}
              endpoint="/api/stats/na/PonssLoveless/8882"
              botQuery="?format=text&type=1"
            />

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
            </div>
          </section>

          {/* ERRORS — ámbar */}
          <section
            id="errors"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-300 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(245,158,11,0.3)]"
            style={{
              background: 'linear-gradient(135deg,#f59e0b,#16161b 38%,#16161b 62%,#fbbf24)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
            <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-[25px] flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-xl text-amber-400"
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
              >
                <iconify-icon icon="solar:danger-triangle-linear" width="24"></iconify-icon>
              </span>{' '}
              Códigos de Error
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
            </div>
          </section>

          <footer className="mt-[60px] border-t border-white/10 pt-[40px] text-center text-[0.9rem] text-neutral-500 w-full">
            <p className="text-neutral-400">
              &copy; {new Date().getFullYear()} Los<span className="text-[#ff4655]">Perris</span> Valorant API
            </p>
            <p className="m-[10px_auto] opacity-70 text-[11px] max-w-[600px]">
              No afiliada a Riot Games ni a Valorant.
            </p>
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
