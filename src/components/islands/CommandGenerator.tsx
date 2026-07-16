import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { botPlatform, configMode, formatRank, formatMatch, formatToday, formatStats, hasSearched, playerData, lang, searchRegion } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import { generateBotCommand, getCommandExample } from '../../utils/commandHelpers';
import SectionHeader from '../ui/SectionHeader';

export default function CommandGenerator() {
  const t = useTranslations();
  const currentLang = useStore(lang);
  const currentPlatform = useStore(botPlatform);
  const currentConfig = useStore(configMode);
  const rankF = useStore(formatRank);
  const matchF = useStore(formatMatch);
  const todayF = useStore(formatToday);
  const statsF = useStore(formatStats);
  const searched = useStore(hasSearched);
  const data = useStore(playerData);
  const region = useStore(searchRegion);
  const [copied, setCopied] = useState(false);



  useEffect(() => {
    setCopied(false);
  }, [currentPlatform, currentConfig, rankF, matchF, todayF, statsF, data, region]);

  if (!searched) return null;

  const formats = { rankF, matchF, todayF, statsF };
  const finalEndpoint = currentConfig === 'match' ? 'match/last' : currentConfig;
  const command = generateBotCommand(
    finalEndpoint,
    currentConfig,
    currentPlatform,
    formats,
    currentLang,
    data?.account || null,
    region,
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentExample = getCommandExample(
    currentConfig,
    formats,
    currentLang,
    data
  );

  return (
    <section id="comandos" className="mt-14 scroll-mt-24 md:pl-14 relative animate-[fadeIn_0.5s_ease-out]">
      <SectionHeader step={4} title={t('botCmds')} subtitle={t('botCmdsSub')} delay="100ms" />

      <div data-reveal="true" className="opacity-0 shadow-2xl" style={{transitionDelay: '200ms', borderRadius:'22px',padding:'1.5px',background:'linear-gradient(135deg,#a970ff,#16161b 38%,#16161b 62%,#c4a3ff)'}}>
        <div style={{borderRadius:'20.5px',background:'linear-gradient(180deg,#16161b,#0e0e11)'}} className="p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-5">
            <div style={{background:'rgba(169,112,255,0.12)',border:'1px solid rgba(169,112,255,0.3)'}} className="w-9 h-9 rounded-lg flex items-center justify-center">
              <iconify-icon icon="solar:command-linear" width="16" className="text-[#a970ff]"></iconify-icon>
            </div>
            <h3 className="font-semibold text-base tracking-tight text-white">{t('readyBlock')}</h3>
          </div>
          
          <p className="text-[#a970ff] text-xs font-bold mb-2 tracking-wide">!{currentConfig.toUpperCase()}</p>
          
          <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="flex items-center gap-2 rounded-lg p-1 pl-3">
            <code className="flex-1 text-xs text-neutral-300 truncate" style={{fontFamily:"'JetBrains Mono',monospace"}}>
              {command}
            </code>
            <button 
              onClick={copyToClipboard}
              style={{background:'linear-gradient(135deg,#a970ff,#7c3aed)'}} 
              className="px-3 py-2 rounded-md text-xs font-semibold text-white hover:brightness-110 transition flex items-center gap-1"
            >
              {copied ? (
                <><iconify-icon icon="solar:check-read-linear" width="14"></iconify-icon> OK</>
              ) : (
                <><iconify-icon icon="solar:copy-linear" width="14"></iconify-icon> COPY</>
              )}
            </button>
          </div>
          
          <div style={{background:'rgba(34,197,94,0.08)',borderLeft:'2px solid #22c55e'}} className="mt-3 px-3 py-2.5 rounded-r-lg">
              <span className="text-[10px] font-bold tracking-wider text-[#a970ff] bg-[#a970ff]/10 px-2 py-0.5 rounded uppercase">{t('example')}</span>
              <p className="text-white font-medium text-sm mt-2">{currentExample}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
