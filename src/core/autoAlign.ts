/**
 * 检测源码中多个顶层 subgraph 之间是否有相互有向边；
 * 若没有，在源码末尾追加隐形边把它们串成链，迫使 dagre/elk 上下分层。
 * 我们保守处理：只匹配 `subgraph X` 或 `subgraph X["..."]` 顶层声明。
 *
 * 隐形边使用 mermaid 的 `~~~` 操作符：只参与布局、不绘制线条，
 * 因此不需要任何 linkStyle/classDef 隐藏手段，也不会和用户
 * 已有的 linkStyle 索引冲突。切勿给这些 subgraph 补
 * style fill:none,stroke:none——那会连子图本身的边框背景一起清掉。
 */
export function autoAlignSubgraphs(code: string): string {
  const subgraphs: string[] = [];
  const re = /^\s*subgraph\s+([A-Za-z_][A-Za-z0-9_]*)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (!subgraphs.includes(m[1])) subgraphs.push(m[1]);
  }
  if (subgraphs.length < 2) return code;

  // 收集边的两端：a --> b / a -.-> b 等
  const edgePairs: Array<[string, string]> = [];
  const edgeRe = /([A-Za-z_][A-Za-z0-9_]*)\s*(?:-->|---|-\.->|==>|--x|--o)\s*([A-Za-z_][A-Za-z0-9_]*)/g;
  while ((m = edgeRe.exec(code))) {
    edgePairs.push([m[1], m[2]]);
  }

  const linked = new Set<string>();
  for (const [a, b] of edgePairs) {
    if (subgraphs.includes(a) && subgraphs.includes(b)) {
      linked.add(a);
      linked.add(b);
    }
  }

  // 找出顶层独立的、无相互边的 subgraph 链片段
  const chainOrder = subgraphs.filter((s) => !linked.has(s));
  if (chainOrder.length < 2) return code;

  // 追加隐形边。用 mermaid 的 `~~~` 操作符：它在布局层面建立从属关系
  // （把两个 subgraph 拉到同一层级链上），但不绘制任何线条。
  // 注意：不要给这些 subgraph 追加 style fill:none,stroke:none——
  // mermaid 会把它转成 SVG 内联 !important 样式，直接把子图的
  // 填充和描边全部清掉（子图分组视觉消失）。
  const edgeLines: string[] = [];
  for (let i = 0; i < chainOrder.length - 1; i++) {
    edgeLines.push(`${chainOrder[i]} ~~~ ${chainOrder[i + 1]}`);
  }

  const hidden = `
%% === 自动对齐：以下为追加的隐形边（~~~ 不绘制线条，仅参与布局），不参与业务逻辑 ===
${edgeLines.join('\n')}
`;
  return code + hidden;
}
