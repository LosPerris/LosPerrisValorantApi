import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { 
  lang, isLoading, error, searchRegion, searchRiotId, searchTag,
  playerData, hasSearched, recentSearches 
} from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';

import { cn } from '../../utils/cn';
import CustomSelect from '../ui/CustomSelect';

const MAX_RECENT_SEARCHES = 3;

export default function SearchForm() {
  const currentLang = useStore(lang);
  const loading = useStore(isLoading);
  const err = useStore(error);
  const region = useStore(searchRegion);
  const riotId = useStore(searchRiotId);
  const tag = useStore(searchTag);
  const recents = useStore(recentSearches);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vlr_recent_searches');
      if (saved) {
        try {
          recentSearches.set(JSON.parse(saved));
        } catch (e) {
          console.warn('Failed to parse recent searches from localStorage:', e);
        }
      }
    }
  }, []);

  const t = useTranslations();

  const performSearch = async (r: string, n: string, tId: string) => {
    if (!n || !tId) return;
    
    isLoading.set(true);
    error.set('');
    
    // CACHÉ DEL CLIENTE (Navegador)
    // Evita hacer peticiones al servidor si buscamos al mismo jugador hace menos de 5 minutos
    const cacheKey = `vlr_cache_${r}_${n.toLowerCase()}_${tId.toLowerCase()}`;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 300000) { // 5 minutos
            playerData.set(parsed.data);
            hasSearched.set(true);
            
            // Actualizar recientes
            const newRecent = { region: r, riotId: n, tag: tId };
            const updatedRecents = [newRecent, ...recents.filter(x => x.riotId !== n || x.tag !== tId)].slice(0, 3);
            recentSearches.set(updatedRecents);
            localStorage.setItem('vlr_recent_searches', JSON.stringify(updatedRecents));
            
            isLoading.set(false);
            return; // Detenemos la ejecución, no tocamos el servidor
          }
        } catch (e) {}
      }
    }
    
    try {
      const res = await fetch(`/api/summary/${r.toLowerCase()}/${encodeURIComponent(n)}/${encodeURIComponent(tId)}`);
      const data = await res.json();
      
      if (data.status === 200) {
        playerData.set(data.data);
        hasSearched.set(true);
        
        if (typeof window !== 'undefined') {
          // Guardar el resultado en caché del navegador
          localStorage.setItem(cacheKey, JSON.stringify({
            data: data.data,
            timestamp: Date.now()
          }));
        }
        
        // Agregar a recientes
        const newRecent = { region: r, riotId: n, tag: tId };
        const updatedRecents = [newRecent, ...recents.filter(x => x.riotId !== n || x.tag !== tId)].slice(0, MAX_RECENT_SEARCHES);
        recentSearches.set(updatedRecents);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vlr_recent_searches', JSON.stringify(updatedRecents));
        }
      } else {
        error.set(data.message || t('errorSearch'));
      }
    } catch (err) {
      error.set(t('errorConn'));
    } finally {
      isLoading.set(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await performSearch(region, riotId, tag);
  };

  return (
    <div 
      data-reveal="true" 
      className={cn(
        "opacity-0 rounded-[22px] p-[1.5px]",
        "bg-[linear-gradient(135deg,#ff4655,#16161b_32%,#16161b_64%,#a970ff)]",
        "shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)]"
      )}
      style={{ transitionDelay: '1100ms' }}
    >
      <div className="bg-[linear-gradient(180deg,#16161c,#0c0c0f)] rounded-[20.5px] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div style={{background:'rgba(255,70,85,0.12)',border:'1px solid rgba(255,70,85,0.3)'}} className="w-9 h-9 rounded-lg flex items-center justify-center">
              <iconify-icon icon="solar:magnifer-linear" width="16" className="text-[#ff4655]"></iconify-icon>
            </div>
            <div>
              <h3 className="font-semibold text-base tracking-tight text-white leading-none">{t('searchTitle')}</h3>
              <p className="text-[11px] text-neutral-400 mt-1">{t('searchDesc')}</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">Riot ID</span>
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_140px] gap-4">
            <div>
              <label htmlFor="region-select" className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">{t('region')}</label>
              <CustomSelect
                id="region-select"
                value={region}
                onChange={(val) => searchRegion.set(val)}
                options={[
                  { value: 'na', label: 'NA' },
                  { value: 'latam', label: 'LATAM' },
                  { value: 'eu', label: 'EU' },
                  { value: 'ap', label: 'AP' },
                  { value: 'kr', label: 'KR' },
                ]}
              />
            </div>
            <div>
              <label htmlFor="riot-id-input" className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Riot ID</label>
              <input 
                id="riot-id-input"
                value={riotId} 
                onChange={(e) => searchRiotId.set(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm text-white placeholder-neutral-600 outline-none bg-[#0a0a0d] border border-[#2a2a30] hover:border-[#ff4655] focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] transition"
                required
              />
            </div>
            <div>
              <label htmlFor="tag-input" className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Tag</label>
              <input 
                id="tag-input"
                value={tag} 
                onChange={(e) => searchTag.set(e.target.value)}
                placeholder={t('tagPlaceholder')}
                className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm text-white placeholder-neutral-600 outline-none bg-[#0a0a0d] border border-[#2a2a30] hover:border-[#ff4655] focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] transition"
                required
              />
            </div>
          </div>

          {err && (
            <div className="mt-4 p-3 rounded-lg text-sm text-white flex items-center gap-2" style={{background:'rgba(255,70,85,0.1)',border:'1px solid rgba(255,70,85,0.2)'}}>
              <iconify-icon icon="solar:danger-triangle-bold" width="16" className="text-[#ff4655]"></iconify-icon>
              {err}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{background:'linear-gradient(135deg,#ff4655,#e0303f)',boxShadow:'0 12px 32px -10px rgba(255,70,85,0.75)'}} 
            className="w-full mt-5 py-3 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff4655]/30 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <iconify-icon icon="svg-spinners:ring-resize" width="18"></iconify-icon>
            ) : (
              <iconify-icon icon="solar:chart-2-linear" width="18"></iconify-icon>
            )}
            {loading ? t('searchingBtn') : t('searchBtn')}
          </button>
        </form>

        {recents.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">{t('recentSearches')}:</span>
            {recents.map((r, i) => (
              <button 
                key={i} 
                onClick={() => performSearch(r.region, r.riotId, r.tag)}
                className="flex items-center gap-1 max-w-[130px] sm:max-w-[160px] px-2.5 py-1 rounded-full text-xs bg-[#0a0a0d] border border-[#2a2a30] text-white hover:bg-[#ff4655]/10 hover:border-[#ff4655]/50 hover:text-[#ff4655] transition-colors group"
              >
                <span className="truncate">{r.riotId}</span>
                <span className="text-neutral-500 group-hover:text-[#ff4655]/70 shrink-0">#{r.tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
