import type { TranslationTree } from './types';

/**
 * 简体中文文案。
 *
 * 类型标注为 `TranslationTree`，编译期强制与 en.ts 的 key 集合完全一致：
 * - 缺少某个 key → TS 报错（属性缺失）
 * - 多出某个 key → TS 报错（对象字面量多余属性检查）
 */
export const zhCN: TranslationTree = {
  app: {
    title: 'Beauty Mermaid',
    tagline: '在浏览器里把 Mermaid 图变好看',
    langLabel: '语言',
    langZh: '中文',
    langEn: 'English',
  },

  topbar: {
    currentPreset: '当前预设：{preset} · {engine}',
    handDrawn: '手绘',
    share: '分享链接',
    copied: '已复制 ✓',
    themeDark: '🌙 暗色',
    themeLight: '☀️ 浅色',
    export: '导出',
  },

  editor: {
    placeholder: '在这里写 Mermaid…',
  },

  preview: {
    rendering: '渲染中…',
    errorAtLine: '行 {line}：{message}',
    empty: '没有可显示的图。',
  },

  viewer: {
    badgeTitle: '滚轮缩放 · 拖拽平移 · 双击复位',
    empty: '没有可显示的图。',
  },

  zoom: {
    title: '放大预览',
    zoomOut: '缩小 (−)',
    zoomIn: '放大 (+)',
    fit: '适应窗口',
    close: '关闭 (Esc)',
    footer: '滚轮缩放 · 拖拽平移 · 双击复位 · Esc 关闭',
    empty: '没有可显示的图。',
  },

  config: {
    presets: '预设',
    common: '常用配置',
    theme: '主题（图表）',
    advanced: '高级（themeVariables JSON）',
    themeLight: '浅色',
    themeDark: '深色',
  },

  fields: {
    mermaidTheme: {
      label: '底层主题',
      hint: '「Default」使用 mermaid 内置默认主题，与 GitHub 渲染完全一致',
    },
    renderer: {
      label: '布局引擎',
      hint: 'ELK 是直角正交布线，subgraph 分层更规整',
    },
    look: {
      label: '布局观感',
      hint: '手绘模式下节点边框和连线会有自然的抖动笔触',
    },
    curve: {
      label: '连线样式',
      hint: '',
    },
    direction: {
      label: '主方向',
      hint: '',
    },
    nodeSpacing: {
      label: '节点横向间距',
      hint: '',
    },
    rankSpacing: {
      label: '层级纵向间距',
      hint: '',
    },
    padding: {
      label: '节点内边距',
      hint: '',
    },
    radius: {
      label: '节点圆角',
      hint: '0 为直角；手绘观感下自动跳过',
    },
    fontSize: {
      label: '字号',
      hint: '',
    },
    fontFamily: {
      label: '字体栈',
      hint: '示例: "PingFang SC", "Microsoft YaHei", sans-serif',
    },
    primaryColor: {
      label: '节点填充',
      hint: '',
    },
    primaryBorderColor: {
      label: '主色/描边',
      hint: '',
    },
    lineColor: {
      label: '连线颜色',
      hint: '',
    },
    clusterBkg: {
      label: '子图背景',
      hint: '',
    },
    autoAlignSubgraphs: {
      label: '自动对齐独立子图',
      hint: '没有跨子图边时，自动加隐形边把它们上下串成一行',
    },
  },

  options: {
    base: 'Base（自定义色板）',
    default: 'Default（GitHub 原生）',
    elk: 'ELK（推荐）',
    dagre: 'Dagre（经典）',
    classic: '经典（规整线条）',
    handDrawn: '手绘（rough.js 抖动）',
    linear: '直角折线',
    basis: '贝塞尔（默认）',
    cardinal: '平滑曲线',
    monotoneX: '单调平滑',
    tb: '上 → 下（TB）',
    lr: '左 → 右（LR）',
    bt: '下 → 上（BT）',
    rl: '右 → 左（RL）',
  },

  exportDialog: {
    title: '导出',
    empty: '当前没有可导出的图。',
    format: '格式',
    resolution: '分辨率',
    background: '背景',
    bgWhite: '白色',
    bgTransparent: '透明（仅 PNG）',
    bgCurrent: '当前主题背景',
    filename: '文件名',
    cancel: '取消',
    doExport: '导出',
    exporting: '导出中…',
  },

  presets: {
    modern: {
      name: '现代（默认）',
      desc: 'ELK 直角折线 + 清爽蓝白卡片，Notion / Linear 风格',
    },
    github: {
      name: 'GitHub',
      desc: 'GitHub Primer 灰阶 + 系统字体 + 直角节点，复刻 GitHub 观感',
    },
    classic: {
      name: '经典',
      desc: 'Mermaid 原生默认主题保真：淡紫节点 + 淡黄子图 + trebuchet',
    },
    dark: {
      name: '暗色',
      desc: 'VS Code Dark+ 灰阶深色，适合暗色界面嵌入',
    },
    sketch: {
      name: '手绘风',
      desc: 'rough.js 真·手绘线条 + 暖色纸质感，Excalidraw 白板风格',
    },
    anime: {
      name: '动漫风',
      desc: '圆体字 + 樱花粉紫 + 柔光投影，清新柔和的日系动漫风格',
    },
    cyberpunk: {
      name: '赛博朋克',
      desc: '霓虹青洋红辉光 + 等宽体 + 直角折线，深色赛博朋克科技感',
    },
    'tokyo-night': {
      name: 'Tokyo Night',
      desc: '深蓝夜空暗色 + 语法蓝强调，VS Code 流行主题',
    },
    catppuccin: {
      name: 'Catppuccin',
      desc: 'Mocha pastel 柔和暗色，低饱和奶油紫护眼耐看',
    },
    nord: {
      name: 'Nord',
      desc: '北欧极简暗色：冷蓝灰 + 冰川蓝强调，低饱和克制',
    },
    dracula: {
      name: 'Dracula',
      desc: '经典紫暗色：深紫底 + 霓虹紫强调，对比强烈',
    },
    'solarized-light': {
      name: 'Solarized Light',
      desc: '经典浅色护眼色板：米黄纸底 + 蓝灰强调',
    },
  },
};
