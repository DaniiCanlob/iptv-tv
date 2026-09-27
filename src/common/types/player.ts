import type { TouchEvent } from 'react';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'recovering' | 'error';

/** Why a stream could not be played; drives the message on the "Sin señal" screen. */
export type StreamFailureReason =
  | 'mixedContent'
  | 'forbidden'
  | 'network'
  | 'notFound'
  | 'timeout'
  | 'codec'
  | 'stalled'
  | 'unknown';

export interface PlaybackState {
  status: PlaybackStatus;
  streamIndex: number;
  totalStreams: number;
  /** One entry per stream that failed, in the order they were tried. */
  failures: StreamFailureReason[];
}

export interface StallWatchdogOptions {
  video: HTMLVideoElement;
  /** Current live edge (hls.js) or null for non-live / native playback. */
  getLiveEdge: () => number | null;
  onRecovering: () => void;
  /** Reload the current source in place (hls.startLoad / recoverMediaError / video.load). */
  onReload: () => void;
  /** Video frames stopped while audio keeps going: decoder problem. */
  onFrozenVideo: () => void;
  onGiveUp: () => void;
}

export interface StallWatchdog {
  /** Call once playback has really started. */
  arm: () => void;
  stop: () => void;
}

export type PlayerMode = 'full' | 'mini';

/** Safari (iOS/macOS) picture-in-picture fallback. */
export interface WebkitPresentationVideo extends HTMLVideoElement {
  webkitSupportsPresentationMode?: (mode: string) => boolean;
  webkitSetPresentationMode?: (mode: 'inline' | 'picture-in-picture' | 'fullscreen') => void;
  webkitPresentationMode?: string;
}

export interface PictureInPictureControls {
  supported: boolean;
  active: boolean;
  toggle: () => void;
}

export interface PictureInPictureCallbacks {
  onEnter: () => void;
  /** `pausedOnLeave` is true when the window was closed with X (browsers pause the video). */
  onLeave: (pausedOnLeave: boolean) => void;
}

export interface PauseControls {
  paused: boolean;
  toggle: () => void;
  play: () => void;
}

export interface MediaSessionOptions {
  title: string;
  subtitle: string;
  artwork: string | null;
  onNext: () => void;
  onPrev: () => void;
  onEnterPictureInPicture: () => void;
}

export interface SwipeHandlers {
  onTouchStart: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
}

export interface VolumeState {
  /** 0..1 */
  volume: number;
  muted: boolean;
}

export interface VolumeControls extends VolumeState {
  setVolume: (volume: number) => void;
  changeBy: (delta: number) => void;
  toggleMute: () => void;
}
