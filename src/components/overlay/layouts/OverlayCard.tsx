import type { OverlayConfig, OverlayData } from '../hooks/useOverlayData';
import { getBgClasses, getSizeClasses, getCommonStyles } from '../utils';
import { useNumberCounter } from '../hooks/useNumberCounter';
import { useResultSequence } from '../hooks/useResultText';
import { PokemonStatEffect } from './PokemonStatEffect';

export function OverlayCard({ config, data, animationType, lang = 'es' }: { config: OverlayConfig; data: OverlayData; animationType: 'up' | 'down' | 'tier-up' | 'tier-down' | null; lang?: string }) {
  const bgClasses = getBgClasses(config);
  const sizeClasses = getSizeClasses(config);
  const styles = getCommonStyles(config, data);
  const animatedRR = useNumberCounter(data.rr, 3000, animationType ? 3000 : 0); // 3s animation, delayed if showing result

  const innerPad = config.bg === 'none' ? 'p-2' : 'p-2.5';
  
  const { fixedText, randomText, phase } = useResultSequence(animationType, lang);

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden min-w-[180px] ${bgClasses} ${sizeClasses}`} style={styles.bgInlineStyle}>

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
            <span className={`font-black text-xl uppercase tracking-[0.3em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-white animate-zoom-in`}
              style={config.bg === 'none' ? { textShadow: (animationType === 'up' || animationType === 'tier-up') ? '0 0 20px rgba(34,197,94,0.8), 0 4px 10px rgba(0,0,0,1)' : '0 0 20px rgba(239,68,68,0.8), 0 4px 10px rgba(0,0,0,1)', color: (animationType === 'up' || animationType === 'tier-up') ? '#4ade80' : '#f87171' } : {}}>
              {fixedText}
            </span>
          )}
          {phase === 'random' && (
            <span className={`font-black text-xl uppercase tracking-[0.3em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-white animate-pop-in`}
              style={config.bg === 'none' ? { textShadow: (animationType === 'up' || animationType === 'tier-up') ? '0 0 20px rgba(34,197,94,0.8), 0 4px 10px rgba(0,0,0,1)' : '0 0 20px rgba(239,68,68,0.8), 0 4px 10px rgba(0,0,0,1)', color: (animationType === 'up' || animationType === 'tier-up') ? '#4ade80' : '#f87171' } : {}}>
              {randomText}
            </span>
          )}
        </div>
      </div>

      {/* Glow de fondo si tiene bg */}
      {config.bg !== 'none' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 blur-3xl pointer-events-none" style={{ background: styles.currentRankColor }}></div>
      )}

      <div className={`relative z-10 flex flex-col items-center w-full ${innerPad} pb-2 transition-opacity duration-700 ease-in-out ${animationType ? 'opacity-0' : 'opacity-100 delay-300'}`}>

        {/* Watermark */}
        <span className="text-[8px] text-[#ff4655] font-black tracking-widest mb-1.5 select-none drop-shadow-[0_0_5px_rgba(255,70,85,0.4)]">
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
              className={`w-12 h-12 object-contain relative z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]`}
            />
          </div>
        )}

        {/* Rank Label */}
        {config.showRankLabel && (
          <span className={`text-[9px] font-black uppercase tracking-widest mt-1 drop-shadow-md transition-colors duration-500`} style={{ color: styles.currentRankColor }}>
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
