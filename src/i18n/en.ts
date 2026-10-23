/**
 * 英文文案（默认语言）。
 *
 * 这里只放"内容"，不含任何逻辑。所有文案以嵌套对象组织，
 * 访问路径用点号拼接（`app.title` → `en.app.title`）。
 *
 * zh-CN.ts 以 `TranslationTree` 为类型声明，两种语言的 key 集合必须完全一致——
 * 少一个 key 或多一个 key 都会在编译期报错（TS 的对象字面量多余属性检查）。
 */

/** 12 个预设的展示名与描述（默认英语） */
export const en = {
  app: {
    title: 'Beauty Mermaid',
    tagline: 'Beautify Mermaid diagrams right in your browser',
    langLabel: 'Language',
    langZh: '中文',
    langEn: 'English',
  },

  topbar: {
    currentPreset: 'Preset: {preset} · {engine}',
    handDrawn: 'hand-drawn',
    share: 'Share link',
    copied: 'Copied ✓',
    themeDark: '🌙 Dark',
    themeLight: '☀️ Light',
    export: 'Export',
  },

  editor: {
    placeholder: 'Write Mermaid here…',
  },

  preview: {
    rendering: 'Rendering…',
    errorAtLine: 'Line {line}: {message}',
    empty: 'Nothing to display.',
  },

  viewer: {
    badgeTitle: 'Scroll to zoom · Drag to pan · Double-click to reset',
    empty: 'Nothing to display.',
  },

  zoom: {
    title: 'Zoom preview',
    zoomOut: 'Zoom out (−)',
    zoomIn: 'Zoom in (+)',
    fit: 'Fit to window',
    close: 'Close (Esc)',
    footer: 'Scroll to zoom · Drag to pan · Double-click to reset · Esc to close',
    empty: 'Nothing to display.',
  },

  config: {
    presets: 'Presets',
    common: 'Common settings',
    theme: 'Theme (chart)',
    advanced: 'Advanced (themeVariables JSON)',
    themeLight: 'Light',
    themeDark: 'Dark',
  },

  /** 配置面板字段：label 必填，hint 可选 */
  fields: {
    mermaidTheme: {
      label: 'Base theme',
      hint: '"Default" uses Mermaid’s built-in theme and renders exactly like GitHub does',
    },
    renderer: {
      label: 'Layout engine',
      hint: 'ELK uses orthogonal routing and lays out subgraph tiers more tidily',
    },
    look: {
      label: 'Layout style',
      hint: 'Hand-drawn mode adds a natural jittery stroke to node borders and edges',
    },
    curve: {
      label: 'Edge style',
      hint: '',
    },
    direction: {
      label: 'Main direction',
      hint: '',
    },
    nodeSpacing: {
      label: 'Node horizontal spacing',
      hint: '',
    },
    rankSpacing: {
      label: 'Tier vertical spacing',
      hint: '',
    },
    padding: {
      label: 'Node padding',
      hint: '',
    },
    radius: {
      label: 'Node corner radius',
      hint: '0 means square corners; skipped in hand-drawn mode',
    },
    fontSize: {
      label: 'Font size',
      hint: '',
    },
    fontFamily: {
      label: 'Font stack',
      hint: 'e.g. "PingFang SC", "Microsoft YaHei", sans-serif',
    },
    primaryColor: {
      label: 'Node fill',
      hint: '',
    },
    primaryBorderColor: {
      label: 'Accent / stroke',
      hint: '',
    },
    lineColor: {
      label: 'Edge color',
      hint: '',
    },
    clusterBkg: {
      label: 'Subgraph background',
      hint: '',
    },
    autoAlignSubgraphs: {
      label: 'Auto-align standalone subgraphs',
      hint: 'When subgraphs have no edges between them, invisible edges string them into one row',
    },
  },

  /** 下拉选项文案 */
  options: {
    base: 'Base (custom palette)',
    default: 'Default (native Mermaid)',
    elk: 'ELK (recommended)',
    dagre: 'Dagre (classic)',
    classic: 'Classic (straight lines)',
    handDrawn: 'Hand-drawn (rough.js jitter)',
    linear: 'Orthogonal',
    basis: 'Bezier (default)',
    cardinal: 'Smooth curve',
    monotoneX: 'Monotone smooth',
    tb: 'Top → Bottom (TB)',
    lr: 'Left → Right (LR)',
    bt: 'Bottom → Top (BT)',
    rl: 'Right → Left (RL)',
  },

  exportDialog: {
    title: 'Export',
    empty: 'There is nothing to export right now.',
    format: 'Format',
    resolution: 'Resolution',
    background: 'Background',
    bgWhite: 'White',
    bgTransparent: 'Transparent (PNG only)',
    bgCurrent: 'Current theme background',
    filename: 'File name',
    cancel: 'Cancel',
    doExport: 'Export',
    exporting: 'Exporting…',
  },

  /** 预设展示名与描述；键名与 PresetId 一一对应 */
  presets: {
    modern: {
      name: 'Modern (default)',
      desc: 'ELK orthogonal edges + crisp blue-and-white cards, Notion / Linear flavour',
    },
    github: {
      name: 'GitHub',
      desc: 'GitHub Primer greyscale + system fonts + square nodes, mimics GitHub’s look',
    },
    classic: {
      name: 'Classic',
      desc: 'Native Mermaid default theme, pixel-faithful: lilac nodes + buttery subgraphs',
    },
    dark: {
      name: 'Dark',
      desc: 'VS Code Dark+ greyscale, made for embedding into a dark interface',
    },
    sketch: {
      name: 'Sketch',
      desc: 'rough.js hand-drawn strokes on warm paper, Excalidraw whiteboard style',
    },
    anime: {
      name: 'Anime',
      desc: 'Rounded font + sakura pink + soft glow, a fresh Japanese animation feel',
    },
    cyberpunk: {
      name: 'Cyberpunk',
      desc: 'Neon cyan/magenta glow + monospace + orthogonal edges, deep sci-fi mood',
    },
    'tokyo-night': {
      name: 'Tokyo Night',
      desc: 'Deep indigo night theme with syntax-blue accents, a VS Code favourite',
    },
    catppuccin: {
      name: 'Catppuccin',
      desc: 'Mocha pastel dark theme, low-saturation cream and mauve, easy on the eyes',
    },
    nord: {
      name: 'Nord',
      desc: 'Nordic minimal dark theme: cool blue-greys + glacier blue, restrained',
    },
    dracula: {
      name: 'Dracula',
      desc: 'Classic purple dark theme: deep violet ground + neon violet accents',
    },
    'solarized-light': {
      name: 'Solarized Light',
      desc: 'Classic light palette: warm paper ground + muted blue accents',
    },
  },
};
