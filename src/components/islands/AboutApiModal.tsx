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
          'relative w-full max-w-lg rounded-xl overflow-hidden border border-white/10',
          'bg-[#0a0a0a] text-white transition-[opacity,transform] duration-200 ease-out',
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
              className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5 min-w-0 flex-1"
            >
              <iconify-icon icon="solar:info-circle-linear" width="20" className="text-[#ff4655] shrink-0" />
              <span className="min-w-0">{t('aboutModalTitle')}</span>
            </h2>
            <button
              type="button"
              onClick={() => isAboutModalOpen.set(false)}
              tabIndex={isOpen ? 0 : -1}
              className="shrink-0 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              aria-label={t('closeModal')}
            >
              <iconify-icon icon="solar:close-circle-linear" width="22" />
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
                'inline-flex items-center gap-2 h-10 px-4 rounded-lg font-semibold text-sm transition-colors',
                'bg-[#ff4655] text-[#0a0a0a] hover:bg-[#ff5c6a]',
              )}
            >
              <iconify-icon icon="mdi:github" width="18" />
              {t('aboutModalLinkText')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
