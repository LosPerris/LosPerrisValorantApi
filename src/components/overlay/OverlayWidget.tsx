import { useOverlayData, type OverlayConfig, type OverlayData } from './hooks/useOverlayData';
import { OverlayCard } from './layouts/OverlayCard';
import { OverlayHorizontal } from './layouts/OverlayHorizontal';
import { OverlayBanner } from './layouts/OverlayBanner';

export default function OverlayWidget({ 
  previewConfig, 
  previewData 
}: { 
  previewConfig?: OverlayConfig, 
  previewData?: OverlayData 
}) {
  const { data, error, loading, config, isAnimating } = useOverlayData(previewConfig, previewData);

  // In OBS, the overlay should be invisible if it's loading or has an error.
  if (loading || error || !data) return null;

  const animationClass = isAnimating ? 'animate-rank-pop' : '';

  return (
    <div className={`transition-transform duration-300 ${animationClass}`}>
      {config.layout === 'full' ? (
        <OverlayCard config={config} data={data} />
      ) : config.layout === 'banner' ? (
        <OverlayBanner config={config} data={data} />
      ) : (
        <OverlayHorizontal config={config} data={data} />
      )}
    </div>
  );
}
