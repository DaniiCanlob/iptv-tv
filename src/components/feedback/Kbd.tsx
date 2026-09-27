import type { KbdProps } from '../../common/types';

export function Kbd({ children, className = 'bg-white/10' }: KbdProps) {
  return <kbd className={`rounded px-1.5 py-0.5 font-sans font-semibold text-white ${className}`}>{children}</kbd>;
}
