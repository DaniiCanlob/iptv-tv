import { Star } from 'lucide-react';
import { memo } from 'react';
import { CARD_HOVER_FOCUS } from '../../common/constants';
import type { ChannelCardProps } from '../../common/types';
import { CountryFlag } from '../feedback/CountryFlag';
import { ChannelLogo } from './ChannelLogo';

function ChannelCardComponent({
  channel,
  number,
  country,
  favorite,
  isDefault,
  onPlay,
  onFocusChannel,
}: ChannelCardProps) {
  const live = channel.streams.length > 0;

  return (
    <button
      type="button"
      data-nav=""
      data-nav-default={isDefault ? '' : undefined}
      data-channel-id={channel.id}
      onClick={() => onPlay(channel)}
      onFocus={() => onFocusChannel(channel)}
      onMouseEnter={CARD_HOVER_FOCUS ? (e) => e.currentTarget.focus({ preventScroll: true }) : undefined}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-tv-surface text-left ring-1 ring-white/5 transition duration-200 ease-out focus:z-10 focus:scale-[1.06] focus:bg-tv-surface-2 focus:shadow-2xl focus:shadow-tv-accent/20 focus:ring-4 focus:ring-tv-accent"
    >
      <div className="relative aspect-video w-full bg-gradient-to-br from-tv-surface-2 to-tv-bg p-5">
        <ChannelLogo name={channel.name} src={channel.logo} className="h-full w-full" />
        <span className="absolute top-2 left-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[0.7rem] font-semibold text-white/70 tabular-nums">
          {number}
        </span>
        {favorite && (
          <Star className="absolute top-2 right-2 size-5 fill-tv-star text-tv-star drop-shadow" aria-label="Favorito" />
        )}
        {live && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-tv-live/90 px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wider uppercase">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            Vivo
          </span>
        )}
        {channel.bestQuality && (
          <span className="absolute right-2 bottom-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[0.65rem] font-bold text-white/80">
            {channel.bestQuality}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span title={country?.name}>
          <CountryFlag flag={country?.flag} className="text-base" />
        </span>
        <span className="truncate text-sm font-semibold text-white/90 group-focus:text-white">
          {channel.name}
        </span>
      </div>
    </button>
  );
}

export const ChannelCard = memo(ChannelCardComponent);
