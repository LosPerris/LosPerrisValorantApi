import { useStore } from '@nanostores/react';
import { useTranslations } from '../../hooks/useTranslations';

export default function Hero() {
  const t = useTranslations();

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 md:pt-14 pb-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
      <div className="text-center lg:text-left" data-mask-wrap="true">
        <div data-mask="true" style={{background:'#15151a',border:'1px solid #2a2a30', transitionDelay: '100ms'}} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-400 mb-7 hover:border-[#ff4655]/40 hover:text-white hover:bg-[#ff4655]/10 transition-all cursor-default">
          <span style={{background:'#ff4655',boxShadow:'0 0 8px #ff4655'}} className="w-1.5 h-1.5 rounded-full animate-pulse"></span>
          {t('heroBadge')}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02]">
          <span className="text-white block" data-mask="true" style={{transitionDelay: '200ms'}}>LOSPERRIS</span>
          <span style={{background:'linear-gradient(120deg,#ff8a93,#ff4655)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent', transitionDelay: '300ms'}} className="block" data-mask="true">VALORANT API</span>
        </h1>
        <p data-mask="true" style={{transitionDelay: '400ms'}} className="mt-5 text-base md:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0">
          {t('subtitle')}
        </p>
        <div data-mask="true" style={{transitionDelay: '500ms'}} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs">
          <div style={{background:'#121215',border:'1px solid #2a2a30'}} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-neutral-400">
            <iconify-icon icon="solar:bolt-linear" width="14" className="text-[#ff4655]"></iconify-icon> {t('heroRealtime')}
          </div>
          <div style={{background:'#121215',border:'1px solid #2a2a30'}} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-neutral-400">
            <iconify-icon icon="solar:command-linear" width="14" className="text-[#a970ff]"></iconify-icon> {t('heroCommands')}
          </div>
          <div style={{background:'#121215',border:'1px solid #2a2a30'}} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-neutral-400">
            <iconify-icon icon="solar:global-linear" width="14" className="text-[#22c55e]"></iconify-icon> {t('heroRegion')}
          </div>
        </div>
        <div data-mask="true" style={{transitionDelay: '600ms'}} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <a href="#busqueda" style={{background:'linear-gradient(135deg,#ff4655,#e0303f)',boxShadow:'0 12px 32px -10px rgba(255,70,85,0.75)'}} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff4655]/30 active:scale-[0.99] transition-all duration-300">
            <iconify-icon icon="solar:magnifer-linear" width="16"></iconify-icon> {t('heroBtn')}
          </a>
          <a href="/docs" style={{background:'#15151a',border:'1px solid #2a2a30'}} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-neutral-300 font-semibold text-sm hover:text-white hover:border-neutral-600 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
            <iconify-icon icon="solar:document-text-linear" width="16"></iconify-icon> {t('docsBtn')}
          </a>
        </div>
      </div>

      {/* HERO PREVIEW PANEL */}
      <div data-reveal="true" className="opacity-0" style={{borderRadius:'22px',padding:'1.5px',background:'linear-gradient(135deg,rgba(255,70,85,0.8),rgba(26,26,31,0.5) 38%,rgba(26,26,31,0.5) 62%,rgba(169,112,255,0.8))',boxShadow:'0 40px 90px -30px rgba(255,70,85,0.28),0 30px 60px -30px rgba(0,0,0,0.9)', transitionDelay: '200ms'}}>
        <div style={{background:'linear-gradient(180deg,#16161c,#0c0c0f)',borderRadius:'21px'}} className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full" style={{background:'#ff5f57'}}></span>
            <span className="w-2.5 h-2.5 rounded-full" style={{background:'#febc2e'}}></span>
            <span className="w-2.5 h-2.5 rounded-full" style={{background:'#28c840'}}></span>
            <span className="ml-2 text-[10px] font-mono text-neutral-500">overlay · live</span>
          </div>
          <div style={{background:"url('/imgs/hero_card.webp') center / cover no-repeat",borderRadius:'14px'}} className="overflow-hidden">
            <div style={{background:'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'}} className="p-5 flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center shrink-0">
                <img src="/imgs/ascendant2.webp" className="w-full h-full object-contain drop-shadow-xl" alt="Ascendente 2" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">PonssLoveless <span className="text-neutral-400">#8882</span></p>
                <p className="text-[11px] text-white/90">Ascendente 2 · <span className="text-neutral-200">1750 ELO</span> <span className="text-green-400 font-semibold">+22</span></p>
              </div>
              <span style={{background:'#ff4655'}} className="text-[9px] font-bold px-2 py-0.5 rounded text-white">LIVE</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-white tracking-tight">1750</p>
              <p className="text-[9px] text-neutral-400 uppercase tracking-wide">MMR</p>
            </div>
            <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-green-400 tracking-tight">60%</p>
              <p className="text-[9px] text-neutral-400 uppercase tracking-wide">{t('toNext')}</p>
            </div>
            <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-teal-400 tracking-tight">60</p>
              <p className="text-[9px] text-neutral-400 uppercase tracking-wide">{t('points')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
