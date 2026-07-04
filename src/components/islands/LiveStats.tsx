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
      fetch('/api/system/stats')
        .then((res) => res.json())
        .then((data) => {
          if (data.data) setStats(data.data);
        })
        .catch(() => {});
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      data-reveal="true"
      className="opacity-0 relative z-10 max-w-6xl mx-auto px-6 pb-12"
      style={{ transitionDelay: '700ms' }}
    >
      <div
        style={{
          borderRadius: '18px',
          padding: '1px',
          background:
            'linear-gradient(90deg,rgba(255,70,85,0.55),rgba(42,42,48,0.4) 30%,rgba(42,42,48,0.4) 70%,rgba(169,112,255,0.55))',
        }}
      >
        <div
          style={{ background: 'linear-gradient(180deg,#121216,#0c0c0f)', borderRadius: '17px' }}
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-800/70"
        >
          <div className="p-5 flex items-center justify-center md:justify-start gap-4">
            <div
              style={{
                background: 'rgba(169,112,255,0.1)',
                border: '1px solid rgba(169,112,255,0.25)',
              }}
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            >
              <iconify-icon icon="solar:bolt-linear" width="20" className="text-[#a970ff]"></iconify-icon>
            </div>
            <div>
              <p className="text-xl font-bold text-white tracking-tight leading-none">
                {stats.latency > 0 ? `~${stats.latency}ms` : '—'}
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wide mt-1">{t('avgLatency')}</p>
            </div>
          </div>
          <div className="p-5 flex items-center justify-center md:justify-start gap-4">
            <div
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
              }}
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            >
              <iconify-icon icon="solar:server-linear" width="20" className="text-[#22c55e]"></iconify-icon>
            </div>
            <div>
              <p className="text-xl font-bold text-white tracking-tight leading-none">
                {formatRequests(stats.requests)}
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wide mt-1">{t('realRequests')}</p>
            </div>
          </div>
          <div className="p-5 flex items-center justify-center md:justify-start gap-4">
            <div
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.25)',
              }}
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            >
              <iconify-icon icon="solar:global-linear" width="20" className="text-[#f59e0b]"></iconify-icon>
            </div>
            <div>
              <p className="text-xl font-bold text-white tracking-tight leading-none">{REGIONS_COUNT}</p>
              <p className="text-xs text-neutral-400 uppercase tracking-wide mt-1">{t('regions')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
