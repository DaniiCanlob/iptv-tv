import { ChevronsLeftRight, ChevronsUpDown, Star } from 'lucide-react';
import type { PlayerOsdProps } from '../../common/types';
import { ChannelLogo } from '../channels/ChannelLogo';
import { CountryFlag } from '../feedback/CountryFlag';

export function PlayerOsd({ visible, channel, country, number, total, favorite, playback }: PlayerOsdProps) {
  const stream = channel.streams[playback.streamIndex];

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-12 pt-24 pb-10 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center gap-8">
        <div className="text-6xl font-extrabold text-tv-accent tabular-nums">{number}</div>
        <ChannelLogo
          name={channel.name}
          src={channel.logo}
          className="aspect-video h-24 rounded-xl bg-white/10 p-3"
          textClassName="text-3xl"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 text-sm text-white/70">
            <CountryFlag flag={country?.flag} className="text-xl" />
            <span>{country?.name ?? channel.country}</span>
            {playback.status === 'playing' && (
              <span className="flex items-center gap-1.5 rounded bg-tv-live px-2 py-0.5 text-xs font-bold text-white uppercase">
                <span className="size-1.5 animate-pulse rounded-full bg-white" /> En vivo
              </span>
            )}
            {stream?.quality && <span className="rounded bg-white/15 px-2 py-0.5 text-xs font-bold">{stream.quality}</span>}
            {favorite && <Star className="size-4 fill-tv-star text-tv-star" aria-label="Favorito" />}
          </div>
          <h2 className="mt-1 truncate text-4xl font-extrabold">{channel.name}</h2>
          <p className="mt-1 text-sm text-white/50">
            Canal {number} de {total}
            {playback.totalStreams > 1 && ` · Señal ${Math.min(playback.streamIndex + 1, playback.totalStreams)}/${playback.totalStreams}`}
          </p>
        </div>
        <div className="flex flex-col gap-1 text-right text-sm text-white/60">
          <span className="flex items-center justify-end gap-1.5">
            <ChevronsUpDown className="size-4" /> Cambiar canal · <ChevronsLeftRight className="size-4" /> Volumen · M
            Silencio
          </span>
          <span>F Favorito · P Ventana flotante · Z Pantalla completa</span>
          <span>K Pausa · Atrás Minimizar · X Cerrar</span>
        </div>
      </div>
    </div>
  );
}
