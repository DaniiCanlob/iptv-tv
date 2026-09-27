import { SearchX } from 'lucide-react';
import type { EmptyStateProps } from '../../common/types';

export function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <SearchX className="size-14 text-tv-muted" strokeWidth={1.5} />
      <p className="text-2xl font-bold">{title}</p>
      <p className="text-tv-muted">{hint}</p>
    </div>
  );
}
