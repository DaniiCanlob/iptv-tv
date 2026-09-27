import type { ChannelGridProps } from '../../common/types';
import { useInfiniteCount } from '../../hooks/useInfiniteCount';
import { EmptyState } from '../feedback/EmptyState';
import { ChannelCard } from './ChannelCard';

export function ChannelGrid({
  channels,
  resetKey,
  countries,
  favorites,
  onPlay,
  onFocusChannel,
}: ChannelGridProps) {
  const { count, sentinelRef, rootRef } = useInfiniteCount(channels.length, resetKey);

  if (channels.length === 0) {
    return (
      <EmptyState
        title="No hay canales con estos filtros"
        hint="Prueba otra categoría, otro país o desactiva «Solo en vivo»."
      />
    );
  }

  return (
    <div ref={rootRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-8 pt-4 pb-16 group-data-mini-player/main:pb-72">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(12.5rem,1fr))] gap-5">
        {channels.slice(0, count).map((channel, index) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            number={index + 1}
            country={countries.get(channel.country)}
            favorite={favorites.has(channel.id)}
            isDefault={index === 0}
            onPlay={onPlay}
            onFocusChannel={onFocusChannel}
          />
        ))}
      </div>
      {count < channels.length && <div ref={sentinelRef} className="h-px" />}
    </div>
  );
}
