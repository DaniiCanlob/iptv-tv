import type { CSSProperties } from 'react';
import type { VolumeSliderProps } from '../../common/types';
import { volumeIcon, volumePercent } from '../../utils/volume';

export function VolumeSlider({ volume }: VolumeSliderProps) {
  const percent = volumePercent(volume.volume, volume.muted);
  const VolumeIcon = volumeIcon(volume.volume, volume.muted);

  return (
    <div
      className="flex h-11 items-center gap-3 rounded-full bg-black/60 pr-4 pl-1 backdrop-blur"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={volume.toggleMute}
        title={volume.muted ? 'Activar sonido (M)' : 'Silenciar (M)'}
        aria-label={volume.muted ? 'Activar sonido' : 'Silenciar'}
        className="grid size-9 place-items-center rounded-full transition hover:bg-white/20"
      >
        <VolumeIcon className="size-5" />
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={percent}
        aria-label="Volumen"
        onChange={(event) => volume.setVolume(Number(event.target.value) / 100)}
        style={{ '--fill': `${percent}%` } as CSSProperties}
        className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,var(--color-tv-accent)_var(--fill),rgb(255_255_255/0.25)_var(--fill))] [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
      <span className="w-9 text-right text-sm font-semibold tabular-nums">{percent}%</span>
    </div>
  );
}
