import { useEffect, useRef, useState } from 'react';
import ZoomViewer, { type ZoomViewerHandle } from './ZoomViewer';
import { useI18n } from '../i18n';

interface Props {
  svg: string | null;
  onClose: () => void;
}

export default function ZoomModal({ svg, onClose }: Props) {
  const viewerRef = useRef<ZoomViewerHandle>(null);
  const [zoom, setZoom] = useState(1);
  const { t } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // +/-/0 快捷键：+/- 缩放，0 复位
      else if (e.key === '+' || e.key === '=') viewerRef.current?.zoomIn();
      else if (e.key === '-' || e.key === '_') viewerRef.current?.zoomOut();
      else if (e.key === '0') viewerRef.current?.reset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dialog-backdrop zoom-backdrop" onClick={onClose}>
      <div className="zoom-modal" onClick={(e) => e.stopPropagation()}>
        <div className="zoom-header">
          <h3>{t('zoom.title')}</h3>
          <div className="zoom-tools">
            <button
              className="zoom-tool"
              onClick={() => viewerRef.current?.zoomOut()}
              title={t('zoom.zoomOut')}
            >
              −
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button
              className="zoom-tool"
              onClick={() => viewerRef.current?.zoomIn()}
              title={t('zoom.zoomIn')}
            >
              +
            </button>
            <button
              className="zoom-tool wide"
              onClick={() => viewerRef.current?.reset()}
              title={t('zoom.fit')}
            >
              {t('zoom.fit')}
            </button>
            <button className="zoom-close" onClick={onClose} title={t('zoom.close')}>
              ✕
            </button>
          </div>
        </div>
        <div className="zoom-body">
          <ZoomViewer
            ref={viewerRef}
            svg={svg}
            showBadge={false}
            grabCursor
            onScaleChange={setZoom}
            emptyText={t('zoom.empty')}
            badgeTitle={t('viewer.badgeTitle')}
          />
        </div>
        <div className="zoom-footer">{t('zoom.footer')}</div>
      </div>
    </div>
  );
}
