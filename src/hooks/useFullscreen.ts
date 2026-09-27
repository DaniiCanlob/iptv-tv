import { useCallback } from 'react';

export function useFullscreen() {
  return useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    else void document.documentElement.requestFullscreen?.().catch(() => undefined);
  }, []);
}
