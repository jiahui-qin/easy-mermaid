/**
 * SVG 字符串 → 不同格式下载
 */

export type ExportFormat = 'svg' | 'png' | 'jpg';

export interface ExportOptions {
  format: ExportFormat;
  scale?: number; // PNG/JPG 用，默认 2
  background?: 'transparent' | 'white' | 'current';
  backgroundColor?: string; // 当 background==='current' 时使用
  filename?: string;
}

export function exportSvg(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename);
}

export async function exportRaster(
  svg: string,
  opts: ExportOptions
): Promise<void> {
  const scale = opts.scale ?? 2;
  const { width, height } = viewBoxSize(svg) ?? intrinsicSize(svg);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d 不可用');

  if (opts.format === 'jpg' || opts.background === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (opts.background === 'current' && opts.backgroundColor) {
    ctx.fillStyle = opts.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const svgBlob = new Blob([foreignObjectSvg(svg)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await loadImage(url);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const mime = opts.format === 'jpg' ? 'image/jpeg' : 'image/png';
    const filename = ensureExt(opts.filename ?? 'mermaid', opts.format);
    canvas.toBlob((b) => {
      if (b) downloadBlob(b, filename);
    }, mime, 0.95);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function viewBoxSize(svg: string): { width: number; height: number } | null {
  const m = /viewBox\s*=\s*"([\d\.\-\s]+)"/.exec(svg);
  if (!m) return null;
  const parts = m[1].trim().split(/\s+/).map(Number);
  if (parts.length !== 4) return null;
  return { width: parts[2], height: parts[3] };
}

/* ------------------------------------------------------------------ *
 * foreignObject → <text> 转换（canvas 去污染）
 *
 * Chrome 遇到 SVG 内嵌 HTML（foreignObject）会把 canvas 判为污染，
 * 导致 toBlob 回调拿到 null、PNG/JPG 导出静默失败。
 *
 * 实现要点：
 * 1. 按“视觉行”拆行，而不是只按 <br>。mermaid 的 htmlLabels 用
 *    max-width + white-space 让长标签自动换行，换行不会在 DOM 里留下
 *    <br>；只按 <br> 拆会把自动换行的多行塌成一行，导出后文字横向
 *    溢出节点框。视觉行用 Range.getClientRects() 量：单个文本节点可能
 *    跨多行（二分定位行边界），同一行的片段（<br> 前后、行内元素）
 *    按垂直中心合并，emoji 墨迹盒更高所以合并容差按字号放大。
 * 2. 每行 y 用实时渲染的真实行中心（屏幕坐标 ÷ 视口缩放换算成
 *    viewBox 用户单位），不假设行高；x 取 foreignObject 水平中心
 *    （mermaid 不给 fo 设 x/y 属性，局部原点就是父 g.label 的原点）。
 * 3. 文字色取每个标签 span 的计算 color —— HTML span 上的 fill 是
 *    继承来的背景色（如节点填充色），拿来做文字色会几乎看不见。
 * 4. 边标签加 paint-order 描边光晕：流程图的边标签没有背景，导出后
 *    文字直接压在连线上，没有光晕会看不清。
 * ------------------------------------------------------------------ */

interface LiveLabelStyle {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  /** 标签容器的背景色（边标签用；transparent 表示无背景，需要光晕） */
  bg?: string;
  isEdge: boolean;
}

interface VisualLine {
  text: string;
  /** 行中心在 foreignObject 局部坐标里的 y（viewBox 用户单位） */
  centerY: number;
}

function foreignObjectSvg(svg: string): string {
  if (!/<foreignObject[\s>]/i.test(svg)) return svg;
  const doc = new DOMParser().parseFromString(svg, 'text/html');
  const fos = Array.from(doc.querySelectorAll('foreignObject'));
  if (fos.length === 0) return svg;

  // 实时渲染的 DOM：用来量视觉行和每标签的真实计算样式。
  // 传入的 svg 字符串就是当前预览的 SVG，foreignObject 顺序一致。
  // 选择器限定 .viewer，避开放大弹窗里的那份副本。
  const liveSvg = document.querySelector('.viewer .zoom-viewer svg');
  const liveFos = liveSvg ? Array.from(liveSvg.querySelectorAll('foreignObject')) : [];
  const useLive = liveFos.length === fos.length;
  const scale = useLive ? liveViewportScale(liveSvg) : 1;
  const styles = useLive ? liveLabelStyles(liveSvg) : [];
  // 光晕明暗按“图自己”的背景色判断，而不是界面明暗：
  // 界面亮 + 暗色图表预设（cyberpunk 等）时，白底光晕会很难看
  const dark = isDarkSvg(svg);
  const halo = dark ? 'rgba(9,11,22,0.9)' : 'rgba(255,255,255,0.95)';

  fos.forEach((fo, i) => {
    const w = parseFloat(fo.getAttribute('width') ?? '0');
    const st = styles[i];
    const liveFo = useLive ? liveFos[i] : null;
    const lines = liveFo ? visualLines(liveFo, scale) : fallbackLines(fo);

    // 空标签容器（无标签的边也会渲染一个空 span）也必须处理掉：
    // 残留任何 foreignObject 都会让 Chrome 把画布判为污染，导出静默失败
    if (lines.length === 0) {
      fo.remove();
      return;
    }

    const fontSizePx = parseFloat(st?.fontSize ?? '14') || 14;
    // mermaid 不给 foreignObject 设 x/y，父级 g.label 的局部原点即其左上角
    const cx = w / 2;

    const text = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    if (st?.fontFamily) text.setAttribute('font-family', st.fontFamily);
    text.setAttribute('font-size', st?.fontSize || '14px');
    text.setAttribute('fill', st?.color || '#000');
    text.setAttribute('x', String(cx));
    text.setAttribute('y', String(lines[0].centerY));
    // dominant-baseline=central 让 y 直接作为垂直中心
    text.setAttribute('dominant-baseline', 'central');

    /**
     * mermaid 的 classDef 会生成 `.xxx span { fill:...; stroke:...; stroke-width:1.5px !important }`。
     * 实时 DOM 里 span 是 HTML 元素，fill/stroke 不渲染，所以屏幕上看不出来；
     * 但导出成原生 <text> 后，这些样式就变成了实打实的「彩色填充 + 描边」，
     * 导致导出的节点文字又粗又花（与屏幕上的深灰常规体完全不一致）。
     *
     * 这里用内联 style + !important 反制：文字色锁死、描边清零、字重归一。
     * 边标签例外——它需要描边光晕，所以单独用光晕色描边。
     */
    const haloColor = st?.bg && st.bg !== 'transparent' ? st.bg : halo;
    const isEdge = !!st?.isEdge;
    text.setAttribute(
      'style',
      `fill:${st?.color || '#000'} !important;` +
        (isEdge
          ? `stroke:${haloColor} !important;` +
            `stroke-width:${Math.max(2.5, fontSizePx * 0.22)} !important;` +
            'stroke-linejoin:round !important;' +
            'paint-order:stroke !important;'
          : 'stroke:none !important;stroke-width:0 !important;') +
        'font-weight:inherit !important;'
    );

    lines.forEach((line) => {
      const tspan = doc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', String(cx));
      tspan.setAttribute('y', String(line.centerY));
      tspan.textContent = line.text;
      text.appendChild(tspan);
    });
    fo.replaceWith(text);
  });

  const host = doc.querySelector('svg');
  if (!host) return svg;
  // 还原成 standalone SVG 文档（Image 只认这个），并声明 xmlns
  host.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  host.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  return '<?xml version="1.0" encoding="UTF-8"?>' + host.outerHTML;
}

/**
 * 按浏览器的实际换行拆出视觉行。
 * liveFo 是实时 DOM 里对应的 foreignObject（导出用的 fo 已脱离文档，量不到布局）。
 */
function visualLines(liveFo: Element, scale: number): VisualLine[] {
  const liveP = liveFo.querySelector('p') ?? liveFo;
  const foRect = liveFo.getBoundingClientRect();
  if (!foRect.height || scale <= 0) return [];

  const fontSizePx = parseFloat(getComputedStyle(liveP).fontSize || '14') || 14;
  // 同一视觉行的垂直中心容差：emoji 的墨迹盒比文字高，中心会偏
  const tol = Math.max(4, fontSizePx * 0.4);

  const range = document.createRange();
  const lines: { center: number; parts: string[]; width: number; widestCenter: number }[] = [];
  const lineOf = (center: number) => {
    for (const l of lines) {
      if (Math.abs(l.center - center) <= tol) return l;
    }
    const l = { center, parts: [] as string[], width: 0, widestCenter: center };
    lines.push(l);
    return l;
  };
  const push = (rect: DOMRect, chunk: string) => {
    if (!chunk) return;
    const center = (rect.top + rect.bottom) / 2;
    const l = lineOf(center);
    l.parts.push(chunk);
    // 行中心取最宽片段的中心（文字片段通常最宽，最能代表整行位置）
    if (rect.width > l.width) {
      l.width = rect.width;
      l.widestCenter = center;
    }
  };

  const walker = document.createTreeWalker(liveP, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent ?? '';
    if (!text || !text.trim()) continue;
    range.selectNodeContents(node);
    const rects = Array.from(range.getClientRects()).filter((r) => r.height > 0);
    if (rects.length === 0) continue;

    if (rects.length === 1) {
      push(rects[0], text);
      continue;
    }

    // 文本节点跨多行：二分找出每个视觉行结束的字符偏移
    // （range 从 1 个 rect 变成 2 个的位置就是行边界）
    let start = 0;
    for (const rect of rects) {
      let lo = start + 1;
      let hi = text.length;
      let best = start;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        range.setStart(node, start);
        range.setEnd(node, mid);
        if (range.getClientRects().length === 1) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      // 不把代理对（emoji 的 surrogate pair）拆散到两行
      let end = best;
      if (end > start && end < text.length && isHighSurrogate(text.charCodeAt(end - 1))) {
        end--;
      }
      if (end <= start) end = Math.min(start + 1, text.length);
      push(rect, text.slice(start, end));
      start = end;
      // 跳过换行产生的空白字符
      while (start < text.length && /\s/.test(text.charAt(start))) start++;
    }
  }

  return lines
    .map((l) => ({
      text: l.parts.join('').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim(),
      centerY: (l.widestCenter - foRect.top) / scale,
    }))
    .filter((l) => l.text.length > 0);
}

function isHighSurrogate(code: number): boolean {
  return code >= 0xd800 && code <= 0xdbff;
}

/** 没有实时 DOM 时的降级：按 <br> 拆行，行高均分估算垂直位置 */
function fallbackLines(fo: Element): VisualLine[] {
  const p = fo.querySelector('p');
  const html = p ? p.innerHTML : (fo.textContent ?? '');
  const texts = html
    .split(/<br\s*\/?>/i)
    .map((line) => line.replace(/<[^>]*>/g, ''))
    .map((line) => line.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 0);
  const h = parseFloat(fo.getAttribute('height') ?? '0') || texts.length * 21;
  const lh = h / Math.max(1, texts.length);
  return texts.map((text, i) => ({ text, centerY: lh * (i + 0.5) }));
}

/**
 * 判断 SVG 是不是暗色图：优先从 mermaid 生成的样式里取背景色
 * （base 主题的 themeVariables.background / default 主题的 .background fill），
 * 取不到时回退到界面 data-theme。亮度阈值 128（感知亮度的近似）。
 */
function isDarkSvg(svg: string): boolean {
  const m =
    /\.background\s*\{[^}]*fill:\s*([#\w(),.\s%]+?)\s*[;}]/.exec(svg) ??
    /background:\s*([#\w(),.\s%]+?)\s*[;}]/.exec(svg);
  if (m) {
    const lum = relativeLuminance(m[1].trim());
    if (lum !== null) return lum < 0.35;
  }
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

/** #rgb / #rrggbb / rgb(...) → 相对亮度（0-1）；无法解析返回 null */
function relativeLuminance(color: string): number | null {
  let r = 0, g = 0, b = 0;
  const hex = color.replace(/^#/, '');
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    const rgb = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(color);
    if (!rgb) return null;
    r = parseFloat(rgb[1]);
    g = parseFloat(rgb[2]);
    b = parseFloat(rgb[3]);
  }
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** 实时 SVG 的屏幕尺寸 → viewBox 用户单位的缩放（考虑 letterbox） */
function liveViewportScale(liveSvg: Element | null): number {
  if (!liveSvg) return 1;
  const svg = liveSvg as SVGSVGElement;
  const vb = svg.viewBox?.baseVal;
  const r = svg.getBoundingClientRect();
  if (!vb || !vb.width || !vb.height || !r.width || !r.height) return 1;
  return Math.min(r.width / vb.width, r.height / vb.height) || 1;
}

/** 按 document order 取每个 foreignObject 标签的真实计算样式 */
function liveLabelStyles(liveSvg: Element | null): LiveLabelStyle[] {
  if (!liveSvg) return [];
  return Array.from(liveSvg.querySelectorAll('foreignObject')).map((fo) => {
    const span = fo.querySelector('span');
    const div = fo.querySelector('div');
    const cs = span ? getComputedStyle(span) : null;
    const dcs = div ? getComputedStyle(div) : null;
    return {
      fontFamily: cs?.fontFamily,
      fontSize: cs?.fontSize || '14px',
      // HTML span 的 fill 是继承来的背景色，文字色要用 color
      color: cs?.color,
      bg: dcs?.backgroundColor,
      isEdge: !!fo.closest('.edgeLabel'),
    };
  });
}

function intrinsicSize(svg: string): { width: number; height: number } {
  const w = /width\s*=\s*"([\d\.]+)/.exec(svg)?.[1];
  const h = /height\s*=\s*"([\d\.]+)/.exec(svg)?.[1];
  return { width: w ? parseFloat(w) : 800, height: h ? parseFloat(h) : 600 };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ensureExt(name: string, ext: string): string {
  const lower = name.toLowerCase();
  const want = `.${ext}`;
  return lower.endsWith(want) ? name : name + want;
}
