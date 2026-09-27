import { RefreshCw, SatelliteDish } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ErrorScreenProps } from '../../common/types';

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => buttonRef.current?.focus(), []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <SatelliteDish className="size-16 text-tv-muted" strokeWidth={1.5} />
      <p className="text-3xl font-bold">No se pudo cargar la lista de canales</p>
      <p className="max-w-xl text-tv-muted">{message}</p>
      <button
        ref={buttonRef}
        type="button"
        data-nav=""
        onClick={onRetry}
        className="mt-4 rounded-2xl bg-tv-surface px-8 py-3 text-lg font-bold ring-1 ring-white/10 transition focus:scale-105 focus:bg-tv-accent focus:text-tv-bg"
      >
        <span className="flex items-center gap-2">
          <RefreshCw className="size-5" /> Reintentar
        </span>
      </button>
    </div>
  );
}
