import { useStore } from '@nanostores/react';
import {
  isLoading, error, searchRegion, searchRiotId, searchTag,
  playerData, hasSearched, recentSearches, customApiKey, isApiKeyModalOpen
} from '../../store/appStore';
import { useTranslations } from '../../hooks/useTranslations';
import CustomSelect from '../ui/CustomSelect';

const MAX_RECENT_SEARCHES = 3;

const fieldClass =
  'w-full h-10 px-3 rounded-lg text-sm text-white placeholder-neutral-600 outline-none bg-[#111] border border-white/10 hover:border-[#ff4655]/50 focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655]/30 transition';

export default function SearchForm() {
  const loading = useStore(isLoading);
  const err = useStore(error);
  const region = useStore(searchRegion);
  const riotId = useStore(searchRiotId);
  const tag = useStore(searchTag);
  const recents = useStore(recentSearches);
  const userApiKey = useStore(customApiKey);

  const t = useTranslations();

  const performSearch = async (r: string, n: string, tId: string) => {
    if (!n || !tId) return;

    isLoading.set(true);
    error.set('');

    const apiKeyPart = userApiKey?.trim() ? `_${userApiKey.trim().slice(-6)}` : '';
    const cacheKey = `vlr_cache_${r}_${n.toLowerCase()}_${tId.toLowerCase()}${apiKeyPart}`;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 300000) {
            playerData.set(parsed.data);
            hasSearched.set(true);

            const newRecent = { region: r, riotId: n, tag: tId };
            const updatedRecents = [newRecent, ...recents.filter(x => x.riotId !== n || x.tag !== tId)].slice(0, MAX_RECENT_SEARCHES);
            recentSearches.set(updatedRecents);
            isLoading.set(false);
            return;
          }
        } catch {
          /* ignore bad cache */
        }
      }
    }

    try {
      let fetchUrl = `/api/summary/${r.toLowerCase()}/${encodeURIComponent(n)}/${encodeURIComponent(tId)}`;
      if (userApiKey?.trim()) {
        fetchUrl += `?api_key=${encodeURIComponent(userApiKey.trim())}`;
      }
      const res = await fetch(fetchUrl);
      const data = await res.json();

      if (data.status === 200) {
        playerData.set(data.data);
        hasSearched.set(true);

        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: data.data,
            timestamp: Date.now()
          }));
        }

        const newRecent = { region: r, riotId: n, tag: tId };
        const updatedRecents = [newRecent, ...recents.filter(x => x.riotId !== n || x.tag !== tId)].slice(0, MAX_RECENT_SEARCHES);
        recentSearches.set(updatedRecents);
      } else {
        error.set(data.error || data.message || t('errorSearch'));
      }
    } catch {
      error.set(t('errorConn'));
    } finally {
      isLoading.set(false);
    }
  };

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await performSearch(region, riotId, tag);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 md:p-6 w-full">
      <div className="flex items-center gap-2.5 mb-5">
        <iconify-icon icon="solar:magnifer-linear" width="18" className="text-[#ff4655] shrink-0"></iconify-icon>
        <div className="min-w-0">
          <h2 className="font-semibold text-base tracking-tight text-white leading-none">{t('searchTitle')}</h2>
          <p className="text-[11px] text-neutral-400 mt-1">{t('searchDesc')}</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)_100px] gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="region-select" className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
              {t('region')}
            </label>
            <CustomSelect
              id="region-select"
              value={region}
              onChange={(val) => searchRegion.set(val)}
              className="h-10"
              options={[
                { value: 'na', label: 'NA' },
                { value: 'latam', label: 'LATAM' },
                { value: 'br', label: 'BR' },
                { value: 'eu', label: 'EU' },
                { value: 'ap', label: 'AP' },
                { value: 'kr', label: 'KR' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label htmlFor="riot-id-input" className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
              Riot ID
            </label>
            <input
              id="riot-id-input"
              value={riotId}
              onChange={(e) => searchRiotId.set(e.target.value)}
              placeholder={t('namePlaceholder')}
              className={fieldClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tag-input" className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
              Tag
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">#</span>
              <input
                id="tag-input"
                value={tag}
                onChange={(e) => searchTag.set(e.target.value)}
                placeholder={t('tagPlaceholder')}
                className={`${fieldClass} pl-7`}
                required
              />
            </div>
          </div>
        </div>

        {err && (
          <div className="p-3 rounded-lg text-sm text-white flex items-center gap-2 bg-[#ff4655]/10 border border-[#ff4655]/20">
            <iconify-icon icon="solar:danger-triangle-bold" width="16" className="text-[#ff4655] shrink-0"></iconify-icon>
            {err}
          </div>
        )}

        <div className="pt-4 border-t border-white/5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="api-key-input" className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
              API Key HenrikDev <span className="font-normal normal-case tracking-normal text-neutral-500">(opcional)</span>
            </label>
            <button
              type="button"
              onClick={() => isApiKeyModalOpen.set(true)}
              className="text-[11px] text-[#ff4655]/80 hover:text-[#ff4655] hover:underline underline-offset-2 transition-colors cursor-pointer shrink-0"
            >
              ¿Usar mis límites?
            </button>
          </div>
          <input
            id="api-key-input"
            type="password"
            value={userApiKey}
            onChange={(e) => customApiKey.set(e.target.value)}
            className={fieldClass}
            placeholder="HDEV-XXXX-XXXX-XXXX..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg border border-[#ff4655] bg-[#0a0a0a] text-[#ff4655] hover:bg-[#ff4655]/10 font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <iconify-icon icon="svg-spinners:ring-resize" width="18"></iconify-icon>
          ) : (
            <iconify-icon icon="solar:magnifer-linear" width="16"></iconify-icon>
          )}
          {loading ? t('searchingBtn') : t('searchBtn')}
        </button>
      </form>

      {recents.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
          <span className="text-neutral-500">{t('recentSearches')}:</span>
          {recents.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => performSearch(r.region, r.riotId, r.tag)}
              className="text-neutral-300 hover:text-[#ff4655] transition-colors cursor-pointer"
            >
              {r.riotId}<span className="text-neutral-600">#{r.tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
