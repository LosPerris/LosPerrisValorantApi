import { useState, useEffect } from 'react';

type Cmd = {
  id: string;
  label: string;
  icon: string;
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
    path: '/api/rank/na/PonssLoveless/8882',
    query: '?format=text',
    what: 'Dice tu rango actual (ideal para !rank).',
    chatExample: 'Actualmente estoy en Ascendente 2 con 50 puntos',
    detail: 'Estilos: default · clean · custom. type 1–3 = detalle.',
  },
  {
    id: 'match',
    label: 'Última partida',
    icon: 'solar:gamepad-linear',
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
    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden mt-3">
      <div className="flex items-center justify-between gap-3 px-3 py-1.5 border-b border-white/5">
        <span className="text-[10px] uppercase tracking-wide font-semibold text-neutral-400">
          Pega esto en tu bot
        </span>
        <button
          type="button"
          onClick={copy}
          className="text-[10px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer border"
          style={{
            background: copied ? 'rgba(34,197,94,0.1)' : 'transparent',
            color: copied ? '#4ade80' : '#ff4655',
            borderColor: copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,70,85,0.5)',
          }}
        >
          {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
      <div className="p-3 font-mono text-[12px] text-neutral-300 leading-relaxed break-all">
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
    <div className="flex flex-col gap-5 pb-8">
      <div>
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-[#ff4655] transition-colors"
        >
          <iconify-icon icon="solar:alt-arrow-left-linear" width="14"></iconify-icon>
          Volver al panel
        </a>
      </div>

      <section className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 md:p-5">
        <p className="text-[12px] font-medium text-[#ff4655] mb-1.5">Para streamers</p>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
          Guía de comandos
        </h1>
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-4">
          Copia el comando y pégalo en Nightbot, StreamElements u otro bot con{' '}
          <code className="text-[#ff4655]">$(urlfetch)</code>.
        </p>

        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
          {[
            { n: '1', t: 'Busca tu cuenta', d: 'Riot ID y región en el panel.' },
            { n: '2', t: 'Elige el comando', d: 'Rango, partida o stats.' },
            { n: '3', t: 'Copia y pega', d: 'Como respuesta del bot.' },
          ].map((step) => (
            <li key={step.n} className="border border-white/5 rounded-lg p-3 bg-[#111]">
              <span className="text-[#ff4655] font-semibold mr-1.5">{step.n}.</span>
              <span className="text-white font-medium">{step.t}</span>
              <p className="text-neutral-500 mt-1 leading-relaxed">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-white">Endpoints</h2>

        {COMMANDS.map((cmd) => (
          <section
            key={cmd.id}
            id={cmd.id}
            className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 scroll-mt-20"
          >
            <div className="flex items-start gap-2.5 mb-3">
              <iconify-icon icon={cmd.icon} width="18" className="text-[#ff4655] shrink-0 mt-0.5"></iconify-icon>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white tracking-tight">{cmd.label}</h3>
                <p className="text-[12px] text-neutral-400 mt-0.5">{cmd.what}</p>
              </div>
            </div>

            <div className="mb-1">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide block mb-1.5">
                Ejemplo en chat
              </span>
              <div className="bg-[#111] border border-white/5 px-3 py-2.5 rounded-lg">
                <p className="text-[12px] text-neutral-300 leading-relaxed">
                  <span className="text-neutral-500 font-medium mr-1.5">Nightbot</span>
                  {cmd.chatExample}
                </p>
              </div>
            </div>

            <BotCopyBox siteUrl={siteUrl} path={cmd.path} query={cmd.query} />

            <p className="mt-3 pt-3 border-t border-white/5 text-[11px] text-neutral-500">
              {cmd.detail}
            </p>
          </section>
        ))}
      </div>

      <section id="problemas" className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <iconify-icon icon="solar:danger-triangle-linear" width="16" className="text-[#ff4655]"></iconify-icon>
          Resolución de problemas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: 'Jugador no encontrado (404)',
              body: 'Revisa región e ID. El tag va sin el símbolo #.',
            },
            {
              title: 'El bot no responde',
              body: 'La URL debe terminar en ?format=text dentro del $(urlfetch).',
            },
            {
              title: 'Demasiadas peticiones (429)',
              body: 'Bloqueo temporal por spam. Espera un minuto.',
            },
            {
              title: 'Error 500 o timeout',
              body: 'Suele ser Riot/Henrik. Normalmente se recupera solo.',
            },
          ].map((item) => (
            <div key={item.title} className="border border-white/5 rounded-lg p-3 bg-[#111]">
              <strong className="text-[12px] text-white block mb-1">{item.title}</strong>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
