import { useRef } from 'react';
import {
  KEYS_CHANNEL_DOWN,
  KEYS_CHANNEL_UP,
  KEYS_EXPAND,
  KEYS_FAVORITE,
  KEYS_FULLSCREEN,
  KEYS_INFO,
  KEYS_MUTE,
  KEYS_PIP,
  KEYS_PLAY_PAUSE,
  KEYS_STOP,
  KEYS_VOLUME_DOWN,
  KEYS_VOLUME_UP,
  NAV_SCOPE_ATTR,
  OSD_TIMEOUT_MS,
  VOLUME_HUD_TIMEOUT_MS,
  VOLUME_STEP,
} from '../../common/constants';
import type { PlayerScreenProps } from '../../common/types';
import { useAutoHide } from '../../hooks/useAutoHide';
import { useFlash } from '../../hooks/useFlash';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useHlsPlayer } from '../../hooks/useHlsPlayer';
import { useKeyHandler } from '../../hooks/useKeyHandler';
import { useMediaSession } from '../../hooks/useMediaSession';
import { usePauseState } from '../../hooks/usePauseState';
import { usePictureInPicture } from '../../hooks/usePictureInPicture';
import { useSwipeDown } from '../../hooks/useSwipeDown';
import { useVolume } from '../../hooks/useVolume';
import { useWakeLock } from '../../hooks/useWakeLock';
import { isBackKey, isTypingTarget, matchesKey } from '../../utils/keys';
import { enterPictureInPicture } from '../../utils/pictureInPicture';
import { PlayerMiniControls } from './PlayerMiniControls';
import { PlayerOsd } from './PlayerOsd';
import { PlayerPausedOverlay } from './PlayerPausedOverlay';
import { PlayerPipPlaceholder } from './PlayerPipPlaceholder';
import { PlayerStatusOverlay } from './PlayerStatusOverlay';
import { PlayerTopBar } from './PlayerTopBar';
import { VolumeHud } from './VolumeHud';

const FULL_CLASS = 'fixed inset-0 z-50 bg-black';
const MINI_CLASS =
  'fixed right-6 bottom-6 z-30 aspect-video w-[min(26rem,calc(100vw-3rem))] cursor-pointer overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/70 ring-1 ring-white/15';

/**
 * One component for both modes so the <video> element (and the stream) survive
 * switching between full screen and the mini player.
 */
export function PlayerScreen({
  mode,
  channel,
  country,
  number,
  total,
  favorite,
  onClose,
  onMinimize,
  onExpand,
  onNext,
  onPrev,
  onToggleFavorite,
  onPictureInPictureChange,
}: PlayerScreenProps) {
  const isFull = mode === 'full';
  const videoRef = useRef<HTMLVideoElement>(null);
  const playback = useHlsPlayer(videoRef, channel.streams);
  const [osdVisible, showOsd] = useAutoHide(OSD_TIMEOUT_MS, channel.id);
  const toggleFullscreen = useFullscreen();
  const swipe = useSwipeDown(onMinimize);
  const volume = useVolume(videoRef);
  const [volumeHudVisible, flashVolumeHud] = useFlash(VOLUME_HUD_TIMEOUT_MS);

  const changeVolume = (delta: number) => {
    volume.changeBy(delta);
    flashVolumeHud();
  };
  const toggleMute = () => {
    volume.toggleMute();
    flashVolumeHud();
  };

  const pause = usePauseState(videoRef);

  // Like YouTube: entering the floating window shows the guide behind it;
  // "back to tab" returns to the big player; closing it with X leaves it paused in the corner.
  const pip = usePictureInPicture(videoRef, {
    onEnter: () => {
      onPictureInPictureChange(true);
      onMinimize();
    },
    onLeave: (pausedOnLeave) => {
      onPictureInPictureChange(false);
      if (!pausedOnLeave) onExpand();
    },
  });

  // While the video is in the floating window, "expand" brings it back to the app.
  const expand = () => (pip.active ? pip.toggle() : onExpand());
  useWakeLock(playback.status === 'playing' || playback.status === 'recovering');
  useMediaSession({
    title: channel.name,
    subtitle: country?.name ?? channel.country,
    artwork: channel.logo,
    onNext,
    onPrev,
    onEnterPictureInPicture: () => {
      if (videoRef.current) void enterPictureInPicture(videoRef.current).catch(() => undefined);
    },
  });

  useKeyHandler((event) => {
    if (isTypingTarget(event.target)) return;
    const handled = () => event.preventDefault();

    if (!isFull) {
      // A modal (country/language picker) owns the Back key while it is open.
      if (document.querySelector(`[${NAV_SCOPE_ATTR}]`)) return;
      if (isBackKey(event) || matchesKey(event, KEYS_STOP)) return handled(), onClose();
      if (matchesKey(event, KEYS_EXPAND)) return handled(), expand();
      if (matchesKey(event, KEYS_PIP)) return handled(), pip.toggle();
      if (matchesKey(event, KEYS_MUTE)) return handled(), volume.toggleMute();
      // Space is left alone here: it activates the focused card in the guide.
      if (event.key !== ' ' && matchesKey(event, KEYS_PLAY_PAUSE)) return handled(), pause.toggle();
      return;
    }

    if (isBackKey(event)) return handled(), onMinimize();
    if (matchesKey(event, KEYS_STOP)) return handled(), onClose();
    if (matchesKey(event, KEYS_CHANNEL_UP)) return handled(), onNext();
    if (matchesKey(event, KEYS_CHANNEL_DOWN)) return handled(), onPrev();
    if (matchesKey(event, KEYS_VOLUME_UP)) return handled(), changeVolume(VOLUME_STEP);
    if (matchesKey(event, KEYS_VOLUME_DOWN)) return handled(), changeVolume(-VOLUME_STEP);
    if (matchesKey(event, KEYS_MUTE)) return handled(), toggleMute();
    if (matchesKey(event, KEYS_FAVORITE)) return handled(), onToggleFavorite(), showOsd();
    if (matchesKey(event, KEYS_PIP)) return handled(), pip.toggle();
    if (matchesKey(event, KEYS_PLAY_PAUSE)) return handled(), pause.toggle(), showOsd();
    if (matchesKey(event, KEYS_FULLSCREEN)) return handled(), toggleFullscreen();
    if (matchesKey(event, KEYS_INFO)) return handled(), showOsd();
  });

  return (
    <div
      className={`${isFull ? FULL_CLASS : MINI_CLASS} ${isFull && !osdVisible ? 'cursor-none' : ''}`}
      onMouseMove={isFull ? showOsd : undefined}
      onClick={isFull ? showOsd : expand}
      onDoubleClick={isFull ? toggleFullscreen : undefined}
      onWheel={isFull ? (event) => changeVolume(event.deltaY < 0 ? VOLUME_STEP : -VOLUME_STEP) : undefined}
      {...(isFull ? swipe : {})}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        playsInline
        autoPlay
        // Safari: jump to the floating window automatically when leaving the app.
        {...{ autopictureinpicture: '' }}
      />
      {pip.active ? (
        <PlayerPipPlaceholder compact={!isFull} onReturn={pip.toggle} />
      ) : (
        <>
          <PlayerStatusOverlay channel={channel} playback={playback} compact={!isFull} />
          {pause.paused && playback.status === 'playing' && (
            <PlayerPausedOverlay compact={!isFull} onPlay={pause.play} />
          )}
        </>
      )}
      {isFull ? (
        <>
          <PlayerOsd
            visible={osdVisible}
            channel={channel}
            country={country}
            number={number}
            total={total}
            favorite={favorite}
            playback={playback}
          />
          <PlayerTopBar
            visible={osdVisible}
            pip={pip}
            volume={volume}
            onMinimize={onMinimize}
            onClose={onClose}
          />
          <VolumeHud visible={volumeHudVisible} volume={volume.volume} muted={volume.muted} />
        </>
      ) : (
        <PlayerMiniControls
          channel={channel}
          country={country}
          pip={pip}
          volume={volume}
          pause={pause}
          onExpand={expand}
          onClose={onClose}
        />
      )}
    </div>
  );
}
