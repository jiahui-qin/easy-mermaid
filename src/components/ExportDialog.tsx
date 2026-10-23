import { useEffect, useState } from 'react';
import type { ExportFormat } from '../core/exportImage';
import { exportRaster, exportSvg } from '../core/exportImage';
import { useI18n } from '../i18n';

interface Props {
  svg: string | null;
  defaultFilename: string;
  themeColor: string;
  onClose: () => void;
}

export default function ExportDialog({ svg, defaultFilename, themeColor, onClose }: Props) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<number>(2);
  const [background, setBackground] = useState<'transparent' | 'white' | 'current'>('white');
  const [filename, setFilename] = useState(defaultFilename);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => setFilename(defaultFilename), [defaultFilename]);

  const doExport = async () => {
    if (!svg) return;
    setBusy(true);
    setErr(null);
    try {
      if (format === 'svg') {
        exportSvg(svg, ensureExt(filename, 'svg'));
      } else {
        await exportRaster(svg, {
          format,
          scale,
          background,
          backgroundColor: background === 'current' ? themeColor : undefined,
          filename: ensureExt(filename, format),
        });
      }
      onClose();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3>{t('exportDialog.title')}</h3>
        {!svg && <div className="hint">{t('exportDialog.empty')}</div>}
        <div className="field">
          <label>{t('exportDialog.format')}</label>
          <div className="row">
            {(['png', 'jpg', 'svg'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={format === f ? 'primary' : ''}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {format !== 'svg' && (
          <>
            <div className="field">
              <label>{t('exportDialog.resolution')}</label>
              <div className="row">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={scale === s ? 'primary' : ''}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>{t('exportDialog.background')}</label>
              <select
                value={background}
                onChange={(e) => setBackground(e.target.value as any)}
              >
                <option value="white">{t('exportDialog.bgWhite')}</option>
                <option value="transparent">{t('exportDialog.bgTransparent')}</option>
                <option value="current">{t('exportDialog.bgCurrent')}</option>
              </select>
            </div>
          </>
        )}
        <div className="field">
          <label>{t('exportDialog.filename')}</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>
        {err && <div className="hint" style={{ color: 'var(--danger)' }}>{err}</div>}
        <div className="actions">
          <button onClick={onClose}>{t('exportDialog.cancel')}</button>
          <button className="primary" onClick={doExport} disabled={!svg || busy}>
            {busy ? t('exportDialog.exporting') : t('exportDialog.doExport')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ensureExt(name: string, ext: string) {
  return name.toLowerCase().endsWith(`.${ext}`) ? name : `${name}.${ext}`;
}
