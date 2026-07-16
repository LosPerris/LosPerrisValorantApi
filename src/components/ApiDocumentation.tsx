import { useState, useEffect, type ReactNode } from 'react';
import CodeTabs from './ui/CodeTabs';

function EndpointPath({ methodColor, methodBg, methodBorder, path }: {
  methodColor: string;
  methodBg: string;
  methodBorder: string;
  path: string;
}) {
  return (
    <div className="bg-[#09090b]/60 backdrop-blur-[10px] border border-card-border rounded-[8px] p-[15px_20px] flex items-center gap-[15px] mb-6 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.2)] break-all">
      <span
        className="font-[700] p-[6px_12px] rounded-[6px] text-[0.85rem] tracking-[0.5px]"
        style={{ background: methodBg, color: methodColor, border: `1px solid ${methodBorder}` }}
      >
        GET
      </span>
      <span className="text-text-color">{path}</span>
    </div>
  );
}

function JsonExample({ children }: { children: string }) {
  return (
    <div className="bg-[#111113] border border-card-border rounded-[8px] overflow-hidden mb-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
      <div className="h-[30px] bg-white/5 border-b border-white/5 px-[15px] flex items-center">
        <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[16px_0_0_#f59e0b,32px_0_0_#10b981]"></div>
      </div>
      <div className="p-[20px] font-mono text-[0.9rem] text-[#a5b3ce] leading-[1.6] overflow-x-auto whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

function TypeNote({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 text-sm text-neutral-400">
      <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">type</code>
      {' '}
      {children}
    </p>
  );
}

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
        <nav className="docs-nav flex flex-col gap-2 flex-1 overflow-y-auto pr-2">
          {(
            [
              { href: '#intro', label: 'Introducción', icon: 'solar:home-2-linear', color: '#ff4655' },
              {
                href: '#rank',
                label: 'Rank',
                icon: 'solar:medal-ribbon-linear',
                color: '#ffd479',
                group: 'Endpoints',
              },
              {
                href: '#match',
                label: 'Última Partida',
                icon: 'solar:gamepad-linear',
                color: '#a970ff',
                group: 'Endpoints',
              },
              {
                href: '#today',
                label: 'Sesión de Hoy',
                icon: 'solar:calendar-mark-linear',
                color: '#22c55e',
                group: 'Endpoints',
              },
              {
                href: '#stats',
                label: 'Estadísticas',
                icon: 'solar:pie-chart-2-linear',
                color: '#3b82f6',
                group: 'Endpoints',
              },
              {
                href: '#errors',
                label: 'Errores',
                icon: 'solar:danger-triangle-linear',
                color: '#f59e0b',
                group: 'Soporte',
              },
            ] as const
          ).map((item, i, arr) => {
            const prev = arr[i - 1] as { group?: string } | undefined;
            const group = 'group' in item ? item.group : undefined;
            const showGroup = Boolean(group && group !== prev?.group);
            return (
              <div key={item.href}>
                {showGroup && (
                  <span className="mt-6 mb-2 ml-4 block text-[10px] uppercase text-neutral-500 tracking-[0.2em] font-bold">
                    {group}
                  </span>
                )}
                <a
                  href={item.href}
                  className="docs-nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.95rem] font-medium border border-transparent hover:bg-[#1a1a24]"
                  style={{ ['--nav-accent' as string]: item.color }}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="docs-nav-icon flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a24] border border-transparent shrink-0">
                    <iconify-icon icon={item.icon} width="20" height="20"></iconify-icon>
                  </span>
                  <span className="docs-nav-label">{item.label}</span>
                </a>
              </div>
            );
          })}

          <a
            href="/"
            className="mt-auto justify-center flex items-center gap-2 px-4 py-2.5 text-neutral-300 rounded-xl text-[0.95rem] font-medium hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, rgba(255,70,85,0.12), rgba(169,112,255,0.1))',
              border: '1px solid rgba(255,70,85,0.25)',
            }}
          >
            <iconify-icon icon="solar:alt-arrow-left-linear" width="20" height="20"></iconify-icon>
            Volver al Panel
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
              <h1 className="text-[2.5rem] lg:text-[3.5rem] font-[800] mb-[16px] tracking-[-1.5px] leading-[1.1] text-white">
                Documentación{' '}
                <span className="bg-gradient-to-br from-[#ff4655] via-[#ff8a93] to-[#ffd479] bg-clip-text text-transparent">
                  Valorant API
                </span>
              </h1>
              <p className="text-[1.1rem] text-neutral-300 mb-6 leading-relaxed max-w-2xl">
                Rangos, última partida, sesión de hoy y stats para bots de chat
                (Nightbot, StreamElements, Fossabot…) o tus propias apps.
              </p>

              <div
                className="rounded-[12px] p-[1px] mb-8"
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

              <h2 className="text-lg font-semibold text-white mb-3">Parámetros comunes</h2>
              <p className="text-sm text-neutral-400 mb-4">
                Todos los endpoints usan la misma ruta base:{' '}
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">
                  /api/.../:region/:name/:tag
                </code>
              </p>
              <div className="overflow-x-auto mb-5">
                <table className="w-full border-collapse bg-[#09090b]/60 rounded-[12px] border border-card-border overflow-hidden">
                  <thead className="bg-white/5 text-text-color font-[600] uppercase text-[0.75rem] tracking-[1px] text-left">
                    <tr>
                      <th className="p-[14px_18px] border-b border-card-border">Parámetro</th>
                      <th className="p-[14px_18px] border-b border-card-border">Qué es</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-400 text-[0.95rem]">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px] border-b border-card-border">
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">region</code>
                      </td>
                      <td className="p-[14px_18px] border-b border-card-border">
                        <code className="text-neutral-300">na</code>, <code className="text-neutral-300">latam</code>,{' '}
                        <code className="text-neutral-300">br</code>, <code className="text-neutral-300">eu</code>,{' '}
                        <code className="text-neutral-300">ap</code>, <code className="text-neutral-300">kr</code>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px] border-b border-card-border">
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">name</code>
                      </td>
                      <td className="p-[14px_18px] border-b border-card-border">Riot ID (nombre)</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px] border-b border-card-border">
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">tag</code>
                      </td>
                      <td className="p-[14px_18px] border-b border-card-border">Tag (#8882 → <code className="text-neutral-300">8882</code>)</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px] border-b border-card-border">
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">format</code>
                      </td>
                      <td className="p-[14px_18px] border-b border-card-border">
                        Query opcional. <code className="text-neutral-300">text</code> = frase lista para el chat
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px] border-b border-card-border">
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">lang</code>
                      </td>
                      <td className="p-[14px_18px] border-b border-card-border">
                        Query opcional. <code className="text-neutral-300">es</code> (default) o <code className="text-neutral-300">en</code>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px]">
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">type</code>
                      </td>
                      <td className="p-[14px_18px]">
                        Query opcional. <code className="text-neutral-300">1</code> / <code className="text-neutral-300">2</code> /{' '}
                        <code className="text-neutral-300">3</code> = más detalle en el texto
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-neutral-300 rounded-xl px-4 py-3 border border-[#ff4655]/25 bg-[#ff4655]/5">
                <strong className="text-white">Para bots:</strong> añade{' '}
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">?format=text</code>{' '}
                y usa la pestaña «Comandos Bots» en cada endpoint.
              </p>
            </div>
          </section>

          {/* RANK */}
          <section
            id="rank"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-100 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(255,212,121,0.35)]"
            style={{
              background: 'linear-gradient(135deg,#ff4655,#16161b 38%,#16161b 62%,#ffd479)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
              <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-4 flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-[#ffd479]"
                  style={{
                    background: 'rgba(255,212,121,0.12)',
                    border: '1px solid rgba(255,212,121,0.3)',
                  }}
                >
                  <iconify-icon icon="solar:medal-ribbon-linear" width="24"></iconify-icon>
                </span>{' '}
                Rank
              </h2>
              <p className="mb-5 text-neutral-400 text-[1.05rem]">
                Rango actual, RR y ELO. Ideal para un comando <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99] font-mono text-[0.85em]">!rank</code>.
              </p>

              <EndpointPath
                methodBg="rgba(255,70,85,0.15)"
                methodColor="#ff8a93"
                methodBorder="rgba(255,70,85,0.3)"
                path="/api/rank/:region/:name/:tag"
              />

              <TypeNote>
                en texto: <strong className="text-neutral-300">1</strong> solo rango ·{' '}
                <strong className="text-neutral-300">2</strong> + RR ·{' '}
                <strong className="text-neutral-300">3</strong> + ELO
              </TypeNote>

              <h3 className="text-lg m-[0_0_12px_0] text-white font-[600]">Ejemplo</h3>
              <CodeTabs
                siteUrl={siteUrl}
                endpoint="/api/rank/na/PonssLoveless/8882"
                botQuery="?format=text"
              />

              <h3 className="text-lg m-[8px_0_12px_0] text-white font-[600]">Respuesta (JSON)</h3>
              <JsonExample>{`{
  "status": 200,
  "data": {
    "name": "PonssLoveless",
    "tag": "8882",
    "current_tier_patched": "Ascendant 2",
    "ranking_in_tier": 50,
    "mmr_change_to_last_game": 18,
    "elo": 1650
  }
}`}</JsonExample>
            </div>
          </section>

          {/* MATCH */}
          <section
            id="match"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-200 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(169,112,255,0.35)]"
            style={{
              background: 'linear-gradient(135deg,#a970ff,#16161b 38%,#16161b 62%,#c4a3ff)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
              <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-4 flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-[#c4a3ff]"
                  style={{
                    background: 'rgba(169,112,255,0.12)',
                    border: '1px solid rgba(169,112,255,0.3)',
                  }}
                >
                  <iconify-icon icon="solar:gamepad-linear" width="24"></iconify-icon>
                </span>{' '}
                Última partida
              </h2>
              <p className="mb-5 text-neutral-400 text-[1.05rem]">
                Mapa, agente, KDA y si ganaste o perdiste la última competitiva.
              </p>

              <EndpointPath
                methodBg="rgba(169,112,255,0.15)"
                methodColor="#c4a3ff"
                methodBorder="rgba(169,112,255,0.3)"
                path="/api/match/last/:region/:name/:tag"
              />

              <TypeNote>
                en texto: <strong className="text-neutral-300">1</strong> básico ·{' '}
                <strong className="text-neutral-300">2</strong> + KDA ·{' '}
                <strong className="text-neutral-300">3</strong> + % HS
              </TypeNote>

              <h3 className="text-lg m-[0_0_12px_0] text-white font-[600]">Ejemplo</h3>
              <CodeTabs
                siteUrl={siteUrl}
                endpoint="/api/match/last/na/PonssLoveless/8882"
                botQuery="?format=text"
              />

              <h3 className="text-lg m-[8px_0_12px_0] text-white font-[600]">Respuesta (JSON)</h3>
              <JsonExample>{`{
  "status": 200,
  "data": {
    "derived": {
      "map_name": "Ascent",
      "is_win": true,
      "is_draw": false,
      "kda": "24/12/5",
      "hs_percent": 25.5,
      "agent_name": "Jett"
    }
  }
}`}</JsonExample>
              <p className="text-sm text-neutral-500">
                También puede venir <code className="bg-white/10 px-1 py-0.5 rounded text-[#c4a3ff] font-mono text-[0.8em]">is_draw: true</code>.
                El RR del chat es independiente: un empate puede sumar o restar puntos.
              </p>
            </div>
          </section>

          {/* TODAY */}
          <section
            id="today"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-300 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(34,197,94,0.3)]"
            style={{
              background: 'linear-gradient(135deg,#22c55e,#16161b 38%,#16161b 62%,#4ade80)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
              <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-4 flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-[#4ade80]"
                  style={{
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}
                >
                  <iconify-icon icon="solar:calendar-mark-linear" width="24"></iconify-icon>
                </span>{' '}
                Sesión de hoy
              </h2>
              <p className="mb-5 text-neutral-400 text-[1.05rem]">
                Resumen de las últimas 24 h: victorias, derrotas, empates y RR total.
              </p>

              <EndpointPath
                methodBg="rgba(34,197,94,0.15)"
                methodColor="#4ade80"
                methodBorder="rgba(34,197,94,0.3)"
                path="/api/today/:region/:name/:tag"
              />

              <TypeNote>
                en texto: <strong className="text-neutral-300">1</strong> corto ·{' '}
                <strong className="text-neutral-300">2</strong> + partidas ·{' '}
                <strong className="text-neutral-300">3</strong> + winrate
              </TypeNote>

              <h3 className="text-lg m-[0_0_12px_0] text-white font-[600]">Ejemplo</h3>
              <CodeTabs
                siteUrl={siteUrl}
                endpoint="/api/today/na/PonssLoveless/8882"
                botQuery="?format=text&type=1"
              />

              <h3 className="text-lg m-[8px_0_12px_0] text-white font-[600]">Respuesta (JSON)</h3>
              <JsonExample>{`{
  "status": 200,
  "data": {
    "matches_played": 4,
    "wins": 2,
    "losses": 1,
    "draws": 1,
    "rr_change": 28
  }
}`}</JsonExample>
              <p className="text-sm text-neutral-500">
                W/L/D van por resultado del mapa; <code className="bg-white/10 px-1 py-0.5 rounded text-[#4ade80] font-mono text-[0.8em]">rr_change</code> suma el RR real (también en empates).
              </p>
            </div>
          </section>

          {/* STATS */}
          <section
            id="stats"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-400 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(59,130,246,0.35)]"
            style={{
              background: 'linear-gradient(135deg,#3b82f6,#16161b 38%,#16161b 62%,#60a5fa)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
              <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-4 flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-[#60a5fa]"
                  style={{
                    background: 'rgba(59,130,246,0.12)',
                    border: '1px solid rgba(59,130,246,0.3)',
                  }}
                >
                  <iconify-icon icon="solar:pie-chart-2-linear" width="24"></iconify-icon>
                </span>{' '}
                Estadísticas
              </h2>
              <p className="mb-5 text-neutral-400 text-[1.05rem]">
                Winrate, agente más jugado y % HS de las últimas 10 competitivas.
              </p>

              <EndpointPath
                methodBg="rgba(59,130,246,0.15)"
                methodColor="#60a5fa"
                methodBorder="rgba(59,130,246,0.3)"
                path="/api/stats/:region/:name/:tag"
              />

              <TypeNote>
                en texto: <strong className="text-neutral-300">1</strong> compacto ·{' '}
                <strong className="text-neutral-300">2</strong> frase ·{' '}
                <strong className="text-neutral-300">3</strong> más descriptivo
              </TypeNote>

              <h3 className="text-lg m-[0_0_12px_0] text-white font-[600]">Ejemplo</h3>
              <CodeTabs
                siteUrl={siteUrl}
                endpoint="/api/stats/na/PonssLoveless/8882"
                botQuery="?format=text&type=1"
              />

              <h3 className="text-lg m-[8px_0_12px_0] text-white font-[600]">Respuesta (JSON)</h3>
              <JsonExample>{`{
  "status": 200,
  "data": {
    "matches_analyzed": 10,
    "winrate": 58,
    "favorite_agent": "Jett",
    "hs_percent": "25.5"
  }
}`}</JsonExample>
            </div>
          </section>

          {/* ERRORS */}
          <section
            id="errors"
            className="rounded-[22px] p-[1.5px] scroll-mt-[40px] animate-[fadeInUp_0.6s_ease-out_forwards] delay-300 opacity-0 fill-mode-forwards shadow-[0_20px_50px_-24px_rgba(245,158,11,0.3)]"
            style={{
              background: 'linear-gradient(135deg,#f59e0b,#16161b 38%,#16161b 62%,#fbbf24)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-[30px] lg:p-[50px]">
              <h2 className="text-[1.6rem] lg:text-[1.8rem] mb-4 flex items-center gap-[15px] font-[700] text-white pb-[15px] border-b border-white/5">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-amber-400"
                  style={{
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                >
                  <iconify-icon icon="solar:danger-triangle-linear" width="24"></iconify-icon>
                </span>{' '}
                Errores
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-[#09090b]/60 rounded-[12px] border border-card-border overflow-hidden">
                  <thead className="bg-white/5 text-text-color font-[600] uppercase text-[0.75rem] tracking-[1px] text-left">
                    <tr>
                      <th className="p-[14px_18px] border-b border-card-border">Código</th>
                      <th className="p-[14px_18px] border-b border-card-border">Qué pasó</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-400 text-[0.95rem]">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px] border-b border-card-border">
                        <span className="text-yellow-500 font-bold">400</span>
                      </td>
                      <td className="p-[14px_18px] border-b border-card-border">
                        Falta un dato o la región no es válida
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px] border-b border-card-border">
                        <span className="text-slate-400 font-bold">404</span>
                      </td>
                      <td className="p-[14px_18px] border-b border-card-border">
                        Jugador no encontrado (o sin datos)
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px] border-b border-card-border">
                        <span className="text-orange-400 font-bold">429</span>
                      </td>
                      <td className="p-[14px_18px] border-b border-card-border">
                        Demasiadas peticiones (límite ~60/min por IP). Mira el header{' '}
                        <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-[0.8em]">Retry-After</code>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-[14px_18px]">
                        <span className="text-red-500 font-bold">500</span>
                      </td>
                      <td className="p-[14px_18px]">
                        Error nuestro o de la API de Riot; reintenta en un momento
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .docs-nav-link {
          color: inherit;
        }

        .docs-nav-label {
          color: #a3a3a3;
          transition: color 0.15s ease;
        }

        .docs-nav-icon {
          color: #a3a3a3;
          transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
        }

        .docs-nav-icon iconify-icon {
          color: inherit;
          display: block;
        }

        .docs-nav-link:hover {
          border-color: color-mix(in srgb, var(--nav-accent) 30%, transparent);
        }

        .docs-nav-link:hover .docs-nav-label {
          color: #fff;
        }

        .docs-nav-link:hover .docs-nav-icon {
          color: var(--nav-accent);
          background-color: color-mix(in srgb, var(--nav-accent) 14%, #1a1a24);
          border-color: color-mix(in srgb, var(--nav-accent) 30%, transparent);
        }
      `}</style>
    </div>
  );
}
