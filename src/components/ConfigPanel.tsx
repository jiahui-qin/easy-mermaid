import { useState } from 'react';
import type { UiConfig } from '../types';
import { configFields } from '../core/configSchema';
import { defaultUiConfig, getPreset, presets } from '../core/presets';
import { useI18n } from '../i18n';

interface Props {
  cfg: UiConfig;
  onChange: (c: UiConfig) => void;
}

export default function ConfigPanel({ cfg, onChange }: Props) {
  const [advancedText, setAdvancedText] = useState(
    JSON.stringify(cfg.extraThemeVariables, null, 2)
  );
  const [advancedErr, setAdvancedErr] = useState<string | null>(null);
  const { t } = useI18n();

  const patch = (k: keyof UiConfig, v: unknown) => {
    onChange({ ...cfg, [k]: v });
  };

  const selectPreset = (id: string) => {
    const preset = getPreset(id);
    onChange({ ...cfg, ...preset.cfg });
  };

  const applyAdvanced = (text: string) => {
    setAdvancedText(text);
    try {
      const parsed = JSON.parse(text || '{}');
      setAdvancedErr(null);
      onChange({ ...cfg, extraThemeVariables: parsed });
    } catch (e: any) {
      setAdvancedErr(e.message);
    }
  };

  return (
    <aside className="panel">
      <div className="section">
        <h2>{t('config.presets')}</h2>
        <div className="preset-grid">
          {presets.map((p) => (
            <div
              key={p.id}
              className={`preset-card ${cfg.preset === p.id ? 'active' : ''}`}
              onClick={() => selectPreset(p.id)}
            >
              <div className="preset-head">
                <div className="name">{t(p.nameKey)}</div>
                <div className="swatches" aria-hidden="true">
                  <span
                    className="dot"
                    style={{
                      background: p.cfg.primaryColor ?? defaultUiConfig.primaryColor,
                      borderColor: p.cfg.primaryBorderColor ?? defaultUiConfig.primaryBorderColor,
                    }}
                  />
                  <span
                    className="dot"
                    style={{
                      background: p.cfg.clusterBkg ?? defaultUiConfig.clusterBkg,
                      borderColor:
                        (p.cfg.extraThemeVariables?.clusterBorder as string) ?? '#dde5ef',
                    }}
                  />
                  <span
                    className="dot dot-line"
                    style={{ background: p.cfg.lineColor ?? defaultUiConfig.lineColor }}
                  />
                </div>
              </div>
              <div className="desc">{t(p.descKey)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>{t('config.common')}</h2>
        {configFields.map((f) => {
          const hint = f.hintKey ? t(f.hintKey) : '';
          return (
            <div className="field" key={String(f.key)}>
              <label>{t(f.labelKey)}</label>
              {f.kind === 'select' && (
                <select
                  value={String(cfg[f.key])}
                  onChange={(e) => patch(f.key, e.target.value)}
                >
                  {f.options!.map((o) => (
                    <option key={o.value} value={o.value}>
                      {t(o.labelKey)}
                    </option>
                  ))}
                </select>
              )}
              {f.kind === 'number' && (
                <input
                  type="number"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={Number(cfg[f.key])}
                  onChange={(e) => patch(f.key, Number(e.target.value))}
                />
              )}
              {f.kind === 'text' && (
                <input
                  type="text"
                  value={String(cfg[f.key])}
                  onChange={(e) => patch(f.key, e.target.value)}
                />
              )}
              {f.kind === 'color' && (
                <input
                  type="color"
                  value={normalizeColor(String(cfg[f.key]))}
                  onChange={(e) => patch(f.key, e.target.value)}
                />
              )}
              {f.kind === 'toggle' && (
                <input
                  type="checkbox"
                  checked={Boolean(cfg[f.key])}
                  onChange={(e) => patch(f.key, e.target.checked)}
                />
              )}
              {hint && <div className="hint">{hint}</div>}
            </div>
          );
        })}
      </div>

      <div className="section">
        <h2>{t('config.theme')}</h2>
        <div className="field">
          <select
            value={cfg.theme}
            onChange={(e) => patch('theme', e.target.value as 'light' | 'dark')}
          >
            <option value="light">{t('config.themeLight')}</option>
            <option value="dark">{t('config.themeDark')}</option>
          </select>
        </div>
      </div>

      <div className="section">
        <h2>{t('config.advanced')}</h2>
        <textarea
          className="advanced-json"
          value={advancedText}
          onChange={(e) => applyAdvanced(e.target.value)}
          spellCheck={false}
        />
        {advancedErr && <div className="hint" style={{ color: 'var(--danger)' }}>{advancedErr}</div>}
      </div>
    </aside>
  );
}

/** 把 8 位 hex 或其他颜色转回 #rrggbb，便于 input[type=color] 显示 */
function normalizeColor(v: string): string {
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{8}$/i.test(v)) return v.slice(0, 7);
  if (/^#[0-9a-f]{3}$/i.test(v)) {
    const r = v[1]; const g = v[2]; const b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return '#3b82f6';
}
