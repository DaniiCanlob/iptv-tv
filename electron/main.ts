import { app, BrowserWindow, session } from 'electron';
import { DEV_SERVER_URL } from './constants';
import { registerIpcHandlers } from './ipc';
import { configureMenu } from './menu';
import { configureNetwork } from './network';
import { RENDERER_DIR } from './paths';
import { registerAppScheme, serveRenderer } from './protocol';
import { setupAutoUpdates } from './updater';
import { createMainWindow } from './window';

registerAppScheme();

let mainWindow: BrowserWindow | null = null;

function openMainWindow(): void {
  mainWindow = createMainWindow();
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

if (!app.requestSingleInstanceLock()) {
  // A second launch just focuses the running app.
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  void app.whenReady().then(() => {
    configureMenu();
    configureNetwork(session.defaultSession);
    if (!DEV_SERVER_URL) serveRenderer(RENDERER_DIR);
    registerIpcHandlers();
    openMainWindow();
    setupAutoUpdates(() => mainWindow);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) openMainWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
