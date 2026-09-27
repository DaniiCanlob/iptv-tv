import { Volume, Volume1, Volume2, VolumeX, type LucideIcon } from 'lucide-react';

export function clampVolume(value: number): number {
  return Math.min(1, Math.max(0, Math.round(value * 100) / 100));
}

export function volumeIcon(volume: number, muted: boolean): LucideIcon {
  if (muted || volume === 0) return VolumeX;
  if (volume < 0.34) return Volume;
  if (volume < 0.67) return Volume1;
  return Volume2;
}

export function volumePercent(volume: number, muted: boolean): number {
  return muted ? 0 : Math.round(volume * 100);
}
