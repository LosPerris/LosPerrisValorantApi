import { useStore } from '@nanostores/react';
import CustomSelect from '../ui/CustomSelect';
import {
  lang,
  botPlatform,
  configMode,
  formatRank,
  formatMatch,
  formatToday,
  formatStats,
  outputStyle,
  templateRank,
  templateMatch,
  templateToday,
  templateStats,
  hasSearched
} from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import SectionHeader from '../ui/SectionHeader';
import {
  RANK_TEMPLATE_VARS,
  MATCH_TEMPLATE_VARS,
  TODAY_TEMPLATE_VARS,
  STATS_TEMPLATE_VARS
} from '../../utils/commandHelpers';

export default function BotConfig() {
  useStore(lang);
  const currentPlatform = useStore(botPlatform);
  const currentConfig = useStore(configMode);
  const rankF = useStore(formatRank);
  const matchF = useStore(formatMatch);
  const todayF = useStore(formatToday);
  const statsF = useStore(formatStats);
  const style = useStore(outputStyle);
  const tplRank = useStore(templateRank);
  const tplMatch = useStore(templateMatch);
  const tplToday = useStore(templateToday);
  const tplStats = useStore(templateStats);
  const searched = useStore(hasSearched);
  const t = useTranslations();

  if (!searched) return null;

  const vars =
    currentConfig === 'rank'
      ? RANK_TEMPLATE_VARS
      : currentConfig === 'match'
        ? MATCH_TEMPLATE_VARS
        : currentConfig === 'today'
          ? TODAY_TEMPLATE_VARS
          : STATS_TEMPLATE_VARS;

  const currentTemplate =
    currentConfig === 'rank'
      ? tplRank
      : currentConfig === 'match'
        ? tplMatch
        : currentConfig === 'today'
          ? tplToday
          : tplStats;

  const setCurrentTemplate = (val: string) => {
    if (currentConfig === 'rank') templateRank.set(val);
    else if (currentConfig === 'match') templateMatch.set(val);
    else if (currentConfig === 'today') templateToday.set(val);
    else templateStats.set(val);
  };

  const insertVar = (v: string) => {
    setCurrentTemplate(`${currentTemplate}${currentTemplate.endsWith(' ') || !currentTemplate ? '' : ' '}{${v}}`);
  };

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
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide px-1">{t('outputStyle')}</label>
            <CustomSelect
              id="style-select"
              value={style}
              onChange={(val) => outputStyle.set(val as 'default' | 'clean' | 'custom')}
              options={[
                { value: 'default', label: t('styleDefault') },
                { value: 'clean', label: t('styleClean') },
                { value: 'custom', label: t('styleCustom') }
              ]}
            />
            <p className="mt-1.5 px-1 text-[11px] text-neutral-500">
              {style === 'clean' ? t('styleCleanHint') : style === 'custom' ? t('styleCustomHint') : t('styleDefaultHint')}
            </p>
          </div>
          
          {style !== 'custom' && (
            <div className="md:col-span-2">
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
          )}

          {style === 'custom' && (
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide px-1">{t('templateLabel')}</label>
              <input
                type="text"
                value={currentTemplate}
                onChange={(e) => setCurrentTemplate(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a30] bg-[#0a0a0d] px-3 py-2.5 text-sm text-white outline-none focus:border-[#22c55e]/50"
                placeholder="{rank}"
              />
              <div className="flex flex-wrap items-center gap-1.5 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">{t('templateVars')}:</span>
                {vars.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVar(v)}
                    className="rounded-md border border-[#2a2a30] bg-[#121215] px-2 py-0.5 font-mono text-[11px] text-[#22c55e] hover:border-[#22c55e]/40"
                  >
                    {`{${v}}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
