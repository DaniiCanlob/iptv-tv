import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { PIP_LEAVE_SETTLE_MS } from '../common/constants';
import type { PictureInPictureCallbacks, PictureInPictureControls } from '../common/types';
import {
  enterPictureInPicture,
  exitPictureInPicture,
  isInPictureInPicture,
  isPictureInPictureSupported,
} from '../utils/pictureInPicture';

/** Floating system window (Picture-in-Picture) that stays on top of other apps. */
export function usePictureInPicture(
  videoRef: RefObject<HTMLVideoElement | null>,
  callbacks: PictureInPictureCallbacks,
): PictureInPictureControls {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(false);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setSupported(isPictureInPictureSupported(video));

    let wasInPip = false;
    let settleTimer: number | undefined;

    const sync = () => {
      const inPip = isInPictureInPicture(video);
      if (inPip === wasInPip) return;
      wasInPip = inPip;
      setActive(inPip);
      window.clearTimeout(settleTimer);
      if (inPip) {
        callbacksRef.current.onEnter();
        return;
      }
      // "Back to tab" keeps playing; closing the window with X pauses it.
      settleTimer = window.setTimeout(
        () => callbacksRef.current.onLeave(video.paused),
        PIP_LEAVE_SETTLE_MS,
      );
    };

    video.addEventListener('enterpictureinpicture', sync);
    video.addEventListener('leavepictureinpicture', sync);
    video.addEventListener('webkitpresentationmodechanged', sync);
    return () => {
      window.clearTimeout(settleTimer);
      video.removeEventListener('enterpictureinpicture', sync);
      video.removeEventListener('leavepictureinpicture', sync);
      video.removeEventListener('webkitpresentationmodechanged', sync);
      // Closing the player must also close the floating window.
      if (isInPictureInPicture(video)) void exitPictureInPicture(video).catch(() => undefined);
    };
  }, [videoRef]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const action = isInPictureInPicture(video) ? exitPictureInPicture : enterPictureInPicture;
    void action(video).catch(() => undefined);
  }, [videoRef]);

  return { supported, active, toggle };
}
