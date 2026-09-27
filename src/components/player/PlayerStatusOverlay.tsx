import { LoaderCircle, SatelliteDish } from 'lucide-react';
import { FAILURE_MESSAGES } from '../../common/constants';
import type { PlayerStatusOverlayProps } from '../../common/types';
import { mainFailure } from '../../utils/streamFailures';

export function PlayerStatusOverlay({ channel, playback, compact }: PlayerStatusOverlayProps) {
  const { status } = playback;

  if (compact) {
    if (status === 'playing') return null;
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-8">
        {status === 'error' ? (
          <span className="flex items-center gap-1.5 text-sm font-bold text-white/80">
            <SatelliteDish className="size-4" /> Sin señal
          </span>
        ) : (
          <div className="size-9 animate-spin rounded-full border-4 border-white/20 border-t-tv-accent" />
        )}
      </div>
    );
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5">
        <div className="size-16 animate-spin rounded-full border-4 border-white/20 border-t-tv-accent" />
        <p className="text-lg text-white/80">
          Sintonizando {channel.name}
          {playback.streamIndex > 0 && ` · probando señal ${playback.streamIndex + 1}`}…
        </p>
      </div>
    );
  }

  // Non-blocking: the last good frame stays visible while the watchdog works.
  if (status === 'recovering') {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center">
        <span className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold backdrop-blur">
          <LoaderCircle className="size-4 animate-spin text-tv-accent" />
          Recuperando señal…
        </span>
      </div>
    );
  }

  if (status === 'error') {
    const reason = mainFailure(playback.failures);
    const message = reason ? FAILURE_MESSAGES[reason] : null;
    return (
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[repeating-linear-gradient(45deg,#0b0d14_0_12px,#10131d_12px_24px)] px-8 text-center">
        <SatelliteDish className="size-16 text-white/70" strokeWidth={1.5} />
        <p className="text-3xl font-bold">Sin señal</p>
        {channel.streams.length === 0 || !message ? (
          <p className="max-w-xl text-white/60">
            Este canal no tiene transmisiones públicas en la lista de iptv-org.
          </p>
        ) : (
          <>
            <p className="text-lg font-semibold text-tv-accent">{message.title}</p>
            <p className="max-w-xl text-white/60">{message.detail}</p>
            {playback.failures.length > 1 && (
              <p className="text-sm text-white/40">
                Se probaron {playback.failures.length} señales: {playback.failures.map((f) => FAILURE_MESSAGES[f].title).join(' · ')}
              </p>
            )}
          </>
        )}
        {channel.website && <p className="mt-2 text-sm text-white/50">{channel.website}</p>}
      </div>
    );
  }

  return null;
}
