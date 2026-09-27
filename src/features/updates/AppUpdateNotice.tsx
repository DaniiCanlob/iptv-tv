import { UpdateToast } from '../../components/feedback/UpdateToast';
import { useAppUpdates } from '../../hooks/useAppUpdates';
import { installDesktopUpdate, openDesktopDownloadPage } from '../../services/desktopBridge';

/** Shows the desktop update toast when there is something to report (nothing on the web). */
export function AppUpdateNotice() {
  const [status, dismiss] = useAppUpdates();
  if (!status) return null;
  return (
    <UpdateToast
      status={status}
      onInstall={installDesktopUpdate}
      onDownload={() => {
        openDesktopDownloadPage();
        dismiss();
      }}
      onDismiss={dismiss}
    />
  );
}
