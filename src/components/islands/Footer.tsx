import { useTranslations } from '../../hooks/useTranslations';
import { isAboutModalOpen } from '../../store/appStore';

interface FooterProps {
  /** Desplaza el footer cuando hay sidebar fija (docs) */
  withSidebar?: boolean;
}

export default function Footer({ withSidebar = false }: FooterProps) {
  const t = useTranslations();

  return (
    <footer
      className={`relative z-10 py-8 text-center px-6 ${withSidebar ? 'lg:ml-[280px]' : ''}`}
    >
      <p className="text-xs text-neutral-400 flex flex-wrap justify-center items-center gap-1.5">
        <span>
          © {new Date().getFullYear()} Los
          <span className="text-[#ff4655] font-semibold">Perris</span>
        </span>
        <span>·</span>
        <span>
          {t('footerBy')}{' '}
          <a
            href="https://www.instagram.com/ponss_jean/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ff4655' }}
            className="font-semibold hover:underline"
          >
            Ponss17
          </a>
        </span>
        <span>·</span>
        <span>{t('footerExt')}</span>
        <button
          type="button"
          onClick={() => isAboutModalOpen.set(true)}
          className="inline-flex items-center gap-1 font-semibold hover:underline transition-colors cursor-pointer shrink-0"
          style={{ color: '#ff4655' }}
        >
          HenrikDev API <iconify-icon icon="solar:info-circle-bold"></iconify-icon>
        </button>
      </p>
      <p className="mt-2 text-[11px] text-neutral-500 max-w-xl mx-auto">
        {t('footerDisclaimer')}
      </p>
    </footer>
  );
}
