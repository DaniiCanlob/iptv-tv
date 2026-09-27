import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // hls.js lives in the lazily loaded player chunk; its size is expected.
  build: { chunkSizeWarningLimit: 700 },
});
