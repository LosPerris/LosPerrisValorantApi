import { useStore } from '@nanostores/react';
import { useTranslations } from '../../hooks/useTranslations';
import { hasSearched } from '../../store/appStore';

export default function Hero() {
  const t = useTranslations();
  const searched = useStore(hasSearched);

  if (searched) {
    return (
      <section className="relative z-10 w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#ff4655] px-2 py-0.5 rounded-full border border-[#ff4655]/30 bg-[#ff4655]/5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655] shadow-[0_0_5px_#ff4655]"></span>
            {t('heroBadge')}
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            LOSPERRIS <span className="text-[#ff4655] font-normal">API</span>
          </h1>
          <p className="text-xs text-neutral-500">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111] border border-white/10 text-neutral-300">
            <iconify-icon icon="solar:bolt-linear" width="12" className="text-[#ff4655]"></iconify-icon> {t('heroRealtime')}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111] border border-white/10 text-neutral-300">
            <iconify-icon icon="solar:command-linear" width="12" className="text-[#ff4655]"></iconify-icon> {t('heroCommands')}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111] border border-white/10 text-neutral-300">
            <iconify-icon icon="solar:global-linear" width="12" className="text-[#ff4655]"></iconify-icon> {t('heroRegion')}
          </div>
          <a href="/docs" className="ml-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-black font-medium hover:bg-neutral-200 transition-colors">
            <iconify-icon icon="solar:document-text-bold" width="12"></iconify-icon> {t('docsBtn')}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 w-full flex flex-col items-center justify-center text-center gap-4 py-8">
      <div className="flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#ff4655] px-3 py-1 rounded-full border border-[#ff4655]/30 bg-[#ff4655]/5 shadow-[0_0_10px_rgba(255,70,85,0.1)] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655] shadow-[0_0_5px_#ff4655]"></span>
          {t('heroBadge')}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mt-2 text-white">
          LOSPERRIS <span className="text-[#ff4655] font-light">API</span>
        </h1>
        
        <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto mt-2">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-white font-medium">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ff4655]/20 bg-[#ff4655]/5 shadow-[0_0_10px_rgba(255,70,85,0.1)]">
          <iconify-icon icon="solar:bolt-linear" width="14" className="text-[#ff4655]"></iconify-icon> {t('heroRealtime')}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ff4655]/20 bg-[#ff4655]/5 shadow-[0_0_10px_rgba(255,70,85,0.1)]">
          <iconify-icon icon="solar:command-linear" width="14" className="text-[#ff4655]"></iconify-icon> {t('heroCommands')}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ff4655]/20 bg-[#ff4655]/5 shadow-[0_0_10px_rgba(255,70,85,0.1)]">
          <iconify-icon icon="solar:global-linear" width="14" className="text-[#ff4655]"></iconify-icon> {t('heroRegion')}
        </div>
      </div>
    </section>
  );
}
