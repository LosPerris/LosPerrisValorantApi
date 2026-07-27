import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import CustomSelect from '../ui/CustomSelect';
import {
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
  hasSearched,
  playerData,
  lang,
  searchRegion
} from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import { generateBotCommand, getCommandExample, RANK_TEMPLATE_VARS, MATCH_TEMPLATE_VARS, TODAY_TEMPLATE_VARS, STATS_TEMPLATE_VARS } from '../../utils/commandHelpers';

export default function CommandWizard() {
  const t = useTranslations();
  const currentLang = useStore(lang);
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
  const data = useStore(playerData);
  const region = useStore(searchRegion);
  
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [currentPlatform, currentConfig, rankF, matchF, todayF, statsF, style, tplRank, tplMatch, tplToday, tplStats, data, region]);

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

  const formats = { rankF, matchF, todayF, statsF };
  const styleConfig = {
    style,
    templates: {
      rank: tplRank,
      match: tplMatch,
      today: tplToday,
      stats: tplStats
    }
  };
  
  const finalEndpoint = currentConfig === 'match' ? 'match/last' : currentConfig;
  const command = generateBotCommand(
    finalEndpoint,
    currentConfig,
    currentPlatform,
    formats,
    currentLang,
    data?.account || null,
    region,
    styleConfig
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
    data,
    styleConfig
  );

  return (
    <section id="herramientas" className="relative z-20 animate-[fadeIn_0.5s_ease-out] w-full flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1 mb-2 mt-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 shrink-0">
          <iconify-icon icon="solar:magic-stick-3-linear" width="16" className="text-[#ff4655]"></iconify-icon>
        </div>
        <div>
          <h2 className="font-semibold text-base tracking-tight text-white leading-none">Generador de Comandos</h2>
          <p className="text-[11px] text-neutral-500 mt-1">Configura y copia tu comando para el chat de Twitch</p>
        </div>
      </div>
      
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a]">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          
          {/* LEFT SIDE: CONFIGURATION */}
          <div className="p-5 md:p-6 lg:rounded-l-xl">
            
            {/* TABS */}
            <div className="flex bg-[#111] border border-white/5 p-1 rounded-lg mb-5">
              {[
                { id: 'rank', label: t('rank') },
                { id: 'match', label: t('match') },
                { id: 'today', label: t('today') },
                { id: 'stats', label: t('stats') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => configMode.set(tab.id as any)}
                  className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
                    currentConfig === tab.id 
                      ? 'border border-[#ff4655] text-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.2)] bg-[#ff4655]/5' 
                      : 'border border-transparent text-neutral-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CONFIGURATION OPTIONS */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide px-1 block mb-1.5">{t('platform')}</span>
                <CustomSelect
                  id="platform-select"
                  value={currentPlatform}
                  onChange={(val) => botPlatform.set(val)}
                  options={[
                    { value: 'nightbot', label: 'Nightbot / SE' },
                    { value: 'fossabot', label: 'Fossabot' }
                  ]}
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide px-1 block mb-1.5">{t('outputStyle')}</span>
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
              </div>
              
              {style !== 'custom' && (
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide px-1 block mb-1.5">{t('format')}</span>
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
                <div className="col-span-2 space-y-2 mt-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide px-1 block mb-1.5">{t('templateLabel')}</span>
                  <input
                    type="text"
                    value={currentTemplate}
                    onChange={(e) => setCurrentTemplate(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-white transition"
                    placeholder="{rank}"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 px-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-600">{t('templateVars')}:</span>
                    {vars.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertVar(v)}
                        className="rounded-md border border-white/10 bg-[#111] px-1.5 py-0.5 font-mono text-[10px] text-white hover:border-white/30"
                      >
                        {`{${v}}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: PREVIEW */}
          <div className="p-5 md:p-6 bg-[#050505] flex flex-col justify-center lg:rounded-r-xl">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
              Comando para {currentPlatform} (!{currentConfig})
            </span>
            
            <div className="relative group mb-4">
              <code className="block w-full pr-[80px] text-sm text-neutral-300 font-mono break-all leading-relaxed bg-[#111] border border-white/5 p-4 rounded-xl shadow-inner min-h-[60px]">
                {command}
              </code>
              <button 
                onClick={copyToClipboard}
                className="absolute top-1/2 -translate-y-1/2 right-3 px-2.5 py-1.5 rounded-md bg-[#0a0a0a] border border-[#ff4655] text-[#ff4655] text-[10px] font-bold hover:shadow-[0_0_10px_rgba(255,70,85,0.2)] hover:bg-[#ff4655]/10 transition-all"
              >
                {copied ? 'COPIADO' : 'COPIAR'}
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5 bg-[#0a0a0a] p-4 rounded-xl border border-white/10 shadow-inner">
              <span className="text-[10px] font-bold text-[#ff4655] uppercase tracking-wider">Salida de ejemplo</span>
              <p className="text-white font-medium leading-snug text-sm">{currentExample}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
