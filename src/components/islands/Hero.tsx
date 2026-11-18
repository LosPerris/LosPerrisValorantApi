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
          <p className="text-[11px] font-medium text-[#ff4655]">{t('heroBadge')}</p>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            LOSPERRIS <span className="text-[#ff4655] font-normal">API</span>
          </h1>
          <p className="text-xs text-neutral-500">
            {t('subtitle')}
          </p>
        </div>

        <a
          href="/docs"
          className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-[#ff4655] transition-colors"
        >
          {t('docsBtn')} →
        </a>
      </section>
    );
  }

  return (
    <section className="relative z-10 w-full flex flex-col items-center justify-center text-center gap-4 py-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-[12px] font-medium text-[#ff4655]">{t('heroBadge')}</p>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mt-1 text-white">
          LOSPERRIS <span className="text-[#ff4655] font-light">API</span>
        </h1>

        <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto mt-2">
          {t('subtitle')}
        </p>
      </div>

      <p className="text-xs text-neutral-400 mt-1">
        {t('heroRealtime')}
        <span className="mx-2 text-neutral-600">·</span>
        {t('heroCommands')}
        <span className="mx-2 text-neutral-600">·</span>
        {t('heroRegion')}
      </p>
    </section>
  );
}
