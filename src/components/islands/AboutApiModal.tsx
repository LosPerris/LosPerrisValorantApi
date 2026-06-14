import { useStore } from '@nanostores/react';
import { isAboutModalOpen } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import { cn } from '../../utils/cn';

export default function AboutApiModal() {
  const isOpen = useStore(isAboutModalOpen);
  const t = useTranslations();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-[fadeIn_0.3s_ease-out]"
        onClick={() => isAboutModalOpen.set(false)}
      ></div>

      {/* Modal Container */}
      <div 
        className={cn(
          "relative w-full max-w-lg rounded-2xl overflow-hidden border border-[#2a2a30] shadow-2xl animate-[scaleIn_0.3s_ease-out]",
          "bg-[#0a0a0d] text-white"
        )}
      >
        <div style={{background:'linear-gradient(180deg,rgba(14,14,17,0.55),rgba(14,14,17,0.96))'}} className="p-6 md:p-8">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff4655]/10 flex items-center justify-center text-[#ff4655]">
                <iconify-icon icon="solar:info-circle-bold" width="24"></iconify-icon>
              </div>
              {t('aboutModalTitle')}
            </h2>
            <button 
              onClick={() => isAboutModalOpen.set(false)}
              className="text-[#ff4655] hover:text-[#ff5c6a] transition-colors p-1 bg-[#ff4655]/10 rounded-full flex items-center justify-center"
              aria-label={t('closeModal')}
            >
              <iconify-icon icon="solar:close-circle-bold" width="26"></iconify-icon>
            </button>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-neutral-300 mb-6 leading-relaxed">
            {t('aboutModalDesc')}
            <span className="font-semibold text-amber-400">{t('aboutModalHighlight')}</span>
          </p>

          {/* Features */}
          <div className="bg-[#16161b] rounded-xl p-5 border border-white/5 mb-6">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide opacity-90">{t('aboutModalFeaturesTitle')}</h3>
            <ul className="space-y-3">
              {[
                { icon: 'solar:shield-check-bold-duotone', color: '#4ade80', text: t('aboutModalFeature1') },
                { icon: 'solar:bolt-bold-duotone', color: '#fbbf24', text: t('aboutModalFeature2') },
                { icon: 'solar:code-square-bold-duotone', color: '#c084fc', text: t('aboutModalFeature3') },
                { icon: 'solar:earth-bold-duotone', color: '#60a5fa', text: t('aboutModalFeature4') },
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                  <iconify-icon icon={feature.icon} width="20" style={{ color: feature.color, marginTop: '2px' }}></iconify-icon>
                  <span>{feature.text}</span>
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
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                "bg-[#ff4655] text-white hover:bg-[#ff5c6a] hover:-translate-y-0.5 shadow-[0_8px_20px_-6px_rgba(255,70,85,0.4)]"
              )}
            >
              <iconify-icon icon="mdi:github" width="22"></iconify-icon>
              {t('aboutModalLinkText')}
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
