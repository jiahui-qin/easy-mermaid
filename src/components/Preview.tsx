import { useEffect, useRef, useState } from 'react';
import type { UiConfig } from '../types';
import { renderMermaid, type RenderResult } from '../core/renderMermaid';
import ZoomViewer from './ZoomViewer';
import { useI18n } from '../i18n';

interface Props {
  code: string;
  cfg: UiConfig;
  onRenderDone: (svg: string | null, errorLine?: number) => void;
  onZoom: () => void;
}

export default function Preview({ code, cfg, onRenderDone, onZoom }: Props) {
  const [result, setResult] = useState<RenderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();
  // 用 ref 存最新回调，避免回调引用变化导致 effect 重建定时器
  const cbRef = useRef(onRenderDone);
  cbRef.current = onRenderDone;

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const r = await renderMermaid(code, cfg);
      if (!cancelled) {
        setResult(r);
        setLoading(false);
        cbRef.current(r.ok ? (r.svg ?? null) : null, r.ok ? undefined : r.errorLine);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [code, cfg]);

  return (
    <div className="preview-area">
      {loading && <div className="loading">{t('preview.rendering')}</div>}
      {!loading && result && !result.ok && (
        <div className="error-banner">
          {result.errorLine
            ? t('preview.errorAtLine', { line: result.errorLine, message: result.error ?? '' })
            : result.error}
        </div>
      )}
      <div className="viewer">
        <ZoomViewer
          svg={result?.ok ? (result.svg ?? null) : null}
          onSingleClick={onZoom}
          emptyText={t('preview.empty')}
          badgeTitle={t('viewer.badgeTitle')}
        />
      </div>
    </div>
  );
}
