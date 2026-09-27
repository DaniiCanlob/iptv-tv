import { useCallback, useEffect, useRef, useState } from 'react';

/** Hidden flag that turns on for `timeoutMs` every time flash() is called. */
export function useFlash(timeoutMs: number): [boolean, () => void] {
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const flash = useCallback(() => {
    setVisible(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), timeoutMs);
  }, [timeoutMs]);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [visible, flash];
}
