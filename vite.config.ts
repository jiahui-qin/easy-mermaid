import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages 的项目站点部署在 `/<repo>/` 子路径下，资源必须带上这个前缀。
 * 本地开发和自托管用 `/`（默认值）。
 *
 * CI 里通过环境变量注入：
 *   BASE_PATH=/easy-mermaid/ npm run build
 */
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mermaid-js/layout-elk') || id.includes('elkjs')) return 'elk';
            if (id.includes('mermaid')) return 'mermaid';
            if (id.includes('codemirror') || id.includes('@codemirror')) return 'codemirror';
          }
        },
      },
    },
  },
});
