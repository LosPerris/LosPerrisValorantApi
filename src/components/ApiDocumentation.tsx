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
    detail: 'Estilos: default (frase) · clean (solo dato) · custom (plantilla). type 1–3 = detalle.',
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
    detail: 'Estilos: default · clean · custom. type 1–3 = detalle.',
  },
  {
    id: 'today',
    label: 'Sesión de hoy',
    icon: 'solar:calendar-mark-linear',
    color: '#22c55e',
    path: '/api/today/na/PonssLoveless/8882',
    query: '?format=text&type=1',
    what: 'Resumen de hoy: victorias, derrotas y RR total.',
    chatExample: 'Hoy PonssLoveless lleva 2 Victorias, 1 Derrotas y 1 Empates (Total: +28 RR).',
    detail: 'Estilos: default · clean · custom. type 1–3 = detalle.',
  },
  {
    id: 'stats',
    label: 'Estadísticas',
    icon: 'solar:pie-chart-2-linear',
    color: '#3b82f6',
    path: '/api/stats/na/PonssLoveless/8882',
    query: '?format=text&type=1',
    what: 'Winrate, agente más jugado y % HS de las últimas partidas.',
    chatExample: 'Stats de PonssLoveless (10 partidas): 58% WR | Agente: Jett | HS: 25.5%',
    detail: 'Estilos: default · clean · custom. type 1–3 = detalle.',
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
    <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden mt-4">
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-white/5 bg-[#0a0a0a]">
        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
          Pega esto en tu bot
        </span>
        <button
          type="button"
          onClick={copy}
          className="text-[10px] font-bold px-2.5 py-1.5 rounded-md transition-all"
          style={{
            background: copied ? 'rgba(34,197,94,0.1)' : '#0a0a0a',
            color: copied ? '#4ade80' : '#ff4655',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : '#ff4655'}`,
          }}
        >
          {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
      <div className="p-4 font-mono text-sm text-neutral-300 leading-relaxed break-all shadow-inner">
        {command}
      </div>
    </div>
  );
}

export default function ApiDocumentation() {
  const [siteUrl, setSiteUrl] = useState('https://vlr.losperris.dev');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="min-h-screen text-white font-main relative bg-[#050505] pt-8 pb-16 px-4 md:px-6">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,70,85,0.05), transparent 50%)',
        }}
        aria-hidden
      />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-8">
        
        {/* HEADER / VOLVER AL PANEL */}
        <div className="flex justify-start">
          <a
            href="/"
            className="group flex items-center gap-2.5 text-xs font-bold tracking-wide text-neutral-300 hover:text-[#ff4655] transition-all bg-[#0a0a0a] border border-white/10 hover:border-[#ff4655] hover:shadow-[0_0_12px_rgba(255,70,85,0.2)] px-5 py-2.5 rounded-xl shadow-sm"
          >
            <iconify-icon icon="solar:alt-arrow-left-linear" width="16" className="text-[#ff4655] transition-colors"></iconify-icon>
            VOLVER AL PANEL
          </a>
        </div>

        {/* INTRO HERO */}
        <section className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-10 shadow-lg">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#ff4655] px-3 py-1 rounded-full border border-[#ff4655]/30 bg-[#ff4655]/5 uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655] shadow-[0_0_5px_#ff4655]"></span>
            Para streamers
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Documentación <span className="text-[#ff4655] font-light">API</span>
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-2xl">
            No hace falta saber programación. Copia el comando generado y pégalo directamente en Nightbot, StreamElements u otro bot compatible con <code className="text-[#ff4655]">$(urlfetch)</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-inner">
              <span className="text-2xl font-bold text-white/10 mb-2 block">01</span>
              <h3 className="text-sm font-semibold text-white mb-2">Busca tu cuenta</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Usa el panel principal para buscar tu Riot ID y Región.</p>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-inner">
              <span className="text-2xl font-bold text-white/10 mb-2 block">02</span>
              <h3 className="text-sm font-semibold text-white mb-2">Elige el comando</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Configura si quieres mostrar tu rango, partida o estadísticas.</p>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-inner">
              <span className="text-2xl font-bold text-white/10 mb-2 block">03</span>
              <h3 className="text-sm font-semibold text-white mb-2">Copia y pega</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Pega la URL generada como respuesta de un comando en tu bot.</p>
            </div>
          </div>
        </section>

        {/* COMANDOS */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-white px-2 mt-4 border-l-2 border-[#ff4655] pl-3">Endpoints Disponibles</h2>
          
          {COMMANDS.map((cmd) => (
            <section
              key={cmd.id}
              id={cmd.id}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 scroll-mt-6 transition-all hover:border-white/20"
            >
              <div className="flex items-start md:items-center gap-4 mb-4">
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 border"
                  style={{ backgroundColor: `${cmd.color}15`, borderColor: `${cmd.color}30`, color: cmd.color }}
                >
                  <iconify-icon icon={cmd.icon} width="24"></iconify-icon>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{cmd.label}</h3>
                  <p className="text-sm text-neutral-400 mt-1">{cmd.what}</p>
                </div>
              </div>

              <div className="mt-6 mb-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">Ejemplo en chat</span>
                <div className="flex items-start gap-3 bg-[#111] border border-white/5 p-4 rounded-xl shadow-inner">
                  <div className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-bold text-white/80">
                    <iconify-icon icon="solar:bot-linear" width="14"></iconify-icon>
                    Nightbot
                  </div>
                  <p className="text-sm text-neutral-300 font-medium leading-relaxed pt-0.5">
                    {cmd.chatExample}
                  </p>
                </div>
              </div>

              <BotCopyBox siteUrl={siteUrl} path={cmd.path} query={cmd.query} />
              
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-neutral-500 flex items-center gap-2">
                  <iconify-icon icon="solar:info-circle-linear" width="14"></iconify-icon>
                  <span>
                    Detalles técnicos: {cmd.detail}
                  </span>
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* PROBLEMAS */}
        <section id="problemas" className="bg-[#0a0a0a] border border-amber-500/20 rounded-2xl p-6 md:p-8 mt-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 to-orange-500/10"></div>
          
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg text-amber-400 bg-amber-400/10 border border-amber-400/20">
              <iconify-icon icon="solar:danger-triangle-linear" width="18"></iconify-icon>
            </span>
            Resolución de problemas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111] border border-white/5 p-5 rounded-xl shadow-inner flex gap-4 items-start">
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 mt-0.5">
                <iconify-icon icon="solar:user-cross-linear" width="18"></iconify-icon>
              </div>
              <div>
                <strong className="text-sm text-white block mb-1.5">Jugador no encontrado (404)</strong>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Revisa que la región sea la correcta (na, latam, eu, ap). Asegúrate de escribir el Riot ID sin espacios extra y recuerda que el tag (los 4 números/letras) va <strong>sin el símbolo '#'</strong> al inicio.
                </p>
              </div>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-5 rounded-xl shadow-inner flex gap-4 items-start">
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
                <iconify-icon icon="solar:ghost-linear" width="18"></iconify-icon>
              </div>
              <div>
                <strong className="text-sm text-white block mb-1.5">El bot no responde en el chat</strong>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Si el enlace funciona en tu navegador pero Nightbot o StreamElements se quedan callados, verifica que la URL dentro del <code className="text-[#ff4655]">$(urlfetch)</code> termine explícitamente en <code className="text-white bg-white/10 px-1 rounded">?format=text</code>.
                </p>
              </div>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-5 rounded-xl shadow-inner flex gap-4 items-start">
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                <iconify-icon icon="solar:hourglass-linear" width="18"></iconify-icon>
              </div>
              <div>
                <strong className="text-sm text-white block mb-1.5">Demasiadas peticiones (429)</strong>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Para proteger los servidores, si hay mucho spam en el chat o muchas personas usan el comando al mismo tiempo exacto, se aplica un bloqueo temporal. Solo espera un minuto y volverá a funcionar.
                </p>
              </div>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-5 rounded-xl shadow-inner flex gap-4 items-start">
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 mt-0.5">
                <iconify-icon icon="solar:server-square-linear" width="18"></iconify-icon>
              </div>
              <div>
                <strong className="text-sm text-white block mb-1.5">Error de servidor (500) o Timeout</strong>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  En ocasiones, los servidores oficiales de Riot Games se caen, se saturan o entran en mantenimiento. Si ves este error, el problema no es tu comando; suele solucionarse solo al cabo de unas horas.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
