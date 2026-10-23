import pako from 'pako';
import type { AppState } from '../types';

/**
 * AppState JSON → deflate → base64url → #
 */
export function encodeState(state: AppState): string {
  const json = JSON.stringify(state);
  const deflated = pako.deflate(json);
  const b64 = uintToBase64Url(deflated);
  return `#${b64}`;
}

export function decodeState(hash: string): AppState | null {
  try {
    const cleaned = hash.replace(/^#/, '');
    if (!cleaned) return null;
    const bytes = base64UrlToUint(cleaned);
    const json = pako.inflate(bytes, { to: 'string' });
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed.code === 'string') return parsed as AppState;
    return null;
  } catch {
    return null;
  }
}

function uintToBase64Url(u8: Uint8Array): string {
  let s = '';
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  const b64 = btoa(s);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToUint(b64: string): Uint8Array {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (b64.length % 4)) % 4);
  const s = atob(padded);
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
  return u8;
}
