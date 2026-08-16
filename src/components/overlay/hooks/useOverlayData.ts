import { useState, useEffect } from 'react';

export interface OverlayConfig {
  bg: string;
  size: string;
  layout: string;
  showName: boolean;
  showLastMatch: boolean;
  showRankIcon: boolean;
  showRankLabel: boolean;
  showRR: boolean;
  showProgressBar: boolean;
  rankColor: string;
  primaryColor: string;
  accentColor: string;
  progressColor: string;
  rrColor: string;
  borderColor: string;
  bgOpacity: string;
  borderRadius: string;
  iconPosition: string;
  bgColor: string;
}

export interface OverlayData {
  name: string;
  tag: string;
  tier: number;
  tierName: string;
  rr: number;
  iconUrl: string;
  lastChange: number;
}

export function useOverlayData(previewConfig?: OverlayConfig, previewData?: OverlayData) {
  const [data, setData] = useState<OverlayData | null>(previewData || null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!previewData);
  const [animationType, setAnimationType] = useState<'up' | 'down' | null>(null);
  const [lang, setLang] = useState('es');
  const [config, setConfig] = useState<OverlayConfig>(previewConfig || {
    bg: 'glass',
    size: 'normal',
    layout: 'full',
    showName: true,
    showLastMatch: true,
    showRankIcon: true,
    showRankLabel: true,
    showRR: true,
    showProgressBar: true,
    rankColor: 'auto',
    primaryColor: 'auto',
    accentColor: 'auto',
    progressColor: 'auto',
    rrColor: 'auto',
    borderColor: 'default',
    bgOpacity: '30',
    borderRadius: 'xl',
    iconPosition: 'left',
    bgColor: '#000000',
  });

  useEffect(() => {
    if (previewConfig) setConfig(previewConfig);
    if (previewData) {
      if (data && (previewData.rr !== data.rr || previewData.tier !== data.tier)) {
        const isUp = (previewData.tier > data.tier) || (previewData.tier === data.tier && previewData.rr > data.rr);
        setAnimationType(isUp ? 'up' : 'down');
        setTimeout(() => setAnimationType(null), 2500);
      }
      setData(previewData);
    }
  }, [previewConfig, previewData]);

  useEffect(() => {
    if (previewConfig || previewData) return;

    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const tag = params.get('tag');
    const region = params.get('region') || 'latam';
    const urlLang = params.get('lang') || 'es';
    setLang(urlLang);

    setConfig({
      bg: params.get('bg') || 'glass',
      size: params.get('size') || 'normal',
      layout: params.get('layout') || 'full',
      showName: params.get('showName') !== '0',
      showLastMatch: params.get('lastMatch') !== '0',
      showRankIcon: params.get('rankIcon') !== '0',
      showRankLabel: params.get('rankLabel') !== '0',
      showRR: params.get('showRR') !== '0',
      showProgressBar: params.get('showProgress') !== '0',
      rankColor: params.get('rankColor') || 'auto',
      primaryColor: params.get('color') || 'auto',
      accentColor: params.get('accent') || 'auto',
      progressColor: params.get('progress') || 'auto',
      rrColor: params.get('rrColor') || 'auto',
      borderColor: params.get('borderColor') || 'default',
      bgOpacity: params.get('bgOpacity') || '30',
      borderRadius: params.get('radius') || 'xl',
      iconPosition: params.get('iconPos') || 'left',
      bgColor: params.get('bgColor') || '#000000',
    });

    if (!name || !tag) {
      setError('Faltan parámetros (name, tag)');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const apiKey = params.get('api_key');
        let fetchUrl = `/api/overlay/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?lang=${urlLang}`;
        if (apiKey) {
          fetchUrl += `&api_key=${encodeURIComponent(apiKey)}`;
        }
        const res = await fetch(fetchUrl);

        if (res.status === 429) return;

        const json = await res.json();
        if (json.status !== 200) {
          throw new Error(json.errors?.[0]?.message || json.message || 'Error al obtener datos');
        }

        setData((prevData) => {
          // If we already have data and RR or Tier changed, trigger animation pop
          if (prevData && (prevData.rr !== json.data.rr || prevData.tier !== json.data.tier)) {
            const isUp = (json.data.tier > prevData.tier) || (json.data.tier === prevData.tier && json.data.rr > prevData.rr);
            setAnimationType(isUp ? 'up' : 'down');
            setTimeout(() => setAnimationType(null), 2500);
          }
          return json.data;
        });
        setError(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al obtener datos';
        setData((prev) => {
          if (!prev) setError(message);
          return prev;
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  return { data, error, loading, config, animationType, lang };
}
