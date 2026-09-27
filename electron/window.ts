import { BrowserWindow, shell } from 'electron';
import { APP_ENTRY_URL, APP_ORIGIN, DEV_SERVER_URL, WINDOW_OPTIONS } from './constants';
import { PRELOAD_PATH } from './paths';

function isAppUrl(url: string): boolean {
  return url.startsWith(APP_ORIGIN) || (DEV_SERVER_URL !== null && url.startsWith(DEV_SERVER_URL));
}

export function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    ...WINDOW_OPTIONS,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: PRELOAD_PATH,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      // The app runs on a secure scheme; many IPTV streams are plain http.
      allowRunningInsecureContent: true,
      // Keep playing (and the floating window updating) while minimized.
      backgroundThrottling: false,
    },
  });

  window.once('ready-to-show', () => window.show());

  // External links open in the system browser; the app never navigates away.
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, url) => {
    if (!isAppUrl(url)) event.preventDefault();
  });

  // F11 toggles fullscreen like a browser.
  window.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      event.preventDefault();
      window.setFullScreen(!window.isFullScreen());
    }
  });

  void window.loadURL(DEV_SERVER_URL ?? APP_ENTRY_URL);
  if (DEV_SERVER_URL) window.webContents.openDevTools({ mode: 'detach' });
  return window;
}
