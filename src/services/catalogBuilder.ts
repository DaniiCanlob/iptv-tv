import { CATEGORY_META, UI_LOCALE } from '../common/constants';
import type {
  ApiDataset,
  ApiLogo,
  ApiStream,
  Catalog,
  TvCategory,
  TvChannel,
  TvCountry,
  TvLanguage,
  TvStream,
} from '../common/types';
import { normalizeText } from '../utils/text';
import { isDesktopApp } from './desktopBridge';
import { parseQuality } from '../utils/quality';

function toTvStream(stream: ApiStream): TvStream {
  return {
    url: stream.url,
    title: stream.title,
    quality: stream.quality,
    qualityValue: parseQuality(stream.quality),
    label: stream.label,
    needsHeaders: Boolean(stream.referrer || stream.user_agent),
    referrer: stream.referrer,
    userAgent: stream.user_agent,
  };
}

/** Browser-friendly first (no custom headers, https), then best quality. */
function compareStreams(a: TvStream, b: TvStream): number {
  // The desktop app can send custom headers and load http streams; the browser can't.
  if (!isDesktopApp()) {
    if (a.needsHeaders !== b.needsHeaders) return a.needsHeaders ? 1 : -1;
    const aHttps = a.url.startsWith('https:');
    const bHttps = b.url.startsWith('https:');
    if (aHttps !== bHttps) return aHttps ? -1 : 1;
  }
  return b.qualityValue - a.qualityValue;
}

function logoScore(logo: ApiLogo): number {
  let score = 0;
  if (logo.in_use !== false) score += 4;
  if (!logo.feed) score += 2;
  if (logo.format === 'SVG' || logo.format === 'PNG') score += 1;
  return score * 10_000 + Math.min(logo.width, 1000);
}

function indexStreams(streams: ApiStream[]): Map<string, TvStream[]> {
  const byChannel = new Map<string, TvStream[]>();
  for (const stream of streams) {
    if (!stream.channel || !stream.url) continue;
    const list = byChannel.get(stream.channel) ?? [];
    list.push(toTvStream(stream));
    byChannel.set(stream.channel, list);
  }
  for (const list of byChannel.values()) list.sort(compareStreams);
  return byChannel;
}

function indexLogos(logos: ApiLogo[]): Map<string, string> {
  const best = new Map<string, ApiLogo>();
  for (const logo of logos) {
    const current = best.get(logo.channel);
    if (!current || logoScore(logo) > logoScore(current)) best.set(logo.channel, logo);
  }
  return new Map([...best].map(([id, logo]) => [id, logo.url]));
}

/** Languages per channel, main feed first, without duplicates. */
function indexFeedLanguages(dataset: ApiDataset): Map<string, string[]> {
  const byChannel = new Map<string, string[]>();
  const feeds = [...dataset.feeds].sort((a, b) => Number(b.is_main) - Number(a.is_main));
  for (const feed of feeds) {
    const list = byChannel.get(feed.channel) ?? [];
    for (const code of feed.languages) if (!list.includes(code)) list.push(code);
    byChannel.set(feed.channel, list);
  }
  return byChannel;
}

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase(UI_LOCALE) + value.slice(1);
}

function buildLanguages(dataset: ApiDataset): Map<string, TvLanguage> {
  let displayNames: Intl.DisplayNames | null = null;
  try {
    displayNames = new Intl.DisplayNames([UI_LOCALE], { type: 'language', fallback: 'none' });
  } catch {
    displayNames = null;
  }

  const languages = new Map<string, TvLanguage>();
  for (const language of dataset.languages) {
    let name = language.name;
    try {
      name = displayNames?.of(language.code) ?? language.name;
    } catch {
      name = language.name;
    }
    languages.set(language.code, { code: language.code, name: capitalize(name) });
  }
  return languages;
}

function buildCountries(dataset: ApiDataset): Map<string, TvCountry> {
  let displayNames: Intl.DisplayNames | null = null;
  try {
    displayNames = new Intl.DisplayNames([UI_LOCALE], { type: 'region' });
  } catch {
    displayNames = null;
  }

  const countries = new Map<string, TvCountry>();
  for (const country of dataset.countries) {
    let name = country.name;
    try {
      name = displayNames?.of(country.code) ?? country.name;
    } catch {
      name = country.name;
    }
    countries.set(country.code, { code: country.code, name, flag: country.flag });
  }
  return countries;
}

function buildCategories(dataset: ApiDataset): TvCategory[] {
  return dataset.categories
    .filter((category) => category.id !== 'xxx')
    .map((category) => ({
      id: category.id,
      name: CATEGORY_META[category.id]?.label ?? category.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, UI_LOCALE));
}

export function buildCatalog(dataset: ApiDataset): Catalog {
  const streamsByChannel = indexStreams(dataset.streams);
  const logosByChannel = indexLogos(dataset.logos);
  const languagesByChannel = indexFeedLanguages(dataset);
  const countryLanguages = new Map(dataset.countries.map((c) => [c.code, c.languages]));

  const channels: TvChannel[] = [];
  for (const channel of dataset.channels) {
    if (channel.is_nsfw || channel.closed) continue;
    const streams = streamsByChannel.get(channel.id) ?? [];
    const bestStream = streams.reduce<TvStream | null>(
      (best, s) => (!best || s.qualityValue > best.qualityValue ? s : best),
      null,
    );

    channels.push({
      id: channel.id,
      name: channel.name,
      altNames: channel.alt_names,
      network: channel.network,
      owners: channel.owners,
      country: channel.country,
      categories: channel.categories,
      languages: languagesByChannel.get(channel.id)?.length
        ? languagesByChannel.get(channel.id)!
        : (countryLanguages.get(channel.country) ?? []),
      website: channel.website,
      launched: channel.launched,
      logo: logosByChannel.get(channel.id) ?? null,
      streams,
      bestQuality: bestStream?.quality ?? null,
      searchText: normalizeText(
        [channel.name, ...channel.alt_names, channel.network ?? '', channel.id].join(' '),
      ),
    });
  }

  // Channels with a live stream first, then alphabetical.
  channels.sort((a, b) => {
    const live = Number(b.streams.length > 0) - Number(a.streams.length > 0);
    return live || a.name.localeCompare(b.name, UI_LOCALE);
  });

  return {
    channels,
    byId: new Map(channels.map((c) => [c.id, c])),
    countries: buildCountries(dataset),
    languages: buildLanguages(dataset),
    categories: buildCategories(dataset),
  };
}
