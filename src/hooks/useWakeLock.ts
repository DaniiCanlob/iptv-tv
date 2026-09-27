import { useEffect } from 'react';
import { isDesktopApp, setDesktopKeepAwake } from '../services/desktopBridge';

/**
 * Keeps the screen on while `active` (Screen Wake Lock API).
 * The browser drops the lock when the tab is hidden, so it is re-requested on return.
 * Only available in secure contexts (https or localhost); the desktop app uses the OS instead.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    // Desktop app: native power blocker, no secure-context or visibility limits.
    if (isDesktopApp()) {
      setDesktopKeepAwake(active);
      return () => setDesktopKeepAwake(false);
    }
    if (!active || !('wakeLock' in navigator)) return;
    let sentinel: WakeLockSentinel | null = null;
    let disposed = false;

    const request = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen');
        if (disposed) void lock.release();
        else sentinel = lock;
      } catch {
        // Denied (battery saver, insecure context…): the video still plays.
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void request();
    };

    void request();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      void sentinel?.release().catch(() => undefined);
    };
  }, [active]);
}
