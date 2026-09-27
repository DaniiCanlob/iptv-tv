import type { OnBeforeSendHeadersListenerDetails, OnHeadersReceivedListenerDetails, Session } from 'electron';
import type { StreamHeaders } from '../src/common/types/desktop';
import {
  APP_ORIGIN,
  CORS_RESPONSE_HEADERS,
  DEV_SERVER_URL,
  NON_STREAM_HOSTS,
  BROWSER_USER_AGENT_TOKENS,
  STREAM_RESOURCE_TYPES,
  USER_AGENT_TOKEN_PATTERN,
} from './constants';

const WEB_REQUEST_FILTER = { urls: ['http://*/*', 'https://*/*'] };

/** Headers of the stream currently playing (one player at a time). */
let activeStreamHeaders: StreamHeaders | null = null;

export function setActiveStreamHeaders(headers: StreamHeaders | null): void {
  activeStreamHeaders = headers;
}

function isStreamRequest(details: { url: string; resourceType: string }): boolean {
  if (!STREAM_RESOURCE_TYPES.has(details.resourceType)) return false;
  if (details.url.startsWith(APP_ORIGIN)) return false;
  if (DEV_SERVER_URL && details.url.startsWith(DEV_SERVER_URL)) return false;
  try {
    return !NON_STREAM_HOSTS.has(new URL(details.url).hostname);
  } catch {
    return false;
  }
}

/** Drops app tokens such as "Electron/44.0" or "IPTVTV/1.0.0" (some servers block them). */
function browserLikeUserAgent(userAgent: string): string {
  return userAgent
    .replace(USER_AGENT_TOKEN_PATTERN, (token, name: string) => (BROWSER_USER_AGENT_TOKENS.has(name) ? token : ''))
    .trim();
}

function withoutHeaders(headers: Record<string, string[]>, names: string[]): Record<string, string[]> {
  const lower = names.map((n) => n.toLowerCase());
  return Object.fromEntries(Object.entries(headers).filter(([key]) => !lower.includes(key.toLowerCase())));
}

function rewriteRequestHeaders(details: OnBeforeSendHeadersListenerDetails): Record<string, string> {
  const headers = { ...details.requestHeaders };
  if (!isStreamRequest(details)) return headers;

  // Our app origin means nothing to stream servers and some reject it.
  delete headers.Origin;
  const { referrer, userAgent } = activeStreamHeaders ?? {};
  if (referrer) {
    headers.Referer = referrer;
    try {
      headers.Origin = new URL(referrer).origin;
    } catch {
      // Malformed referrer in the list: send it as Referer only.
    }
  }
  if (userAgent) headers['User-Agent'] = userAgent;
  return headers;
}

function rewriteResponse(details: OnHeadersReceivedListenerDetails) {
  const responseHeaders = {
    ...withoutHeaders(details.responseHeaders ?? {}, Object.keys(CORS_RESPONSE_HEADERS)),
    ...CORS_RESPONSE_HEADERS,
  };
  // Some servers answer CORS preflights with 4xx; the browser only needs a 2xx.
  const statusLine = details.method === 'OPTIONS' ? 'HTTP/1.1 204 No Content' : undefined;
  return { responseHeaders, statusLine };
}

/**
 * The desktop app plays streams a browser can't:
 * - CORS: every stream response is marked as readable by the app;
 * - Referer / User-Agent from iptv-org are added per stream;
 * - the default user agent drops the "Electron/x.y" token some servers block.
 */
export function configureNetwork(session: Session): void {
  session.setUserAgent(browserLikeUserAgent(session.getUserAgent()));

  session.webRequest.onBeforeSendHeaders(WEB_REQUEST_FILTER, (details, callback) => {
    callback({ requestHeaders: rewriteRequestHeaders(details) });
  });

  session.webRequest.onHeadersReceived(WEB_REQUEST_FILTER, (details, callback) => {
    callback(isStreamRequest(details) ? rewriteResponse(details) : {});
  });
}
