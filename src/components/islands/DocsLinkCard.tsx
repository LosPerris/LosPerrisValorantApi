import { useStore } from '@nanostores/react';
import { hasSearched } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import SectionHeader from '../ui/SectionHeader';

export default function DocsLinkCard() {
  const t = useTranslations();
  const searched = useStore(hasSearched);


  if (!searched) return null;

  return (
    <section id="docs" className="relative animate-[fadeIn_0.5s_ease-out] flex flex-col gap-4">
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5">
                <iconify-icon icon="solar:document-text-linear" width="16" className="text-white"></iconify-icon>
              </div>
              <h3 className="font-medium text-base tracking-tight text-white">{t('interactiveRef')}</h3>
            </div>
            <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/5">
              <p className="text-sm text-neutral-400">
                {t('docsDesc')}
              </p>
            </div>
          </div>
          <a href="/docs" className="md:w-auto w-full py-2.5 px-6 rounded-lg bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shrink-0">
            <iconify-icon icon="solar:document-text-linear" width="18"></iconify-icon> {t('docsBtn')}
          </a>
        </div>
      </div>
    </section>
  );
}
