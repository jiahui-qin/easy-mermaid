import { useCallback, useEffect, useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ConfigPanel from './components/ConfigPanel';
import TopBar from './components/TopBar';
import ExportDialog from './components/ExportDialog';
import ZoomModal from './components/ZoomModal';
import { defaultState } from './defaultState';
import { decodeState } from './core/shareUrl';
import { applyTheme } from './theme';
import { I18nProvider } from './i18n';
import type { AppState, UiConfig } from './types';

export default function App() {
  return (
    <I18nProvider>
      <Workbench />
    </I18nProvider>
  );
}

function Workbench() {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== 'undefined') {
      const shared = decodeState(window.location.hash);
      if (shared) return { ...defaultState, ...shared, cfg: { ...defaultState.cfg, ...shared.cfg } };
    }
    return defaultState;
  });
  const [lastSvg, setLastSvg] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | undefined>(undefined);
  const [exportOpen, setExportOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  // 界面明暗是独立的本地偏好（localStorage 持久化），不随预设切换而变；
  // cfg.theme 只决定“图”的明暗（mermaid 润色层光晕、导出背景色）。
  const [uiTheme, setUiTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('bm-ui-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    applyTheme(uiTheme);
    window.localStorage.setItem('bm-ui-theme', uiTheme);
  }, [uiTheme]);

  const setCode = useCallback((code: string) => {
    setState((s) => ({ ...s, code }));
  }, []);

  const setCfg = useCallback((cfg: UiConfig) => {
    setState((s) => ({ ...s, cfg }));
  }, []);

  const onRenderDone = useCallback((svg: string | null, errLine?: number) => {
    setLastSvg(svg);
    setErrorLine(errLine);
  }, []);

  const themeBg = state.cfg.theme === 'dark' ? '#0c0a09' : '#ffffff';

  return (
    <div className="app">
      <TopBar
        state={state}
        theme={uiTheme}
        onToggleTheme={() => setUiTheme(uiTheme === 'light' ? 'dark' : 'light')}
        onExport={() => setExportOpen(true)}
      />
      <div className="main">
        <div className="editor-area">
          <Editor value={state.code} errorLine={errorLine} onChange={setCode} />
        </div>
        <Preview code={state.code} cfg={state.cfg} onRenderDone={onRenderDone} onZoom={() => setZoomOpen(true)} />
      </div>
      <ConfigPanel cfg={state.cfg} onChange={setCfg} />
      {exportOpen && (
        <ExportDialog
          svg={lastSvg}
          defaultFilename="mermaid"
          themeColor={themeBg}
          onClose={() => setExportOpen(false)}
        />
      )}
      {zoomOpen && (
        <ZoomModal svg={lastSvg} onClose={() => setZoomOpen(false)} />
      )}
    </div>
  );
}
