import type { OverlayConfig, OverlayData } from '../hooks/useOverlayData';
import { getBgClasses, getSizeClasses, getCommonStyles } from '../utils';
import { useNumberCounter } from '../hooks/useNumberCounter';
import { useResultSequence } from '../hooks/useResultText';
import { OverlayResultCover } from './OverlayResultCover';

export function OverlayBanner({ config, data, animationType, lang = 'es' }: { config: OverlayConfig; data: OverlayData; animationType: 'up' | 'down' | 'tier-up' | 'tier-down' | null; lang?: string }) {
  const bgClasses = getBgClasses(config);
  const sizeClasses = getSizeClasses(config);
  const styles = getCommonStyles(config, data);
  const animatedRR = useNumberCounter(data.rr, 3000, animationType ? 3000 : 0);

  const innerPad = config.bg === 'none' ? 'py-1' : 'py-2';

  const { fixedText, randomText, phase } = useResultSequence(animationType, lang);

  const iconEl = config.showRankIcon && (
    <div className="relative shrink-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/5 blur-xl rounded-full"></div>
      <img
        key={data.tier}
        src={data.iconUrl}
        alt={data.tierName}
        width={56}
        height={56}
        loading="eager"
        className={`w-14 h-14 object-contain relative z-10 drop-shadow-lg ${animationType ? 'animate-icon-restructure' : 'animate-bounce-pop'}`}
      />
    </div>
  );

  return (
    <div className={`w-full min-w-[380px] flex items-center gap-4 ${bgClasses} ${sizeClasses}`} style={styles.bgInlineStyle}>
      
      <OverlayResultCover
        config={config}
        animationType={animationType}
        phase={phase}
        fixedText={fixedText}
        randomText={randomText}
      />

      <div className={`w-full flex items-center gap-4 transition-opacity duration-700 ease-in-out ${animationType ? 'opacity-0' : 'opacity-100 delay-300'}`}>
        {config.iconPosition !== 'right' && iconEl}

        <div className={`flex flex-col flex-1 justify-center ${!config.showRankIcon && config.iconPosition !== 'right' ? 'pl-2' : ''} ${innerPad}`} style={config.bg === 'none' ? { textShadow: '0 2px 10px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)' } : {}}>

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

        {/* Rank Label */}
        {config.showRankLabel && (
          <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500`} style={{ color: styles.currentRankColor }}>
            {data.tierName}
          </span>
        )}

        {/* Progress Bar under Name */}
        {config.showProgressBar && (
          <div className="mt-2 w-full h-1 bg-white/10 rounded-full relative shadow-inner overflow-hidden">
            <div
              className="absolute left-0 top-0 w-full h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                background: config.progressColor === 'auto' ? styles.autoGradient : config.progressColor,
                clipPath: `inset(0 ${100 - Math.min(animatedRR, 100)}% 0 0)`
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col items-end pr-2 border-l border-white/10 pl-4 py-1 relative min-w-[110px]">
        {/* RR row */}
        {config.showRR && (
          <div className="flex items-baseline gap-1" style={{ color: config.rrColor === 'auto' ? styles.currentRankColor : config.rrColor }}>
            <span className="text-2xl font-black leading-none tracking-tight">
              {animatedRR}
            </span>
            <span className="text-[10px] font-bold">RR</span>
          </div>
        )}

        {/* Badge row */}
        {config.showLastMatch && (
          <div className={`flex items-center gap-1 font-bold text-[9px] bg-black/40 px-1.5 py-0.5 rounded border border-white/5 shadow-sm transition-colors duration-500 mt-1 ${styles.changeColorClass}`} style={styles.badgeColorStyle}>
            {styles.isWin && <iconify-icon icon="solar:round-alt-arrow-up-bold"></iconify-icon>}
            {styles.isLoss && <iconify-icon icon="solar:round-alt-arrow-down-bold"></iconify-icon>}
            {!styles.isWin && !styles.isLoss && <iconify-icon icon="solar:minus-circle-bold"></iconify-icon>}
            <span>{styles.changeSign}{data.lastChange}</span>
          </div>
        )}
        </div>
        
        {config.iconPosition === 'right' && iconEl}
      </div>
    </div>
  );
}
