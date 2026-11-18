import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { hasSearched } from '../../store/appStore';
import Hero from './Hero';
import SearchForm from './SearchForm';
import PlayerResults from './PlayerResults';
import LiveStats from './LiveStats';
import CommandWizard from './CommandWizard';
import OverlayGenerator from './OverlayGenerator';

export default function DashboardLayout() {
  const searched = useStore(hasSearched);
  const [activeTool, setActiveTool] = useState<'commands' | 'overlay'>('commands');

  return (
    <div className="w-full flex flex-col items-center justify-center pt-2 md:pt-4 gap-6">
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
              type="button"
              onClick={() => hasSearched.set(false)}
              className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-[#ff4655] transition-colors cursor-pointer"
            >
              <iconify-icon icon="solar:alt-arrow-left-linear" width="14"></iconify-icon>
              Nueva búsqueda
            </button>
          </div>

          <div className="w-full max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <PlayerResults />
          </div>

          <div className="w-full max-w-5xl mx-auto mt-2 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <div className="flex items-center gap-5 mb-4 border-b border-white/10">
              {[
                { id: 'commands' as const, label: 'Comandos' },
                { id: 'overlay' as const, label: 'Overlay OBS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTool(tab.id)}
                  className={`relative pb-2.5 text-[12px] font-medium transition-colors cursor-pointer ${
                    activeTool === tab.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {tab.label}
                  {activeTool === tab.id && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#ff4655]" />
                  )}
                </button>
              ))}
            </div>

            {activeTool === 'commands' ? <CommandWizard key="cmd" /> : <OverlayGenerator key="obs" />}
          </div>
        </div>
      )}
    </div>
  );
}
