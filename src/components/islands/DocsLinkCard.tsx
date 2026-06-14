import { useStore } from '@nanostores/react';
import { hasSearched } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import SectionHeader from '../ui/SectionHeader';

export default function DocsLinkCard() {
  const t = useTranslations();
  const searched = useStore(hasSearched);


  if (!searched) return null;

  return (
    <section id="docs" className="mt-14 scroll-mt-24 md:pl-14 relative animate-[fadeIn_0.5s_ease-out]">
      <SectionHeader step={5} title={t('docsTitle')} subtitle={t('docsSub')} />

      <div data-reveal="true" className="gradient-border-red shadow-2xl">
        <div className="gradient-bg-dark p-6 md:p-8 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div style={{background:'rgba(255,70,85,0.12)',border:'1px solid rgba(255,70,85,0.3)'}} className="w-9 h-9 rounded-lg flex items-center justify-center">
                <iconify-icon icon="solar:document-text-linear" width="16" className="text-[#ff4655]"></iconify-icon>
              </div>
              <h3 className="font-semibold text-base tracking-tight text-white">{t('interactiveRef')}</h3>
            </div>
            <div style={{background:'rgba(255,70,85,0.06)',borderLeft:'2px solid #ff4655'}} className="px-4 py-3 rounded-r-lg">
              <p className="text-sm text-neutral-300">
                {t('docsDesc')}
              </p>
            </div>
          </div>
          <a href="./docs" className="btn-gradient-red md:w-auto w-full py-3 px-6 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff4655]/30 active:scale-[0.99] transition-all duration-300 shrink-0">
            <iconify-icon icon="solar:document-text-linear" width="18"></iconify-icon> {t('docsBtn')}
          </a>
        </div>
      </div>
    </section>
  );
}
