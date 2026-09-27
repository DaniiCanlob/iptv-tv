import type { WebkitPresentationVideo } from '../common/types';

const PIP_MODE = 'picture-in-picture';

export function isPictureInPictureSupported(video: HTMLVideoElement | null): boolean {
  if (typeof document === 'undefined') return false;
  if (document.pictureInPictureEnabled && !video?.disablePictureInPicture) return true;
  const webkit = video as WebkitPresentationVideo | null;
  return Boolean(webkit?.webkitSupportsPresentationMode?.(PIP_MODE));
}

export function isInPictureInPicture(video: HTMLVideoElement): boolean {
  return (
    document.pictureInPictureElement === video ||
    (video as WebkitPresentationVideo).webkitPresentationMode === PIP_MODE
  );
}

export async function enterPictureInPicture(video: HTMLVideoElement): Promise<void> {
  if (document.pictureInPictureEnabled) {
    await video.requestPictureInPicture();
    return;
  }
  (video as WebkitPresentationVideo).webkitSetPresentationMode?.(PIP_MODE);
}

export async function exitPictureInPicture(video: HTMLVideoElement): Promise<void> {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
    return;
  }
  (video as WebkitPresentationVideo).webkitSetPresentationMode?.('inline');
}
