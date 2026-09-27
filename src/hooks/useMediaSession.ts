import { useEffect, useRef } from 'react';
import { MEDIA_SESSION_ALBUM } from '../common/constants';
import type { MediaSessionOptions } from '../common/types';

function setHandler(action: string, handler: MediaSessionActionHandler | null): void {
  try {
    navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler);
  } catch {
    // Action not supported by this browser.
  }
}

/**
 * Lock-screen / notification controls (next & previous channel) and the
 * 'enterpictureinpicture' action, which lets Chrome open the floating window
 * automatically when the user leaves the app while a channel is playing.
 */
export function useMediaSession(options: MediaSessionOptions): void {
  const ref = useRef(options);
  ref.current = options;
  const { title, subtitle, artwork } = options;

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: subtitle,
      album: MEDIA_SESSION_ALBUM,
      artwork: artwork ? [{ src: artwork }] : [],
    });
  }, [title, subtitle, artwork]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    setHandler('nexttrack', () => ref.current.onNext());
    setHandler('previoustrack', () => ref.current.onPrev());
    setHandler('enterpictureinpicture', () => ref.current.onEnterPictureInPicture());
    return () => {
      for (const action of ['nexttrack', 'previoustrack', 'enterpictureinpicture']) setHandler(action, null);
      navigator.mediaSession.metadata = null;
    };
  }, []);
}
