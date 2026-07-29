import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { hasSearched } from '../../store/appStore';
import Hero from './Hero';
import SearchForm from './SearchForm';
import PlayerResults from './PlayerResults';
import LiveStats from './LiveStats';
import CommandWizard from './CommandWizard';
import OverlayGenerator from './OverlayGenerator';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function DashboardLayout() {
  const searched = useStore(hasSearched);
  const [animationParent] = useAutoAnimate();
  const [activeTool, setActiveTool] = useState<'commands' | 'overlay'>('commands');

  return (
    <div ref={animationParent} className="w-full flex flex-col items-center justify-center pt-2 md:pt-4 gap-6">
      {!searched && <Hero />}

      {!searched ? (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto gap-4 px-4">
          <div className="w-full max-w-2xl">
            <SearchForm />
          </div>

          <div className="w-full max-w-2xl">
            <LiveStats />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          <div className="w-full max-w-5xl mx-auto flex justify-start animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <button
              onClick={() => hasSearched.set(false)}
              className="group flex items-center gap-2.5 text-xs font-bold tracking-wide text-neutral-300 hover:text-[#ff4655] transition-all bg-[#0a0a0a] border border-white/10 hover:border-[#ff4655] hover:shadow-[0_0_12px_rgba(255,70,85,0.2)] px-5 py-2.5 rounded-xl shadow-sm"
            >
              <iconify-icon icon="solar:alt-arrow-left-linear" width="16" className="text-[#ff4655] transition-colors"></iconify-icon>
              NUEVA BÚSQUEDA
            </button>
          </div>

          <div className="w-full max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <PlayerResults />
          </div>

          <div className="w-full max-w-5xl mx-auto mt-2 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Herramientas</span>
              
              <div className="flex bg-black/40 rounded-lg p-1 border border-white/5 relative w-72">
                <div 
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#ff4655]/10 border border-[#ff4655]/30 rounded-md transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateX(${activeTool === 'commands' ? '0' : '100%'})`
                  }}
                />
                {[
                  { id: 'commands', label: 'Comandos', icon: 'solar:chat-round-line-bold-duotone' },
                  { id: 'overlay', label: 'Overlay OBS', icon: 'solar:monitor-camera-bold-duotone' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTool(tab.id as any)}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors duration-300 ${activeTool === tab.id ? 'text-[#ff4655]' : 'text-neutral-500 hover:text-white'}`}
                  >
                    <iconify-icon icon={tab.icon} width="14"></iconify-icon>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div ref={animationParent}>
              {activeTool === 'commands' ? <CommandWizard key="cmd" /> : <OverlayGenerator key="obs" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
