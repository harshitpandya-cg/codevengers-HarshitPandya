import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Polyfill specific Node.js built-ins needed by simple-peer
      include: ['events', 'util', 'process', 'buffer'],
      globals: {
        global: true,
        process: true,
        Buffer: true,
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
});
