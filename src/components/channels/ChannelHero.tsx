import { Languages, Star } from 'lucide-react';
import type { ChannelHeroProps } from '../../common/types';
import { hostname } from '../../utils/text';
import { CountryFlag } from '../feedback/CountryFlag';
import { Kbd } from '../feedback/Kbd';
import { ChannelLogo } from './ChannelLogo';

export function ChannelHero({ channel, country, categoryNames, languages, favorite }: ChannelHeroProps) {
  if (!channel) return <div className="h-52 shrink-0" />;

  const site = hostname(channel.website);
  const languageNames = channel.languages.map((code) => languages.get(code)?.name ?? code);
  const meta = [
    channel.network && `Red: ${channel.network}`,
    channel.owners.length > 0 && `Propietario: ${channel.owners.join(', ')}`,
    channel.launched && `Desde ${channel.launched.slice(0, 4)}`,
    site,
  ].filter(Boolean);

  return (
    <section className="relative flex h-52 shrink-0 items-center gap-8 overflow-hidden px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-tv-accent/15 via-transparent to-transparent" />
      <ChannelLogo
        key={channel.id}
        name={channel.name}
        src={channel.logo}
        className="aspect-video h-36 shrink-0 rounded-2xl bg-tv-surface p-5 ring-1 ring-white/10"
        textClassName="text-5xl"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-3 text-sm text-tv-muted">
          <CountryFlag flag={country?.flag} className="text-2xl" iconClassName="size-5" />
          <span>{country?.name ?? channel.country}</span>
          {channel.streams.length > 0 ? (
            <span className="rounded-md bg-tv-live/90 px-2 py-0.5 text-xs font-bold text-white uppercase">
              En vivo · {channel.streams.length} {channel.streams.length === 1 ? 'señal' : 'señales'}
            </span>
          ) : (
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold">Sin señal</span>
          )}
          {favorite && (
            <span className="flex items-center gap-1 text-tv-star">
              <Star className="size-4 fill-tv-star" /> Favorito
            </span>
          )}
        </div>
        <h1 className="truncate text-4xl font-extrabold tracking-tight">{channel.name}</h1>
        {channel.altNames.length > 0 && (
          <p className="mt-1 truncate text-sm text-tv-muted">También: {channel.altNames.join(' · ')}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {channel.categories.map((id) => (
            <span key={id} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              {categoryNames.get(id) ?? id}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 truncate text-sm text-tv-muted">
          {languageNames.length > 0 && (
            <>
              <Languages className="size-4 shrink-0" aria-label="Idiomas" />
              <span className="truncate">{languageNames.join(', ')}</span>
              {meta.length > 0 && <span>·</span>}
            </>
          )}
          {meta.length > 0 && <span className="truncate">{meta.join('  ·  ')}</span>}
        </div>
      </div>
      <div className="hidden shrink-0 flex-col gap-1.5 text-right text-xs text-tv-muted xl:flex">
        <span><Kbd>OK</Kbd> Ver canal</span>
        <span><Kbd>F</Kbd> / <Kbd className="bg-red-600/80 px-2">&nbsp;</Kbd> Favorito</span>
        <span><Kbd>/</Kbd> Buscar</span>
      </div>
    </section>
  );
}

