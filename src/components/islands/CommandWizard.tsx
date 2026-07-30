import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import CustomSelect from '../ui/CustomSelect';
import {
  botPlatform,
  copyFormat,
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
  searchRegion,
  customApiKey
} from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import { generateBotCommand, getCommandExample, RANK_TEMPLATE_VARS, MATCH_TEMPLATE_VARS, TODAY_TEMPLATE_VARS, STATS_TEMPLATE_VARS } from '../../utils/commandHelpers';

export default function CommandWizard() {
  const t = useTranslations();
  const currentLang = useStore(lang);
  const currentPlatform = useStore(botPlatform);
  const currentCopyFormat = useStore(copyFormat);
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
  const userApiKey = useStore(customApiKey);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [currentPlatform, currentCopyFormat, currentConfig, rankF, matchF, todayF, statsF, style, tplRank, tplMatch, tplToday, tplStats, data, region, userApiKey]);

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
    styleConfig,
    currentCopyFormat as 'full' | 'variable' | 'url',
    userApiKey
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
          <h2 className="font-semibold text-base tracking-tight text-white leading-none">{t('generatorTitle')}</h2>
          <p className="text-[11px] text-neutral-400 mt-1">{t('generatorDesc')}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0a0a0a]">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">

          {/* LEFT SIDE: CONFIGURATION */}
          <div className="p-3 md:p-4 lg:p-5 lg:pr-6 flex flex-col lg:rounded-l-xl">

            {/* TABS */}
            <div className="relative flex bg-[#111] border border-white/5 p-1 rounded-lg mb-5 isolate">
              <div
                className="absolute top-1 bottom-1 rounded-md border border-[#ff4655] bg-[#ff4655]/5 shadow-[0_0_10px_rgba(255,70,85,0.2)] transition-transform duration-300 ease-out -z-10"
                style={{
                  left: '4px',
                  width: 'calc((100% - 8px) / 4)',
                  transform: `translateX(${currentConfig === 'rank' ? '0' : currentConfig === 'match' ? '100%' : currentConfig === 'today' ? '200%' : '300%'})`
                }}
              />
              {[
                { id: 'rank', label: t('rank') },
                { id: 'match', label: t('match') },
                { id: 'today', label: t('today') },
                { id: 'stats', label: t('stats') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => configMode.set(tab.id as any)}
                  className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors duration-300 ${currentConfig === tab.id ? 'text-[#ff4655]' : 'text-neutral-500 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CONFIGURATION OPTIONS */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 content-start">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide px-1 block mb-1.5">{t('botLabel')}</span>
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
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide px-1 block mb-1.5">{t('copyFormatTitle')}</span>
                <CustomSelect
                  id="format-select"
                  value={currentCopyFormat}
                  onChange={(val) => copyFormat.set(val as any)}
                  options={[
                    { value: 'full', label: t('copyFormatChat') },
                    { value: 'variable', label: t('copyFormatWeb') },
                    { value: 'url', label: t('copyFormatUrl') }
                  ]}
                />
              </div>

              <div className="col-span-2">
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
                      id="format-select-rank"
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
                      id="format-select-match"
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
                      id="format-select-today"
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
                      id="format-select-stats"
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
                    maxLength={150}
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
          <div className="p-3 md:p-4 lg:p-5 lg:pl-6 bg-[#050505] flex flex-col lg:rounded-r-xl">
            <div className="flex-shrink-0">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                {currentCopyFormat === 'url' ? t('previewUrl') : currentCopyFormat === 'variable' ? t('previewVariable') : `${t('previewCommand')} (!${currentConfig})`}
              </span>

              <div className="relative group flex items-center bg-[#111] border border-white/5 rounded-xl shadow-inner h-[76px] overflow-hidden">
                <code
                  key={command}
                  className="block w-full pl-4 pr-[80px] text-[13px] text-neutral-300 font-mono break-all leading-[1.4] line-clamp-2 animate-[fadeIn_0.3s_ease-out]"
                >
                  {command}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 px-2.5 py-1.5 rounded-md bg-[#0a0a0a] border border-[#ff4655] text-[#ff4655] text-[10px] font-bold hover:shadow-[0_0_10px_rgba(255,70,85,0.2)] hover:bg-[#ff4655]/10 transition-all"
                >
                  {copied ? t('copiedBtn') : t('copyBtn')}
                </button>
              </div>
            </div>

            <div className="flex flex-col bg-[#0e0e10] rounded-xl border border-white/5 shadow-inner mt-4 flex-1 overflow-hidden font-['Inter',sans-serif]">
              {/* Header */}
              <div className="flex items-center justify-between py-2 px-3 border-b border-white/10 relative shrink-0">
                <div className="w-4"></div>
                <span className="text-[11px] font-semibold text-[#efeff1]">Chat del stream</span>
                <div className="flex gap-2 text-[#efeff1]">
                  <iconify-icon icon="mdi:account-group-outline" width="14"></iconify-icon>
                </div>
              </div>
              
              {/* Content */}
              <div className="px-3 py-2 flex flex-col gap-1.5 text-[12px] leading-[1.3] text-[#efeff1] flex-1 bg-[#0e0e10] min-h-[90px]">
                <span className="text-neutral-500 text-[10px] mb-1 text-center block">
                  ¡Te damos la bienvenida a la sala de chat de {data?.account?.name || 'ponss17'}!
                </span>

                {/* User */}
                <div className="break-words">
                  <span className="font-bold text-[#e54251] hover:underline cursor-pointer">
                    {data?.account?.name || 'Streamer'}
                  </span>
                  <span className="text-neutral-300 mr-1">:</span>
                  <span>!{currentConfig}</span>
                </div>

                {/* Bot */}
                <div className="break-words animate-[fadeIn_0.4s_ease-out]">
                  <span 
                    className="inline-flex items-center justify-center bg-[#05994f] rounded-[3px] mr-1.5 w-[18px] h-[18px] align-middle"
                    title="Moderador"
                  >
                    <iconify-icon icon="mdi:sword" width="14" className="text-white -scale-x-100"></iconify-icon>
                  </span>
                  <span className="font-bold text-[#47487f] hover:underline cursor-pointer">
                    {currentPlatform === 'nightbot' ? 'Nightbot' : 'Fossabot'}
                  </span>
                  <span className="text-neutral-300 mr-1">:</span>
                  <span>{currentExample}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-3 pb-3 shrink-0 bg-[#0e0e10]">
                <div className="bg-[#18181b] border border-white/10 rounded p-1.5 flex items-center gap-1.5 mb-1.5 cursor-text hover:border-[#a970ff] hover:shadow-[0_0_0_1px_#a970ff] transition-all group">
                  <span 
                    className="inline-flex items-center justify-center bg-[#05994f] rounded-[2px] w-[14px] h-[14px]"
                  >
                    <iconify-icon icon="mdi:sword" width="10" className="text-white -scale-x-100"></iconify-icon>
                  </span>
                  <span className="text-neutral-400 text-[11px] group-hover:text-neutral-300 transition-colors">Enviar un mensaje</span>
                </div>
                <div className="flex items-center justify-between">
                  <iconify-icon icon="mdi:cog" width="14" className="text-neutral-400 hover:text-white cursor-pointer transition-colors"></iconify-icon>
                  <button className="bg-[#9146FF] hover:bg-[#772CE8] text-white text-[10px] font-bold py-1 px-3 rounded-md transition-colors shadow-sm">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
