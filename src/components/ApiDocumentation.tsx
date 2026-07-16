import { useState, useEffect } from 'react';

type Cmd = {
  id: string;
  label: string;
  icon: string;
  color: string;
  path: string;
  query: string;
  what: string;
  chatExample: string;
  detail: string;
};

const COMMANDS: Cmd[] = [
  {
    id: 'rank',
    label: 'Rango',
    icon: 'solar:medal-ribbon-linear',
    color: '#ffd479',
    path: '/api/rank/na/PonssLoveless/8882',
    query: '?format=text',
    what: 'Dice tu rango actual (ideal para !rank).',
    chatExample: 'Actualmente estoy en Ascendente 2 con 50 puntos',
    detail: '1 = solo rango · 2 = + puntos · 3 = + MMR',
  },
  {
    id: 'match',
    label: 'Última partida',
    icon: 'solar:gamepad-linear',
    color: '#a970ff',
    path: '/api/match/last/na/PonssLoveless/8882',
    query: '?format=text',
    what: 'Cuenta mapa, agente y si ganaste o perdiste.',
    chatExample: 'Mi última partida fue en Ascent con Jett gané 18 puntos',
    detail: '1 = básico · 2 = + KDA · 3 = + % headshots',
  },
  {
    id: 'today',
    label: 'Sesión de hoy',
    icon: 'solar:calendar-mark-linear',
    color: '#22c55e',
    path: '/api/today/na/PonssLoveless/8882',
    query: '?format=text&type=1',
    what: 'Resumen de hoy: victorias, derrotas y RR total.',
    chatExample: 'Hoy Jean lleva 2 Victorias, 1 Derrotas y 1 Empates (Total: +28 RR).',
    detail: '1 = corto · 2 = + partidas · 3 = + winrate',
  },
  {
    id: 'stats',
    label: 'Estadísticas',
    icon: 'solar:pie-chart-2-linear',
    color: '#3b82f6',
    path: '/api/stats/na/PonssLoveless/8882',
    query: '?format=text&type=1',
    what: 'Winrate, agente más jugado y % HS de las últimas partidas.',
    chatExample: 'Stats de Jean (10 partidas): 58% WR | Agente: Jett | HS: 25.5%',
    detail: '1 = compacto · 2 = frase · 3 = más largo',
  },
];

function BotCopyBox({ siteUrl, path, query }: { siteUrl: string; path: string; query: string }) {
  const [copied, setCopied] = useState(false);
  const command = `$(urlfetch ${siteUrl}${path}${query})`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-[#111113] border border-card-border rounded-[12px] overflow-hidden mb-2">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/5 bg-white/[0.03]">
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-neutral-500">
          Pega esto en tu bot
        </span>
        <button
          type="button"
          onClick={copy}
          className="text-xs font-semibold px-3 py-1 rounded-lg transition"
          style={{
            background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,70,85,0.12)',
            color: copied ? '#4ade80' : '#ff8a93',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.35)' : 'rgba(255,70,85,0.3)'}`,
          }}
        >
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <div className="p-4 font-mono text-[0.85rem] text-[#e2e8f0] leading-relaxed break-all">
        {command}
      </div>
    </div>
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

  const nav = [
    { href: '#intro', label: 'Cómo usarlo', icon: 'solar:home-2-linear', color: '#ff4655' },
    ...COMMANDS.map((c) => ({
      href: `#${c.id}`,
      label: c.label,
      icon: c.icon,
      color: c.color,
      group: 'Comandos',
    })),
    {
      href: '#problemas',
      label: 'Si algo falla',
      icon: 'solar:danger-triangle-linear',
      color: '#f59e0b',
      group: 'Ayuda',
    },
  ] as const;

  return (
    <div className="flex min-h-screen text-text-color font-main relative">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% -10%, rgba(255,70,85,0.2), transparent 50%), radial-gradient(circle at 92% 88%, rgba(169,112,255,0.14), transparent 46%), radial-gradient(circle at 8% 55%, rgba(34,197,94,0.08), transparent 42%)',
        }}
        aria-hidden
      />

      <button
        className="lg:hidden fixed top-5 right-5 z-[1000] text-white border-none w-[45px] h-[45px] rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,70,85,0.4)] flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#ff4655,#b81f2c)' }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <iconify-icon icon="solar:hamburger-menu-linear" width="20"></iconify-icon>
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] bg-[#0a0a0d]/75 backdrop-blur-2xl border-r border-white/5 p-[30px_20px] flex flex-col z-[100] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-3 mb-10">
          <img src="/imgs/LosPerris-minimal.svg" alt="Logo" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(255,70,85,0.6)]" />
          <h2 className="text-[1.15rem] font-[800] m-0 text-white">
            Guía <span className="text-[#ff4655]">fácil</span>
          </h2>
        </div>

        <nav className="docs-nav flex flex-col gap-2 flex-1 overflow-y-auto pr-2">
          {nav.map((item, i, arr) => {
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
                  <span className="docs-nav-icon flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a24] shrink-0">
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
            <iconify-icon icon="solar:alt-arrow-left-linear" width="20"></iconify-icon>
            Volver al panel
          </a>
        </nav>
      </aside>

      <div className="lg:ml-[280px] w-full flex-1 flex justify-center relative z-10">
        <main className="w-full max-w-[900px] p-[60px_20px] lg:p-[60px_40px] flex flex-col gap-8">
          {/* INTRO */}
          <section
            id="intro"
            className="rounded-[22px] p-[1.5px] scroll-mt-10 shadow-[0_20px_50px_-20px_rgba(255,70,85,0.35)]"
            style={{ background: 'linear-gradient(135deg,#ff4655,#16161b 36%,#16161b 64%,#ffd479)' }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-8 lg:p-12">
              <span
                className="inline-flex text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-5"
                style={{ background: 'rgba(255,70,85,0.12)', border: '1px solid rgba(255,70,85,0.35)', color: '#ff8a93' }}
              >
                Para streamers
              </span>
              <h1 className="text-3xl lg:text-5xl font-[800] text-white tracking-tight mb-4 leading-tight">
                Comandos para tu chat
              </h1>
              <p className="text-neutral-300 text-lg leading-relaxed mb-6 max-w-xl">
                No hace falta saber de APIs. En el panel generas el comando, lo copias y lo pegas en Nightbot, StreamElements u otro bot.
              </p>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-5">
                <p className="text-sm font-semibold text-white mb-3">En 3 pasos</p>
                <ol className="space-y-2.5 text-sm text-neutral-300">
                  <li className="flex gap-3">
                    <span className="text-[#ff8a93] font-bold shrink-0">1.</span>
                    Busca tu cuenta en el panel (región + Riot ID + tag).
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#ff8a93] font-bold shrink-0">2.</span>
                    Elige qué quieres: rango, partida, hoy o stats.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#ff8a93] font-bold shrink-0">3.</span>
                    Copia el comando y créalo en tu bot (!rank, !elo, etc.).
                  </li>
                </ol>
              </div>

              <a
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm hover:brightness-110 transition"
                style={{ background: 'linear-gradient(135deg,#ff4655,#e0303f)', boxShadow: '0 12px 32px -10px rgba(255,70,85,0.75)' }}
              >
                <iconify-icon icon="solar:widget-2-linear" width="16"></iconify-icon>
                Ir al panel
              </a>

              <p className="mt-6 text-sm text-neutral-500">
                Regiones: <span className="text-neutral-300">na, latam, br, eu, ap, kr</span>
                {' · '}
                Cambia el nombre y tag por los tuyos en la URL.
              </p>
            </div>
          </section>

          {/* COMMANDS */}
          {COMMANDS.map((cmd) => (
            <section
              key={cmd.id}
              id={cmd.id}
              className="rounded-[22px] p-[1.5px] scroll-mt-10"
              style={{
                background: `linear-gradient(135deg,${cmd.color},#16161b 40%,#16161b 60%,${cmd.color})`,
                boxShadow: `0 20px 50px -24px ${cmd.color}55`,
              }}
            >
              <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-8 lg:p-10">
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-3 flex items-center gap-3 pb-4 border-b border-white/5">
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                    style={{
                      color: cmd.color,
                      background: `${cmd.color}1f`,
                      border: `1px solid ${cmd.color}4d`,
                    }}
                  >
                    <iconify-icon icon={cmd.icon} width="22"></iconify-icon>
                  </span>
                  {cmd.label}
                </h2>

                <p className="text-neutral-400 mb-5">{cmd.what}</p>

                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-neutral-500 mb-2">
                  Así se ve en el chat
                </p>
                <p className="mb-5 rounded-xl px-4 py-3 text-sm text-white/90 border border-white/10 bg-black/30 italic">
                  «{cmd.chatExample}»
                </p>

                <BotCopyBox siteUrl={siteUrl} path={cmd.path} query={cmd.query} />

                <p className="text-xs text-neutral-500 mt-3">
                  Más detalle en el texto: añade <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99]">&amp;type=2</code> o{' '}
                  <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#ff8f99]">&amp;type=3</code>
                  {' — '}
                  {cmd.detail}
                </p>
              </div>
            </section>
          ))}

          {/* PROBLEMAS */}
          <section
            id="problemas"
            className="rounded-[22px] p-[1.5px] scroll-mt-10"
            style={{
              background: 'linear-gradient(135deg,#f59e0b,#16161b 40%,#16161b 60%,#fbbf24)',
              boxShadow: '0 20px 50px -24px rgba(245,158,11,0.3)',
            }}
          >
            <div className="rounded-[20.5px] bg-gradient-to-b from-[#16161b] to-[#0e0e11] p-8 lg:p-10">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-5 flex items-center gap-3 pb-4 border-b border-white/5">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-amber-400"
                  style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  <iconify-icon icon="solar:danger-triangle-linear" width="22"></iconify-icon>
                </span>
                Si algo falla
              </h2>

              <ul className="space-y-4 text-sm text-neutral-300">
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">·</span>
                  <span>
                    <strong className="text-white">Jugador no encontrado:</strong> revisa región, Riot ID y tag (sin el #).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">·</span>
                  <span>
                    <strong className="text-white">El bot no responde:</strong> asegúrate de usar <code className="bg-white/10 px-1 rounded text-[#ff8f99]">format=text</code> y de haber guardado el comando.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">·</span>
                  <span>
                    <strong className="text-white">Demasiadas peticiones:</strong> espera un minuto e inténtalo de nuevo.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">·</span>
                  <span>
                    <strong className="text-white">Error raro:</strong> suele ser temporal; prueba otra vez en un rato.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        .docs-nav-label {
          color: #a3a3a3;
          transition: color 0.15s ease;
        }
        .docs-nav-icon {
          color: #a3a3a3;
          transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
        }
        .docs-nav-link:hover {
          border-color: color-mix(in srgb, var(--nav-accent) 30%, transparent);
        }
        .docs-nav-link:hover .docs-nav-label { color: #fff; }
        .docs-nav-link:hover .docs-nav-icon {
          color: var(--nav-accent);
          background-color: color-mix(in srgb, var(--nav-accent) 14%, #1a1a24);
          border-color: color-mix(in srgb, var(--nav-accent) 30%, transparent);
        }
      `}</style>
    </div>
  );
}
