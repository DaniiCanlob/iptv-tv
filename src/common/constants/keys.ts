/** Key names from keyboards, Android TV, webOS, Tizen and browser remotes. */
export const KEYS_BACK = ['Escape', 'Backspace', 'GoBack', 'BrowserBack', 'XF86Back'];
/** Legacy keyCodes: 461 = LG webOS back, 10009 = Samsung Tizen return. */
export const KEY_CODES_BACK = [461, 10009];
export const KEYS_CHANNEL_UP = ['ChannelUp', 'PageUp', 'ArrowUp', 'MediaTrackNext'];
export const KEYS_CHANNEL_DOWN = ['ChannelDown', 'PageDown', 'ArrowDown', 'MediaTrackPrevious'];
export const KEYS_INFO = ['Enter', 'Info', 'i', 'I'];
export const KEYS_VOLUME_UP = ['AudioVolumeUp', 'VolumeUp', 'ArrowRight', '+', '='];
export const KEYS_VOLUME_DOWN = ['AudioVolumeDown', 'VolumeDown', 'ArrowLeft', '-', '_'];
export const KEYS_MUTE = ['AudioVolumeMute', 'VolumeMute', 'm', 'M'];
export const KEYS_FAVORITE = ['f', 'F', 'ColorF0Red'];
export const KEYS_FULLSCREEN = ['z', 'Z'];
export const KEYS_PIP = ['p', 'P'];
export const KEYS_EXPAND = ['i', 'I', 'Info'];
export const KEYS_PLAY_PAUSE = ['MediaPlayPause', 'MediaPlay', 'MediaPause', ' ', 'k', 'K'];
export const KEYS_STOP = ['x', 'X', 'MediaStop'];
/** Inputs that don't capture typing, so remote keys keep working on them. */
export const NON_TEXT_INPUT_TYPES = ['range', 'checkbox', 'radio', 'button'];
export const KEYS_SEARCH = ['/', 'BrowserSearch'];
