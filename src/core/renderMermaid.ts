import mermaid from 'mermaid';
import type { UiConfig } from '../types';
import { injectInit } from './injectInit';
import { autoAlignSubgraphs } from './autoAlign';

let initialized = false;
let elkRegistered = false;

export interface RenderResult {
  ok: boolean;
  svg?: string;
  error?: string;
  errorLine?: number;
}

export async function renderMermaid(code: string, cfg: UiConfig): Promise<RenderResult> {
  try {
    if (cfg.renderer === 'elk' && !elkRegistered) {
      const elk = await import('@mermaid-js/layout-elk');
      mermaid.registerLayoutLoaders(elk.default);
      elkRegistered = true;
    }
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
      initialized = true;
    }

    let processed = code;
    if (cfg.autoAlignSubgraphs) processed = autoAlignSubgraphs(processed);
    processed = applyDirection(processed, cfg.direction);
    const full = injectInit(processed, cfg);

    const { svg } = await mermaid.render(`bm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, full);
    // mermaid 会在 svg 上写死 style="max-width: XXpx"，顶掉才能让图随容器自适应
    const sized = svg.replace('<svg ', '<svg width="100%" ').replace(/style="([^"]*)"/, (_m, body) => {
      const cleaned = String(body)
        .split(';')
        .filter((kv: string) => kv.trim() && !/^\s*(max-width|width)\s*:/.test(kv))
        .join(';');
      return `style="${cleaned}"`;
    });
    return { ok: true, svg: polishSvg(sized, cfg) };
  } catch (e: any) {
    const msg = e?.message ?? String(e);
    const lineMatch = /line\s+(\d+)/i.exec(msg);
    return {
      ok: false,
      error: msg,
      errorLine: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
    };
  }
}

/**
 * 渲染后的全局润色层：往 SVG 里注入一段 <style> + 圆角属性，
 * 不依赖具体预设，统一提升所有图的质感。
 *
 * - 连线圆角端点/折角：ELK 正交折线转角更柔和
 * - 边标签同色系光晕：标签压在连线上时依然清晰
 * - 子图标题上色：mermaid 把 cluster 标题硬编码成 #000000，
 *   暗色主题下黑字深底几乎不可读，这里按 cfg.clusterLabelColor 覆盖
 * - 节点/cluster 圆角：现代预设的标志性观感（radius=0 时跳过）
 * - 节点微投影：几乎不可察觉的一层，把节点从纸面里"托"起来
 *   （已有 filter 属性的元素跳过，避免覆盖 handDrawn 的内置投影）
 *
 * 预设可以通过 cfg.svgCss 追加自己的装饰（霓虹辉光、软投影等），
 * 注入在通用层之后，需要时用 !important 覆盖通用层。
 *
 * 导出的 PNG/JPG 走 exportImage 的 foreignObject→text 转换，
 * <style> 与 shape 属性都会保留，润色效果同样生效。
 */
function polishSvg(svg: string, cfg: UiConfig): string {
  const dark = cfg.theme === 'dark';
  const halo = dark ? 'rgba(9,11,22,0.85)' : 'rgba(255,255,255,0.92)';
  const shadow = dark ? 'rgba(0,0,0,0.35)' : 'rgba(15,23,42,0.07)';
  const clusterLabel = cfg.clusterLabelColor ?? (dark ? '#cbd5e1' : '#475569');
  const css =
    '.edgePath .path,.flowchart-link{stroke-linecap:round;stroke-linejoin:round;}' +
    '.edgeLabel p{text-shadow:0 0 3px ' + halo + ',0 0 3px ' + halo + ';}' +
    '.cluster-label span{color:' + clusterLabel + ' !important;}' +
    '.cluster text{fill:' + clusterLabel + ' !important;}' +
    '.node > :is(rect,polygon,circle,ellipse,path):not([filter]){filter:drop-shadow(0 1px 1.5px ' + shadow + ');}' +
    (cfg.svgCss ?? '');

  let out = svg.replace(/<svg([^>]*)>/, `<svg$1><style>${css}</style>`);

  const r = Math.max(0, Math.round(cfg.radius ?? 0));
  if (r > 0) {
    // 节点矩形（class="basic label-container"，stadium 等自带 rx 的形状不动）
    out = out.replace(
      /<rect(?=[^>]*class="basic label-container")(?![^>]*\brx=)/g,
      `<rect rx="${r}"`
    );
    // cluster 矩形圆角略大一点，跟节点形成层次
    out = out.replace(
      /(<g class="cluster[^>]*>\s*<rect)(?![^>]*\brx=)/g,
      `$1 rx="${Math.min(r + 2, 12)}"`
    );
  }
  return out;
}

/**
 * 把源码首行的图类型 + 方向声明改写成 cfg.direction 指定的方向。
 * 匹配 `graph TB` / `flowchart LR` 等；若首行不含方向则补上。
 */
function applyDirection(code: string, dir: string): string {
  const re = /^(\s*(?:graph|flowchart)\s+)(TB|LR|BT|RL|td|tb|lr|bt|rl)?/i;
  const m = re.exec(code);
  if (!m) return code;
  const prefix = m[1];
  return code.slice(0, m.index) + prefix + dir + code.slice(m.index + m[0].length);
}
