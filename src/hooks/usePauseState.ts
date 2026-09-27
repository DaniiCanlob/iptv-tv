import { useCallback, useEffect, useState, type RefObject } from 'react';
import type { PauseControls } from '../common/types';

/** Mirrors the <video> paused state so the UI can offer a play button. */
export function usePauseState(videoRef: RefObject<HTMLVideoElement | null>): PauseControls {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPause = () => setPaused(true);
    const onPlay = () => setPaused(false);
    video.addEventListener('pause', onPause);
    video.addEventListener('play', onPlay);
    video.addEventListener('playing', onPlay);
    return () => {
      video.removeEventListener('pause', onPause);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('playing', onPlay);
    };
  }, [videoRef]);

  const play = useCallback(() => {
    void videoRef.current?.play().catch(() => undefined);
  }, [videoRef]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  }, [videoRef]);

  return { paused, toggle, play };
}
