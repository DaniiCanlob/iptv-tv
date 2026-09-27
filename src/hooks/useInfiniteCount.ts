import { useEffect, useRef, useState } from 'react';
import { GRID_PAGE_SIZE, GRID_PRELOAD_MARGIN_PX } from '../common/constants';
import type { InfiniteCountResult } from '../common/types';

/** Grows the rendered item count as the sentinel approaches the scroll container's viewport. */
export function useInfiniteCount(total: number, resetKey: string): InfiniteCountResult {
  const [count, setCount] = useState(GRID_PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCount(GRID_PAGE_SIZE);
    rootRef.current?.scrollTo({ top: 0 });
  }, [resetKey]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || count >= total) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCount((n) => Math.min(n + GRID_PAGE_SIZE, total));
        }
      },
      { root: rootRef.current, rootMargin: `${GRID_PRELOAD_MARGIN_PX}px 0px` },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [count, total]);

  return { count: Math.min(count, total), sentinelRef, rootRef };
}
