import { useCallback, useEffect, useState, type RefObject } from 'react';
import { DEFAULT_VOLUME, STORAGE_KEY_VOLUME } from '../common/constants';
import type { VolumeControls, VolumeState } from '../common/types';
import { readStorage, writeStorage } from '../services/storage';
import { clampVolume } from '../utils/volume';

/**
 * Volume + mute for the player's <video>, remembered between channels and visits.
 * Only user actions are saved, so a forced mute (autoplay policy) isn't persisted.
 */
export function useVolume(videoRef: RefObject<HTMLVideoElement | null>): VolumeControls {
  const [state, setState] = useState<VolumeState>(() => ({
    ...DEFAULT_VOLUME,
    ...readStorage<Partial<VolumeState>>(STORAGE_KEY_VOLUME, {}),
  }));

  // State -> element.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = state.volume;
    video.muted = state.muted;
  }, [videoRef, state]);

  // Element -> state (e.g. the browser muting autoplay, or native controls).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () =>
      setState((current) =>
        current.muted === video.muted && Math.abs(current.volume - video.volume) < 0.005
          ? current
          : { volume: clampVolume(video.volume), muted: video.muted },
      );
    video.addEventListener('volumechange', sync);
    return () => video.removeEventListener('volumechange', sync);
  }, [videoRef]);

  const commit = useCallback((update: (current: VolumeState) => VolumeState) => {
    setState((current) => {
      const next = update(current);
      writeStorage(STORAGE_KEY_VOLUME, next);
      return next;
    });
  }, []);

  const setVolume = useCallback(
    (volume: number) => commit(() => ({ volume: clampVolume(volume), muted: volume <= 0 })),
    [commit],
  );

  const changeBy = useCallback(
    (delta: number) =>
      commit((current) => {
        // Like YouTube: changing the volume while muted unmutes from the previous level.
        const volume = clampVolume(current.volume + delta);
        return { volume, muted: volume === 0 };
      }),
    [commit],
  );

  const toggleMute = useCallback(
    () =>
      commit((current) => ({
        // Unmuting at 0 would stay silent, so restore a sensible level.
        volume: current.muted && current.volume === 0 ? DEFAULT_VOLUME.volume : current.volume,
        muted: !current.muted,
      })),
    [commit],
  );

  return { ...state, setVolume, changeBy, toggleMute };
}
