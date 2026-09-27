import type { LucideIcon } from 'lucide-react';
import type { ReactNode, RefObject } from 'react';
import type { Catalog, CategoryOption, PickerOption, TvChannel, TvCountry, TvLanguage } from './catalog';
import type { ChannelFilters } from './filters';
import type { UpdateStatus } from './desktop';
import type { PauseControls, PictureInPictureControls, PlaybackState, PlayerMode, VolumeControls } from './player';

export interface SidebarProps {
  categories: CategoryOption[];
  totalCount: number;
  favoritesCount: number;
  selected: string;
  onSelect: (category: string) => void;
}

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}

export interface TopBarProps {
  filters: ChannelFilters;
  resultCount: number;
  country: TvCountry | null;
  language: TvLanguage | null;
  onQueryChange: (query: string) => void;
  onOpenCountries: () => void;
  onOpenLanguages: () => void;
  onToggleLive: () => void;
}

export interface ChannelGridProps {
  channels: TvChannel[];
  resetKey: string;
  countries: Map<string, TvCountry>;
  favorites: Set<string>;
  onPlay: (channel: TvChannel) => void;
  onFocusChannel: (channel: TvChannel) => void;
}

export interface ChannelCardProps {
  channel: TvChannel;
  number: number;
  country: TvCountry | undefined;
  favorite: boolean;
  isDefault: boolean;
  onPlay: (channel: TvChannel) => void;
  onFocusChannel: (channel: TvChannel) => void;
}

export interface ChannelLogoProps {
  name: string;
  src: string | null;
  className?: string;
  textClassName?: string;
}

export interface ChannelHeroProps {
  channel: TvChannel | null;
  country: TvCountry | undefined;
  categoryNames: Map<string, string>;
  languages: Map<string, TvLanguage>;
  favorite: boolean;
}

export interface FilterPickerProps {
  title: string;
  searchPlaceholder: string;
  allLabel: string;
  icon: LucideIcon;
  options: PickerOption[];
  selected: string;
  totalCount: number;
  onSelect: (code: string) => void;
  onClose: () => void;
}

export interface FilterButtonProps {
  icon: LucideIcon;
  flag?: string | null;
  label: string;
  onClick: () => void;
}

export interface PlayerScreenProps {
  mode: PlayerMode;
  channel: TvChannel;
  country: TvCountry | undefined;
  number: number;
  total: number;
  favorite: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onExpand: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: () => void;
  onPictureInPictureChange: (active: boolean) => void;
}

export interface PlayerOsdProps {
  visible: boolean;
  channel: TvChannel;
  country: TvCountry | undefined;
  number: number;
  total: number;
  favorite: boolean;
  playback: PlaybackState;
}

export interface PlayerStatusOverlayProps {
  channel: TvChannel;
  playback: PlaybackState;
  compact: boolean;
}

export interface PlayerTopBarProps {
  visible: boolean;
  pip: PictureInPictureControls;
  volume: VolumeControls;
  onMinimize: () => void;
  onClose: () => void;
}

export interface PlayerMiniControlsProps {
  channel: TvChannel;
  country: TvCountry | undefined;
  pip: PictureInPictureControls;
  volume: VolumeControls;
  pause: PauseControls;
  onExpand: () => void;
  onClose: () => void;
}

export interface PlayerIconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export interface LoadingScreenProps {
  loaded: number;
  total: number;
}

export interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export interface EmptyStateProps {
  title: string;
  hint: string;
}

export interface TvHomeProps {
  catalog: Catalog;
}

export interface InfiniteCountResult {
  count: number;
  sentinelRef: RefObject<HTMLDivElement | null>;
  rootRef: RefObject<HTMLDivElement | null>;
}

export interface KbdProps {
  children: ReactNode;
  className?: string;
}

export type OpenPicker = 'country' | 'language' | null;

export interface VolumeSliderProps {
  volume: VolumeControls;
}

export interface VolumeHudProps {
  visible: boolean;
  volume: number;
  muted: boolean;
}

export interface CountryFlagProps {
  flag: string | undefined;
  className?: string;
  iconClassName?: string;
}

export interface PlayerPausedOverlayProps {
  compact: boolean;
  onPlay: () => void;
}

export interface PlayerPipPlaceholderProps {
  compact: boolean;
  onReturn: () => void;
}

export interface UpdateToastProps {
  status: UpdateStatus;
  onInstall: () => void;
  onDownload: () => void;
  onDismiss: () => void;
}
