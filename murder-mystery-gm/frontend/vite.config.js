import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
<<<<<<< HEAD
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
=======
  plugins: [react()],
>>>>>>> 0b6d1fa (working)
  server: {
    port: 5173,
  },
});
