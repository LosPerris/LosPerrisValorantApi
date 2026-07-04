import { useStore } from '@nanostores/react';
import { playerData, hasSearched, lang } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import SectionHeader from '../ui/SectionHeader';
import { translateRank } from '../../services/formatService';

export default function PlayerResults() {
  const currentLang = useStore(lang);
  const data = useStore(playerData);
  const searched = useStore(hasSearched);
  const t = useTranslations();

  if (!searched || !data) return null;

  const getCardImageUrl = () => {
    const defaultImage = 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d14dc069-558a-4c51-8aad-5cc237f9b61d_1600w.jpg';
    if (!data.account?.card) return defaultImage;
    if (typeof data.account.card === "string") {
      return `https://media.valorant-api.com/playercards/${data.account.card}/wideart.png`;
    }
    return (data.account.card as { wide?: string })?.wide || defaultImage;
  };

  return (
    <section id="resultados" className="mt-14 scroll-mt-24 md:pl-14 relative animate-[fadeIn_0.5s_ease-out]">
      <SectionHeader step={2} title={t('resultsTitle')} subtitle={t('resultsSub')} delay="100ms" />

      {data.rank && (
        <div
          data-reveal="true"
          className="opacity-0 mb-6 gradient-border-gold"
          style={{ transitionDelay: '200ms' }}
        >
          <div className="gradient-bg-dark-inner overflow-hidden rounded-[20.5px]">
            <div className="relative min-h-[140px] md:min-h-[160px] overflow-hidden">
              <img
                src={getCardImageUrl()}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-[center_20%] scale-105"
                decoding="async"
                fetchPriority="high"
              />
              {/* Oscurece la zona del texto para legibilidad */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.78) 42%, rgba(8,8,10,0.35) 72%, rgba(8,8,10,0.2) 100%), linear-gradient(180deg, rgba(8,8,10,0.25) 0%, transparent 40%, rgba(8,8,10,0.55) 100%)',
                }}
              />
              <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
                <img
                  src={data.rank.rank_image}
                  width="64"
                  height="64"
                  className="shrink-0 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-semibold tracking-tight text-white truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {data.account?.name || 'Player'}
                      <span className="text-white/80 ml-0.5">
                        #{data.account?.tag || '000'}
                      </span>
                    </h3>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md text-white bg-[#ff4655] shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                      {translateRank(data.rank.current_tier_patched, currentLang)}
                    </span>
                    {data.match && data.match.derived?.is_win && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 text-white bg-[#16a34a] border border-[#4ade80]/50 shadow-[0_2px_10px_rgba(22,163,74,0.55)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                        En racha
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    <span className="flex items-center gap-1.5 text-neutral-100">
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                      {data.rank.elo} ELO
                    </span>
                    <span
                      className={`font-semibold ${
                        (data.rank.mmr_change_to_last_game || 0) > 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {(data.rank.mmr_change_to_last_game || 0) > 0 ? '+' : ''}
                      {data.rank.mmr_change_to_last_game}
                    </span>
                  </div>
                  <div className="h-2 rounded-full mt-3 overflow-hidden max-w-md bg-black/50 border border-white/10">
                    <div
                      style={{
                        background: 'linear-gradient(90deg,#ff8a93,#ff4655)',
                        width: `${data.rank.ranking_in_tier}%`,
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] font-medium max-w-md drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    <span className="text-white/80">
                      {data.rank.ranking_in_tier} / 100 {t('points')}
                    </span>
                    <span className="text-white font-bold">
                      {t('toNext')} {data.rank.ranking_in_tier}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESUMEN + ÚLTIMA PARTIDA */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* QUICK STATS */}
        <div data-reveal="true" className="opacity-0 gradient-border-blue" style={{transitionDelay: '300ms'}}>
          <div className="gradient-bg-dark p-6 h-full">
          <div className="flex items-center gap-2.5 mb-5">
            <div style={{background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.3)'}} className="w-9 h-9 rounded-lg flex items-center justify-center">
              <iconify-icon icon="solar:graph-up-linear" width="16" className="text-[#22c55e]"></iconify-icon>
            </div>
            <h3 className="font-semibold text-base tracking-tight text-white">{t('quickStats')}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="rounded-xl p-4">
              <p className="text-2xl font-semibold text-white tracking-tight">{data.rank?.elo || 0}</p>
              <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wide">{t('currentMmr')}</p>
            </div>
            <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="rounded-xl p-4">
              <p className={`text-2xl font-semibold tracking-tight ${(data.rank?.mmr_change_to_last_game || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(data.rank?.mmr_change_to_last_game || 0) > 0 ? '+' : ''}{data.rank?.mmr_change_to_last_game || 0}
              </p>
              <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wide">{t('lastWin')}</p>
            </div>
            <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="rounded-xl p-4">
              <p className="text-2xl font-semibold text-white tracking-tight">{data.rank?.ranking_in_tier || 0}%</p>
              <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wide">{t('toRankUp')}</p>
            </div>
            <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="rounded-xl p-4">
              <p className="text-2xl font-semibold text-amber-400 tracking-tight truncate">{translateRank(data.rank?.current_tier_patched || '', currentLang) || 'N/A'}</p>
              <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wide">{t('rankLabel')}</p>
            </div>
            </div>
          </div>
        </div>

        {/* LAST MATCH */}
        {data.match ? (
        <div data-reveal="true" className={`opacity-0 flex flex-col h-full relative ${data.match.derived?.is_win ? 'gradient-border-match-win' : 'gradient-border-match-loss'}`} style={{transitionDelay: '300ms'}}>
          <div style={{borderRadius:'20.5px', background:'linear-gradient(180deg,#16161b,#0e0e11)'}} className="p-5 md:p-6 h-full flex flex-col justify-between relative overflow-hidden group">
            {data.match.derived?.map_image && (
              <>
                <img
                  src={data.match.derived.map_image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  decoding="async"
                />
                <div className="absolute inset-0" style={{background:'linear-gradient(90deg, #111115 0%, rgba(17,17,21,0.85) 45%, rgba(17,17,21,0.2) 100%)'}} />
              </>
            )}
            
            <div className="flex items-center gap-3 mb-10 z-10 relative">
              <div style={{background:'rgba(255,70,85,0.15)', border:'1px solid rgba(255,70,85,0.3)'}} className="w-8 h-8 rounded-lg flex items-center justify-center">
                <iconify-icon icon="solar:history-linear" width="16" className="text-[#ff4655]"></iconify-icon>
              </div>
              <h3 className="font-semibold text-base tracking-tight text-white">{t('lastMatch')}</h3>
            </div>
            
            <div className="flex items-end justify-between gap-4 z-10 relative">
              <div>
                <p className="font-bold text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none mb-1.5">{data.match.derived?.map_name}</p>
                <p className={`text-xs font-black tracking-[0.15em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${data.match.derived?.is_win ? 'text-[#4ade80]' : 'text-[#ff4655]'}`}>
                  {data.match.derived?.is_win ? 'VICTORIA' : 'DERROTA'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/60 font-semibold tracking-wider uppercase mt-0.5">KDA</span>
                <p className="text-sm text-white font-bold bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 shadow-lg">{data.match.derived?.kda}</p>
              </div>
            </div>
          </div>
        </div>
        ) : (
        <div data-reveal="true" style={{borderRadius:'22px',padding:'1.5px',background:'linear-gradient(135deg,#a970ff,#16161b 32%,#16161b 64%,#ff4655)',boxShadow:'0 20px 50px -20px rgba(0,0,0,0.85)'}}>
          <div style={{background:'linear-gradient(180deg,#16161b,#0e0e11)',borderRadius:'20.5px'}} className="p-6 h-full flex items-center justify-center text-neutral-400 text-sm">
          {t('noMatches')}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
