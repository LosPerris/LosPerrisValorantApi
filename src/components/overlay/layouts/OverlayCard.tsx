import type { OverlayConfig, OverlayData } from '../hooks/useOverlayData';
import { getBgClasses, getSizeClasses, getCommonStyles } from '../utils';
import { useNumberCounter } from '../hooks/useNumberCounter';

export function OverlayCard({ config, data }: { config: OverlayConfig; data: OverlayData }) {
  const bgClasses = getBgClasses(config);
  const sizeClasses = getSizeClasses(config);
  const styles = getCommonStyles(config, data);
  const animatedRR = useNumberCounter(data.rr, 1500); // 1.5s animation

  const innerPad = config.bg === 'none' ? 'p-2' : 'p-2.5';

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden min-w-[180px] ${bgClasses} ${sizeClasses}`} style={styles.bgInlineStyle}>
      
      {/* Glow de fondo si tiene bg */}
      {config.bg !== 'none' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 blur-3xl pointer-events-none" style={{ background: styles.currentRankColor }}></div>
      )}

      <div className={`relative z-10 flex flex-col items-center w-full ${innerPad} pb-2`}>
        
        {/* Watermark */}
        <span className="text-[6px] text-white/60 font-black uppercase tracking-[0.2em] mb-1.5 select-none drop-shadow-sm">
          LosPerris
        </span>

        {/* Header: Name + Tag */}
        {config.showName && (
          <div className="flex flex-col items-center mb-1.5 text-center leading-none">
            <h1 className="font-black text-base tracking-tight drop-shadow-md transition-all duration-300" style={styles.nameStyle}>{data.name}</h1>
            <span className="text-neutral-400 text-[8px] font-bold bg-white/10 px-1 py-0.5 rounded text-center mt-1 shadow-inner">#{data.tag}</span>
          </div>
        )}

        {/* Icon */}
        {config.showRankIcon && (
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-[1.2]"></div>
            <img 
              key={data.tier}
              src={data.iconUrl} 
              alt={data.tierName}
              width={48}
              height={48}
              loading="eager"
              className="w-12 h-12 object-contain relative z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] animate-bounce-pop"
            />
          </div>
        )}

        {/* Rank Label */}
        {config.showRankLabel && (
          <span className="text-[9px] font-black uppercase tracking-widest mt-1 drop-shadow-md transition-colors duration-500" style={{ color: styles.currentRankColor }}>
            {data.tierName}
          </span>
        )}

        {/* RR Info */}
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          {config.showRR && (
            <div className="flex items-baseline gap-0.5" style={{ color: config.rrColor === 'auto' ? styles.currentRankColor : config.rrColor }}>
              <span className="text-xl font-black leading-none tracking-tighter drop-shadow-md">
                {animatedRR}
              </span>
              <span className="text-[8px] font-bold drop-shadow-md">RR</span>
            </div>
          )}
          
          {config.showLastMatch && (
            <div className={`flex items-center gap-0.5 font-black text-[8px] bg-black/40 px-1 py-0.5 rounded shadow-inner border border-white/10 transition-colors duration-500 ${styles.changeColorClass}`} style={styles.badgeColorStyle}>
              {styles.isWin && <iconify-icon icon="solar:round-alt-arrow-up-bold"></iconify-icon>}
              {styles.isLoss && <iconify-icon icon="solar:round-alt-arrow-down-bold"></iconify-icon>}
              {!styles.isWin && !styles.isLoss && <iconify-icon icon="solar:minus-circle-bold"></iconify-icon>}
              <span>{styles.changeSign}{data.lastChange}</span>
            </div>
          )}
        </div>
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
