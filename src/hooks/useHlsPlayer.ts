import Hls, { ErrorTypes, type ErrorData } from 'hls.js';
import { useEffect, useState, type RefObject } from 'react';
import {
  HLS_CONFIG,
  LIVE_EDGE_RESYNC_SECONDS,
  MAX_MEDIA_RECOVERIES,
  MAX_NETWORK_RECOVERIES,
  MAX_SAME_STREAM_RELOADS,
  NETWORK_RECOVERY_DELAY_MS,
  STREAM_TIMEOUT_MS,
} from '../common/constants';
import type { PlaybackState, StreamFailureReason, TvStream } from '../common/types';
import { applyStreamHeaders } from '../services/desktopBridge';
import { isHlsUrl } from '../utils/quality';
import { createStallWatchdog } from '../utils/stallWatchdog';
import { classifyHlsError, classifyNativeError, isBlockedMixedContent } from '../utils/streamFailures';

/**
 * Plays the channel's streams in order. Each stream gets several chances before
 * being abandoned: hls.js media/network recovery, a stall watchdog that nudges and
 * reloads frozen playback, and (for single-stream channels) full reloads.
 */
export function useHlsPlayer(
  videoRef: RefObject<HTMLVideoElement | null>,
  streams: TvStream[],
): PlaybackState {
  const [state, setState] = useState<PlaybackState>({
    status: 'idle',
    streamIndex: 0,
    totalStreams: streams.length,
    failures: [],
  });

  useEffect(() => {
    const current = videoRef.current;
    if (!current) return;
    const video: HTMLVideoElement = current;

    let hls: Hls | null = null;
    let index = 0;
    let startTimeout: number | undefined;
    let networkRetryTimer: number | undefined;
    let disposed = false;
    let hasPlayed = false;
    let watchdogArmed = false;
    let mediaRecoveries = 0;
    let networkRecoveries = 0;
    let sameStreamReloads = 0;
    const failures: StreamFailureReason[] = [];

    const publish = (status: PlaybackState['status']) =>
      setState({ status, streamIndex: index, totalStreams: streams.length, failures: [...failures] });

    const watchdog = createStallWatchdog({
      video,
      getLiveEdge: () => hls?.liveSyncPosition ?? null,
      onRecovering: () => publish('recovering'),
      onReload: () => reloadInPlace(),
      onFrozenVideo: () => recoverMedia(),
      onGiveUp: () => fail('stalled'),
    });

    const teardown = () => {
      watchdog.stop();
      watchdogArmed = false;
      window.clearTimeout(startTimeout);
      window.clearTimeout(networkRetryTimer);
      hls?.destroy();
      hls = null;
      video.removeAttribute('src');
      video.load();
    };

    const startPlayback = () => {
      video.play().catch((error: unknown) => {
        // Autoplay with sound blocked: retry muted.
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          video.muted = true;
          void video.play().catch(() => undefined);
        }
      });
    };

    const reloadInPlace = () => {
      if (hls) {
        hls.stopLoad();
        hls.startLoad(-1);
        hls.recoverMediaError();
      } else {
        const src = video.currentSrc;
        video.src = src;
      }
      startPlayback();
    };

    /** Decoder errors / frozen picture: hls.js can rebuild the media pipeline. */
    const recoverMedia = () => {
      if (!hls || mediaRecoveries >= MAX_MEDIA_RECOVERIES) {
        fail('codec');
        return;
      }
      mediaRecoveries += 1;
      publish('recovering');
      if (mediaRecoveries === MAX_MEDIA_RECOVERIES) hls.swapAudioCodec();
      hls.recoverMediaError();
    };

    /** Move on: next stream, or reload this one if it's the only option left. */
    const fail = (reason: StreamFailureReason) => {
      if (disposed) return;
      const isLast = index + 1 >= streams.length;
      // A single stream that already played deserves a few full reloads before giving up.
      if (isLast && hasPlayed && sameStreamReloads < MAX_SAME_STREAM_RELOADS) {
        sameStreamReloads += 1;
        tryStream(index, true);
        return;
      }
      failures.push(reason);
      tryStream(index + 1);
    };

    const onHlsError = (data: ErrorData) => {
      if (!data.fatal) return;
      if (data.type === ErrorTypes.MEDIA_ERROR) {
        recoverMedia();
        return;
      }
      // Network errors after playback started are usually transient (a slow segment).
      if (data.type === ErrorTypes.NETWORK_ERROR && hasPlayed && networkRecoveries < MAX_NETWORK_RECOVERIES) {
        networkRecoveries += 1;
        publish('recovering');
        window.clearTimeout(networkRetryTimer);
        networkRetryTimer = window.setTimeout(() => hls?.startLoad(-1), NETWORK_RECOVERY_DELAY_MS * networkRecoveries);
        return;
      }
      fail(classifyHlsError(data));
    };

    function tryStream(i: number, isReload = false) {
      if (disposed) return;
      teardown();
      index = i;
      if (!isReload) {
        hasPlayed = false;
        sameStreamReloads = 0;
      }
      mediaRecoveries = 0;
      networkRecoveries = 0;

      if (i >= streams.length) {
        publish('error');
        return;
      }
      const { url } = streams[i];
      if (isBlockedMixedContent(url)) {
        failures.push('mixedContent');
        tryStream(i + 1);
        return;
      }

      applyStreamHeaders(streams[i]);
      publish(isReload ? 'recovering' : 'loading');
      startTimeout = window.setTimeout(() => fail('timeout'), STREAM_TIMEOUT_MS);

      if (isHlsUrl(url) && Hls.isSupported()) {
        hls = new Hls(HLS_CONFIG);
        hls.on(Hls.Events.ERROR, (_event, data) => onHlsError(data));
        hls.on(Hls.Events.MANIFEST_PARSED, startPlayback);
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
        startPlayback();
      }
    }

    const onPlaying = () => {
      window.clearTimeout(startTimeout);
      // Armed once per source (a reload tears it down and it re-arms here).
      if (!watchdogArmed) {
        watchdog.arm();
        watchdogArmed = true;
      }
      hasPlayed = true;
      publish('playing');
    };

    // A live channel resumed after a pause would otherwise lag behind: jump to "now".
    const onResume = () => {
      const liveEdge = hls?.liveSyncPosition;
      if (liveEdge && liveEdge - video.currentTime > LIVE_EDGE_RESYNC_SECONDS) {
        video.currentTime = liveEdge;
      }
    };

    const onNativeError = () => {
      // hls.js reports its own errors; ignore stale events from a torn-down source.
      if (hls || !video.getAttribute('src') || !video.error) return;
      if (video.error.code === MediaError.MEDIA_ERR_ABORTED) return;
      fail(classifyNativeError(video.error));
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('error', onNativeError);
    video.addEventListener('play', onResume);
    tryStream(0);

    return () => {
      disposed = true;
      applyStreamHeaders(null);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('error', onNativeError);
      video.removeEventListener('play', onResume);
      teardown();
    };
  }, [videoRef, streams]);

  return state;
}
