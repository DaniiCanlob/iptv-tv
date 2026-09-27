import { KEY_CODES_BACK, KEYS_BACK, NON_TEXT_INPUT_TYPES } from '../common/constants';

export function matchesKey(event: KeyboardEvent, keys: string[]): boolean {
  return keys.includes(event.key);
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && !NON_TEXT_INPUT_TYPES.includes(target.type);
}

export function isBackKey(event: KeyboardEvent): boolean {
  if (event.key === 'Backspace' && isTypingTarget(event.target)) return false;
  return KEYS_BACK.includes(event.key) || KEY_CODES_BACK.includes(event.keyCode);
}
