import type { HlsConfig } from 'hls.js';
import type { StreamFailureReason } from '../types';

/**
 * hls.js tuning for public IPTV streams: a bit more buffer and more retries than the
 * defaults (servers are often slow), and no low-latency mode (it stalls on weak links).
 */
export const HLS_CONFIG: Partial<HlsConfig> = {
  enableWorker: true,
  lowLatencyMode: false,
  backBufferLength: 30,
  maxBufferLength: 30,
  maxMaxBufferLength: 60,
  liveSyncDurationCount: 3,
  liveMaxLatencyDurationCount: 8,
  maxBufferHole: 0.5,
  nudgeMaxRetry: 6,
  manifestLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 8000,
      maxLoadTimeMs: 12000,
      timeoutRetry: { maxNumRetry: 1, retryDelayMs: 0, maxRetryDelayMs: 0 },
      errorRetry: { maxNumRetry: 1, retryDelayMs: 1000, maxRetryDelayMs: 4000 },
    },
  },
  fragLoadPolicy: {
    default: {
      maxTimeToFirstByteMs: 10000,
      maxLoadTimeMs: 20000,
      timeoutRetry: { maxNumRetry: 3, retryDelayMs: 0, maxRetryDelayMs: 0 },
      errorRetry: { maxNumRetry: 5, retryDelayMs: 1000, maxRetryDelayMs: 8000 },
    },
  },
};

/** Stall watchdog: how often it checks and when each recovery step kicks in. */
export const STALL_CHECK_INTERVAL_MS = 1000;
/** Step 1: jump to the live edge / skip a small gap. */
export const STALL_NUDGE_AFTER_MS = 4000;
/** Step 2: reload the stream in place. */
export const STALL_RELOAD_AFTER_MS = 9000;
/** Step 3: give up on this stream (next stream, or retry the same one). */
export const STALL_GIVE_UP_AFTER_MS = 18000;
/** Audio advancing but no new video frames for this long = frozen picture. */
export const FROZEN_VIDEO_AFTER_MS = 6000;
/** Min currentTime progress (s) that counts as "moving". */
export const STALL_PROGRESS_EPSILON_S = 0.05;
/** Small forward skip to get past a buffer hole when there is no live edge. */
export const STALL_NUDGE_SKIP_S = 0.3;

/** Recoveries allowed before a stream is abandoned. */
export const MAX_MEDIA_RECOVERIES = 2;
export const MAX_NETWORK_RECOVERIES = 3;
export const NETWORK_RECOVERY_DELAY_MS = 1500;
/** When a channel has a single stream, reload it this many times before "Sin señal". */
export const MAX_SAME_STREAM_RELOADS = 2;

/** Most useful reason first when several streams failed differently. */
export const FAILURE_PRIORITY: StreamFailureReason[] = [
  'forbidden',
  'mixedContent',
  'network',
  'codec',
  'notFound',
  'stalled',
  'timeout',
  'unknown',
];

export const FAILURE_MESSAGES: Record<StreamFailureReason, { title: string; detail: string }> = {
  forbidden: {
    title: 'Acceso denegado (403)',
    detail: 'El servidor rechazó la conexión. Suele ser bloqueo por país o una señal que exige un token o una cabecera especial.',
  },
  mixedContent: {
    title: 'Señal no segura (http)',
    detail: 'La app está en https y el navegador bloquea señales http. Se soluciona pasando la señal por un proxy https.',
  },
  network: {
    title: 'El servidor no permite reproducir desde el navegador',
    detail: 'Bloqueo CORS o servidor caído. Un proxy propio puede saltarse el bloqueo CORS.',
  },
  codec: {
    title: 'Formato de video no compatible',
    detail: 'El navegador no puede decodificar esta señal (por ejemplo H.265/HEVC).',
  },
  notFound: {
    title: 'La señal ya no existe (404)',
    detail: 'La URL de la lista de iptv-org está desactualizada.',
  },
  stalled: {
    title: 'La señal se congela',
    detail: 'El servidor deja de enviar video. Se intentó recuperar varias veces sin éxito.',
  },
  timeout: {
    title: 'La señal no respondió a tiempo',
    detail: 'El servidor está lento o saturado.',
  },
  unknown: {
    title: 'Error desconocido',
    detail: 'La señal falló por un motivo que el navegador no informa.',
  },
};
