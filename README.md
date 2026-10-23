<div align="center">

# 🎨 Easy Mermaid

**A browser-based Mermaid beautifier — 12 presets, vector zoom, PNG/JPG/SVG export, shareable links, and zero backend.**

[Live Demo](https://jiahui-qin.github.io/easy-mermaid/) · [Report Issues](https://github.com/jiahui-qin/easy-mermaid/issues) · [中文文档](./README.zh-CN.md)

[![CI](https://github.com/jiahui-qin/easy-mermaid/actions/workflows/deploy.yml/badge.svg)](https://github.com/jiahui-qin/easy-mermaid/actions/workflows/deploy.yml)
[![Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-3b82f6?logo=github)](https://jiahui-qin.github.io/easy-mermaid/)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![i18n](https://img.shields.io/badge/i18n-en%20%7C%20%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-purple)](./src/i18n)

</div>

---

## Why

Mermaid renders diagrams that are *technically* correct but *visually* mediocre. GitHub-flavored Mermaid gives you one theme, square boxes, and text that overflows when a label is long. Fixing that usually means hand-writing SVG.

**Easy Mermaid** turns Mermaid into something you actually want to paste into a README, a design doc, or a slide deck:

- **12 curated presets** — from Notion-style cards to Tokyo Night, Dracula, and Cyberpunk neon
- **Vector zoom that stays sharp** — zoom changes the SVG element's own size, so text renders crisply at 800%
- **Export without surprises** — PNG / JPG / SVG, multi-line labels split by *visual* line, no canvas tainting
- **Share via URL** — the whole diagram is compressed into the hash; no server, no database, no account
- **Fully static** — deploys to GitHub Pages in one click from a CI workflow

## ✨ Features

| | Feature | Notes |
|---|---|---|
| 🎨 | **12 style presets** | Modern · GitHub · Classic · Dark · Sketch · Anime · Cyberpunk · Tokyo Night · Catppuccin · Nord · Dracula · Solarized Light |
| ✏️ | **Live editing** | CodeMirror 6 with Mermaid syntax highlighting, 300 ms debounce, error-line highlighting |
| 🖌️ | **True hand-drawn mode** | `look: 'handDrawn'` — real rough.js jitter, not a cursive font pretending |
| 🎚️ | **Fully configurable** | ELK / Dagre · edge style · direction · spacing · fonts · colors · corner radius · raw `themeVariables` JSON |
| ✨ | **Post-render polish layer** | Rounded edge joins, label halos, recolored subgraph titles, node micro-shadows — applied to every diagram |
| 📐 | **Auto-align subgraphs** | Orphan subgraphs get chained with invisible `~~~` edges so they stack neatly |
| 🔍 | **Vector zoom & pan** | Wheel zoom anchored at the cursor (10 %–800 %), drag to pan, double-click to reset |
| 🖼️ | **Image export** | PNG (1×/2×/3×) · JPG · SVG, with transparent / white / theme background |
| 🔗 | **Shareable links** | State → deflate → base64url → `location.hash` |
| 🌐 | **i18n** | English (default) and Simplified Chinese, persisted in `localStorage` |
| 🌗 | **Independent UI theme** | The interface light/dark switch is decoupled from the diagram theme |
| ⌨️ | **Keyboard shortcuts** | `+` / `-` / `0` / `Esc` in the zoom modal |

## 🚀 Quick Start

```bash
git clone https://github.com/jiahui-qin/easy-mermaid.git
cd easy-mermaid
npm install
npm run dev        # → http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
```

The output in `dist/` is **pure static files** — drop them on any static host (GitHub Pages, Netlify, nginx, or even `file://`).

## 🏗️ Architecture

```
                    ┌──────────────────────────────────────┐
  Mermaid source →  │  injectInit   UiConfig → init directive│
                    │  autoAlign    orphan subgraph chaining │
                    │  renderMermaid  mermaid.render + polish│
                    └──────────────────┬───────────────────┘
                                       │  polished SVG
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
   ┌─────────┐                  ┌───────────┐                 ┌───────────┐
   │ Preview │                  │ export    │                 │ shareUrl  │
   │ + Zoom  │                  │ PNG/JPG/  │                 │ pako +    │
   │ Viewer  │                  │ SVG       │                 │ base64url │
   └─────────┘                  └───────────┘                 └───────────┘
```

### Project layout

```
src/
├── App.tsx                     # Top-level state, modal orchestration, i18n provider
├── main.tsx                    # Entry point
├── types.ts                    # UiConfig / AppState / Preset type definitions
├── defaultState.ts             # Default diagram (this project's own architecture) + initial state
├── theme.ts                    # Re-exports presets + applyTheme()
├── app.css                     # All styles (CSS variables drive the light/dark themes)
├── i18n/
│   ├── en.ts                   # English copy (source of truth for the key tree)
│   ├── zh-CN.ts                # Simplified Chinese copy (key set must match exactly)
│   ├── types.ts                # Locale, TranslationKey (compile-time checked key paths)
│   └── index.tsx               # I18nProvider + useI18n() + translate()
├── components/
│   ├── Editor.tsx              # CodeMirror editor + error-line highlight (StateField + Decoration)
│   ├── Preview.tsx             # Debounced render + zoom trigger
│   ├── ZoomViewer.tsx          # Vector zoom viewer (wheel zoom, drag pan, double-click reset)
│   ├── ZoomModal.tsx           # Click-to-enlarge modal + keyboard shortcuts
│   ├── ConfigPanel.tsx         # Preset cards → common form → advanced JSON
│   ├── TopBar.tsx              # Share link / theme toggle / language switcher / export
│   └── ExportDialog.tsx        # Format / resolution / background / filename
└── core/
    ├── presets.ts              # 12 preset definitions (colors, fonts, layout, extraThemeVariables)
    ├── injectInit.ts           # UiConfig → mermaid init directive (base / default paths)
    ├── renderMermaid.ts        # mermaid.render wrapper + direction rewrite + polish layer
    ├── autoAlign.ts            # Standalone subgraph auto-alignment (~~~ invisible edges)
    ├── configSchema.ts         # Form field schema (drives ConfigPanel)
    ├── exportImage.ts          # SVG → PNG/JPG/SVG (foreignObject → tspan, canvas de-tainting)
    └── shareUrl.ts             # State serialization (pako + base64url)
```

## 🎨 Presets

Each preset's `cfg` is a `Partial<UiConfig>` that only overrides what it needs. `extraThemeVariables` is merged into Mermaid's `themeVariables` and wins over the built-in derived values.

| Preset | Theme | Renderer | Edge style | Node fill | Stroke | Edge | Subgraph | Chart theme | Reference |
|---|---|---|---|---|---|---|---|---|---|
| Modern *(default)* | base | ELK | orthogonal | `#eef4ff` | `#3b82f6` | `#b6c2d4` | `#ffffff` | light | Notion / Linear cards |
| GitHub | base | Dagre | bezier | `#ffffff` | `#d0d7de` | `#57606a` | `#f6f8fa` | light | GitHub Primer greyscale |
| Classic | default | Dagre | bezier | `#ECECFF` | `#9370DB` | `#333333` | `#ffffde` | light | Native Mermaid default |
| Dark | base | ELK | orthogonal | `#252526` | `#3c3c3c` | `#808080` | `#1e1e1e` | dark | VS Code Dark+ |
| Sketch | base | Dagre *(handDrawn)* | bezier | `#fef9ef` | `#b5854e` | `#a9743f` | `#fff8e1` | light | Excalidraw whiteboard |
| Anime | base | Dagre | cardinal | `#ffeef4` | `#f48fb1` | `#e89cbe` | `#fdf3f8` | light | Sakura / shōjo |
| Cyberpunk | base | ELK | orthogonal | `#0d0221` | `#00f5ff` | `#ff00aa` | `#190a3a` | dark | Blade Runner 2077 |
| Tokyo Night | base | ELK | orthogonal | `#24283b` | `#7aa2f7` | `#3d59a1` | `#1a1b26` | dark | Popular VS Code theme |
| Catppuccin | base | Dagre | cardinal | `#313244` | `#cba6f7` | `#585b70` | `#1e1e2e` | dark | Mocha pastel |
| Nord | base | ELK | orthogonal | `#3b4252` | `#88c0d0` | `#4c566a` | `#2e3440` | dark | Nordic minimal |
| Dracula | base | Dagre | bezier | `#44475a` | `#bd93f9` | `#6272a4` | `#282a36` | dark | Classic purple dark theme |
| Solarized Light | base | Dagre | bezier | `#eee8d5` | `#268bd2` | `#93a1a1` | `#fdf6e3` | light | Classic light palette |

The "Chart theme" column is the **diagram's** light/dark mode (it drives the polish-layer halos and the export background). The **interface** light/dark switch is an independent local preference — switching presets never changes it.

### The two `mermaidTheme` paths

- **`base`** — `theme: 'base'` with explicit `themeVariables`. Every color and font field applies. Most presets use this path.
- **`default`** — `theme: 'default'` with no `themeVariables`, so Mermaid uses its built-in palette (lilac `#ECECFF` nodes, buttery `#ffffde` subgraphs, trebuchet 16 px, radius 5). The Classic preset uses this to stay pixel-faithful to upstream Mermaid. Color and font fields have **no effect** on this path.

### Adding a preset

Append an object to the `presets` array in `src/core/presets.ts` — ConfigPanel renders the card automatically:

```ts
{
  id: 'my-preset',
  nameKey: 'presets.my-preset.name',   // add the copy to src/i18n/en.ts and zh-CN.ts
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

## 🌍 i18n

Copy lives in `src/i18n/`. `en.ts` is the **source of truth** for the key tree; `zh-CN.ts` is typed as `TranslationTree`, so the compiler rejects a missing or extra key.

```ts
// src/i18n/en.ts
export const en = {
  topbar: {
    currentPreset: 'Preset: {preset} · {engine}',
  },
};
```

```tsx
// components use the hook
const { t, locale, setLocale } = useI18n();
t('topbar.currentPreset', { preset: 'GitHub', engine: 'ELK' });
```

- `TranslationKey` is a union of every leaf path, so a typo is a **compile error**, not a runtime `undefined`.
- The default locale is **English**; the choice is persisted in `localStorage` under `bm-locale`.
- `<html lang>` is kept in sync for screen readers and browser translation.

To add a language: copy `en.ts` to `<locale>.ts`, translate the strings, add the locale to `Locale` in `types.ts`, and register the dictionary in `index.tsx`.

## 🧩 Implementation Notes

The interesting parts are documented in detail below — each one is a bug that was diagnosed, measured, and fixed rather than guessed at.

### Canvas tainting fix (`exportImage.ts`)

Mermaid v11 renders every flowchart label inside a `<foreignObject>` XHTML `<div>`. When an SVG containing a `foreignObject` is drawn onto a canvas, Chrome marks the canvas as tainted and `canvas.toBlob` returns `null` — PNG/JPG export fails silently.

`foreignObjectSvg()` replaces every `foreignObject` with an equivalent native `<text>` node before rasterizing. Because `svg.outerHTML` may contain unclosed HTML tags such as `<br>`, the markup is parsed with `DOMParser` in `'text/html'` mode and a standalone SVG document is rebuilt (with `xmlns` and an XML declaration).

### Exporting by visual line (`exportImage.ts`)

The line-splitting strategy is **visual lines**, not just `<br>`.

Mermaid's `htmlLabels` uses `display: table-cell; white-space: nowrap; max-width: 200px`, so long labels are **wrapped by the browser** — and automatic wrapping leaves no `<br>` in the DOM. Splitting on `<br>` alone collapses wrapped lines into one, and the exported text overflows the node box (2 of 15 nodes in the old default diagram, up to 29 px).

The correct approach measures visual lines with `Range.getClientRects()`:

1. Walk the text nodes inside `<p>` and count client rects — a text node spanning N lines yields N rects.
2. For nodes spanning multiple lines, **binary-search** the line boundary: the offset where the rect count goes from 1 to 2.
3. Merge fragments belonging to the same visual line by vertical center (the tolerance scales with font size, since emoji ink boxes are taller).
4. Never split a surrogate pair at the binary-search boundary, so emoji stay intact.

Other export details:

- **Each line's `y` is its real line center** — the live rect center divided by the viewport scale, converted to viewBox units. No row-height assumptions.
- **Text color comes from each label's computed `color`** — the `fill` inherited on an HTML span is the *background* color (e.g. `#eff6ff`), which would make exported text nearly invisible.
- **`classDef` styles must be neutralized.** Mermaid turns `classDef ui fill:#eef4ff,stroke:#3b82f6` into a rule like `.ui span { fill:#eef4ff; stroke:#3b82f6; stroke-width:1.5px !important }`. On screen the label is an HTML `span`, where `fill`/`stroke` never render, so nothing looks wrong. But once the `foreignObject` becomes a native `<text>`, those styles turn into a real colored fill plus a 1.5 px stroke — the exported labels come out bold and garish while the live render stays dark grey. The exporter therefore pins the label color and zeroes the stroke with inline `!important` styles. Edge labels are the exception: they *need* a stroke for legibility, so they keep a halo.
- **Edge labels get a `paint-order: stroke` halo** — flowchart edge labels have no background, so exported text sits directly on the line. Halo lightness is decided from the **SVG's own background brightness** (`isDarkSvg` parses `.background{fill:...}`), not the interface theme — a white halo on a dark diagram preset would look terrible.
- **Empty label containers must be `remove()`d** — edges without labels still render an empty span, and *any* leftover `foreignObject` taints the canvas.

### Vector zoom viewer (`ZoomViewer.tsx`)

The preview and the zoom modal share one component: wheel zoom anchored at the cursor (10 %–800 %), drag to pan, double-click to reset.

**The key constraint: you cannot use CSS `transform: scale()` to zoom an SVG.**

`transform` scales an **already-rasterized bitmap**. When the SVG element is squeezed into an N-px-wide box, the browser rasterizes it at N px; the transform then stretches that bitmap — you are scaling pixels, not vectors, so text inevitably blurs. `will-change: transform` pins the element to a compositor layer with a fixed raster ratio and makes it worse.

Measured with the Laplacian variance of a single label at an identical final visual size (higher = sharper):

| Zoom method | Laplacian variance | Result |
|---|---|---|
| `transform: scale()` + `will-change` | 1133 | Completely blurred |
| `transform: scale()` without `will-change` | 1580 | Still soft |
| **Resize the SVG element's own `width`/`height`** | **2685** | Crisp — text is still vector |

So this component changes the **SVG element's own `width`/`height` attributes** (the `viewBox` is untouched). The browser sees a larger element and re-lays-out and re-renders everything as vectors — sharp even at 800 %. Panning uses `translate` only (a pure displacement never changes the raster resolution).

Other details:

- **Fit ratio** — the natural size is parsed from the `viewBox`; `fit = min(containerW / naturalW, containerH / naturalH)` is the contain scale. Zoom 1 means "fill the container", zoom 2 doubles that. A `ResizeObserver` keeps it in sync with the window.
- **Wheel zoom** — native `addEventListener('wheel', h, { passive: false })`. React's `onWheel` is passive, so `preventDefault` is a no-op and the page scrolls underneath.
- **Cursor-anchored zoom** — with the element's top-left at `tx` and size `dispW = nw * fit * z`, viewBox coordinate `X` sits at `tx + X * fit * z` on screen. The content point under the anchor is `X0 = (ax - tx0) / (fit * z0)`; to keep it under the anchor after zooming, `tx1 = ax - (ax - tx0) * z1 / z0` (the `fit` cancels out).
- **Drag to pan** — listeners live on `window`, **not** `setPointerCapture`: pointer capture *redirects* the subsequent `click` to the capturing element, so child elements such as the zoom badge never receive their own click. Movement beyond 4 px counts as a drag; a dragged sequence does not count as a click.
- **Single click vs. double click** — opening the modal on click fights the double-click reset (the first click of a double click opens the modal, and the backdrop swallows the rest). So the click is delayed by 220 ms and cancelled if a `dblclick` arrives. Clicking the zoom badge in the corner also resets.
- **Texture limit** — the maximum edge length of an SVG element is bounded by the browser's texture size (`MAX_EDGE = 12000 px`), so the zoom ceiling is derived from it to avoid rendering a blank block.

### Post-render polish layer (`renderMermaid.ts`)

`polishSvg()` injects a `<style>` block and adds corner-radius attributes after `mermaid.render`, independent of any preset:

| Polish | How | Problem it solves |
|---|---|---|
| Rounded edge joins | `stroke-linecap` / `stroke-linejoin: round` on `.edgePath .path` | ELK's orthogonal edges have harsh corners |
| Edge label halo | Same-hue `text-shadow` on `.edgeLabel p` | Labels sitting on top of a line are hard to read |
| Subgraph title color | Override `.cluster-label span` / `.cluster text` with `cfg.clusterLabelColor` (`!important`) | Mermaid hardcodes cluster titles to `#000000` — black on a dark background is unreadable |
| Preset decoration | `cfg.svgCss` appended after the generic layer | Each preset gets its own signature (neon glow, soft shadow, card depth) |
| Node / cluster radius | Add `rx` to `basic label-container` rects and cluster rects when `cfg.radius > 0` | Square nodes look like documentation; attributes (not CSS) so rasterized exports match |
| Node micro-shadow | A barely-there `drop-shadow` on `.node > :is(...)` | Lifts nodes off the page — elements that already have a `filter` are skipped so the hand-drawn preset keeps its built-in shadow |

Injected `<style>` and shape attributes survive SVG serialization, so **the polish also applies to exported PNG/JPG**.

### Font-stack sanitization (`injectInit.ts`)

Mermaid sanitizes `themeVariables` in its `%%{init}%%` directive: **only characters matching `/^[\d "#%(),.;A-Za-z]+$/` survive**; everything else is silently cleared to `""`. The hyphen is *not* in that whitelist, so `sans-serif` / `monospace` / `system-ui` cause the entire font stack to be wiped and Mermaid falls back to its default font. 10 of the 12 presets ended their font stack with one of those generic families — all silently broken ("I changed the font and nothing happened").

`sanitizeFontStack()` splits the stack on commas, drops entries containing characters outside the whitelist, then injects the rest. Browsers implicitly fall back for missing generic families, so the visual result matches writing `sans-serif` explicitly. `-apple-system` in the GitHub stack is replaced by the equivalent `BlinkMacSystemFont`.

### Auto-alignment (`autoAlign.ts`)

When the source has several top-level subgraphs with no edges between them, dagre/ELK arranges them arbitrarily. `autoAlignSubgraphs()` detects this and appends Mermaid's `~~~` invisible edges to chain them together — `~~~` establishes a layout relationship without drawing a line, so no `linkStyle` index juggling is needed and it can't conflict with the user's own `linkStyle` declarations.

**Never append `style fill:none,stroke:none` to these subgraphs**: Mermaid turns that into an inline `!important` style that wipes the subgraph border *and* background, making the grouping disappear.

### Share links (`shareUrl.ts`)

`AppState` (Mermaid source + full config) → `JSON.stringify` → `pako.deflate` → base64url → `location.hash`. Deserialization uses `pako.inflate`. The URL looks like `https://host/#eJyF…`, and the app restores the state on load.

### Error-line highlighting (`Editor.tsx`)

Implemented with CodeMirror's `StateField` + `StateEffect` + `Decoration.line`. When a render fails, `Preview` passes `errorLine` up through `App`; the Editor dispatches a `setErrorLineEffect`, the field updates the line decoration, and the offending line gets the `.cm-error-line` class (red background + left border).

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5.6 + Vite 5 |
| Editor | CodeMirror 6 (`@codemirror/*`) |
| Diagrams | Mermaid 11 + `@mermaid-js/layout-elk` (ELK lazy-loaded) |
| Compression | pako (share-link deflate/inflate) |
| i18n | Hand-rolled typed dictionary (no runtime dependency) |

## 🚢 Deployment

The repository ships a GitHub Actions workflow at `.github/workflows/deploy.yml`:

- **CI job** — `npm ci` → `tsc -b` → `vite build` on every push and pull request
- **Pages job** — uploads `dist/` as a Pages artifact and deploys it (on `main`)

To enable it on your fork:

1. **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**
2. Push to `main` — the workflow publishes to `https://<user>.github.io/easy-mermaid/`

The Vite `base` path is injected from the `BASE_PATH` environment variable, so project Pages under a sub-path work out of the box.

Manual build for any other host:

```bash
npm run build
# copy dist/ to your static host
```

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo and create a branch (`git checkout -b feature/my-change`)
2. Make your change — keep `npm run build` green (it type-checks)
3. Add or update the copy in **both** `src/i18n/en.ts` and `src/i18n/zh-CN.ts`
4. Open a Pull Request describing what changed and why

Adding a preset or a language is the easiest way to contribute — both are data-driven (see [Adding a preset](#adding-a-preset) and [i18n](#-i18n)).

## 📄 License

[MIT](./LICENSE) © Easy Mermaid contributors

## 🙏 Acknowledgements

Design ideas and palettes were inspired by these excellent projects (all MIT or similarly permissive):

- **[beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid)** (11.2k ★) — the color system behind the five editor-theme presets
- **[modern_mermaid](https://github.com/gotoailab/modern_mermaid)** (464 ★) — the closest product peer; a reference for the editor UX
- **[Pretty-mermaid-skills](https://github.com/imxv/Pretty-mermaid-skills)** (1.5k ★) — Mermaid rendering as an AI Agent Skill
- **[mermaid-live-editor](https://github.com/mermaid-js/mermaid-live-editor)** (6.8k ★, official) — the origin of the "edit → preview → share link" product shape
- **[mermaid-to-excalidraw](https://github.com/excalidraw/mermaid-to-excalidraw)** (904 ★) — Mermaid → Excalidraw conversion
- **[mermaid-ascii](https://github.com/AlexanderGrooff/mermaid-ascii)** (1.6k ★) — terminal ASCII rendering

Thanks to all of them.

## ⚠️ Known Limitations

- The Mermaid chunk exceeds 2 MB in the production build (Mermaid's own size). Pure static hosting is unaffected; `manualChunks` keeps the initial load reasonable.
- ELK is loaded via `dynamic import`, so the first switch to an ELK preset has a brief delay.
- Share URLs are long (roughly 1–2 KB of base64url after deflate) — well within browser URL limits.

<div align="center">

<sub>Made with 🍜 and a lot of trial and error.</sub>

</div>
