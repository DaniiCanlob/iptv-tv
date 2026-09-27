import { PictureInPicture2 } from 'lucide-react';
import type { PlayerPipPlaceholderProps } from '../../common/types';

/** Shown in the page while the video lives in the floating window. */
export function PlayerPipPlaceholder({ compact, onReturn }: PlayerPipPlaceholderProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-tv-surface text-center ${compact ? 'pb-10' : 'gap-4'}`}
    >
      <PictureInPicture2 className={`text-tv-accent ${compact ? 'size-7' : 'size-16'}`} />
      <p className={`font-semibold ${compact ? 'text-xs' : 'text-2xl'}`}>En ventana flotante</p>
      {!compact && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onReturn();
          }}
          className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/20"
        >
          Traer de vuelta a la app
        </button>
      )}
    </div>
  );
}
