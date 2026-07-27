import { useStore } from '@nanostores/react';
import { playerData, hasSearched, lang } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import { translateRank } from '../../services/formatService';

export default function PlayerResults() {
  const currentLang = useStore(lang);
  const data = useStore(playerData);
  const searched = useStore(hasSearched);
  const t = useTranslations();

  if (!searched || !data) return null;

  return (
    <section id="resultados" className="relative animate-[fadeIn_0.5s_ease-out] w-full flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 shrink-0">
          <iconify-icon icon="solar:user-circle-linear" width="16" className="text-[#ff4655]"></iconify-icon>
        </div>
        <div>
          <h2 className="font-semibold text-base tracking-tight text-white leading-none">Resumen de Cuenta</h2>
          <p className="text-[11px] text-neutral-500 mt-1">Estadísticas y rango en tiempo real</p>
        </div>
      </div>

      {data.rank && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-2 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
          
          {/* Card 1: Player Identity */}
          <div className="py-3 sm:py-2 sm:px-4 flex items-center gap-3">
            <img src={data.rank.rank_image} width="40" height="40" className="shrink-0 drop-shadow-md" alt="" />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight leading-none truncate">
                {data.account?.name || 'Player'}
                <span className="text-xs text-white/40 font-medium ml-1">#{data.account?.tag || '000'}</span>
              </h3>
              <p className="text-[10px] text-[#ff4655] font-bold uppercase tracking-wide mt-1.5">
                {translateRank(data.rank.current_tier_patched, currentLang)}
              </p>
            </div>
          </div>
          
          {/* Card 2: Current RR */}
          <div className="py-3 sm:py-2 sm:px-4 flex flex-col justify-center gap-1">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">{t('currentMmr')} ({data.rank.elo})</p>
            <div className="flex items-end gap-1.5 leading-none">
              <span className="text-xl font-bold text-white tracking-tight leading-none">{data.rank.ranking_in_tier}</span>
              <span className="text-[11px] text-neutral-500 font-medium mb-0.5">/ 100 RR</span>
            </div>
            <div className="h-1 rounded-full mt-1.5 overflow-hidden w-full max-w-[80%] bg-[#111] border border-white/5">
              <div style={{ width: `${data.rank.ranking_in_tier}%` }} className="h-full bg-[#ff4655] rounded-full transition-all duration-1000" />
            </div>
          </div>

          {/* Card 3: Last Match MMR */}
          <div className="py-3 sm:py-2 sm:px-4 flex flex-col justify-center">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">{t('lastWin')}</p>
            <div className="flex items-center gap-2">
              <p className={`text-xl font-bold tracking-tight leading-none ${(data.rank?.mmr_change_to_last_game || 0) > 0 ? 'text-green-400' : 'text-neutral-300'}`}>
                {(data.rank?.mmr_change_to_last_game || 0) > 0 ? '+' : ''}{data.rank?.mmr_change_to_last_game || 0}
              </p>
              {(data.rank?.mmr_change_to_last_game || 0) > 0 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-green-400 bg-green-400/10 border border-green-400/20 uppercase tracking-wider">En racha</span>
              )}
            </div>
          </div>

          {/* Card 4: Match Stats */}
          <div className="py-3 sm:py-2 sm:px-4 flex flex-col justify-center">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">{t('lastMatch')}</p>
            {data.match ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate leading-none">{data.match.derived?.map_name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${data.match.derived?.is_win ? 'text-green-400 bg-green-400/10 border border-green-400/20' : data.match.derived?.is_draw ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'}`}>
                    {data.match.derived?.is_win ? 'VICTORIA' : data.match.derived?.is_draw ? 'EMPATE' : 'DERROTA'}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-400 mt-1.5 leading-none">KDA: {data.match.derived?.kda}</p>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">-</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
