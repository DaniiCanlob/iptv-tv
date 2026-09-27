import { useState } from 'react';
import type { ChannelLogoProps } from '../../common/types';
import { initials } from '../../utils/text';

export function ChannelLogo({ name, src, className = '', textClassName = 'text-2xl' }: ChannelLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = src && failedSrc !== src;

  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          draggable={false}
          onError={() => setFailedSrc(src)}
          className="max-h-full max-w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
        />
      ) : (
        <span className={`font-extrabold tracking-tight text-white/70 ${textClassName}`}>
          {initials(name)}
        </span>
      )}
    </div>
  );
}
