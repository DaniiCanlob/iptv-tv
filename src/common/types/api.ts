/** Raw shapes returned by https://iptv-org.github.io/api */

export interface ApiChannel {
  id: string;
  name: string;
  alt_names: string[];
  network: string | null;
  owners: string[];
  country: string;
  categories: string[];
  is_nsfw: boolean;
  launched: string | null;
  closed: string | null;
  replaced_by: string | null;
  website: string | null;
}

export interface ApiStream {
  channel: string | null;
  feed: string | null;
  title: string;
  url: string;
  referrer: string | null;
  user_agent: string | null;
  quality: string | null;
  label: string | null;
}

export interface ApiLogo {
  channel: string;
  feed: string | null;
  in_use?: boolean;
  tags: string[];
  width: number;
  height: number;
  format: string | null;
  url: string;
}

export interface ApiCountry {
  name: string;
  code: string;
  languages: string[];
  flag: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  description?: string;
}

export interface ApiFeed {
  channel: string;
  id: string;
  name: string;
  alt_names?: string[];
  is_main: boolean;
  broadcast_area: string[];
  timezones: string[];
  languages: string[];
  format: string | null;
}

export interface ApiLanguage {
  code: string;
  name: string;
}

export interface ApiDataset {
  channels: ApiChannel[];
  feeds: ApiFeed[];
  languages: ApiLanguage[];
  streams: ApiStream[];
  logos: ApiLogo[];
  countries: ApiCountry[];
  categories: ApiCategory[];
}

export type ApiDatasetKey = keyof ApiDataset;
