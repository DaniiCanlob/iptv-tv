import { ChevronDown, PictureInPicture2, X } from 'lucide-react';
import type { PlayerTopBarProps } from '../../common/types';
import { PlayerIconButton } from './PlayerIconButton';
import { VolumeSlider } from './VolumeSlider';

export function PlayerTopBar({ visible, pip, volume, onMinimize, onClose }: PlayerTopBarProps) {
  return (
    <div
      className={`absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent p-6 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <PlayerIconButton icon={ChevronDown} label="Minimizar" onClick={onMinimize} />
      <div className="flex-1" />
      <VolumeSlider volume={volume} />
      {pip.supported && (
        <PlayerIconButton
          icon={PictureInPicture2}
          label={pip.active ? 'Volver a la app' : 'Ventana flotante'}
          onClick={pip.toggle}
        />
      )}
      <PlayerIconButton icon={X} label="Cerrar" onClick={onClose} />
    </div>
  );
}
