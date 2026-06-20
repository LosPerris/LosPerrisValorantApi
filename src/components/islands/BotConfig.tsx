import { useStore } from '@nanostores/react';
import { cn } from '../../utils/cn';
import CustomSelect from '../ui/CustomSelect';
import { lang, botPlatform, configMode, formatRank, formatMatch, formatToday, formatStats, hasSearched } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import SectionHeader from '../ui/SectionHeader';

export default function BotConfig() {
  const currentLang = useStore(lang);
  const currentPlatform = useStore(botPlatform);
  const currentConfig = useStore(configMode);
  const rankF = useStore(formatRank);
  const matchF = useStore(formatMatch);
  const todayF = useStore(formatToday);
  const statsF = useStore(formatStats);
  const searched = useStore(hasSearched);
  const t = useTranslations();

  if (!searched) return null;

  return (
    <section id="herramientas" className="mt-14 scroll-mt-24 md:pl-14 relative z-20 animate-[fadeIn_0.5s_ease-out]">
      <SectionHeader step={3} title={t('botConfig')} subtitle={t('botConfigSub')} delay="100ms" />

      <div data-reveal="true" className="opacity-0" style={{transitionDelay: '200ms', borderRadius:'22px',padding:'1.5px',background:'linear-gradient(135deg,#22c55e,#16161b 32%,#16161b 64%,#14b8a6)',boxShadow:'0 20px 50px -20px rgba(0,0,0,0.85)'}}>
        <div style={{background:'linear-gradient(180deg,#16161b,#0e0e11)',borderRadius:'20.5px'}} className="p-6 md:p-8 h-full">
        <div className="flex items-center gap-2.5 mb-5">
          <div style={{background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.3)'}} className="w-9 h-9 rounded-lg flex items-center justify-center">
            <iconify-icon icon="solar:settings-linear" width="16" className="text-[#22c55e]"></iconify-icon>
          </div>
          <h3 className="font-semibold text-base tracking-tight text-white">{t('commandParams')}</h3>
        </div>
        
        <div style={{background:'#0a0a0d',border:'1px solid #2a2a30'}} className="grid grid-cols-4 gap-1 p-1 rounded-lg text-xs font-semibold mb-5 max-w-md">
          <button 
            onClick={() => configMode.set('rank')} 
            style={currentConfig === 'rank' ? {background:'#ff4655',color:'white'} : {}}
            className={`py-2 rounded-md transition ${currentConfig !== 'rank' ? 'text-neutral-400 hover:text-white' : ''}`}
          >
            {t('rank')}
          </button>
          <button 
            onClick={() => configMode.set('match')} 
            style={currentConfig === 'match' ? {background:'#ff4655',color:'white'} : {}}
            className={`py-2 rounded-md transition ${currentConfig !== 'match' ? 'text-neutral-400 hover:text-white' : ''}`}
          >
            {t('match')}
          </button>
          <button 
            onClick={() => configMode.set('today')} 
            style={currentConfig === 'today' ? {background:'#ff4655',color:'white'} : {}}
            className={`py-2 rounded-md transition ${currentConfig !== 'today' ? 'text-neutral-400 hover:text-white' : ''}`}
          >
            {t('today')}
          </button>
          <button 
            onClick={() => configMode.set('stats')} 
            style={currentConfig === 'stats' ? {background:'#ff4655',color:'white'} : {}}
            className={`py-2 rounded-md transition ${currentConfig !== 'stats' ? 'text-neutral-400 hover:text-white' : ''}`}
          >
            {t('stats')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide px-1">{t('platform')}</label>
            <CustomSelect
              id="platform-select"
              value={currentPlatform}
              onChange={(val) => botPlatform.set(val)}
              options={[
                { value: 'nightbot', label: 'Nightbot / StreamElements' },
                { value: 'fossabot', label: 'Fossabot' }
              ]}
            />
          </div>
          
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide px-1">{t('format')}</label>
            {currentConfig === 'rank' && (
              <CustomSelect
                id="format-select"
                value={rankF}
                onChange={(val) => formatRank.set(val)}
                options={[
                  { value: '1', label: `1. ${t('formatRank1')}` },
                  { value: '2', label: `2. ${t('formatRank2')}` },
                  { value: '3', label: `3. ${t('formatRank3')}` }
                ]}
              />
            )}
            {currentConfig === 'match' && (
              <CustomSelect
                id="format-select"
                value={matchF}
                onChange={(val) => formatMatch.set(val)}
                options={[
                  { value: '1', label: `1. ${t('formatMatch1')}` },
                  { value: '2', label: `2. ${t('formatMatch2')}` },
                  { value: '3', label: `3. ${t('formatMatch3')}` }
                ]}
              />
            )}
            {currentConfig === 'today' && (
              <CustomSelect
                id="format-select"
                value={todayF}
                onChange={(val) => formatToday.set(val)}
                options={[
                  { value: '1', label: `1. ${t('formatToday1')}` },
                  { value: '2', label: `2. ${t('formatToday2')}` },
                  { value: '3', label: `3. ${t('formatToday3')}` }
                ]}
              />
            )}
            {currentConfig === 'stats' && (
              <CustomSelect
                id="format-select"
                value={statsF}
                onChange={(val) => formatStats.set(val)}
                options={[
                  { value: '1', label: t('formatStats1') },
                  { value: '2', label: t('formatStats2') },
                  { value: '3', label: t('formatStats3') }
                ]}
              />
            )}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
