import {
  CATEGORY_META,
  DEFAULT_CATEGORY_ICON,
  FILTER_ALL,
  FILTER_FAVORITES,
  UI_LOCALE,
} from '../common/constants';
import type {
  Catalog,
  CategoryOption,
  ChannelFilters,
  PickerOption,
  TvChannel,
} from '../common/types';
import { normalizeText } from './text';

function matchesBase(channel: TvChannel, filters: ChannelFilters): boolean {
  if (filters.onlyLive && channel.streams.length === 0) return false;
  if (filters.country !== FILTER_ALL && channel.country !== filters.country) return false;
  if (filters.language !== FILTER_ALL && !channel.languages.includes(filters.language)) return false;
  return true;
}

export function filterChannels(
  channels: TvChannel[],
  filters: ChannelFilters,
  favorites: Set<string>,
): TvChannel[] {
  const query = normalizeText(filters.query);
  return channels.filter((channel) => {
    if (!matchesBase(channel, filters)) return false;
    if (filters.category === FILTER_FAVORITES && !favorites.has(channel.id)) return false;
    if (
      filters.category !== FILTER_ALL &&
      filters.category !== FILTER_FAVORITES &&
      !channel.categories.includes(filters.category)
    ) {
      return false;
    }
    return query === '' || channel.searchText.includes(query);
  });
}

/** Category counts respect country + live filters, but not the category itself. */
export function buildCategoryOptions(catalog: Catalog, filters: ChannelFilters): CategoryOption[] {
  const counts = new Map<string, number>();
  for (const channel of catalog.channels) {
    if (!matchesBase(channel, filters)) continue;
    for (const id of channel.categories) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return catalog.categories
    .map((category) => ({
      ...category,
      count: counts.get(category.id) ?? 0,
      icon: CATEGORY_META[category.id]?.icon ?? DEFAULT_CATEGORY_ICON,
    }))
    .filter((option) => option.count > 0);
}

export function countBase(catalog: Catalog, filters: ChannelFilters): number {
  return catalog.channels.reduce((n, c) => (matchesBase(c, filters) ? n + 1 : n), 0);
}

/** Country counts respect live + language filters (not the country itself). */
export function buildCountryOptions(catalog: Catalog, filters: ChannelFilters): PickerOption[] {
  const scope = { ...filters, country: FILTER_ALL };
  const counts = new Map<string, number>();
  for (const channel of catalog.channels) {
    if (!matchesBase(channel, scope)) continue;
    counts.set(channel.country, (counts.get(channel.country) ?? 0) + 1);
  }
  return [...catalog.countries.values()]
    .map((country) => ({
      code: country.code,
      name: country.name,
      flag: country.flag,
      count: counts.get(country.code) ?? 0,
    }))
    .filter((option) => option.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, UI_LOCALE));
}

/** Language counts respect live + country filters; sorted by number of channels. */
export function buildLanguageOptions(catalog: Catalog, filters: ChannelFilters): PickerOption[] {
  const scope = { ...filters, language: FILTER_ALL };
  const counts = new Map<string, number>();
  for (const channel of catalog.channels) {
    if (!matchesBase(channel, scope)) continue;
    for (const code of channel.languages) counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  return [...counts]
    .map(([code, count]) => ({
      code,
      name: catalog.languages.get(code)?.name ?? code,
      flag: null,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, UI_LOCALE));
}
