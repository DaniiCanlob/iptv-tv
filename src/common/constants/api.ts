import type { ApiDatasetKey } from '../types';

export const API_BASE_URL = 'https://iptv-org.github.io/api';

export const API_ENDPOINTS: Record<ApiDatasetKey, string> = {
  channels: `${API_BASE_URL}/channels.json`,
  streams: `${API_BASE_URL}/streams.json`,
  feeds: `${API_BASE_URL}/feeds.json`,
  languages: `${API_BASE_URL}/languages.json`,
  logos: `${API_BASE_URL}/logos.json`,
  countries: `${API_BASE_URL}/countries.json`,
  categories: `${API_BASE_URL}/categories.json`,
};

export const API_DATASET_KEYS = Object.keys(API_ENDPOINTS) as ApiDatasetKey[];
