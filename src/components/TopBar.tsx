import { useState } from 'react';
import { getPreset } from '../core/presets';
import { encodeState } from '../core/shareUrl';
import { useI18n } from '../i18n';
import { LOCALE_LABELS, type Locale } from '../i18n/types';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExport: () => void;
}

export default function TopBar({ state, theme, onToggleTheme, onExport }: Props) {
  const [copied, setCopied] = useState(false);
  const { t, locale, setLocale } = useI18n();

  const share = async () => {
    const hash = encodeState(state);
    const url = `${location.origin}${location.pathname}${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Copy the link below:', url);
    }
  };

  const preset = getPreset(state.cfg.preset);
  const engineLabel = state.cfg.renderer === 'elk' ? 'ELK' : 'Dagre';

  // 语言切换：EN ↔ 中文
  const nextLocale: Locale = locale === 'en' ? 'zh-CN' : 'en';

  return (
    <header className="topbar">
      <h1>🎨 {t('app.title')}</h1>
      <span className="chip">
        {t('topbar.currentPreset', {
          preset: t(preset.nameKey),
          engine: engineLabel,
        })}
        {state.cfg.look === 'handDrawn' ? ` · ${t('topbar.handDrawn')}` : ''}
      </span>
      <div className="spacer" />
      <button
        onClick={() => setLocale(nextLocale)}
        title={t('app.langLabel')}
        className="lang-switch"
      >
        🌐 {LOCALE_LABELS[nextLocale]}
      </button>
      <button onClick={share}>{copied ? t('topbar.copied') : t('topbar.share')}</button>
      <button onClick={onToggleTheme}>
        {theme === 'light' ? t('topbar.themeDark') : t('topbar.themeLight')}
      </button>
      <button className="primary" onClick={onExport}>
        {t('topbar.export')}
      </button>
    </header>
  );
}
