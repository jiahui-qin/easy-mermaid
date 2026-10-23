import type { UiConfig } from '../types';

/**
 * mermaid 的 %%{init}%% 指令会消毒 themeVariables 的值：
 * 只有 /^[\d "#%(),.;A-Za-z]+$/ 内的字符能存活，其余一律清空成 ""。
 * 连字符 - 不在白名单里，于是 sans-serif / monospace / system-ui 这些
 * generic family 会让整条字体栈被静默清空、回落 mermaid 默认字体
 * （之前 7 个预设里 5 个的字体栈以 sans-serif 结尾，全部中招）。
 * 这里按逗号拆条、丢弃含白名单外字符的条目；浏览器对缺失的 generic
 * family 有隐式回退，视觉效果与显式写 sans-serif 基本一致。
 */
const MERMAID_TV_SAFE = /^[\d "#%(),.;A-Za-z]+$/;
const FALLBACK_STACK = 'Arial';

function sanitizeFontStack(stack: string): string {
  const entries = stack
    .split(',')
    .map((s) => s.trim().replace(/'/g, '"'))
    .filter((s) => s.length > 0 && MERMAID_TV_SAFE.test(s));
  return entries.length > 0 ? entries.join(', ') : FALLBACK_STACK;
}

/**
 * 把用户配置合并成 mermaid 的 init 配置对象。
 * 当 mermaidTheme === 'default' 时，直接用 mermaid 内置 default 主题，
 * 不传 themeVariables，让 mermaid 自行解析完整色板（与 GitHub 完全一致）。
 */
export function buildMermaidConfig(cfg: UiConfig): Record<string, unknown> {
  const flowchart: Record<string, unknown> = {
    defaultRenderer: cfg.renderer,
    look: cfg.look,
    curve: cfg.curve,
    nodeSpacing: cfg.nodeSpacing,
    rankSpacing: cfg.rankSpacing,
    padding: cfg.padding,
    htmlLabels: true,
  };

  if (cfg.mermaidTheme === 'default') {
    return {
      startOnLoad: false,
      theme: 'default',
      flowchart,
    };
  }

  const themeVariables: Record<string, unknown> = {
    fontSize: `${cfg.fontSize}px`,
    fontFamily: sanitizeFontStack(cfg.fontFamily),
    primaryColor: cfg.primaryColor,
    primaryBorderColor: cfg.primaryBorderColor,
    primaryTextColor: cfg.theme === 'dark' ? '#e5e7eb' : '#1f2937',
    textColor: cfg.theme === 'dark' ? '#e2e8f0' : '#334155',
    nodeTextColor: cfg.theme === 'dark' ? '#e2e8f0' : '#334155',
    lineColor: cfg.lineColor,
    clusterBkg: cfg.clusterBkg,
    clusterBorder: cfg.theme === 'dark' ? '#3a4a63' : '#dde5ef',
    ...cfg.extraThemeVariables,
  };

  return {
    startOnLoad: false,
    theme: 'base',
    themeVariables,
    flowchart,
  };
}

/**
 * 把 init 指令注入到 mermaid 源码前。
 * mermaid 的 %%{init:...}%% 最稳的形式是单行 JSON（不是多行 YAML），
 * 否则解析器在遇到嵌套/引号时很容易报 "No diagram type detected"。
 */
export function injectInit(code: string, cfg: UiConfig): string {
  const conf = buildMermaidConfig(cfg);
  // 用 JSON 单行形式，mermaid 官方明确支持这种写法
  const json = JSON.stringify(conf);
  const stripped = stripInit(code);
  return `%%{init: ${json}}%%\n${stripped}`;
}

function stripInit(code: string): string {
  // 匹配 %%{init: ...}%% 直到 %% 结束（可能跨行）
  return code.replace(/%%\{init:[\s\S]*?\}%%\s*/g, '').replace(/^\s+/, '');
}
