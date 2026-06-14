import { useTranslations } from '../../hooks/useTranslations';
import { isAboutModalOpen } from '../../store/appStore';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="relative z-10 border-t border-neutral-900 py-8 text-center px-6">
      <p className="text-xs text-neutral-400 flex flex-wrap justify-center items-center gap-1.5">
        <span>© 2026 LosPerris</span>
        <span>·</span>
        <span>{t('footerBy')} <a href="https://www.instagram.com/ponss_jean/" target="_blank" rel="noopener noreferrer" style={{ color: '#ff4655' }} className="font-semibold hover:underline">Ponss17</a></span>
        <span>·</span>
        <span>{t('footerExt')}</span>
        <button 
          onClick={() => isAboutModalOpen.set(true)}
          className="inline-flex items-center gap-1 font-semibold hover:underline transition-colors cursor-pointer shrink-0"
          style={{ color: '#ff4655' }}
        >
          HenrikDev API <iconify-icon icon="solar:info-circle-bold"></iconify-icon>
        </button>
      </p>
    </footer>
  );
}
