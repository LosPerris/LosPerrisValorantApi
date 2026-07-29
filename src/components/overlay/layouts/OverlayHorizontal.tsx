import type { OverlayConfig, OverlayData } from '../hooks/useOverlayData';
import { getBgClasses, getSizeClasses, getCommonStyles } from '../utils';
import { useNumberCounter } from '../hooks/useNumberCounter';

export function OverlayHorizontal({ config, data }: { config: OverlayConfig; data: OverlayData }) {
  const bgClasses = getBgClasses(config);
  const sizeClasses = getSizeClasses(config);
  const styles = getCommonStyles(config, data);
  const animatedRR = useNumberCounter(data.rr, 1500);

  const isCompact = config.layout === 'compact';
  const innerPad = config.bg === 'none' ? 'py-1' : 'py-2';

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
        className={`${isCompact ? 'w-12 h-12' : 'w-16 h-16'} object-contain relative z-10 drop-shadow-lg animate-bounce-pop`}
      />
    </div>
  );

  return (
    <div className={`relative overflow-hidden w-fit h-fit flex items-center gap-4 ${bgClasses} ${sizeClasses}`} style={styles.bgInlineStyle}>
      {config.iconPosition !== 'right' && iconEl}
      
      <div className={`flex flex-col pr-2 justify-center ${!config.showRankIcon ? 'pl-2' : ''} ${innerPad}`} style={config.bg === 'none' ? { textShadow: '0 2px 10px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)' } : {}}>
        
        {/* Watermark */}
        <span className="text-[6px] text-white/50 font-black uppercase tracking-[0.2em] mb-0.5 select-none drop-shadow-sm">
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
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1 transition-colors duration-500" style={{ color: styles.currentRankColor }}>
            {data.tierName}
          </span>
        )}
        
        {/* RR and Badge row */}
        <div className="flex items-center gap-2.5">
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
