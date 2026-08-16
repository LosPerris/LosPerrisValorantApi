import { useState, useEffect } from 'react';

const matchResultLabels: Record<string, { fixedWin: string, fixedLose: string, win: string[], lose: string[] }> = {
  es: { fixedWin: 'VICTORIA', fixedLose: 'DERROTA', win: ['GG WP', 'NICE', 'EZ', 'GOD'], lose: ['NT', 'DERROTA :(', 'F', 'UNLUCKY'] },
  en: { fixedWin: 'VICTORY', fixedLose: 'DEFEAT', win: ['GG WP', 'NICE', 'EZ', 'GOD'], lose: ['NT', 'DEFEAT :(', 'F', 'UNLUCKY'] },
  pt: { fixedWin: 'VITÓRIA', fixedLose: 'DERROTA', win: ['GG WP', 'BOA', 'EZ', 'GOD'], lose: ['NT', 'DERROTA :(', 'F', 'UNLUCKY'] },
  fr: { fixedWin: 'VICTOIRE', fixedLose: 'DÉFAITE', win: ['GG WP', 'BIEN JOUÉ', 'EZ', 'GOD'], lose: ['NT', 'DÉFAITE :(', 'F', 'UNLUCKY'] }
};

export function useResultSequence(animationType: 'up' | 'down' | 'tier-up' | 'tier-down' | null, lang: string) {
  const [fixedText, setFixedText] = useState('');
  const [randomText, setRandomText] = useState('');
  const [phase, setPhase] = useState<'idle' | 'fixed' | 'random'>('idle');

  useEffect(() => {
    if (animationType) {
      const dictionary = matchResultLabels[lang] || matchResultLabels['en'];
      const isWin = animationType === 'up' || animationType === 'tier-up';
      
      setFixedText(isWin ? dictionary.fixedWin : dictionary.fixedLose);
      const arr = isWin ? dictionary.win : dictionary.lose;
      setRandomText(arr[Math.floor(Math.random() * arr.length)]);
      
      setPhase('fixed');

      const timeoutId = setTimeout(() => {
        setPhase('random');
      }, 800); // Wait 800ms before switching to random text to trigger pokemon effect

      return () => clearTimeout(timeoutId);
    } else {
      setPhase('idle');
    }
  }, [animationType, lang]);

  return { fixedText, randomText, phase };
}
