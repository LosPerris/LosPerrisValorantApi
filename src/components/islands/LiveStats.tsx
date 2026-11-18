import { useEffect, useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const REGIONS_COUNT = 6; // na, latam, br, eu, ap, kr

function formatRequests(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

export default function LiveStats() {
  const [stats, setStats] = useState({ latency: 0, requests: 0 });
  const t = useTranslations();

  useEffect(() => {
    const fetchStats = () => {
      // No hacer fetch si el tab está en background
      if (document.visibilityState === 'hidden') return;
      fetch('/api/system/stats')
        .then((res) => res.json())
        .then((data) => {
          if (data.data) setStats(data.data);
        })
        .catch(() => {});
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60_000);

    // Refetch al volver al tab si han pasado los 60s
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchStats();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <section className="relative z-10 w-full">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-2 sm:p-4 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
        <div className="py-2 sm:py-0 sm:px-4 flex items-center gap-3">
          <iconify-icon icon="solar:bolt-linear" width="18" className="text-[#ff4655] shrink-0"></iconify-icon>
          <div>
            <p className="text-base font-bold text-white tracking-tight leading-none">
              {stats.latency > 0 ? (
                `~${stats.latency} ms`
              ) : (
                '—'
              )}
            </p>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mt-0.5">{t('avgLatency')}</p>
          </div>
        </div>
        
        <div className="py-2 sm:py-0 sm:px-4 flex items-center gap-3">
          <iconify-icon icon="solar:server-linear" width="18" className="text-[#ff4655] shrink-0"></iconify-icon>
          <div>
            <p className="text-base font-bold text-white tracking-tight leading-none">
              {formatRequests(stats.requests)}
            </p>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mt-0.5">{t('realRequests')}</p>
          </div>
        </div>
        
        <div className="py-2 sm:py-0 sm:px-4 flex items-center gap-3">
          <iconify-icon icon="solar:global-linear" width="18" className="text-[#ff4655] shrink-0"></iconify-icon>
          <div>
            <p className="text-base font-bold text-white tracking-tight leading-none">{REGIONS_COUNT}</p>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mt-0.5">{t('regions')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
