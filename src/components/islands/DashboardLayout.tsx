import { useStore } from '@nanostores/react';
import { hasSearched } from '../../store/appStore';
import Hero from './Hero';
import SearchForm from './SearchForm';
import PlayerResults from './PlayerResults';
import LiveStats from './LiveStats';
import CommandWizard from './CommandWizard';
import DocsLinkCard from './DocsLinkCard';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function DashboardLayout() {
  const searched = useStore(hasSearched);
  const [animationParent] = useAutoAnimate();

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
            <CommandWizard />
          </div>
        </div>
      )}
    </div>
  );
}
