import { Play } from 'lucide-react';
import type { PlayerPausedOverlayProps } from '../../common/types';

/** Big play button shown whenever the video is paused (e.g. after closing the floating window). */
export function PlayerPausedOverlay({ compact, onPlay }: PlayerPausedOverlayProps) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 ${compact ? 'pb-8' : ''}`}>
      <button
        type="button"
        aria-label="Reproducir"
        title="Reproducir"
        onClick={(event) => {
          event.stopPropagation();
          onPlay();
        }}
        className={`grid place-items-center rounded-full bg-white/90 text-tv-bg shadow-2xl transition hover:scale-105 hover:bg-white ${
          compact ? 'size-12' : 'size-24'
        }`}
      >
        <Play className={`fill-current ${compact ? 'ml-0.5 size-5' : 'ml-1.5 size-10'}`} />
      </button>
    </div>
  );
}
