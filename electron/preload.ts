import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import type { DesktopBridge, StreamHeaders, UpdateStatus } from '../src/common/types/desktop';
import { IPC } from './ipcChannels';

/** Everything the React app can ask of the desktop shell (exposed as window.desktop). */
const bridge: DesktopBridge = {
  platform: process.platform,
  setStreamHeaders: (headers: StreamHeaders | null) => ipcRenderer.send(IPC.setStreamHeaders, headers),
  setKeepAwake: (keepAwake: boolean) => ipcRenderer.send(IPC.keepAwake, keepAwake),
  onUpdateStatus: (listener) => {
    const handler = (_event: IpcRendererEvent, status: UpdateStatus) => listener(status);
    ipcRenderer.on(IPC.updateStatus, handler);
    return () => ipcRenderer.removeListener(IPC.updateStatus, handler);
  },
  installUpdate: () => ipcRenderer.send(IPC.installUpdate),
  openDownloadPage: () => ipcRenderer.send(IPC.openDownloadPage),
};

contextBridge.exposeInMainWorld('desktop', bridge);
