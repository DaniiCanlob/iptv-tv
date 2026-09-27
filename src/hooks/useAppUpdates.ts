import { useEffect, useState } from 'react';
import type { UpdateStatus } from '../common/types';
import { onDesktopUpdateStatus } from '../services/desktopBridge';

/** Latest update status from the desktop shell (always null on the web). */
export function useAppUpdates(): [UpdateStatus | null, () => void] {
  const [status, setStatus] = useState<UpdateStatus | null>(null);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);

  useEffect(() => onDesktopUpdateStatus(setStatus), []);

  const visible = status && status.version !== dismissedVersion ? status : null;
  const dismiss = () => setDismissedVersion(status?.version ?? null);
  return [visible, dismiss];
}
