import { useStore } from '@nanostores/react';
import { isApiKeyModalOpen } from '../../store/appStore';
import { cn } from '../../utils/cn';

export default function ApiKeyModal() {
  const isOpen = useStore(isApiKeyModalOpen);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal={isOpen}
      aria-labelledby="apikey-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => isApiKeyModalOpen.set(false)}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]',
          'bg-[#050505] text-white transition-[opacity,transform] duration-200 ease-out',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]',
        )}
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-6">
            <h2
              id="apikey-modal-title"
              className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3 min-w-0 flex-1"
            >
              <span className="w-10 h-10 shrink-0 rounded-full bg-[#ff4655]/10 flex items-center justify-center text-[#ff4655]">
                <iconify-icon icon="solar:key-bold-duotone" width="24" height="24" className="block" />
              </span>
              <span className="min-w-0">Tu propia API Key</span>
            </h2>
            <button
              type="button"
              onClick={() => isApiKeyModalOpen.set(false)}
              tabIndex={isOpen ? 0 : -1}
              className="shrink-0 w-8 h-8 text-[#ff4655] hover:text-[#ff5c6a] transition-colors bg-[#ff4655]/10 rounded-full flex items-center justify-center"
            >
              <iconify-icon icon="solar:close-circle-bold" width="26" height="26" className="block" />
            </button>
          </div>

          {/* Description */}
          <div className="text-sm md:text-base text-neutral-300 space-y-4 leading-relaxed mb-6">
            <p>
              Por defecto, esta página utiliza una API Key global compartida para realizar las consultas a <strong className="text-white">HenrikDev</strong>. Sin embargo, si eres un streamer grande o haces muchas consultas, los comandos podrían dejar de funcionar si se alcanza el límite de nuestra cuota compartida.
            </p>
            <p>
              Para evitarlo, puedes <strong className="text-[#ff4655]">usar tu propia API Key</strong>. Si la configuras:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>El bot usará <strong className="text-white">tus propios límites</strong> (rate limits) privados.</li>
              <li>Tu clave <strong>no se guardará en ninguna base de datos</strong>; solo cruzará como un pase temporal por nuestro sistema para realizar la consulta a HenrikDev con tus propios límites.</li>
              <li>Tus comandos y overlays estarán protegidos contra bloqueos masivos en caso de saturación.</li>
            </ul>
          </div>

          <div className="bg-[#111] rounded-xl p-5 border border-white/5 shadow-inner mb-6">
            <h3 className="text-xs font-bold text-[#ff4655] mb-2 uppercase tracking-wider">
              ¿Cómo obtener tu propia API Key?
            </h3>
            <ol className="list-decimal pl-4 space-y-2 text-sm text-neutral-300">
              <li>
                Entra al Discord oficial de HenrikDev.
              </li>
              <li>
                Ve al canal de comandos o soporte y solicita una API key personal siguiendo sus instrucciones.
              </li>
              <li>
                Pega la clave que te entreguen (ej. <code className="bg-black text-[#ff4655] px-1.5 py-0.5 rounded">HDEV-XXXX...</code>) en el buscador de nuestra página.
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex justify-center mt-2">
            <a
              href="https://discord.com/invite/henrikdev-systems-704231681309278228"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isOpen ? 0 : -1}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold transition-colors w-full justify-center sm:w-auto"
            >
              <iconify-icon icon="ic:baseline-discord" width="24" height="24" />
              Unirse al Discord de HenrikDev
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
