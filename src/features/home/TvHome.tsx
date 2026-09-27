import { lazy, Suspense, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { ALL_COUNTRIES_ICON, CHANNEL_ID_ATTR, FILTER_ALL, KEYS_FAVORITE, KEYS_SEARCH, LANGUAGE_ICON } from '../../common/constants';
import type { ChannelFilters, OpenPicker, PlayerMode, TvChannel, TvHomeProps } from '../../common/types';
import { ChannelGrid } from '../../components/channels/ChannelGrid';
import { ChannelHero } from '../../components/channels/ChannelHero';
import { FilterPicker } from '../../components/filters/FilterPicker';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { useFavorites } from '../../hooks/useFavorites';
import { useKeyHandler } from '../../hooks/useKeyHandler';
import { usePersistentFilters } from '../../hooks/usePersistentFilters';
import { useSpatialNavigation } from '../../hooks/useSpatialNavigation';
import {
  buildCategoryOptions,
  buildCountryOptions,
  buildLanguageOptions,
  countBase,
  filterChannels,
} from '../../utils/channelFilters';
import { isTypingTarget, matchesKey } from '../../utils/keys';
import { defaultNavTarget, focusElement } from '../../utils/spatialNavigation';

const PlayerScreen = lazy(() =>
  import('../../components/player/PlayerScreen').then((m) => ({ default: m.PlayerScreen })),
);

function focusChannelCard(id: string | null): void {
  requestAnimationFrame(() => {
    const card = id
      ? document.querySelector<HTMLElement>(`[${CHANNEL_ID_ATTR}="${CSS.escape(id)}"]`)
      : null;
    const target = card ?? defaultNavTarget(document);
    if (target) focusElement(target);
  });
}

export function TvHome({ catalog }: TvHomeProps) {
  const [filters, setFilters] = usePersistentFilters();
  const { favorites, toggleFavorite } = useFavorites();
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const pickerOpen = openPicker !== null;
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playerMode, setPlayerMode] = useState<PlayerMode>('full');
  const [pipActive, setPipActive] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(filters.query);
  const effectiveFilters = useMemo<ChannelFilters>(
    () => ({ ...filters, query: deferredQuery }),
    [filters, deferredQuery],
  );

  const channels = useMemo(
    () => filterChannels(catalog.channels, effectiveFilters, favorites),
    [catalog, effectiveFilters, favorites],
  );
  const categoryOptions = useMemo(() => buildCategoryOptions(catalog, filters), [catalog, filters]);
  const baseCount = useMemo(() => countBase(catalog, filters), [catalog, filters]);
  const countryOptions = useMemo(() => buildCountryOptions(catalog, filters), [catalog, filters]);
  const languageOptions = useMemo(() => buildLanguageOptions(catalog, filters), [catalog, filters]);
  const categoryNames = useMemo(
    () => new Map(catalog.categories.map((c) => [c.id, c.name])),
    [catalog],
  );

  const resetKey = `${effectiveFilters.category}|${effectiveFilters.country}|${effectiveFilters.language}|${effectiveFilters.onlyLive}|${effectiveFilters.query}`;
  const focusedChannel = (focusedId && catalog.byId.get(focusedId)) || channels[0] || null;
  const playingChannel = playingId ? catalog.byId.get(playingId) ?? null : null;
  const playingIndex = playingId ? channels.findIndex((c) => c.id === playingId) : -1;

  const playerFull = Boolean(playingChannel) && playerMode === 'full';

  useSpatialNavigation(!playerFull);

  // Initial focus on the first card once the catalog is on screen.
  useEffect(() => focusChannelCard(null), []);

  const updateFilters = useCallback(
    (patch: Partial<ChannelFilters>) => setFilters((current) => ({ ...current, ...patch })),
    [setFilters],
  );

  // With the floating window open, a new channel plays there and the guide stays usable.
  const handlePlay = useCallback(
    (channel: TvChannel) => {
      setPlayingId(channel.id);
      setPlayerMode(pipActive ? 'mini' : 'full');
    },
    [pipActive],
  );
  const handleFocusChannel = useCallback((channel: TvChannel) => setFocusedId(channel.id), []);

  const zap = (step: number) => {
    if (channels.length === 0) return;
    const from = playingIndex === -1 ? 0 : playingIndex;
    const next = channels[(from + step + channels.length) % channels.length];
    setPlayingId(next.id);
  };

  const closePicker = () => {
    setOpenPicker(null);
    focusChannelCard(focusedId);
  };

  const selectFromPicker = (patch: Partial<ChannelFilters>) => {
    updateFilters(patch);
    setOpenPicker(null);
    focusChannelCard(null);
  };

  const returnToGuide = () => {
    setFocusedId(playingId);
    focusChannelCard(playingId);
  };

  const minimizePlayer = () => {
    if (playerMode === 'mini') return;
    setPlayerMode('mini');
    returnToGuide();
  };

  const closePlayer = () => {
    if (playerMode === 'full') returnToGuide();
    setPlayingId(null);
    setPlayerMode('full');
    setPipActive(false);
  };

  useKeyHandler(
    (event) => {
      if (pickerOpen || isTypingTarget(event.target)) return;
      if (matchesKey(event, KEYS_SEARCH)) {
        event.preventDefault();
        document.getElementById('channel-search')?.focus();
        return;
      }
      const id = (document.activeElement as HTMLElement | null)?.getAttribute(CHANNEL_ID_ATTR);
      if (id && matchesKey(event, KEYS_FAVORITE)) {
        event.preventDefault();
        toggleFavorite(id);
      }
    },
    !playerFull,
  );

  return (
    <div className="flex h-full">
      <Sidebar
        categories={categoryOptions}
        totalCount={baseCount}
        favoritesCount={favorites.size}
        selected={filters.category}
        onSelect={(category) => updateFilters({ category })}
      />
      <main
        className="group/main flex min-w-0 flex-1 flex-col"
        data-mini-player={playingChannel && playerMode === 'mini' ? '' : undefined}
      >
        <TopBar
          filters={filters}
          resultCount={channels.length}
          country={catalog.countries.get(filters.country) ?? null}
          onQueryChange={(query) => updateFilters({ query })}
          language={catalog.languages.get(filters.language) ?? null}
          onOpenCountries={() => setOpenPicker('country')}
          onOpenLanguages={() => setOpenPicker('language')}
          onToggleLive={() => updateFilters({ onlyLive: !filters.onlyLive })}
        />
        <ChannelHero
          channel={focusedChannel}
          country={focusedChannel ? catalog.countries.get(focusedChannel.country) : undefined}
          categoryNames={categoryNames}
          languages={catalog.languages}
          favorite={focusedChannel ? favorites.has(focusedChannel.id) : false}
        />
        <ChannelGrid
          channels={channels}
          resetKey={resetKey}
          countries={catalog.countries}
          favorites={favorites}
          onPlay={handlePlay}
          onFocusChannel={handleFocusChannel}
        />
      </main>

      {openPicker === 'country' && (
        <FilterPicker
          title="Elige un país"
          searchPlaceholder="Filtrar países…"
          allLabel="Todos los países"
          icon={ALL_COUNTRIES_ICON}
          options={countryOptions}
          selected={filters.country}
          totalCount={countBase(catalog, { ...filters, country: FILTER_ALL })}
          onSelect={(country) => selectFromPicker({ country })}
          onClose={closePicker}
        />
      )}

      {openPicker === 'language' && (
        <FilterPicker
          title="Elige un idioma"
          searchPlaceholder="Filtrar idiomas…"
          allLabel="Todos los idiomas"
          icon={LANGUAGE_ICON}
          options={languageOptions}
          selected={filters.language}
          totalCount={countBase(catalog, { ...filters, language: FILTER_ALL })}
          onSelect={(language) => selectFromPicker({ language })}
          onClose={closePicker}
        />
      )}

      {playingChannel && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black" />}>
        <PlayerScreen
          mode={playerMode}
          channel={playingChannel}
          country={catalog.countries.get(playingChannel.country)}
          number={playingIndex + 1 || 1}
          total={channels.length || 1}
          favorite={favorites.has(playingChannel.id)}
          onClose={closePlayer}
          onMinimize={minimizePlayer}
          onExpand={() => setPlayerMode('full')}
          onNext={() => zap(1)}
          onPrev={() => zap(-1)}
          onToggleFavorite={() => toggleFavorite(playingChannel.id)}
          onPictureInPictureChange={setPipActive}
        />
        </Suspense>
      )}
    </div>
  );
}
