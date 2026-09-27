import { Globe } from 'lucide-react';
import type { CountryFlagProps } from '../../common/types';

/** Emoji flag from the API, or a globe icon when the country is unknown. */
export function CountryFlag({ flag, className = '', iconClassName = 'size-4' }: CountryFlagProps) {
  if (!flag) return <Globe className={`shrink-0 text-tv-muted ${iconClassName}`} aria-hidden />;
  return <span className={`leading-none ${className}`}>{flag}</span>;
}
