import React from 'react';
import { cn } from '../../utils/cn';

type StepTheme = {
  numColor: string;
  numGradient: string;
  numShadow: string;
  lineGradient: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
};

const THEMES: Record<number, StepTheme> = {
  2: {
    numColor: 'text-amber-900',
    numGradient: 'linear-gradient(135deg,#ffe08a,#c9920f)',
    numShadow: '0 8px 22px -6px rgba(255,212,121,0.6)',
    lineGradient: 'linear-gradient(180deg,#ffe08a,#ffd479)',
    badgeBg: 'rgba(255,212,121,0.12)',
    badgeBorder: '1px solid rgba(255,212,121,0.3)',
    badgeText: '#ffd479',
  },
  3: {
    numColor: 'text-green-950',
    numGradient: 'linear-gradient(135deg,#4ade80,#16a34a)',
    numShadow: '0 8px 22px -6px rgba(34,197,94,0.6)',
    lineGradient: 'linear-gradient(180deg,#4ade80,#22c55e)',
    badgeBg: 'rgba(34,197,94,0.12)',
    badgeBorder: '1px solid rgba(34,197,94,0.3)',
    badgeText: '#4ade80',
  },
  4: {
    numColor: 'text-white',
    numGradient: 'linear-gradient(135deg,#c4a3ff,#7c3aed)',
    numShadow: '0 8px 22px -6px rgba(169,112,255,0.6)',
    lineGradient: 'linear-gradient(180deg,#c4a3ff,#a970ff)',
    badgeBg: 'rgba(169,112,255,0.12)',
    badgeBorder: '1px solid rgba(169,112,255,0.3)',
    badgeText: '#c4a3ff',
  },
  5: {
    numColor: 'text-white',
    numGradient: 'linear-gradient(135deg,#ff4655,#b81f2c)',
    numShadow: '0 8px 22px -6px rgba(255,70,85,0.7)',
    lineGradient: 'linear-gradient(180deg,#ff8a93,#ff4655)',
    badgeBg: 'rgba(255,70,85,0.12)',
    badgeBorder: '1px solid rgba(255,70,85,0.3)',
    badgeText: '#ff8a93',
  }
};

interface SectionHeaderProps {
  step: 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  delay?: string;
  stepLabel?: string;
}

export default function SectionHeader({ step, title, subtitle, delay, stepLabel = 'PASO' }: SectionHeaderProps) {
  const theme = THEMES[step];

  return (
    <>
      <div 
        data-reveal="true" 
        className={cn(
          "hidden md:flex absolute left-0 top-0 w-9 h-9 rounded-full items-center justify-center font-bold text-sm",
          theme.numColor,
          delay && "opacity-0"
        )} 
        style={{transitionDelay: delay, background: theme.numGradient, boxShadow: theme.numShadow}}
      >
        {step}
      </div>
      <div 
        data-reveal="true" 
        className={cn(
          "flex items-center gap-4 mb-10",
          delay && "opacity-0"
        )} 
        style={delay ? {transitionDelay: delay} : undefined}
      >
        <span style={{background: theme.lineGradient}} className="w-1.5 h-6 rounded-full md:hidden"></span>
        <span style={{background: theme.badgeBg, border: theme.badgeBorder, color: theme.badgeText}} className="text-[10px] font-bold px-2 py-0.5 rounded-full">
          {stepLabel} 0{step}
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white mb-1.5">{title}</h2>
          <span className="hidden sm:block text-[11px] text-neutral-300">{subtitle}</span>
        </div>
      </div>
    </>
  );
}
