import { useCallback, useEffect, useRef, useState } from 'react';

/** Visible flag that turns itself off after `timeoutMs`; re-shown whenever resetKey changes. */
export function useAutoHide(timeoutMs: number, resetKey: string): [boolean, () => void] {
  const [visible, setVisible] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback(() => {
    setVisible(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    show();
    return () => window.clearTimeout(timer.current);
  }, [resetKey, show]);

  return [visible, show];
}
