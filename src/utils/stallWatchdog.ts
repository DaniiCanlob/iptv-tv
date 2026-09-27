import {
  FROZEN_VIDEO_AFTER_MS,
  STALL_CHECK_INTERVAL_MS,
  STALL_GIVE_UP_AFTER_MS,
  STALL_NUDGE_AFTER_MS,
  STALL_NUDGE_SKIP_S,
  STALL_PROGRESS_EPSILON_S,
  STALL_RELOAD_AFTER_MS,
} from '../common/constants';
import type { StallWatchdog, StallWatchdogOptions } from '../common/types';

function decodedFrames(video: HTMLVideoElement): number | null {
  return video.getVideoPlaybackQuality?.().totalVideoFrames ?? null;
}

/**
 * Detects playback that looks alive but isn't:
 * - currentTime not moving while not paused (server stopped sending, buffer hole, drift);
 * - currentTime moving but no new video frames (picture frozen, audio still playing).
 * Recovers in escalating steps: nudge → reload in place → give up on the stream.
 */
export function createStallWatchdog(options: StallWatchdogOptions): StallWatchdog {
  const { video } = options;
  let timer: number | undefined;
  let lastTime = 0;
  let lastFrames: number | null = null;
  let stuckSince: number | null = null;
  let frozenSince: number | null = null;
  let step = 0;

  const reset = () => {
    lastTime = video.currentTime;
    lastFrames = decodedFrames(video);
    stuckSince = null;
    frozenSince = null;
    step = 0;
  };

  const nudge = () => {
    const liveEdge = options.getLiveEdge();
    if (liveEdge !== null && liveEdge > video.currentTime) video.currentTime = liveEdge;
    else video.currentTime += STALL_NUDGE_SKIP_S;
    void video.play().catch(() => undefined);
  };

  const tick = () => {
    if (video.paused || video.ended) {
      reset();
      return;
    }
    const now = Date.now();
    const time = video.currentTime;
    const frames = decodedFrames(video);
    // Our own nudges/seeks also move currentTime; only count it as progress
    // when the element actually has data to play.
    const moving =
      time - lastTime > STALL_PROGRESS_EPSILON_S && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;

    if (moving) {
      if (step > 0) step = 0;
      stuckSince = null;
      // Time moves but the decoder produced no frames: frozen picture.
      const framesStuck = frames !== null && lastFrames !== null && frames === lastFrames && video.videoWidth > 0;
      frozenSince = framesStuck ? (frozenSince ?? now) : null;
    } else {
      stuckSince ??= now;
      frozenSince = null;
    }
    lastTime = time;
    lastFrames = frames;

    if (frozenSince !== null && now - frozenSince >= FROZEN_VIDEO_AFTER_MS) {
      frozenSince = null;
      options.onFrozenVideo();
      return;
    }
    if (stuckSince === null) return;

    const stuckFor = now - stuckSince;
    if (stuckFor >= STALL_GIVE_UP_AFTER_MS && step < 3) {
      step = 3;
      options.onGiveUp();
    } else if (stuckFor >= STALL_RELOAD_AFTER_MS && step < 2) {
      step = 2;
      options.onRecovering();
      options.onReload();
    } else if (stuckFor >= STALL_NUDGE_AFTER_MS && step < 1) {
      step = 1;
      options.onRecovering();
      nudge();
    }
  };

  return {
    arm: () => {
      window.clearInterval(timer);
      reset();
      timer = window.setInterval(tick, STALL_CHECK_INTERVAL_MS);
    },
    stop: () => {
      window.clearInterval(timer);
      timer = undefined;
    },
  };
}
