/** IPC channel names shared by the main process and the preload script. */
export const IPC = {
  setStreamHeaders: 'stream:set-headers',
  keepAwake: 'power:keep-awake',
  updateStatus: 'update:status',
  installUpdate: 'update:install',
  openDownloadPage: 'update:open-download-page',
} as const;
