import { ErrorDetails, ErrorTypes, type ErrorData } from 'hls.js';
import { FAILURE_PRIORITY } from '../common/constants';
import type { StreamFailureReason } from '../common/types';
import { isDesktopApp } from '../services/desktopBridge';

/** An http stream can't load on an https page (mixed content), so skip it right away. */
export function isBlockedMixedContent(url: string): boolean {
  // The desktop app allows http streams on its secure app:// page.
  if (isDesktopApp()) return false;
  return window.location.protocol === 'https:' && url.startsWith('http:');
}

export function classifyHlsError(data: ErrorData): StreamFailureReason {
  if (data.type === ErrorTypes.MEDIA_ERROR) return 'codec';
  if (data.type !== ErrorTypes.NETWORK_ERROR) return 'unknown';

  const code = data.response?.code ?? 0;
  if (code === 401 || code === 403 || code === 451) return 'forbidden';
  if (code === 404 || code === 410) return 'notFound';
  if (
    data.details === ErrorDetails.MANIFEST_LOAD_TIMEOUT ||
    data.details === ErrorDetails.LEVEL_LOAD_TIMEOUT ||
    data.details === ErrorDetails.FRAG_LOAD_TIMEOUT
  ) {
    return 'timeout';
  }
  // Status 0: CORS rejection, DNS failure or connection refused (the browser hides which).
  return 'network';
}

export function classifyNativeError(error: MediaError | null): StreamFailureReason {
  if (!error) return 'unknown';
  if (error.code === MediaError.MEDIA_ERR_DECODE || error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
    return 'codec';
  }
  if (error.code === MediaError.MEDIA_ERR_NETWORK) return 'network';
  return 'unknown';
}

export function mainFailure(failures: StreamFailureReason[]): StreamFailureReason | null {
  return FAILURE_PRIORITY.find((reason) => failures.includes(reason)) ?? null;
}
