import { useMemo, useRef } from 'react';
import { SWIPE_MINIMIZE_THRESHOLD_PX } from '../common/constants';
import type { SwipeHandlers } from '../common/types';

/** Calls `onSwipe` when the user drags down on a touch screen (mostly vertical). */
export function useSwipeDown(onSwipe: () => void): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null);
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;

  return useMemo(
    () => ({
      onTouchStart: (event) => {
        const touch = event.touches[0];
        start.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
      },
      onTouchEnd: (event) => {
        const from = start.current;
        const touch = event.changedTouches[0];
        start.current = null;
        if (!from || !touch) return;
        const dy = touch.clientY - from.y;
        const dx = Math.abs(touch.clientX - from.x);
        if (dy > SWIPE_MINIMIZE_THRESHOLD_PX && dy > dx * 1.5) onSwipeRef.current();
      },
    }),
    [],
  );
}
