import { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { hasSearched, playerData, searchRegion, lang } from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import { translateRank } from '../../services/formatService';
import CustomSelect from '../ui/CustomSelect';
import OverlayWidget from '../overlay/OverlayWidget';

export default function OverlayGenerator() {
  const t = useTranslations();
  const searched = useStore(hasSearched);
  const data = useStore(playerData);
  const region = useStore(searchRegion);
  const currentLang = useStore(lang);

  const [bg, setBg] = useState('glass');
  const [size, setSize] = useState('normal');
  const [layout, setLayout] = useState('full');
  const [showName, setShowName] = useState(true);
  const [showLastMatch, setShowLastMatch] = useState(true);
  const [showRankIcon, setShowRankIcon] = useState(true);
  const [showRankLabel, setShowRankLabel] = useState(true);
  const [showRR, setShowRR] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [rankColor, setRankColor] = useState('auto');
  const [primaryColor, setPrimaryColor] = useState('auto');
  const [accentColor, setAccentColor] = useState('auto');
  const [progressColor, setProgressColor] = useState('auto');
  const [rrColor, setRrColor] = useState('auto');
  const [borderColor, setBorderColor] = useState('default');
  const [bgOpacity, setBgOpacity] = useState('30');
  const [borderRadius, setBorderRadius] = useState('xl');
  const [iconPosition, setIconPosition] = useState('left');
  const [bgColor, setBgColor] = useState('#000000');
  const [activeTab, setActiveTab] = useState<'appearance' | 'colors' | 'content'>('appearance');

  const backgrounds = [
    'ascent.webp',
    'icebox.webp',
    'bind.webp',
    'haven.webp'
  ];

  const backgroundNames = ['Ascent', 'Icebox', 'Bind', 'Haven'];
  const checkerboard = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAOklEQVQYV2N89erVfwY0ICYmxoBFMwowIikAq8bIQFwYw2QwHkUVTCHMjLAKiHYU2WA0j6IKphBmRlgFAG5QMBK52dOnAAAAAElFTkSuQmCC')";

  const [bgIndex, setBgIndex] = useState(0);
  const [showMap, setShowMap] = useState(true);

  const [copied, setCopied] = useState(false);

  const overlayUrl = useMemo(() => {
    if (!data?.account) return '';
    return `${window.location.origin}/overlay?name=${encodeURIComponent(data.account.name)}&tag=${encodeURIComponent(data.account.tag)}&region=${region}&bg=${bg}&size=${size}&layout=${layout}&showName=${showName ? '1' : '0'}&lastMatch=${showLastMatch ? '1' : '0'}&rankIcon=${showRankIcon ? '1' : '0'}&rankLabel=${showRankLabel ? '1' : '0'}&rr=${showRR ? '1' : '0'}&progressBar=${showProgressBar ? '1' : '0'}&radius=${borderRadius}&iconPos=${iconPosition}&rankColor=${encodeURIComponent(rankColor)}&color=${encodeURIComponent(primaryColor)}&accent=${encodeURIComponent(accentColor)}&progress=${encodeURIComponent(progressColor)}&rrColor=${encodeURIComponent(rrColor)}&borderColor=${encodeURIComponent(borderColor)}&bgOpacity=${bgOpacity}&bgColor=${encodeURIComponent(bgColor)}&lang=${currentLang}`;
  }, [
    data?.account?.name, data?.account?.tag, region, bg, size, layout, showName, showLastMatch, 
    showRankIcon, showRankLabel, showRR, showProgressBar, borderRadius, iconPosition, rankColor, 
    primaryColor, accentColor, progressColor, rrColor, borderColor, bgOpacity, bgColor, currentLang
  ]);

  const previewConfig = useMemo(() => ({
    bg, size, layout, showName, showLastMatch, showRankIcon, showRankLabel, showRR, showProgressBar, 
    rankColor, primaryColor, accentColor, progressColor, rrColor, borderColor, bgOpacity, 
    borderRadius, iconPosition, bgColor
  }), [
    bg, size, layout, showName, showLastMatch, showRankIcon, showRankLabel, showRR, showProgressBar, 
    rankColor, primaryColor, accentColor, progressColor, rrColor, borderColor, bgOpacity, 
    borderRadius, iconPosition, bgColor
  ]);

  const previewData = useMemo(() => {
    if (!data?.account) return null;
    return {
      name: data.account.name,
      tag: data.account.tag,
      tier: data.rank?.current_tier || 0,
      tierName: translateRank(data.rank?.current_tier_patched || 'Unranked', currentLang),
      rr: data.rank?.ranking_in_tier || 0,
      iconUrl: data.rank?.rank_image || 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png',
      lastChange: data.rank?.mmr_change_to_last_game || 0
    };
  }, [data, currentLang]);

  if (!searched || !data?.account) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-20 animate-[fadeIn_0.5s_ease-out] w-full flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 shrink-0">
          <iconify-icon icon="solar:monitor-camera-bold-duotone" width="16" className="text-[#ff4655]"></iconify-icon>
        </div>
        <div>
          <h2 className="font-semibold text-base tracking-tight text-white leading-none">{t('overlayTitle')}</h2>
          <p className="text-[11px] text-neutral-400 mt-1">{t('overlayDesc')}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0a0a0a]">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">

          {/* LEFT SIDE: CONFIGURATION */}
          <div className="p-3 md:p-4 lg:p-5 lg:pr-6 lg:rounded-l-xl flex flex-col justify-between">
            <div className="flex-1 flex flex-col">
              {/* TABS */}
              <div className="relative flex bg-[#111] border border-white/5 p-1 rounded-lg mb-3 isolate shrink-0">
                <div
                  className="absolute top-1 bottom-1 rounded-md border border-[#ff4655] bg-[#ff4655]/5 shadow-[0_0_10px_rgba(255,70,85,0.2)] transition-transform duration-300 ease-out -z-10"
                  style={{
                    left: '4px',
                    width: 'calc((100% - 8px) / 3)',
                    transform: `translateX(${activeTab === 'appearance' ? '0' : activeTab === 'colors' ? '100%' : '200%'})`
                  }}
                />
                {[
                  { id: 'appearance', label: 'Apariencia' },
                  { id: 'colors', label: 'Colores' },
                  { id: 'content', label: 'Contenido' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors duration-300 ${activeTab === tab.id ? 'text-[#ff4655]' : 'text-neutral-500 hover:text-white'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 h-[216px] content-start">

                {activeTab === 'appearance' && (
                  <>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-1">{t('overlayBgLabel') || 'Fondo'}</span>
                      <CustomSelect id="overlay-bg-select" value={bg} onChange={(val) => setBg(val)} options={[
                        { value: 'glass', label: t('overlayBgGlass') || 'Cristal' },
                        { value: 'solid', label: t('overlayBgSolid') || 'Sólido' },
                        { value: 'none', label: t('overlayBgNone') || 'Transparente' }
                      ]} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-1">{t('overlaySizeLabel') || 'Tamaño'}</span>
                      <CustomSelect id="overlay-size-select" value={size} onChange={(val) => setSize(val)} options={[
                        { value: 'small', label: t('overlaySizeSmall') || 'Pequeño' },
                        { value: 'normal', label: t('overlaySizeNormal') || 'Normal' },
                        { value: 'large', label: t('overlaySizeLarge') || 'Grande' }
                      ]} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-1">Estructura</span>
                      <CustomSelect id="overlay-layout-select" value={layout} onChange={(val) => setLayout(val)} options={[
                        { value: 'compact', label: 'Compacto' },
                        { value: 'banner', label: 'Banner' },
                        { value: 'full', label: 'Tarjeta' }
                      ]} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-1">Redondeo</span>
                      <CustomSelect id="overlay-radius-select" value={borderRadius} onChange={(val) => setBorderRadius(val)} options={[
                        { value: 'xl', label: 'Redondeado' },
                        { value: 'md', label: 'Ligero' },
                        { value: 'none', label: 'Cuadrado' }
                      ]} />
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-1">Posición del Ícono</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[{ v: 'left', label: '← Izquierda' }, { v: 'right', label: 'Derecha →' }].map(({ v, label }) => (
                          <button key={v} onClick={() => setIconPosition(v)}
                            className={`py-1 text-[11px] font-bold rounded-lg border transition-all ${iconPosition === v ? 'border-[#ff4655] bg-[#ff4655]/10 text-[#ff4655]' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={`col-span-2 transition-all duration-300 ${bg !== 'none' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-1">Opacidad del Fondo</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[{ v: '15', label: '15%' }, { v: '30', label: '30%' }, { v: '55', label: '55%' }, { v: '80', label: '80%' }].map(({ v, label }) => (
                          <button key={v} onClick={() => setBgOpacity(v)}
                            className={`py-1 text-[11px] font-bold rounded-lg border transition-all ${bgOpacity === v ? 'border-[#ff4655] bg-[#ff4655]/10 text-[#ff4655]' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'colors' && (
                  <>
                    {[
                      { label: 'Color del Rango', value: rankColor, setter: setRankColor, sr: 'Elegir color del rango' },
                      { label: 'Color del Nombre', value: primaryColor, setter: setPrimaryColor, sr: 'Elegir color del nombre' },
                      { label: 'Color del Nº RR', value: rrColor, setter: setRrColor, sr: 'Elegir color de RR' },
                      { label: 'Color Badge (+RR)', value: accentColor, setter: setAccentColor, sr: 'Elegir color de badge' },
                      { label: 'Barra de Progreso', value: progressColor, setter: setProgressColor, sr: 'Elegir color de barra' }
                    ].map(({ label, value, setter, sr }) => (
                      <div key={label}>
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-0.5">{label}</span>
                        <div className="flex gap-2">
                          <button onClick={() => setter('auto')} className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${value === 'auto' ? 'border-[#ff4655] bg-[#ff4655]/10 text-[#ff4655]' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}>
                            Auto
                          </button>
                          <label className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-lg px-2 py-1 cursor-pointer w-16">
                            <span className="sr-only">{sr}</span>
                            <input type="color" value={value === 'auto' ? '#ffffff' : value} onChange={(e) => setter(e.target.value)} className="w-full h-4 rounded cursor-pointer bg-transparent border-0 p-0" />
                          </label>
                        </div>
                      </div>
                    ))}
                    <div className={`transition-all duration-300 ${bg !== 'none' || layout === 'banner' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-0.5">{layout === 'banner' && bg === 'none' ? 'Color Lateral' : 'Color Borde'}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setBorderColor('none')} className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${borderColor === 'none' ? 'border-[#ff4655] bg-[#ff4655]/10 text-[#ff4655]' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}>
                          Nada
                        </button>
                        <button onClick={() => setBorderColor('default')} className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${borderColor === 'default' ? 'border-[#ff4655] bg-[#ff4655]/10 text-[#ff4655]' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}>
                          Sutil
                        </button>
                        <label className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-lg px-2 py-1 cursor-pointer w-12">
                          <span className="sr-only">Elegir color de borde</span>
                          <input type="color" value={borderColor === 'default' || borderColor === 'none' ? '#ffffff' : borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-4 rounded cursor-pointer bg-transparent border-0 p-0" />
                        </label>
                      </div>
                    </div>
                    <div className={`col-span-2 transition-all duration-300 ${bg === 'solid' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide px-0.5 block mb-0.5">Color del Fondo Sólido</span>
                      <label className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-lg px-2 py-1 cursor-pointer w-1/2">
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-5 h-4 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <span className="text-[11px] text-neutral-300 font-mono uppercase">{bgColor}</span>
                      </label>
                    </div>
                  </>
                )}

                {activeTab === 'content' && (
                  <div className="col-span-2 flex flex-col gap-1">
                    {[
                      { checked: showRankIcon, setter: setShowRankIcon, label: 'Ícono de Rango', desc: 'Imagen de la medalla.' },
                      { checked: showName, setter: setShowName, label: 'Nombre de Jugador', desc: 'Riot ID del jugador.' },
                      { checked: showRR, setter: setShowRR, label: 'Puntos RR', desc: 'Muestra los puntos actuales.' },
                      { checked: showLastMatch, setter: setShowLastMatch, label: 'Última Partida', desc: 'Badge +/- RR.' },
                      { checked: showRankLabel, setter: setShowRankLabel, label: 'Etiqueta del Rango', desc: '"ORO 3", "PLATINO 2"…' },
                      { checked: showProgressBar, setter: setShowProgressBar, label: 'Barra de Progreso', desc: 'Línea de avance de RR.' },
                    ].map(({ checked, setter, label, desc }) => (
                      <label key={label} className="flex items-center gap-2 cursor-pointer group bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                        <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-[#ff4655]' : 'bg-white/10'}`}>
                          <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-[3px] transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}></div>
                        </div>
                        <input type="checkbox" className="hidden" checked={checked} onChange={(e) => setter(e.target.checked)} />
                        <div className="flex flex-col leading-none gap-0.5">
                          <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white transition-colors">{label}</span>
                          <span className="text-[9px] text-neutral-500 leading-tight">{desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* URL + COPY BUTTON */}
            <div className="mt-3 pt-3 border-t border-white/5 shrink-0">
              <button
                onClick={copyToClipboard}
                className="group w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold tracking-wide transition-all bg-[#0a0a0a] border text-neutral-300 hover:text-[#ff4655] shadow-sm"
                style={copied
                  ? { borderColor: '#ff4655', boxShadow: '0 0 12px rgba(255,70,85,0.3)', color: '#ff4655' }
                  : { borderColor: 'rgba(255,255,255,0.1)' }
                }
                onMouseEnter={e => { if (!copied) { (e.currentTarget as HTMLElement).style.borderColor = '#ff4655'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(255,70,85,0.2)'; } }}
                onMouseLeave={e => { if (!copied) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = ''; } }}
              >
                <iconify-icon icon={copied ? "solar:check-circle-bold" : "solar:copy-bold"} width="15"></iconify-icon>
                {copied ? t('overlayCopiedBtn') || '¡URL COPIADA!' : t('overlayCopyBtn') || 'COPIAR URL PARA OBS'}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: PREVIEW */}
          <div className="p-3 md:p-4 lg:p-5 lg:pl-6 bg-[#050505] flex flex-col lg:rounded-r-xl">
            {/* PREVIEW SECTION */}
            <div className="flex-1 flex flex-col">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-2 gap-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  {t('overlayPreview')}
                </span>

                {/* Preview BG Toggle */}
                <div className="flex items-center gap-2">
                  <div className="relative flex bg-[#111] border border-white/5 p-1 rounded-lg shrink-0 isolate w-48">
                    <div
                      className="absolute top-1 bottom-1 rounded-md border border-[#ff4655] bg-[#ff4655]/5 shadow-[0_0_10px_rgba(255,70,85,0.2)] transition-transform duration-300 ease-out -z-10"
                      style={{
                        left: '4px',
                        width: 'calc(50% - 4px)',
                        transform: `translateX(${!showMap ? '0' : '100%'})`
                      }}
                    />

                    <button
                      onClick={() => setShowMap(false)}
                      className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 ${!showMap ? 'text-[#ff4655]' : 'text-neutral-500 hover:text-white'}`}
                    >
                      Transparente
                    </button>

                    <button
                      onClick={() => setShowMap(true)}
                      className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 ${showMap ? 'text-[#ff4655]' : 'text-neutral-500 hover:text-white'}`}
                    >
                      Mapa
                    </button>
                  </div>

                  <div className={`flex items-center gap-1 transition-all duration-300 ${showMap ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}>
                    <button
                      onClick={() => setBgIndex(prev => prev === 0 ? backgrounds.length - 1 : prev - 1)}
                      className="w-6 h-6 bg-[#111] border border-white/5 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
                    >
                      <iconify-icon icon="solar:alt-arrow-left-linear"></iconify-icon>
                    </button>
                    <button
                      onClick={() => setBgIndex(prev => prev === backgrounds.length - 1 ? 0 : prev + 1)}
                      className="w-6 h-6 bg-[#111] border border-white/5 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
                    >
                      <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 w-full min-h-[220px] flex items-center justify-center rounded-xl overflow-hidden relative isolate transition-all duration-500 bg-cover bg-center`}
                style={showMap ? { backgroundImage: `url('/imgs/${backgrounds[bgIndex]}')` } : { backgroundImage: checkerboard }}
              >

                <div className="relative z-10 flex items-center justify-center w-full h-full p-4 overflow-hidden">
                  <div className="origin-center max-w-full flex items-center justify-center" style={{ transform: size === 'large' ? 'scale(0.85)' : 'scale(1)' }}>
                    <OverlayWidget
                      previewConfig={previewConfig}
                      previewData={previewData!}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
