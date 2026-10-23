import { defaultUiConfig, getPreset, presets } from './core/presets';
import type { UiConfig } from './types';

export function applyTheme(t: UiConfig['theme']) {
  document.documentElement.setAttribute('data-theme', t);
}

export { defaultUiConfig, getPreset, presets };
