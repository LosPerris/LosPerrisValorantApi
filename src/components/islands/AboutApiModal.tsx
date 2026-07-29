import { useStore } from '@nanostores/react';
import { isAboutModalOpen } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import { cn } from '../../utils/cn';

const FEATURES = [
  { icon: 'solar:monitor-camera-bold-duotone', color: '#ff4655', key: 'aboutModalFeature1' },
  { icon: 'solar:chat-round-line-bold-duotone', color: '#ff4655', key: 'aboutModalFeature2' },
  { icon: 'solar:bolt-bold-duotone', color: '#ff4655', key: 'aboutModalFeature3' },
  { icon: 'solar:earth-bold-duotone', color: '#ff4655', key: 'aboutModalFeature4' },
] as const;

export default function AboutApiModal() {
  const isOpen = useStore(isAboutModalOpen);
  const t = useTranslations();

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal={isOpen}
      aria-labelledby="about-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => isAboutModalOpen.set(false)}
      />

      {/* Modal Container — siempre montado para precargar iconos y evitar reflow al abrir */}
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]',
          'bg-[#050505] text-white transition-[opacity,transform] duration-200 ease-out',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]',
        )}
      >
        <div
          className="p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-6">
            <h2
              id="about-modal-title"
              className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3 min-w-0 flex-1"
            >
              <span className="w-10 h-10 shrink-0 rounded-full bg-[#ff4655]/10 flex items-center justify-center text-[#ff4655]">
                <iconify-icon icon="solar:info-circle-bold" width="24" height="24" className="block" />
              </span>
              <span className="min-w-0">{t('aboutModalTitle')}</span>
            </h2>
            <button
              type="button"
              onClick={() => isAboutModalOpen.set(false)}
              tabIndex={isOpen ? 0 : -1}
              className="shrink-0 w-8 h-8 text-[#ff4655] hover:text-[#ff5c6a] transition-colors bg-[#ff4655]/10 rounded-full flex items-center justify-center"
              aria-label={t('closeModal')}
            >
              <iconify-icon icon="solar:close-circle-bold" width="26" height="26" className="block" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-neutral-300 mb-6 leading-relaxed">
            {t('aboutModalDesc')}
            <span className="font-semibold text-amber-400">{t('aboutModalHighlight')}</span>
          </p>

          {/* Features */}
          <div className="bg-[#111] rounded-xl p-5 border border-white/5 shadow-inner mb-6">
            <h3 className="text-[10px] font-bold text-[#ff4655] mb-3 uppercase tracking-wider">
              {t('aboutModalFeaturesTitle')}
            </h3>
            <ul className="space-y-3">
              {FEATURES.map((feature) => (
                <li key={feature.key} className="flex items-start gap-3 text-sm text-neutral-300">
                  <span
                    className="inline-flex w-5 h-5 shrink-0 items-center justify-center mt-0.5"
                    style={{ color: feature.color }}
                  >
                    <iconify-icon icon={feature.icon} width="20" height="20" className="block" />
                  </span>
                  <span className="min-w-0">{t(feature.key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-center mt-2">
            <a
              href="https://github.com/Henrik-3/unofficial-valorant-api"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isOpen ? 0 : -1}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all',
                'bg-[#ff4655] text-white hover:bg-[#ff5c6a] hover:-translate-y-0.5 shadow-[0_8px_20px_-6px_rgba(255,70,85,0.4)]',
              )}
            >
              <span className="inline-flex w-[22px] h-[22px] shrink-0 items-center justify-center">
                <iconify-icon icon="mdi:github" width="22" height="22" className="block" />
              </span>
              {t('aboutModalLinkText')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
