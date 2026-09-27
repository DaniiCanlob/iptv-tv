/** Contract between the Electron preload (window.desktop) and the React app. */

export interface StreamHeaders {
  referrer: string | null;
  userAgent: string | null;
}

export type UpdateStatus =
  | { state: 'downloading'; version: string; percent: number }
  /** Downloaded; installs on restart. */
  | { state: 'ready'; version: string }
  /** Platform can't self-update (unsigned macOS, .deb): offer the download page. */
  | { state: 'available'; version: string };

export interface DesktopBridge {
  platform: string;
  /** Headers the main process adds to stream requests (null = none). */
  setStreamHeaders: (headers: StreamHeaders | null) => void;
  setKeepAwake: (keepAwake: boolean) => void;
  onUpdateStatus: (listener: (status: UpdateStatus) => void) => () => void;
  installUpdate: () => void;
  openDownloadPage: () => void;
}

declare global {
  interface Window {
    desktop?: DesktopBridge;
  }
}
