/** Custom scheme that serves the built React app in production (acts like https). */
export const APP_SCHEME = 'app';
export const APP_HOST = 'tv';
export const APP_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;
export const APP_ENTRY_URL = `${APP_ORIGIN}/index.html`;

/** Set by scripts/dev-desktop.mjs; absent in the packaged app. */
export const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL ?? null;

export const WINDOW_OPTIONS = {
  width: 1366,
  height: 820,
  minWidth: 960,
  minHeight: 600,
  backgroundColor: '#07090f',
  title: 'IPTV TV',
} as const;

/** Request types that belong to video playback (hls.js uses XHR/fetch). */
export const STREAM_RESOURCE_TYPES = new Set(['xhr', 'media', 'other']);
/** Hosts never treated as streams (catalog API, fonts). */
export const NON_STREAM_HOSTS = new Set(['iptv-org.github.io', 'fonts.googleapis.com', 'fonts.gstatic.com']);
/** Only these "Name/version" tokens stay in the user agent, so servers see a plain Chrome. */
export const BROWSER_USER_AGENT_TOKENS = new Set(['Mozilla', 'AppleWebKit', 'Chrome', 'Safari']);
export const USER_AGENT_TOKEN_PATTERN = /\s?([\w.-]+)\/\S+/g;

export const CORS_RESPONSE_HEADERS: Record<string, string[]> = {
  'Access-Control-Allow-Origin': ['*'],
  'Access-Control-Allow-Headers': ['*'],
  'Access-Control-Allow-Methods': ['GET, HEAD, OPTIONS'],
};

/** Production CSP for the app itself (streams, logos and the API can come from anywhere). */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  'img-src * data: blob:',
  'media-src * data: blob:',
  'connect-src *',
  "worker-src 'self' blob:",
].join('; ');

export const UPDATE_FIRST_CHECK_DELAY_MS = 10_000;
export const UPDATE_CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000;
