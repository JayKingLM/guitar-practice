import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// alphaTab ships worker + soundfont + fonts as assets. We keep them out of
// dependency pre-bundling so the worker/audio-worklet URLs resolve correctly.
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@coderline/alphatab'],
  },
  worker: {
    format: 'es',
  },
  build: {
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks: {
          alphatab: ['@coderline/alphatab'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
