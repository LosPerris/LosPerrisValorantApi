const rankColors: Record<number, string> = {
  0: '#ffffff', // Unranked
  1: '#ffffff', 2: '#ffffff', // Unused
  3: '#b0c3d4', 4: '#b0c3d4', 5: '#b0c3d4', // Iron
  6: '#b8997a', 7: '#b8997a', 8: '#b8997a', // Bronze
  9: '#b0c3d4', 10: '#b0c3d4', 11: '#b0c3d4', // Silver (usando tono gris claro)
  12: '#fce367', 13: '#fce367', 14: '#fce367', // Gold
  15: '#00ffcc', 16: '#00ffcc', 17: '#00ffcc', // Platinum
  18: '#ff66b2', 19: '#ff66b2', 20: '#ff66b2', // Diamond
  21: '#66ff66', 22: '#66ff66', 23: '#66ff66', // Ascendant
  24: '#ffcc66', 25: '#ffcc66', 26: '#ffcc66', // Immortal
  27: '#ffffcc', // Radiant
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#0a0a0a');
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '10, 10, 10';
};

export const getBgClasses = (config: any) => {
  const borderClass = config.borderColor === 'none' ? '' : 'border';
  return {
    glass: `backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 ${borderClass} ${config.borderRadius === 'none' ? 'rounded-none' : config.borderRadius === 'md' ? 'rounded-md' : 'rounded-2xl'}`,
    solid: `shadow-xl p-4 ${borderClass} ${config.borderRadius === 'none' ? 'rounded-none' : config.borderRadius === 'md' ? 'rounded-md' : 'rounded-2xl'}`,
    none: 'bg-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] p-2',
  }[config.bg as 'glass' | 'solid' | 'none'] || `backdrop-blur-md ${borderClass} p-4 ${config.borderRadius === 'none' ? 'rounded-none' : config.borderRadius === 'md' ? 'rounded-md' : 'rounded-2xl'}`;
};

export const getSizeClasses = (config: any) => {
  return {
    small: 'scale-75 origin-center',
    normal: 'scale-100 origin-center',
    large: 'scale-[1.15] origin-center',
  }[config.size as 'small' | 'normal' | 'large'] || 'scale-100 origin-center';
};

export const getCommonStyles = (config: any, data: any) => {
  const currentRankColor = rankColors[data.tier] || '#ffffff';
  
  // Buscar el color del próximo rango mayor (diferente al actual)
  let nextRankColor = currentRankColor;
  for (let i = data.tier + 1; i <= 27; i++) {
    if (rankColors[i] && rankColors[i] !== currentRankColor) {
      nextRankColor = rankColors[i];
      break;
    }
  }
  
  // Gradiente dinámico: empieza en tu color y termina en el color de tu próxima meta
  const autoGradient = `linear-gradient(to right, ${currentRankColor} 0%, ${nextRankColor} 100%)`;
  
  const nameStyle = config.primaryColor === 'auto' 
    ? { color: '#ffffff', textShadow: `0 0 8px ${currentRankColor}d0, 0 1px 3px rgba(0,0,0,0.8)` }
    : { color: config.primaryColor };

  const isWin = data.lastChange > 0;
  const isLoss = data.lastChange < 0;
  const changeSign = isWin ? '+' : '';
  
  const badgeColorStyle = config.accentColor !== 'auto' ? { color: config.accentColor } : {};
  const changeColorClass = config.accentColor === 'auto'
    ? (isWin ? 'text-emerald-400' : isLoss ? 'text-[#ff4655]' : 'text-neutral-400')
    : '';

  const opacity = parseInt(config.bgOpacity || '30') / 100;
  const borderStyle = config.borderColor !== 'default' && config.borderColor !== 'none' ? { borderColor: config.borderColor } : {};
  const bgInlineStyle = config.bg === 'solid' 
    ? { backgroundColor: `rgba(${hexToRgb(config.bgColor)}, ${opacity})`, ...borderStyle }
    : config.bg === 'glass'
      ? { backgroundColor: `rgba(${hexToRgb(config.bgColor)}, ${opacity})`, ...borderStyle }
      : { ...borderStyle };

  return {
    currentRankColor,
    autoGradient,
    nameStyle,
    isWin,
    isLoss,
    changeSign,
    badgeColorStyle,
    changeColorClass,
    bgInlineStyle,
  };
};
