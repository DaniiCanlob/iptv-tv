import type { VolumeHudProps } from '../../common/types';
import { volumeIcon, volumePercent } from '../../utils/volume';

/** TV-style volume indicator shown briefly after remote/keyboard/wheel changes. */
export function VolumeHud({ visible, volume, muted }: VolumeHudProps) {
  const percent = volumePercent(volume, muted);
  const VolumeIcon = volumeIcon(volume, muted);

  return (
    <div
      className={`pointer-events-none absolute top-1/2 right-10 flex -translate-y-1/2 flex-col items-center gap-3 rounded-3xl bg-black/70 px-4 py-5 backdrop-blur transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span className="text-sm font-bold tabular-nums">{percent}</span>
      <div className="relative h-48 w-2.5 overflow-hidden rounded-full bg-white/20">
        <div
          className={`absolute inset-x-0 bottom-0 rounded-full transition-all duration-150 ${muted ? 'bg-white/40' : 'bg-tv-accent'}`}
          style={{ height: `${percent}%` }}
        />
      </div>
      <VolumeIcon className="size-6" />
    </div>
  );
}
