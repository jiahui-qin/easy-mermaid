<div align="center">

# 🎨 Easy Mermaid

**浏览器里的 Mermaid 美化器 —— 12 套预设、矢量缩放、PNG/JPG/SVG 导出、可分享链接，零后端。**

[在线体验](https://jiahui-qin.github.io/easy-mermaid/) · [问题反馈](https://github.com/jiahui-qin/easy-mermaid/issues) · [English](./README.md)

[![CI](https://github.com/jiahui-qin/easy-mermaid/actions/workflows/deploy.yml/badge.svg)](https://github.com/jiahui-qin/easy-mermaid/actions/workflows/deploy.yml)
[![Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-3b82f6?logo=github)](https://jiahui-qin.github.io/easy-mermaid/)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-purple)](./src/i18n)

</div>

---

## 缘起

Mermaid 画出来的图**技术上正确，视觉上平庸**。GitHub 原生渲染只有一套主题、直角方框，标签一长就溢出。想解决只能手写 SVG。

**Easy Mermaid** 让 Mermaid 变成你真正愿意贴进 README、设计文档和幻灯片的图：

- **12 套精选预设** —— 从 Notion 卡片风到 Tokyo Night、Dracula、赛博朋克霓虹
- **放大不糊的矢量缩放** —— 缩放改的是 SVG 元素自身的尺寸，放到 800% 文字依然锐利
- **导出不翻车** —— PNG / JPG / SVG，多行标签按**视觉行**拆分，画布不被污染
- **链接即分享** —— 整张图压缩进 URL hash，无服务端、无数据库、无账号
- **纯静态部署** —— CI 工作流一键发布到 GitHub Pages

## ✨ 功能

| | 功能 | 说明 |
|---|---|---|
| 🎨 | **12 套风格预设** | 现代 · GitHub · 经典 · 暗色 · 手绘风 · 动漫风 · 赛博朋克 · Tokyo Night · Catppuccin · Nord · Dracula · Solarized Light |
| ✏️ | **实时编辑** | CodeMirror 6 + Mermaid 语法高亮，300ms 防抖渲染，错误行高亮 |
| 🖌️ | **真·手绘模式** | `look: 'handDrawn'` 用 rough.js 真抖动，不是换字体的假手绘 |
| 🎚️ | **全可配置** | ELK / Dagre · 连线样式 · 方向 · 间距 · 字体 · 配色 · 节点圆角 · 原始 `themeVariables` JSON |
| ✨ | **渲染后润色层** | 连线圆角、标签光晕、子图标题上色、节点微投影，对所有图统一生效 |
| 📐 | **子图自动对齐** | 独立子图用 mermaid `~~~` 隐形边串联，整齐分层 |
| 🔍 | **矢量缩放平移** | 滚轮以光标为锚点缩放（10%–800%）、拖拽平移、双击复位 |
| 🖼️ | **图片导出** | PNG（1x/2x/3x）· JPG · SVG，支持透明 / 白色 / 主题背景 |
| 🔗 | **分享链接** | state → deflate → base64url → `location.hash` |
| 🌐 | **国际化** | 默认英语 + 简体中文，语言选择存 `localStorage` |
| 🌗 | **界面明暗独立** | 界面明暗与图表明暗解耦，切预设不会改界面主题 |
| ⌨️ | **键盘快捷键** | 放大弹窗里 `+` / `-` / `0` / `Esc` |

## 🚀 快速开始

```bash
git clone https://github.com/jiahui-qin/easy-mermaid.git
cd easy-mermaid
npm install
npm run dev        # → http://localhost:5173
```

其它脚本：

```bash
npm run build      # 类型检查 + 生产构建 → dist/
npm run preview    # 本地预览构建产物
```

`dist/` 是**纯静态文件**，扔到任何静态托管上都能跑（GitHub Pages、Netlify、nginx，甚至直接双击 `index.html`）。

## 🏗️ 架构

```
                    ┌──────────────────────────────────────┐
  Mermaid 源码 →    │  injectInit    UiConfig → init 指令   │
                    │  autoAlign     孤立子图串联            │
                    │  renderMermaid  mermaid.render + 润色  │
                    └──────────────────┬───────────────────┘
                                       │  润色后的 SVG
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
   ┌─────────┐                  ┌───────────┐                 ┌───────────┐
   │ Preview │                  │ export    │                 │ shareUrl  │
   │ + Zoom  │                  │ PNG/JPG/  │                 │ pako +    │
   │ Viewer  │                  │ SVG       │                 │ base64url │
   └─────────┘                  └───────────┘                 └───────────┘
```

### 项目结构

```
src/
├── App.tsx                     # 顶层状态、modal 编排、i18n provider
├── main.tsx                    # 入口
├── types.ts                    # UiConfig / AppState / Preset 类型定义
├── defaultState.ts             # 默认示例图（本项目自身架构）+ 初始 state
├── theme.ts                    # re-export presets + applyTheme()
├── app.css                     # 全部样式（CSS 变量驱动明暗主题）
├── i18n/
│   ├── en.ts                   # 英文文案（key 树的唯一来源）
│   ├── zh-CN.ts                # 中文文案（key 集合必须与英文完全一致）
│   ├── types.ts                # Locale、TranslationKey（编译期校验的路径联合类型）
│   └── index.tsx               # I18nProvider + useI18n() + translate()
├── components/
│   ├── Editor.tsx              # CodeMirror 编辑器 + 错误行高亮（StateField + Decoration）
│   ├── Preview.tsx             # 防抖渲染 + 放大触发
│   ├── ZoomViewer.tsx          # 矢量缩放查看器（滚轮缩放、拖拽平移、双击复位）
│   ├── ZoomModal.tsx           # 点击放大 modal + 键盘快捷键
│   ├── ConfigPanel.tsx         # 预设卡片 → 常用表单 → 高级 JSON
│   ├── TopBar.tsx              # 分享链接 / 主题切换 / 语言切换 / 导出
│   └── ExportDialog.tsx        # 格式 / 分辨率 / 背景 / 文件名
└── core/
    ├── presets.ts              # 12 套预设定义（配色、字体、布局、extraThemeVariables）
    ├── injectInit.ts           # UiConfig → mermaid init 指令（base / default 两条路径）
    ├── renderMermaid.ts        # mermaid.render 封装 + 方向改写 + 润色层
    ├── autoAlign.ts            # 独立子图自动对齐（~~~ 隐形边）
    ├── configSchema.ts         # 表单字段 schema（驱动 ConfigPanel）
    ├── exportImage.ts          # SVG → PNG/JPG/SVG（foreignObject → tspan，画布去污染）
    └── shareUrl.ts             # 状态序列化（pako + base64url）
```

## 🎨 预设速查

每个预设的 `cfg` 是 `Partial<UiConfig>`，只覆盖需要改的字段。`extraThemeVariables` 会展开到 mermaid 的 `themeVariables` 末尾，覆盖内置派生值。

| 预设 | 底层主题 | 渲染器 | 曲线 | 节点底色 | 描边 | 连线 | 子图底 | 图表明暗 | 设计参考 |
|------|------|------|------|---------|------|------|--------|--------|---------|
| 现代（默认） | base | ELK | linear | `#eef4ff` | `#3b82f6` | `#b6c2d4` | `#ffffff` | light | Notion / Linear 卡片 |
| GitHub | base | Dagre | basis | `#ffffff` | `#d0d7de` | `#57606a` | `#f6f8fa` | light | GitHub Primer 灰阶 |
| 经典 | default | Dagre | basis | `#ECECFF` | `#9370DB` | `#333333` | `#ffffde` | light | Mermaid 原生默认保真 |
| 暗色 | base | ELK | linear | `#252526` | `#3c3c3c` | `#808080` | `#1e1e1e` | dark | VS Code Dark+ 灰阶 |
| 手绘风 | base | Dagre（handDrawn） | basis | `#fef9ef` | `#b5854e` | `#a9743f` | `#fff8e1` | light | Excalidraw 白板 |
| 动漫风 | base | Dagre | cardinal | `#ffeef4` | `#f48fb1` | `#e89cbe` | `#fdf3f8` | light | 樱花 / 少女漫 |
| 赛博朋克 | base | ELK | linear | `#0d0221` | `#00f5ff` | `#ff00aa` | `#190a3a` | dark | Blade Runner 2077 |
| Tokyo Night | base | ELK | linear | `#24283b` | `#7aa2f7` | `#3d59a1` | `#1a1b26` | dark | VS Code 流行暗色主题 |
| Catppuccin | base | Dagre | cardinal | `#313244` | `#cba6f7` | `#585b70` | `#1e1e2e` | dark | Mocha pastel 柔和暗色 |
| Nord | base | ELK | linear | `#3b4252` | `#88c0d0` | `#4c566a` | `#2e3440` | dark | 北欧极简冷蓝灰 |
| Dracula | base | Dagre | basis | `#44475a` | `#bd93f9` | `#6272a4` | `#282a36` | dark | 经典紫暗色主题 |
| Solarized Light | base | Dagre | basis | `#eee8d5` | `#268bd2` | `#93a1a1` | `#fdf6e3` | light | 经典浅色护眼色板 |

表中的「图表明暗」决定**图**的明暗（润色层光晕 + 导出默认背景），与**界面**明暗无关 —— 界面明暗是独立的本地偏好，切预设不影响它。

### `mermaidTheme` 两条路径

- **`base`**：`theme: 'base'` + 显式 `themeVariables`，完全自定义配色，所有颜色/字体字段生效。大部分预设走这条路。
- **`default`**：`theme: 'default'`，不传 `themeVariables`，让 mermaid 用内置完整色板（淡紫 `#ECECFF` 节点 + 淡黄 `#ffffde` 子图 + trebuchet 16px + radius 5）。经典预设用这条原汁原味保留 Mermaid 默认观感；注意此路径下颜色/字体配置字段**不生效**。

### 添加新预设

在 `src/core/presets.ts` 的 `presets` 数组追加一个对象，ConfigPanel 会自动渲染卡片：

```ts
{
  id: 'my-preset',
  nameKey: 'presets.my-preset.name',   // 文案加到 src/i18n/en.ts 和 zh-CN.ts
  descKey: 'presets.my-preset.desc',
  cfg: {
    preset: 'my-preset',
    mermaidTheme: 'base',
    renderer: 'elk',
    curve: 'linear',
    nodeSpacing: 45,
    rankSpacing: 60,
    padding: 16,
    fontSize: 14,
    fontFamily: FONT_STACK,
    primaryColor: '#eff6ff',
    primaryBorderColor: '#3b82f6',
    lineColor: '#94a3b8',
    clusterBkg: '#f8fafc',
    clusterLabelColor: '#64748b',
    svgCss: '.node rect{filter:drop-shadow(0 1px 3px rgba(15,23,42,.10)) !important;}',
    extraThemeVariables: {
      mainBkg: '#eff6ff',
      nodeBorder: '#3b82f6',
      edgeLabelBackground: '#ffffff',
      clusterBorder: '#cbd5e1',
      textColor: '#1e293b',
      primaryTextColor: '#1e3a5f',
    },
  },
}
```

## 🌍 国际化

文案集中在 `src/i18n/`。`en.ts` 是 key 树的**唯一来源**，`zh-CN.ts` 的类型标注为 `TranslationTree`，少一个 key 或多一个 key 编译期就报错。

```ts
// src/i18n/en.ts
export const en = {
  topbar: {
    currentPreset: 'Preset: {preset} · {engine}',
  },
};
```

```tsx
// 组件里用 hook
const { t, locale, setLocale } = useI18n();
t('topbar.currentPreset', { preset: 'GitHub', engine: 'ELK' });
```

- `TranslationKey` 是所有叶子路径的联合类型，写错路径是**编译错误**，而不是运行时拿到 `undefined`。
- 默认语言是**英语**；用户的选择存在 `localStorage` 的 `bm-locale` 键。
- `<html lang>` 同步更新，方便读屏软件和浏览器翻译。

新增语言：复制 `en.ts` 成 `<locale>.ts`，翻译文案，在 `types.ts` 的 `Locale` 里加一项，再在 `index.tsx` 注册词典即可。

## 🧩 实现细节

下面每一条都是**诊断 + 实测 + 修复**出来的，不是拍脑袋写的。

### 画布污染修复（exportImage.ts）

Mermaid v11 把所有 flowchart 标签放在 `<foreignObject>` 的 XHTML `<div>` 里。当 SVG 包含 foreignObject 被画到 canvas 上时，Chrome 会判定画布"被跨域数据污染"，`canvas.toBlob` 回调返回 `null`，PNG/JPG 导出静默失败。

`foreignObjectSvg()` 在光栅化前把所有 foreignObject 替换成等价的原生 `<text>` 节点。注意 `svg.outerHTML` 里的 HTML 标签（如 `<br>`）不一定自闭合，用 `DOMParser` 的 `'text/html'` 模式解析更稳，然后重建 standalone SVG 文档（加 `xmlns` + XML 声明）。

### 按视觉行导出（exportImage.ts）

拆行策略是**按视觉行**，而不只是按 `<br>`。

Mermaid 的 `htmlLabels` 用 `display: table-cell; white-space: nowrap; max-width: 200px` 渲染标签，长文本会被浏览器**自动换行** —— 自动换行不会在 DOM 里留下 `<br>`。只按 `<br>` 拆会把自动换行的多行塌成一行，导出后文字横向溢出节点框（旧默认示例图 15 个节点里 2 个中招，最多溢出 29px）。

正确做法用 `Range.getClientRects()` 量视觉行：

1. 遍历 `<p>` 里的文本节点，`range.selectNodeContents(node)` 后数 client rects —— 单个文本节点跨 N 行就有 N 个 rect；
2. 跨行文本节点用**二分**定位行边界：range 从 1 个 rect 变 2 个 rect 的位置就是换行点；
3. 同一视觉行的片段（`<br>` 前后、行内元素、emoji）按垂直中心合并（容差按字号放大，emoji 墨迹盒更高）；
4. 二分边界处不做代理对拆分，防止 emoji 被劈成两半。

其他导出细节：

- **每行 y 用真实行中心**：实时渲染的行矩形中心 ÷ 视口缩放换算成 viewBox 用户单位，不假设行高；`x` 取 foreignObject 水平中心。
- **文字色取每个标签的计算 `color`**：HTML span 上的 `fill` 是继承来的背景色（比如节点填充色 `#eff6ff`），拿来当文字色会让导出的文字几乎看不见。
- **必须中和 `classDef` 样式**：mermaid 会把 `classDef ui fill:#eef4ff,stroke:#3b82f6` 变成 `.ui span { fill:#eef4ff; stroke:#3b82f6; stroke-width:1.5px !important }`。屏幕上标签是 HTML `span`，`fill`/`stroke` 根本不渲染，看不出问题；但导出成原生 `<text>` 后，这些样式就变成了实打实的彩色填充 + 1.5px 描边 —— 导出的节点文字又粗又花，而屏幕上是深灰常规体。导出时用内联 `!important` 锁死文字色、清零描边。边标签是例外：它需要描边光晕才能看清，所以保留描边。
- **边标签加 `paint-order` 描边光晕**：流程图的边标签没有背景，导出的文字直接压在连线上。光晕的明暗按 SVG **自身背景色亮度**判断（`isDarkSvg` 解析 `.background{fill:...}`），而不是界面明暗 —— 界面亮 + 暗色图表预设时白底光晕会很难看。
- **空 label 容器必须 `remove()`**：无标签的边也会渲染一个空 span，残留任何 foreignObject 都会让 Chrome 把画布判为污染，`toBlob` 返回 null，导出静默失败。

### 矢量缩放查看器（ZoomViewer.tsx）

预览区与放大弹窗共用同一个组件：滚轮以光标为锚点缩放（10%–800%）、拖拽平移、双击复位。

**关键约束：不能用 CSS `transform: scale()` 缩放 SVG。**

transform 缩放的是**已经栅格化好的位图**。SVG 元素被容器压到 N px 宽时，浏览器按 N px 渲染出一张位图；之后 transform 只是把这张位图放大 —— 放大的是像素不是矢量，文字必然发虚。`will-change: transform` 还会把元素钉在合成层上按固定栅格比例缓存，糊得更明显。

实测（同一标签、同一最终视觉尺寸下量 Laplacian 方差，越大越锐）：

| 缩放方式 | Laplacian 方差 | 效果 |
|---|---|---|
| `transform: scale()` + `will-change` | 1133 | 完全糊成一片 |
| `transform: scale()` 去掉 `will-change` | 1580 | 仍偏糊 |
| **改 SVG 元素自身 width/height** | **2685** | 锐利，文字仍是矢量 |

所以本组件的做法是：**改 SVG 元素自身的 `width`/`height` 属性**（viewBox 保持不变），浏览器看到更大的元素尺寸就会按新尺寸重新排版重绘，文字、描边、滤镜全部重新以矢量渲染，放到 800% 依然锐利。平移只用 `translate`（纯位移不改变栅格化分辨率，不会引入模糊）。

其它细节：

- **铺满比例**：从 svg 字符串解析 `viewBox` 得自然尺寸，`fit = min(容器宽/自然宽, 容器高/自然高)` 即 contain；zoom=1 表示铺满，zoom=2 表示在铺满基础上再放大 2 倍。容器尺寸用 `ResizeObserver` 跟踪。
- **滚轮缩放**：原生 `addEventListener('wheel', h, { passive: false })` —— React 的 `onWheel` 是被动监听，`preventDefault` 无效会连带滚动外层页面。倍率按 `exp(-deltaY * 0.0015)` 指数变化。
- **以光标为锚点**：元素左上角在 `tx`，尺寸 `dispW = nw*fit*z`，viewBox 用户坐标 X 的屏幕位置是 `tx + X*fit*z`。锚点下的内容点 `X0 = (ax - tx0)/(fit*z0)`，缩放后要它仍在 `ax` 处：`tx1 = ax - (ax-tx0)*z1/z0`（fit 约掉）。
- **拖拽平移**：在 `window` 上挂 `pointermove`/`pointerup` 监听，**不要用 `setPointerCapture`** —— 指针捕获会把后续的 `click` 重定向到捕获元素，导致角标等子元素收不到自己的点击。位移超过 4px 才算拖拽。
- **单击 vs 双击**：单击打开放大模态与双击重置会互相打架（dblclick 的第一次 click 就会开模态），所以 click 延迟 220ms 触发，期间来了 dblclick 就取消它改为重置。右下角百分比角标点击同样重置。
- **纹理上限**：SVG 元素最大边长受浏览器纹理尺寸限制（`MAX_EDGE = 12000px`），倍率上限按此反推，避免超大倍率整块渲染成空白。

### 渲染后润色层（renderMermaid.ts）

`polishSvg()` 在 mermaid.render 之后往 SVG 里注入一段 `<style>` 并按需补圆角属性，不依赖具体预设、对所有图统一生效：

| 润色项 | 做法 | 解决的问题 |
|---|---|---|
| 连线圆角 | `.edgePath .path` 加 `stroke-linecap/linejoin: round` | ELK 正交折线转角生硬 |
| 边标签光晕 | `.edgeLabel p` 加同色系 `text-shadow` | 标签压在连线上时可读性差 |
| 子图标题上色 | `.cluster-label span` / `.cluster text` 按 `cfg.clusterLabelColor` 覆盖颜色（`!important`） | mermaid 把 cluster 标题硬编码 `#000000`，暗色主题下黑字深底不可读 |
| 预设级装饰 | 通用层之后追加 `cfg.svgCss` | 让每个预设有自己的签名质感（霓虹辉光 / 粉色柔光 / 卡片投影） |
| 节点/cluster 圆角 | 给无 `rx` 的 `basic label-container` 和 cluster 补 `rx` 属性 | 直角节点的"文档感"；用属性而非 CSS，保证导出光栅化也生效 |
| 节点微投影 | `.node > :is(...):not([filter])` 加极淡 `drop-shadow` | 把节点从纸面"托"起来；已有 filter 的元素跳过，避免覆盖 handDrawn 内置投影 |

注入的 `<style>` 和 shape 属性都会随 SVG 序列化保留，因此**导出 PNG/JPG 时润色同样生效**。

### 字体栈消毒（injectInit.ts）

mermaid 的 `%%{init}%%` 指令会消毒 themeVariables 的值：**只有 `/^[\d "#%(),.;A-Za-z]+$/` 内的字符能存活，其余一律清空成 `""`**。连字符 `-` 不在白名单里，于是 `sans-serif` / `monospace` / `system-ui` 这些 generic family 会让整条字体栈被静默清空、回落 mermaid 默认字体 —— 12 个预设里 10 个的字体栈以这些 family 结尾，全部中招（表现为"改了字体没反应"）。

`sanitizeFontStack()` 按逗号拆条、丢弃含白名单外字符的条目再注入；浏览器对缺失的 generic family 有隐式回退，视觉效果与显式写 `sans-serif` 基本一致。GitHub 字体栈里的 `-apple-system` 同理换成等价的 `BlinkMacSystemFont`。

### 自动对齐（autoAlign.ts）

当源码中有多个顶层 subgraph 且它们之间没有相互的边时，dagre/elk 会随机排列。`autoAlignSubgraphs()` 检测这种情况，在源码末尾追加 mermaid 的 `~~~` 隐形边把它们串成链 —— `~~~` 在布局层面建立从属关系但不绘制线条，不需要 `linkStyle` 索引隐藏，不会和用户已有的 `linkStyle` 声明冲突。

**切勿给这些 subgraph 追加 `style fill:none,stroke:none`**：mermaid 会把它转成 SVG 内联 `!important` 样式，把子图边框和背景一起清掉（子图分组视觉消失）。

### 分享链接（shareUrl.ts）

`AppState`（mermaid 源码 + 完整配置）→ `JSON.stringify` → `pako.deflate` → base64url → `location.hash`。反序列化用 `pako.inflate`。URL 形如 `https://host/#eJyF...`，App 初始化时从 `window.location.hash` 恢复状态。

### 错误行高亮（Editor.tsx）

用 CodeMirror 的 `StateField` + `StateEffect` + `Decoration.line` 实现。`Preview` 渲染出错时把 `errorLine` 经 `App` 传给 `Editor`，Editor dispatch 一个 `setErrorLineEffect`，StateField 更新行装饰，给错误行加 `.cm-error-line` CSS class（红色背景 + 左边框）。

## 🔧 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 18 + TypeScript 5.6 + Vite 5 |
| 编辑器 | CodeMirror 6（`@codemirror/*`） |
| 图表 | mermaid 11 + `@mermaid-js/layout-elk`（ELK 懒加载） |
| 压缩 | pako（分享链接 deflate/inflate） |
| 国际化 | 手写类型安全词典（零运行时依赖） |

## 🚢 部署

仓库自带 GitHub Actions 工作流 `.github/workflows/deploy.yml`：

- **CI job** —— `npm ci` → `tsc -b` → `vite build`，每次 push 和 PR 都跑
- **Pages job** —— 把 `dist/` 作为 Pages artifact 上传并部署（`main` 分支触发）

在自己的 fork 上启用：

1. **Settings → Pages → Build and deployment → Source**：选 **GitHub Actions**
2. 推送到 `main` —— 工作流会发布到 `https://<user>.github.io/easy-mermaid/`

Vite 的 `base` 路径由 `BASE_PATH` 环境变量注入，所以部署在子路径下的项目 Pages 开箱即用。

手动构建部署到其它托管：

```bash
npm run build
# 把 dist/ 传到你的静态服务器
```

## 🤝 参与贡献

欢迎贡献！

1. Fork 仓库并建分支（`git checkout -b feature/my-change`）
2. 改代码 —— 保证 `npm run build` 通过（它会做类型检查）
3. **同时**更新 `src/i18n/en.ts` 和 `src/i18n/zh-CN.ts` 里的文案
4. 提 PR，说明改了什么、为什么改

加预设或加语言是最容易上手的贡献方式 —— 两者都是纯数据驱动的（见[添加新预设](#添加新预设)和[国际化](#-国际化)）。

## 📄 许可

[MIT](./LICENSE) © Easy Mermaid contributors

## 🙏 致谢

设计与配色思路参考了以下优秀项目（均为 MIT 或同类宽松许可）：

- **[beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid)**（11.2k ★）—— 5 套编辑器主题预设的色板来源
- **[modern_mermaid](https://github.com/gotoailab/modern_mermaid)**（464 ★）—— 定位最接近的同类产品，编辑器交互的参考
- **[Pretty-mermaid-skills](https://github.com/imxv/Pretty-mermaid-skills)**（1.5k ★）—— 把 Mermaid 渲染做成 AI Agent Skill
- **[mermaid-live-editor](https://github.com/mermaid-js/mermaid-live-editor)**（6.8k ★，官方）—— "编辑-预览-分享链接"产品形态的鼻祖
- **[mermaid-to-excalidraw](https://github.com/excalidraw/mermaid-to-excalidraw)**（904 ★）—— Mermaid → Excalidraw 转换
- **[mermaid-ascii](https://github.com/AlexanderGrooff/mermaid-ascii)**（1.6k ★）—— 终端 ASCII 渲染

感谢以上项目的作者们。

## ⚠️ 已知限制

- 构建时 mermaid chunk 超过 2MB（mermaid 自身体积），纯静态部署不受影响，`manualChunks` 保证首屏可接受
- ELK 通过 dynamic import 懒加载，首次切换到 ELK 预设有短暂延迟
- 分享链接 URL 较长（deflate 后约 1-2KB base64url），但对浏览器 URL 长度限制无压力

<div align="center">

<sub>用 🍜 和无数次试错做出来的。</sub>

</div>
