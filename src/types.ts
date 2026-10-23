import type { TranslationKey } from './i18n/types';

export type Renderer = 'dagre' | 'elk';
export type Curve = 'basis' | 'linear' | 'stepBefore' | 'cardinal' | 'monotoneX' | 'bumpX';
export type Look = 'classic' | 'handDrawn';

export interface UiConfig {
  preset: string;
  mermaidTheme: 'base' | 'default';
  renderer: Renderer;
  look: Look;
  curve: Curve;
  direction: 'TB' | 'LR' | 'BT' | 'RL';
  nodeSpacing: number;
  rankSpacing: number;
  padding: number;
  radius: number;
  fontSize: number;
  fontFamily: string;
  primaryColor: string;
  primaryBorderColor: string;
  lineColor: string;
  clusterBkg: string;
  autoAlignSubgraphs: boolean;
  /** 图表明暗：决定 mermaid 润色层光晕配色与导出默认背景，**不影响界面明暗**（界面明暗是独立本地偏好，见 App.tsx 的 uiTheme） */
  theme: 'light' | 'dark';
  /** 子图标题颜色（润色层用；缺省按明暗主题给默认值） */
  clusterLabelColor?: string;
  /** 预设级 SVG 装饰 CSS，注入在通用润色层之后，可用 !important 覆盖通用层 */
  svgCss?: string;
  // 高级层，并入 mermaid themeVariables
  extraThemeVariables: Record<string, unknown>;
}

export interface AppState {
  code: string;
  cfg: UiConfig;
}

export interface Preset {
  id: string;
  /** 展示名的文案路径（指向 i18n 字典的 presets.<id>.name） */
  nameKey: TranslationKey;
  /** 描述文案路径（指向 i18n 字典的 presets.<id>.desc） */
  descKey: TranslationKey;
  cfg: Partial<UiConfig>;
}
