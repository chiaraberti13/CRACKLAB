import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'analyze'
      ? [
          visualizer({
            filename: 'dist/bundle-report.html',
            template: 'treemap',
            gzipSize: true,
            brotliSize: true,
            open: false
          })
        ]
      : [])
  ],
  build: {
    // The performance gate resolves the entry and lazy-route chunks from stable
    // source keys in the manifest, never from the volatile content hashes in file names.
    manifest: true
  },
  // The real hash/KDF cost demo (hash-wasm) runs in a Web Worker so the main
  // thread stays responsive; ES worker format keeps the dev/build output aligned.
  worker: {
    format: 'es'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}));
