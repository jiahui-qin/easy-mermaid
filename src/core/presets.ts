import type { Preset, UiConfig } from '../types';

export const FONT_STACK = '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif';
export const MONO_STACK = '"SF Mono", "Cascadia Code", "Fira Code", Consolas, monospace';
export const HAND_FONT_STACK = '"Comic Sans MS", "Marker Felt", "Bradley Hand", "Segoe Print", "Caveat", cursive';
/** GitHub 的系统字体栈（-apple-system 含连字符会被 mermaid 指令消毒吞掉，用 BlinkMacSystemFont 等价替代） */
export const GITHUB_FONT_STACK = 'BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif';

export const defaultUiConfig: UiConfig = {
  preset: 'modern',
  mermaidTheme: 'base',
  renderer: 'elk',
  look: 'classic',
  curve: 'linear',
  direction: 'TB',
  nodeSpacing: 50,
  rankSpacing: 72,
  padding: 18,
  radius: 6,
  fontSize: 14,
  fontFamily: FONT_STACK,
  primaryColor: '#eef4ff',
  primaryBorderColor: '#3b82f6',
  lineColor: '#b6c2d4',
  clusterBkg: '#ffffff',
  clusterLabelColor: '#64748b',
  autoAlignSubgraphs: true,
  theme: 'light',
  extraThemeVariables: {},
};

export const presets: Preset[] = [
  // ===== 现代：清爽蓝白卡片，Notion / Linear 风格 =====
  // 设计要点：克制的单色蓝 accent + 退到背景里的连线 + 大留白，
  // 节点近白浅蓝底保持"轻"，文字用 slate 深灰保证对比度，
  // svgCss 把节点投影加重一档，做出"卡片浮在画布上"的层次。
  {
    id: 'modern',
    nameKey: 'presets.modern.name',
    descKey: 'presets.modern.desc',
    cfg: {
      preset: 'modern',
      theme: 'light',
      mermaidTheme: 'base',
      renderer: 'elk',
      look: 'classic',
      curve: 'linear',
      nodeSpacing: 50,
      rankSpacing: 72,
      padding: 18,
      radius: 6,
      fontSize: 14,
      fontFamily: FONT_STACK,
      primaryColor: '#eef4ff',
      primaryBorderColor: '#3b82f6',
      lineColor: '#b6c2d4',
      clusterBkg: '#ffffff',
      clusterLabelColor: '#64748b',
      svgCss:
        '.node > :is(rect,polygon,circle,ellipse,path):not([filter]){filter:drop-shadow(0 1px 3px rgba(15,23,42,.10)) !important;}',
      extraThemeVariables: {
        mainBkg: '#eef4ff',
        nodeBorder: '#3b82f6',
        secondBkg: '#dfe9fb',
        tertiaryColor: '#f1f5f9',
        edgeLabelBackground: '#ffffff',
        clusterBorder: '#e2e8f0',
        textColor: '#334155',
        nodeTextColor: '#334155',
        primaryTextColor: '#1d4ed8',
        background: '#ffffff',
        transitionColor: '#e2e8f0',
      },
    },
  },

  // ===== GitHub：Primer 灰阶，复刻 GitHub 的干净观感 =====
  // 设计要点：GitHub 设计系统（Primer）的浅灰画布 + 灰阶边框/连线，
  // 白底节点、#f6f8fa 子图、#57606a 箭头、#1f2328 文字、系统字体。
  {
    id: 'github',
    nameKey: 'presets.github.name',
    descKey: 'presets.github.desc',
    cfg: {
      preset: 'github',
      theme: 'light',
      mermaidTheme: 'base',
      renderer: 'dagre',
      look: 'classic',
      curve: 'basis',
      nodeSpacing: 50,
      rankSpacing: 50,
      padding: 15,
      radius: 0,
      fontSize: 14,
      fontFamily: GITHUB_FONT_STACK,
      primaryColor: '#ffffff',
      primaryBorderColor: '#d0d7de',
      lineColor: '#57606a',
      clusterBkg: '#f6f8fa',
      clusterLabelColor: '#57606a',
      extraThemeVariables: {
        mainBkg: '#ffffff',
        nodeBorder: '#d0d7de',
        secondBkg: '#f6f8fa',
        tertiaryColor: '#f6f8fa',
        edgeLabelBackground: '#f6f8fa',
        clusterBorder: '#d0d7de',
        textColor: '#1f2328',
        nodeTextColor: '#1f2328',
        primaryTextColor: '#0969da',
        background: '#ffffff',
        transitionColor: '#d0d7de',
      },
    },
  },

  // ===== 经典：Mermaid 原生默认主题，原汁原味保真 =====
  // 直接用 mermaid 内置 default 主题（不传 themeVariables）：
  // 淡紫节点 #ECECFF + 淡黄 cluster #ffffde + 紫色描边 #9370DB +
  // trebuchet 16px + radius 5 + dagre + basis。
  {
    id: 'classic',
    nameKey: 'presets.classic.name',
    descKey: 'presets.classic.desc',
    cfg: {
      preset: 'classic',
      theme: 'light',
      mermaidTheme: 'default',
      renderer: 'dagre',
      look: 'classic',
      curve: 'basis',
      nodeSpacing: 50,
      rankSpacing: 50,
      padding: 15,
      radius: 5,
      fontSize: 16,
      fontFamily: '"trebuchet ms", verdana, arial, sans-serif',
      primaryColor: '#ECECFF',
      primaryBorderColor: '#9370DB',
      lineColor: '#333333',
      clusterBkg: '#ffffde',
      clusterLabelColor: '#7a6f1f',
    },
  },

  // ===== 暗色：VS Code Dark+ 灰阶 =====
  // 设计要点：VS Code Dark+ 的三层灰（编辑器 #1e1e1e / 面板 #252526 /
  // 边框 #3c3c3c）+ #cccccc 文字 + 灰 #808080 连线 + 语法蓝 #9cdcfe 强调，
  // 节点直角，整体是"代码编辑器里长出来的图"。
  {
    id: 'dark',
    nameKey: 'presets.dark.name',
    descKey: 'presets.dark.desc',
    cfg: {
      preset: 'dark',
      mermaidTheme: 'base',
      renderer: 'elk',
      look: 'classic',
      curve: 'linear',
      theme: 'dark',
      nodeSpacing: 50,
      rankSpacing: 70,
      padding: 16,
      radius: 4,
      fontSize: 14,
      fontFamily: FONT_STACK,
      primaryColor: '#252526',
      primaryBorderColor: '#007acc',
      lineColor: '#808080',
      clusterBkg: '#1e1e1e',
      clusterLabelColor: '#9aa5b1',
      extraThemeVariables: {
        mainBkg: '#252526',
        nodeBorder: '#3c3c3c',
        secondBkg: '#2d2d2d',
        tertiaryColor: '#1e1e1e',
        edgeLabelBackground: '#252526',
        clusterBorder: '#3c3c3c',
        textColor: '#cccccc',
        nodeTextColor: '#cccccc',
        primaryTextColor: '#9cdcfe',
        background: '#1e1e1e',
        transitionColor: '#3c3c3c',
      },
    },
  },

  // ===== 手绘风：mermaid 原生 handDrawn 渲染，Excalidraw 白板风 =====
  // 关键：look: 'handDrawn' 让 mermaid 用 rough.js 绘制抖动线条和手绘边框，
  // 而不是只用 cursive 字体假装手写。暖纸底色 + 棕色墨迹。
  {
    id: 'sketch',
    nameKey: 'presets.sketch.name',
    descKey: 'presets.sketch.desc',
    cfg: {
      preset: 'sketch',
      theme: 'light',
      mermaidTheme: 'base',
      renderer: 'dagre',
      look: 'handDrawn',
      curve: 'basis',
      nodeSpacing: 55,
      rankSpacing: 55,
      padding: 14,
      radius: 0,
      fontSize: 16,
      fontFamily: HAND_FONT_STACK,
      primaryColor: '#fef9ef',
      primaryBorderColor: '#b5854e',
      lineColor: '#a9743f',
      clusterBkg: '#fff8e1',
      clusterLabelColor: '#8d6e63',
      extraThemeVariables: {
        mainBkg: '#fef9ef',
        nodeBorder: '#b5854e',
        secondBkg: '#fff3cd',
        tertiaryColor: '#fffbeb',
        edgeLabelBackground: '#fef9ef',
        clusterBorder: '#d4a574',
        textColor: '#4e342e',
        nodeTextColor: '#4e342e',
        primaryTextColor: '#6d4c41',
        background: '#fffdf5',
      },
    },
  },

  // ===== 动漫风：粉樱柔和，sakura / 少女漫风 =====
  // 设计要点：樱花粉白节点 + 玫瑰紫文字 + 大圆角 + cardinal 柔曲线，
  // svgCss 给节点和子图加一层粉色柔光，整体"发光"的少女漫质感。
  {
    id: 'anime',
    nameKey: 'presets.anime.name',
    descKey: 'presets.anime.desc',
    cfg: {
      preset: 'anime',
      theme: 'light',
      mermaidTheme: 'base',
      renderer: 'dagre',
      look: 'classic',
      curve: 'cardinal',
      nodeSpacing: 50,
      rankSpacing: 60,
      padding: 14,
      radius: 8,
      fontSize: 15,
      fontFamily: '"Yu Gothic", "Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", "Noto Sans JP", "Noto Sans SC", sans-serif',
      primaryColor: '#ffeef4',
      primaryBorderColor: '#f48fb1',
      lineColor: '#e89cbe',
      clusterBkg: '#fdf3f8',
      clusterLabelColor: '#b45f7e',
      svgCss:
        '.node > :is(rect,polygon,circle,ellipse,path):not([filter]){filter:drop-shadow(0 2px 5px rgba(233,120,160,.25)) !important;}' +
        '.cluster rect{filter:drop-shadow(0 2px 6px rgba(233,120,160,.15)) !important;}',
      extraThemeVariables: {
        mainBkg: '#ffeef4',
        nodeBorder: '#f48fb1',
        secondBkg: '#fbe0ea',
        tertiaryColor: '#f5e9f7',
        edgeLabelBackground: '#fff5f8',
        clusterBorder: '#f9b8d0',
        textColor: '#880e4f',
        nodeTextColor: '#880e4f',
        primaryTextColor: '#c2185b',
        background: '#fffafc',
        transitionColor: '#f9b8d0',
      },
    },
  },

  // ===== 赛博朋克：霓虹辉光，Blade Runner / Cyberpunk 2077 风 =====
  // svgCss 是灵魂：节点青霓虹、连线洋红霓虹、标签双层辉光、子图紫光，
  // 配上等宽体和深紫黑画布，霓虹灯管的质感。
  {
    id: 'cyberpunk',
    nameKey: 'presets.cyberpunk.name',
    descKey: 'presets.cyberpunk.desc',
    cfg: {
      preset: 'cyberpunk',
      mermaidTheme: 'base',
      renderer: 'elk',
      look: 'classic',
      curve: 'linear',
      theme: 'dark',
      nodeSpacing: 50,
      rankSpacing: 65,
      padding: 18,
      radius: 4,
      fontSize: 14,
      fontFamily: MONO_STACK,
      primaryColor: '#0d0221',
      primaryBorderColor: '#00f5ff',
      lineColor: '#ff00aa',
      clusterBkg: '#190a3a',
      clusterLabelColor: '#c084fc',
      svgCss:
        '.node > :is(rect,polygon,circle,ellipse,path):not([filter]){filter:drop-shadow(0 0 5px rgba(0,245,255,.55)) !important;}' +
        '.edgePath .path,.flowchart-link{filter:drop-shadow(0 0 4px rgba(255,0,170,.6)) !important;}' +
        '.edgeLabel p{text-shadow:0 0 6px rgba(255,0,170,.9),0 0 12px rgba(0,245,255,.55) !important;}' +
        '.cluster rect{filter:drop-shadow(0 0 7px rgba(123,44,191,.5)) !important;}',
      extraThemeVariables: {
        mainBkg: '#0d0221',
        nodeBorder: '#00f5ff',
        secondBkg: '#2a0a4a',
        tertiaryColor: '#1a0533',
        edgeLabelBackground: '#0d0221',
        clusterBorder: '#7b2cbf',
        textColor: '#e0aaff',
        nodeTextColor: '#e0aaff',
        primaryTextColor: '#00f5ff',
        background: '#0a0118',
        transitionColor: '#7b2cbf',
      },
    },
  },

  // ===== 以下 5 个为流行编辑器主题（色板参考 beautiful-mermaid 的主题体系）=====
  // beautiful-mermaid（MIT, lukilabs/beautiful-mermaid）用「bg + fg 两色起步、
  // 其余角色色按色阶比例推导」的思路定义了 15 个编辑器主题。这里把它验证过的
  // 色板按 mermaid 的 themeVariables 结构落地：bg → clusterBkg / background，
  // fg → textColor，accent → primaryBorderColor，line → lineColor，
  // muted → clusterLabelColor，node fill / stroke 用官方 surface / border 色。
  // ===== Tokyo Night：VS Code 最流行暗色主题之一 =====
  // 深蓝夜空底 #1a1b26 + 语法蓝 #7aa2f7 + 冷灰连线 #3d59a1。
  {
    id: 'tokyo-night',
    nameKey: 'presets.tokyo-night.name',
    descKey: 'presets.tokyo-night.desc',
    cfg: {
      preset: 'tokyo-night',
      theme: 'dark',
      mermaidTheme: 'base',
      renderer: 'elk',
      look: 'classic',
      curve: 'linear',
      nodeSpacing: 50,
      rankSpacing: 70,
      padding: 16,
      radius: 6,
      fontSize: 14,
      fontFamily: FONT_STACK,
      primaryColor: '#24283b',
      primaryBorderColor: '#7aa2f7',
      lineColor: '#3d59a1',
      clusterBkg: '#1a1b26',
      clusterLabelColor: '#565f89',
      extraThemeVariables: {
        mainBkg: '#24283b',
        nodeBorder: '#414868',
        secondBkg: '#2f3549',
        tertiaryColor: '#1f2333',
        edgeLabelBackground: '#24283b',
        clusterBorder: '#414868',
        textColor: '#c0caf5',
        nodeTextColor: '#c0caf5',
        primaryTextColor: '#7aa2f7',
        background: '#1a1b26',
        transitionColor: '#414868',
      },
    },
  },

  // ===== Catppuccin Mocha：社区最火的 pastel 暗色主题 =====
  // 低饱和奶油底 #1e1e2e + 柔和紫 mauve #cba6f7；cardinal 柔曲线 +
  // 大圆角呼应 pastel 的软性质感。
  {
    id: 'catppuccin',
    nameKey: 'presets.catppuccin.name',
    descKey: 'presets.catppuccin.desc',
    cfg: {
      preset: 'catppuccin',
      theme: 'dark',
      mermaidTheme: 'base',
      renderer: 'dagre',
      look: 'classic',
      curve: 'cardinal',
      nodeSpacing: 50,
      rankSpacing: 60,
      padding: 16,
      radius: 8,
      fontSize: 14,
      fontFamily: FONT_STACK,
      primaryColor: '#313244',
      primaryBorderColor: '#cba6f7',
      lineColor: '#585b70',
      clusterBkg: '#1e1e2e',
      clusterLabelColor: '#6c7086',
      extraThemeVariables: {
        mainBkg: '#313244',
        nodeBorder: '#45475a',
        secondBkg: '#45475a',
        tertiaryColor: '#313244',
        edgeLabelBackground: '#1e1e2e',
        clusterBorder: '#45475a',
        textColor: '#cdd6f4',
        nodeTextColor: '#cdd6f4',
        primaryTextColor: '#cba6f7',
        background: '#1e1e2e',
        transitionColor: '#45475a',
      },
    },
  },

  // ===== Nord：北欧极简暗色 =====
  // 北极圈雪夜配色：nord0 #2e3440 底 + frost 冰川蓝 #88c0d0。
  {
    id: 'nord',
    nameKey: 'presets.nord.name',
    descKey: 'presets.nord.desc',
    cfg: {
      preset: 'nord',
      theme: 'dark',
      mermaidTheme: 'base',
      renderer: 'elk',
      look: 'classic',
      curve: 'linear',
      nodeSpacing: 50,
      rankSpacing: 70,
      padding: 16,
      radius: 4,
      fontSize: 14,
      fontFamily: FONT_STACK,
      primaryColor: '#3b4252',
      primaryBorderColor: '#88c0d0',
      lineColor: '#4c566a',
      clusterBkg: '#2e3440',
      clusterLabelColor: '#616e88',
      extraThemeVariables: {
        mainBkg: '#3b4252',
        nodeBorder: '#4c566a',
        secondBkg: '#434c5e',
        tertiaryColor: '#3b4252',
        edgeLabelBackground: '#3b4252',
        clusterBorder: '#434c5e',
        textColor: '#d8dee9',
        nodeTextColor: '#d8dee9',
        primaryTextColor: '#88c0d0',
        background: '#2e3440',
        transitionColor: '#4c566a',
      },
    },
  },

  // ===== Dracula：经典紫暗色主题 =====
  // 深紫底 #282a36 + 霓虹紫 #bd93f9，对比强烈、辨识度极高。
  {
    id: 'dracula',
    nameKey: 'presets.dracula.name',
    descKey: 'presets.dracula.desc',
    cfg: {
      preset: 'dracula',
      theme: 'dark',
      mermaidTheme: 'base',
      renderer: 'dagre',
      look: 'classic',
      curve: 'basis',
      nodeSpacing: 50,
      rankSpacing: 55,
      padding: 16,
      radius: 4,
      fontSize: 14,
      fontFamily: FONT_STACK,
      primaryColor: '#44475a',
      primaryBorderColor: '#bd93f9',
      lineColor: '#6272a4',
      clusterBkg: '#282a36',
      clusterLabelColor: '#6272a4',
      extraThemeVariables: {
        mainBkg: '#44475a',
        nodeBorder: '#6272a4',
        secondBkg: '#44475a',
        tertiaryColor: '#6272a4',
        edgeLabelBackground: '#282a36',
        clusterBorder: '#44475a',
        textColor: '#f8f8f2',
        nodeTextColor: '#f8f8f2',
        primaryTextColor: '#bd93f9',
        background: '#282a36',
        transitionColor: '#6272a4',
      },
    },
  },

  // ===== Solarized Light：经典浅色护眼色板 =====
  // Ethan Schoonover 的经典配色：米黄纸底 base3 #fdf6e3 + 蓝 #268bd2，
  // 整组色板按感知亮度均匀设计，久看不累。
  {
    id: 'solarized-light',
    nameKey: 'presets.solarized-light.name',
    descKey: 'presets.solarized-light.desc',
    cfg: {
      preset: 'solarized-light',
      theme: 'light',
      mermaidTheme: 'base',
      renderer: 'dagre',
      look: 'classic',
      curve: 'basis',
      nodeSpacing: 50,
      rankSpacing: 55,
      padding: 16,
      radius: 6,
      fontSize: 14,
      fontFamily: FONT_STACK,
      primaryColor: '#eee8d5',
      primaryBorderColor: '#268bd2',
      lineColor: '#93a1a1',
      clusterBkg: '#fdf6e3',
      clusterLabelColor: '#93a1a1',
      extraThemeVariables: {
        mainBkg: '#eee8d5',
        nodeBorder: '#839496',
        secondBkg: '#eee8d5',
        tertiaryColor: '#fdf6e3',
        edgeLabelBackground: '#fdf6e3',
        clusterBorder: '#93a1a1',
        textColor: '#657b83',
        nodeTextColor: '#657b83',
        primaryTextColor: '#268bd2',
        background: '#fdf6e3',
        transitionColor: '#93a1a1',
      },
    },
  },
];

export function getPreset(id: string): Preset {
  return presets.find((p) => p.id === id) ?? presets[0];
}
