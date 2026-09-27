import { ipcMain } from 'electron';
import type { StreamHeaders } from '../src/common/types/desktop';
import { IPC } from './ipcChannels';
import { setActiveStreamHeaders } from './network';
import { setKeepAwake } from './power';
import { installUpdateNow, openDownloadPage } from './updater';

export function registerIpcHandlers(): void {
  ipcMain.on(IPC.setStreamHeaders, (_event, headers: StreamHeaders | null) => setActiveStreamHeaders(headers));
  ipcMain.on(IPC.keepAwake, (_event, keepAwake: boolean) => setKeepAwake(Boolean(keepAwake)));
  ipcMain.on(IPC.installUpdate, () => installUpdateNow());
  ipcMain.on(IPC.openDownloadPage, () => openDownloadPage());
}
