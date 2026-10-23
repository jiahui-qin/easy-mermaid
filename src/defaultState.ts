import { defaultUiConfig } from './theme';

/**
 * 默认示例图：Beauty Mermaid 自身的架构与数据流。
 *
 * 选它作为默认内容有三个原因：
 * 1. 用户打开工具就能立刻看懂它在做什么，而不是一张无关的业务图；
 * 2. 图里覆盖了 subgraph / 虚线边 / 节点多行标签 / classDef，正好演示工具能力；
 * 3. 它本身就是一张"自解释文档"，随项目演进一起更新。
 */
export const SAMPLE = `flowchart TB
    subgraph UI["UI Layer · src/components"]
        Editor["Editor.tsx<br/>CodeMirror 6<br/>mermaid syntax highlight"]
        Preview["Preview.tsx<br/>300ms debounce<br/>live re-render"]
        Config["ConfigPanel.tsx<br/>12 presets + form"]
        TopBar["TopBar.tsx<br/>share · theme · lang"]
        Export["ExportDialog.tsx<br/>PNG / JPG / SVG"]
        Zoom["ZoomModal + ZoomViewer<br/>wheel zoom · drag pan"]
    end

    subgraph CORE["Core Layer · src/core"]
        Init["injectInit.ts<br/>UiConfig → init directive"]
        Align["autoAlign.ts<br/>orphan subgraph align"]
        Render["renderMermaid.ts<br/>mermaid.render<br/>+ polishSvg()"]
        Presets["presets.ts<br/>12 style presets"]
        Schema["configSchema.ts<br/>form field schema"]
        Img["exportImage.ts<br/>foreignObject → text"]
        Share["shareUrl.ts<br/>pako + base64url"]
    end

    subgraph OUT["Output"]
        Svg["Polished SVG"]
        Png["PNG / JPG @1-3x"]
        Link["Shareable URL #hash"]
    end

    Editor -->|"mermaid source"| Init
    Config -->|"UiConfig"| Init
    Presets -->|"theme + svgCss"| Config
    Schema -->|"field schema"| Config
    Init --> Align --> Render
    Render -->|"polished svg"| Preview
    Render --> Img
    Render --> Share
    Img --> Png
    Share --> Link
    TopBar -.->|"open modal"| Export
    TopBar -.->|"open modal"| Zoom
    Preview -.->|"click to zoom"| Zoom

    classDef ui fill:#eef4ff,stroke:#3b82f6,stroke-width:1.5px
    classDef core fill:#f5f3ff,stroke:#8b5cf6,stroke-width:1.5px
    classDef out fill:#ecfdf5,stroke:#10b981,stroke-width:1.5px

    class Editor,Preview,Config,TopBar,Export,Zoom ui
    class Init,Align,Render,Presets,Schema,Img,Share core
    class Svg,Png,Link out
`;

export const DEFAULT_CODE = SAMPLE;

export const defaultState = {
  code: DEFAULT_CODE,
  cfg: defaultUiConfig,
};
