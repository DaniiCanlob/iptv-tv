import { app, shell, type BrowserWindow } from 'electron';
import electronUpdater from 'electron-updater';
import type { UpdateStatus } from '../src/common/types/desktop';
import { UPDATE_CHECK_INTERVAL_MS, UPDATE_FIRST_CHECK_DELAY_MS } from './constants';
import { IPC } from './ipcChannels';
import { latestReleaseUrl } from './repository';

const { autoUpdater } = electronUpdater;

/**
 * Self-install works on Windows (NSIS) and Linux AppImage. macOS requires a paid
 * Apple signature and .deb has no updater, so those only get a "download" prompt.
 */
function canSelfInstall(): boolean {
  if (process.platform === 'win32') return true;
  if (process.platform === 'linux') return Boolean(process.env.APPIMAGE);
  return false;
}

export function setupAutoUpdates(getWindow: () => BrowserWindow | null): void {
  if (!app.isPackaged) return;

  const selfInstall = canSelfInstall();
  const send = (status: UpdateStatus) => getWindow()?.webContents.send(IPC.updateStatus, status);

  autoUpdater.autoDownload = selfInstall;
  autoUpdater.autoInstallOnAppQuit = selfInstall;

  let version = '';
  autoUpdater.on('update-available', (info) => {
    version = info.version;
    send(selfInstall ? { state: 'downloading', version, percent: 0 } : { state: 'available', version });
  });
  autoUpdater.on('download-progress', (progress) => {
    send({ state: 'downloading', version, percent: Math.round(progress.percent) });
  });
  autoUpdater.on('update-downloaded', (info) => send({ state: 'ready', version: info.version }));
  // Offline, rate-limited or no release yet: try again on the next interval.
  autoUpdater.on('error', (error) => console.warn('[updater]', error.message));

  const check = () => void autoUpdater.checkForUpdates().catch(() => undefined);
  setTimeout(check, UPDATE_FIRST_CHECK_DELAY_MS);
  setInterval(check, UPDATE_CHECK_INTERVAL_MS);
}

export function installUpdateNow(): void {
  autoUpdater.quitAndInstall();
}

export function openDownloadPage(): void {
  const url = latestReleaseUrl();
  if (url) void shell.openExternal(url);
}
