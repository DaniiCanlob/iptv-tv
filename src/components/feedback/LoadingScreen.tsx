import { Tv } from 'lucide-react';
import type { LoadingScreenProps } from '../../common/types';

export function LoadingScreen({ loaded, total }: LoadingScreenProps) {
  const percent = Math.round((loaded / total) * 100);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <span className="grid size-20 animate-pulse place-items-center rounded-3xl bg-tv-accent text-tv-bg">
        <Tv className="size-10" strokeWidth={2.2} />
      </span>
      <p className="text-2xl font-bold">Cargando canales del mundo…</p>
      <div className="h-2 w-96 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-tv-accent transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-sm text-tv-muted">
        {loaded} de {total} listas descargadas desde iptv-org
      </p>
    </div>
  );
}
