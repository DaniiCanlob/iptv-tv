import type { DesktopBridge, StreamHeaders, TvStream, UpdateStatus } from '../common/types';

/** The Electron preload bridge, or null when running as a regular web page. */
const bridge: DesktopBridge | null = typeof window !== 'undefined' ? (window.desktop ?? null) : null;

export function isDesktopApp(): boolean {
  return bridge !== null;
}

/** Tell the desktop shell which Referer / User-Agent the next stream requests need. */
export function applyStreamHeaders(stream: TvStream | null): void {
  if (!bridge) return;
  const headers: StreamHeaders | null = stream?.needsHeaders
    ? { referrer: stream.referrer, userAgent: stream.userAgent }
    : null;
  bridge.setStreamHeaders(headers);
}

export function setDesktopKeepAwake(keepAwake: boolean): void {
  bridge?.setKeepAwake(keepAwake);
}

export function onDesktopUpdateStatus(listener: (status: UpdateStatus) => void): () => void {
  return bridge ? bridge.onUpdateStatus(listener) : () => undefined;
}

export function installDesktopUpdate(): void {
  bridge?.installUpdate();
}

export function openDesktopDownloadPage(): void {
  bridge?.openDownloadPage();
}
