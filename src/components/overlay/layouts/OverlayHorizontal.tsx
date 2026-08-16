import type { OverlayConfig, OverlayData } from '../hooks/useOverlayData';
import { getBgClasses, getSizeClasses, getCommonStyles } from '../utils';
import { useNumberCounter } from '../hooks/useNumberCounter';
import { useResultSequence } from '../hooks/useResultText';
import { PokemonStatEffect } from './PokemonStatEffect';

export function OverlayHorizontal({ config, data, animationType, lang = 'es' }: { config: OverlayConfig; data: OverlayData; animationType: 'up' | 'down' | 'tier-up' | 'tier-down' | null; lang?: string }) {
  const bgClasses = getBgClasses(config);
  const sizeClasses = getSizeClasses(config);
  const styles = getCommonStyles(config, data);
  const animatedRR = useNumberCounter(data.rr, 3000, animationType ? 3000 : 0);

  const isCompact = config.layout === 'compact';
  const innerPad = config.bg === 'none' ? 'py-1' : 'py-2';

  const { fixedText, randomText, phase } = useResultSequence(animationType, lang);

  const iconEl = config.showRankIcon && (
    <div className="relative shrink-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/5 blur-xl rounded-full"></div>
      <img
        key={data.tier}
        src={data.iconUrl}
        alt={data.tierName}
        width={isCompact ? 48 : 64}
        height={isCompact ? 48 : 64}
        loading="eager"
        className={`${isCompact ? 'w-12 h-12' : 'w-16 h-16'} object-contain relative z-10 drop-shadow-lg ${animationType ? 'animate-icon-restructure' : 'animate-bounce-pop'}`}
      />
    </div>
  );

  return (
    <div className={`relative overflow-hidden w-fit h-fit flex items-center gap-4 ${bgClasses} ${sizeClasses}`} style={styles.bgInlineStyle}>
      
      {/* Front Cover (Integrated Result Panel) */}
      <div 
        className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none rounded-[inherit] overflow-hidden
        ${animationType ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          background: config.bg === 'none' ? 'transparent' : (animationType === 'up' || animationType === 'tier-up') 
            ? 'linear-gradient(135deg, rgba(22,163,74,0.95), rgba(20,83,45,0.98))' 
            : (animationType === 'down' || animationType === 'tier-down') 
              ? 'linear-gradient(135deg, rgba(220,38,38,0.95), rgba(127,29,29,0.98))'
              : 'transparent',
          backdropFilter: config.bg === 'none' ? 'none' : 'blur(12px)',
          boxShadow: config.bg === 'none' ? 'none' : 'inset 0 0 30px rgba(0,0,0,0.8)'
        }}
      >
        {config.bg !== 'none' && <div className={`absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay`}></div>}
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {phase !== 'idle' && <PokemonStatEffect type={(animationType === 'up' || animationType === 'tier-up') ? 'up' : 'down'} />}
          {phase === 'fixed' && (
            <span className={`font-black text-2xl uppercase tracking-[0.4em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-white animate-zoom-in`}
              style={config.bg === 'none' ? { textShadow: (animationType === 'up' || animationType === 'tier-up') ? '0 0 20px rgba(34,197,94,0.8), 0 4px 10px rgba(0,0,0,1)' : '0 0 20px rgba(239,68,68,0.8), 0 4px 10px rgba(0,0,0,1)', color: (animationType === 'up' || animationType === 'tier-up') ? '#4ade80' : '#f87171' } : {}}>
              {fixedText}
            </span>
          )}
          {phase === 'random' && (
            <span className={`font-black text-2xl uppercase tracking-[0.4em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-white animate-pop-in`}
              style={config.bg === 'none' ? { textShadow: (animationType === 'up' || animationType === 'tier-up') ? '0 0 20px rgba(34,197,94,0.8), 0 4px 10px rgba(0,0,0,1)' : '0 0 20px rgba(239,68,68,0.8), 0 4px 10px rgba(0,0,0,1)', color: (animationType === 'up' || animationType === 'tier-up') ? '#4ade80' : '#f87171' } : {}}>
              {randomText}
            </span>
          )}
        </div>
      </div>

      <div className={`w-fit flex items-center gap-4 transition-opacity duration-700 ease-in-out ${animationType ? 'opacity-0' : 'opacity-100 delay-300'}`}>
        {config.iconPosition !== 'right' && iconEl}

        <div className={`flex flex-col pr-2 justify-center ${!config.showRankIcon ? 'pl-2' : ''} ${innerPad}`} style={config.bg === 'none' ? { textShadow: '0 2px 10px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)' } : {}}>

        {/* Watermark */}
        <span className="text-[8px] text-[#ff4655] font-black tracking-widest mb-0.5 select-none drop-shadow-[0_0_5px_rgba(255,70,85,0.4)]">
          LosPerris
        </span>

        {/* Name and Tag */}
        {config.showName && (
          <div className="flex items-center gap-2 mb-0.5 relative">
            <h1 className="font-black text-lg tracking-wide leading-none drop-shadow-md transition-all duration-300" style={styles.nameStyle}>{data.name}</h1>
            <span className="text-neutral-300 text-[11px] font-semibold">#{data.tag}</span>
          </div>
        )}

        {/* Rank Label (Only in Full/Banner) */}
        {!isCompact && config.showRankLabel && (
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 transition-colors duration-500 ${animationType === 'tier-up' ? 'animate-text-promote' : ''}`} style={{ color: styles.currentRankColor }}>
            {data.tierName}
          </span>
        )}

        {/* RR and Badge row */}
        <div className="flex items-center gap-2.5 min-w-[110px]">
          {config.showRR && (
            <div className="flex items-baseline gap-1" style={{ color: config.rrColor === 'auto' ? styles.currentRankColor : config.rrColor }}>
              <span className={`${isCompact ? 'text-xl' : 'text-2xl'} font-black leading-none tracking-tight`}>
                {animatedRR}
              </span>
              <span className="text-xs font-bold">RR</span>
            </div>
          )}

          {config.showLastMatch && (
            <div className={`flex items-center gap-1 font-bold text-xs bg-black/40 px-2 py-0.5 rounded-md border border-white/5 shadow-sm transition-colors duration-500 ${styles.changeColorClass}`} style={styles.badgeColorStyle}>
              {styles.isWin && <iconify-icon icon="solar:round-alt-arrow-up-bold"></iconify-icon>}
              {styles.isLoss && <iconify-icon icon="solar:round-alt-arrow-down-bold"></iconify-icon>}
              {!styles.isWin && !styles.isLoss && <iconify-icon icon="solar:minus-circle-bold"></iconify-icon>}
              <span>{styles.changeSign}{data.lastChange}</span>
            </div>
          )}
        </div>

      </div>
      
      {config.iconPosition === 'right' && iconEl}
      </div>
      {/* Full-width Progress Bar at the bottom */}
      {config.showProgressBar && (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5 z-10">
          <div
            className="absolute left-0 top-0 h-full w-full transition-all duration-1000 ease-out"
            style={{
              background: config.progressColor === 'auto' ? styles.autoGradient : config.progressColor,
              clipPath: `inset(0 ${100 - Math.min(animatedRR, 100)}% 0 0)`
            }}
          />
        </div>
      )}
    </div>
  );
}
