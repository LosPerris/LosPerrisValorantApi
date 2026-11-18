import type { OverlayConfig } from '../hooks/useOverlayData';
import { PokemonStatEffect } from './PokemonStatEffect';

type AnimationType = 'up' | 'down' | 'tier-up' | 'tier-down' | null;

interface OverlayResultCoverProps {
  config: OverlayConfig;
  animationType: AnimationType;
  phase: 'idle' | 'fixed' | 'random';
  fixedText: string;
  randomText: string;
  size?: 'sm' | 'lg';
}

export function OverlayResultCover({
  config,
  animationType,
  phase,
  fixedText,
  randomText,
  size = 'lg',
}: OverlayResultCoverProps) {
  const isUp = animationType === 'up' || animationType === 'tier-up';
  const isDown = animationType === 'down' || animationType === 'tier-down';
  const textSize = size === 'sm' ? 'text-xl tracking-[0.3em]' : 'text-2xl tracking-[0.4em]';

  const transparentTextStyle =
    config.bg === 'none'
      ? {
          textShadow: isUp
            ? '0 0 20px rgba(34,197,94,0.8), 0 4px 10px rgba(0,0,0,1)'
            : '0 0 20px rgba(239,68,68,0.8), 0 4px 10px rgba(0,0,0,1)',
          color: isUp ? '#4ade80' : '#f87171',
        }
      : {};

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none rounded-[inherit] overflow-hidden
        ${animationType ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        background:
          config.bg === 'none'
            ? 'transparent'
            : isUp
              ? 'linear-gradient(135deg, rgba(22,163,74,0.95), rgba(20,83,45,0.98))'
              : isDown
                ? 'linear-gradient(135deg, rgba(220,38,38,0.95), rgba(127,29,29,0.98))'
                : 'transparent',
        backdropFilter: config.bg === 'none' ? 'none' : 'blur(12px)',
        boxShadow: config.bg === 'none' ? 'none' : 'inset 0 0 30px rgba(0,0,0,0.8)',
      }}
    >
      {config.bg !== 'none' && (
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
      )}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {phase !== 'idle' && <PokemonStatEffect type={isUp ? 'up' : 'down'} />}
        {phase === 'fixed' && (
          <span
            className={`font-black uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-white animate-zoom-in ${textSize}`}
            style={transparentTextStyle}
          >
            {fixedText}
          </span>
        )}
        {phase === 'random' && (
          <span
            className={`font-black uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-white animate-pop-in ${textSize}`}
            style={transparentTextStyle}
          >
            {randomText}
          </span>
        )}
      </div>
    </div>
  );
}
